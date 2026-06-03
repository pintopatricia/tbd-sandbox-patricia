import { createSportsbookMarketByURNSelector } from "@ppb/tbd-store/state/entities/sportsbook-markets/sportsbook-market-selectors";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

jest.mock("@ppb/tbd-store/state/entities/sportsbook-markets/sportsbook-market-selectors", () => ({
  createSportsbookMarketByURNSelector: jest.fn(() => jest.fn()),
}));

const marketUrnMock = "ppb:tbd:sbkMarket:924.111";

const stateMock = {
  entities: {
    sportsbookmarkets: {},
  },
};

describe("map-state-props", () => {
  describe("mapStateToProps", () => {
    beforeEach(jest.clearAllMocks);

    describe("when market is not defined", () => {
      it("should return empty object", () => {
        const mockedSelector = jest.fn().mockReturnValue(undefined);
        createSportsbookMarketByURNSelector.mockReturnValue(mockedSelector);

        const mapStateToProps = makeMapStateToProps();
        const stateToProps = mapStateToProps(stateMock, { marketUrn: marketUrnMock });

        expect(stateToProps).toEqual({});
      });
    });

    describe("when market is defined", () => {
      it("should return a complete view model", () => {
        const mockedSelector = jest.fn().mockReturnValue({
          marketId: "marketid",
        });
        createSportsbookMarketByURNSelector.mockReturnValue(mockedSelector);

        const mapStateToProps = makeMapStateToProps();
        const stateToProps = mapStateToProps(stateMock, {
          marketUrn: marketUrnMock,
          runnerUrn: "ppb:tbd:runner:12345",
        });

        expect(stateToProps).toEqual({
          marketId: "marketid",
          marketUrn: "ppb:tbd:sbkMarket:924.111",
          runnerUrn: "ppb:tbd:runner:12345",
        });
      });
    });
  });

  describe("mapDispatchToProps", () => {
    describe("dispatchSportsbookMarketUpdatesSubscribe", () => {
      it("should return the correct action creator", () => {
        const { dispatchSportsbookMarketUpdatesSubscribe } = mapDispatchToProps;

        expect(dispatchSportsbookMarketUpdatesSubscribe("924.111")).toEqual({
          payload: { marketId: "924.111" },
          type: "SUBSCRIBE_SPORTSBOOK_MARKET_UPDATES",
        });
      });
    });

    describe("dispatchSportsbookMarketUpdatesUnsubscribe", () => {
      it("should return the correct action creator", () => {
        const { dispatchSportsbookMarketUpdatesUnsubscribe } = mapDispatchToProps;

        expect(dispatchSportsbookMarketUpdatesUnsubscribe("924.111")).toEqual({
          payload: { marketId: "924.111" },
          type: "UNSUBSCRIBE_SPORTSBOOK_MARKET_UPDATES",
        });
      });
    });
  });
});
