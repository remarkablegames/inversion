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

export * from './levels';
