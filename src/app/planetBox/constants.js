import { SVGResource, Texture } from 'pixi.js';

export const circle = new SVGResource('./assets/planet.svg', {scale: 3});
export const smallCircle = new SVGResource('./assets/planet.svg');

export const circleTexture = Texture.from(circle);
export const planetTexture = Texture.from(smallCircle);
