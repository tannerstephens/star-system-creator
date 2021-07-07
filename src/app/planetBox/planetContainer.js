import { Container } from 'pixi.js';
import { GUI } from 'dat.gui';

import Planet from './planetContainer/planet';
import Moon from './planetContainer/moon';


class PlanetContainer extends Container {
  /**
   *
   * @param {Number} x
   * @param {Number} y
   * @param {GUI} gui
   */
  constructor(x ,y, gui, parentGui) {
    super();

    this.gui = gui;

    this.parentGui = parentGui

    this.px = x;
    this.py = y;

    this.planet = new Planet(x, y, gui);
    this.addChild(this.planet);

    this.gui.add({'Add Moon': () => this._addMoon()}, 'Add Moon');
    this.gui.add({'Delete': () => this._delete()}, 'Delete');

    this.moons = [];
  }

  _updateX(x) {
    this.px = x;

    this.moons.forEach(moon => {
      moon.updateRoot(this.px);
    });
  }

  _addMoon() {
    const r = (this.planet.width / 2) + 50*Math.random() + 20;
    const theta = Math.PI * 2 * Math.random();
    const scale = 0.05 * ((Math.random() /2) + 0.5);

    const moonFolder = this.gui.addFolder(`Moon ${this.moons.length + 1}`);

    const moon = new Moon(this.px, this.py, r, theta, scale, moonFolder);

    this.addChild(moon);

    this.moons.push(moon);
  }

  _delete() {
    const confirmation = confirm("Are you sure you want to delete this?");

    if(confirmation) {
      this.removeChildren();

      this.parentGui.removeFolder(this.gui);

      this.parent.removeChild(this);
    }
  }
}

export default PlanetContainer;
