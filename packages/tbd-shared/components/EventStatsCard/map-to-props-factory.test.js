import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { makeMapStateToProps } from "./map-to-props-factory";

jest.mock("@ppb/tbd-store/state/layout/cards/cards-selectors", () => ({
  createCardByURNSelector: jest.fn(),
}));

jest.spyOn(console, "warn").mockImplementation();

describe("makeMapStateToProps", () => {
  const URN = "ppb:tbd:card:eventStats:31797631";
  const EVENT_STATS_CARD = {
    urn: URN,
    typename: "EventStatsCard",
    matchStatsUrl:
      "https://videoplayer.betfair.com/GetPlayer.do?eID=31797631&contentType=VIZ&aspectRatio=0.85&maxWidthPixel=1080&tr=1036&contentView=mstats",
  };
  const APPLICATIONAL_STATE = {
    layouts: {
      cards: {
        eventsstats: {
          [URN]: EVENT_STATS_CARD,
        },
      },
    },
  };
  const CONTAINER_PROPS = { urn: "ppb:tbd:card:eventStats:31797631" };

  beforeEach(() => {
    createCardByURNSelector.mockReturnValue(jest.fn());
  });

  afterEach(jest.clearAllMocks);

  it("should call createCardByURNSelector and it's returned function with the correct parameters", () => {
    makeMapStateToProps()(APPLICATIONAL_STATE, CONTAINER_PROPS);

    expect(createCardByURNSelector).toHaveBeenCalledWith();
  });

  describe("when there's no corresponding card available for a given URN", () => {
    it("should return empty object", () => {
      const vm = makeMapStateToProps()(APPLICATIONAL_STATE, CONTAINER_PROPS);

      expect(vm).toEqual({});
    });
  });

  describe("when there's a card available for a given URN", () => {
    beforeEach(() => {
      createCardByURNSelector.mockReturnValue(jest.fn(() => EVENT_STATS_CARD));
    });

    it("should return the provided url", () => {
      const vm = makeMapStateToProps()(APPLICATIONAL_STATE, CONTAINER_PROPS);

      expect(vm.statsUrl.toString()).toEqual(EVENT_STATS_CARD.matchStatsUrl);
    });

    describe("and it provides an invalid URL", () => {
      beforeEach(() => {
        createCardByURNSelector.mockReturnValue(
          jest.fn(() => ({
            ...EVENT_STATS_CARD,
            matchStatsUrl: "invalid-url",
          })),
        );
      });

      it("should return empty object", () => {
        const vm = makeMapStateToProps()(APPLICATIONAL_STATE, CONTAINER_PROPS);

        expect(vm).toEqual({});
      });
    });
  });
});
