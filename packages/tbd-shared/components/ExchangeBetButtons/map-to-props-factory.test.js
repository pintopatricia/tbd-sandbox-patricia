import {
  BETTING__ADD_POTENTIAL_BET_ACTION,
  BETTING__REMOVE_ALL_POTENTIAL_BETS_ACTION,
  UI__MARKET_EXC_BET_BUTTON_CLICK,
} from "@ppb/tbd-store/actions/betting";
import { createExchangeMarketSelector } from "@ppb/tbd-store/state/entities/exchange-markets/exchange-market-selectors";

import { UI__BETSLIP_EXC_REMOVE_POTENTIAL_SELECTION, UI__BETSLIP_OPEN } from "@ppb/tbd-store/actions/betslip";
import { Product } from "@ppb/tbd-store/state/entities/user-preferences/UserPreferences.types";
import { ExchangeSide } from "@ppb/tbd-store/state/constants";
import { makeMapStateToProps, makeMapDispatchToProps } from "./map-to-props-factory";
import { currencyFormatWithoutDecimalPlaces } from "../../formatters/currency-formatters";

const NBSP = String.fromCharCode(160);

const exchangeMarket = {
  urn: "ppb:market:1.174822835",
  marketId: "174822835",
  inplay: false,
  sport: "ppb:eventType:7",
  status: "OPEN",
};

const exchangeRunnerOddsWithPotentialBets = {
  urn: "ppb:excRunner:1.174822835/24/0",
  market: "ppb:market:1.174822835",
  selectionId: 24,
  handicap: 0,
  back: [
    {
      isPotentialBet: true,
      liquidity: 10,

      marketDepth: 0,
      price: 1,
    },
  ],
  lay: [
    {
      isPotentialBet: false,
      liquidity: 5,
      marketDepth: 1,
      price: 2,
    },
  ],
  reduction: null,
};

const createExchangeMarket = jest.fn(() => exchangeMarket);
const createExchangeRunnerWithPotentialBets = jest.fn(() => exchangeRunnerOddsWithPotentialBets);

jest.mock("@ppb/tbd-store/state/entities/exchange-markets/exchange-market-selectors", () => ({
  createExchangeMarketSelector: jest.fn(() => createExchangeMarket),
}));

jest.mock("@ppb/tbd-store/state/application-state-selectors", () => ({
  createExchangeRunnerOddsWithPotentialBetsByURNSelector: jest.fn(() => createExchangeRunnerWithPotentialBets),
}));

jest.mock("@ppb/tbd-store/helpers/betting");

