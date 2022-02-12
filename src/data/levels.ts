import ant from '../assets/tilemaps/ant.json';
import asymmetrical from '../assets/tilemaps/asymmetrical.json';
import box from '../assets/tilemaps/box.json';
import challenge from '../assets/tilemaps/challenge.json';
import dilbert from '../assets/tilemaps/dilbert.json';
import down from '../assets/tilemaps/down.json';
import fall from '../assets/tilemaps/fall.json';
import gaps from '../assets/tilemaps/gaps.json';
import invert from '../assets/tilemaps/invert.json';
import maze from '../assets/tilemaps/maze.json';
import pillars from '../assets/tilemaps/pillars.json';
import precise from '../assets/tilemaps/precise.json';
import restart from '../assets/tilemaps/restart.json';
import spikes from '../assets/tilemaps/spikes.json';
import start from '../assets/tilemaps/start.json';
import tetris from '../assets/tilemaps/tetris.json';
import { key } from './key';

export const levels = [
  // 1
  {
    json: start,
    music: key.audio.A1,
    text: 'Arrow/WASD to move & jump',
  },

  // 2
  {
    json: invert,
    music: key.audio.A1,
    text: 'Press Spacebar/I to invert the player',
  },

  // 3
  {
    json: restart,
    music: key.audio.A2,
    text: 'Press R to restart the level',
  },

  // 4
  {
    json: spikes,
    music: key.audio.A2,
    text: 'Watch out for spikes',
  },

  // 5
  {
    json: down,
    music: key.audio.A2,
    text: "Don't look down",
  },

  // 6
  {
    json: precise,
    music: key.audio.A2,
    text: 'Jump carefully...',
  },

  // 7
  {
    json: asymmetrical,
    music: key.audio.A3,
    text: "Something's different",
  },

  // 8
  {
    json: ant,
    music: key.audio.A3,
    text: 'Go down the rabbit hole',
  },

  // 9
  {
    json: maze,
    music: key.audio.A4,
    text: 'Exit the maze',
  },

  // 10
  {
    json: dilbert,
    music: key.audio.A5,
    text: 'Face your troubles',
  },

  // 11
  {
    json: box,
    music: key.audio.A6,
    text: "Don't get boxed in",
  },

  // 12
  {
    json: pillars,
    music: key.audio.A7,
    text: 'Pillars are your foundation',
  },

  // 13
  {
    json: fall,
    music: key.audio.A8,
    text: 'Take a leap of faith',
  },

  // 14
  {
    json: challenge,
    music: key.audio.C1,
    text: 'Think carefully...',
  },

  // 15
  {
    json: gaps,
    music: key.audio.C2,
    text: 'Mind the gaps',
  },

  // 16
  {
    json: tetris,
    music: key.audio.C3,
    text: 'How many lines can you clear?',
  },
] as const;
