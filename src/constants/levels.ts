import ant from '../assets/tilemaps/ant.json';
import asymmetrical from '../assets/tilemaps/asymmetrical.json';
import box from '../assets/tilemaps/box.json';
import challenge from '../assets/tilemaps/challenge.json';
import dilbert from '../assets/tilemaps/dilbert.json';
import down from '../assets/tilemaps/down.json';
import invert from '../assets/tilemaps/invert.json';
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

  // 5
  asymmetrical,

  // 6
  ant,

  // 7
  dilbert,

  // 8
  box,

  // 9
  challenge,
] as const;
