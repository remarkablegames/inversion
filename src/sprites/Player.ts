import Phaser from 'phaser';

import { color, key } from '../data';

enum Animation {
  PlayerIdle = 'player-idle',
  PlayerRun = 'player-run',
}

interface Keys {
  up: Phaser.Input.Keyboard.Key;
  left: Phaser.Input.Keyboard.Key;
  right: Phaser.Input.Keyboard.Key;
  w: Phaser.Input.Keyboard.Key;
  a: Phaser.Input.Keyboard.Key;
  d: Phaser.Input.Keyboard.Key;
}

export default class Player extends Phaser.Physics.Arcade.Sprite {
  body!: Phaser.Physics.Arcade.Body;
  private keys: Keys;
  private isInverted: boolean;

  constructor(scene: Phaser.Scene, x: number, y: number, isInverted: boolean) {
    super(scene, x, y, key.spritesheet.player);

    // Primary player is set to false
    this.isInverted = isInverted;

    // Add the sprite to the scene
    scene.add.existing(this);

    // Enable physics for the sprite
    scene.physics.world.enable(this);

    // Track the arrow keys & WASD
    const { UP, LEFT, RIGHT, W, A, D } = Phaser.Input.Keyboard.KeyCodes;
    this.keys = scene.input.keyboard!.addKeys({
      up: UP,
      left: LEFT,
      right: RIGHT,
      w: W,
      a: A,
      d: D,
    }) as Keys;

    // Create sprite animations
    this.createAnimations();

    // Create the physics-based sprite that we will move around and animate
    this.setDrag(785, 0)
      .setMaxVelocity(150, 785)
      .setSize(18, 24)
      .setOffset(7, 9);

    // Set player facing direction
    this.setFlipX(this.isInverted);

    // Set primary player color
    if (!this.isInverted) {
      this.toggleTint(!this.isInverted);
    }
  }

  /**
   * Stops body movement.
   */
  freeze() {
    this.body.moves = false;
  }

  /**
   * Toggles player inversion.
   */
  toggleInversion() {
    this.isInverted = !this.isInverted;
    this.toggleTint(!this.isInverted);
  }

  /**
   * Toggles player tint.
   */
  private toggleTint(isTinted: boolean) {
    if (isTinted) {
      this.setTint(color.blueHex);
    } else {
      this.clearTint();
    }
  }

  /**
   * Creates sprite animations.
   */
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

  /**
   * Sprite update loop.
   */
  update() {
    const { isInverted, keys } = this;
    const onGround = this.body.blocked.down || this.body.touching.down;
    const acceleration = onGround ? 600 : 150;
    const invertedMultiplier = this.isInverted ? -1 : 1;

    // Apply horizontal acceleration when left/a or right/d are applied
    if (keys.left.isDown || keys.a.isDown) {
      this.setAccelerationX(-acceleration * invertedMultiplier);
      // No need to have a separate set of graphics for running to the left & to the right. Instead
      // we can just mirror the sprite
      this.setFlipX(isInverted ? false : true);
    } else if (keys.right.isDown || keys.d.isDown) {
      this.setAccelerationX(acceleration * invertedMultiplier);
      this.setFlipX(isInverted ? true : false);
    } else {
      this.setAccelerationX(0);
    }

    // Only allow the player to jump if they are on the ground
    if (onGround && (keys.up.isDown || keys.w.isDown)) {
      this.setVelocityY(-500);
      this.scene.sound.play(key.audio.jump, { volume: 0.5 });
    }

    // Update the animation/texture based on the state of the player
    if (onGround) {
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
