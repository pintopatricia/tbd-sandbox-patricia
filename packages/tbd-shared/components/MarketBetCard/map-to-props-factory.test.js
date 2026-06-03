import {
  MY_BETS_EXC_BOTTOM_SHEET_OPEN,
  MY_BETS_SUBSCRIBE_CARD_UPDATES,
  MY_BETS_UNSUBSCRIBE_CARD_UPDATES,
  UI__MY_BETS_CANCEL_ALL_UNMATCHED_PRESS,
} from "@ppb/tbd-store/actions/my-bets";
import { PUSH } from "@ppb/tbd-store/actions/router";
import { createExchangeMarketBetSelector } from "@ppb/tbd-store/state/betting/exchange-market-bets/exchange-market-bets-selectors";
import { createCardGroupByURNSelector } from "@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors";
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { createGetMyBetsFiltersStateSelector } from "@ppb/tbd-store/state/layout/cards/my-bets/my-bets-selectors";
import { OrderTypeFilterItem } from "@ppb/tbd-store/state/layout/cards/MyBets.types";
import { i18n } from "../../helpers/i18n";
import { makeMapDispatchToProps, makeMapStateToProps } from "./map-to-props-factory";

const getCountryLocalCurrencyCodeSelector = jest.fn();

jest.mock("../../helpers/i18n", () => ({ i18n: jest.fn(({ key }) => key) }));

jest.mock("@ppb/tbd-store/state/layout/cards/cards-selectors", () => ({
  createCardByURNSelector: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/betting/exchange-market-bets/exchange-market-bets-selectors", () => ({
  createExchangeMarketBetSelector: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors", () => ({
  createCardGroupByURNSelector: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  createGetCountryLocalCurrencyCodeSelector: jest.fn(() => () => ({
    currencyCode: "EUR",
  })),
}));

jest.mock("@ppb/tbd-store/state/layout/cards/my-bets/my-bets-selectors", () => ({
  createGetMyBetsFiltersStateSelector: jest.fn(),
}));

jest.mock("../../formatters/currency-formatters", () => ({
  currencyFormatWithDecimalPlaces: jest.fn().mockReturnValue("formatted value"),
}));

const MatchedStatusFilterItem = {
  Matched: "matched",
  Unmatched: "unmatched",
};

const DEFAULT_STATE = {
  betting: {
    exchangecashouts: {
      "exchange-cashout-quote-urn-mock": {
        typename: "ExchangeCashoutQuote",
        urn: "exchange-cashout-quote-urn-mock",
        marketURN: "market-urn-mock",
        marketBetURN: "market-bet-urn-mock",
        status: "status-mock",
        step: "step-mock",
      },
    },
    exchangemarketbets: {
      "market-bet-urn-mock": {
        urn: "market-bet-urn-mock",
        typename: "MarketBet",
        marketId: "market-id-mock",
        cashoutQuotesURNs: ["exchange-cashout-quote-urn-mock"],
        betDelay: 0,
        exchangeLightMarketViewLink: {
          viewUrn: "unmatched-light-market-link-urn-mock",
          viewUrl: "unmatched-light-market-link-url-mock",
        },
      },
    },
  },
  layouts: {
    cards: {
      marketbetcard: {
        "market-bet-card-mock-urn": {
          typename: "MarketBetCard",
          urn: "market-bet-card-mock-urn",
          marketBetURN: "market-bet-urn-mock",
          betCardGroupURN: "bet-cardgroup-mock-urn",
          numberOfBets: 1,
          numberOfUnmatched: 0,
          liability: undefined,
          commission: undefined,
          profit: undefined,
          netProfit: undefined,
        },
      },
    },
    cardgroups: {
      betcardgroups: {
        "bet-cardgroup-mock-urn": {
          typename: "BetCardGroup",
          urn: "bet-cardgroup-mock-urn",
          aggregatorDesc: "aggregator-desc-mock",
        },
      },
    },
    views: {
      mybets: {
        "my-bets-view-urn": {
          urn: "my-bets-view-urn",
        },
      },
    },
  },
};

