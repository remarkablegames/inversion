import Phaser from 'phaser';

import { key } from '../constants';

enum Animation {
  PlayerIdle = 'player-idle',
  PlayerRun = 'player-run',
}

export default class Player extends Phaser.Physics.Arcade.Sprite {
  body!: Phaser.Physics.Arcade.Body;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private isInverted: boolean;

  constructor(scene: Phaser.Scene, x: number, y: number, isInverted: boolean) {
    super(scene, x, y, key.spritesheet.player);

    this.isInverted = isInverted;

    // Add the sprite to the scene
    scene.add.existing(this);

    // Enable physics for the sprite
    scene.physics.world.enable(this);

    // Add cursor keys
    this.cursors = scene.input.keyboard.createCursorKeys();

    // Create sprite animations
    this.createAnimations();

    // Create the physics-based sprite that we will move around and animate
    this.setDrag(1000, 0)
      .setMaxVelocity(300, 400)
      .setSize(18, 24)
      .setOffset(7, 9);

    // Set player facing direction
    this.setFlipX(this.isInverted);
  }

  freeze() {
    this.body.moves = false;
  }

  toggleInversion() {
    this.isInverted = !this.isInverted;
  }

  private createAnimations() {
    // Create the animations we need from the player spritesheet
    const anims = this.scene.anims;
    anims.create({
      key: Animation.PlayerIdle,
      frames: anims.generateFrameNumbers(key.spritesheet.player, {
        start: 0,
        end: 3,
      }),
      frameRate: 3,
      repeat: -1,
    });

    anims.create({
      key: Animation.PlayerRun,
      frames: anims.generateFrameNumbers(key.spritesheet.player, {
        start: 8,
        end: 15,
      }),
      frameRate: 12,
      repeat: -1,
    });
  }

  update() {
    const acceleration = this.body.blocked.down ? 600 : 200;
    const invertedMultiplier = this.isInverted ? -1 : 1;

    // Apply horizontal acceleration when left/a or right/d are applied
    if (this.cursors.left.isDown) {
      this.setAccelerationX(-acceleration * invertedMultiplier);
      // No need to have a separate set of graphics for running to the left & to the right. Instead
      // we can just mirror the sprite
      this.setFlipX(this.isInverted ? false : true);
    } else if (this.cursors.right.isDown) {
      this.setAccelerationX(acceleration * invertedMultiplier);
      this.setFlipX(this.isInverted ? true : false);
    } else {
      this.setAccelerationX(0);
    }

    // Only allow the player to jump if they are on the ground
    if (this.body.blocked.down && this.cursors.up.isDown) {
      this.setVelocityY(-500);
    }

    // Update the animation/texture based on the state of the player
    if (this.body.blocked.down) {
      if (this.body.velocity.x !== 0) {
        this.anims.play(Animation.PlayerRun, true);
      } else {
        this.anims.play(Animation.PlayerIdle, true);
      }
    } else {
      this.anims.stop();
      this.setTexture(key.spritesheet.player, 10);
    }
  }
}
