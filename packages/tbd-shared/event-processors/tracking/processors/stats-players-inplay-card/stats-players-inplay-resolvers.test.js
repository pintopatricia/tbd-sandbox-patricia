import { createViewTypeSelector } from "@ppb/tbd-store/state/layout/layout-selectors";
import { getLayoutMetadata } from "@ppb/tbd-store/state/layout-snapshot";
import { getStatsPlayersInPlay } from "./StatsPlayersInplay.graphql";
import {
  statsPlayersInplayPressTermsTrackingResolver,
  statsPlayersInplayExpandableButtonTrackingResolver,
} from "./stats-players-inplay-resolvers";

jest.mock("./StatsPlayersInplay.graphql", () => ({
  getStatsPlayersInPlay: jest.fn(),
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

const sendEvent = jest.fn();
const cardMock = {
  urn: "urn",
  sportEvent: {
    urn: "urn",
    name: "event name",
    competition: {
      urn: "urn",
      name: "competition name",
    },
  },
};

describe("StatsPlayersInplay Tracking resolvers", () => {
  describe("statsPlayersInplayPressTermsTrackingResolver", () => {
    beforeEach(jest.clearAllMocks);

    describe("when we're not able to fetch the card", () => {
      it("should not call 'sendEvent' function", async () => {
        getStatsPlayersInPlay.mockResolvedValueOnce(null);

        await statsPlayersInplayPressTermsTrackingResolver(
          {
            urn: "urn",
            destinationUrl: "http://linktohelp.page.com",
          },
          sendEvent,
        );

        expect(sendEvent).not.toHaveBeenCalled();
      });
    });

    describe("when the payload has no urn", () => {
      it("should not call 'sendEvent'", async () => {
        await statsPlayersInplayPressTermsTrackingResolver(
          {
            destinationUrl: "http://linktohelp.page.com",
          },
          sendEvent,
        );

        expect(sendEvent).not.toHaveBeenCalled();
      });
    });

    describe("when we're able to fetch the card", () => {
      describe("When event is press terms", () => {
        it("should call 'sendEvent function", async () => {
          getLayoutMetadata.mockReturnValueOnce({
            verticalPosition: 2,
            horizontalPosition: 3,
          });
          getStatsPlayersInPlay.mockResolvedValueOnce(cardMock);
          createViewTypeSelector.mockReturnValueOnce(() => "HOME");

          await statsPlayersInplayPressTermsTrackingResolver(
            {
              urn: "urn",
              destinationUrl: "http://linktohelp.page.com",
              title: "goals and shots",
            },
            sendEvent,
          );

          expect(sendEvent).toHaveBeenCalledTimes(1);
          expect(sendEvent).toHaveBeenCalledWith({
            action: "navigated to",
            element_text: "help & support page",
            event: "navigation",
            module: "home - goals and shots - null - competition name - event name - in-play",
            event_context: "null",
            game_filter: "null",
            swimlane_type: "null",
            game_id: "null",
            game_name: "null",
            game_provider: "null",
            destination_url: "http://linktohelp.page.com",
            module_display_order: "2",
            position: "3",
          });
        });
      });

      describe("When event is expandable click button", () => {
        describe("when the card action is closed", () => {
          it("should call the 'sendEvent' function with action closed", async () => {
            getStatsPlayersInPlay.mockResolvedValueOnce(cardMock);
            createViewTypeSelector.mockReturnValue(() => "EVENT");

            await statsPlayersInplayExpandableButtonTrackingResolver(
              {
                urn: "urn",
                isOpen: false,
                itemUrn: "itemUrn",
              },
              sendEvent,
            );

            expect(sendEvent).toHaveBeenCalledTimes(1);
            expect(sendEvent).toHaveBeenCalledWith({
              action: "closed",
              element_text: "stats - show less",
              event: "interface",
              module: "event - null - null - competition name - event name - in-play",
              event_context: "null",
              game_filter: "null",
              swimlane_type: "null",
            });
          });
        });

        describe("when the card action is opened", () => {
          it("should call the 'sendEvent' function with action opened", async () => {
            getStatsPlayersInPlay.mockResolvedValueOnce(cardMock);
            createViewTypeSelector.mockReturnValue(() => "EVENT");

            await statsPlayersInplayExpandableButtonTrackingResolver(
              {
                urn: "urn",
                isOpen: true,
                itemUrn: "itemUrn",
              },
              sendEvent,
            );

            expect(sendEvent).toHaveBeenCalledTimes(1);
            expect(sendEvent).toHaveBeenCalledWith({
              action: "opened",
              element_text: "stats - show more",
              event: "interface",
              module: "event - null - null - competition name - event name - in-play",
              event_context: "null",
              game_filter: "null",
              swimlane_type: "null",
            });
          });
        });
      });
    });
  });
});
