import { waitFor } from "@testing-library/react";
import { BETTING__REMOVE_ALL_POTENTIAL_BETS_ACTION } from "@ppb/tbd-store/actions/betting";
import {
  MY_BETS_EXC_BOTTOM_SHEET_OPEN,
  UI__MY_BETS_CANCEL_UNMATCHED_BET_PRESS,
  UI__MY_BETS_EXC_EDIT_BET_PRESS,
  UI__MY_BETS_COPY_BET_ID,
  UI__MY_BETS_COPY_DEVICE_ID,
} from "@ppb/tbd-store/actions/my-bets";
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { createExchangeMarketBetSelector } from "@ppb/tbd-store/state/betting/exchange-market-bets/exchange-market-bets-selectors";
import { createExchangeMarketSelector } from "@ppb/tbd-store/state/entities/exchange-markets/exchange-market-selectors";
import { calc } from "@ppb/bet-engine";
import { ExchangeSide, Jurisdiction } from "@ppb/tbd-store/state/constants";
import { makeMapStateToProps, makeMapDispatchToProps } from "./map-to-props-factory";
import { i18n } from "../../helpers/i18n";

const getCountryLocalCurrencyCodeSelector = jest.fn().mockReturnValue({
  localeCode: "en",
  localeCodeBcp47: "en",
  timezone: "UTC",
  jurisdiction: { jurisdiction: undefined },
});

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  createGetCountryLocalCurrencyCodeSelector: jest.fn(() => getCountryLocalCurrencyCodeSelector),
}));

jest.mock("../../helpers/i18n", () => ({ i18n: jest.fn(({ key }) => key) }));

jest.mock("@ppb/tbd-store/state/layout/cards/cards-selectors", () => ({
  createCardByURNSelector: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/betting/exchange-market-bets/exchange-market-bets-selectors", () => ({
  createExchangeMarketBetSelector: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/entities/exchange-markets/exchange-market-selectors", () => ({
  createExchangeMarketSelector: jest.fn(),
}));

jest.mock("@ppb/bet-engine", () => ({
  calc: {
    liability: jest.fn(),
  },
}));

jest.mock("../../formatters/currency-formatters", () => ({
  currencyFormatWithDecimalPlaces: jest.fn(({ value }) => `€€${value}`),
}));

const DEFAULT_STATE = {
  betting: {
    exchangemarketbets: {
      "exchange-market-bet-urn-mock": {
        urn: "exchange-market-bet-urn-mock",
        typename: "MarketBet",
        marketId: "market-id-mock",
        description: "description-mock",
        numOfOrders: 1,
        numOfUnmatched: 1,
        cashoutQuotesURNs: [],
        betDelay: 0,
        marketViewLink: {
          viewUrn: "market-view-link-urn-mock",
          viewUrl: "market-view-link-url-mock",
        },
        exchangeLightMarketViewLink: {
          viewUrn: "light-market-view-link-urn-mock",
          viewUrl: "light-market-view-link-url-mock",
        },
        betURNs: [],
      },
    },
  },
  entities: {
    throttles: {},
    exchangemarkets: {
      "market-urn-mock": {
        bettingType: "ODDS",
        marketType: "market-type-mock",
      },
    },
  },
  layouts: {
    cards: {
      marketbetselectioncard: {
        "market-bet-selection-card-urn-mock": {
          typename: "MarketBetSelectionCard",
          urn: "market-bet-selection-card-urn-mock",
          id: "market-bet-selection-card-id-mock",
          handicap: 0,
          placedDate: "2023-08-21T15:12:33.000Z",
          matchedDate: "1970-01-01T00:00:00.000Z",
          price: 11,
          runnerDesc: "Labour",
          side: ExchangeSide.BACK,
          isCashout: false,
          size: 1,
          profit: 10,
          liability: undefined,
          isFreeBet: false,
          freeBetSize: 0,
          priceMatched: 0,
          isUnmatched: true,
          selectionId: 1111884,
          editViewLink: {
            viewUrn: "edit-view-link-urn-mock",
            viewUrl: "edit-view-link-url-mock",
            viewDisplayMode: null,
          },
          marketBetURN: "market-bet-urn-mock",
          runnerURN: "runner-urn-mock",
          marketURN: "market-urn-mock",
          marketBetCardGroupURN: "marketBetCardGroupURN",
        },
      },
    },
  },
};

