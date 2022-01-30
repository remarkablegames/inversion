import down from '../assets/tilemaps/down.json';
import invert from '../assets/tilemaps/invert.json';
import level5 from '../assets/tilemaps/level5.json';
import level6 from '../assets/tilemaps/level6.json';
import level7 from '../assets/tilemaps/level7.json';
import level8 from '../assets/tilemaps/level8.json';
import level10 from '../assets/tilemaps/level10.json';
import precise from '../assets/tilemaps/precise.json';
import start from '../assets/tilemaps/start.json';

export const levels = [
  // 1
  start,

  // 2
  invert,

  // 3
  down,

  // 4
  precise,
  level5,
  level6,
  level7,
  level8,
  level10,
] as const;
