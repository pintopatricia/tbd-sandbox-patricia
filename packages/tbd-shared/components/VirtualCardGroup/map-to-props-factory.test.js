import { SUBSCRIBE_VIRTUALS_CARD, UNSUBSCRIBE_VIRTUALS_CARD } from "@ppb/tbd-store/actions/virtuals";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

const eachWayFraction = 5;
const eachWayPlaces = 3;

const entities = {
  virtualsports: {
    "ppb:virtualSport:1": {
      typename: "VirtualSport",
      urn: "ppb:virtualSport:1",
    },
  },
  virtualmarkets: {
    "ppb:virtualMarket:1": {
      typename: "VirtualMarket",
      urn: "ppb:virtualMarket:1",
      marketType: "WIN",
      runners: ["ppb:virtualRunner:1"],
      hasEachWay: true,
      eachWayPlaces,
      eachWayFraction,
      status: "SUSPENDED",
    },
    "ppb:virtualMarket:3": {
      typename: "VirtualMarket",
      urn: "ppb:virtualMarket:3",
      marketType: "CORRECT_SCORE",
      runners: ["ppb:virtualRunner:1"],
    },
    "ppb:virtualMarket:2": {
      typename: "VirtualMarket",
      urn: "ppb:virtualMarket:2",
      marketType: "MATCH_ODDS",
      runners: ["ppb:virtualRunner:2"],
      hasEachWay: false,
    },
  },
  virtualevents: {
    "ppb:virtualEvent:1": {
      typename: "VirtualEvent",
      urn: "ppb:virtualEvent:1",
      isExpired: false,
    },
  },
  virtualrunners: {
    "ppb:virtualRunner:1": {
      typename: "VirtualRunner",
      urn: "ppb:virtualRunner:1",
      name: "Runner 1 name",
      odds: "Runner 1 odds",
      humanTexture: "some texture",
    },
  },
  preferences: {
    sportsbookOddsDisplay: true,
  },
};

const state = {
  layouts: {
    cardgroups: {
      virtualcardgroups: {
        "ppb:virtualcardgroup:1": {
          items: ["item:1", "item:2"],
        },
      },
    },
  },
  betting: {
    sportsbookBetting: {
      legs: {},
    },
  },
  entities,
};
const getCardByURN = jest.fn((selectorState, urn) => selectorState[urn]);

jest.mock("@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors", () => ({
  createCardGroupByURNSelector: jest.fn(() => getCardByURN),
}));

const setupMapStateToProps = (urn) => {
  const containerProps = { urn };
  return makeMapStateToProps()(state, containerProps);
};

describe("makeMapStateToProps", () => {
  afterEach(() => jest.clearAllMocks());

  describe("when there is no card", () => {
    it("should return empty mapping", () => {
      expect(setupMapStateToProps("ppb:virtualcardgroup:2")).toEqual({});
    });
  });

  describe("when there is a card", () => {
    it("should return the items", () => {
      expect(setupMapStateToProps("ppb:virtualcardgroup:1").items).toEqual(["item:1", "item:2"]);
    });
  });
});

describe("mapDispatchToProps", () => {
  afterEach(() => jest.clearAllMocks());

  describe("dispatchVirtualsSubscribe", () => {
    it("should return SUBSCRIBE_VIRTUALS_CARD action with urn", () => {
      expect(mapDispatchToProps.dispatchVirtualsSubscribe("urn:1")).toEqual({
        type: SUBSCRIBE_VIRTUALS_CARD,
        payload: { urn: "urn:1" },
      });
    });
  });
  describe("dispatchVirtualsUnsubscribe", () => {
    it("should return UNSUBSCRIBE_VIRTUALS_CARD action", () => {
      expect(mapDispatchToProps.dispatchVirtualsUnsubscribe()).toEqual({
        type: UNSUBSCRIBE_VIRTUALS_CARD,
      });
    });
  });
});
