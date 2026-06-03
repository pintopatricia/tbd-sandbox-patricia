import { createViewTypeSelector } from "@ppb/tbd-store/state/layout/layout-selectors";
import { getLayoutMetadata } from "@ppb/tbd-store/state/layout-snapshot";
import { getStatsPebbleCardGroup } from "./StatsPebbleCardGroup.graphql";
import { statsPebbleClickTrackingResolver } from "./stats-pebble-card-group-resolvers";
import { i18n } from "../../../../helpers/i18n";

jest.mock("./StatsPebbleCardGroup.graphql", () => ({
  getStatsPebbleCardGroup: jest.fn(),
}));

jest.mock("@ppb/tbd-store/create-store", () => ({
  getStore: jest.fn().mockReturnValue({
    getState: jest.fn(),
  }),
}));

jest.mock("@ppb/tbd-store/state/layout-snapshot", () => ({
  getLayoutMetadata: jest.fn().mockReturnValue({
    cardGroupTitle: "card name",
    marketTitle: "market name",
  }),
}));

jest.mock("@ppb/tbd-store/state/layout/layout-selectors", () => ({
  createViewTypeSelector: jest.fn(),
}));

jest.mock("../../../../helpers/i18n", () => ({
  i18n: jest.fn(),
}));

const sendEvent = jest.fn();
const cardMock = {
  urn: "urn",
  status: "status",
  sportEvent: {
    urn: "urn",
    name: "event name",
    competition: {
      urn: "urn",
      name: "competition name",
    },
  },
  items: {
    edges: [
      {
        node: {
          urn: "ppb:pebble:stats:overallform",
        },
        displayName: {
          translationKey: "I18N.STATS.OVERALL_FORM",
        },
      },
      {
        node: {
          urn: "ppb:pebble:stats:h2hform",
        },
        displayName: {
          translationKey: "I18N.STATS.H2H_FORM",
        },
      },
    ],
  },
};

describe("StatsPebbleCardGroup Tracking resolvers", () => {
  describe("statsPebbleClickTrackingResolver", () => {
    beforeEach(jest.clearAllMocks);

    describe("when we're not able to fetch the card", () => {
      it("should not call 'sendEvent' function", async () => {
        getStatsPebbleCardGroup.mockResolvedValueOnce(null);

        await statsPebbleClickTrackingResolver(
          {
            urn: "urn",
            pebbleId: "ppb:pebble:stats:overallform",
          },
          sendEvent,
        );

        expect(sendEvent).not.toHaveBeenCalled();
      });
    });

    describe("when the payload has no urn", () => {
      it("should not call 'sendEvent'", async () => {
        await statsPebbleClickTrackingResolver(
          {
            pebbleId: "ppb:pebble:stats:overallform",
          },
          sendEvent,
        );

        expect(sendEvent).not.toHaveBeenCalled();
      });
    });

    describe("when we're able to fetch the card", () => {
      it("should call 'sendEvent function", async () => {
        getLayoutMetadata.mockReturnValueOnce({ cardGroupTitle: "StatsPebbleCardGroup", marketTitle: "Match Odds 90" });
        i18n.mockReturnValueOnce("overall form");
        getStatsPebbleCardGroup.mockResolvedValueOnce(cardMock);
        createViewTypeSelector.mockReturnValueOnce(() => "HOME");

        await statsPebbleClickTrackingResolver(
          {
            urn: "urn",
            pebbleId: "ppb:pebble:stats:overallform",
          },
          sendEvent,
        );

        expect(sendEvent).toHaveBeenCalledTimes(1);
        expect(sendEvent).toHaveBeenCalledWith({
          action: "clicked",
          element_text: "stats - overall form",
          event: "interface",
          module: "home - statspebblecardgroup - match odds 90 - competition name - event name - status",
          event_context: "null",
          game_filter: "null",
          swimlane_type: "null",
        });
      });
    });
  });
});
