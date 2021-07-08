import { Container } from 'pixi.js';
import { GUI } from 'dat.gui';

import Planet from './planetContainer/planet';
import Moon from './planetContainer/moon';
import Ring from './planetContainer/ring';


class PlanetContainer extends Container {
  /**
   *
   * @param {Number} x
   * @param {Number} y
   * @param {GUI} gui
   */
  constructor(x ,y, gui) {
    super();

    this.ringsContainer = new Container();
    this.addChild(this.ringsContainer);

    this.gui = gui;

    this.px = x;
    this.py = y;

    this.planet = new Planet(x, y, gui);
    this.addChild(this.planet);

    this.moonsFolder = this.gui.addFolder('Moons');
    this.ringsFolder = this.gui.addFolder('Rings');

    this.moonIndex = 1;
    this.ringIndex = 1;

    this.gui.add({'Add Moon': () => this._addMoon()}, 'Add Moon');
    this.gui.add({'Add Ring': () => this._addRing()}, 'Add Ring');

    this.moons = [];
    this.rings = [];
  }

  _updateX(x) {
    this.px = x;

    this.moons.forEach(moon => {
      moon.updateRoot(this.px);
    });

    this.rings.forEach(ring => {
      ring.updateRoot(this.px);
    });
  }

  _orderRings() {
    this.ringsContainer.children.sort((a, b) => b.r > a.r);
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

  _addRing() {
    const r = (this.planet.width / 2) + 100*Math.random() + 20;
    const width = 3;

    const ringFolder = this.ringsFolder.addFolder(`Ring ${this.ringIndex}`);
    this.ringIndex += 1;

    const ring = new Ring(this.px, this.py, r, width, ringFolder, this);

    ringFolder.add({'Delete': () => {
      this.ringsContainer.removeChild(ring);
      this.ringsFolder.removeFolder(ringFolder);
      this.rings.splice(this.rings.indexOf(ring), 1);
    }}, 'Delete');

    this.ringsContainer.addChild(ring);

    this._orderRings();

    this.rings.push(ring);
  }
}

export default PlanetContainer;
