import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { createMarketDepthSelector } from "@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors";
import {
  currencyFormatWithDecimalPlaces,
  currencyFormatWithoutDecimalPlaces,
} from "../../formatters/currency-formatters";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";
import { createRunnersForExchangeMarketVm } from "./exchange-market-view-model";

import { i18n } from "../../helpers/i18n";
import { CashoutStep } from "@ppb/tbd-store/state/constants";

const RUNNER_NAME = "Sao Bento";
const RUNNER_URN = "ppb:excRunner:1.170403029/5774350/0";
const RUNNER = {
  urn: RUNNER_URN,
  name: RUNNER_NAME,
  prices: [
    {
      isSelected: false,
      liquidity: "€90,254",
      price: 1.16,
      side: "BACK",
    },
    {
      isSelected: false,
      liquidity: "€157,867",
      price: 1.17,
      side: "LAY",
    },
  ],
};

const BOOK_PERCENTAGE = { back: 0.15625, lay: 0.10638297872340426 };
const CARD_URN = "ppb:tbd:card:eventPrimaryMarket:29795760";
const MARKET_ID = "1.170411944";
const MARKET_TYPE = "MATCH_ODDS";
const STATUS = "OPEN";
const MARKET_URN = "ppb:excMarket:1.170411944";
const LOCALE_CODE_BCP47 = "en-GB";
const CURRENCY_CODE = "EUR";
const runnerViewLinks = {
  "ppb:excRunner:1.170403029/5774350/0": {
    runnerUrn: "ppb:excRunner:1.170403029/5774350/0",
    viewUrl: "Not Implemented",
    viewUrn: "ppb:tbd:view:runner:1.170403029/5774350/0",
  },
};

const STATE = {
  modules: { betting: true },
  layouts: {
    views: { runner: {} },
  },
  betting: {
    exchangecashouts: "exchangecashouts",
    exchangeBetting: "exchangebetting",
  },
  entities: {
    exchangemarkets: {},
    exchangerunners: "exchangerunners",
    races: "races",
    preferences: "preferences",
  },
};
const TOTAL_MATCHED = "33";

let EXC_MARKET;
const EXC_MARKET_MOCK = {
  totalMatched: TOTAL_MATCHED,
  marketId: MARKET_ID,
  status: STATUS,
  marketType: MARKET_TYPE,
  hierarchy: {
    race: "raceUrn",
  },
  marketRulesViewLink: {
    viewUrn: "marketRulesViewUrn",
    viewUrl: "marketRulesViewUrl",
  },
  turnInPlayEnabled: true,
  inplay: false,
};

const getExchangeMarketByURN = jest.fn(() => EXC_MARKET);
const getMarketDepth = jest.fn(() => false);
const getRunnersForExchangeMarket = jest.fn(() => [RUNNER]);

const setIsCashoutCallback = jest.fn(() => undefined);

const onMarketPromoClick = jest.fn();

const getBettingMarketRunnersPosition = jest.fn(() => []);
const getExchangeMarketRunners = jest.fn(() => []);
const getRaceWithRunnersByURN = jest.fn(() => ({ race: {}, raceRunners: {} }));
const getRunnersPrices = jest.fn(() => {});
const getRunnersBetsPrices = jest.fn(() => {});
const getBookPercentage = jest.fn(() => {});
const getExchangeCashoutQuoteSelector = jest.fn(() => {});

jest.mock("@ppb/tbd-store/state/betting/exchange-cashouts/exchange-cashout-selectors", () => ({
  createExchangeCashoutQuoteSelector: jest.fn(() => getExchangeCashoutQuoteSelector),
}));

jest.mock("@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors", () => ({
  createMarketDepthSelector: jest.fn(() => getMarketDepth),
}));

