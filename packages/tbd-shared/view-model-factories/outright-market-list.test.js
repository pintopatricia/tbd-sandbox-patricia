import { getSportsbookMarketRunners } from "@ppb/tbd-store/state/entities/sportsbook-markets/sportsbook-market-selectors";
import { createOutrightMarketListViewModel } from "./outright-market-list";

const MARKET_RUNNERS_MOCK = [
  {
    urn: "ppb:runner:123",
  },
  {
    urn: "ppb:runner:456",
  },
  {
    urn: "ppb:runner:789",
  },
];

const EXPECTED_RUNNERS_URNS = ["ppb:runner:123", "ppb:runner:456", "ppb:runner:789"];

const state = {
  layouts: {
    cards: {
      outrightmarketlistcards: ["ppb:card"],
    },
  },
  entities: {
    sportsbookmarkets: {
      "ppb:market:123": { urn: "ppb:market:123" },
    },
  },
};

const markets = ["ppb:market:123", "ppb:market:456", "ppb:market:789", "marketThatDoesntExist"];

const getSportsbookMarketByURNSelector = jest.fn();
jest.mock("@ppb/tbd-store/state/entities/sportsbook-markets/sportsbook-market-selectors", () => ({
  createSportsbookMarketByURNSelector: jest.fn(() => getSportsbookMarketByURNSelector),
  getSportsbookMarketRunners: jest.fn(() => MARKET_RUNNERS_MOCK),
}));

describe("outright market list view model factory", () => {
  beforeEach(jest.clearAllMocks);

  describe("createOutrightMarketListViewModel", () => {
    let result;
    beforeEach(() => {
      getSportsbookMarketByURNSelector
        .mockReturnValueOnce({ name: "market name 1" })
        .mockReturnValueOnce({ name: "market name 2" })
        .mockReturnValueOnce({ name: "market name 3" })
        .mockReturnValueOnce(null);
      const getPropsForOutrightMarketListVm = createOutrightMarketListViewModel();

      result = getPropsForOutrightMarketListVm(state, markets);
    });

    it("should return the correct array for the outright market list", () => {
      expect(result).toEqual([
        { marketName: "market name 1", marketUrn: markets[0], runnersUrns: EXPECTED_RUNNERS_URNS },
        { marketName: "market name 2", marketUrn: markets[1], runnersUrns: EXPECTED_RUNNERS_URNS },
        { marketName: "market name 3", marketUrn: markets[2], runnersUrns: EXPECTED_RUNNERS_URNS },
      ]);
    });

    it("should call getSportsbookMarketByURNSelector correctly", () => {
      expect(getSportsbookMarketByURNSelector).toHaveBeenCalledTimes(markets.length);
      expect(getSportsbookMarketByURNSelector.mock.calls[0][0]).toEqual(state.entities.sportsbookmarkets, markets[0]);
      expect(getSportsbookMarketByURNSelector.mock.calls[1][0]).toEqual(state.entities.sportsbookmarkets, markets[1]);
      expect(getSportsbookMarketByURNSelector.mock.calls[2][0]).toEqual(state.entities.sportsbookmarkets, markets[2]);
      expect(getSportsbookMarketByURNSelector.mock.calls[3][0]).toEqual(state.entities.sportsbookmarkets, markets[3]);
    });

    it("should call getSportsbookMarketRunners correctly", () => {
      expect(getSportsbookMarketRunners).toHaveBeenCalledTimes(markets.length - 1);
      expect(getSportsbookMarketRunners.mock.calls[0][0]).toEqual(state, markets[0]);
      expect(getSportsbookMarketRunners.mock.calls[1][0]).toEqual(state, markets[1]);
      expect(getSportsbookMarketRunners.mock.calls[2][0]).toEqual(state, markets[2]);
    });
  });

  describe("when the view model is called more than once with the same markets", () => {
    beforeEach(() => {
      getSportsbookMarketByURNSelector.mockReturnValueOnce({ name: "market name 1" });
      const getPropsForOutrightMarketListVm = createOutrightMarketListViewModel();

      getPropsForOutrightMarketListVm(state, [markets[0]]);
      getPropsForOutrightMarketListVm(state, [markets[0]]);
    });

    it("should only run the view model once", () => {
      expect(getSportsbookMarketByURNSelector).toHaveBeenCalledTimes(1);
      expect(getSportsbookMarketByURNSelector.mock.calls[0][0]).toEqual(state.entities.sportsbookmarkets, markets[0]);
      expect(getSportsbookMarketRunners).toHaveBeenCalledTimes(1);
      expect(getSportsbookMarketRunners.mock.calls[0][0]).toEqual(state, markets[0]);
    });
  });

  describe("when the view model is called twice with different markets", () => {
    beforeEach(() => {
      getSportsbookMarketByURNSelector
        .mockReturnValueOnce({ name: "market name 1" })
        .mockReturnValueOnce({ name: "market name 2" });
      const getPropsForOutrightMarketListVm = createOutrightMarketListViewModel();

      getPropsForOutrightMarketListVm(state, [markets[0]]);
      getPropsForOutrightMarketListVm(state, [markets[1]]);
    });

    it("should run the view model twice", () => {
      expect(getSportsbookMarketByURNSelector).toHaveBeenCalledTimes(2);
      expect(getSportsbookMarketByURNSelector.mock.calls[0][0]).toEqual(state.entities.sportsbookmarkets, markets[0]);
      expect(getSportsbookMarketByURNSelector.mock.calls[1][0]).toEqual(state.entities.sportsbookmarkets, markets[1]);
      expect(getSportsbookMarketRunners).toHaveBeenCalledTimes(2);
      expect(getSportsbookMarketRunners.mock.calls[0][0]).toEqual(state, markets[0]);
      expect(getSportsbookMarketRunners.mock.calls[1][0]).toEqual(state, markets[1]);
    });
  });
});
