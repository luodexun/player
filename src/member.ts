import {BaseElement} from './interface';
import {Option, PlayerEvent, PlayerEventType} from './model';
import {Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";
import {Subject} from "rxjs/Subject";
import 'rxjs/add/operator/first';
import {createElementByString} from "./utils";

const styles = require('./player.scss');
const MemberTemplate = `
  <div class="${styles.member}">
    <img src="" alt="">  
    <div class="btn">
    <img src="${require('../asset/img/nice.png').default}" alt="好物">
    <h5>好物</h5>
    </div>
    <div class="btn">
    <img src="${require('../asset/img/comment.png').default}" alt="评论">
    <h5>评论</h5>
    </div>
    <div class="btn">
    <img src="${require('../asset/img/like.png').default}" alt="喜欢">
    <h5>喜欢</h5>
    </div>
</div>
`;
const topTemplate = `
  <div class="${styles.top}">
      <img src="${require('../asset/img/back.png').default}" alt="返回">
      <img src="${require('../asset/img/share.png').default}" alt="分享">
  </div>
`;

export class MemberControler {
  el: HTMLElement;
  private container: BaseElement;
  private avatarEl: HTMLImageElement;
  private goodsEl: HTMLElement;
  private commentEl: HTMLElement;
  private likeEl: HTMLElement;
  public  topEl: HTMLElement;
  private backEl: HTMLImageElement;
  private shareEl: HTMLImageElement;

  private opt: Option;
  private event$: Observable<PlayerEvent>;
  private eventSource: Subject<PlayerEvent>;
  private eventSub: Subscription;
  private rendered: boolean;

  constructor(container: BaseElement, opt: Option, eventSource: Subject<PlayerEvent>, event$: Observable<PlayerEvent>) {
    this.container = container;
    this.opt = opt;
    this.eventSource = eventSource;
    this.event$ = event$;
    this.el = createElementByString(MemberTemplate).item(0) as HTMLElement;
    this.avatarEl = this.el.childNodes.item(0) as HTMLImageElement;
    this.goodsEl = this.el.childNodes.item(1) as HTMLElement;
    this.commentEl = this.el.childNodes.item(2) as HTMLElement;
    this.likeEl = this.el.childNodes.item(3) as HTMLElement;
    this.topEl = createElementByString(topTemplate).item(0) as HTMLElement;
    this.backEl = this.topEl.childNodes.item(0) as HTMLImageElement;
    this.shareEl = this.topEl.childNodes.item(1) as HTMLImageElement;
    this.bindEvent();
  }


  private bindEvent() {
    this.goodsEl.addEventListener('click', () => {
      this.eventSource.next(new PlayerEvent(PlayerEventType.goods, '123'))
    });
    this.likeEl.addEventListener('click', () => {
     this.eventSource.next(new PlayerEvent(PlayerEventType.like, (num:number) => {
           console.log(num);
      }))
    });
    this.backEl.addEventListener('click', () => {
     this.eventSource.next(new PlayerEvent(PlayerEventType.back, '123'))
    });
    this.shareEl.addEventListener('click', () => {
      this.eventSource.next(new PlayerEvent(PlayerEventType.share, '123'))
    });
  }




  public render() {
    if (this.rendered) throw new Error('video already rendered');
    this.avatarEl.src = this.opt.memberOption.avatar;
    this.container.el.appendChild(this.el);
    this.container.el.appendChild(this.topEl);

    this.rendered = true;
  }

  public destroy() {
    if (!this.rendered) throw new Error('video haven\'t render');

    this.el.remove();

    if (this.eventSub) this.eventSub.unsubscribe();

    this.rendered = false;
  }
}
