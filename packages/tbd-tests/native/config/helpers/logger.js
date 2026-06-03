/* eslint no-console: 0 */
/* eslint no-bitwise: 0 */

/**
 * Enum for color types.
 * @readonly
 * @enum {{name: string, color: string}}
 */
const ColorType = Object.freeze({
  Black: "30",
  Red: "31",
  Green: "32",
  Yellow: "33",
  Blue: "34",
  Magenta: "35",
  Cyan: "36",
  Gray: "37",
  BrightBlack: "90",
  BrightRed: "91",
  BrightGreen: "92",
  BrightYellow: "93",
  BrightBlue: "94",
  BrightCyan: "96",
});

/**
 * Logger for printing meaningful logs for WebDriverIO native.
 */
class Logger {
  /**
   * Base log function.
   * @param {ColorType} [colorTypes] A set of colors
   * @param {string} [messages] A set of messages
   */
  static log(colorTypes, messages) {
    const colorPattern = colorTypes.reduce((currentColorPattern, colorType, index) => {
      if (index === colorTypes.length - 1) {
        return `${currentColorPattern}\x1b[${colorType}m%s\x1b[0m`;
      }
      return `${currentColorPattern}\x1b[${colorType}m%s `;
    }, "");

    console.log(colorPattern, ...messages);
  }
}

module.exports = {
  Logger,
  ColorType,
};
