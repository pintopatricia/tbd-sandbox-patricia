import "jest-dom/extend-expect";
import { codecs } from "@ppb/tbd-urn-codecs";
import { makeMapStateToProps } from "./map-to-props-factory";

const marketExtendedCardMock = {
  title: "title",
  cashoutQuotes: ["fakeCashoutURN_1"],
  runnerViewLinks: {
    "ppb:runnerUrn": {
      viewUrn: "runnerViewURN",
      viewUrl: "runnerViewURL",
    },
  },
  displayRunners: {
    exchange: {
      market: "marketUrn",
      runners: ["runner1Urn", "runner2Urn"],
    },
    sportsbook: {
      market: "marketUrn2",
      runners: ["runner1Urn", "runner2Urn"],
    },
  },
  raceViewLink: {
    viewUrl: "race/url",
    viewUrn: codecs.raceView.encode("1", "1"),
  },
  numberOfItemsToDisplay: 4,
  marketPromo: {
    title: "market title",
    description: "market description",
    signposting: "EXTRA_PLACES",
  },
};

const getMarketExtendedCardByURN = jest.fn(() => marketExtendedCardMock);

beforeEach(jest.clearAllMocks);

jest.mock("@ppb/tbd-store/state/layout/cards/cards-selectors", () => ({
  createCardByURNSelector: jest.fn(() => getMarketExtendedCardByURN),
}));

jest.mock("@ppb/tbd-store/state/layout/views/view-selectors", () => ({
  createViewByURNSelector: jest.fn(),
}));

const state = {
  layouts: {
    cards: {
      markets: ["ppb:card"],
    },
    views: {
      market: { theMarketView: "" },
    },
  },
  router: { theRouter: "router" },
};

const setupMapStateToProps = (selectedMarketURN) => {
  const containerProps = {
    urn: "fakeMarketCardUrn",
    selectedMarketURN,
  };
  return makeMapStateToProps()(state, containerProps);
};

describe("makeMapStateToProps", () => {
  it("should getMarketCardByURN from state", () => {
    setupMapStateToProps();

    expect(getMarketExtendedCardByURN).toHaveBeenCalledWith(state.layouts.cards.marketsextended, "fakeMarketCardUrn");
  });

  it("should return props the from the extended market view", () => {
    const stateProps = setupMapStateToProps("marketUrn");

    expect(stateProps).toEqual({
      cardUrn: "fakeMarketCardUrn",
      title: "title",
      runnerViewLinks: {
        "ppb:runnerUrn": {
          viewUrn: "runnerViewURN",
          viewUrl: "runnerViewURL",
        },
      },
      displayRunners: {
        exchange: {
          market: "marketUrn",
          runners: ["runner1Urn", "runner2Urn"],
        },
        sportsbook: {
          market: "marketUrn2",
          runners: ["runner1Urn", "runner2Urn"],
        },
      },
      eventViewLink: {
        viewUrl: "race/url",
        viewUrn: codecs.raceView.encode("1", "1"),
      },
      numberOfItemsToDisplay: 4,
      marketPromo: {
        title: "market title",
        description: "market description",
        signposting: "EXTRA_PLACES",
      },
    });
  });

  describe("when numberOfItemsToDisplay is not defined", () => {
    it("should return numberOfItemsToDisplay as undefined", () => {
      getMarketExtendedCardByURN.mockReturnValue({ ...marketExtendedCardMock, numberOfItemsToDisplay: undefined });
      const stateProps = setupMapStateToProps();

      expect(stateProps.numberOfItemsToDisplay).toBeUndefined();
    });
  });
});
