import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { FETCH_FULL_CARD } from "@ppb/tbd-store/actions/catalogue";
import { UI__NAVIGATE_TO_DISCOUNT_RATE_EXPLAINED } from "@ppb/tbd-store/actions/navigation";
import { i18n } from "../../helpers/i18n";

import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

jest.mock("@ppb/tbd-store/state/layout/cards/cards-selectors", () => ({
  createCardByURNSelector: jest.fn(),
}));

const getCountryLocalCurrencyCodeSelector = jest.fn(() => ({
  localeCodeBcp47: "locale",
  timezone: "timezone",
  jurisdiction: {
    jurisdiction: "INTERNATIONAL",
  },
}));

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  createGetCountryLocalCurrencyCodeSelector: jest.fn(() => getCountryLocalCurrencyCodeSelector),
}));

jest.mock("../../helpers/external-links", () => ({
  getExternalLink: jest.fn(() => "www.market-rules.com"),
}));

jest.mock("../../helpers/i18n", () => ({ i18n: jest.fn(({ key }) => key) }));

const marketRulesMock = {
  typename: "MarketRulesCard",
  urn: "urn",
  marketName: "Market Name",
  wallet: "Wallet",
  clarifications: "Clarifications",
  marketBaseRate: "10",
  discountAllowed: true,
  eventStartTime: "2020-01-02T12:15:00Z",
  sections: [
    {
      name: "MARKET_INFORMATION",
      content: "Content",
    },
    {
      name: "CUSTOMER_AWARENESS",
      content: "Content",
    },
  ],
  footer: "footer",
};

const marketRulesNoClarificationsMock = {
  typename: "MarketRulesCard",
  urn: "urn",
  marketName: "Market Name",
  wallet: "Wallet",
  clarifications: null,
  marketBaseRate: "10",
  discountAllowed: true,
  eventStartTime: "2020-01-02T12:15:00Z",
  sections: [
    {
      name: "MARKET_INFORMATION",
      content: "Content",
    },
    {
      name: "CUSTOMER_AWARENESS",
      content: "Content",
    },
  ],
  footer: "footer",
};

const marketRulesMockResult = {
  typename: "MarketRulesCard",
  urn: "urn",
  marketName: "Market Name",
  wallet: "Wallet",
  clarifications: "Clarifications",
  marketBaseRate: "10",
  discountAllowed: true,
  eventStartTime: "2020-01-02T12:15:00Z",
  sections: [
    {
      content: "Clarifications",
      name: "I18N.MARKET_RULES.CLARIFICATIONS",
    },
    {
      content: "Wallet",
      name: "I18N.MARKET_RULES.WALLET",
    },
    {
      name: "I18N.MARKET_RULES.TITLE.MARKET_INFORMATION",
      content: "Content",
    },
    {
      name: "I18N.MARKET_RULES.TITLE.CUSTOMER_AWARENESS",
      content: "Content",
    },
  ],
  footer: "footer",
};

const marketRulesNoClarificationsMockResult = {
  typename: "MarketRulesCard",
  urn: "urn",
  marketName: "Market Name",
  wallet: "Wallet",
  clarifications: null,
  marketBaseRate: "10",
  discountAllowed: true,
  eventStartTime: "2020-01-02T12:15:00Z",
  sections: [
    {
      content: "Wallet",
      name: "I18N.MARKET_RULES.WALLET",
    },
    {
      name: "I18N.MARKET_RULES.TITLE.MARKET_INFORMATION",
      content: "Content",
    },
    {
      name: "I18N.MARKET_RULES.TITLE.CUSTOMER_AWARENESS",
      content: "Content",
    },
  ],
  footer: "footer",
};

const marketRulesWinOnlyMarketTypeMock = {
  typename: "MarketRulesCard",
  urn: "urn",
  wallet: "Wallet",
  sections: [],
  marketBettingType: "WIN_ONLY_MARKET",
};

const marketRulesHandicapMarketTypeMock = {
  typename: "MarketRulesCard",
  urn: "urn",
  wallet: "Wallet",
  sections: [],
  marketBettingType: "HANDICAP_BET",
};

const marketRulesAnyNumbMarketTypeMock = {
  typename: "MarketRulesCard",
  urn: "urn",
  wallet: "Wallet",
  sections: [],
  marketBettingType: "ANY_NUMB_WINNERS",
};

