const { KEY_OVERLAY } = require("@ppb/the-wall-web/components/bricks/Key/Key.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class KeyPO extends BasePO {
  get overlay() {
    return this.element.$(KEY_OVERLAY);
  }
}

module.exports = KeyPO;
