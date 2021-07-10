import { GUI } from "dat.gui";
import { colorToHex } from '../../colorToHex';
import { deleteFolder } from "../deleteFolder";
import { targetFolder } from '../../targetFolder';

const { Path, Svg } = require("@svgdotjs/svg.js");


const createRingPath = radius => {
  return `M0,${radius}a${radius},${radius} 0 1,0 ${radius*2},0a${radius},${radius} 0 1,0 -${radius*2},0`
};


class Ring extends Path {
  /**
   *
   * @param {Svg} draw
   * @param {Number} x
   * @param {Number} y
   * @param {Number} r
   * @param {Number} width
   * @param {GUI} gui
   */
  constructor(draw, x, y, r, width, gui) {
    super();

    this.draw = draw;
    this.r = r;

    this.centerPos = {
      x: x,
      y: y
    };

    this.ringWidth = width;
    this.gui = gui;

    this.scaleAmount = 0.5;
    this.minLineWidth = 0.5;

    this.color = {
      r: 0,
      g: 0,
      b: 0
    };

    this.addTo(this.draw);
    this._drawRing();
    this.css('fill', 'none');

    // GUI Setup
    gui.add(this, 'r').onChange(() => this._drawRing());
    gui.add(this, 'ringWidth', 1).onChange(() => this._drawRing()).step(0.1);

    const colorFolder = gui.addFolder('Color');

    colorFolder.add(this.color, 'r', 0, 255).onChange(() => this._drawRing());
    colorFolder.add(this.color, 'g', 0, 255).onChange(() => this._drawRing());
    colorFolder.add(this.color, 'b', 0, 255).onChange(() => this._drawRing());

    // Register events
    this
      .on('mousedown', e => this._mouseDown(e))
      .on('mouseup', e => this._mouseUp(e))
      .on('mouseupoutside', e => this._mouseUp(e))
      .on('wheel', e => this._onWheel(e))
      .on('mousemoveglobal', e => this._mouseMove(e))
      .on('dblclick', () => targetFolder(this.gui));
  }

  _onWheel({deltaY}) {
    if(deltaY > 0) {
      this.ringWidth -= this.scaleAmount;
    } else {
      this.ringWidth += this.scaleAmount;
    }

    this.ringWidth = Math.max(this.minLineWidth, this.ringWidth);

    this._drawRing();
    this.gui.updateDisplay();
  }

  _drawRing() {
    this.plot(createRingPath(this.r));
    this.stroke({width: this.ringWidth, color: colorToHex(this.color)});
    this.center(this.centerPos.x, this.centerPos.y);
  }

  _mouseDown(e) {
    if(e.button == 2) {
      targetFolder(this.gui);
      return;
    }
    this.dragging = true;
    this.css('opacity', '0.75');
    this.data = e.data;
  }

  _mouseUp() {
    this.dragging = false;
    this.css('opacity', '1');
    this.data = null;
  }

  _mouseMove(e) {
    if (this.dragging)
    {
      const target = e.target.closest('svg');
      const bounds = target.getBoundingClientRect();

      const x = e.detail.clientX - bounds.left;
      const y = e.detail.clientY - bounds.top;

      const distance = Math.sqrt((x - this.centerPos.x) ** 2 + (y - this.centerPos.y) ** 2);

      this.r = distance;
      this._drawRing();
      this.gui.updateDisplay();
    }
  }

  updateCenterX(x) {
    this.centerPos.x = x;

    this._drawRing();
  }

  update() {
    this._drawRing();
    this.gui.updateDisplay();
  }
}


export default Ring;
