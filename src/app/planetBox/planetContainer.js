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
  constructor(x ,y, gui) {
    super();

    this.gui = gui;

    this.px = x;
    this.py = y;

    this.planet = new Planet(x, y, gui);
    this.addChild(this.planet);

    this.moonsFolder = this.gui.addFolder('Moons');

    this.moonIndex = 1;

    this.gui.add({'Add Moon': () => this._addMoon()}, 'Add Moon');

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

    const moonFolder = this.moonsFolder.addFolder(`Moon ${this.moonIndex}`);
    this.moonIndex += 1;

    const moon = new Moon(this.px, this.py, r, theta, scale, moonFolder);

    moonFolder.add({'Delete': () => {
      this.removeChild(moon);
      this.moonsFolder.removeFolder(moonFolder);
      this.moons.splice(this.moons.indexOf(moon), 1);
    }}, 'Delete');

    this.addChild(moon);

    this.moons.push(moon);

  }
}

export default PlanetContainer;
