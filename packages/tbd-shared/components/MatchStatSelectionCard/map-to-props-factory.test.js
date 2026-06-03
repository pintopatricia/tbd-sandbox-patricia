import { createSportsbookMarketByURNSelector } from "@ppb/tbd-store/state/entities/sportsbook-markets/sportsbook-market-selectors";
import { createSportsbookRunnerStatusSelector } from "@ppb/tbd-store/state/entities/sportsbook-runners/sportsbook-runner-selectors";
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import {
  SUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
  UNSUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
} from "@ppb/tbd-store/actions/sportsbook-markets";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

jest.mock("@ppb/tbd-store/state/entities/sportsbook-markets/sportsbook-market-selectors", () => ({
  createSportsbookMarketByURNSelector: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/entities/sportsbook-runners/sportsbook-runner-selectors", () => ({
  createSportsbookRunnerStatusSelector: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/layout/cards/cards-selectors", () => ({
  createCardByURNSelector: jest.fn(),
}));

const stateMock = {
  layouts: {
    cards: {
      matchstatselections: {
        "ppb:tbd:matchStatSelectionCard:1": {
          urn: "ppb:tbd:matchStatSelectionCard:1",
        },
      },
    },
  },
  entities: {
    sportsbookmarkets: {
      "ppb:sbkMarket:123": {
        urn: "ppb:sbkMarket:123",
      },
    },
    sportsbookrunners: "SPORTSBOOK_RUNNERS",
  },
};

