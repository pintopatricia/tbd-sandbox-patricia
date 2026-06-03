import { createSportsbookMarketByURNSelector } from "../../../entities/sportsbook-markets/sportsbook-market-selectors";
import { createCardByURNSelector } from "../cards-selectors";

import {
  createGetGridCardSportsbookMarketsByURNSelector,
  createGetGridCardSportsbookMarketsSelector,
} from "./grid-cards-selectors";

const getSportsbookMarketByURN = jest.fn();

jest.mock("../../../entities/sportsbook-markets/sportsbook-market-selectors", () => ({
  createSportsbookMarketByURNSelector: jest.fn(() => getSportsbookMarketByURN),
}));

const getGridCardByURN = jest.fn();

jest.mock("../cards-selectors", () => ({
  createCardByURNSelector: jest.fn(() => getGridCardByURN),
}));

const SPORTSBOOK_MARKET_URN_MOCK = "ppb:tbd:market:urn";
const SPORTSBOOK_MARKET_MOCK = { urn: SPORTSBOOK_MARKET_URN_MOCK };
const SPORTSBOOK_MARKETS_MOCK = {
  [SPORTSBOOK_MARKET_URN_MOCK]: SPORTSBOOK_MARKET_MOCK,
  "fake:market:urn": { urn: "fake:market:urn" },
};

const GRID_CARD_URN_MOCK = "ppb:tbd:card:grid:urn";
const GRID_CARD_MOCK = {
  urn: GRID_CARD_URN_MOCK,
  markets: [{ urn: SPORTSBOOK_MARKET_URN_MOCK }],
};
const GRID_CARDS_MOCK = {
  [GRID_CARD_URN_MOCK]: GRID_CARD_MOCK,
};

describe("grid cards selectors", () => {
  beforeEach(jest.clearAllMocks);

  describe("createGetGridCardSportsbookMarketsSelector", () => {
    const getGridCardSportsbookMarkets = ({
      gridCard = GRID_CARD_MOCK,
      sportsbookMarkets = SPORTSBOOK_MARKETS_MOCK,
    } = {}) => createGetGridCardSportsbookMarketsSelector()(gridCard, sportsbookMarkets);

    it("should create all selectors", () => {
      createGetGridCardSportsbookMarketsSelector();

      expect(createSportsbookMarketByURNSelector).toHaveBeenCalledTimes(1);
    });

    describe("when there's not a grid card", () => {
      it("should return no markets", () => {
        const result = getGridCardSportsbookMarkets({ gridCard: null });

        expect(getSportsbookMarketByURN).not.toHaveBeenCalled();

        expect(result).toBeUndefined();
      });
    });

    describe("when there is a grid card with a sportsbook market", () => {
      it("should return the sportsbook market", () => {
        getSportsbookMarketByURN.mockReturnValueOnce(SPORTSBOOK_MARKET_MOCK);

        const result = getGridCardSportsbookMarkets();

        expect(getSportsbookMarketByURN).toHaveBeenCalledTimes(1);
        expect(getSportsbookMarketByURN).toHaveBeenCalledWith(SPORTSBOOK_MARKETS_MOCK, SPORTSBOOK_MARKET_URN_MOCK);

        expect(result).toEqual([SPORTSBOOK_MARKET_MOCK]);
      });
    });
  });

  describe("createGetGridCardSportsbookMarketsByURNSelector", () => {
    const getGridCardSportsbookMarketsByURN = ({
      gridCards = GRID_CARDS_MOCK,
      urn = GRID_CARD_URN_MOCK,
      sportsbookMarkets = SPORTSBOOK_MARKETS_MOCK,
    } = {}) => createGetGridCardSportsbookMarketsByURNSelector()(gridCards, urn, sportsbookMarkets);

    it("should create all selectors", () => {
      createGetGridCardSportsbookMarketsByURNSelector();

      expect(createCardByURNSelector).toHaveBeenCalledTimes(1);
      expect(createSportsbookMarketByURNSelector).toHaveBeenCalledTimes(1);
    });

    describe("when there's not a grid card", () => {
      it("should return no markets", () => {
        getGridCardByURN.mockReturnValueOnce(null);

        const result = getGridCardSportsbookMarketsByURN();

        expect(getGridCardByURN).toHaveBeenCalledTimes(1);
        expect(getGridCardByURN).toHaveBeenCalledWith(GRID_CARDS_MOCK, GRID_CARD_URN_MOCK, SPORTSBOOK_MARKETS_MOCK);

        expect(getSportsbookMarketByURN).not.toHaveBeenCalled();

        expect(result).toBeUndefined();
      });
    });

    describe("when there is a grid card with a sportsbook market", () => {
      it("should return the sportsbook market", () => {
        getGridCardByURN.mockReturnValueOnce(GRID_CARD_MOCK);
        getSportsbookMarketByURN.mockReturnValueOnce(SPORTSBOOK_MARKET_MOCK);

        const result = getGridCardSportsbookMarketsByURN();

        expect(getGridCardByURN).toHaveBeenCalledTimes(1);
        expect(getGridCardByURN).toHaveBeenCalledWith(GRID_CARDS_MOCK, GRID_CARD_URN_MOCK, SPORTSBOOK_MARKETS_MOCK);

        expect(getSportsbookMarketByURN).toHaveBeenCalledTimes(1);
        expect(getSportsbookMarketByURN).toHaveBeenCalledWith(SPORTSBOOK_MARKETS_MOCK, SPORTSBOOK_MARKET_URN_MOCK);

        expect(result).toEqual([SPORTSBOOK_MARKET_MOCK]);
      });
    });
  });
});