describe("makeMapStateToProps", () => {
  function setup(state, containerProps = {}) {
    return makeMapStateToProps()(state, containerProps);
  }

  beforeEach(jest.clearAllMocks);

  describe("when getCardByURN does not return a market bet card", () => {
    it("should return an empty object", () => {
      createCardByURNSelector.mockReturnValue(() => undefined);

      expect(setup(DEFAULT_STATE)).toEqual({});
    });
  });

  describe("when getExchangeMarketBetByURN does not return a exchange market bet", () => {
    it("should return an empty object", () => {
      createCardByURNSelector.mockReturnValue(() => ({
        typename: "MarketBetCard",
        urn: "market-bet-card-mock-urn",
        marketBetURN: "market-bet-urn-mock",
      }));

      createExchangeMarketBetSelector.mockReturnValue(() => undefined);
      createCardGroupByURNSelector.mockReturnValue(() => undefined);
      createGetMyBetsFiltersStateSelector.mockReturnValue(() => ({}));

      expect(setup(DEFAULT_STATE, { urn: "exchange-market-bets-mock" })).toEqual({});
    });
  });

  describe("when urn corresponds to an ExchangeMarketBet", () => {
    it("should return the correct state props", () => {
      createCardByURNSelector.mockReturnValue(
        () => DEFAULT_STATE.layouts.cards.marketbetcard["market-bet-card-mock-urn"],
      );

      createExchangeMarketBetSelector.mockReturnValue(
        () => DEFAULT_STATE.betting.exchangemarketbets["market-bet-urn-mock"],
      );

      createCardGroupByURNSelector.mockReturnValue(
        () => DEFAULT_STATE.layouts.cardgroups.betcardgroups["bet-cardgroup-mock-urn"],
      );

      createGetMyBetsFiltersStateSelector.mockReturnValue(() => ({ orderTypeFilter: OrderTypeFilterItem.Open }));

      expect(setup(DEFAULT_STATE, { urn: "market-bet-card-mock-urn" })).toEqual({
        cashoutQuotesURNs: ["exchange-cashout-quote-urn-mock"],
        marketId: "market-id-mock",
        numOfBets: 1,
        numOfUnmatched: 0,
        showCancelAll: false,
        title: "",
        urn: "market-bet-card-mock-urn",
        liability: "--",
        liabilityLabel: "I18N.BETSLIP.LIABILITY",
        isUnmatched: false,
        isOpen: true,
        marketBetCardGroupURN: [],
        aggregatorDescription: "aggregator-desc-mock",
        cancelAllLabel: "I18N.CANCEL_ALL",
        commission: "--",
        commissionLabel: "I18N.MY_BETS.COMMISSION",
        netProfit: "--",
        netProfitRaw: undefined,
        netProfitLabel: "I18N.MY_BETS.NET_PROFIT",
        profit: "--",
        profitLabel: "I18N.MY_BETS.GROSS_PROFIT",
        exchangeLightMarketViewLink: {
          viewUrl: "unmatched-light-market-link-url-mock",
          viewUrn: "unmatched-light-market-link-urn-mock",
        },
      });
    });

    describe("when matchedStatus is unmatched", () => {
      it("should return the isUnmatched as true and cashoutQuotes list as empty array", () => {
        createCardByURNSelector.mockReturnValue(() => ({
          ...DEFAULT_STATE.layouts.cards.marketbetcard["market-bet-card-mock-urn"],
          matchedStatus: MatchedStatusFilterItem.Unmatched,
          numberOfBets: 3,
          numberOfUnmatched: 2,
        }));

        createExchangeMarketBetSelector.mockReturnValue(
          () => DEFAULT_STATE.betting.exchangemarketbets["market-bet-urn-mock"],
        );

        createCardGroupByURNSelector.mockReturnValue(
          () => DEFAULT_STATE.layouts.cardgroups.betcardgroups["bet-cardgroup-mock-urn"],
        );

        createGetMyBetsFiltersStateSelector.mockReturnValue(() => ({ orderTypeFilter: OrderTypeFilterItem.Settled }));

        expect(setup(DEFAULT_STATE, { urn: "market-bet-card-mock-urn" })).toEqual({
          cashoutQuotesURNs: [],
          marketId: "market-id-mock",
          numOfBets: 3,
          numOfUnmatched: 2,
          showCancelAll: true,
          title: "",
          urn: "market-bet-card-mock-urn",
          liability: "--",
          liabilityLabel: "I18N.BETSLIP.LIABILITY",
          isUnmatched: true,
          isOpen: false,
          marketBetCardGroupURN: [],
          aggregatorDescription: "aggregator-desc-mock",
          cancelAllLabel: "I18N.CANCEL_ALL",
          commission: "--",
          commissionLabel: "I18N.MY_BETS.COMMISSION",
          netProfit: "--",
          netProfitRaw: undefined,
          netProfitLabel: "I18N.MY_BETS.NET_PROFIT",
          profit: "--",
          profitLabel: "I18N.MY_BETS.GROSS_PROFIT",
          exchangeLightMarketViewLink: {
            viewUrl: "unmatched-light-market-link-url-mock",
            viewUrn: "unmatched-light-market-link-urn-mock",
          },
        });
      });
    });
  });

  describe("when cashoutQuotesURNs is null", () => {
    it("should return the correct state props", () => {
      createCardByURNSelector.mockReturnValue(
        () => DEFAULT_STATE.layouts.cards.marketbetcard["market-bet-card-mock-urn"],
      );

      createExchangeMarketBetSelector.mockReturnValue(() => ({
        ...DEFAULT_STATE.betting.exchangemarketbets["market-bet-urn-mock"],
        cashoutQuotesURNs: null,
      }));

      createCardGroupByURNSelector.mockReturnValue(() => {});

      createGetMyBetsFiltersStateSelector.mockReturnValue(() => ({
        orderTypeFilter: OrderTypeFilterItem.Open,
      }));

      expect(setup(DEFAULT_STATE, { urn: "market-bet-card-mock-urn" })).toEqual({
        cashoutQuotesURNs: [],
        marketId: "market-id-mock",
        numOfBets: 1,
        numOfUnmatched: 0,
        showCancelAll: false,
        title: "",
        urn: "market-bet-card-mock-urn",
        liability: "--",
        liabilityLabel: "I18N.BETSLIP.LIABILITY",
        isUnmatched: false,
        isOpen: true,
        marketBetCardGroupURN: [],
        aggregatorDescription: undefined,
        cancelAllLabel: "I18N.CANCEL_ALL",
        commission: "--",
        commissionLabel: "I18N.MY_BETS.COMMISSION",
        netProfit: "--",
        netProfitRaw: undefined,
        netProfitLabel: "I18N.MY_BETS.NET_PROFIT",
        profit: "--",
        profitLabel: "I18N.MY_BETS.GROSS_PROFIT",
        exchangeLightMarketViewLink: {
          viewUrl: "unmatched-light-market-link-url-mock",
          viewUrn: "unmatched-light-market-link-urn-mock",
        },
      });
    });
  });

  describe("when marketName and marketBetCardGroupURN are available", () => {
    it("should return the correct state props with marketName and marketBetCardGroupURN defined", () => {
      createCardByURNSelector.mockReturnValue(() => ({
        ...DEFAULT_STATE.layouts.cards.marketbetcard["market-bet-card-mock-urn"],
        liability: 1,
      }));

      createExchangeMarketBetSelector.mockReturnValue(() => ({
        ...DEFAULT_STATE.betting.exchangemarketbets["market-bet-urn-mock"],
        liability: 1,
        description: "description-mock",
        marketBetCardGroupURN: "market-bet-card-group-urn-mock",
      }));

      createCardGroupByURNSelector.mockReturnValue(
        () => DEFAULT_STATE.layouts.cardgroups.betcardgroups["bet-cardgroup-mock-urn"],
      );

      createGetMyBetsFiltersStateSelector.mockReturnValue(() => ({ orderTypeFilter: OrderTypeFilterItem.Open }));

      expect(setup(DEFAULT_STATE, { urn: "market-bet-card-mock-urn" })).toEqual({
        cashoutQuotesURNs: ["exchange-cashout-quote-urn-mock"],
        marketId: "market-id-mock",
        numOfBets: 1,
        numOfUnmatched: 0,
        showCancelAll: false,
        title: "description-mock",
        urn: "market-bet-card-mock-urn",
        liability: "formatted value",
        liabilityLabel: "I18N.BETSLIP.LIABILITY",
        isUnmatched: false,
        isOpen: true,
        marketBetCardGroupURN: "market-bet-card-group-urn-mock",
        aggregatorDescription: "aggregator-desc-mock",
        cancelAllLabel: "I18N.CANCEL_ALL",
        commission: "--",
        commissionLabel: "I18N.MY_BETS.COMMISSION",
        netProfit: "--",
        netProfitRaw: undefined,
        netProfitLabel: "I18N.MY_BETS.NET_PROFIT",
        profit: "--",
        profitLabel: "I18N.MY_BETS.GROSS_PROFIT",
        exchangeLightMarketViewLink: {
          viewUrl: "unmatched-light-market-link-url-mock",
          viewUrn: "unmatched-light-market-link-urn-mock",
        },
      });
    });
  });

  describe("when liability is available", () => {
    it("should return the correct state props", () => {
      createCardByURNSelector.mockReturnValue(() => ({
        ...DEFAULT_STATE.layouts.cards.marketbetcard["market-bet-card-mock-urn"],
        liability: 1,
      }));

      createExchangeMarketBetSelector.mockReturnValue(() => ({
        ...DEFAULT_STATE.betting.exchangemarketbets["market-bet-urn-mock"],
        liability: 1,
      }));

      createCardGroupByURNSelector.mockReturnValue(
        () => DEFAULT_STATE.layouts.cardgroups.betcardgroups["bet-cardgroup-mock-urn"],
      );

      createGetMyBetsFiltersStateSelector.mockReturnValue(() => ({ orderTypeFilter: OrderTypeFilterItem.Open }));

      expect(setup(DEFAULT_STATE, { urn: "market-bet-card-mock-urn" })).toEqual({
        cashoutQuotesURNs: ["exchange-cashout-quote-urn-mock"],
        marketId: "market-id-mock",
        numOfBets: 1,
        numOfUnmatched: 0,
        showCancelAll: false,
        title: "",
        urn: "market-bet-card-mock-urn",
        liability: "formatted value",
        liabilityLabel: "I18N.BETSLIP.LIABILITY",
        isUnmatched: false,
        isOpen: true,
        marketBetCardGroupURN: [],
        aggregatorDescription: "aggregator-desc-mock",
        cancelAllLabel: "I18N.CANCEL_ALL",
        commission: "--",
        commissionLabel: "I18N.MY_BETS.COMMISSION",
        netProfit: "--",
        netProfitRaw: undefined,
        netProfitLabel: "I18N.MY_BETS.NET_PROFIT",
        profit: "--",
        profitLabel: "I18N.MY_BETS.GROSS_PROFIT",
        exchangeLightMarketViewLink: {
          viewUrl: "unmatched-light-market-link-url-mock",
          viewUrn: "unmatched-light-market-link-urn-mock",
        },
      });
    });
  });

  describe("when liability is not available", () => {
    it("should return the correct state props", () => {
      createCardByURNSelector.mockReturnValue(
        () => DEFAULT_STATE.layouts.cards.marketbetcard["market-bet-card-mock-urn"],
      );

      createExchangeMarketBetSelector.mockReturnValue(() => ({
        ...DEFAULT_STATE.betting.exchangemarketbets["market-bet-urn-mock"],
      }));

      createCardGroupByURNSelector.mockReturnValue(
        () => DEFAULT_STATE.layouts.cardgroups.betcardgroups["bet-cardgroup-mock-urn"],
      );

      createGetMyBetsFiltersStateSelector.mockReturnValue(() => ({ orderTypeFilter: OrderTypeFilterItem.Settled }));

      expect(setup(DEFAULT_STATE, { urn: "market-bet-card-mock-urn" })).toEqual({
        cashoutQuotesURNs: ["exchange-cashout-quote-urn-mock"],
        marketId: "market-id-mock",
        numOfBets: 1,
        numOfUnmatched: 0,
        showCancelAll: false,
        title: "",
        urn: "market-bet-card-mock-urn",
        liability: "--",
        liabilityLabel: "I18N.BETSLIP.LIABILITY",
        isUnmatched: false,
        isOpen: false,
        marketBetCardGroupURN: [],
        aggregatorDescription: "aggregator-desc-mock",
        cancelAllLabel: "I18N.CANCEL_ALL",
        commission: "--",
        commissionLabel: "I18N.MY_BETS.COMMISSION",
        netProfit: "--",
        netProfitRaw: undefined,
        netProfitLabel: "I18N.MY_BETS.NET_PROFIT",
        profit: "--",
        profitLabel: "I18N.MY_BETS.GROSS_PROFIT",
        exchangeLightMarketViewLink: {
          viewUrl: "unmatched-light-market-link-url-mock",
          viewUrn: "unmatched-light-market-link-urn-mock",
        },
      });
    });
  });

  describe("when get translations", () => {
    it("should call i18n for each key", () => {
      createCardByURNSelector.mockReturnValue(
        () => DEFAULT_STATE.layouts.cards.marketbetcard["market-bet-card-mock-urn"],
      );

      createExchangeMarketBetSelector.mockReturnValue(
        () => DEFAULT_STATE.betting.exchangemarketbets["market-bet-urn-mock"],
      );

      getCountryLocalCurrencyCodeSelector.mockReturnValue({
        localeCode: "en",
        localeCodeBcp47: "en",
        timezone: "timezone",
      });

      const mapStateToProps = makeMapStateToProps();

      mapStateToProps(DEFAULT_STATE, { urn: "market-bet-card-mock-urn" });

      expect(i18n).toHaveBeenCalledTimes(6);

      expect(i18n).toHaveBeenCalledWith({ key: "I18N.MY_BETS.UNMATCHED" });
      expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.LIABILITY" });
      expect(i18n).toHaveBeenCalledWith({ key: "I18N.CANCEL_ALL" });
      expect(i18n).toHaveBeenCalledWith({ key: "I18N.MY_BETS.COMMISSION" });
      expect(i18n).toHaveBeenCalledWith({ key: "I18N.MY_BETS.GROSS_PROFIT" });
      expect(i18n).toHaveBeenCalledWith({ key: "I18N.MY_BETS.NET_PROFIT" });
    });
  });

  describe("when commission, profit and netProfit are defined", () => {
    describe("when commision and profit are less than or equal to 0", () => {
      it("should return the correct state props - commision and profit as '--'", () => {
        createCardByURNSelector.mockReturnValue(() => ({
          ...DEFAULT_STATE.layouts.cards.marketbetcard["market-bet-card-mock-urn"],
          commission: -2,
          profit: 0,
          netProfit: 4,
        }));

        createExchangeMarketBetSelector.mockReturnValue(
          () => DEFAULT_STATE.betting.exchangemarketbets["market-bet-urn-mock"],
        );

        createCardGroupByURNSelector.mockReturnValue(
          () => DEFAULT_STATE.layouts.cardgroups.betcardgroups["bet-cardgroup-mock-urn"],
        );

        createGetMyBetsFiltersStateSelector.mockReturnValue(() => ({ orderTypeFilter: OrderTypeFilterItem.Open }));

        expect(setup(DEFAULT_STATE, { urn: "market-bet-card-mock-urn" })).toEqual({
          cashoutQuotesURNs: ["exchange-cashout-quote-urn-mock"],
          marketId: "market-id-mock",
          numOfBets: 1,
          numOfUnmatched: 0,
          showCancelAll: false,
          title: "",
          urn: "market-bet-card-mock-urn",
          isUnmatched: false,
          liability: "--",
          liabilityLabel: "I18N.BETSLIP.LIABILITY",
          isOpen: true,
          marketBetCardGroupURN: [],
          aggregatorDescription: "aggregator-desc-mock",
          cancelAllLabel: "I18N.CANCEL_ALL",
          commission: "--",
          commissionLabel: "I18N.MY_BETS.COMMISSION",
          netProfit: "formatted value",
          netProfitRaw: 4,
          netProfitLabel: "I18N.MY_BETS.NET_PROFIT",
          profit: "--",
          profitLabel: "I18N.MY_BETS.GROSS_PROFIT",
          exchangeLightMarketViewLink: {
            viewUrl: "unmatched-light-market-link-url-mock",
            viewUrn: "unmatched-light-market-link-urn-mock",
          },
        });
      });
    });
    describe("when commision and profit are greater than 0", () => {
      it("should return the correct state props - commision and profit as the formatted values", () => {
        createCardByURNSelector.mockReturnValue(() => ({
          ...DEFAULT_STATE.layouts.cards.marketbetcard["market-bet-card-mock-urn"],
          commission: 2,
          profit: 3,
          netProfit: 4,
        }));

        createExchangeMarketBetSelector.mockReturnValue(
          () => DEFAULT_STATE.betting.exchangemarketbets["market-bet-urn-mock"],
        );

        createCardGroupByURNSelector.mockReturnValue(
          () => DEFAULT_STATE.layouts.cardgroups.betcardgroups["bet-cardgroup-mock-urn"],
        );

        createGetMyBetsFiltersStateSelector.mockReturnValue(() => ({ orderTypeFilter: OrderTypeFilterItem.Open }));

        expect(setup(DEFAULT_STATE, { urn: "market-bet-card-mock-urn" })).toEqual({
          cashoutQuotesURNs: ["exchange-cashout-quote-urn-mock"],
          marketId: "market-id-mock",
          numOfBets: 1,
          numOfUnmatched: 0,
          showCancelAll: false,
          title: "",
          urn: "market-bet-card-mock-urn",
          isUnmatched: false,
          liability: "--",
          liabilityLabel: "I18N.BETSLIP.LIABILITY",
          isOpen: true,
          marketBetCardGroupURN: [],
          aggregatorDescription: "aggregator-desc-mock",
          cancelAllLabel: "I18N.CANCEL_ALL",
          commission: "formatted value",
          commissionLabel: "I18N.MY_BETS.COMMISSION",
          netProfit: "formatted value",
          netProfitRaw: 4,
          netProfitLabel: "I18N.MY_BETS.NET_PROFIT",
          profit: "formatted value",
          profitLabel: "I18N.MY_BETS.GROSS_PROFIT",
          exchangeLightMarketViewLink: {
            viewUrl: "unmatched-light-market-link-url-mock",
            viewUrn: "unmatched-light-market-link-urn-mock",
          },
        });
      });
    });
  });
});

