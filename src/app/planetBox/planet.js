import { Sprite, Texture } from 'pixi.js';

export const texture = Texture.from('./assets/planet.svg');

class Planet extends Sprite {
  constructor() {
    super(texture);

    this.anchor.set(0.5);
    this.scale.set(0.5);
    this.tint = 0x000000;
    this.interactive = true;

    this.on('wheel', ({deltaY}) => {
      if(deltaY > 0) {
        this._scaleDown();
      } else {
        this._scaleUp();
      }
    })
  }

  _scaleDown() {
    this.scale.x -= 0.05;
    this.scale.y -= 0.05;
  }

  _scaleUp() {
    this.scale.x += 0.05;
    this.scale.y += 0.05;
  }
}

export default Planet;
