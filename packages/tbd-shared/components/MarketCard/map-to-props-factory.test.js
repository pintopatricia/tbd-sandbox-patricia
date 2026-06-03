import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { makeMapStateToProps } from "./map-to-props-factory";

jest.mock("@ppb/tbd-store/state/layout/cards/cards-selectors", () => ({
  createCardByURNSelector: jest.fn(),
}));

describe("makeMapStateToProps", () => {
  const getMarketCardbyURN = jest.fn();

  const DEFAULT_STATE = {
    layouts: {
      cards: {
        markets: {},
      },
    },
  };

  function setup(cardMock, urn) {
    createCardByURNSelector.mockImplementation(() => getMarketCardbyURN.mockImplementation(() => cardMock));

    return makeMapStateToProps()(DEFAULT_STATE, urn);
  }

  beforeEach(jest.clearAllMocks);

  describe("makeMapStateToProps", () => {
    it("should return props from market card view", () => {
      const marketCard = {
        urn: "urn",
        title: "Title",
        viewLinks: [],
        runnerViewLinks: {
          "ppb:excRunner:1.174853945/27157516/0": {
            runnerUrn: "ppb:excRunner:1.174853945/27157516/0",
            viewUrl: "Not Implemented",
            viewUrn: "ppb:tbd:view:runner:1.174853945/27157516/0",
          },
        },
        displayRunners: {
          exchange: {
            markets: "ppb:excMarket:1",
            runners: ["runner1Urn", "runner2Urn"],
          },
          sportsbook: {
            markets: "ppb:sbkMarket:1",
            runners: ["runner1Urn", "runner2Urn"],
          },
        },
        numberOfItemsToDisplay: 2,
        marketPromo: {
          title: "market title",
          description: "market description",
          signposting: "EXTRA_PLACES",
        },
      };
      const state = setup(marketCard, {
        urn: "urn",
      });
      expect(state).toEqual({
        title: marketCard.title,
        cardUrn: marketCard.urn,
        marketViewLinks: marketCard.viewLinks,
        runnerViewLinks: {
          "ppb:excRunner:1.174853945/27157516/0": {
            runnerUrn: "ppb:excRunner:1.174853945/27157516/0",
            viewUrl: "Not Implemented",
            viewUrn: "ppb:tbd:view:runner:1.174853945/27157516/0",
          },
        },
        displayRunners: {
          exchange: {
            markets: "ppb:excMarket:1",
            runners: ["runner1Urn", "runner2Urn"],
          },
          sportsbook: {
            markets: "ppb:sbkMarket:1",
            runners: ["runner1Urn", "runner2Urn"],
          },
        },
        numberOfItemsToDisplay: 2,
        marketPromo: {
          title: "market title",
          description: "market description",
          signposting: "EXTRA_PLACES",
        },
      });
    });
  });
});
