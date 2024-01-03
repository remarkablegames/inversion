import Phaser from 'phaser';

import { color, key } from '../data';

enum Animation {
  Idle = 'Idle',
  Run = 'Run',
}

type Cursors = Record<
  'w' | 'a' | 's' | 'd' | 'up' | 'left' | 'down' | 'right',
  Phaser.Input.Keyboard.Key
>;

export default class Player extends Phaser.Physics.Arcade.Sprite {
  body!: Phaser.Physics.Arcade.Body;
  private cursors: Cursors;
  private isInverted: boolean;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    isInverted: boolean,
    texture = key.spritesheet.player,
    frame = 0,
  ) {
    super(scene, x, y, texture, frame);

    // Add cursor keys
    this.cursors = this.createCursorKeys();

    // Primary player is set to false
    this.isInverted = isInverted;

    // Add the sprite to the scene
    scene.add.existing(this);

    // Enable physics for the sprite
    scene.physics.world.enable(this);

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
   * Track the arrow keys & WASD.
   */
  private createCursorKeys() {
    return this.scene.input.keyboard!.addKeys(
      'w,a,s,d,up,left,down,right',
    ) as Cursors;
  }

  /**
   * Creates sprite animations.
   */
  private createAnimations() {
    // Create the animations we need from the player spritesheet
    const anims = this.scene.anims;

    if (!anims.exists(Animation.Idle)) {
      anims.create({
        key: Animation.Idle,
        frames: anims.generateFrameNumbers(key.spritesheet.player, {
          start: 0,
          end: 3,
        }),
        frameRate: 3,
        repeat: -1,
      });
    }

    if (!anims.exists(Animation.Run)) {
      anims.create({
        key: Animation.Run,
        frames: anims.generateFrameNumbers(key.spritesheet.player, {
          start: 8,
          end: 15,
        }),
        frameRate: 12,
        repeat: -1,
      });
    }
  }

  /**
   * Sprite update loop.
   */
  update() {
    const { isInverted, cursors } = this;
    const onGround = this.body.blocked.down || this.body.touching.down;
    const acceleration = onGround ? 600 : 150;
    const invertedMultiplier = this.isInverted ? -1 : 1;

    // Apply horizontal acceleration when left/a or right/d are applied
    if (cursors.left.isDown || cursors.a.isDown) {
      this.setAccelerationX(-acceleration * invertedMultiplier);
      // No need to have a separate set of graphics for running to the left & to the right.
      // Instead we can just mirror the sprite
      this.setFlipX(isInverted ? false : true);
    } else if (cursors.right.isDown || cursors.d.isDown) {
      this.setAccelerationX(acceleration * invertedMultiplier);
      this.setFlipX(isInverted ? true : false);
    } else {
      this.setAccelerationX(0);
    }

    // Only allow the player to jump if they are on the ground
    if (onGround && (cursors.up.isDown || cursors.w.isDown)) {
      this.setVelocityY(-500);
      this.scene.sound.play(key.audio.jump, { volume: 0.5 });
    }

    // Update the animation/texture based on the state of the player
    if (onGround) {
      if (this.body.velocity.x !== 0) {
        this.anims.play(Animation.Run, true);
      } else {
        this.anims.play(Animation.Idle, true);
      }
    } else {
      this.anims.stop();
      this.setTexture(key.spritesheet.player, 10);
    }
  }
}
