import { createSportsbookMarketByURNSelector } from "../../../entities/sportsbook-markets/sportsbook-market-selectors";
import { createCardByURNSelector } from "../cards-selectors";

import { createGetMarketCardSportsbookMarketByURNSelector } from "./market-cards-selectors";

const getSportsbookMarketByURN = jest.fn();

jest.mock("../../../entities/sportsbook-markets/sportsbook-market-selectors", () => ({
  createSportsbookMarketByURNSelector: jest.fn(() => getSportsbookMarketByURN),
}));

const getMarketCardByURN = jest.fn();

jest.mock("../cards-selectors", () => ({
  createCardByURNSelector: jest.fn(() => getMarketCardByURN),
}));

const SPORTSBOOK_MARKET_URN_MOCK = "ppb:tbd:market:urn";
const SPORTSBOOK_MARKET_MOCK = { urn: SPORTSBOOK_MARKET_URN_MOCK };
const SPORTSBOOK_MARKETS_MOCK = {
  [SPORTSBOOK_MARKET_URN_MOCK]: SPORTSBOOK_MARKET_MOCK,
};

const MARKET_CARD_URN_MOCK = "ppb:tbd:card:market:urn";
const MARKET_CARD_MOCK = {
  urn: MARKET_CARD_URN_MOCK,
  displayRunners: { sportsbook: { market: SPORTSBOOK_MARKET_URN_MOCK } },
};
const MARKET_CARDS_MOCK = {
  [MARKET_CARD_URN_MOCK]: MARKET_CARD_MOCK,
};

describe("market cards selectors", () => {
  beforeEach(jest.clearAllMocks);

  describe("createGetMarketCardSportsbookMarketByURNSelector", () => {
    const getMarketCardSportsbookMarketByURN = ({
      marketCards = MARKET_CARDS_MOCK,
      urn = MARKET_CARD_URN_MOCK,
      sportsbookMarkets = SPORTSBOOK_MARKETS_MOCK,
    } = {}) => createGetMarketCardSportsbookMarketByURNSelector()(marketCards, urn, sportsbookMarkets);

    it("should create all selectors", () => {
      createGetMarketCardSportsbookMarketByURNSelector();

      expect(createCardByURNSelector).toHaveBeenCalledTimes(1);
      expect(createSportsbookMarketByURNSelector).toHaveBeenCalledTimes(1);
    });

    describe("when there's not a market card", () => {
      it("should return no markets", () => {
        getMarketCardByURN.mockReturnValueOnce(null);

        const result = getMarketCardSportsbookMarketByURN();

        expect(getMarketCardByURN).toHaveBeenCalledTimes(1);
        expect(getMarketCardByURN).toHaveBeenCalledWith(
          MARKET_CARDS_MOCK,
          MARKET_CARD_URN_MOCK,
          SPORTSBOOK_MARKETS_MOCK,
        );

        expect(getSportsbookMarketByURN).not.toHaveBeenCalled();

        expect(result).toBeUndefined();
      });
    });

    describe("when there is a market card without a sportsbook market", () => {
      it("should return no markets", () => {
        getMarketCardByURN.mockReturnValueOnce({ ...MARKET_CARD_MOCK, displayRunners: {} });

        const result = getMarketCardSportsbookMarketByURN();

        expect(getMarketCardByURN).toHaveBeenCalledTimes(1);
        expect(getMarketCardByURN).toHaveBeenCalledWith(
          MARKET_CARDS_MOCK,
          MARKET_CARD_URN_MOCK,
          SPORTSBOOK_MARKETS_MOCK,
        );

        expect(getSportsbookMarketByURN).not.toHaveBeenCalled();

        expect(result).toBeUndefined();
      });
    });

    describe("when there is a market card with a sportsbook market", () => {
      it("should return the sportsbook market", () => {
        getMarketCardByURN.mockReturnValueOnce(MARKET_CARD_MOCK);
        getSportsbookMarketByURN.mockReturnValueOnce(SPORTSBOOK_MARKET_MOCK);

        const result = getMarketCardSportsbookMarketByURN();

        expect(getMarketCardByURN).toHaveBeenCalledTimes(1);
        expect(getMarketCardByURN).toHaveBeenCalledWith(
          MARKET_CARDS_MOCK,
          MARKET_CARD_URN_MOCK,
          SPORTSBOOK_MARKETS_MOCK,
        );

        expect(getSportsbookMarketByURN).toHaveBeenCalledTimes(1);
        expect(getSportsbookMarketByURN).toHaveBeenCalledWith(SPORTSBOOK_MARKETS_MOCK, SPORTSBOOK_MARKET_URN_MOCK);

        expect(result).toEqual(SPORTSBOOK_MARKET_MOCK);
      });
    });
  });
});