const marketRulesToBePlacedMarketTypeMock = {
  typename: "MarketRulesCard",
  urn: "urn",
  wallet: "Wallet",
  sections: [],
  marketBettingType: "TO_BE_PLACED",
  numberOfWinners: 2,
};

const marketRulesBettingTypeMockResult = {
  typename: "MarketRulesCard",
  urn: "urn",
  wallet: "Wallet",
  sections: [
    {
      content: "Wallet",
      name: "I18N.MARKET_RULES.WALLET",
    },
  ],
  marketBettingType: "WIN_ONLY_MARKET",
};

describe("makeMapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  let marketRulesPage;
  let state;

  const getMarketRulesCardByURNSelector = jest.fn();

  function setupMapStateToProps(marketRules, ownPros = { urn: "fakeMarketRulesUrn" }) {
    state = {
      layouts: {
        views: {},
        cards: { marketRules: { "ppb:card": marketRulesMock } },
      },
    };

    createCardByURNSelector.mockImplementation(() => getMarketRulesCardByURNSelector);
    getMarketRulesCardByURNSelector.mockImplementation(() => marketRules);
    marketRulesPage = makeMapStateToProps()(state, ownPros);
  }

  it("should be a function factory", () => {
    expect(makeMapStateToProps).toEqual(expect.any(Function));
  });

  it("should export a function factory", () => {
    const makeMapStateToPropsOne = makeMapStateToProps();
    const makeMapStateToPropsTwo = makeMapStateToProps();
    expect(makeMapStateToPropsOne).toEqual(expect.any(Function));
    expect(makeMapStateToPropsTwo).toEqual(expect.any(Function));
    expect(makeMapStateToPropsTwo).not.toBe(makeMapStateToPropsOne);
  });

  describe("when there is layout for provided URN", () => {
    it("should getMarketRulesCardByURNSelector from state", () => {
      setupMapStateToProps(marketRulesMock);

      expect(getMarketRulesCardByURNSelector).toHaveBeenCalledWith(
        state.layouts.cards.marketrules,
        "fakeMarketRulesUrn",
      );
    });

    it("should return page layout", () => {
      setupMapStateToProps(marketRulesMock, { urn: "fakeMarketRulesUrn", modalView: true });
      expect(marketRulesPage).toEqual({
        urn: "fakeMarketRulesUrn",
        modalView: true,
        marketRules: marketRulesMockResult,
        title: "I18N.MARKET_RULES",
        localeCodeBcp47: "locale",
        timezone: "timezone",
        discountRateUrl: "www.market-rules.com",
      });
    });

    describe("and market betting type is WIN_ONLY_MARKET", () => {
      it("should return page layout with correct rules", () => {
        setupMapStateToProps(marketRulesWinOnlyMarketTypeMock);
        expect(marketRulesPage.marketRules).toEqual({
          ...marketRulesBettingTypeMockResult,
          sections: [
            {
              content: "Wallet",
              name: "I18N.MARKET_RULES.WALLET",
            },
            {
              content: "I18N.MARKET_RULES.WIN_ONLY_MARKET",
              name: "I18N.MARKET_RULES.RULES",
            },
          ],
        });
      });
    });

    describe("and market betting type is ANY_NUMB_WINNERS", () => {
      it("should return page layout with correct rules", () => {
        setupMapStateToProps(marketRulesAnyNumbMarketTypeMock);
        expect(marketRulesPage.marketRules).toEqual({
          ...marketRulesBettingTypeMockResult,
          marketBettingType: "ANY_NUMB_WINNERS",
          sections: [
            {
              content: "Wallet",
              name: "I18N.MARKET_RULES.WALLET",
            },
            {
              content: "I18N.MARKET_RULES.ANY_NUMB_WINNERS",
              name: "I18N.MARKET_RULES.RULES",
            },
          ],
        });
      });
    });

    describe("and market betting type is HANDICAP_BET", () => {
      it("should return page layout with correct rules", () => {
        setupMapStateToProps(marketRulesHandicapMarketTypeMock);
        expect(marketRulesPage.marketRules).toEqual({
          ...marketRulesBettingTypeMockResult,
          marketBettingType: "HANDICAP_BET",
          sections: [
            {
              content: "Wallet",
              name: "I18N.MARKET_RULES.WALLET",
            },
            {
              content: "I18N.MARKET_RULES.HANDICAP_BET",
              name: "I18N.MARKET_RULES.RULES",
            },
          ],
        });
      });
    });

    describe("and market betting type is TO_BE_PLACED", () => {
      it("should return page layout with correct rules", () => {
        setupMapStateToProps(marketRulesToBePlacedMarketTypeMock);
        expect(marketRulesPage.marketRules).toEqual({
          ...marketRulesBettingTypeMockResult,
          marketBettingType: "TO_BE_PLACED",
          numberOfWinners: 2,
          sections: [
            {
              content: "Wallet",
              name: "I18N.MARKET_RULES.WALLET",
            },
            {
              content: "I18N.MARKET_RULES.TO_BE_PLACED",
              name: "I18N.MARKET_RULES.RULES",
            },
          ],
        });
      });
    });

    describe("and clarifications is not defined", () => {
      it("should return page layout without clarifications section", () => {
        setupMapStateToProps(marketRulesNoClarificationsMock);
        expect(marketRulesPage).toEqual({
          urn: "fakeMarketRulesUrn",
          title: "I18N.MARKET_RULES",
          marketRules: marketRulesNoClarificationsMockResult,
          localeCodeBcp47: "locale",
          timezone: "timezone",
          discountRateUrl: "www.market-rules.com",
        });
      });
    });
  });

  describe("when there is no card", () => {
    it("should return empty items", () => {
      setupMapStateToProps(undefined);
      expect(marketRulesPage).toEqual({
        marketRules: undefined,
        urn: "fakeMarketRulesUrn",
        title: "I18N.MARKET_RULES",
        localeCodeBcp47: "locale",
        timezone: "timezone",
        discountRateUrl: "www.market-rules.com",
      });
    });
  });

  describe("when get translations", () => {
    describe("when locale code is the same", () => {
      it("should call i18n only once for each key", () => {
        getCountryLocalCurrencyCodeSelector.mockReturnValue({
          localeCode: "pt",
          jurisdiction: {
            jurisdiction: "INTERNATIONAL",
          },
        });

        const mapStateToProps = makeMapStateToProps();
        marketRulesPage = mapStateToProps(state, { urn: "fakeMarketRulesUrn", modalView: true });
        marketRulesPage = mapStateToProps(state, { urn: "fakeMarketRulesUrn", modalView: true });

        expect(i18n).toHaveBeenCalledTimes(1);
        expect(i18n).toHaveBeenCalledWith({ key: "I18N.MARKET_RULES" });
      });
    });

    describe("when locale code is not the same", () => {
      it("should call i18n twice for each key", () => {
        getCountryLocalCurrencyCodeSelector.mockReturnValue({
          localeCode: "pt",
          jurisdiction: {
            jurisdiction: "INTERNATIONAL",
          },
        });

        const mapStateToProps = makeMapStateToProps();
        marketRulesPage = mapStateToProps(state, { urn: "fakeMarketRulesUrn", modalView: true });

        getCountryLocalCurrencyCodeSelector.mockReturnValue({
          localeCode: "de",
          jurisdiction: {
            jurisdiction: "INTERNATIONAL",
          },
        });

        marketRulesPage = mapStateToProps(state, { urn: "fakeMarketRulesUrn", modalView: true });

        expect(i18n).toHaveBeenCalledTimes(2);
        expect(i18n).toHaveBeenCalledWith({ key: "I18N.MARKET_RULES" });
      });
    });
  });
});

describe("mapDispatchToProps", () => {
  it("should export the dispatch functions", () => {
    expect(mapDispatchToProps).toStrictEqual({
      dispatchFetchFullCardAction: expect.any(Function),
      dispatchNavigateToDiscountRateExplainedAction: expect.any(Function),
    });
  });

  it("should export the dispatchFetchFullCardAction", () => {
    expect(mapDispatchToProps.dispatchFetchFullCardAction("theUrn")).toStrictEqual({
      type: FETCH_FULL_CARD,
      payload: "theUrn",
    });
  });

  it("should export the dispatchNavigateToDiscountRateExplainedAction", () => {
    expect(mapDispatchToProps.dispatchNavigateToDiscountRateExplainedAction("victimText", "victimUrl")).toStrictEqual({
      type: UI__NAVIGATE_TO_DISCOUNT_RATE_EXPLAINED,
      payload: { text: "victimText", url: "victimUrl" },
    });
  });
});
