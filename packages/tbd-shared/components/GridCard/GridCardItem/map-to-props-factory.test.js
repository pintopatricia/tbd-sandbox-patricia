import { createSportsbookMarketByURNSelector } from "@ppb/tbd-store/state/entities/sportsbook-markets/sportsbook-market-selectors";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

jest.mock("@ppb/tbd-store/state/entities/sportsbook-markets/sportsbook-market-selectors", () => ({
  createSportsbookMarketByURNSelector: jest.fn(() => jest.fn()),
}));

const marketUrnMock = "ppb:tbd:sbkMarket:924.111";
const selectionIdMock = 12345;

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
      it("should return a view model when the selectionId is not found", () => {
        const mockedSelector = jest.fn().mockReturnValue({
          runners: [],
        });
        createSportsbookMarketByURNSelector.mockReturnValue(mockedSelector);

        const mapStateToProps = makeMapStateToProps();
        const stateToProps = mapStateToProps(stateMock, { marketUrn: marketUrnMock });

        expect(stateToProps).toEqual({
          marketId: undefined,
          marketUrn: "ppb:tbd:sbkMarket:924.111",
          runnerUrn: "",
        });
      });

      it("should return a complete view model when the selectionId is found", () => {
        const mockedSelector = jest.fn().mockReturnValue({
          runners: [
            {
              selectionId: 12345,
              urn: "ppb:tbd:runner:12345",
            },
          ],
        });
        createSportsbookMarketByURNSelector.mockReturnValue(mockedSelector);

        const mapStateToProps = makeMapStateToProps();
        const stateToProps = mapStateToProps(stateMock, { marketUrn: marketUrnMock, selectionId: selectionIdMock });

        expect(stateToProps).toEqual({
          marketId: undefined,
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
