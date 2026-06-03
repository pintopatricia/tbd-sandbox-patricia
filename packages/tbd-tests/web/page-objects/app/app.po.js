const dataApp = require("@ppb/tbd-shared/components/App/App.desktop.web.modules.json");
const dataBetslip = require("@ppb/tbd-shared/components/Betslip/EmptyBetslip/EmptyBetslip.web.modules.json");
const { BasePO } = require("@ppb/wdio-lazy-element");
const CardPO = require("../components/card.po");
const SportsbookMarketPO = require("../components/sportsbook-market.po");
const SportsbookBetButtonPO = require("../components/sportsbook-bet-button.po");
const RunnerPO = require("../components/runner.po");
const ExchangeBetButtonPO = require("../snowflakes/ExchangeBetButton.po");
const ExchangeMarketPO = require("../snowflakes/ExchangeMarket.po");

const ROOT_ID = "[id$=root]";

module.exports = class AppPO extends BasePO {
  /**
   * Creates an backToCurrent page object instance
   * @param {LazyElement} lazyElement
   */

  constructor(lazyElement) {
    super(lazyElement, $(ROOT_ID));
  }

  get stickyHeader() {
    // HEADER_SPACE_ID from StickyHeader.types.ts
    return this.element.$("#sticky-space");
  }

  get desktopHeader() {
    return this.element.$("#ssc-header-container");
  }

   
  getParsedPreloadedState = async () => {
    const element = $(`${ROOT_ID} + script`);
    const preloadedInnerHTML = await element.getHTML(false);
    return JSON.parse(preloadedInnerHTML.match(/window.__PRELOADED_STATE__ = ({.*})/)[1]);
  };

  static exchangeRunnerBetButtonHasPrice({ market, runnerIndex = 0, betButtonIndex = 0, price, isHorseRacing }) {
    if (!market) {
      throw new Error("market must be defined");
    }
    const firstCardPO = new CardPO(market);
    const exchangeMarketPO = new ExchangeMarketPO(firstCardPO.exchangeMarket);
    const firstRunnerExchangePO = new RunnerPO(
      isHorseRacing ? exchangeMarketPO.horseRacingRunnerList[runnerIndex] : exchangeMarketPO.runnerList[runnerIndex],
    );
    const betButtonPO = new ExchangeBetButtonPO(firstRunnerExchangePO.exchangeBetButtons[betButtonIndex]);
    return async () => (await betButtonPO.odd.getText()) === price.toString();
  }

  static sportsbookRunnerBetButtonHasPrice({ market, runnerIndex = 0, price, isHorseRacing }) {
    if (!market) {
      throw new Error("market must be defined");
    }
    const cardPO = new CardPO(market);
    const sportsbookMarketPO = new SportsbookMarketPO(cardPO.sportsbookMarket);
    return async () => {
      let runnerPO;
      if (isHorseRacing) {
        await browser.waitUntil(async () => (await sportsbookMarketPO.horseRacingRunnerList.length) > 0, {
          timeout: 5000,
          timeoutMsg: "Runners list does not contain any element",
        });
        runnerPO = new RunnerPO(sportsbookMarketPO.horseRacingRunnerList[runnerIndex]);
      } else {
        await browser.waitUntil(async () => (await sportsbookMarketPO.runnerList.length) > 0, {
          timeout: 5000,
          timeoutMsg: "Runners list does not contain any element",
        });
        runnerPO = new RunnerPO(sportsbookMarketPO.runnerList[runnerIndex]);
      }
      await browser.waitUntilDisplayed(runnerPO.sportsbookBetButton, "Sportsbook bet button not displayed");
      const betButtonPO = new SportsbookBetButtonPO(runnerPO.sportsbookBetButton);
      return (await betButtonPO.odd.getText()) === price.toString();
    };
  }

  static waitUntilElementDoNotHaveClass({ market, testClass }) {
    if (!market) {
      throw new Error("market must be defined");
    }
    const firstCardPO = new CardPO(market);
    const exchangeMarketPO = new ExchangeMarketPO(firstCardPO.exchangeMarket);
    const firstRunnerExchangePO = new RunnerPO(exchangeMarketPO.runnerList[0]);
    const betButtonPO = new ExchangeBetButtonPO(firstRunnerExchangePO.exchangeBetButtons[0]);
    return async () => {
      const className = await betButtonPO.element.getAttribute("class");
      return className.indexOf(testClass) === -1;
    };
  }

  get scrollableDiv() {
    return this.element.$(dataApp.scrollable);
  }

  get container() {
    return this.element.$(dataBetslip.container);
  }

  get virtuals() {
    return this.element.$(`(//div[contains(text(), "Virtuals")])[1]`);
  }

  get football() {
    return this.element.$(`(//div[contains(text(), "Football")])[1]`);
  }
};
