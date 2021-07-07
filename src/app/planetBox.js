import { Container, Graphics, Point, Rectangle, Renderer } from 'pixi.js';
import { GUI } from 'dat.gui';

import Planet from './planetBox/planet';
import Star from './planetBox/star';

export const createBoundingRectangle = (width, height) => {
  return (new Graphics())
  .beginFill(0xffffff)
  .drawRect(0,0,width,height);
}


class PlanetBox extends Container {
  /**
   *
   * @param {Number} width
   * @param {Number} height
   * @param {Window} window
   * @param {Number} sagittaPx
   * @param {Renderer} renderer
   * @param {GUI} gui
   */
  constructor(width, height, window, sagittaPx, renderer, gui) {
    super();

    this.gui = gui;

    const coverWidth = Math.floor((window.innerWidth - width) / 2);
    const coverHeight = Math.floor((window.innerHeight - height) / 2);

    const halfHeight = Math.floor(window.innerHeight / 2);

    const starRadius = (Math.pow(sagittaPx, 2) + Math.pow(height/2, 2)) / (2*sagittaPx);

    this.leftBoundingBox = createBoundingRectangle(coverWidth, window.innerHeight);
    this.topBoundingBox = createBoundingRectangle(window.innerWidth, coverHeight);
    this.rightBoundingBox = this.leftBoundingBox.clone();
    this.rightBoundingBox.position.x = window.innerWidth - coverWidth;
    this.bottomBoundingBox = this.topBoundingBox.clone();
    this.bottomBoundingBox.position.y = window.innerHeight - coverHeight;

    this.borderRectangle = (new Graphics()).lineStyle(3, 0x000000).drawRect(coverWidth, coverHeight, width, height);
    this.centralAxis = (new Graphics()).lineStyle(4, 0xaaaaaa).moveTo(0, halfHeight).lineTo(window.innerWidth, halfHeight);

    this.boundsContainer = new Container();

    const star = new Star(starRadius, gui);

    star.position.y = halfHeight;
    star.position.x = coverWidth + sagittaPx - starRadius;

    this.planetContainer = new Container();

    this.boundsContainer.addChild(
      star,
      this.leftBoundingBox,
      this.rightBoundingBox,
      this.topBoundingBox,
      this.bottomBoundingBox,
      this.borderRectangle
    );

    this.addChild(this.centralAxis);
    this.addChild(this.planetContainer);
    this.addChild(this.boundsContainer);

    this.interactive = true;
    this.hitArea = new Rectangle(coverWidth, coverHeight, width, height);

    this.on('mousedown', (e) => {
      const {data: {global: {x, y}}} = e;

      const point = new Point(x, y);

      const planetClicked = renderer.plugins.interaction.hitTest(point, this.planetContainer);

      if(planetClicked) {
        return;
      }

      const planetFolder = this.gui.addFolder(`Planet ${this.planetContainer.children.length + 1}`);
      const planet = new Planet(planetFolder);
      planet.position.set(x, halfHeight);
      planetFolder.updateDisplay();
      this.planetContainer.addChild(planet);
    });
  }
}

export default PlanetBox;
