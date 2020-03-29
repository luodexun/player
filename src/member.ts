import { BaseElement } from './interface';
import {PlayerEvent, PlayerEventType, Option } from './model';
import {Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";
import {Subject} from "rxjs/Subject";
import 'rxjs/add/operator/first';
import { createElementByString } from "./utils";

const styles = require('./player.scss');
const MemberTemplate = `
  <div class="${styles.member}">
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

export class MemberControler {
  el: HTMLElement;
  private container: BaseElement;
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
    this.bindEvent();
  }


  private bindEvent() {
    this.eventSub = this.event$.filter(e => e.type === PlayerEventType.RetryPlay).subscribe(e => {
      if (!this.el) return;

    });
  }




  public render() {
    if (this.rendered) throw new Error('video already rendered');

    this.container.el.appendChild(this.el);

    this.rendered = true;
  }

  public destroy() {
    if (!this.rendered) throw new Error('video haven\'t render');

    this.el.remove();

    if (this.eventSub) this.eventSub.unsubscribe();

    this.rendered = false;
  }
}
