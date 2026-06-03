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
} = require("@ppb/the-wall-web/components/walls/Keyboard//Keyboard.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class KeyboardPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get zero() {
    return this.element.$(KEY_ZERO);
  }

  get one() {
    return this.element.$(KEY_ONE);
  }

  get two() {
    return this.element.$(KEY_TWO);
  }

  get three() {
    return this.element.$(KEY_THREE);
  }

  get four() {
    return this.element.$(KEY_FOUR);
  }

  get five() {
    return this.element.$(KEY_FIVE);
  }

  get six() {
    return this.element.$(KEY_SIX);
  }

  get seven() {
    return this.element.$(KEY_SEVEN);
  }

  get eight() {
    return this.element.$(KEY_EIGHT);
  }

  get nine() {
    return this.element.$(KEY_NINE);
  }

  get delete() {
    return this.element.$(KEY_DELETE);
  }

  get separator() {
    return this.element.$(KEY_SEPARATOR);
  }

  async clearInputField(numberField) {
    if ((await numberField.getValue()) === "") {
      return;
    }

    await this.delete.waitForClickable();
    await this.delete.click();

    await this.clearInputField(numberField);
  }
}

module.exports = KeyboardPO;
