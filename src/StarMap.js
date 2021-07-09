import * as dat from 'dat.gui';

import Axis from './starMap/Axis';
import PlanetContainer from './starMap/PlanetContainer';
import Star from './starMap/Star';
import { Svg } from '@svgdotjs/svg.js';

export const MAX_WIDTH = 1313;
export const MAX_HEIGHT = 413;


class StarMap extends Svg {
  /**
   * @param {HTMLElement} rootElement
   * @param {Window} window
   */
  constructor(rootElement, window) {
    super();

    this.gui = new dat.GUI();
    this.gui.domElement.id = 'gui';

    const starSystemFolder = this.gui.addFolder('Star System');
    const backgroundColorFolder = this.gui.addFolder('Background Color');
    const axisFolder = this.gui.addFolder('Axis');

    this.gui.add({'Export SVG': () => this.exportSVG()}, 'Export SVG');
    this.gui.add({'Export PNG': () => this.exportPNG()}, 'Export PNG');

    this.backgroundColor = {
      r: 255,
      g: 253,
      b: 245
    };

    this._updateBackgroundColor();

    this.addTo(rootElement);

    this.window = window;

    this._adjustCanvasSize();


    const starFolder = starSystemFolder.addFolder('Star');
    const planetsFolder = starSystemFolder.addFolder('Planets');

    this.axis = new Axis(this, axisFolder);
    this.PlanetContainer = new PlanetContainer(this, planetsFolder);
    this.star = new Star(this, starFolder);

    this.window.addEventListener('mouseup', e => this.children().forEach(child => child.fire('mouseupoutside', e)));
    this.window.addEventListener('mousemove', e => this.children().forEach(child => child.fire('mousemoveglobal', e)));

    backgroundColorFolder.add(this.backgroundColor, 'r', 0, 255).onChange(() => this._updateBackgroundColor());
    backgroundColorFolder.add(this.backgroundColor, 'g', 0, 255).onChange(() => this._updateBackgroundColor());
    backgroundColorFolder.add(this.backgroundColor, 'b', 0, 255).onChange(() => this._updateBackgroundColor());

    this.on('contextmenu', e => e.preventDefault());
  }


  _adjustCanvasSize() {
    let width = MAX_WIDTH;
    let height = MAX_HEIGHT;

    if(this.window.innerWidth < this.maxWidth) {
      width = this.window.innerWidth - 10;
      height = (width / this.maxWidth) * this.maxHeight;
    }

    this.size(width, height);
  }

  _updateBackgroundColor() {
    this.css('background-color', `rgb(${this.backgroundColor.r}, ${this.backgroundColor.g}, ${this.backgroundColor.b})`);
  }

  exportSVG() {
    this.css('background-color', `rgba(0,0,0,0)`);

    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(this.node);

    //add name spaces.
    if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
      source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    if(!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)){
      source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    }

    source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

    const url = "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(source);

    const link = document.createElement('a');

    link.download = 'Star System.svg';
    link.href = url;
    link.click();

    this._updateBackgroundColor();
  }

  exportPNG() {
    const canvas = document.createElement('canvas');
    const loader = new Image();

    loader.width = canvas.width = this.width();
    loader.height = canvas.height = this.height();

    loader.onload = () => {
      var ctx = canvas.getContext('2d');
      ctx.fillStyle = `rgb(${this.backgroundColor.r}, ${this.backgroundColor.g}, ${this.backgroundColor.b})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(loader, 0, 0);

      const link = document.createElement('a');

      link.download = 'Star System.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }

    const source = (new XMLSerializer()).serializeToString(this.node);
    loader.src = 'data:image/svg+xml,' + encodeURIComponent(source);
  }

}

export default StarMap;
