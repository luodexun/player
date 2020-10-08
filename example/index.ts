import {Player} from "../src/player";
import {PlayerEvent} from "../src/model";
import {FlashVideo} from "../src/flash";

Player.use(FlashVideo);

const srcHD =  {
  src: 'http://localhost:1102/7ed43bdf6eb613c124fedab831b72a73/video.m3u8',
  quality: '超清',
  mimetype: 'video/m3u8'
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
  on:function (event:PlayerEvent|any) {
    console.log(event.type)
  }
});
