import { GUI } from "dat.gui";
import Moon from './planet/Moon';
import ResizableCircle from './ResizableCircle';
import Ring from "./planet/Ring";
import { Svg } from '@svgdotjs/svg.js';
import { deleteFolder } from "./deleteFolder";
import { targetFolder } from '../targetFolder';

class Planet extends ResizableCircle {
  /**
   * @param {Svg} draw
   * @param {Number} x
   * @param {GUI} gui
   */
  constructor(draw, x, gui) {
    super();

    this.draw = draw;

    this.centerPos = {
      x: x,
      y: draw.height() / 2
    };

    this.gui = gui;

    this.dragging = false;

    this.moons = [];
    this.moonNumber = 1;
    this.rings = [];
    this.ringNumber = 1;

    this.addTo(draw);
    this._updateCenter();


    // GUI Setup
    this.gui.add(this.centerPos, 'x').onChange(() => this._updateCenter());
    this.gui.add(this.r, 'radius').onChange(() => this._updateRadius());

    this.moonsFolder = this.gui.addFolder('Moons');
    this.moonsFolder.add({'Add Moon': () => this._addMoon()}, 'Add Moon');

    this.ringsFolder = this.gui.addFolder('Rings');
    this.ringsFolder.add({'Add Ring': () => this._addRing()}, 'Add Ring');

    const colorFolder = gui.addFolder('Color');

    colorFolder.add(this.color, 'r', 0, 255).onChange(() => this._updateColor());
    colorFolder.add(this.color, 'g', 0, 255).onChange(() => this._updateColor());
    colorFolder.add(this.color, 'b', 0, 255).onChange(() => this._updateColor());

    gui.add({'Delete': () => this._delete()}, 'Delete');

    // Event listeners
    this
      .on('mousedown', e => this._mouseDown(e))
      .on('mouseup', e => this._mouseUp(e))
      .on('mouseupoutside', e => this._mouseUp(e))
      .on('mousemoveglobal', e => this._mouseMove(e))
      .on('dblclick', () => targetFolder(this.gui));
  }

  _mouseDown(e) {
    if(e.button == 2) {
      targetFolder(this.gui);
      return;
    }
    this.dragging = true;
    this.css('opacity', '0.75');
    this.moons.forEach(moon => moon.css('opacity', '0.75'));
    this.rings.forEach(ring => ring.css('opacity', '0.75'));
    this.data = e.data;
  }

  _mouseUp() {
    this.dragging = false;
    this.css('opacity', '1');
    this.moons.forEach(moon => moon.css('opacity', '1'));
    this.rings.forEach(ring => ring.css('opacity', '1'));
    this.data = null;
  }

  _onWheel({deltaY}) {
    if(deltaY > 0) {
      this.r.radius -= this.scaleAmount;
    } else {
      this.r.radius += this.scaleAmount;
    }

    this.r.radius = Math.max(this.r.radius, this.minScale);

    this._updateRadius();
    this.gui.updateDisplay();
  }

  _updateRadius() {
    const oldR = this.width() / 2;

    this.radius(this.r.radius)

    const dR = this.r.radius - oldR;

    this.moons.forEach(moon => {
      moon.polar.r += dR;
      moon.updateCenter();
    });

    this.rings.forEach(ring => {
      ring.r += dR;
      ring.update();
    });
  }

  _mouseMove(e) {
    if (this.dragging)
    {
      const target = e.target.closest('svg');
      const bounds = target.getBoundingClientRect();

      const x = e.detail.clientX - bounds.left;
      this.centerPos.x = x;
      this._updateCenter();
      this.gui.updateDisplay();

      this.moons.forEach(moon => {
        moon.updateCenterX(x);
      });

      this.rings.forEach(ring => {
        ring.updateCenterX(x);
      });
    }
  }

  _updateCenter() {
    this.center(this.centerPos.x, this.centerPos.y);
  }

  _addMoon() {
    const r = (this.width() / 2) + 50*Math.random() + 20;
    const theta = Math.PI * 2 * Math.random();

    const moonFolder = this.moonsFolder.addFolder(`Moon ${this.moonNumber}`);

    this.moonNumber += 1;

    const moon = new Moon(this.draw, this.centerPos.x, this.centerPos.y, r, theta, moonFolder);

    moonFolder.add({'Delete': () => {
      deleteFolder(moonFolder);

      this.moons.splice(this.moons.indexOf(moon), 1);

      moon.remove();
    }}, 'Delete');

    this.moons.push(moon);
  }

  _addRing() {
    const r = (this.width() / 2) + 50*Math.random() + 20;

    const ringFolder = this.ringsFolder.addFolder(`Ring ${this.ringNumber}`);
    this.ringNumber += 1;

    const ring = new Ring(this.draw, this.centerPos.x, this.centerPos.y, r, 5, ringFolder);

    ringFolder.add({'Delete': () => {
      deleteFolder(ringFolder);

      this.rings.splice(this.rings.indexOf(ring), 1);

      ring.remove();
    }}, 'Delete');

    this.rings.push(ring)
  }

  _delete() {
    const confirmation = confirm(`Really delete ${this.gui.name}?`);

    if(!confirmation) {
      return;
    }

    deleteFolder(this.gui);

    this.moons.forEach(moon => moon.remove());
    this.rings.forEach(ring => ring.remove());

    this.remove();
  }
}

export default Planet;