jest.mock("@ppb/tbd-store/state/entities/exchange-markets/exchange-market-selectors", () => ({
  createExchangeMarketSelector: () => getExchangeMarketByURN,
  createRunnersForBookPercentageSelector: () => getBookPercentage,
  createRunnersBestPricesForExchangeMarketSelector: () => getRunnersBetsPrices,
  createRunnersPricesForExchangeMarketSelector: () => getRunnersPrices,
  createExchangeMarketRunnersSelector: () => getExchangeMarketRunners,
}));

jest.mock("@ppb/tbd-store/state/betting/exchange-betting/exchange-betting-selectors", () => ({
  createBettingMarketRunnersPositionSelector: () => getBettingMarketRunnersPosition,
}));

jest.mock("@ppb/tbd-store/state/entities/entities-selectors", () => ({
  createRaceWithRunnersByURNSelector: () => getRaceWithRunnersByURN,
}));

jest.mock("@ppb/tbd-store/helpers/markets", () => ({
  isRaceHierarchy: jest.fn().mockReturnValue(false),
  doesMarketHierarchyHaveRace: jest.fn().mockReturnValue(false),
  shouldShowMarketDepth: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  getUserDetails: jest.fn(() => ({
    localeCodeBcp47: LOCALE_CODE_BCP47,
    currencyCode: CURRENCY_CODE,
  })),
}));

jest.mock("@ppb/tbd-store/state/application-state-selectors", () => ({
  createGetRunnerViewTitlesFromRunnerViewLinksSelector: jest.fn(() => () => ({
    "ppb:tbd:view:runner:1.170403029/5774350/0": "Additional Information",
  })),
}));

jest.mock("./exchange-market-view-model", () => ({
  createRunnersForExchangeMarketVm: jest.fn(() => getRunnersForExchangeMarket),
  createBookPercentageForExchangeMarketVm: jest.fn(() => () => BOOK_PERCENTAGE),
}));

jest.mock("../../formatters/currency-formatters", () => ({
  currencyFormatWithDecimalPlaces: jest.fn(({ value }) => `${value.toFixed(2)}€`),
  currencyFormatWithoutDecimalPlaces: jest.fn(({ value }) => `${value}€`),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => ({ key })),
}));

jest.spyOn(global.console, "error").mockImplementation(() => jest.fn());

function createViewModel({ displayRunnersUrns, betting = true, marketOverride }) {
  EXC_MARKET = marketOverride || EXC_MARKET_MOCK;
  return makeMapStateToProps()(
    { ...STATE, modules: { betting } },
    {
      urn: MARKET_URN,
      cardUrn: CARD_URN,
      displayRunnersUrns,
      setIsCashoutCallback: undefined,
      onMarketPromoClick,
    },
  );
}

