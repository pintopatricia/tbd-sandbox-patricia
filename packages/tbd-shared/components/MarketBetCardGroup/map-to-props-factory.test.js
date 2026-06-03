import { createCardGroupByURNSelector } from "@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors";
import { makeMapStateToProps } from "./map-to-props-factory";

jest.mock("@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors", () => ({
  createCardGroupByURNSelector: jest.fn(),
}));

const DEFAULT_STATE = {
  layouts: {
    cardgroups: {
      marketbetcardgroups: {
        "market-bet-card-group-urn-mock": {
          urn: "market-bet-card-group-urn-mock",
          typename: "MarketBetCardGroup",
          items: [
            {
              typename: "MarketBetCard",
              urn: "market-bet-card-urn-mock",
            },
            {
              typename: "MarketBetExpandableCardGroup",
              urn: "market-bet-expandable-card-group-urn-mock",
            },
          ],
        },
      },
    },
  },
};

describe("makeMapStateToProps", () => {
  function setup(state, containerProps = {}) {
    return makeMapStateToProps()(state, containerProps);
  }

  beforeEach(jest.clearAllMocks);

  describe("when getCardGroupByURN does not return cardGroup with items", () => {
    it("should return an object with empty items", () => {
      createCardGroupByURNSelector.mockReturnValue(() => undefined);

      expect(setup(DEFAULT_STATE)).toEqual({ items: [] });
    });
  });

  describe("when urn corresponds to an MarketBetCardGroup", () => {
    it("should return the correct state props", () => {
      createCardGroupByURNSelector.mockReturnValue(
        () => DEFAULT_STATE.layouts.cardgroups.marketbetcardgroups["market-bet-card-group-urn-mock"],
      );

      expect(setup(DEFAULT_STATE, { urn: "market-bet-card-group-urn-mock" })).toEqual({
        items: [
          {
            typename: "MarketBetCard",
            urn: "market-bet-card-urn-mock",
          },
          {
            typename: "MarketBetExpandableCardGroup",
            urn: "market-bet-expandable-card-group-urn-mock",
          },
        ],
      });
    });
  });

  describe("when items is null", () => {
    it("should return the correct state props", () => {
      createCardGroupByURNSelector.mockReturnValue(() => ({
        ...DEFAULT_STATE.layouts.cardgroups.marketbetcardgroups["market-bet-card-group-urn-mock"],
        items: null,
      }));

      expect(setup(DEFAULT_STATE, { urn: "market-bet-card-group-urn-mock" })).toEqual({
        items: [],
      });
    });
  });
});
