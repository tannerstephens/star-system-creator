import { Sprite } from 'pixi.js';
import { GUI } from 'dat.gui';
import { planetTexture } from '../constants';


class Planet extends Sprite {
  /**
   *
   * @param {GUI} gui
   * @param {} updateParentX
   */
  constructor(x, y, gui) {
    super(planetTexture);

    this.gui = gui;

    this.position.set(x, y);

    this.scale.set(0.5);
    this.anchor.set(0.5);
    this.planetScale = this.scale.x;
    this.tint = 0x000000;
    this.interactive = true;

    this.wheelScale = 0.05;

    this.minScale = 0.02;

    this.color = {
      r: 0,
      g: 0,
      b: 0
    };

    this.dragging = false;

    this.on('wheel', this._wheel)
      .on('mousedown', this._dragStart)
      .on('mouseup', this._dragEnd)
      .on('mouseupoutside', this._dragEnd)
      .on('mousemove', this._mouseMove);

    gui.add(this.position, 'x').onChange(() => this.parent._updateX(this.position.x));
    gui.add(this, 'planetScale', this.minScale).onChange(() => this._updateScale()).step(0.01);

    const colorFolder = gui.addFolder('Color');
    colorFolder.add(this.color, 'r', 0, 255).onChange(() => this._updateTint());
    colorFolder.add(this.color, 'g', 0, 255).onChange(() => this._updateTint());
    colorFolder.add(this.color, 'b', 0, 255).onChange(() => this._updateTint());

    gui.updateDisplay();
  }

  _updateTint() {
    this.tint = (this.color.r << 16) + (this.color.g << 8) + this.color.b;
  }

  _updateScale() {
    const planetRadius = this.width / 2;
    this.scale.set(this.planetScale);
    const newPlanetRadius = this.width / 2;

    const dr = newPlanetRadius - planetRadius;

    this.parent.moons.forEach(moon => {
      moon.r += dr;
      moon._updatePosition();
    });
  }

  _dragStart(e) {
    this.dragging = true;
    this.alpha = 0.75;
    this.data = e.data;
    this.parent.moons.forEach(moon => moon.alpha = 0.75);
  }

  _dragEnd() {
    this.dragging = false;
    this.alpha = 1;
    this.data = null;
    this.parent.moons.forEach(moon => moon.alpha = 1);
  }

  _mouseMove() {
    if (this.dragging)
    {
      const newPosition = this.data.getLocalPosition(this.parent);
      this.position.x = newPosition.x;
      this.parent._updateX(newPosition.x);
      this.gui.updateDisplay();
    }
  }

  _wheel({deltaY}) {
    if(deltaY > 0) {
      this._scaleDown();
    } else {
      this._scaleUp();
    }
    this.planetScale = this.scale.x;
    this.gui.updateDisplay();
  }

  _scaleDown() {
    const planetRadius = this.width / 2;

    this.scale.x -= this.wheelScale;
    this.scale.y -= this.wheelScale;

    if(this.scale.x < this.minScale) {
      this.scale.set(this.minScale);
    }

    const newPlanetRadius = this.width / 2;

    const dr = newPlanetRadius - planetRadius;

    this.parent.moons.forEach(moon => {
      moon.r += dr;
      moon._updatePosition();
    });
  }

  _scaleUp() {
    const planetRadius = this.width / 2;

    this.scale.x += this.wheelScale;
    this.scale.y += this.wheelScale;

    const newPlanetRadius = this.width / 2;

    const dr = newPlanetRadius - planetRadius;

    this.parent.moons.forEach(moon => {
      moon.r += dr;
      moon._updatePosition();
    });
  }
}

export default Planet;
