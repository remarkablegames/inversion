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
  {
    text: 'Arrow/WASD to move & jump',
    json: start,
  },

  // 2
  {
    text: 'Press Spacebar to invert player',
    json: invert,
  },

  // 3
  {
    text: '',
    json: down,
  },

  // 4
  {
    text: '',
    json: precise,
  },

  // 5
  {
    text: '',
    json: asymmetrical,
  },

  // 6
  {
    text: '',
    json: ant,
  },

  // 7
  {
    text: '',
    json: dilbert,
  },

  // 8
  {
    text: '',
    json: box,
  },

  // 9
  {
    text: '',
    json: challenge,
  },
] as const;
