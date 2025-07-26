import Phaser from 'phaser';

import { color } from './data';
import scenes from './scenes';

/**
 * https://photonstorm.github.io/phaser3-docs/Phaser.Types.Core.html#.GameConfig
 */
new Phaser.Game({
  width: 1280, // 32px * 40 tiles
  height: 640, // 32px * 20 tiles
  title: 'Inversion',
  url: 'https://remarkablegames.org/inversion/',
  version: import.meta.env.VITE_APP_VERSION,
  scene: scenes,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        x: 0,
        y: 1150,
      },
      debug: import.meta.env.DEV,
    },
  },
  disableContextMenu: import.meta.env.PROD,
  backgroundColor: color.black,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  pixelArt: true,
});
