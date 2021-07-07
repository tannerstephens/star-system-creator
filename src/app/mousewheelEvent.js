import { Application, Point } from "pixi.js";

/**
 * @param {Application} app
 */
export default (app) => {
  app.view.addEventListener('wheel', e => {
    const mousePosition = new Point();

    mousePosition.set(e.clientX, e.clientY);

    const found = app.renderer.plugins.interaction.hitTest(
      mousePosition,
      app.stage
    );

    if(found) { found.emit('wheel', e); }
  })
};
