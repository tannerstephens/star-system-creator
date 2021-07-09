import { GUI } from "dat.gui";
import ResizableCircle from "../ResizableCircle";
import { Svg } from "@svgdotjs/svg.js";
import { deleteFolder } from "../deleteFolder";
import { targetFolder } from '../../targetFolder';

Number.prototype.mod = function(n) {
  return ((this%n)+n)%n;
};


class Moon extends ResizableCircle {
  /**
   *
   * @param {Svg} draw
   * @param {GUI} gui
   */
  constructor(draw, x, y, r, theta, gui) {
    super({
      r: Math.random() * 5 + 2,
      scaleAmount: 3,
      minScale: 1
    });

    this.centerx = x;
    this.centery = y;

    this.polar = {
      r: r,
      theta: theta
    };

    this.gui = gui;

    this.dragging = false;

    this.addTo(draw);
    this.updateCenter();

    // GUI Setup
    gui.add(this.r, 'radius').onChange(() => this._updateRadius());
    gui.add(this.polar, 'r', 0).onChange(() => this.updateCenter());
    gui.add(this.polar, 'theta', 0, 6.28).onChange(() => this.updateCenter());

    const colorFolder = gui.addFolder('Color');

    colorFolder.add(this.color, 'r', 0, 255).onChange(() => this._updateColor());
    colorFolder.add(this.color, 'g', 0, 255).onChange(() => this._updateColor());
    colorFolder.add(this.color, 'b', 0, 255).onChange(() => this._updateColor());

    // Event Listeners
    this
      .on('mousedown', e => this._mouseDown(e))
      .on('mouseup', e => this._mouseUp(e))
      .on('mouseupoutside', e => this._mouseUp(e))
      .on('mousemoveglobal', e => this._mouseMove(e))
      .on('dblclick', () => targetFolder(this.gui));;
  }

  _updateRadius() {
    this.radius(this.r.radius);
  }

  _onWheel(e) {
    super._onWheel(e);
    this.gui.updateDisplay();
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

      this.center(x, y);
      this._updatePolarCoordinates();
    }
  }

  updateCenter() {
    const x = this.polar.r * Math.cos(this.polar.theta);
    const y = this.polar.r * Math.sin(this.polar.theta);

    this.center(x + this.centerx, y + this.centery);
  }

  _updatePolarCoordinates() {
    const x = this.x() - this.centerx;
    const y = this.y() - this.centery;

    this.polar.r = Math.sqrt(x**2 + y**2);
    this.polar.theta = Math.atan2(y, x).mod(6.28);
    this.updateCenter();

    this.gui.updateDisplay();
  }

  updateCenterX(x) {
    this.centerx = x;
    this.updateCenter();
  }
}

export default Moon;
