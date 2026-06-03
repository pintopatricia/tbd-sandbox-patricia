import { createViewTypeSelector } from "@ppb/tbd-store/state/layout/layout-selectors";
import { getLayoutMetadata } from "@ppb/tbd-store/state/layout-snapshot";
import { getStatsSupportingContentButtonsCardGroup } from "./StatsSupportingContentButtonsCardGroup.graphql";
import { statsSupportingContentButtonsClickTrackingResolver } from "./stats-supporting-content-buttons-card-group-resolvers";
import { i18n } from "../../../../helpers/i18n";

jest.mock("./StatsSupportingContentButtonsCardGroup.graphql", () => ({
  getStatsSupportingContentButtonsCardGroup: jest.fn(),
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
  items: {
    edges: [
      {
        node: {
          urn: "ppb:tbd:stats:card:broadcasts:1",
        },
        displayName: {
          translationKey: "I18N.LIVE_VIDEO_STATUS.LIVE_VIDEO",
        },
      },
      {
        node: {
          urn: "ppb:tbd:stats:card:matchStats:1",
        },
        displayName: {
          translationKey: "I18N.INPLAY.COUPON.MATCH.STATS.PEBBLE",
        },
      },
    ],
  },
};

describe("StatsSupportingContentButtonsCardGroup Tracking resolvers", () => {
  describe("statsSupportingContentButtonsClickTrackingResolver", () => {
    beforeEach(jest.clearAllMocks);

    describe("when we're not able to fetch the card", () => {
      it("should not call 'sendEvent' function", async () => {
        getStatsSupportingContentButtonsCardGroup.mockResolvedValueOnce(null);

        await statsSupportingContentButtonsClickTrackingResolver(
          {
            urn: "urn",
            isSelected: true,
            buttonId: "ppb:tbd:stats:card:broadcasts:1",
          },
          sendEvent,
        );

        expect(sendEvent).not.toHaveBeenCalled();
      });
    });

    describe("when the payload has no urn", () => {
      it("should not call 'sendEvent'", async () => {
        await statsSupportingContentButtonsClickTrackingResolver(
          {
            isSelected: true,
            buttonId: "ppb:tbd:stats:card:broadcasts:1",
          },
          sendEvent,
        );

        expect(sendEvent).not.toHaveBeenCalled();
      });
    });

    describe("when we're able to fetch the card", () => {
      describe("and isSelected is true", () => {
        it("should call 'sendEvent function with the right parameters", async () => {
          i18n.mockReturnValueOnce("I18N.LIVE_VIDEO_STATUS.LIVE_VIDEO");
          getStatsSupportingContentButtonsCardGroup.mockResolvedValueOnce(cardMock);
          createViewTypeSelector.mockReturnValueOnce(() => "mybets");

          await statsSupportingContentButtonsClickTrackingResolver(
            {
              urn: "urn",
              isSelected: true,
              buttonId: "ppb:tbd:stats:card:broadcasts:1",
            },
            sendEvent,
          );

          expect(sendEvent).toHaveBeenCalledTimes(1);
          expect(sendEvent).toHaveBeenCalledWith({
            action: "show",
            element_text: "i18n.live_video_status.live_video",
            event: "interface",
            module: "mybets - i18n.live_video_status.live_video",
            event_context: "null",
            game_filter: "null",
            swimlane_type: "null",
          });
        });
      });

      describe("and isSelected is false", () => {
        it("should call 'sendEvent function with the right parameters", async () => {
          i18n.mockReturnValueOnce("I18N.LIVE_VIDEO_STATUS.LIVE_VIDEO");
          getStatsSupportingContentButtonsCardGroup.mockResolvedValueOnce(cardMock);
          createViewTypeSelector.mockReturnValueOnce(() => "mybets");

          await statsSupportingContentButtonsClickTrackingResolver(
            {
              urn: "urn",
              isSelected: false,
              buttonId: "ppb:tbd:stats:card:broadcasts:1",
            },
            sendEvent,
          );

          expect(sendEvent).toHaveBeenCalledTimes(1);
          expect(sendEvent).toHaveBeenCalledWith({
            action: "hide",
            element_text: "i18n.live_video_status.live_video",
            event: "interface",
            module: "mybets - i18n.live_video_status.live_video",
            event_context: "null",
            game_filter: "null",
            swimlane_type: "null",
          });
        });
      });
    });
  });
});
