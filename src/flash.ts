import {
  createElementByString, genRandomID, getAbsoluteURL, canPlayTypeByFlash,
  isRtmp
} from "./utils";
import {
  FlashBuffer, FlashTimeRanges, MediaErrorCode, NetworkState, Option, PlayerError, PlayerEvent,
  ReadyState, SourceOption
} from "./model";
import {FlashElement, VideoElement} from "./interface";

const styles = require('./player.scss');

const parseRtmpSrc = (src: string): string[] => {
  if (!src) {
    return [];
  }

  let connEnd = src.search(/&(?!\w+=)/);
  let streamBegin;

  if (connEnd !== -1) {
    streamBegin = connEnd + 1;
  } else {
    connEnd = streamBegin = src.lastIndexOf('/') + 1;
    if (connEnd === 0) {
      connEnd = streamBegin = src.length;
    }
  }

  const connection = src.substring(0, connEnd);
  const stream = src.substring(streamBegin, src.length);

  return [connection, stream];
}

const getFlashTemplate = (swf: string, flashVars: any, params: any, attributes: any) => {
  const objTag = '<object type="application/x-shockwave-flash" ';
  let flashVarsString = '';
  let paramsString = '';
  let attrsString = '';
  if (flashVars) {
    Object.getOwnPropertyNames(flashVars).forEach(function (key) {
      flashVarsString += `${key}=${flashVars[key]}&amp;`;
    });
  }
  params = Object.assign({
    movie: swf,
    flashvars: flashVarsString,
    allowScriptAccess: 'always',
    allowNetworking: 'all'
  }, params);
  Object.getOwnPropertyNames(params).forEach(function (key) {
    paramsString += `<param name="${key}" value="${params[key]}" />`;
  });

  attributes = Object.assign({
    data: swf,
    width: '100%',
    height: '100%'

  }, attributes);
  Object.getOwnPropertyNames(attributes).forEach(function (key) {
    attrsString += `${key}="${attributes[key]}" `;
  });

  return `${objTag}${attrsString}>${paramsString}</object>`;
};

export class FlashVideo implements VideoElement {
  el: FlashElement;
  error: PlayerError;
  private opt: Option;
  private lastSeekTarget = -1;
  private isReady = false;
  private sourceBeforeReady: SourceOption;
  private readyResolver: (() => void)[] = [];
  private listenerGroup: {[key: string]: ((e: any) => void)[]} = {};
  private timeupdateTimer: any;

  static onReady(swfID: string) {
    const el = document.getElementById(swfID) as FlashElement;
    const instance = el && el.instance;

    // and the tech element was removed from the player div
    if (instance && instance.el && instance.el.vjs_getProperty) {
      setTimeout(function () {instance.handleReady()}, 1000);
    } else {
      setTimeout(() => instance.handleReady(), 1000); // recheck in one second
    }
  }

  static onEvent(swfID: string, eventName: string, ...args: any[]) {
    const el = document.getElementById(swfID) as FlashElement;
    const instance = el && el.instance;

    // dispatch FlashVideo events asynchronously for two reasons:
    // - FlashVideo swallows any exceptions generated by javascript it
    //   invokes
    // - FlashVideo is suspended until the javascript returns which may cause
    //   playback performance issues
    setTimeout(function () {
      instance.handleEvent(eventName, args);
    });
  }

  static onError(swfID: string, err: any) {
    const el = document.getElementById(swfID) as FlashElement;
    const instance = el && el.instance;

    instance.handleError(err);
  }

  static canPlayType(type: string): string {
    return canPlayTypeByFlash(type);
  }

  constructor(opt: Option) {
    this.opt = opt;
    this.createEl();
  }

  private setRtmpSrc(src: string) {
    const conn = parseRtmpSrc(src);
    this.rtmpConnection = conn[0];
    this.rtmpStream = conn[1];
  }

  private setSrc(src: SourceOption) {
    if (isRtmp(src)) {
      this.setRtmpSrc(src.src);
    } else {
      const srcParsed = getAbsoluteURL(src.src);
      this.el.vjs_src(srcParsed);
    }

    if (this.opt.autoplay) {
      setTimeout(() => this.play(), 0);
    }
  }

  private createEl() {
    const options = this.opt;

    // for the hosted swf, which should be relative to the page (not video.js)
    // The CDN also auto-adds a swf URL for that specific version.
    const objId = `zaojiu-flash-player-${genRandomID()}`;

    const flashVars = {
      readyFunction: 'ZaojiuPlayer.FlashVideo.onReady',
      eventProxyFunction: 'ZaojiuPlayer.FlashVideo.onEvent',
      errorEventProxyFunction: 'ZaojiuPlayer.FlashVideo.onError',
      autoplay: options.autoplay,
      preload: options.preload,
      loop: options.loop,
    };
    const params = {
      wmode: 'opaque',
      bgcolor: '#000000',
    };
    const attributes = {
      id: objId,
      name: objId,
      class: styles.video,
    };

    this.el = createElementByString(getFlashTemplate(options.swf, flashVars, params, attributes)).item(0) as FlashElement;
    this.el.instance = this;
  }

