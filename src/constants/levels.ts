import invert from '../assets/tilemaps/invert.json';
import level3 from '../assets/tilemaps/level3.json';
import level4 from '../assets/tilemaps/level4.json';
import level5 from '../assets/tilemaps/level5.json';
import level6 from '../assets/tilemaps/level6.json';
import level7 from '../assets/tilemaps/level7.json';
import level8 from '../assets/tilemaps/level8.json';
import level10 from '../assets/tilemaps/level10.json';
import start from '../assets/tilemaps/start.json';

export const levels = [
  // 1
  start,

  // 2
  invert,
  level3,
  level4,
  level5,
  level6,
  level7,
  level8,
  level10,
] as const;