describe("makeMapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  let viewModel;

  it("should call getExchangeMarketByURN with correct parameters", () => {
    viewModel = createViewModel({});
    expect(getExchangeMarketByURN).toHaveBeenCalledWith(STATE.entities.exchangemarkets, MARKET_URN);
  });

  it("should call getMarketDepth with correct parameters", () => {
    viewModel = createViewModel({});
    expect(getMarketDepth).toHaveBeenCalledWith(STATE.entities.preferences);
  });

  it("should call getUserDetails with correct parameters", () => {
    viewModel = createViewModel({});
    expect(getUserDetails).toHaveBeenCalledWith(STATE);
  });

  describe("When getExchangeMarketByURN retrieves a valid market", () => {
    it("should return a base view model", () => {
      expect(createViewModel({})).toEqual({
        marketURN: "ppb:excMarket:1.170411944",
        marketId: "1.170411944",
        liquidity: "33€",
        runners: [
          {
            name: "Sao Bento",
            prices: [
              { isSelected: false, liquidity: "€90,254", price: 1.16, side: "BACK" },
              { isSelected: false, liquidity: "€157,867", price: 1.17, side: "LAY" },
            ],
            urn: "ppb:excRunner:1.170403029/5774350/0",
          },
        ],
        isRaceMarket: false,
        status: "OPEN",
        marketType: "MATCH_ODDS",
        i18nLabels: {
          back: { key: "I18N.MARKET.BACK" },
          lay: { key: "I18N.MARKET.LAY" },
          marketClosed: { key: "I18N.MARKET.CLOSED" },
          marketDepth: { key: "I18N.LABELS.MARKET_DEPTH" },
          marketRules: { key: "I18N.MARKET_RULES" },
          marketSuspended: { key: "I18N.MARKET.SUSPENDED" },
          matched: { key: "I18N.MARKET.MATCHED" },
          nonRunnerReduction: { key: "I18N.NON_RUNNER.REDUCTION" },
          nonRunnerTitle: { key: "I18N.NON_RUNNER.TITLE" },
          liability: { key: "I18N.BETSLIP.LIABILITY" },
        },
        cardUrn: "ppb:tbd:card:eventPrimaryMarket:29795760",
        isMarketDepthActive: false,
        exchangeCashoutURN: undefined,
        hasQuote: false,
        liabilityValue: "--",
        marketRulesViewURN: "marketRulesViewUrn",
        turnInPlayEnabled: true,
        inplay: false,
      });
    });

    describe("currencyFormatWithoutDecimalPlaces", () => {
      const setupWithInlineTrue = () => {
        jest.clearAllMocks();
        const props = makeMapStateToProps();
        viewModel = props(STATE, { inline: true });
      };

      const setupWithInlineFalse = () => {
        jest.clearAllMocks();
        const props = makeMapStateToProps();
        viewModel = props(STATE, { inline: false });
      };

      it("should not call currencyFormatWithoutDecimalPlaces if inline is true", () => {
        setupWithInlineTrue();
        expect(currencyFormatWithoutDecimalPlaces).not.toHaveBeenCalled();
      });

      it("should call currencyFormatWithoutDecimalPlaces with correct parameters if inline is falsy", () => {
        setupWithInlineFalse();
        expect(currencyFormatWithoutDecimalPlaces).toHaveBeenCalledWith({
          localeCodeBcp47: LOCALE_CODE_BCP47,
          currencyCode: CURRENCY_CODE,
          value: TOTAL_MATCHED,
        });
      });
    });

    describe("getRunnersForExchangeMarket", () => {
      beforeEach(() => {
        jest.clearAllMocks();
        viewModel = createViewModel({ displayRunnersUrns: ["runner1Urn", "runner2Urn"] });
      });

      it("should return runners for exchange market", () => {
        expect(getRunnersForExchangeMarket).toHaveBeenCalledWith({
          marketRunners: [],
          displayRunnersUrns: ["runner1Urn", "runner2Urn"],
        });
      });
    });

    describe("getExchangeMarketRunners", () => {
      beforeEach(() => {
        viewModel = createViewModel({});
      });

      it("should get exchange market runners", () => {
        expect(getExchangeMarketRunners).toHaveBeenCalledWith({}, MARKET_URN);
      });
    });

    describe("getBookPercentage", () => {
      describe("if market depth is not active", () => {
        beforeEach(() => {
          jest.clearAllMocks();
          createMarketDepthSelector.mockReturnValue(() => false);
          viewModel = createViewModel({});
        });
        it("should not query the store for the book percentage", () => {
          expect(getBookPercentage).not.toHaveBeenCalled();
        });
      });

      describe("if market depth is active", () => {
        beforeEach(() => {
          createMarketDepthSelector.mockReturnValue(() => true);
          viewModel = createViewModel({});
        });
        it("should get book percentage", () => {
          expect(getBookPercentage).toHaveBeenCalledWith("exchangerunners", MARKET_URN);
        });
      });
    });

    describe("when market has cashout quotes URN", () => {
      it("should return exchangeCashoutURN for the current market/handicap", () => {
        const marketOverride = {
          ...EXC_MARKET_MOCK,
          cashoutQuotesURNs: ["ppb:excCashoutQuote:1.170411944/0"],
        };
        viewModel = createViewModel({ setIsCashoutCallback, marketOverride });

        expect(viewModel.exchangeCashoutURN).toBe("ppb:excCashoutQuote:1.170411944/0");
      });

      describe("when market has a valid cashout quote", () => {
        describe("when cashout quote has step HIDE", () => {
          it("should return hasQuote as false", () => {
            getExchangeCashoutQuoteSelector.mockReturnValueOnce({ step: CashoutStep.HIDE, cashedOutProfit: 10 });

            const marketOverride = {
              ...EXC_MARKET_MOCK,
              cashoutQuotesURNs: ["ppb:excCashoutQuote:1.170411944/0"],
            };
            viewModel = createViewModel({ setIsCashoutCallback, marketOverride });

            expect(viewModel.hasQuote).toBe(false);
          });
        });

        describe("when cashout quote step is RECEIPT", () => {
          it("should return hasQuote as true", () => {
            getExchangeCashoutQuoteSelector.mockReturnValueOnce({ step: CashoutStep.RECEIPT, cashedOutProfit: 10 });

            const marketOverride = {
              ...EXC_MARKET_MOCK,
              cashoutQuotesURNs: ["ppb:excCashoutQuote:1.170411944/0"],
            };
            viewModel = createViewModel({ setIsCashoutCallback, marketOverride });

            expect(viewModel.hasQuote).toBe(true);
          });

          describe("when cashedOutProfit is a negative value", () => {
            it("should return liabilityValue as the absolute value of cashedOutProfit", () => {
              getExchangeCashoutQuoteSelector.mockReturnValueOnce({ step: CashoutStep.RECEIPT, cashedOutProfit: -10 });

              const marketOverride = {
                ...EXC_MARKET_MOCK,
                cashoutQuotesURNs: ["ppb:excCashoutQuote:1.170411944/0"],
              };
              viewModel = createViewModel({ setIsCashoutCallback, marketOverride });

              expect(viewModel.liabilityValue).toBe("10.00€");
            });
          });

          describe("when cashedOutProfit is not a negative value", () => {
            it("should return liabilityValue as 0", () => {
              getExchangeCashoutQuoteSelector.mockReturnValueOnce({ step: CashoutStep.RECEIPT, cashedOutProfit: 10 });

              const marketOverride = {
                ...EXC_MARKET_MOCK,
                cashoutQuotesURNs: ["ppb:excCashoutQuote:1.170411944/0"],
              };
              viewModel = createViewModel({ setIsCashoutCallback, marketOverride });

              expect(viewModel.liabilityValue).toBe("0.00€");
            });
          });
        });

        describe("when it is any other cashout quote step", () => {
          it("should return hasQuote as true", () => {
            getExchangeCashoutQuoteSelector.mockReturnValueOnce({ step: CashoutStep.DISPLAY, cashedOutProfit: 10 });

            const marketOverride = {
              ...EXC_MARKET_MOCK,
              cashoutQuotesURNs: ["ppb:excCashoutQuote:1.170411944/0"],
            };
            viewModel = createViewModel({ setIsCashoutCallback, marketOverride });

            expect(viewModel.hasQuote).toBe(true);
          });

          describe("when currentLiability is defined", () => {
            it("should return liabilityValue as the currentLiability", () => {
              getExchangeCashoutQuoteSelector.mockReturnValueOnce({ step: CashoutStep.DISPLAY, currentLiability: 20 });

              const marketOverride = {
                ...EXC_MARKET_MOCK,
                cashoutQuotesURNs: ["ppb:excCashoutQuote:1.170411944/0"],
              };
              viewModel = createViewModel({ setIsCashoutCallback, marketOverride });

              expect(viewModel.liabilityValue).toBe("20.00€");
            });
          });

          describe("when currentLiability is not defined", () => {
            describe("when market has runner positions", () => {
              describe("when there are runner positions with negative PnL values", () => {
                it("should return liabilityValue as the absolute value of the lowest negative PnL", () => {
                  getExchangeCashoutQuoteSelector.mockReturnValueOnce({ step: CashoutStep.DISPLAY });
                  getBettingMarketRunnersPosition.mockReturnValueOnce([
                    {
                      pnl: { win: -30 },
                    },
                    {
                      pnl: { win: -20 },
                    },
                  ]);

                  const marketOverride = {
                    ...EXC_MARKET_MOCK,
                    cashoutQuotesURNs: ["ppb:excCashoutQuote:1.170411944/0"],
                  };
                  viewModel = createViewModel({ setIsCashoutCallback, marketOverride });

                  expect(viewModel.liabilityValue).toBe("30.00€");
                });
              });

              describe("when there are no runner positions with negative PnL values", () => {
                it("should return liabilityValue as 0", () => {
                  getExchangeCashoutQuoteSelector.mockReturnValueOnce({ step: CashoutStep.DISPLAY });
                  getBettingMarketRunnersPosition.mockReturnValueOnce([
                    {
                      pnl: { win: 30 },
                    },
                    {
                      pnl: { win: 20 },
                    },
                  ]);

                  const marketOverride = {
                    ...EXC_MARKET_MOCK,
                    cashoutQuotesURNs: ["ppb:excCashoutQuote:1.170411944/0"],
                  };
                  viewModel = createViewModel({ setIsCashoutCallback, marketOverride });

                  expect(viewModel.liabilityValue).toBe("0.00€");
                });
              });
            });

            describe("when market does not have runner positions", () => {
              it("should not call currencyFormatWithDecimalPlaces", () => {
                getExchangeCashoutQuoteSelector.mockReturnValueOnce({ step: CashoutStep.DISPLAY });

                createViewModel({
                  setIsCashoutCallback,
                  marketOverride: {
                    ...EXC_MARKET_MOCK,
                    cashoutQuotesURNs: ["ppb:excCashoutQuote:1.170411944/0"],
                  },
                });

                expect(currencyFormatWithDecimalPlaces).not.toHaveBeenCalled();
              });

              it("should return liabilityValue as the lowest runner position pnl", () => {
                getExchangeCashoutQuoteSelector.mockReturnValueOnce({ step: CashoutStep.DISPLAY });

                const marketOverride = {
                  ...EXC_MARKET_MOCK,
                  cashoutQuotesURNs: ["ppb:excCashoutQuote:1.170411944/0"],
                };
                viewModel = createViewModel({ setIsCashoutCallback, marketOverride });

                expect(viewModel.liabilityValue).toBe("--");
              });
            });
          });
        });
      });
    });

    describe("when marketRulesViewLink defined", () => {
      it("should return a defined marketRulesViewURN", () => {
        viewModel = createViewModel({});

        expect(viewModel.marketRulesViewURN).toBe("marketRulesViewUrn");
      });
    });

    describe("when marketRulesViewLink is undefined", () => {
      it("should return a undefined marketRulesViewURN", () => {
        viewModel = createViewModel({
          marketOverride: {
            ...EXC_MARKET_MOCK,
            marketRulesViewLink: undefined,
          },
        });

        expect(viewModel.marketRulesViewURN).toBe(undefined);
      });
    });

    describe("i18n translations", () => {
      beforeEach(() => {
        jest.clearAllMocks();

        createRunnersForExchangeMarketVm.mockReturnValue(() => [RUNNER]);
        const props = makeMapStateToProps();
        viewModel = props(STATE, { urn: MARKET_URN, cardUrn: CARD_URN });
      });

      it("should call i18n with correct keys", () => {
        expect(i18n).toHaveBeenCalledTimes(10);

        expect(i18n).toHaveBeenNthCalledWith(1, { key: "I18N.MARKET.BACK" });
        expect(i18n).toHaveBeenNthCalledWith(2, { key: "I18N.MARKET.LAY" });
        expect(i18n).toHaveBeenNthCalledWith(3, { key: "I18N.MARKET.CLOSED" });
        expect(i18n).toHaveBeenNthCalledWith(4, { key: "I18N.LABELS.MARKET_DEPTH" });
        expect(i18n).toHaveBeenNthCalledWith(5, { key: "I18N.MARKET.SUSPENDED" });
        expect(i18n).toHaveBeenNthCalledWith(6, { key: "I18N.MARKET.MATCHED" });
        expect(i18n).toHaveBeenNthCalledWith(7, { key: "I18N.NON_RUNNER.TITLE" });
        expect(i18n).toHaveBeenNthCalledWith(8, { key: "I18N.NON_RUNNER.REDUCTION" });
        expect(i18n).toHaveBeenNthCalledWith(9, { key: "I18N.MARKET_RULES" });
        expect(i18n).toHaveBeenNthCalledWith(10, { key: "I18N.BETSLIP.LIABILITY" });
      });
    });

    describe("runnerViewsTitles", () => {
      beforeEach(() => {
        jest.clearAllMocks();
        createRunnersForExchangeMarketVm.mockReturnValue(() => [RUNNER]);

        const props = makeMapStateToProps();
        viewModel = props(STATE, { urn: MARKET_URN, cardUrn: CARD_URN, runnerViewLinks });
      });

      it("should return view model with runnerViewsTitles", () => {
        expect(viewModel.runnerViewsTitles).toEqual({
          "ppb:tbd:view:runner:1.170403029/5774350/0": "Additional Information",
        });
      });
    });

    describe("when `getUserDetails` throws", () => {
      const GET_USER_DETAILS_ERROR = "GET_USER_DETAILS_ERROR";

      beforeEach(() => {
        getUserDetails.mockImplementationOnce(() => {
          throw new Error(GET_USER_DETAILS_ERROR);
        });

        createRunnersForExchangeMarketVm.mockReturnValue(() => [RUNNER]);
      });

      afterEach(jest.clearAllMocks);

      it("should call console.error with the error thrown from `getUserDetails`", () => {
        makeMapStateToProps()(STATE, { urn: MARKET_URN, cardUrn: CARD_URN, runnerViewLinks });

        expect(global.console.error).toHaveBeenCalledWith(new Error("GET_USER_DETAILS_ERROR"));
      });

      it("should return an empty object", () => {
        const props = makeMapStateToProps()(STATE, { urn: MARKET_URN, cardUrn: CARD_URN, runnerViewLinks });

        expect(props).toEqual({});
      });
    });
  });

  describe("When getExchangeMarketByURN does not retrieve a valid market", () => {
    beforeAll(() => {
      jest.clearAllMocks();
      getExchangeMarketByURN.mockImplementationOnce(() => undefined);
      viewModel = createViewModel({});
    });

    it("should return an empty object viewModel", () => {
      expect(viewModel).toEqual({});
    });
  });
});

