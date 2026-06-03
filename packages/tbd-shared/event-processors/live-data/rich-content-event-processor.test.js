import RichContentUpdatesObservable from "@ppb/tbd-store/middlewares/rich-content-updates-observable";
import subscribeEvent from "../../event-broker/event-subscriber";
import { updateFootballFixture } from "./resolvers/football-fixture-live-data";
import register from "./rich-content-event-processor";

jest.mock("@ppb/tbd-store/middlewares/rich-content-updates-observable", () => ({
  getInstance: jest.fn().mockReturnValue({
    subscribe: jest.fn(),
    addEvent: jest.fn(),
    removeEvent: jest.fn(),
  }),
}));

jest.mock("../../event-broker/event-subscriber");

jest.mock("./resolvers/football-fixture-live-data", () => ({
  updateFootballFixture: jest.fn(),
}));

describe("rich-content-event-processor", () => {
  describe("register", () => {
    let richContentUpdatesObservable;

    beforeEach(() => {
      richContentUpdatesObservable = RichContentUpdatesObservable.getInstance();
      jest.clearAllMocks();

      register();

      // Simulate receiving the update
      const response = {
        updates: {
          fixtures: {
            football: { someFixtureData: true },
          },
        },
      };
      richContentUpdatesObservable.subscribe.mock.calls[0][0](response);

      // Simulate the event subscription for mounted
      const payload = { fixtureUrn: "some-urn" };
      subscribeEvent.mock.calls[0][1](payload);

      // Simulate the event subscription for mounted
      subscribeEvent.mock.calls[1][1](payload);

      // Simulate the event subscription for unmounted
      subscribeEvent.mock.calls[2][1](payload);

      // Simulate the event subscription for unmounted
      subscribeEvent.mock.calls[3][1](payload);

      // Simulate mounted StatsLineupsCard
      subscribeEvent.mock.calls[4][1](payload);

      // Simulate unMounted StatsLineupsCard
      subscribeEvent.mock.calls[5][1](payload);

      // Simulate mounted TeamLineupCard
      subscribeEvent.mock.calls[6][1](payload);

      // Simulate unMounted TeamLineupCard
      subscribeEvent.mock.calls[7][1](payload);
    });

    it("should subscribe to richContentUpdatesObservable and call updateFootballFixture when there is a football fixture update", () => {
      expect(updateFootballFixture).toHaveBeenCalledWith({ someFixtureData: true });
    });

    it("should call subscribeEvent 4 times with correct arguments for STATS_MATCH_STATS_CARD_MOUNTED, INCIDENTS_CARD_MOUNTED, STATS_LINEUPS_CARD_MOUNTED and TEAM_LINEUP_CARD_MOUNTED", () => {
      expect(richContentUpdatesObservable.addEvent).toHaveBeenCalledTimes(4);
      expect(richContentUpdatesObservable.addEvent).toHaveBeenNthCalledWith(1, {
        urn: "some-urn",
        typename: "FootballFixture",
      });
    });

    it("should call removeEvent 4 times on richContentUpdatesObservable when STATS_MATCH_STATS_CARD_UNMOUNTED, INCIDENTS_CARD_UNMOUNTED, STATS_LINEUPS_CARD_UNMOUNTED and TEAM_LINEUP_CARD_UNMOUNTED is triggered", () => {
      expect(richContentUpdatesObservable.removeEvent).toHaveBeenCalledTimes(4);
      expect(richContentUpdatesObservable.removeEvent).toHaveBeenNthCalledWith(1, "some-urn");
    });
  });
});
