import { Container, Graphics, Point, Rectangle, Renderer } from 'pixi.js';
import { GUI } from 'dat.gui';

import PlanetContainer from './planetBox/planetContainer';
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

    this.renderer = renderer;

    this.coverWidth = Math.floor((window.innerWidth - width) / 2);
    this.coverHeight = Math.floor((window.innerHeight - height) / 2);

    this.halfHeight = Math.floor(window.innerHeight / 2);

    const starRadius = (Math.pow(sagittaPx, 2) + Math.pow(height/2, 2)) / (2*sagittaPx);

    this.leftBoundingBox = createBoundingRectangle(this.coverWidth, window.innerHeight);
    this.topBoundingBox = createBoundingRectangle(window.innerWidth, this.coverHeight);
    this.rightBoundingBox = this.leftBoundingBox.clone();
    this.rightBoundingBox.position.x = window.innerWidth - this.coverWidth;
    this.bottomBoundingBox = this.topBoundingBox.clone();
    this.bottomBoundingBox.position.y = window.innerHeight - this.coverHeight;

    this.borderRectangle = (new Graphics()).lineStyle(3, 0x000000).drawRect(this.coverWidth, this.coverHeight, width, height);
    this.centralAxis = (new Graphics()).lineStyle(4, 0xaaaaaa).moveTo(0, this.halfHeight).lineTo(window.innerWidth, this.halfHeight);

    this.boundsContainer = new Container();

    const star = new Star(starRadius, gui);

    this.planetsFolder = this.gui.addFolder('Planets');

    this.gui.add({'Add Planet': () => {
      const minX = this.coverWidth;
      const maxX = window.innerWidth - this.coverWidth;

      const x = Math.floor(Math.random() * (maxX - minX) + minX);

      this._createPlanet(x, null, true);
    }}, 'Add Planet');

    star.position.y = this.halfHeight;
    star.position.x = this.coverWidth + sagittaPx - starRadius;

    this.planetContainer = new Container();

    this.boundsContainer.addChild(
      star,
      this.leftBoundingBox,
      this.rightBoundingBox,
      this.topBoundingBox,
      this.bottomBoundingBox,
      this.borderRectangle
    );

    this.planetIndex = 1;

    this.addChild(this.centralAxis);
    this.addChild(this.planetContainer);
    this.addChild(this.boundsContainer);

    this.interactive = true;
    this.hitArea = new Rectangle(this.coverWidth, this.coverHeight, width, height);

    this.on('mousedown', (e) => {
      const {data: {global: {x, y}}} = e;

      this._createPlanet(x, y)
    });
  }

  _createPlanet(x, y, force = false) {
    const point = new Point(x, y);

    const planetClicked = this.renderer.plugins.interaction.hitTest(point, this.planetContainer);

    if(!force && planetClicked) {
      return;
    }

    const planetName = `Planet ${this.planetIndex}`
    this.planetIndex += 1;

    const planetFolder = this.planetsFolder.addFolder(planetName);
    const planet = new PlanetContainer(x, this.halfHeight, planetFolder);
    this.planetContainer.addChild(planet);

    planetFolder.add({'Delete': () => {
      const confirmation = confirm(`Are you sure you want to delete ${planetName}?`);

      if(confirmation) {
        planet.removeChildren();

        this.planetsFolder.removeFolder(planetFolder);

        this.planetContainer.removeChild(planet);
      }
    }}, 'Delete');
  }
}

export default PlanetBox;
