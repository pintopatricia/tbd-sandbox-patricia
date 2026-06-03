const {
  TEST_ID,
  KEY_ZERO,
  KEY_ONE,
  KEY_TWO,
  KEY_THREE,
  KEY_FOUR,
  KEY_FIVE,
  KEY_SIX,
  KEY_SEVEN,
  KEY_EIGHT,
  KEY_NINE,
  KEY_DELETE,
  KEY_SEPARATOR,
} = require("@ppb/the-wall-native/components/Keyboard/Keyboard.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class KeyboardSO extends BaseSO {
  /**
   * Creates a fixed number field page object instance
   * @param {LazyElement} [lazyElement]
   */
  constructor(lazyElement) {
    super(lazyElement, $(`~${TEST_ID}`));
  }

  get zero() {
    return this.element.$(`~${KEY_ZERO}`);
  }

  get one() {
    return this.element.$(`~${KEY_ONE}`);
  }

  get two() {
    return this.element.$(`~${KEY_TWO}`);
  }

  get three() {
    return this.element.$(`~${KEY_THREE}`);
  }

  get four() {
    return this.element.$(`~${KEY_FOUR}`);
  }

  get five() {
    return this.element.$(`~${KEY_FIVE}`);
  }

  get six() {
    return this.element.$(`~${KEY_SIX}`);
  }

  get seven() {
    return this.element.$(`~${KEY_SEVEN}`);
  }

  get eight() {
    return this.element.$(`~${KEY_EIGHT}`);
  }

  get nine() {
    return this.element.$(`~${KEY_NINE}`);
  }

  get delete() {
    return this.element.$(`~${KEY_DELETE}`);
  }

  get separator() {
    return this.element.$(`~${KEY_SEPARATOR}`);
  }

  async clearInputField(numberField) {
    if ((await numberField.getText()) === "") {
      return;
    }

    await browser.waitUntilClickableNative(this.delete);
    await this.delete.click();

    await this.clearInputField(numberField);
  }
}

module.exports = KeyboardSO;