jest.mock("../../formatters/currency-formatters", () => ({
  currencyFormatWithoutDecimalPlaces: jest.fn(({ localeCodeBcp47, currencyCode, value }) =>
    new Intl.NumberFormat(localeCodeBcp47, {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value),
  ),
}));

const state = {
  entities: {
    exchangemarkets: {
      "ppb:market:1.174822835": exchangeMarket,
    },
    userdetails: {
      loggedIn: true,
      currencyCode: "EUR",
      localeCodeBcp47: "pt-PT",
    },
  },
  betslip: {
    exchangeContext: { runner: "ppb:excRunner:1.174822835/24/0" },
  },
};

const containerProps = {
  cardURN: "ppb:tbd:card:1",
  marketURN: "ppb:market:1.174822835",
  runnerURN: "ppb:excRunner:1.174822835/24/0",
  displayBestOdds: false,
  side: undefined,
};

const setupMapStateToProps = (stateArg = state, containerPropsArg = containerProps) =>
  makeMapStateToProps()(stateArg, containerPropsArg);

describe("ExchangeBetButtons map-to-props-factory", () => {
  beforeEach(jest.clearAllMocks);

  it("should create the selectors", () => {
    makeMapStateToProps();
    expect(createExchangeMarketSelector).toHaveBeenCalledTimes(1);
  });

  describe("mapStateToProps", () => {
    it("should call currencyFormatWithoutDecimalPlaces with 'useCustomCurrencyFormat' as true", () => {
      setupMapStateToProps();

      expect(currencyFormatWithoutDecimalPlaces).toHaveBeenCalledTimes(2);
      expect(currencyFormatWithoutDecimalPlaces).toHaveBeenNthCalledWith(1, {
        localeCodeBcp47: "pt-PT",
        currencyCode: "EUR",
        value: 10,
        useCustomCurrencyFormat: true,
      });
      expect(currencyFormatWithoutDecimalPlaces).toHaveBeenNthCalledWith(2, {
        localeCodeBcp47: "pt-PT",
        currencyCode: "EUR",
        value: 5,
        useCustomCurrencyFormat: true,
      });
    });

    it("should get data from state and return the correct props", () => {
      const stateProps = setupMapStateToProps();

      expect(createExchangeMarket).toHaveBeenCalledWith(state.entities.exchangemarkets, "ppb:market:1.174822835");
      expect(createExchangeRunnerWithPotentialBets).toHaveBeenCalledWith(state, {
        marketURN: containerProps.marketURN,
        runnerURN: containerProps.runnerURN,
        bestOdds: containerProps.displayBestOdds,
        side: containerProps.side,
      });

      expect(stateProps).toEqual({
        cardURN: "ppb:tbd:card:1",
        betBtnSize: "SMALL",
        displayBestOdds: false,
        marketId: "174822835",
        marketURN: "ppb:market:1.174822835",
        prices: [
          {
            disabled: false,
            isSelected: true,
            liquidity: `10${NBSP}€`,
            marketDepth: 0,
            price: 1,
            side: "BACK",
          },
          {
            disabled: false,
            isSelected: false,
            liquidity: `5${NBSP}€`,
            marketDepth: 1,
            price: 2,
            side: "LAY",
          },
        ],
        runnerURN: "ppb:excRunner:1.174822835/24/0",
      });
    });

    it("should get data from state without runnerWithOdds and return placeholderVM when side is defined and displayBestOdds is true", () => {
      createExchangeRunnerWithPotentialBets.mockReturnValueOnce(undefined);
      const stateProps = setupMapStateToProps(state, {
        ...containerProps,
        displayBestOdds: true,
        side: "LAY",
      });

      expect(stateProps).toEqual({
        cardURN: "ppb:tbd:card:1",
        betBtnSize: "REGULAR",
        displayBestOdds: true,
        marketId: "174822835",
        marketURN: "ppb:market:1.174822835",
        prices: [
          {
            disabled: false,
            isSelected: false,
            liquidity: "",
            marketDepth: 0,
            side: "LAY",
          },
        ],
        runnerURN: "ppb:excRunner:1.174822835/24/0",
      });
    });

    it("should get data from state without runnerWithOdds and return placeholderVMs when displayBestOdds is false", () => {
      createExchangeRunnerWithPotentialBets.mockReturnValueOnce(undefined);
      const stateProps = setupMapStateToProps(state, {
        ...containerProps,
      });

      expect(stateProps).toEqual({
        cardURN: "ppb:tbd:card:1",
        betBtnSize: "SMALL",
        displayBestOdds: false,
        marketId: "174822835",
        marketURN: "ppb:market:1.174822835",
        prices: [
          {
            disabled: false,
            isSelected: false,
            liquidity: "",
            marketDepth: 0,
            side: "BACK",
          },
          {
            disabled: false,
            isSelected: false,
            liquidity: "",
            marketDepth: 0,
            side: "BACK",
          },
          {
            disabled: false,
            isSelected: false,
            liquidity: "",
            marketDepth: 0,
            side: "BACK",
          },
          {
            disabled: false,
            isSelected: false,
            liquidity: "",
            marketDepth: 0,
            side: "LAY",
          },
          {
            disabled: false,
            isSelected: false,
            liquidity: "",
            marketDepth: 0,
            side: "LAY",
          },
          {
            disabled: false,
            isSelected: false,
            liquidity: "",
            marketDepth: 0,
            side: "LAY",
          },
        ],
        runnerURN: "ppb:excRunner:1.174822835/24/0",
      });
    });

    it("should get data from state and return the correct props with runner with multiple prices", () => {
      createExchangeRunnerWithPotentialBets.mockReturnValueOnce({
        ...exchangeRunnerOddsWithPotentialBets,
        back: [
          {
            isPotentialBet: true,
            liquidity: 10,
            marketDepth: 0,
            price: 1,
          },
          {
            isPotentialBet: false,
            liquidity: 15,
            marketDepth: 1,
            price: 2,
          },
        ],
        lay: [
          {
            isPotentialBet: true,
            liquidity: 5,
            marketDepth: 1,
            price: 2,
          },
          {
            isPotentialBet: false,
            liquidity: 6,
            marketDepth: 2,
            price: 4,
          },
          {
            isPotentialBet: true,
            liquidity: 40,
            marketDepth: 3,
            price: 20,
          },
        ],
      });
      createExchangeMarket.mockReturnValueOnce({
        ...exchangeMarket,
        status: "CLOSED",
      });
      const stateProps = setupMapStateToProps();

      expect(stateProps).toEqual({
        cardURN: "ppb:tbd:card:1",
        betBtnSize: "SMALL",
        displayBestOdds: false,
        marketId: "174822835",
        marketURN: "ppb:market:1.174822835",
        prices: [
          {
            disabled: true,
            isSelected: false,
            liquidity: `15${NBSP}€`,
            marketDepth: 1,
            price: 2,
            side: "BACK",
          },
          {
            disabled: true,
            isSelected: true,
            liquidity: `10${NBSP}€`,
            marketDepth: 0,
            price: 1,
            side: "BACK",
          },
          {
            disabled: true,
            isSelected: true,
            liquidity: `5${NBSP}€`,
            marketDepth: 1,
            price: 2,
            side: "LAY",
          },
          {
            disabled: true,
            isSelected: false,
            liquidity: `6${NBSP}€`,
            marketDepth: 2,
            price: 4,
            side: "LAY",
          },
          {
            disabled: true,
            isSelected: true,
            liquidity: `40${NBSP}€`,
            marketDepth: 3,
            price: 20,
            side: "LAY",
          },
        ],
        runnerURN: "ppb:excRunner:1.174822835/24/0",
      });
    });
  });

  describe("makeMapDispatchToProps", () => {
    function setupMakeMapDispatchToProps({ dispatch = jest.fn() } = {}) {
      return makeMapDispatchToProps(dispatch);
    }

    describe("dispatchBetPlacement", () => {
      describe.each`
        isSelected | actionsAmount
        ${true}    | ${4}
        ${false}   | ${5}
      `("with bet isSelected as $isSelected", ({ isSelected, actionsAmount }) => {
        it(`should trigger ${actionsAmount} actions`, () => {
          const dispatch = jest.fn();
          const { dispatchBetPlacement } = setupMakeMapDispatchToProps({ dispatch });

          dispatchBetPlacement({ isSelected }, {});

          expect(dispatch).toHaveBeenCalledTimes(actionsAmount);
        });

        it("should dispatch UI__BETSLIP_OPEN", () => {
          const dispatch = jest.fn();
          const { dispatchBetPlacement } = setupMakeMapDispatchToProps({ dispatch });

          dispatchBetPlacement({ isSelected }, {});

          expect(dispatch).toHaveBeenNthCalledWith(1, {
            type: UI__BETSLIP_OPEN,
            payload: {
              product: Product.Exchange,
            },
          });
        });

        it("should dispatch UI__BETSLIP_EXC_REMOVE_POTENTIAL_SELECTION", () => {
          const dispatch = jest.fn();
          const { dispatchBetPlacement } = setupMakeMapDispatchToProps({ dispatch });

          const bet = {
            urn: "urn",
            marketURN: "marketURN",
            price: "price",
            side: ExchangeSide.BACK,
            betOriginURL: "betOriginURL",
            isSelected,
          };
          const metadata = {
            betOriginURL: "betOriginURL",
            cardURN: "cardURN",
            marketId: "marketId",
          };

          dispatchBetPlacement(bet, metadata);

          expect(dispatch).toHaveBeenNthCalledWith(2, {
            type: UI__BETSLIP_EXC_REMOVE_POTENTIAL_SELECTION,
          });
        });

        it("should dispatch UI__MARKET_EXC_BET_BUTTON_CLICK", () => {
          const dispatch = jest.fn();
          const { dispatchBetPlacement } = setupMakeMapDispatchToProps({ dispatch });
          const bet = {
            urn: "urn",
            marketURN: "marketURN",
            price: "price",
            side: "BACK",
            betOriginURL: "betOriginURL",
            isSelected,
          };
          const metadata = {
            betOriginURL: "betOriginURL",
            cardURN: "cardURN",
            marketId: "marketId",
          };

          dispatchBetPlacement(bet, metadata);

          expect(dispatch).toHaveBeenNthCalledWith(3, {
            type: UI__MARKET_EXC_BET_BUTTON_CLICK,
            payload: {
              urn: "urn",
              marketURN: "marketURN",
              price: "price",
              side: ExchangeSide.BACK,
              betOriginURL: "betOriginURL",
              cardUrn: "cardURN",
              marketId: "marketId",
              uniqueId: "",
            },
          });
        });

        it("should dispatch BETTING__REMOVE_ALL_POTENTIAL_BETS_ACTION", () => {
          const dispatch = jest.fn();
          const { dispatchBetPlacement } = setupMakeMapDispatchToProps({ dispatch });

          dispatchBetPlacement({ isSelected }, {});

          expect(dispatch).toHaveBeenNthCalledWith(4, {
            type: BETTING__REMOVE_ALL_POTENTIAL_BETS_ACTION,
          });
        });
      });

      describe("with bet isSelected as false", () => {
        it("should dispatch BETTING__ADD_POTENTIAL_BET_ACTION", () => {
          const dispatch = jest.fn();
          const { dispatchBetPlacement } = setupMakeMapDispatchToProps({ dispatch });
          const bet = {
            isSelected: false,
            urn: "urn",
            marketURN: "marketURN",
            price: "price",
            side: "BACK",
            betOriginURL: "betOriginURL",
            marketDepth: 0,
          };
          const metadata = {
            betOriginURL: "betOriginURL",
            cardURN: "cardURN",
            marketId: "marketId",
            uniqueId: "uniqueId",
          };

          dispatchBetPlacement(bet, metadata);

          expect(dispatch).toHaveBeenNthCalledWith(5, {
            type: BETTING__ADD_POTENTIAL_BET_ACTION,
            payload: {
              marketDepth: 0,
              marketURN: "marketURN",
              price: "price",
              runner: "urn",
              side: ExchangeSide.BACK,
            },
          });
        });
      });
    });
  });
});
