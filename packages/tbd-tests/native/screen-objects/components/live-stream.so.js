const { LIVE_STREAM, WEBVIEW, PAGINATION } = require("@ppb/the-wall-native/components/LiveStream/LiveStream.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class LiveStreamSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${LIVE_STREAM}`));
  }

  get webviews() {
    return this.element.$$(`~${WEBVIEW}`);
  }

  get pagination() {
    return this.element.$(`~${PAGINATION}`);
  }
}

module.exports = LiveStreamSO;
