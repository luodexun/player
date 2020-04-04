import {BaseElement} from './interface';
import {Option, PlayerEvent, PlayerEventType} from './model';
import {Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";
import {Subject} from "rxjs/Subject";
import 'rxjs/add/operator/first';
import {createElementByString} from "./utils";
import * as $ from "jquery";
const styles = require('./player.scss');
const memberTemplate = `
  <div class="${styles.member}"></div>`;
export class MemberControler {
  el: HTMLElement;
  private container: BaseElement;
  public left: LeftControler;
  public top: TopControler;
  public comment: CommentControler;
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
    this.el = createElementByString(memberTemplate).item(0) as HTMLElement;
    this.prepareTop();
    this.prepareLeft();
    this.prepareComment();
  }

  private prepareTop() {
    this.left = new LeftControler(this, this.opt, this.eventSource, this.event$);
  }

  private prepareLeft() {
    this.top = new TopControler(this, this.opt, this.eventSource, this.event$);
  }

  private prepareComment() {
    this.comment = new CommentControler(this, this.opt, this.eventSource, this.event$);
  }

  public render() {
    if (this.rendered) throw new Error('video already rendered');
    this.top.render();
    this.left.render();
    this.comment.render();
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

const LeftTemplate = `
  <div class="${styles.left}">
    <img src="" alt="">  
    <div class="btn">
    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="67px" height="67px" viewBox="0 0 67 67" enable-background="new 0 0 67 67" xml:space="preserve">  <image id="image0" width="67" height="67" x="0" y="0"
    href="data:image/png;base64,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
NTc6MjQrMDA6MDCYtdyAAAAAAElFTkSuQmCC" />
</svg>
    <h5>好物</h5>
    </div>
    <div class="btn">
    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="100px" height="100px" viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve">  <image id="image0" width="100" height="100" x="0" y="0"
    href="data:image/png;base64,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" />
</svg>
    <h5>评论</h5>
    </div>
    <div class="btn">
    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="100px" height="100px" viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve">  <image id="image0" width="100" height="100" x="0" y="0"
    href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAQAAADa613fAAAABGdBTUEAALGPC/xhBQAAACBjSFJN
AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAz8SURB
VHja7Zx7cFTVGcC/u8/72ICARDRSA9URI6KU1jgMrcgMFRCroA1ix+p0Rv+odsbO0GmLldKOxorV
6ojjTG2d+qhpq9X4AEZaxURRNOBAah5iRMiGJEDIg+wj+7j39I+9j/Odc+7uzT7oH+XssNzdvec7
3+9833fuued8NwBnyplSkSKVsRb5n0gpAsT7uaTiUooUK3muQVyOyyelaBCJORKp4zRGuG/E0qQ8
MqxjXmrRILhZ/p0uNAKrCCuFxxEhEE5uUSA8BP2Prck27eBgiWx9NylYhgcYKe/31rujglgJ1hok
DwjG4aVY71iWm5ULgLBWkIRKiFRwR+ElFJJivYut4wGExqAhJJAAui6v+XawLnCx/+uSBiEIAABA
yjiWbU+3j+/9ywcb41zTNAiABFKjdsd3pi4KLAjM982CMAAAZCFN4vqhbHem/UjrZZ02AmGOXFEk
4TcSAyKBBNKBeXPXqjf6LoU8hZxIbR/6++wWzia2PaJXn70uvEqamU+K0ZFoPvTq5d02AmsXT6OY
BD7wgR8CEIQQhEEGBdS+1alm4rlkWgYaQAMVVFDMlwoqaAMNmRbvUlLNfatBBQVkCEMIghAAP/jA
Z0fqZDFeq001eW/ehnnv0HKIgGa+IoeWZ96bvJRU02u1k0fhMRRQB242+ievQK6MbIKq3GtkU7Ey
jP6Bm0EFxTuKZIIgjMTDxSqQKxPNMBWmTrxRmpTEwxyK5IYixEg+U5oChBCS3pv+tHQpyRcLodCX
pdwPPhNJSjWFvucyqvRNvJGJJgcnBkZOhuWQetYc5ZLw4sC3Co8ldMnuTX+U6Bz9Kh1PTUybIZ+r
zArWyKt9teKz02+GbwECBhAgYIDLRZeODtMaqZdEPWOMx7d+uWrpWXYQO6/IvkVjvzWOeulfvXfs
N/sWUUOBLePCKQeXx580xoVWeda2imuk0G4VBhnUxGNCUc+9PQ8izMDqDLAaaFtmxR7KD2HERjfe
dTZoAilqTgZE3rok+ZyobuJRUEGGMHIvF4wQyKAMrhf04sHuZSaEAjLIEEYvOXe9AQ0iHUsye90w
Mns+XIikyFR9mcKJdC/Tv+LrD64HBWQmUgQgIQiD0jTbiHEKtPzhXLv5MIQgBCEIUq+Qc/EEDSLJ
F0UYsScoiLAtJ1eX65C/zs18xNuzaTZyLwqEc6vUds6lXjIVsCCCEIAABMAPfvCbx0FqJqBBJMY5
5+jPIIK6AneDheNYRoOq5N9YKantbu5F20MG5egNnDU+gghozPXVb4abzxwk/OykBrTk08gajyGL
Wl0REKDQdqlK7WD1OXqD6V4cCLKHvp8x5sDTNSaGA+GzxwzJHvF8PIzebnfGNg6CtSXtYBTK3Kl6
NxOt+8U2QfHRfyODn25dwGBgBInBQSjtl5lSsm/WmIFNW9RCCTIQGCXy/BwjjpXqv1EUJzmQ3Hil
Zj5kwvP3EGH4xdMDiZobODDh0XUkSVJjt5mhjS1KgZy6I/nAqTu3zaJGMirsx+5nnP1DUM2upUAc
x1I66hm3Gt9QDRpH7357TNvF7OnOC7pqqQGCjawABJfK2V1me4Oxe+1hWXZQlkwzjmPNOupBQc5l
g4RABiX+ID597H7KrQphsCh+KpSdqPDZUyDrnFDy16i3tz1zDoJRQIPI0D1Ys3gjH/C0Y+1EZyd+
MtOcFLhcSfOi+KhI8AuGCDuejB4mmDubzqNQFFBBu3Y6jpPMLt65fJZj3TrNGEEj9uvmtSPkGQNH
C//CQ4MJkt3DDrDZPebkhYqT1CvI6UdvnWZ3sQ8kkHyOcpvqpLNojYb/Cc4qRq54Wb50loZwTcLV
Nr+Jb2VF+Ovj91HrLAQIwNDLqLembqpDXQc+57B6IZKWfGEntaZEPEEgBama7kAEYOrLE42sCHVj
21y0+kU2vENi9BnVCy29bXwz1NXY48hTu8yBd3KOxRbJZYDAEyPl2E3sDXVqhzkTsKYrkcxn6MLw
ONbORxFNp1vS+zgrFLNzQTxYkwA5Z8crVxmH6C9DK9rnAVquMqL071jbnGuZJ/vQWpN+xFakUgUt
wTWc3L6CJOifL7oLLdNC9ghS3NLW0p76KUyfmDmOmiw/BD4mQK4fSDxBnxJePRM5ZXYIgYSxQAoE
DI8NlxMHWaXxCTLq/Cid9+4C6xAAUBjw2tI/opAk+bDKA4GBAEhjPNNCn1KDRiaio/rMAOJzOQZ/
sMIgzpo7tXmQeJ8+IVRLrfJI/oir5vijgXzQfwGiL273dzJIAATIcBf9tYTiIDCX/oS1zYGYRs70
ompzbIhKA9DHqJ99GlA7Kf5a+jdbWwJsxUwffaK/tt5fYQwBUiiEvrXmHQCwPsyA9IHgVAAAMnGU
/kGqfqCGwTgNUOEqpGy/0/a9tdIU+reJo3gk9Zn9QQBGerHQS61p2emyCgCo8+lPaQcELliAzxzp
BXS59jmHG7sJCqAp36Q23k5PIcp19MehTue4Ck1pyfADnzsfgNDBTprTmY/pk4NXmAdoolBJjNEf
+C5xPhp989ocDYKX06dm2l5K4R1FyrUA0p8gkG9c6GcAKgqzVZvyIP05/Y5zfJsSQCDpPbTeDojV
IwhEqn53man+abFHw5V4i3SwyVGzcTkO9bE2dtJkgRAgAH/+lLl5uZVLFqgEkNmv2XH6y2zLnA/A
dpzq9ahC7E9twN7A2etauXXfV9GdcXxztWgFqYyFusFaKhtRp+2exdYmA1Q9Opuk0E3Xq/Zam3Cl
UQZ16DZ8nzb8Y3Ndy/s6SrEgAQj1LzI6CCGEJGMbnA0GqBq+D2t17Ieie1d0y7m5Gi+76B1FraRM
FsTSIPh9ZWx9/M4DF1Mr8pHpU3S0D2bEN1eLOlcCtGjKJgZE10x6bWuyINzqpLlkaoIM/oi5m28W
ORa3rRBdiatlPp7kamO5UMwlbKjSP2O6dqXbtgJyLlD1fbjikesrGid4bTJAr+aDBpGB25l1yH3u
HsI410ADU7XHjpPTg2KBqKCtmWGcxNoMNLiPo6xNNP1LXHn058yafGUjxU5YgEhsC9OpX+b3DsYm
g+uYxdjEmxcxe9zljRQeRAYFtE+uIAZWZHBd/usaFydsOpJ+wN4MLZgNUjKIbQ/9IDPwtBQeQbFN
lLb5jE1IfCu3BVc+FInpShlU0OJbWR3a5nPjp1AUEsR6JyEn7qoQCpvQI4MC2vHb2fZjW/LnPfAo
IXHIE3Kg3g768qEIMQ7Uk6xLmBecY3DiOq9iQYzhJ89zSQIr9mEB4Wj19jy85UQIIZ1X5UveKORe
v2PF6R3PnF82FPFYpTbV6lG23dhD3tyKBkEjR+ZjDuXg6xeam/+loIi2s2VQQH3wHP0Lts3M+4UT
nAq413M1Rh+H0vvBpXYeA71z7h2GnV/ZU5J/1+n/4drr/uVM726FG6BQWuuMU1ysHNt/JZedQm92
erMFm5SrHV7FTkgIMYZePL+YsVIwonfU4/szQggxEoO3UPlCvF0kDxB4OqKN3kf4kmpfVOyFmI0U
GdSeawRNkNgWLt8nH4wbhJVL9EdRGz3X2J1VxCxPgMLepeRK+t3WOsbFnCQN97QbbrK+e35mt0h+
dGUpGLR7+Z0pdXQVmeCbMsaG7xbkYYnyHMQQKmijG/iMPUKI0beacl1/cZdfPgtYBrWj3hgQ2mXn
HisVioVxUmj8Yogvrs60imQaY19czURgkVcrIUprnX5Y2Gx85KdMrqKVSEO/6GRBBdS7Z8QeIcKi
H9m/sDwYbihK02w+NS9XMrujN6EcVFHWog0B2vA94k4hJLXjH1/jhvaS5nT42muH5rhrwn76ncPX
2fkKbEqtlSCjgnb8dv2Am4zxTdTwESg2NvKj2NOI6Aq9x02R1FuHvmumJ7MJzipooB2/I7PHra7e
E10hmDOU5WZBfBVWH6lOvkBcS2rHkdV8wvjTNaO/0LvcayVfeKS6+Amp1wcquQeVQDpxw/RGt5R8
gMyu5K4Tba0dz48DrI2sufLsleE10gy3s43Dwxtnvs48ilTwAbHSrGJNXRRQN1fjjCLBeJbQo3qU
zRJlS+zxzdXUtShQ4u1BQRRJNLnoWjyZp68EbtjctVg40fEyAS2DXdDCZu+1TDakx5LZ2Xstk2Re
MVu4oXCTvv614vmSK8Tu/rUFJp0VLJIgXmiYNaltntxpW/8a4QzN6z1NhexCw6ifL0k+yy8d2MF/
Kvns50vMR2BkajJTsi2Ky1N0/qd3F+3/n5rSsCyyJLRUmi0p4AcAnSTI0eyniU/+9VrDEPfYKvu8
Z1GDbbEmdIex37vrIrPk6eFagNThiZPx4786+HKaUryMEKWAiGHEz0fTKooASoYoFcQdhsewFBX9
KxmiHCDsX28o/OcUCHNUFgwAf+kiXDuEzRou4i85lKZA6bLY/BXxnwcpa+Zq+S884mQ1PsG/os1W
Xm7l8rrPlDPlTPn/KP8F1C+zf/fEnywAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjAtMDQtMDFUMDk6
Mzg6MzMrMDA6MDD5W8viAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIwLTA0LTAxVDA5OjM4OjMzKzAw
OjAwiAZzXgAAAABJRU5ErkJggg==" />
</svg>
    <h5>喜欢</h5>
    </div>
</div>
`;
export class LeftControler {
  el: HTMLElement;
  private container: BaseElement|any;
  private avatarEl: HTMLImageElement;
  private goodsEl: HTMLElement;
  private commentEl: HTMLElement;
  private likeEl: HTMLElement;
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
    this.el = createElementByString(LeftTemplate).item(0) as HTMLElement;
    this.avatarEl = this.el.childNodes.item(0) as HTMLImageElement;
    this.goodsEl = this.el.childNodes.item(1) as HTMLElement;
    this.commentEl = this.el.childNodes.item(2) as HTMLElement;
    this.likeEl = this.el.childNodes.item(3) as HTMLElement;
    this.bindEvent();
  }


  private bindEvent() {
    this.goodsEl.addEventListener('click', () => {
      this.eventSource.next(new PlayerEvent(PlayerEventType.goods,123));
    });
    this.commentEl.addEventListener('click', () => {
      this.container.comment.showEl();
    });
    this.likeEl.addEventListener('click', () => {
     this.eventSource.next(new PlayerEvent(PlayerEventType.like, {
       ajax:$.ajax,
       callBack:(code:any)=>{

       }
     }))
    });
  }


  public render() {
    if (this.rendered) throw new Error('video already rendered');
    this.avatarEl.src = this.opt.memberOption.avatar;
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

const topTemplate = `
  <div class="${styles.top}">
      <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="67px" height="67px" viewBox="0 0 67 67" enable-background="new 0 0 67 67" xml:space="preserve">  <image id="image0" width="67" height="67" x="0" y="0"
    href="data:image/png;base64,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
OSswMDowMDXIvd4AAAAASUVORK5CYII=" />
</svg>
  </div>
`;
export class TopControler {
  el: HTMLElement;
  private container: BaseElement;
  private backEl: HTMLImageElement;
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
    this.el = createElementByString(topTemplate).item(0) as HTMLElement;
    this.backEl = this.el.childNodes.item(0) as HTMLImageElement;
    this.bindEvent();
  }


  private bindEvent() {
    this.backEl.addEventListener('click', () => {
      this.eventSource.next(new PlayerEvent(PlayerEventType.back, '123'))
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
const commentTemplate  = `<div class="${styles.warp}">
  <div class="${styles.comment}">
     <div class="${styles.header}">
        <div></div>
        <h5>3条评论</h5>
        <img src="${require('../asset/img/back.png').default}" alt="">
     </div>
     <ul class="${styles.content}">
        
         
     </ul>
     <form class="${styles.footer}">
       <input type="search"  autocomplete="off" placeholder="留下你精彩的评论吧" results="5">
     </form>
  </div>
</div>`;

const liTemplate=`<li>
         <img src="" alt="">
          <div>
             <h4></h4>
             <p></p>
          </div>
        </li>`;
export class CommentControler {
  el: HTMLElement;
  private container: BaseElement;
  private commentEl:HTMLElement;
  private inputEl: HTMLInputElement;
  private closeEl:HTMLElement;
  private msgEl:HTMLElement;
  private formEl:HTMLFormElement;
  private ulEl:HTMLUListElement;
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
    this.el = createElementByString(commentTemplate).item(0) as HTMLElement;
    this.commentEl = this.el.childNodes.item(0) as HTMLElement;
    this.formEl = this.commentEl.childNodes.item(2) as HTMLFormElement;
    this.ulEl = this.commentEl.childNodes.item(1) as HTMLUListElement;
    this.inputEl = this.formEl.childNodes.item(0) as HTMLInputElement;
    this.closeEl = this.commentEl.childNodes.item(0).childNodes.item(2) as HTMLElement;
    this.msgEl = this.commentEl.childNodes.item(0).childNodes.item(1) as HTMLElement;
    this.bindEvent();
  }


  private bindEvent() {
    let self = this;
    this.inputEl.addEventListener('focus',function () {
      window.scrollTo(0,600);
    });
    this.inputEl.addEventListener('blur',function () {
      window.scrollTo(0,0);
    });
    this.closeEl.addEventListener('click',function (e) {
      self.hideEl();
    });
    this.el.addEventListener('touchmove',function (e) {
      e.stopPropagation();
    },false);
    this.el.addEventListener('click',function (e) {
      if(e.target === this) self.hideEl();
    });
    this.formEl.addEventListener('submit',function (e) {
      e.preventDefault();
    });
    this.formEl.addEventListener('search',function (e) {
      self.inputEl.blur();
      self.eventSource.next(new PlayerEvent(PlayerEventType.comment, {
        msg:self.inputEl.value,
        ajax:$.ajax,
        callBack:(code:any)=>{
          if(code){
           self.hideEl();
           self.refresh()
          }
        }
      }));
    });
  }

  public showEl(){
    if(this.opt.memberOption.comment.length === 0){
      this.eventSource.next(new PlayerEvent(PlayerEventType.empty, '123'));
    }else {
      this.refresh();
    }
    $(this.el).slideDown();
  }

  public hideEl(){
    $(this.el).slideUp();
  }

  private refresh(){
    $(this.ulEl).empty();
    $(this.msgEl).text(`${this.opt.memberOption.comment.length}条评论`);
    for(let item of this.opt.memberOption.comment){
      let li = $(createElementByString(liTemplate).item(0) as HTMLElement);
      li.find('img').attr('src',item.avatar);
      li.find('h4').text(`${item.nickname}    ${this.toTime(item.time)}`);
      li.find('p').text(item.content);
      $(this.ulEl).append(li);
    }

  }
  private toTime(time:number){
    let timestamp=new Date().getTime();
    let t = timestamp-time*1000;
    if(t<=180*1000){
      return '刚刚'
    }
    if(t<=3600*1000){
      return `${Math.floor(t/(60*1000))}分钟前`
    }
    if(t<=3600*24*1000){
      return `${Math.floor(t/(3600*1000))}个小时前`
    }
    if(t<=3600*24*30*1000){
      return `${Math.floor(t/(3600*24*1000))}天前`
    }
    if(t>3600*24*30*12*1000){
      let d= new Date(time*1000);
      return `${d.getMonth()+1}月${d.getDate()}日 ${d.getHours()}:${d.getMinutes()}`
    }
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
