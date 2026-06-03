import RichContentUpdatesObservable, {
  RichContentUpdateCallbackPayload,
} from "@ppb/tbd-store/middlewares/rich-content-updates-observable";
import subscribeEvent from "../../event-broker/event-subscriber";
import { updateFootballFixture } from "./resolvers/football-fixture-live-data";
import { updateRaceStatus } from "./resolvers/race-status-live-data";

const register = () => {
  const richContentUpdatesObservable = RichContentUpdatesObservable.getInstance();

  richContentUpdatesObservable.subscribe((response: RichContentUpdateCallbackPayload) => {
    if (response.updates?.fixtures.football) {
      updateFootballFixture(response.updates?.fixtures.football);
    }
    if (response.updates?.racesStatusAndResultType) {
      updateRaceStatus(response.updates.racesStatusAndResultType);
    }
  });

  subscribeEvent("@@UI/STATS_MATCH_STATS_CARD_MOUNTED", (payload) => {
    richContentUpdatesObservable.addEvent({
      urn: payload.fixtureUrn,
      typename: "FootballFixture",
    });
  });

  subscribeEvent("@@UI/INCIDENTS_CARD_MOUNTED", (payload) => {
    richContentUpdatesObservable.addEvent({
      urn: payload.fixtureUrn,
      typename: "FootballFixture",
    });
  });

  subscribeEvent("@@UI/STATS_MATCH_STATS_CARD_UNMOUNTED", (payload) => {
    richContentUpdatesObservable.removeEvent(payload.fixtureUrn);
  });

  subscribeEvent("@@UI/INCIDENTS_CARD_UNMOUNTED", (payload) => {
    richContentUpdatesObservable.removeEvent(payload.fixtureUrn);
  });

  subscribeEvent("@@UI/STATS_LINEUPS_CARD_MOUNTED", (payload) => {
    richContentUpdatesObservable.addEvent({
      urn: payload.fixtureUrn,
      typename: "FootballFixture",
    });
  });

  subscribeEvent("@@UI/STATS_LINEUPS_CARD_UNMOUNTED", (payload) => {
    richContentUpdatesObservable.removeEvent(payload.fixtureUrn);
  });

  subscribeEvent("@@UI/TEAM_LINEUP_MOUNTED", (payload) => {
    richContentUpdatesObservable.addEvent({
      urn: payload.fixtureUrn,
      typename: "FootballFixture",
    });
  });

  subscribeEvent("@@UI/TEAM_LINEUP_UNMOUNTED", (payload) => {
    richContentUpdatesObservable.removeEvent(payload.fixtureUrn);
  });

  subscribeEvent("@@UI/RACE_DETAILS_CARD_SUBSCRIBE", (payload) => {
    richContentUpdatesObservable.addEvent({
      urn: payload.raceURN,
      typename: "Race",
    });
  });

  subscribeEvent("@@UI/RACE_DETAILS_CARD_UNSUBSCRIBE", (payload) => {
    richContentUpdatesObservable.removeEvent(payload.raceURN);
  });
};

export default register;
