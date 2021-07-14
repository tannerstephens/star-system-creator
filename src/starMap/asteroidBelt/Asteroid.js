import { Polygon, Svg } from "@svgdotjs/svg.js";

import { colorToHex } from '../colorToHex';

class Asteroid extends Polygon {
  /**
   *
   * @param {Svg} draw
   * @param {Number} x
   * @param {Number} y
   */
  constructor(draw, x, y, rng, scaleAmount, dragging, downFn, upFn, moveFn, wheelFn) {
    super();
    this.draw = draw;
    this.centerPos = {x, y};
    this.color = { r:0, g:0, b:0 };
    this.scaleAmount = scaleAmount;
    this.rng = rng;

    const points = this._generatePolygonPoints();

    this.plot(points);
    this.addTo(draw);
    this.size(scaleAmount);


    // Event Listeners
    this
      .on('mousedown', downFn)
      .on('mouseup', upFn)
      .on('mouseupoutside', upFn)
      .on('mousemoveglobal', moveFn)
      .on('wheel', wheelFn);

    this.css('cursor', 'pointer');

    if(dragging) { this.css('opacity', 0.75); }
  }

  _generatePolygonPoints() {
    const points = [];

    let theta = 0;

    while(theta < 6.28) {
      const r = (this.rng() * 3) + 5;

      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);

      points.push([x + this.centerPos.x, y + this.centerPos.y]);

      theta += (this.rng() * 0.8) + 0.2;
    }

    return points;
  }

  updateColor(color) {
    this.color = color;

    this.fill(colorToHex(this.color));
  }

  /**
   *
   * @param {Asteroid} asteroid
   */
  collides(asteroid) {
    const r1 = this.bbox();
    const r2 = asteroid.bbox();

    console.log(r1, r2, r2.x > r1.x2, r2.x2 < r1.x, r2.y > r1.y2, r2.y2 < r1.y);

    return !(r2.x > r1.x2 ||
            r2.x2 < r1.x ||
            r2.y > r1.y2 ||
            r2.y2 < r1.y);
  }
}

export default Asteroid;
