import Phaser from 'phaser';

import * as audio from '../assets/audio';
import spike from '../assets/images/0x72-industrial-spike.png';
import box from '../assets/images/box.png';
import player from '../assets/spritesheets/0x72-industrial-player-32px-extruded.png';
import tiles from '../assets/tilesets/0x72-industrial-tileset-32px-extruded.png';
import { key, levels } from '../constants';

export default class Boot extends Phaser.Scene {
  constructor() {
    super({ key: key.scene.boot });
  }

  preload() {
    this.load.spritesheet(key.spritesheet.player, player, {
      frameWidth: 32,
      frameHeight: 32,
      margin: 1,
      spacing: 2,
    });

    this.load.image(key.image.box, box);
    this.load.image(key.image.spike, spike);
    this.load.image(key.image.tiles, tiles);

    this.load.audio(key.audio.jump, audio.jump.href);
    this.load.audio(key.audio.lose, audio.lose.href);
    this.load.audio(key.audio.win, audio.win.href);
  }

  create() {
    this.scene.start(key.scene.main, {
      level: this.getLevel(),
    });
  }

  private getLevel(): number {
    const searchParams = new URLSearchParams(location.search);
    const level = parseInt(searchParams.get('level') || '');
    if (!level || level < 1 || level > levels.length) {
      return 1;
    }
    return level;
  }
}
