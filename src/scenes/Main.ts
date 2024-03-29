import Phaser from 'phaser';

import * as audio from '../assets/audio';
import { AudioKey, color, key, levels } from '../data';
import { Player, PlayerType } from '../sprites';
import { sendEvent } from '../utils/analytics';

export default class Main extends Phaser.Scene {
  private activePlayer: PlayerType = PlayerType.A;
  private groundLayer!: Phaser.Tilemaps.TilemapLayer;
  private isPlayerDead!: boolean;
  private levelData!: {
    level: number;
    json: object;
    music: AudioKey;
    text: string;
  };
  private levelStartTime!: number;
  private music!: Phaser.Sound.BaseSound;
  private playerA!: Player;
  private playerB!: Player;
  private spikeGroup!: Phaser.Physics.Arcade.StaticGroup;
  private tilemapKey!: string;

  constructor() {
    super({ key: key.scene.main });
  }

  /**
   * Initializes level.
   */
  init(data: { level: number; activePlayer: PlayerType }) {
    const { level } = data;
    const levelData = levels[level - 1];
    this.activePlayer = data.activePlayer;

    if (levelData) {
      this.levelData = {
        ...levelData,
        level,
      };
      sendEvent('level_start', { level });
      this.levelStartTime = Date.now();
    } else {
      // restart at level 1 when there are no more levels
      this.scene.start(key.scene.main, {
        activePlayer: this.activePlayer,
        level: 1,
      });
    }
  }

  /**
   * Preloads map and music.
   */
  preload() {
    this.tilemapKey = key.tilemap.map + this.levelData.level;
    this.load.tilemapTiledJSON(this.tilemapKey, this.levelData.json);
    this.load.audio(
      key.audio[this.levelData.music],
      audio[this.levelData.music].href,
    );
  }

  /**
   * Creates game objects.
   */
  create() {
    this.isPlayerDead = false;

    const map = this.make.tilemap({ key: this.tilemapKey });

    // First half of screen has white background
    this.add.rectangle(
      0,
      0,
      map.widthInPixels,
      map.heightInPixels * 2,
      color.whiteHex,
    );

    const tiles = map.addTilesetImage(
      '0x72-industrial-tileset-32px-extruded',
      key.image.tiles,
    )!;

    this.groundLayer = map.createLayer('Ground', tiles)!;
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
    const boxGroup = this.physics.add.group();
    this.groundLayer.forEachTile((tile) => {
      if (tile.index === 77) {
        const spike = this.spikeGroup.create(
          tile.getCenterX(),
          tile.getCenterY(),
          key.image.spike,
        ) as Phaser.Physics.Arcade.Sprite;
        spike.setTint(color.redHex);

        // The map has spikes rotated in Tiled (z key), so parse out that angle to the correct body placement
        spike.rotation = tile.rotation;
        const spikeBody = spike.body!;
        if (spike.angle === 0) {
          spikeBody.setSize(32, 6).setOffset(0, 26);
        } else if (spike.angle === -90) {
          spikeBody.setSize(6, 32).setOffset(26, 0);
        } else if (spike.angle === 90) {
          spikeBody.setSize(6, 32).setOffset(0, 0);
        }

        this.groundLayer.removeTileAt(tile.x, tile.y);
      }

      if (tile.index === 6) {
        const box = boxGroup.create(
          tile.getCenterX(),
          tile.getCenterY(),
          key.image.box,
        ) as Phaser.Physics.Arcade.Sprite;
        box.setFriction(1).setTint(color.blueHex);
        this.groundLayer.removeTileAt(tile.x, tile.y);
      }
    });

    [this.playerA, this.playerB, boxGroup, this.groundLayer].forEach((object) =>
      this.physics.world.addCollider(object, boxGroup),
    );

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    this.renderText();
    this.renderLevel(map);
    this.renderTitle(map);

    const inputKeyboard = this.input.keyboard!;

    // invert
    ['keydown-SPACE', 'keydown-I'].forEach((event) =>
      inputKeyboard.on(event, this.invertPlayers, this),
    );

    // restart
    inputKeyboard.on('keydown-R', () => {
      sendEvent('level_start', {
        level: this.levelData.level,
        restart: 'input',
        time: Date.now() - this.levelStartTime,
      });
      this.sound.play(key.audio.win, { rate: 50, volume: 0.5 });
      this.scene.restart({
        activePlayer: this.activePlayer,
        level: this.levelData.level,
      });
    });

    // start music loop
    if (!this.music) {
      this.playMusic();
    }
  }

