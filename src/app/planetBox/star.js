import { Sprite } from 'pixi.js';

import { circleTexture } from './constants';

class Star extends Sprite {
  constructor(starRadius, gui) {
    super(circleTexture);

    this.starRadius = starRadius;

    if(!this.texture.baseTexture.hasLoaded) {
      this.texture.baseTexture.on('loaded', () => this._updateSize());
    } else {
      this._updateSize();
    }

    this.anchor.set(0.5);

    this.color = {
      r: 0,
      g: 0,
      b: 0
    };

    this.tint = 0x000000;

    this.gui = gui.addFolder('Star');

    const colorFolder = this.gui.addFolder('Color');
    colorFolder.add(this.color, 'r', 0, 255).onChange(() => this._updateTint());
    colorFolder.add(this.color, 'g', 0, 255).onChange(() => this._updateTint());
    colorFolder.add(this.color, 'b', 0, 255).onChange(() => this._updateTint());
  }

  _updateTint() {
    this.tint = (this.color.r << 16) + (this.color.g << 8) + this.color.b;
  }

  _updateSize() {
    const targetWidth = this.starRadius*2;

    const scaleFactor = targetWidth / this.width;

    this.scale.set(scaleFactor);
  }
}

export default Star;
