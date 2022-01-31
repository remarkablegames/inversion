import ant from '../assets/tilemaps/ant.json';
import asymmetrical from '../assets/tilemaps/asymmetrical.json';
import box from '../assets/tilemaps/box.json';
import challenge from '../assets/tilemaps/challenge.json';
import dilbert from '../assets/tilemaps/dilbert.json';
import down from '../assets/tilemaps/down.json';
import invert from '../assets/tilemaps/invert.json';
import maze from '../assets/tilemaps/maze.json';
import precise from '../assets/tilemaps/precise.json';
import restart from '../assets/tilemaps/restart.json';
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
    text: 'Press R to restart the level',
    json: restart,
  },

  // 4
  {
    text: "Don't look down",
    json: down,
  },

  // 5
  {
    text: 'Jump carefully...',
    json: precise,
  },

  // 6
  {
    text: "Something's different",
    json: asymmetrical,
  },

  // 7
  {
    text: 'Go down the rabbit hole',
    json: ant,
  },

  // 8
  {
    text: 'Exit the maze',
    json: maze,
  },

  // 9
  {
    text: 'Face your troubles',
    json: dilbert,
  },

  // 10
  {
    text: "What's with the box?",
    json: box,
  },

  // 11
  {
    text: 'Think carefully...',
    json: challenge,
  },
] as const;
