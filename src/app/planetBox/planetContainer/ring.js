import { Circle, Container, Graphics } from 'pixi.js';
import { GUI } from 'dat.gui';

class Ring extends Container {
  /**
   *
   * @param {Number} r
   * @param {Number} width
   * @param {GUI} gui
   */
  constructor(x, y, r, thickness, gui, pc) {
    super();

    this.gui = gui;

    this.dragging = false;

    this.pc = pc;

    this.px = x;
    this.py = y;

    this.wheelScale = 0.5;
    this.minScale = 1.5;

    this.r = r;
    this.thickness = thickness;

    this.ringGraphics = null;

    this.color = {
      r: 0,
      g: 0,
      b: 0
    };

    this.gui.add(this, 'thickness', this.minScale).onChange(() => this._updateGraphics()).step(0.1);
    this.gui.add(this, 'r').onChange(() => this._updateGraphics()).step(0.1);

    const colorFolder = gui.addFolder('Color');
    colorFolder.add(this.color, 'r', 0, 255).onChange(() => this._updateTint());
    colorFolder.add(this.color, 'g', 0, 255).onChange(() => this._updateTint());
    colorFolder.add(this.color, 'b', 0, 255).onChange(() => this._updateTint());

    this._updateGraphics();
  }

  _updateGraphics() {
    this.removeChild(this.ringGraphics);
    this.ringGraphics = (new Graphics())
      .lineStyle(this.thickness, 0xffffff)
      .drawCircle(this.px, this.py, this.r);

    this._updateTint();

    this.ringGraphics.interactive = true;
    this.ringGraphics.hitArea = new Circle(this.px, this.py, this.r + 2)

    this.addChild(this.ringGraphics);

    this._addListeners();

    this.pc._orderRings();
  }

  _updateTint() {
    this.ringGraphics.tint = (this.color.r << 16) + (this.color.g << 8) + this.color.b;
  }

  _addListeners() {
    this.ringGraphics.on('wheel', e => this._wheel(e))
      .on('mousedown', e => this._dragStart(e))
      .on('mouseup', e => this._dragEnd(e))
      .on('mouseupoutside', e => this._dragEnd(e))
      .on('mousemove', e => this._mouseMove(e));
  }

  _scaleDown() {
    this.thickness -= this.wheelScale;

    if(this.thickness < this.minScale) {
      this.thickness = this.minScale;
    }
  }

  _scaleUp() {
    this.thickness += this.wheelScale;
  }

  _wheel({deltaY}) {
    if(deltaY > 0) {
      this._scaleDown();
    } else {
      this._scaleUp();
    }
    this._updateGraphics();
    this.gui.updateDisplay();
  }

  updateRoot(x) {
    this.px = x;

    this._updateGraphics();
  }

  _dragStart(e) {
    this.dragging = true;
    this.alpha = 0.75;
    this.data = e.data;
  }

  _dragEnd() {
    console.log('end');
    this.dragging = false;
    this.alpha = 1;
    this.data = null;
  }

  _mouseMove() {
    if (this.dragging)
    {
      const newPosition = this.data.getLocalPosition(this.parent);
      const x = newPosition.x - this.px;
      const y = newPosition.y - this.py;
      const d = Math.sqrt(x**2 + y**2);

      this.r = d;
      this._updateGraphics();
      this.gui.updateDisplay();
    }
  }
}

export default Ring;
