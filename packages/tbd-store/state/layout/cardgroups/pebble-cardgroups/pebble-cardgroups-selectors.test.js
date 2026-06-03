import { createGetGridCardSportsbookMarketsByURNSelector } from "../../cards/grid/grid-cards-selectors";
import { createGetMarketCardSportsbookMarketByURNSelector } from "../../cards/market/market-cards-selectors";

import {
  createGetSelectedPebbleSportsbookMarketsSelector,
  createPartialPebbleCardGroupByURNSelector,
  createGetHydratedPebbleCardGroupByURNSelector,
  createHydratedPebbleCardGroupsSelector,
} from "./pebble-cardgroups-selectors";

const getGridCardSportsbookMarketsByURN = jest.fn();

jest.mock("../../cards/grid/grid-cards-selectors", () => ({
  createGetGridCardSportsbookMarketsByURNSelector: jest.fn(() => getGridCardSportsbookMarketsByURN),
}));

const getMarketCardSportsbookMarketByURN = jest.fn();

jest.mock("../../cards/market/market-cards-selectors", () => ({
  createGetMarketCardSportsbookMarketByURNSelector: jest.fn(() => getMarketCardSportsbookMarketByURN),
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

const GRID_CARD_URN_MOCK = "ppb:tbd:card:grid:urn";
const GRID_CARD_MOCK = {
  urn: GRID_CARD_URN_MOCK,
  markets: [{ urn: SPORTSBOOK_MARKET_URN_MOCK }],
};
const GRID_CARDS_MOCK = {
  [GRID_CARD_URN_MOCK]: GRID_CARD_MOCK,
};

const STATE_MOCK = {
  entities: {
    sportsbookmarkets: SPORTSBOOK_MARKETS_MOCK,
  },
  layouts: {
    cards: {
      markets: MARKET_CARDS_MOCK,
      grids: GRID_CARDS_MOCK,
    },
  },
};

const CARDGROUP_URN = "urn:hydrated";
const PARTIAL_CARDGROUP_URN = "urn:partial";
const MISSING_CARDGROUP_URN = "urn:missing";
const CARDGROUP = {
  urn: CARDGROUP_URN,
  items: ["item1", "item2"],
};
const PARTIAL_CARDGROUP = {
  urn: PARTIAL_CARDGROUP_URN,
};
const CARDGROUPS_MOCK = {
  [CARDGROUP_URN]: CARDGROUP,
  [PARTIAL_CARDGROUP_URN]: PARTIAL_CARDGROUP,
};

describe("pebble cardgroups selectors", () => {
  beforeEach(jest.clearAllMocks);

  describe("createGetSelectedPebbleSportsbookMarketsSelector", () => {
    const getSelectedPebbleSportsbookMarkets = ({ state = STATE_MOCK, selectedItemUrn } = {}) =>
      createGetSelectedPebbleSportsbookMarketsSelector()(state, selectedItemUrn);

    it("should create all selectors", () => {
      createGetSelectedPebbleSportsbookMarketsSelector();

      expect(createGetMarketCardSportsbookMarketByURNSelector).toHaveBeenCalledTimes(1);
      expect(createGetGridCardSportsbookMarketsByURNSelector).toHaveBeenCalledTimes(1);
    });

    describe("when there are no markets", () => {
      it("should return no markets", () => {
        getMarketCardSportsbookMarketByURN.mockReturnValueOnce(undefined);
        getGridCardSportsbookMarketsByURN.mockReturnValueOnce(undefined);

        const result = getSelectedPebbleSportsbookMarkets({ selectedItemUrn: "fake:run" });

        expect(getMarketCardSportsbookMarketByURN).toHaveBeenCalledTimes(1);
        expect(getMarketCardSportsbookMarketByURN).toHaveBeenCalledWith(
          MARKET_CARDS_MOCK,
          "fake:run",
          SPORTSBOOK_MARKETS_MOCK,
        );

        expect(getGridCardSportsbookMarketsByURN).toHaveBeenCalledTimes(1);
        expect(getGridCardSportsbookMarketsByURN).toHaveBeenCalledWith(
          GRID_CARDS_MOCK,
          "fake:run",
          SPORTSBOOK_MARKETS_MOCK,
        );

        expect(result).toEqual([]);
      });
    });

    describe("when the selected pebble is a market card", () => {
      it("should return the market card market", () => {
        getMarketCardSportsbookMarketByURN.mockReturnValueOnce(SPORTSBOOK_MARKET_MOCK);
        getGridCardSportsbookMarketsByURN.mockReturnValueOnce(undefined);

        const result = getSelectedPebbleSportsbookMarkets({ selectedItemUrn: MARKET_CARD_URN_MOCK });

        expect(getMarketCardSportsbookMarketByURN).toHaveBeenCalledTimes(1);
        expect(getMarketCardSportsbookMarketByURN).toHaveBeenCalledWith(
          STATE_MOCK.layouts.cards.markets,
          MARKET_CARD_URN_MOCK,
          STATE_MOCK.entities.sportsbookmarkets,
        );

        expect(getGridCardSportsbookMarketsByURN).toHaveBeenCalledTimes(1);
        expect(getGridCardSportsbookMarketsByURN).toHaveBeenCalledWith(
          STATE_MOCK.layouts.cards.grids,
          MARKET_CARD_URN_MOCK,
          STATE_MOCK.entities.sportsbookmarkets,
        );

        expect(result).toEqual([SPORTSBOOK_MARKET_MOCK]);
      });
    });

    describe("when the selected pebble is a grid card", () => {
      it("should return the grid card markets", () => {
        getMarketCardSportsbookMarketByURN.mockReturnValueOnce(undefined);
        getGridCardSportsbookMarketsByURN.mockReturnValueOnce([SPORTSBOOK_MARKET_MOCK, SPORTSBOOK_MARKET_MOCK]);

        const result = getSelectedPebbleSportsbookMarkets({ selectedItemUrn: GRID_CARD_URN_MOCK });

        expect(getMarketCardSportsbookMarketByURN).toHaveBeenCalledTimes(1);
        expect(getMarketCardSportsbookMarketByURN).toHaveBeenCalledWith(
          STATE_MOCK.layouts.cards.markets,
          GRID_CARD_URN_MOCK,
          STATE_MOCK.entities.sportsbookmarkets,
        );

        expect(getGridCardSportsbookMarketsByURN).toHaveBeenCalledTimes(1);
        expect(getGridCardSportsbookMarketsByURN).toHaveBeenCalledWith(
          STATE_MOCK.layouts.cards.grids,
          GRID_CARD_URN_MOCK,
          STATE_MOCK.entities.sportsbookmarkets,
        );

        expect(result).toEqual([SPORTSBOOK_MARKET_MOCK, SPORTSBOOK_MARKET_MOCK]);
      });
    });
  });

  describe("createGetHydratedPebbleCardGroupByURNSelector", () => {
    it("should return the cardgroup when urn matches and group is not a partial", () => {
      const selector = createGetHydratedPebbleCardGroupByURNSelector();
      const result = selector(CARDGROUPS_MOCK, CARDGROUP_URN);

      expect(result).toBe(CARDGROUP);
    });

    it("should return null when urn matches but group is not a partial", () => {
      const selector = createGetHydratedPebbleCardGroupByURNSelector();
      const result = selector(CARDGROUPS_MOCK, PARTIAL_CARDGROUP_URN);

      expect(result).toBeNull();
    });

    it("should return null when urn does not exist in cardgroups", () => {
      const selector = createGetHydratedPebbleCardGroupByURNSelector();
      const result = selector(CARDGROUPS_MOCK, MISSING_CARDGROUP_URN);

      expect(result).toBeNull();
    });
  });

  describe("createPartialPebbleCardGroupByURNSelector", () => {
    it("should return the partial cardgroup when urn matches and group is partial", () => {
      const selector = createPartialPebbleCardGroupByURNSelector();
      const result = selector(CARDGROUPS_MOCK, PARTIAL_CARDGROUP_URN);

      expect(result).toBe(PARTIAL_CARDGROUP);
    });

    it("should return null when urn matches but group is hydrated", () => {
      const selector = createPartialPebbleCardGroupByURNSelector();
      const result = selector(CARDGROUPS_MOCK, CARDGROUP_URN);

      expect(result).toBeNull();
    });

    it("should return null when urn does not exist in cardgroups", () => {
      const selector = createPartialPebbleCardGroupByURNSelector();
      const result = selector(CARDGROUPS_MOCK, MISSING_CARDGROUP_URN);

      expect(result).toBeNull();
    });
  });

  describe("createHydratedPebbleCardGroupsSelector", () => {
    it("should return only hydrated cardgroups", () => {
      const selector = createHydratedPebbleCardGroupsSelector();
      const result = selector(CARDGROUPS_MOCK);

      expect(result).toEqual({
        [CARDGROUP_URN]: CARDGROUP,
      });
    });

    it("should return an empty object if no hydrated cardgroups exist", () => {
      const selector = createHydratedPebbleCardGroupsSelector();
      const onlyPartial = {
        [PARTIAL_CARDGROUP_URN]: PARTIAL_CARDGROUP,
      };
      const result = selector(onlyPartial);

      expect(result).toEqual({});
    });

    it("should return an empty object if input is empty", () => {
      const selector = createHydratedPebbleCardGroupsSelector();
      const result = selector({});

      expect(result).toEqual({});
    });
  });
});
