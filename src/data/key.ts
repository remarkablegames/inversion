import * as audio from '../assets/audio';

export type AudioKey = keyof typeof audio;

export const key = {
  audio: Object.keys(audio).reduce((accumulator, currentValue) => {
    const key = currentValue as AudioKey;
    accumulator[key] = key;
    return accumulator;
  }, {} as Record<AudioKey, AudioKey>),

  image: {
    box: 'box',
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
