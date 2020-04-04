import {Player} from "../src/player";
import {PlayerEvent} from "../src/model";
import {FlashVideo} from "../src/flash";

Player.use(FlashVideo);

const srcHD =  {
  src: 'http://study-1252796609.cos.ap-shanghai.myqcloud.com/video/2F21CADD-1BBD-400D-A417-0BC7B95032BA.MP4',
  quality: '超清',
  mimetype: 'video/mp4'
};
// const srcSD = {
//   src: 'rtmp://ali-live.zaojiu.com/zaojiu/59313bd2647259000183041d_sd?auth_key=1512472740-0-0-845571a71200e6c83807d4e399f3ad00',
//   // src: 'http://7qnbk6.com1.z0.glb.clouddn.com/The-Battle-of-Evony-MD.mp4',
//   quality: '高清',
//   mimetype: 'rtmp/mp4'
// };
// // const srcMD = {
// //   src: '//edge.flowplayer.org/flowplayer-700.flv',
// //   // src: 'http://7qnbk6.com1.z0.glb.clouddn.com/The-Battle-of-Evony-MD.mp4',
// //   quality: '高清',
// //   mimetype: 'video/mp4'
// // };
// const srcMD = {
//   src: 'http://7qnbk6.com1.z0.glb.clouddn.com/The-Battle-of-Evony-SD.mp4',
//   quality: '标清',
//   mimetype: 'video/mp4'
// };
const player = new Player({
  element: 'player',
  playList: [srcHD],
  cover:'http://image.haipaitv.cn/video/20200326/db33fba1dedebf08ee37ddcd1a498f4c.jpg',
  memberOption: {
    avatar:'http://image.haipaitv.cn/headlogo/201804/5ae3172e129b5.jpg',
    comment:[
      {
        time:1585184699,
        avatar:"http://image.haipaitv.cn/headlogo/201804/5ae3172e129b5.jpg",
        nickname:'愿得一人心',
        content:'美的不要不要的美的不要不要的美的不要不要的美的不要不要的美的不要不要的美的不要不要的美的不要不要的美的不要不要的美的不要不要的'
      },
      {
        time:1585184699,
        avatar:"http://image.haipaitv.cn/headlogo/201804/5ae3172e129b5.jpg",
        nickname:'愿得一人心',
        content:'美的不要不要的美的不要不要的美的不要不要的美的不要不要的美的不要不要的美的不要不要的美的不要不要的美的不要不要的美的不要不要的'
      },
      {
        time:1585184699,
        avatar:"http://image.haipaitv.cn/headlogo/201804/5ae3172e129b5.jpg",
        nickname:'愿得一人心',
        content:'美的不要不要的美的不要不要的美的不要不要的美的不要不要的美的不要不要的美的不要不要的美的不要不要的美的不要不要的美的不要不要的'
      },
      {
        time:1585184699,
        avatar:"http://image.haipaitv.cn/headlogo/201804/5ae3172e129b5.jpg",
        nickname:'愿得一人心',
        content:'美的不要不要的美的不要不要的美的不要不要的美的不要不要的美的不要不要的美的不要不要的美的不要不要的美的不要不要的美的不要不要的'
      },
      {
        time:1585184699,
        avatar:"http://image.haipaitv.cn/headlogo/201804/5ae3172e129b5.jpg",
        nickname:'愿得一人心',
        content:'美的不要不要的美的不要不要的美的不要不要的美的不要不要的美的不要不要的美的不要不要的美的不要不要的美的不要不要的美的不要不要的'
      }
    ],
    shop_url:'',
    like:''
  },
  on:function (event:PlayerEvent|any) {
    console.log(event.type)
  }
});