describe("makeMapDispatchToProps", () => {
  beforeEach(jest.clearAllMocks);

  describe("dispatchMyBetsBottomSheetOpenPress", () => {
    it("should dispatch a dispatchMyBetsBottomSheetOpenPress when it's called", () => {
      const { dispatchMyBetsBottomSheetOpenPress } = makeMapDispatchToProps;

      const action = dispatchMyBetsBottomSheetOpenPress("contentUrn", "Market");

      expect(action).toEqual({
        type: MY_BETS_EXC_BOTTOM_SHEET_OPEN,
        payload: { contentUrn: "contentUrn", title: "Market" },
      });
    });
  });

  describe("dispatchSubscribeCardUpdates", () => {
    it("should dispatch a dispatchSubscribeCardUpdates when it's called", () => {
      const { dispatchSubscribeCardUpdates } = makeMapDispatchToProps;

      const action = dispatchSubscribeCardUpdates("URN");

      expect(action).toEqual({
        type: MY_BETS_SUBSCRIBE_CARD_UPDATES,
        payload: { urn: "URN" },
      });
    });
  });

  describe("dispatchUnsubscribeCardUpdates", () => {
    it("should dispatch a dispatchUnsubscribeCardUpdates when it's called", () => {
      const { dispatchUnsubscribeCardUpdates } = makeMapDispatchToProps;

      const action = dispatchUnsubscribeCardUpdates("URN");

      expect(action).toEqual({
        type: MY_BETS_UNSUBSCRIBE_CARD_UPDATES,
        payload: { urn: "URN" },
      });
    });
  });

  describe("dispatchCancelAllPress", () => {
    it("should dispatch a dispatchCancelAllPress when it's called", () => {
      const { dispatchCancelAllPress } = makeMapDispatchToProps;

      const action = dispatchCancelAllPress(
        "marketId",
        "marketName",
        "numberOfUnmatchedBets",
        "marketBetCardGroupURN",
        "event",
      );

      expect(action).toEqual({
        type: UI__MY_BETS_CANCEL_ALL_UNMATCHED_PRESS,
        payload: {
          marketId: "marketId",
          marketName: "marketName",
          numberOfBets: "numberOfUnmatchedBets",
          marketBetCardGroupURN: "marketBetCardGroupURN",
          event: "event",
        },
      });
    });
  });
});
