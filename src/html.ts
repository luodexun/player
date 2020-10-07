import {createElementByString} from "./utils";
const styles = require('./player.scss');

const template = `
  <video class="${styles.video}" playsinline x5-video-player-type="h5" webkit-playsinline preload="load"></video>
`;

export const createHTMLVideoElement = (): HTMLVideoElement => {
  return createElementByString(template).item(0) as HTMLVideoElement;
};

