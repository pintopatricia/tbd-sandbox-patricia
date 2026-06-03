import { OrderTypeFilterItem } from "@ppb/tbd-store/state/layout/cards/MyBets.types";
import { UI__MY_BETS_ON_ACCORDION_TOGGLE } from "@ppb/tbd-store/actions/my-bets";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";
import { i18n } from "../../helpers/i18n";

jest.mock("../../helpers/i18n", () => ({ i18n: jest.fn(({ key }) => key) }));

const marketbetexpandablecardgroup = {
  urn: "URN",
  typename: "MarketBetExpandableCardGroup",
  isOpen: false,
  items: [
    {
      typename: "MarketBetSelectionCardGroup",
      urn: "market-bet-selection-card-group-urn-mock",
    },
  ],
  marketBetCardGroupURN: "marketBetCardGroupURN",
};

const DEFAULT_STATE = {
  layouts: {
    cardgroups: {
      marketbetexpandablecardgroups: "marketbetexpandablecardgroups",
    },
    views: {
      mybets: "mybets",
    },
  },
};

const getCardGroupByURN = jest.fn(() => marketbetexpandablecardgroup);

const getCountryLocalCurrencyCode = jest.fn(() => ({
  currencyCode: "EUR",
  localeCode: "en",
  localeCodeBcp47: "en",
  timezone: "timezone",
}));

const getMyBetsFiltersState = jest.fn(() => ({
  orderTypeFilter: OrderTypeFilterItem.Settled,
}));

jest.mock("@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors", () => ({
  createCardGroupByURNSelector: () => getCardGroupByURN,
}));

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  createGetCountryLocalCurrencyCodeSelector: jest.fn(() => getCountryLocalCurrencyCode),
}));

jest.mock("@ppb/tbd-store/state/layout/cards/my-bets/my-bets-selectors", () => ({
  createGetMyBetsFiltersStateSelector: () => getMyBetsFiltersState,
}));

beforeEach(jest.clearAllMocks);

describe("makeMapStateToProps", () => {
  describe("when there's no MarketBetExpandableCardGroup", () => {
    it("should return an empty object", () => {
      getCardGroupByURN.mockReturnValueOnce(undefined);

      expect(makeMapStateToProps()(DEFAULT_STATE, {})).toEqual({});
    });
  });

  describe("when a MarketBetExpandableCardGroup exists", () => {
    it("should call getCardGroupByURN", () => {
      makeMapStateToProps()(DEFAULT_STATE, { urn: "URN" });

      expect(getCardGroupByURN).toHaveBeenCalledWith("marketbetexpandablecardgroups", "URN");
    });

    it("should call getMyBetsFiltersState to get the order type", () => {
      makeMapStateToProps()(DEFAULT_STATE, { urn: "URN" });

      expect(getMyBetsFiltersState).toHaveBeenCalledWith(DEFAULT_STATE, DEFAULT_STATE.layouts.views.mybets);
    });

    it("should call getCountryLocalCurrencyCode to get the localeCode", () => {
      makeMapStateToProps()(DEFAULT_STATE, { urn: "URN" });

      expect(getCountryLocalCurrencyCode).toHaveBeenCalledWith(DEFAULT_STATE);
    });

    it("should call i18n to get the labels", () => {
      makeMapStateToProps()(DEFAULT_STATE, { urn: "URN" });

      expect(i18n).toHaveBeenNthCalledWith(1, { key: "I18N.GENERIC.ACCORDION_COLLAPSED_LABEL" });
      expect(i18n).toHaveBeenNthCalledWith(2, { key: "I18N.GENERIC.ACCORDION_EXPANDED_LABEL" });
    });

    it("should return the correct state props", () => {
      const stateProps = makeMapStateToProps()(DEFAULT_STATE, { urn: "URN" });

      expect(stateProps).toEqual({
        urn: "URN",
        collapsedLabel: "I18N.GENERIC.ACCORDION_COLLAPSED_LABEL",
        expandedLabel: "I18N.GENERIC.ACCORDION_EXPANDED_LABEL",
        isOpen: false,
        items: [
          {
            typename: "MarketBetSelectionCardGroup",
            urn: "market-bet-selection-card-group-urn-mock",
          },
        ],
        marketBetCardGroupURN: "marketBetCardGroupURN",
        isSettled: true,
      });
    });
  });
});

describe("mapDispatchToProps", () => {
  beforeEach(jest.clearAllMocks);

  describe("dispatchFetchCardsAction", () => {
    it("should dispatch the 'FETCH_CARDS' with a truthy forceRefresh", () => {
      const { dispatchFetchCardsAction } = mapDispatchToProps;

      expect(dispatchFetchCardsAction("marketBetCardGroupURN")).toEqual({
        type: "FETCH_CARDS",
        payload: {
          urns: ["marketBetCardGroupURN"],
          forceRefresh: true,
        },
      });
    });
  });

  describe("dispatchToggleAccordionAction", () => {
    it("should dispatch the 'UI__MY_BETS_ON_ACCORDION_TOGGLE' with the given isExpanded parameter", () => {
      const { dispatchToggleAccordionAction } = mapDispatchToProps;

      expect(dispatchToggleAccordionAction("isExpanded")).toEqual({
        type: UI__MY_BETS_ON_ACCORDION_TOGGLE,
        payload: {
          isExpanded: "isExpanded",
        },
      });
    });
  });
});