describe("makeMapStateToProps", () => {
  function setup(state, containerProps = {}) {
    return makeMapStateToProps()(state, containerProps);
  }

  beforeEach(() => {
    jest.clearAllMocks();
    createExchangeMarketSelector.mockReturnValue(() => DEFAULT_STATE.entities.exchangemarkets["market-urn-mock"]);
  });

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

      expect(setup(DEFAULT_STATE, { urn: "exchange-market-bets-mock" })).toEqual({});
    });
  });

  describe("when getExchangeMarketByURN does not return a exchange market", () => {
    it("should return an empty object", () => {
      createCardByURNSelector.mockReturnValue(() => ({
        typename: "MarketBetCard",
        urn: "market-bet-card-mock-urn",
        marketBetURN: "market-bet-urn-mock",
      }));

      createExchangeMarketSelector.mockReturnValue(() => undefined);

      expect(setup(DEFAULT_STATE, { urn: "exchange-market-bets-mock" })).toEqual({});
    });
  });

  describe("when urn corresponds to an ExchangeMarketBet", () => {
    it("should return the correct state props", () => {
      createCardByURNSelector.mockReturnValue(
        () => DEFAULT_STATE.layouts.cards.marketbetselectioncard["market-bet-selection-card-urn-mock"],
      );

      createExchangeMarketBetSelector.mockReturnValue(
        () => DEFAULT_STATE.betting.exchangemarketbets["exchange-market-bet-urn-mock"],
      );

      expect(setup(DEFAULT_STATE, { urn: "market-bet-selection-card-urn-mock" })).toEqual({
        betId: "market-bet-selection-card-id-mock",
        betIdLabel: "I18N.MYBETS.BETID",
        placedDateLabel: "I18N.MYBETS.PLACED_DATE_TIME",
        matchedDateLabel: "I18N.MYBETS.MATCHED_DATE_TIME",
        settledDateLabel: "I18N.MYBETS.SETTLED_DATE_TIME",
        deviceIdLabel: "I18N.MYBETS.DEVICE_ID",
        placedDateFormatted: "August 21, 2023 at 15:12",
        matchedDateFormatted: undefined,
        settledDateFormatted: undefined,
        deviceId: undefined,
        hasUnmatchedActions: true,
        informationSignpostLabel: "",
        marketId: "market-id-mock",
        marketURN: "market-urn-mock",
        oddsLabel: "I18N.BETSLIP.ODDS",
        oddsValue: "11",
        profitLabel: "I18N.BETSLIP.PROFIT",
        profitValue: "€€10",
        liabilityLabel: "I18N.BETSLIP.LIABILITY",
        liabilityValue: undefined,
        runnerDesc: "Labour",
        runnerURN: "runner-urn-mock",
        side: ExchangeSide.BACK,
        sideLabel: "I18N.LABEL.BACK",
        sideTheme: "exchange_back",
        stakeLabel: "I18N.BETSLIP.STAKE",
        stakeValue: "€€1",
        statusLabelText: undefined,
        statusLabelType: undefined,
        exchangeLightMarketViewLink: {
          viewUrn: "light-market-view-link-urn-mock",
          viewUrl: "light-market-view-link-url-mock",
        },
        marketBetCardGroupURN: "marketBetCardGroupURN",
      });
    });

    it("should map deviceId through when present and jurisdiction is Brazil", () => {
      createCardByURNSelector.mockReturnValue(() => ({
        ...DEFAULT_STATE.layouts.cards.marketbetselectioncard["market-bet-selection-card-urn-mock"],
        deviceId: "device-123",
      }));
      getCountryLocalCurrencyCodeSelector.mockReturnValue({
        localeCode: "en",
        localeCodeBcp47: "en",
        timezone: "UTC",
        jurisdiction: { jurisdiction: Jurisdiction.BRAZIL },
      });

      createExchangeMarketBetSelector.mockReturnValue(
        () => DEFAULT_STATE.betting.exchangemarketbets["exchange-market-bet-urn-mock"],
      );

      const result = setup(DEFAULT_STATE, { urn: "market-bet-selection-card-urn-mock" });

      expect(result.deviceId).toBe("device-123");
      expect(result.deviceIdLabel).toBe("I18N.MYBETS.DEVICE_ID");
    });
  });

  describe("when has result", () => {
    it("should return the correct state props", () => {
      createCardByURNSelector.mockReturnValue(() => ({
        ...DEFAULT_STATE.layouts.cards.marketbetselectioncard["market-bet-selection-card-urn-mock"],
        result: "WON",
      }));

      createExchangeMarketBetSelector.mockReturnValue(
        () => DEFAULT_STATE.betting.exchangemarketbets["exchange-market-bet-urn-mock"],
      );

      expect(setup(DEFAULT_STATE, { urn: "market-bet-selection-card-urn-mock" })).toEqual({
        betId: "market-bet-selection-card-id-mock",
        betIdLabel: "I18N.MYBETS.BETID",
        placedDateLabel: "I18N.MYBETS.PLACED_DATE_TIME",
        matchedDateLabel: "I18N.MYBETS.MATCHED_DATE_TIME",
        settledDateLabel: "I18N.MYBETS.SETTLED_DATE_TIME",
        deviceIdLabel: "I18N.MYBETS.DEVICE_ID",
        placedDateFormatted: "August 21, 2023 at 15:12",
        matchedDateFormatted: undefined,
        settledDateFormatted: undefined,
        deviceId: undefined,
        hasUnmatchedActions: true,
        informationSignpostLabel: "",
        marketId: "market-id-mock",
        marketURN: "market-urn-mock",
        oddsLabel: "I18N.BETSLIP.ODDS",
        oddsValue: "11",
        profitLabel: "I18N.BETSLIP.PROFIT",
        profitValue: "€€10",
        liabilityLabel: "I18N.BETSLIP.LIABILITY",
        liabilityValue: undefined,
        runnerDesc: "Labour",
        runnerURN: "runner-urn-mock",
        side: ExchangeSide.BACK,
        sideLabel: "I18N.LABEL.BACK",
        sideTheme: "exchange_back",
        stakeLabel: "I18N.BETSLIP.STAKE",
        stakeValue: "€€1",
        statusLabelText: "I18N.MY_BETS.RESULT.WON",
        statusLabelType: "won",
        exchangeLightMarketViewLink: {
          viewUrn: "light-market-view-link-urn-mock",
          viewUrl: "light-market-view-link-url-mock",
        },
        marketBetCardGroupURN: "marketBetCardGroupURN",
      });
    });
  });

  describe("when side has LAY", () => {
    it("should return the correct state props", () => {
      createCardByURNSelector.mockReturnValue(() => ({
        ...DEFAULT_STATE.layouts.cards.marketbetselectioncard["market-bet-selection-card-urn-mock"],
        side: ExchangeSide.LAY,
        liability: 10,
        isUnmatched: false,
      }));

      createExchangeMarketBetSelector.mockReturnValue(
        () => DEFAULT_STATE.betting.exchangemarketbets["exchange-market-bet-urn-mock"],
      );

      expect(setup(DEFAULT_STATE, { urn: "market-bet-selection-card-urn-mock" })).toEqual({
        betId: "market-bet-selection-card-id-mock",
        betIdLabel: "I18N.MYBETS.BETID",
        placedDateLabel: "I18N.MYBETS.PLACED_DATE_TIME",
        matchedDateLabel: "I18N.MYBETS.MATCHED_DATE_TIME",
        settledDateLabel: "I18N.MYBETS.SETTLED_DATE_TIME",
        deviceIdLabel: "I18N.MYBETS.DEVICE_ID",
        placedDateFormatted: "August 21, 2023 at 15:12",
        matchedDateFormatted: "January 1, 1970 at 00:00",
        settledDateFormatted: undefined,
        deviceId: undefined,
        hasUnmatchedActions: false,
        informationSignpostLabel: "",
        marketId: "market-id-mock",
        marketURN: "market-urn-mock",
        oddsLabel: "I18N.BETSLIP.ODDS",
        oddsValue: "11",
        profitLabel: "I18N.BETSLIP.PROFIT",
        profitValue: "€€10",
        liabilityLabel: "I18N.BETSLIP.LIABILITY",
        liabilityValue: "€€10",
        runnerDesc: "Labour",
        runnerURN: "runner-urn-mock",
        side: ExchangeSide.LAY,
        sideLabel: "I18N.LABEL.LAY",
        sideTheme: "exchange_lay",
        stakeLabel: "I18N.LABELS.BACKER_STAKE",
        stakeValue: "€€1",
        statusLabelText: undefined,
        statusLabelType: undefined,
        exchangeLightMarketViewLink: {
          viewUrn: "light-market-view-link-urn-mock",
          viewUrl: "light-market-view-link-url-mock",
        },
        marketBetCardGroupURN: "marketBetCardGroupURN",
      });

      expect(calc.liability).not.toHaveBeenCalled();
    });

    it("should calculate liability client-side when it's unmatched bet", () => {
      calc.liability.mockReturnValue(7.5);

      createCardByURNSelector.mockReturnValue(() => ({
        ...DEFAULT_STATE.layouts.cards.marketbetselectioncard["market-bet-selection-card-urn-mock"],
        side: ExchangeSide.LAY,
        isUnmatched: true,
        size: 1,
        price: 11,
        editViewLink: { viewUrn: "edit-view-link-urn-mock", viewUrl: "edit-view-link-url-mock", viewDisplayMode: null },
      }));

      createExchangeMarketBetSelector.mockReturnValue(
        () => DEFAULT_STATE.betting.exchangemarketbets["exchange-market-bet-urn-mock"],
      );

      const result = setup(DEFAULT_STATE, { urn: "market-bet-selection-card-urn-mock" });

      expect(calc.liability).toHaveBeenCalledWith(ExchangeSide.LAY, 1, 11, "ODDS", "market-type-mock");
      expect(result.liabilityLabel).toBe("I18N.BETSLIP.LIABILITY");
      expect(result.liabilityValue).toBe("€€7.5");
      expect(result.hasUnmatchedActions).toBe(true);
    });
  });

  describe("when isCashout is true", () => {
    it("should return the correct state props", () => {
      createCardByURNSelector.mockReturnValue(() => ({
        ...DEFAULT_STATE.layouts.cards.marketbetselectioncard["market-bet-selection-card-urn-mock"],
        isCashout: true,
      }));

      createExchangeMarketBetSelector.mockReturnValue(
        () => DEFAULT_STATE.betting.exchangemarketbets["exchange-market-bet-urn-mock"],
      );

      expect(setup(DEFAULT_STATE, { urn: "market-bet-selection-card-urn-mock" })).toEqual({
        betId: "market-bet-selection-card-id-mock",
        betIdLabel: "I18N.MYBETS.BETID",
        placedDateLabel: "I18N.MYBETS.PLACED_DATE_TIME",
        matchedDateLabel: "I18N.MYBETS.MATCHED_DATE_TIME",
        settledDateLabel: "I18N.MYBETS.SETTLED_DATE_TIME",
        deviceIdLabel: "I18N.MYBETS.DEVICE_ID",
        placedDateFormatted: "August 21, 2023 at 15:12",
        matchedDateFormatted: undefined,
        settledDateFormatted: undefined,
        deviceId: undefined,
        hasUnmatchedActions: true,
        informationSignpostLabel: "I18N.MY_BETS.BET_CASHED_OUT",
        marketId: "market-id-mock",
        marketURN: "market-urn-mock",
        oddsLabel: "I18N.BETSLIP.ODDS",
        oddsValue: "11",
        profitLabel: "I18N.BETSLIP.PROFIT",
        profitValue: "€€10",
        liabilityLabel: "I18N.BETSLIP.LIABILITY",
        liabilityValue: undefined,
        runnerDesc: "Labour",
        runnerURN: "runner-urn-mock",
        side: ExchangeSide.BACK,
        sideLabel: "I18N.LABEL.BACK",
        sideTheme: "exchange_back",
        stakeLabel: "I18N.BETSLIP.STAKE",
        stakeValue: "€€1",
        statusLabelText: undefined,
        statusLabelType: undefined,
        exchangeLightMarketViewLink: {
          viewUrn: "light-market-view-link-urn-mock",
          viewUrl: "light-market-view-link-url-mock",
        },
        marketBetCardGroupURN: "marketBetCardGroupURN",
      });
    });
  });

  describe("when size and profit are not defined", () => {
    it("should return the correct state props", () => {
      createCardByURNSelector.mockReturnValue(() => ({
        ...DEFAULT_STATE.layouts.cards.marketbetselectioncard["market-bet-selection-card-urn-mock"],
        size: undefined,
        profit: undefined,
      }));

      createExchangeMarketBetSelector.mockReturnValue(
        () => DEFAULT_STATE.betting.exchangemarketbets["exchange-market-bet-urn-mock"],
      );

      expect(setup(DEFAULT_STATE, { urn: "market-bet-selection-card-urn-mock" })).toEqual({
        betId: "market-bet-selection-card-id-mock",
        betIdLabel: "I18N.MYBETS.BETID",
        placedDateLabel: "I18N.MYBETS.PLACED_DATE_TIME",
        matchedDateLabel: "I18N.MYBETS.MATCHED_DATE_TIME",
        settledDateLabel: "I18N.MYBETS.SETTLED_DATE_TIME",
        deviceIdLabel: "I18N.MYBETS.DEVICE_ID",
        placedDateFormatted: "August 21, 2023 at 15:12",
        matchedDateFormatted: undefined,
        settledDateFormatted: undefined,
        deviceId: undefined,
        hasUnmatchedActions: true,
        informationSignpostLabel: "",
        marketId: "market-id-mock",
        marketURN: "market-urn-mock",
        oddsLabel: "I18N.BETSLIP.ODDS",
        oddsValue: "11",
        profitLabel: "I18N.BETSLIP.PROFIT",
        profitValue: "€€0",
        liabilityLabel: "I18N.BETSLIP.LIABILITY",
        liabilityValue: undefined,
        runnerDesc: "Labour",
        runnerURN: "runner-urn-mock",
        side: ExchangeSide.BACK,
        sideLabel: "I18N.LABEL.BACK",
        sideTheme: "exchange_back",
        stakeLabel: "I18N.BETSLIP.STAKE",
        stakeValue: "€€0",
        statusLabelText: undefined,
        statusLabelType: undefined,
        exchangeLightMarketViewLink: {
          viewUrn: "light-market-view-link-urn-mock",
          viewUrl: "light-market-view-link-url-mock",
        },
        marketBetCardGroupURN: "marketBetCardGroupURN",
      });
    });
  });

  describe("when is a bsp", () => {
    describe("when is unreconciled and doesn't have a price", () => {
      it("should return the correct state props", () => {
        createCardByURNSelector.mockReturnValue(() => ({
          ...DEFAULT_STATE.layouts.cards.marketbetselectioncard["market-bet-selection-card-urn-mock"],
          isBsp: true,
          price: undefined,
        }));

        createExchangeMarketBetSelector.mockReturnValue(
          () => DEFAULT_STATE.betting.exchangemarketbets["exchange-market-bet-urn-mock"],
        );

        expect(setup(DEFAULT_STATE, { urn: "market-bet-selection-card-urn-mock" })).toEqual({
          betId: "market-bet-selection-card-id-mock",
          betIdLabel: "I18N.MYBETS.BETID",
          placedDateLabel: "I18N.MYBETS.PLACED_DATE_TIME",
          matchedDateLabel: "I18N.MYBETS.MATCHED_DATE_TIME",
          settledDateLabel: "I18N.MYBETS.SETTLED_DATE_TIME",
          deviceIdLabel: "I18N.MYBETS.DEVICE_ID",
          placedDateFormatted: "August 21, 2023 at 15:12",
          matchedDateFormatted: undefined,
          settledDateFormatted: undefined,
          deviceId: undefined,
          hasUnmatchedActions: true,
          informationSignpostLabel: "",
          marketId: "market-id-mock",
          marketURN: "market-urn-mock",
          oddsLabel: "I18N.BETSLIP.ODDS",
          oddsValue: "I18N.BETSLIP.STARTING_PRICE",
          profitLabel: "I18N.BETSLIP.PROFIT",
          profitValue: "I18N.BETSLIP.TBD",
          liabilityLabel: "I18N.BETSLIP.LIABILITY",
          liabilityValue: undefined,
          runnerDesc: "Labour",
          runnerURN: "runner-urn-mock",
          side: ExchangeSide.BACK,
          sideLabel: "I18N.LABEL.BACK",
          sideTheme: "exchange_back",
          stakeLabel: "I18N.BETSLIP.STAKE",
          stakeValue: "€€1",
          statusLabelText: undefined,
          statusLabelType: undefined,
          exchangeLightMarketViewLink: {
            viewUrn: "light-market-view-link-urn-mock",
            viewUrl: "light-market-view-link-url-mock",
          },
          marketBetCardGroupURN: "marketBetCardGroupURN",
        });
      });
    });

    describe("when is reconciled and doesn't have a price", () => {
      it("should return the correct state props", () => {
        createCardByURNSelector.mockReturnValue(() => ({
          ...DEFAULT_STATE.layouts.cards.marketbetselectioncard["market-bet-selection-card-urn-mock"],
          isBsp: true,
          price: 15,
          bspLiability: 0,
        }));

        createExchangeMarketBetSelector.mockReturnValue(
          () => DEFAULT_STATE.betting.exchangemarketbets["exchange-market-bet-urn-mock"],
        );

        expect(setup(DEFAULT_STATE, { urn: "market-bet-selection-card-urn-mock" })).toEqual({
          betId: "market-bet-selection-card-id-mock",
          betIdLabel: "I18N.MYBETS.BETID",
          placedDateLabel: "I18N.MYBETS.PLACED_DATE_TIME",
          matchedDateLabel: "I18N.MYBETS.MATCHED_DATE_TIME",
          settledDateLabel: "I18N.MYBETS.SETTLED_DATE_TIME",
          deviceIdLabel: "I18N.MYBETS.DEVICE_ID",
          placedDateFormatted: "August 21, 2023 at 15:12",
          matchedDateFormatted: undefined,
          settledDateFormatted: undefined,
          deviceId: undefined,
          hasUnmatchedActions: true,
          informationSignpostLabel: "",
          marketId: "market-id-mock",
          marketURN: "market-urn-mock",
          oddsLabel: "I18N.BETSLIP.ODDS",
          oddsValue: "15",
          profitLabel: "I18N.BETSLIP.PROFIT",
          profitValue: "€€10",
          liabilityLabel: "I18N.BETSLIP.LIABILITY",
          liabilityValue: undefined,
          runnerDesc: "Labour",
          runnerURN: "runner-urn-mock",
          side: ExchangeSide.BACK,
          sideLabel: "I18N.LABEL.BACK",
          sideTheme: "exchange_back",
          stakeLabel: "I18N.BETSLIP.STAKE",
          stakeValue: "€€0",
          statusLabelText: undefined,
          statusLabelType: undefined,
          exchangeLightMarketViewLink: {
            viewUrn: "light-market-view-link-urn-mock",
            viewUrl: "light-market-view-link-url-mock",
          },
          marketBetCardGroupURN: "marketBetCardGroupURN",
        });
      });
    });
  });

  describe("when get translations", () => {
    it("should call i18n for each key", () => {
      createCardByURNSelector.mockReturnValue(
        () => DEFAULT_STATE.layouts.cards.marketbetselectioncard["market-bet-selection-card-urn-mock"],
      );

      createExchangeMarketBetSelector.mockReturnValue(
        () => DEFAULT_STATE.betting.exchangemarketbets["exchange-market-bet-urn-mock"],
      );

      getCountryLocalCurrencyCodeSelector.mockReturnValue({
        localeCode: "en",
        localeCodeBcp47: "en",
        timezone: "UTC",
        jurisdiction: { jurisdiction: undefined },
      });

      const mapStateToProps = makeMapStateToProps();

      mapStateToProps(DEFAULT_STATE, { urn: "market-bet-card-mock-urn" });

      expect(i18n).toHaveBeenCalledTimes(17);

      expect(i18n).toHaveBeenNthCalledWith(1, { key: "I18N.MY_BETS.BET_CASHED_OUT" });
      expect(i18n).toHaveBeenNthCalledWith(2, { key: "I18N.BETSLIP.ODDS" });
      expect(i18n).toHaveBeenNthCalledWith(3, { key: "I18N.BETSLIP.STAKE" });
      expect(i18n).toHaveBeenNthCalledWith(4, { key: "I18N.BETSLIP.PROFIT" });
      expect(i18n).toHaveBeenNthCalledWith(5, { key: "I18N.BETSLIP.LIABILITY" });
      expect(i18n).toHaveBeenNthCalledWith(6, { key: "I18N.LABEL.BACK" });
      expect(i18n).toHaveBeenNthCalledWith(7, { key: "I18N.LABEL.LAY" });
      expect(i18n).toHaveBeenNthCalledWith(8, { key: "I18N.MY_BETS.RESULT.WON" });
      expect(i18n).toHaveBeenNthCalledWith(9, { key: "I18N.MY_BETS.RESULT.LOST" });
      expect(i18n).toHaveBeenNthCalledWith(10, { key: "I18N.MY_BETS.RESULT.PLACED" });
      expect(i18n).toHaveBeenNthCalledWith(11, { key: "I18N.BETSLIP.STARTING_PRICE" });
      expect(i18n).toHaveBeenNthCalledWith(12, { key: "I18N.BETSLIP.TBD" });
      expect(i18n).toHaveBeenNthCalledWith(13, { key: "I18N.MYBETS.BETID" });
      expect(i18n).toHaveBeenNthCalledWith(14, { key: "I18N.MYBETS.PLACED_DATE_TIME" });
      expect(i18n).toHaveBeenNthCalledWith(15, { key: "I18N.MYBETS.MATCHED_DATE_TIME" });
      expect(i18n).toHaveBeenNthCalledWith(16, { key: "I18N.MYBETS.SETTLED_DATE_TIME" });
      expect(i18n).toHaveBeenNthCalledWith(17, { key: "I18N.MYBETS.DEVICE_ID" });
    });
  });
});