describe("makeMapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  it("should create the selectors", () => {
    makeMapStateToProps();
    expect(createCardByURNSelector).toHaveBeenCalledTimes(1);
    expect(createCardByURNSelector).toHaveBeenCalledWith();
    expect(createSportsbookMarketByURNSelector).toHaveBeenCalledTimes(1);
    expect(createSportsbookMarketByURNSelector).toHaveBeenCalledWith();
    expect(createSportsbookRunnerStatusSelector).toHaveBeenCalledTimes(1);
    expect(createSportsbookRunnerStatusSelector).toHaveBeenCalledWith();
  });

  it("should return the mapStateToProps function", () => {
    const mapStateToProps = makeMapStateToProps();
    expect(mapStateToProps).toEqual(expect.any(Function));
  });

  describe("mapStateToProps", () => {
    it("should get the matchStatSelectionCard by its URN", () => {
      const getMatchStatSelectionCard = jest.fn();
      createCardByURNSelector.mockReturnValue(getMatchStatSelectionCard);
      const mapStateToProps = makeMapStateToProps();

      mapStateToProps(stateMock, { urn: "ppb:tbd:matchStatSelectionCard:1" });
      expect(getMatchStatSelectionCard).toHaveBeenCalledTimes(1);
      expect(getMatchStatSelectionCard).toHaveBeenCalledWith(
        {
          "ppb:tbd:matchStatSelectionCard:1": {
            urn: "ppb:tbd:matchStatSelectionCard:1",
          },
        },
        "ppb:tbd:matchStatSelectionCard:1",
      );
    });

    describe("when match stat selection card is undefined", () => {
      it("should return empty object", () => {
        const getMatchStatSelectionCard = jest.fn();
        createCardByURNSelector.mockReturnValue(getMatchStatSelectionCard);
        getMatchStatSelectionCard.mockReturnValueOnce(undefined);

        const mapStateToProps = makeMapStateToProps();

        const props = mapStateToProps(stateMock, { urn: "ppb:tbd:matchStatSelectionCard:1" });
        expect(props).toEqual({});
      });
    });

    describe("when match stat selection card is defined", () => {
      it("should call getSportsbookMarketByURN and return empty object if it is undefined", () => {
        const getMatchStatSelectionCard = jest.fn();
        createCardByURNSelector.mockReturnValue(getMatchStatSelectionCard);
        getMatchStatSelectionCard.mockReturnValueOnce({
          urn: "ppb:tbd:matchStatSelectionCard:1",
          market: "ppb:sbkMarket:1",
        });

        const getSportsbookMarketByURNSelector = jest.fn();
        createSportsbookMarketByURNSelector.mockReturnValue(getSportsbookMarketByURNSelector);
        getSportsbookMarketByURNSelector.mockReturnValueOnce(undefined);

        const mapStateToProps = makeMapStateToProps();

        const props = mapStateToProps(stateMock, { urn: "ppb:tbd:matchStatSelectionCard:1" });
        expect(getSportsbookMarketByURNSelector).toHaveBeenCalledWith(
          {
            "ppb:sbkMarket:123": {
              urn: "ppb:sbkMarket:123",
            },
          },
          "ppb:sbkMarket:1",
        );

        expect(props).toEqual({});
      });

      describe("when market is defined", () => {
        describe("when market status isn't CLOSED neither runner status is REMOVED", () => {
          it("should return isMarketClosed prop as false", () => {
            const getMatchStatSelectionCard = jest.fn();
            createCardByURNSelector.mockReturnValue(getMatchStatSelectionCard);
            getMatchStatSelectionCard.mockReturnValueOnce({
              title: "Title",
              urn: "ppb:tbd:matchStatSelectionCard:1",
              market: "ppb:sbkMarket:123",
              runner: "ppb:sbkrunner:1",
              displayPreviousOdd: false,
              incidentType: "IncidentType",
              statsDescription: "StatsDescription",
              subtitle: "Subtitle",
            });

            const getSportsbookMarketByURNSelector = jest.fn();
            createSportsbookMarketByURNSelector.mockReturnValue(getSportsbookMarketByURNSelector);
            getSportsbookMarketByURNSelector.mockReturnValueOnce({
              marketId: "123",
              marketUrn: "ppb:sbkMarket:123",
              urn: "ppb:sbkMarket:123",
              status: "SUSPENDED",
            });

            const getSportsbookRunnerStatusByURNSelector = jest.fn();
            createSportsbookRunnerStatusSelector.mockReturnValue(getSportsbookRunnerStatusByURNSelector);
            getSportsbookRunnerStatusByURNSelector.mockReturnValueOnce("ACTIVE");

            const mapStateToProps = makeMapStateToProps();

            const props = mapStateToProps(stateMock, { urn: "ppb:tbd:matchStatSelectionCard:1" });

            expect(props).toEqual({
              isMarketClosed: false,
              marketId: "123",
              marketUrn: "ppb:sbkMarket:123",
              runnerUrn: "ppb:sbkrunner:1",
              title: {
                playerNames: [],
                combiner: "",
              },
              urn: "ppb:tbd:matchStatSelectionCard:1",
              incidentType: "IncidentType",
              statsDescription: "StatsDescription",
              subtitle: undefined,
            });
          });
        });

        describe("when market status is CLOSED", () => {
          it("should return isMarketClosed prop as true", () => {
            const market = {
              marketId: "123",
              urn: "ppb:sbkMarket:123",
              status: "CLOSED",
            };

            const getMatchStatSelectionCard = jest.fn();
            createCardByURNSelector.mockReturnValue(getMatchStatSelectionCard);
            getMatchStatSelectionCard.mockReturnValueOnce({
              title: "Title",
              urn: "ppb:tbd:matchStatSelectionCard:1",
              market: "ppb:sbkMarket:123",
              runner: "ppb:sbkrunner:1",
            });

            const getSportsbookMarketByURNSelector = jest.fn();
            createSportsbookMarketByURNSelector.mockReturnValue(getSportsbookMarketByURNSelector);
            getSportsbookMarketByURNSelector.mockReturnValueOnce(market);

            const getSportsbookRunnerStatusByURNSelector = jest.fn();
            createSportsbookRunnerStatusSelector.mockReturnValue(getSportsbookRunnerStatusByURNSelector);
            getSportsbookRunnerStatusByURNSelector.mockReturnValueOnce("ACTIVE");

            const mapStateToProps = makeMapStateToProps();

            const props = mapStateToProps(stateMock, { urn: "ppb:tbd:matchStatSelectionCard:1" });

            expect(props.isMarketClosed).toEqual(true);
          });
        });

        describe("when the runner status is REMOVED", () => {
          it("should return isMarketClosed as true", () => {
            const getMatchStatSelectionCard = jest.fn();
            createCardByURNSelector.mockReturnValue(getMatchStatSelectionCard);
            getMatchStatSelectionCard.mockReturnValueOnce({
              title: "Title",
              urn: "ppb:tbd:matchStatSelectionCard:1",
              market: "ppb:sbkMarket:123",
              runner: "ppb:sbkrunner:1",
              displayPreviousOdd: false,
            });

            const getSportsbookMarketByURNSelector = jest.fn();
            createSportsbookMarketByURNSelector.mockReturnValue(getSportsbookMarketByURNSelector);
            getSportsbookMarketByURNSelector.mockReturnValueOnce({
              marketId: "123",
              urn: "ppb:sbkMarket:123",
              status: "OPEN",
            });

            const getSportsbookRunnerStatusByURNSelector = jest.fn();
            createSportsbookRunnerStatusSelector.mockReturnValue(getSportsbookRunnerStatusByURNSelector);
            getSportsbookRunnerStatusByURNSelector.mockReturnValueOnce("REMOVED");

            const mapStateToProps = makeMapStateToProps();

            const props = mapStateToProps(stateMock, { urn: "ppb:tbd:matchStatSelectionCard:1" });

            expect(props.isMarketClosed).toEqual(true);
          });
        });
      });
    });
  });
});

describe("mapDispatchToProps", () => {
  beforeEach(jest.clearAllMocks);

  describe("dispatchMarketUpdatesSubscribe", () => {
    it("should dispatch sportsbook market updates subscribe action", () => {
      const { dispatchMarketUpdatesSubscribe } = mapDispatchToProps;

      expect(dispatchMarketUpdatesSubscribe("marketId", true)).toEqual({
        type: SUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
        payload: { marketId: "marketId", subscriberId: "matchStatsSelectionCard" },
      });
    });

    it("should dispatch sportsbook market updates unsubscribe action if not visible", () => {
      const { dispatchMarketUpdatesSubscribe } = mapDispatchToProps;

      expect(dispatchMarketUpdatesSubscribe("marketId", false)).toEqual({
        type: UNSUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
        payload: { marketId: "marketId", subscriberId: "matchStatsSelectionCard" },
      });
    });
  });

  describe("dispatchMarketUpdatesUnsubscribe", () => {
    it("should dispatch sportsbook market updates unsubscribe action", () => {
      const { dispatchMarketUpdatesUnsubscribe } = mapDispatchToProps;

      expect(dispatchMarketUpdatesUnsubscribe("marketId")).toEqual({
        type: UNSUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
        payload: { marketId: "marketId", subscriberId: "matchStatsSelectionCard" },
      });
    });
  });
});
