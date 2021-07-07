import * as PIXI from 'pixi.js';

import PlanetBox from './app/planetBox';
import registerWheelEvent from './app/mousewheelEvent';

class App extends PIXI.Application {
  /**
   * @param {Window} window
   */
  constructor(window) {
    super({
      width: innerWidth,
      height: innerHeight,
      backgroundColor: 0xffffff,
      antialias: true
    });

    this.window = window;

    this.planetBox = new PlanetBox(Math.ceil(4.375 * 300), Math.ceil(1.375*300), this.window, 50, this.renderer);

    this.stage.addChild(this.planetBox);

    registerWheelEvent(this);
  }

  /**
   *
   * @param {HTMLElement} rootElement
   * @param {HTMLElement} document
   */
  display(rootElement, document) {
    document.body.style.margin = 0;

    this.renderer.view.style.position = "absolute";
    this.renderer.view.style.display = "block";
    this.renderer.autoResize = true;

    rootElement.parentNode.replaceChild(this.view, rootElement);
  }
}

export default App;