  private propertySetter(property: string, value: any) {
    if (this.isReady) {
      this.el.vjs_setProperty(property, value);
    } else {
      (new Promise((resolve, reject) => {
        this.readyResolver.push(resolve);
      })).then(() => {
        this.el.vjs_setProperty(property, value);
      });
    }
  }

  private propertyGetter(property: string): any {
    return this.el && this.el.vjs_getProperty ? this.el.vjs_getProperty(property) : null;
  }

  private initTimeChecker() {
    let timeCache = -1;
    this.timeupdateTimer = setInterval(() => {
      if (!this.el) return;

      if (this.currentTime !== timeCache) {
        timeCache = this.currentTime;
        this.handleEvent('timeupdate', '');
      }
    }, 1000);
  }

  load() {
    if (this.el && this.el.vjs_load) this.el.vjs_load();
  }

  play() {
    if (this.el && this.el.vjs_play) this.el.vjs_play();
  }

  pause() {
    if (this.el && this.el.vjs_pause) this.el.vjs_pause();
  }

  canPlayType(type: string): string {
    return FlashVideo.canPlayType(type);
  };

  get seeking() {
    return this.lastSeekTarget !== -1;
  }

  get duration(): number {
    if (this.readyState === ReadyState.HAVE_NOTHING) {
      return NaN;
    }
    const duration = this.propertyGetter('duration') || 0;

    return duration >= 0 ? duration : Infinity;
  }

  get seekable(): FlashTimeRanges {
    const duration = this.duration;

    if (duration === 0) {
      return new FlashTimeRanges(new FlashBuffer(0, 0));
    }
    return new FlashTimeRanges(new FlashBuffer(0, duration));
  }

  get buffered(): FlashTimeRanges {
    const ranges = this.propertyGetter('buffered') || null;

    if (!ranges || ranges.length === 0) {
      return new FlashTimeRanges(new FlashBuffer(0, 0));
    }

    const buffers: FlashBuffer[] = [];

    for (const range of ranges) {
      buffers.push(new FlashBuffer(range[0], range[1]));
    }

    return new FlashTimeRanges(buffers);
  }

  get ended(): boolean {
    return !!this.propertyGetter('ended');
  }

  get paused(): boolean {
    return !!this.propertyGetter('paused');
  }

  get networkState(): NetworkState {
    return this.propertyGetter('networkState') || NetworkState.NETWORK_EMPTY;
  }

  get readyState(): ReadyState {
    return this.propertyGetter('readyState') || ReadyState.HAVE_NOTHING;
  }

  // read write properties -------------------------------------------

  get src(): SourceOption {
    return this.propertyGetter('currentSrc');
  }

  set src(src: SourceOption) {
    if (!this.isReady) {
      this.sourceBeforeReady = src;
      const ready = new Promise<void>((resolve, reject) => {
        this.readyResolver.push(resolve);
      });
      ready.then(() => {
        this.setSrc(this.sourceBeforeReady);
        this.sourceBeforeReady = null;
      });
    } else {
      this.setSrc(src);
    }
  }

  get currentTime(): number {
    return this.seeking ? this.lastSeekTarget : (this.propertyGetter('currentTime') || 0);
  }

  set currentTime(time: number) {
    const seekable = this.seekable;

    if (seekable.length) {
      time = time > seekable.start(0) ? time : seekable.start(0);
      time = time < seekable.end(seekable.length - 1) ? time : seekable.end(seekable.length - 1);

      this.lastSeekTarget = time;
      this.handleEvent('seeking',null);
      this.propertySetter('currentTime', time);
    }
  }

  get autoplay(): boolean {
    return this.propertyGetter('autoplay') || false;
  }

  set autoplay(isAutoPlay: boolean) {
    this.propertySetter('autoplay', isAutoPlay);
  }

  get preload(): string {
    return this.propertyGetter('preload') || '';
  }

  set preload(preload: string) {
    this.propertySetter('preload', preload);
  }

  get loop(): boolean {
    return this.propertyGetter('loop') || '';
  }

  set loop(loop: boolean) {
    this.propertySetter('loop', loop);
  }

  get volume(): number {
    return this.propertyGetter('volume') || 0;
  }

  set volume(volume: number) {
    this.propertySetter('volume', volume);
  }

  get muted(): boolean {
    return this.propertyGetter('muted') || false;
  }

  set muted(muted: boolean) {
    this.propertySetter('muted', muted);
  }

  get defaultMuted(): boolean {
    return this.propertyGetter('defaultMuted') || false;
  }

  set defaultMuted(defaultMuted: boolean) {
    this.propertySetter('defaultMuted', defaultMuted);
  }

  get playbackRate(): number {
    return this.propertyGetter('playbackRate') || 1;
  }

  set playbackRate(playbackRate: number) {
    this.propertySetter('playbackRate', playbackRate);
  }

