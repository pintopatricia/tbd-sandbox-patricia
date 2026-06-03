const { BaseSO } = require("@ppb/wdio-lazy-element");

const {
  MARKET_GRAPH,
  MARKET_GRAPH_HEADER,
  MARKET_GRAPH_WEBVIEW,
  MARKET_GRAPH_HEADER_TITLE,
  MARKET_GRAPH_HEADER_BUTTON,
  MARKET_GRAPH_EVENT_INFO,
  MARKET_GRAPH_MARKET_INFO,
} = require("./MarketGraph.native.selectors");

class MarketGraphSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${MARKET_GRAPH}`));
  }

  get header() {
    return this.element.$(`~${MARKET_GRAPH_HEADER}`);
  }

  get headerTitle() {
    return this.element.$(`~${MARKET_GRAPH_HEADER_TITLE}`);
  }

  get headerButton() {
    return this.element.$(`~${MARKET_GRAPH_HEADER_BUTTON}`);
  }

  get eventInfo() {
    return this.element.$(`~${MARKET_GRAPH_EVENT_INFO}`);
  }

  get marketInfo() {
    return this.element.$(`~${MARKET_GRAPH_MARKET_INFO}`);
  }

  get webview() {
    return this.element.$(`~${MARKET_GRAPH_WEBVIEW}`);
  }
}

module.exports = MarketGraphSO;
