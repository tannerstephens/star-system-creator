import { Line, SVG } from '@svgdotjs/svg.js';

import { GUI } from 'dat.gui';
import { colorToHex } from './colorToHex';

class Axis extends Line {
  /**
   *
   * @param {SVG} draw
   * @param {GUI} gui
   */
  constructor(draw, gui) {
    super();

    const width = draw.width();
    const height = draw.height();

    this.plot(0, height / 2, width, height / 2);
    this.addTo(draw);

    this.color = {
      r: 170,
      g: 170,
      b: 170
    };

    this.lineWidth = 2;

    gui.add({'Toggle Visibility': () => this._toggleVisibility()}, 'Toggle Visibility');
    gui.add(this, 'lineWidth', 1).onChange(() => this._updateLine());

    const colorFolder = gui.addFolder('Color');

    colorFolder.add(this.color, 'r', 0, 255).onChange(() => this._updateLine());
    colorFolder.add(this.color, 'g', 0, 255).onChange(() => this._updateLine());
    colorFolder.add(this.color, 'b', 0, 255).onChange(() => this._updateLine());

    this._updateLine();
  }

  _updateLine() {
    this.stroke({width: this.lineWidth, color: colorToHex(this.color)});
  }

  _toggleVisibility() {
    this.visible() ? this.hide() : this.show();
  }
}

export default Axis;