  /**
   * Plays music.
   */
  private playMusic() {
    if (this.load.progress !== 1) {
      setTimeout(() => {
        this.playMusic();
      }, 150);
      return;
    }

    try {
      this.music = this.sound.add(this.levelData.music, {
        volume: 0.5,
      });
      this.music.play();
      this.music.once('complete', () => {
        this.playMusic();
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }

  /**
   * Inverts players.
   */
  private invertPlayers() {
    this.activePlayer =
      this.activePlayer === PlayerType.A ? PlayerType.B : PlayerType.A;
    this.sound.play(key.audio.win, { rate: 1.5, volume: 0.5 });
    this.playerA.toggleInversion();
    this.playerB.toggleInversion();
    sendEvent('invert', { level: this.levelData.level });
  }

  /**
   * Instantiate player instances at the location of the spawn point object in the Tiled map.
   */
  private spawnPlayers(map: Phaser.Tilemaps.Tilemap) {
    Object.values(PlayerType).forEach((playerType) => {
      const spawnPoint = map.findObject(
        'Objects',
        (object) => object.name === `Spawn${playerType}`,
      );

      this[`player${playerType}` as 'playerA' | 'playerB'] = new Player(
        this,
        spawnPoint?.x || 0,
        spawnPoint?.y || 0,
        this.activePlayer !== playerType, // inverted
        playerType,
      );
    });
  }

  /**
   * Wins and goes to next level when players overlap.
   */
  private overlapPlayers(playerA: Player, playerB: Player) {
    this.physics.add.overlap(
      playerA,
      playerB,
      () => {
        this.sound.play(key.audio.win, { rate: 3, volume: 0.5 });
        const { level } = this.levelData;
        sendEvent('level_end', {
          level,
          time: Date.now() - this.levelStartTime,
        });
        this.scene.start(key.scene.main, {
          activePlayer: this.activePlayer,
          level: level + 1,
        });
      },
      undefined,
      this,
    );
  }

  /**
   * Displays text on the top-left of the screen.
   */
  private renderText() {
    if (this.levelData.text) {
      this.add
        .text(32, 32, this.levelData.text, {
          font: '18px monospace',
          color: color.black,
        })
        .setScrollFactor(0);
    }
  }

  /**
   * Displays level number on the top-right of the screen.
   */
  private renderLevel(map: Phaser.Tilemaps.Tilemap) {
    this.add
      .text(map.widthInPixels - 124, 32, `Level ${this.levelData.level}`, {
        font: '18px monospace',
        color: color.white,
      })
      .setScrollFactor(0);
  }

  /**
   * Displays title in the center of the screen.
   */
  private renderTitle(map: Phaser.Tilemaps.Tilemap) {
    if (this.levelData.level > 1) {
      return;
    }
    [color.white, color.black].forEach((textColor) => {
      const text = this.add
        .text(map.widthInPixels / 2, map.heightInPixels / 2, 'INVERSION', {
          font: '180px Arial',
          color: textColor,
        })
        .setOrigin(0.5)
        .setScrollFactor(0);
      if (textColor === color.black) {
        text.setCrop(0, 0, 495, map.heightInPixels);
      }
    });
  }

  /**
   * Game loop.
   */
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

      this.sound.play(key.audio.lose, { volume: 0.5 });
      this.cameras.main.shake(100, 0.05);
      this.cameras.main.fade(250, 0, 0, 0);

      // Freeze the player to leave them on screen while fading but remove the marker immediately
      this.playerA.freeze();
      this.playerB.freeze();

      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.playerA.destroy();
        this.playerB.destroy();

        this.scene.restart({
          activePlayer: this.activePlayer,
          level: this.levelData.level,
        });

        sendEvent('level_start', {
          level: this.levelData.level,
          restart: 'dead',
          time: Date.now() - this.levelStartTime,
        });
      });
    }
  }
}
