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
    text: "Don't look down",
    json: down,
  },

  // 4
  {
    text: 'Jump carefully...',
    json: precise,
  },

  // 5
  {
    text: "Something's different",
    json: asymmetrical,
  },

  // 6
  {
    text: 'Go down the rabbit hole',
    json: ant,
  },

  // 7
  {
    text: 'Face your troubles',
    json: dilbert,
  },

  // 8
  {
    text: "What's with the box?",
    json: box,
  },

  // 9
  {
    text: 'Think carefully...',
    json: challenge,
  },
] as const;
