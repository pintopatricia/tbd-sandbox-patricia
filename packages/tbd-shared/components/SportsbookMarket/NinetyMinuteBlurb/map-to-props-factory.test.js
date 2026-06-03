import { makeMapStateToProps } from "./map-to-props-factory";

jest.mock("../../../helpers/i18n", () => ({
  i18n: ({ key }) => key,
}));

const getSportsbookMarketByURN = jest.fn();

jest.mock("@ppb/tbd-store/state/entities/sportsbook-markets/sportsbook-market-selectors", () => ({
  createSportsbookMarketByURNSelector: () => getSportsbookMarketByURN,
}));

const stateMock = {
  entities: {
    sportsbookmarkets: {},
  },
};

describe("makeMapStateToProps", () => {
  describe("when there's a market but not of 90 Minute type", () => {
    it("should return an empty object", () => {
      const sbkMarketMock = {
        urn: "ppb:sbkmarket:123",
        marketType: "marketType",
      };
      getSportsbookMarketByURN.mockReturnValue(sbkMarketMock);

      expect(makeMapStateToProps()(stateMock, { marketURN: "market" })).toEqual({});
    });
  });

  describe("when there's a market of 90 Minute type", () => {
    it("should return the correct props", () => {
      const sbkMarketMock = {
        urn: "ppb:sbkmarket:123",
        marketType: "MATCH_ODDS_90",
      };
      getSportsbookMarketByURN.mockReturnValue(sbkMarketMock);

      expect(makeMapStateToProps()(stateMock, { marketURN: "market", hasSpacing: true })).toEqual({
        hasSpacing: true,
        titleKey: "I18N.NINETY_MINUTE.PROMO_INDICATOR",
        descriptionKey: "I18N.MARKET_PROMO.DESCRIPTION",
        signposting: "Value--Ninety-Minute-Payout",
        externalLinkType: "NINETY_MINUTE_RULE",
      });
    });
  });
});
