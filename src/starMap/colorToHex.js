export const _componentToHex = c => {
  var hex = Math.floor(c).toString(16);
  return hex.length == 1 ? "0" + hex : hex;
};

/**
 * @param {object} color
 * @returns {String}
 */
export const colorToHex = color => {
  return '#' + _componentToHex(color.r) + _componentToHex(color.g) + _componentToHex(color.b);
};
