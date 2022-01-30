import Phaser from 'phaser';

import { color, key, levels } from '../constants';
import { Player } from '../sprites';

export default class Main extends Phaser.Scene {
  private boxGroup!: Phaser.Physics.Arcade.Group;
  private groundLayer!: Phaser.Tilemaps.TilemapLayer;
  private isPlayerDead!: boolean;
  private level!: number;
  private playerA!: Player;
  private playerB!: Player;
  private spikeGroup!: Phaser.Physics.Arcade.StaticGroup;
  private tilemapKey!: string;

  constructor() {
    super({ key: key.scene.main });
  }

  init(data: { level: number }) {
    this.level = data.level;
  }

  preload() {
    const levelJSON = levels[this.level - 1];
    if (!levelJSON) {
      this.scene.start(key.scene.main, { level: 1 });
      return;
    }
    this.tilemapKey = key.tilemap.map + this.level;
    this.load.tilemapTiledJSON(this.tilemapKey, levelJSON);
  }

  create() {
    this.isPlayerDead = false;

    const map = this.make.tilemap({ key: this.tilemapKey });

    // First half of screen has white background
    this.add.rectangle(
      0,
      0,
      map.widthInPixels,
      map.heightInPixels * 2,
      color.whiteHex
    );

    const tiles = map.addTilesetImage(
      '0x72-industrial-tileset-32px-extruded',
      key.image.tiles
    );

    this.groundLayer = map.createLayer('Ground', tiles);
    this.spawnPlayers(map);
    this.overlapPlayers(this.playerA, this.playerB);

    // Collide the player against the ground layer
    this.groundLayer.setCollisionByProperty({ collides: true });
    this.physics.world.addCollider(this.playerA, this.groundLayer);
    this.physics.world.addCollider(this.playerB, this.groundLayer);

    // The map contains a row of spikes. The spike only take a small sliver of the tile graphic, so
    // if we let arcade physics treat the spikes as colliding, the player will collide while the
    // sprite is hovering over the spikes. We'll remove the spike tiles and turn them into sprites
    // so that we give them a more fitting hitbox
    this.spikeGroup = this.physics.add.staticGroup();
    this.boxGroup = this.physics.add.group();
    this.groundLayer.forEachTile((tile) => {
      if (tile.index === 77) {
        const spike = this.spikeGroup.create(
          tile.getCenterX(),
          tile.getCenterY(),
          key.image.spike
        ) as Phaser.Physics.Arcade.Sprite;
        spike.setTint(0xff6e6e);

        // The map has spikes rotated in Tiled (z key), so parse out that angle to the correct body placement
        spike.rotation = tile.rotation;
        if (spike.angle === 0) {
          spike.body.setSize(32, 6).setOffset(0, 26);
        } else if (spike.angle === -90) {
          spike.body.setSize(6, 32).setOffset(26, 0);
        } else if (spike.angle === 90) {
          spike.body.setSize(6, 32).setOffset(0, 0);
        }

        this.groundLayer.removeTileAt(tile.x, tile.y);
      }

      if (tile.index === 6) {
        const box = this.boxGroup.create(
          tile.getCenterX(),
          tile.getCenterY(),
          key.image.box
        ) as Phaser.Physics.Arcade.Sprite;
        box.setFriction(1);
        this.groundLayer.removeTileAt(tile.x, tile.y);
      }
    });

    [this.playerA, this.playerB, this.boxGroup, this.groundLayer].forEach(
      (object) => this.physics.world.addCollider(object, this.boxGroup)
    );

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    this.renderHelpText();

    this.input.keyboard.on('keydown-SPACE', this.invertPlayers, this);
  }

  private invertPlayers() {
    [this.playerA, this.playerB].forEach((player) => {
      player.toggleInversion();
    });
  }

  /**
   * Instantiate player instances at the location of the spawn point object in the Tiled map.
   */
  private spawnPlayers(map: Phaser.Tilemaps.Tilemap) {
    const spawnPointA = map.findObject(
      'Objects',
      (object) => object.name === 'SpawnA'
    );

    const spawnPointB = map.findObject(
      'Objects',
      (object) => object.name === 'SpawnB'
    );

    this.playerA = new Player(
      this,
      spawnPointA?.x || 0,
      spawnPointA?.y || 0,
      false
    );

    this.playerB = new Player(
      this,
      spawnPointB?.x || 0,
      spawnPointB?.y || 0,
      true // inverted
    );
  }

  private overlapPlayers(playerA: Player, playerB: Player) {
    this.physics.add.overlap(
      playerA,
      playerB,
      () => {
        this.scene.start(key.scene.main, { level: this.level + 1 });
      },
      undefined,
      this
    );
  }

  /**
   * Help text that has a "fixed" position on the screen
   */
  private renderHelpText() {
    let text = '';

    switch (this.level) {
      case 1:
        text = 'Arrow/WASD to move & jump';
        break;
      case 2:
        text = 'Press Spacebar to invert player';
        break;
      default:
        return;
    }

    this.add
      .text(32, 32, text, {
        font: '18px monospace',
        color: color.black,
      })
      .setScrollFactor(0);
  }

  update() {
    if (this.isPlayerDead) {
      return;
    }

    this.playerA.update();
    this.playerB.update();

    if (
      this.playerA.y > this.groundLayer.height ||
      this.playerB.y > this.groundLayer.height ||
      this.physics.world.overlap(this.playerA, this.spikeGroup) ||
      this.physics.world.overlap(this.playerB, this.spikeGroup)
    ) {
      // Flag that the player is dead so that we can stop update from running in the future
      this.isPlayerDead = true;

      this.cameras.main.shake(100, 0.05);
      this.cameras.main.fade(250, 0, 0, 0);

      // Freeze the player to leave them on screen while fading but remove the marker immediately
      this.playerA.freeze();
      this.playerB.freeze();

      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.playerA.destroy();
        this.playerB.destroy();
        this.scene.restart();
      });
    }
  }
}
