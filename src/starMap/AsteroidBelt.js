import Asteroid from "./asteroidBelt/Asteroid";
import { GUI } from "dat.gui";
import { Svg } from "@svgdotjs/svg.js";
import { targetFolder } from "./targetFolder";

class AsteroidBelt {
  /**
   *
   * @param {Svg} draw
   * @param {Number} x
   * @param {Number} y
   * @param {GUI} gui
   */
  constructor(draw, gui, x, y, numAsteroids) {
    this.draw = draw;
    this.centerPos = {x, y};
    this.gui = gui;
    this.numAsteroids = numAsteroids;
    this.asteroids = [];
    this.dragging = false;
    this.size = 300;
    this.width = 30;
    this.color = { r:0, g:0, b:0 };
    this.scale = 16;
    this.scaleStep = 0.5;

    this.passableDown = e => this._mouseDown(e);
    this.passableUp = e => this._mouseUp(e);
    this.passableMove = e => this._mouseMove(e);
    this.passableWheel = e => this._onWheel(e);

    this.gui.add({'Regenerate': () => this._regenerate()}, 'Regenerate');
    this.gui.add(this, 'numAsteroids', 1).onChange(() => this._regenerate());
    this.gui.add(this, 'size', 1).onChange(() => this._regenerate());
    this.gui.add(this, 'width', 1).onChange(() => this._regenerate());
    this.gui.add(this, 'scale', 1).onChange(() => this.asteroids.forEach(asteroid => asteroid.size(this.scale))).step(0.1);

    const colorFolder = gui.addFolder('Color');

    colorFolder.add(this.color, 'r', 0, 255).onChange(() => this._updateColor());
    colorFolder.add(this.color, 'g', 0, 255).onChange(() => this._updateColor());
    colorFolder.add(this.color, 'b', 0, 255).onChange(() => this._updateColor());

    this._createAsteroids();
  }

  _onWheel({deltaY}) {
    if(deltaY > 0) {
      this.scale -= this.scaleStep;
    } else {
      this.scale += this.scaleStep;
    }

    this.asteroids.forEach(asteroid => asteroid.size(this.scale));
    this.gui.updateDisplay();
  }

  _updateColor() {
    this.asteroids.forEach(asteroid => asteroid.updateColor(this.color));
  }

  _regenerate() {
    this._deleteAsteroids();
    this._createAsteroids();
  }

  _createAsteroids() {
    for(let i =0; i < this.numAsteroids; i++) {
      const x = this.centerPos.x + (Math.random() - 0.5) * this.width;
      const y = this.centerPos.y + (Math.random() - 0.5) * this.size;

      const asteroid = new Asteroid(this.draw, x, y, this.scale, this.dragging, this.passableDown, this.passableUp, this.passableMove, this.passableWheel);

      this.asteroids.push(asteroid);
    }
  }

  _deleteAsteroids() {
    this.asteroids.forEach(asteroid => asteroid.remove());
    this.asteroids.length = 0;
  }

  _mouseDown(e) {
    if(e.button == 2) {
      targetFolder(this.gui);
      return;
    }
    this.dragging = true;
    this.asteroids.forEach(asteroid => asteroid.css('opacity', '0.75'));
    this.data = e.data;
  }

  _mouseUp() {
    this.dragging = false;
    this.asteroids.forEach(asteroid => asteroid.css('opacity', '1'));
    this.data = null;
  }

  _mouseMove(e) {
    if (this.dragging)
    {
      const target = e.target.closest('svg');

      if(target == null) {
        return;
      }

      const bounds = target.getBoundingClientRect();

      const x = e.detail.clientX - bounds.left;

      this.centerPos.x = x;
      this._deleteAsteroids();
      this._createAsteroids();
    }
  }

  remove() {
    this._deleteAsteroids();
  }
}

export default AsteroidBelt;
