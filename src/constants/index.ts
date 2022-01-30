import level1 from '../assets/tilemaps/level1.json';
import level2 from '../assets/tilemaps/level2.json';
import level3 from '../assets/tilemaps/level3.json';
import level4 from '../assets/tilemaps/level4.json';

export const color = {
  white: '#fcfcfc',
  whiteHex: 0xfcfcfc,
  black: '#1d212d',
} as const;

export const key = {
  image: {
    spike: 'spike',
    tiles: 'tiles',
  },

  scene: {
    boot: 'boot',
    main: 'main',
  },

  spritesheet: {
    player: 'player',
  },

  tilemap: {
    map: 'map',
  },
} as const;

export const levels = [level1, level2, level3, level4] as const;
