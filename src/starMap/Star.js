import { Circle, SVG } from '@svgdotjs/svg.js';

import { GUI } from 'dat.gui';
import { colorToHex } from './colorToHex';
import { targetFolder } from './targetFolder';

class Star extends Circle {
  /**
   *
   * @param {SVG} draw
   * @param {GUI} gui
   * @param {Object} options
   */
  constructor(draw, gui, {
    sagitta = 50
  } = {}) {
    super();

    const height = draw.height();
    const starRadius = (Math.pow(sagitta, 2) + Math.pow(height/2, 2)) / (2*sagitta);

    this.radius(starRadius);
    this.addTo(draw);
    this.center(-starRadius + sagitta, height / 2);

    const colorFolder = gui.addFolder('Color');

    this.color = {
      r: 0,
      g: 0,
      b: 0
    };

    colorFolder.add(this.color, 'r', 0, 255).onChange(() => this._updateColor());
    colorFolder.add(this.color, 'g', 0, 255).onChange(() => this._updateColor());
    colorFolder.add(this.color, 'b', 0, 255).onChange(() => this._updateColor());

    this
      .on('dblclick', () => targetFolder(gui))
      .on('mousedown', e => {
        if(e.button == 2) {
          targetFolder(gui);
          return;
        }
      });
  }

  _updateColor() {
    this.fill(colorToHex(this.color));
  }
}

export default Star
