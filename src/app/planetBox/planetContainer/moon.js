import { Sprite } from 'pixi.js';
import { planetTexture } from '../constants';

import {GUI} from 'dat.gui';

Number.prototype.mod = function(n) {
  return ((this%n)+n)%n;
};


class Moon extends Sprite {
  /**
   *
   * @param {*} x
   * @param {*} y
   * @param {*} r
   * @param {*} theta
   * @param {*} scale
   * @param {GUI} gui
   */
  constructor(x, y, r, theta, scale, gui) {
    super(planetTexture);

    this.gui = gui;

    this.px = x;
    this.py = y;
    this.r = r;
    this.theta = theta;

    this.scale.set(scale);
    this.tint = 0x000000;
    this.anchor.set(0.5);

    this.wheelScale = 0.01;
    this.minScale = 0.01;

    this.moonScale = this.scale.x;

    this.interactive = true;

    this.color = {
      r: 0,
      g: 0,
      b: 0
    };

    this.on('wheel', this._wheel)
      .on('mousedown', this._dragStart)
      .on('mouseup', this._dragEnd)
      .on('mouseupoutside', this._dragEnd)
      .on('mousemove', this._mouseMove);

    this._updatePosition();

    gui.add(this, 'r').onChange(() => this._updatePosition()).step(0.1);
    gui.add(this, 'theta', 0, Math.PI * 2).onChange(() => this._updatePosition()).step(0.01);
    gui.add(this, 'moonScale', this.minScale).onChange(() => this._updateScale()).step(0.01);

    const colorFolder = gui.addFolder('Color');
    colorFolder.add(this.color, 'r', 0, 255).onChange(() => this._updateTint());
    colorFolder.add(this.color, 'g', 0, 255).onChange(() => this._updateTint());
    colorFolder.add(this.color, 'b', 0, 255).onChange(() => this._updateTint());

  }

  _updateTint() {
    this.tint = (this.color.r << 16) + (this.color.g << 8) + this.color.b;
  }

  _updateScale() {
    this.scale.set(this.moonScale);
  }

  _updatePosition() {
    const x = this.r * Math.cos(this.theta);
    const y = this.r * Math.sin(this.theta);


    this.position.set(x + this.px, y + this.py);
  }

  updateRoot(x) {
    this.px = x;

    this._updatePosition();
  }

  _dragStart(e) {
    this.dragging = true;
    this.alpha = 0.75;
    this.data = e.data;
    this.oldPos = e.data.getLocalPosition(this.parent);
  }

  _dragEnd() {
    this.dragging = false;
    this.alpha = 1;
    this.data = null;
    this.oldPos = null;
  }

  _mouseMove() {
    if (this.dragging)
    {
      const newPosition = this.data.getLocalPosition(this.parent);

      const dx = newPosition.x - this.oldPos.x;

      this.oldPos = newPosition;

      this.theta += dx * 0.0174533;

      this.theta = this.theta.mod(6.28);
      this._updatePosition();
      this.gui.updateDisplay();
    }
  }

  _wheel({deltaY}) {
    if(deltaY > 0) {
      this._scaleDown();
    } else {
      this._scaleUp();
    }
    this.moonScale = this.scale.x;
    this.gui.updateDisplay();
  }

  _scaleDown() {
    this.scale.x -= this.wheelScale;
    this.scale.y -= this.wheelScale;

    if(this.scale.x < this.minScale) {
      this.scale.set(this.minScale);
    }
  }

  _scaleUp() {
    this.scale.x += this.wheelScale;
    this.scale.y += this.wheelScale;
  }
}

export default Moon;