describe("mapDispatchToProps", () => {
  it("should export the dispatch functions", () => {
    expect(mapDispatchToProps).toStrictEqual({
      dispatchMarketUpdatesSubscribe: expect.any(Function),
      dispatchMarketUpdatesUnsubscribe: expect.any(Function),
      dispatchUpdateMarketDepth: expect.any(Function),
      dispatchSubscribeExchangeCashout: expect.any(Function),
      dispatchUnsubscribeExchangeCashout: expect.any(Function),
      dispatchFetchCatalogue: expect.any(Function),
      dispatchDeleteView: expect.any(Function),
      dispatchModalToggleAction: expect.any(Function),
      dispatchToggleMarketGraph: expect.any(Function),
    });
  });

  describe("dispatchMarketUpdatesSubscribe", () => {
    it("should return the correct action creator", () => {
      const { dispatchMarketUpdatesSubscribe } = mapDispatchToProps;

      expect(dispatchMarketUpdatesSubscribe("marketId", true)).toEqual({
        payload: { marketId: "marketId", isInline: true },
        type: "SUBSCRIBE_EXCHANGE_MARKET_UPDATES",
      });
    });
  });

  describe("dispatchMarketUpdatesUnsubscribe", () => {
    it("should return the correct action creator", () => {
      const { dispatchMarketUpdatesUnsubscribe } = mapDispatchToProps;

      expect(dispatchMarketUpdatesUnsubscribe("marketId", false)).toEqual({
        payload: { marketId: "marketId", isInline: false },
        type: "UNSUBSCRIBE_EXCHANGE_MARKET_UPDATES",
      });
    });
  });

  describe("dispatchUpdateMarketDepth", () => {
    it("should return the correct action creator when !isMarketDepthActive", () => {
      const { dispatchUpdateMarketDepth } = mapDispatchToProps;

      expect(dispatchUpdateMarketDepth("marketUrn", false)).toEqual({
        payload: { urn: "marketUrn", isActive: true },
        type: "UPDATE_MARKET_DEPTH",
      });
    });

    it("should return the correct action creator when isMarketDepthActive", () => {
      const { dispatchUpdateMarketDepth } = mapDispatchToProps;

      expect(dispatchUpdateMarketDepth("marketUrn", true)).toEqual({
        payload: { urn: "marketUrn", isActive: false },
        type: "UPDATE_MARKET_DEPTH",
      });
    });
  });

  describe("dispatchSubscribeExchangeCashout", () => {
    it("should return the correct action creator", () => {
      const { dispatchSubscribeExchangeCashout } = mapDispatchToProps;

      expect(dispatchSubscribeExchangeCashout("marketID")).toEqual({
        payload: { marketId: "marketID", handicap: 0 },
        type: "SUBSCRIBE_EXCHANGE_CASHOUTS_UPDATES",
      });
    });
  });

  describe("dispatchUnsubscribeExchangeCashout", () => {
    it("should return the correct action creator", () => {
      const { dispatchUnsubscribeExchangeCashout } = mapDispatchToProps;

      expect(dispatchUnsubscribeExchangeCashout("marketID")).toEqual({
        payload: { marketId: "marketID", handicap: 0 },
        type: "UNSUBSCRIBE_EXCHANGE_CASHOUTS_UPDATES",
      });
    });
  });

  describe("dispatchFetchCatalogue", () => {
    it("should return the correct action creator", () => {
      const { dispatchFetchCatalogue } = mapDispatchToProps;

      expect(dispatchFetchCatalogue("URN")).toEqual({
        type: "FETCH_CATALOGUE",
        payload: {
          urn: "URN",
        },
      });
    });
  });

  describe("dispatchDeleteView", () => {
    it("should return the correct action creator", () => {
      const { dispatchDeleteView } = mapDispatchToProps;

      expect(dispatchDeleteView("URN")).toEqual({
        type: "DELETE_VIEW",
        payload: "URN",
      });
    });
  });

  describe("dispatchModalToggleAction", () => {
    it("should return the correct action creator", () => {
      const { dispatchModalToggleAction } = mapDispatchToProps;

      expect(dispatchModalToggleAction(true)).toEqual({
        type: "UI__MARKET_RULES_MODAL_TOGGLE",
        payload: { open: true },
      });
    });
  });

  describe("dispatchToggleMarketGraph", () => {
    it("should return the correct action creator", () => {
      const { dispatchToggleMarketGraph } = mapDispatchToProps;

      expect(dispatchToggleMarketGraph("runnerName", "marketName", true)).toEqual({
        payload: {
          runnerName: "runnerName",
          marketName: "marketName",
          isClosed: true,
        },
        type: "UI__GRAPH_TOGGLE",
      });
    });
  });
});