describe("makeMapDispatchToProps", () => {
  const dispatchMock = jest.fn();

  const setup = () => {
    const result = makeMapDispatchToProps(dispatchMock);
    return { dispatchMock, ...result };
  };

  beforeEach(jest.clearAllMocks);

  describe("dispatchCancelBetPress", () => {
    it("should dispatch a dispatchCancelBetPress when it's called", () => {
      const { dispatchCancelBetPress } = setup();

      dispatchCancelBetPress(
        "market-id-mock",
        "bet-id-mock",
        "selection-name-mock",
        "side-mock",
        "marketBetCardGroupURN",
      );

      expect(dispatchMock).toHaveBeenCalledWith({
        type: UI__MY_BETS_CANCEL_UNMATCHED_BET_PRESS,
        payload: {
          marketId: "market-id-mock",
          betId: "bet-id-mock",
          selectionName: "selection-name-mock",
          side: "side-mock",

          marketBetCardGroupURN: "marketBetCardGroupURN",
        },
      });
      expect(dispatchMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("dispatchUnmatchedBetEditPress", () => {
    it("should dispatch a dispatchUnmatchedBetEditPress when it's called", () => {
      const { dispatchUnmatchedBetEditPress } = setup();

      dispatchUnmatchedBetEditPress({
        betId: "bet-id-mock",
        marketUrn: "market-urn-mock",
        runner: "runner-mock",
        side: "side-mock",
        exchangeLightMarketViewLink: {
          viewUrn: "light-market-view-link-urn-mock",
          viewUrl: "light-market-view-link-url-mock",
        },
      });

      expect(dispatchMock).toHaveBeenNthCalledWith(1, {
        type: UI__MY_BETS_EXC_EDIT_BET_PRESS,
        payload: {
          betId: "bet-id-mock",
          runner: "runner-mock",
          side: "side-mock",
          marketUrn: "market-urn-mock",
          exchangeLightMarketViewLink: {
            viewUrn: "light-market-view-link-urn-mock",
            viewUrl: "light-market-view-link-url-mock",
          },
        },
      });
      expect(dispatchMock).toHaveBeenNthCalledWith(2, {
        type: MY_BETS_EXC_BOTTOM_SHEET_OPEN,
        payload: {
          contentUrn: "light-market-view-link-urn-mock",
        },
      });
      expect(dispatchMock).toHaveBeenNthCalledWith(3, {
        type: BETTING__REMOVE_ALL_POTENTIAL_BETS_ACTION,
      });
      expect(dispatchMock).toHaveBeenCalledTimes(3);
    });
  });

  describe("dispatchCopy actions", () => {
    it("should dispatch UI__MY_BETS_COPY_BET_ID when dispatchCopyBetIdAction is called", () => {
      const { dispatchCopyBetIdAction, dispatchMock } = setup();

      dispatchCopyBetIdAction();

      expect(dispatchMock).toHaveBeenCalledWith({ type: UI__MY_BETS_COPY_BET_ID });
      expect(dispatchMock).toHaveBeenCalledTimes(1);
    });

    it("should dispatch UI__MY_BETS_COPY_DEVICE_ID when dispatchCopyDeviceIdAction is called", () => {
      const { dispatchCopyDeviceIdAction, dispatchMock } = setup();

      dispatchCopyDeviceIdAction();

      expect(dispatchMock).toHaveBeenCalledWith({ type: UI__MY_BETS_COPY_DEVICE_ID });
      expect(dispatchMock).toHaveBeenCalledTimes(1);
    });
  });
});
