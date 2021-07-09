import { Circle } from "@svgdotjs/svg.js";
import { colorToHex } from '../colorToHex';

const DEFAULT_SCALE_AMOUNT = 5;
const DEFAULT_MIN_SCALE = 5;

class ResizableCircle extends Circle {
  constructor({
    r = 50,
    scaleAmount = DEFAULT_SCALE_AMOUNT,
    minScale = DEFAULT_MIN_SCALE
  } = {}) {
    super();

    this.r = {
      radius: r
    };
    this.scaleAmount = scaleAmount;
    this.minScale = minScale;

    this.color = {
      r: 0,
      g: 0,
      b: 0
    };

    this.radius(this.r.radius);

    this.on('wheel', e => this._onWheel(e));
  }

  _onWheel({deltaY}) {
    if(deltaY > 0) {
      this.r.radius -= this.scaleAmount;
    } else {
      this.r.radius += this.scaleAmount;
    }

    this.r.radius = Math.max(this.r.radius, this.minScale);

    this.radius(this.r.radius);
  }

  _updateColor() {
    this.fill(colorToHex(this.color));
  }
}

export default ResizableCircle;
