import { Sprite, Texture } from 'pixi.js';

export const texture = Texture.from('./assets/planet.svg');

class Planet extends Sprite {
  constructor() {
    super(texture);

    this.anchor.set(0.5);
    this.scale.set(0.5);
    this.tint = 0x000000;
    this.interactive = true;

    this.wheelScale = 0.05;

    this.dragging = false;

    this.on('wheel', this._wheel)
      .on('mousedown', this._dragStart)
      .on('mouseup', this._dragEnd)
      .on('mouseupoutside', this._dragEnd)
      .on('mousemove', this._mouseMove);

  }

  _dragStart(e) {
    this.dragging = true;
    this.alpha = 0.75;
    this.data = e.data;
  }

  _dragEnd() {
    this.dragging = false;
    this.alpha = 1;
    this.data = null;
  }

  _mouseMove() {
    if (this.dragging)
    {
      const newPosition = this.data.getLocalPosition(this.parent);
      this.position.x = newPosition.x;
    }
  }

  _wheel({deltaY}) {
    if(deltaY > 0) {
      this._scaleDown();
    } else {
      this._scaleUp();
    }
  }

  _scaleDown() {
    this.scale.x -= this.wheelScale;
    this.scale.y -= this.wheelScale;
  }

  _scaleUp() {
    this.scale.x += this.wheelScale;
    this.scale.y += this.wheelScale;
  }
}

export default Planet;
