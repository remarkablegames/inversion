import Phaser from 'phaser';

import spike from '../assets/images/0x72-industrial-spike.png';
import player from '../assets/spritesheets/0x72-industrial-player-32px-extruded.png';
import map from '../assets/tilemaps/level1.json';
import tiles from '../assets/tilesets/0x72-industrial-tileset-32px-extruded.png';
import { key } from '../constants';

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
    this.load.image(key.image.spike, spike);
    this.load.image(key.image.tiles, tiles);
    this.load.tilemapTiledJSON(key.tilemap.map, map);
  }

  create() {
    this.scene.start(key.scene.main);
  }
}
