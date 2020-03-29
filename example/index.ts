import {Player} from "../src/player";
import {FlashVideo} from "../src/flash";

Player.use(FlashVideo);

const srcHD =  {
  src: 'https://luodexun.oss-cn-beijing.aliyuncs.com/video/%E8%8B%B1%E9%9B%84%E8%81%94%E7%9B%9F%E9%AD%94%E6%B3%95%E5%B0%91%E5%A5%B32017cg_%E9%AB%98%E6%B8%85',
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
const player = new Player({element: 'player', playList: [srcHD]});
