import * as PIXI from 'pixi.js';
import * as dat from 'dat.gui';

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
      backgroundColor: 0xfffdf5,
      antialias: true
    });

    this.pbWidth = Math.ceil(4.375 * 300); // 4.375 in at 300 DPI
    this.pbHeight = Math.ceil(1.375 * 300); // 1.375 in at 300 DPI

    this.gui = new dat.GUI();
    this.gui.domElement.id = 'gui';

    this.window = window;

    const mapGui = this.gui.addFolder('Map');

    this.planetBox = new PlanetBox(this.pbWidth, this.pbHeight, this.window, 50, this.renderer, mapGui);

    this.stage.addChild(this.planetBox);

    registerWheelEvent(this);

    this.gui.add(this, 'export');
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

  export() {
    this.renderer.render(this.stage);
    const dataURL = this.renderer.view.toDataURL('image/png');

    const image = new Image();

    image.onload = () => {
      const newCanvas = document.createElement('canvas');
      newCanvas.width = this.pbWidth;
      newCanvas.height = this.pbHeight;

      newCanvas.getContext('2d').drawImage(image, -this.planetBox.coverWidth, -this.planetBox.coverHeight);

      const a = document.createElement('a');
      a.href = newCanvas.toDataURL('image/png');
      a.download = "map.png";
      a.click();
    }

    image.src = dataURL;
  }
}

export default App;
