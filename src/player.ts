import {VideoPlayer} from "./video";
import {Language, Option, PlayerEvent, PlayerEventType} from "./model";
import {BaseElement} from "./interface";
import {createElementByString, IS_MOBILE} from "./utils";
import {Controls} from "./controls";
// import {MemberControler} from './member';
import {Subject,Observable} from "rxjs";
import { filter } from "rxjs/operators";
import * as _ from 'lodash';
const styles = require('./player.scss');

const ElementQueries = require('css-element-queries/src/ElementQueries');

const template = `
  <div class="${styles.player} ${IS_MOBILE ? styles.touchable : ''}"></div>
`;

export class Player implements BaseElement {
  el: HTMLElement;
  video: VideoPlayer;
  controls: Controls;
  eventSource = new Subject<PlayerEvent>();
  event$: Observable<PlayerEvent> = this.eventSource.asObservable();
  option: Option;
  language = new Language('zh-CN');
  private containerPositionCache = '';
  private elementQueries: any;

  static FlashVideo?: any;
  static use(plugin: any) {
    if (plugin.name === 'FlashVideo') {
      this.FlashVideo = plugin;
    }
  }

  constructor(option: Option|any) {
    if (!option) throw new Error('option cannot be empty');
    let optionParsed: Option;
    if (option instanceof Option) {
      optionParsed = option as Option;
    } else {
      optionParsed = new Option(
        option.element,
        option.playList,
        option.cover,
        option.autoplay,
        option.preload,
        option.loop,
        option.controls,
        option.swf,
        option.on
      );
    }
    this.option = optionParsed;
    this.el = createElementByString(template).item(0) as HTMLElement;
    this.prepareVideo();
    this.prepareControls();
    this.perpareVideoSource();
    this.bindEvent();
    this.render();
  }

  private getTargetElement() {
    const ele = this.option.element instanceof HTMLElement ? this.option.element : document.getElementById(this.option.element as string);
    if (!ele) throw new Error('can not found target element');
    return ele;
  }

  private prepareControls() {
    this.controls = new Controls(this, this.option, this.video, this, this.event$);
  }

  private prepareVideo() {
    this.video = new VideoPlayer(this, this.option, this.eventSource, this.event$);
  }

  private perpareVideoSource() {
    this.video.setSrc(this.option.playList);
  }

  private bindEvent() {
    this.event$.pipe(
      filter(e => _.indexOf([PlayerEventType.like,PlayerEventType.share,PlayerEventType.goods,PlayerEventType.back], e.type) !== -1)
    ).subscribe((e:PlayerEvent|any)=>{
      this.option.on(e);
    })
}

  render() {
    this.video.render();
    this.controls.render();
    const container: HTMLElement = this.getTargetElement();
    const style: CSSStyleDeclaration = window.getComputedStyle ? getComputedStyle(container, null) : (<any>container)['currentStyle'];
    if (style.position !== 'relative' && style.position !== 'absolute') {
      this.containerPositionCache = style.position;
      container.style.position = 'relative';
    }
    container.innerHTML = '';
    container.appendChild(this.el);

    this.elementQueries = new ElementQueries();
    this.elementQueries.init(true);
  }

  destroy() {
    this.video.destroy();
    this.controls.destroy();
    const container = this.getTargetElement();
    container.style.position = this.containerPositionCache;
    container.innerHTML = '';

    this.elementQueries.detach();
  }
}