  get defaultPlaybackRate(): number {
    return this.propertyGetter('defaultPlaybackRate') || 1;
  }

  set defaultPlaybackRate(defaultPlaybackRate: number) {
    this.propertySetter('defaultPlaybackRate', defaultPlaybackRate);
  }

  get poster(): string {
    return this.propertyGetter('poster') || '';
  }

  set poster(poster: string) {
  }

  get rtmpConnection(): string {
    return this.propertyGetter('rtmpConnection') || '';
  }

  set rtmpConnection(connection: string) {
    this.propertySetter('rtmpConnection', connection);
  }

  get rtmpStream(): string {
    return this.propertyGetter('rtmpStream') || '';
  }

  set rtmpStream(stream: string) {
    this.propertySetter('rtmpStream', stream);
  }

  // TODO: remain property
  // const _readOnly = [
  //   'initialTime',
  //   'startOffsetTime',
  //   'videoWidth',
  //   'videoHeight'
  // ];

  addEventListener(type: string, listener?: any, useCapture?: boolean) {
    if (!listener) return;

    const listenerArr = this.listenerGroup[type] || [];

    const has = listenerArr.find(l => l === listener);
    if (!has) {
      listenerArr.push(listener);
    }

    this.listenerGroup[type] = listenerArr;
  }

  removeEventListener(type: string, listener?: any, useCapture?: boolean) {
    if (!listener) return;

    const listenerArr = this.listenerGroup[type] || [];

    if (!listenerArr.length) return;

    for (const i in listenerArr) {
      if (listenerArr[i] === listener) {
        listenerArr.splice(+i, 1);
        break;
      }
    }
  }

  handleEvent(eventName: string, args: any) {
    // flash event list
    // public static const ON_SRC_CHANGE:String = "onsrcchange";
    // public static const ON_LOAD_START:String = "loadstart";
    // public static const ON_START:String = "playing";
    // public static const ON_PAUSE:String = "pause";
    // public static const ON_RESUME:String = "play";
    // public static const ON_SEEK_START:String = "seeking";
    // public static const ON_SEEK_COMPLETE:String = "seeked";
    // public static const ON_BUFFER_FULL:String = "loadeddata";
    // public static const ON_BUFFER_EMPTY:String = "waiting";
    // public static const ON_BUFFER_FLUSH:String = "emptied";
    // public static const ON_PLAYBACK_COMPLETE:String = "ended";
    // public static const ON_METADATA:String = "loadedmetadata";
    // public static const ON_DURATION_CHANGE:String = "durationchange";
    // public static const ON_CAN_PLAY:String = "canplay";
    // public static const ON_CAN_PLAY_THROUGH:String = "canplaythrough";
    // public static const ON_VOLUME_CHANGE:String = "volumechange";
    //
    // public static const ON_RTMP_CONNECT_SUCCESS:String = "rtmpconnected";
    // public static const ON_RTMP_RETRY:String = "rtmpretry";
    // public static const ON_STAGE_CLICK:String = "stageclick";
    //
    // public static const ON_TEXT_DATA:String = "textdata";

    if (eventName === 'seeked') this.lastSeekTarget = -1;

    // flash loop option not woking~~
    if (eventName === 'ended' && !this.opt.loop) this.pause();

    const listenerArr = this.listenerGroup[eventName] || [];
    if (listenerArr.length) {
      listenerArr.forEach(listener => {
        let handler;
        if (typeof listener === 'function') {
          handler = listener;
        } else if (listener && typeof (<any>listener).handleEvent === 'function') {
          handler = (<any>listener).handleEvent;
        }
        if (handler) handler(new PlayerEvent(eventName, args));
      });
    }
  }

  handleReady() {
    this.isReady = true;

    if (this.readyResolver && this.readyResolver.length) {
      this.readyResolver.forEach(resolve => resolve());
      this.readyResolver = [];
    }

    this.initTimeChecker();

    this.handleEvent('ready', '');
  }

  handleError(err: string) {
    // flash error list
    // public static const SRC_NOT_SET:String = "srcnotset";
    // public static const SRC_404:String = "srcnotfound";
    // public static const RTMP_CONNECT_FAILURE:String = "rtmpconnectfailure";
    // public static const PROPERTY_NOT_FOUND:String = "propertynotfound";
    // public static const UNSUPPORTED_MODE:String = "unsupportedmode";
    switch (err) {
      case 'srcnotset':
      case 'srcnotfound':
        this.error = new PlayerError(MediaErrorCode.MEDIA_ERR_SRC_NOT_SUPPORTED);
        break;
      case 'rtmpconnectfailure':
        this.error = new PlayerError(MediaErrorCode.MEDIA_ERR_NETWORK);
        break;
    }

    this.handleEvent('error', err);
  }

  remove() {
    this.el.remove();
  }
}

if ((<any>window).ZaojiuPlayer && !(<any>window).ZaojiuPlayer.FlashVideo) {
  (<any>window).ZaojiuPlayer.FlashVideo = FlashVideo;
}