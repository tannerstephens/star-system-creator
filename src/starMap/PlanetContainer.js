import { Rect, Svg } from "@svgdotjs/svg.js";

import { GUI } from "dat.gui";
import Planet from "./planetContainer/Planet";

class PlanetContainer extends Rect {
  /**
   *
   * @param {Svg} draw
   * @param {GUI} gui
   */
  constructor(draw, gui) {
    super();

    this.draw = draw;

    this.size(draw.width(), draw.height());
    this.addTo(draw);
    this.css('opacity', '0');

    this.planets = [];

    this.gui = gui;
    this.planetNum = 1;

    this.gui.add({'Add Planet': () => this._createPlanet(draw.width() * Math.random())}, 'Add Planet');

    this.click(e => this._onClick(e));
  }

  _onClick(e) {
    const target = e.target;
    const bounds = target.getBoundingClientRect();

    const x = e.clientX - bounds.left;

    this._createPlanet(x);
  }

  _createPlanet(x) {
    const planetFolder = this.gui.addFolder(`Planet ${this.planetNum}`);

    this.planetNum += 1;

    this.planets.push(new Planet(this.draw, x, planetFolder));
  }
}

export default PlanetContainer;
