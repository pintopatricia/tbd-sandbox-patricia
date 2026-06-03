import { GQL } from "@flutter-global/uki-channels-http-clients";
import { ScaUpdatesQuery } from "./sports-content-api-response-types";
import scaUpdatesQuery from "./sca_updates_query.graphql";

type GQLError = {
  message: string;
  description: string;
};

type GQLClientOptions = { overrideUserAgent?: string; applicationKey: string };

type GetScaUpdatesArgs = {
  baseballEventIds: string[];
  basketballEventIds: string[];
  cricketEventIds: string[];
  dartsEventIds: string[];
  footballEventIds: string[];
  raceIds: string[];
  tennisEventIds: string[];
  tableTennisEventIds: string[];
  iceHockeyEventIds: string[];
  americanFootballEventIds: string[];
  rugbyUnionEventIds: string[];
  rugbyLeagueEventIds: string[];
  snookerEventIds: string[];
  volleyballEventIds: string[];
  australianRulesEventIds: string[];
  isLite: boolean;
  includeStats: boolean;
  includePlayers: boolean;
  footballPlayerIds: string[];
  includePlayerStats: boolean;
  includeSubstitutions: boolean;
};

function SportsContentAPIClient(
  endpoint: string,
  config: GQLClientOptions,
): {
  getScaUpdates: (args: GetScaUpdatesArgs) => Promise<ScaUpdatesQuery>;
} {
  const GQLClient = GQL(endpoint, config);

  async function getScaUpdates({
    baseballEventIds,
    basketballEventIds,
    cricketEventIds,
    dartsEventIds,
    footballEventIds,
    rugbyUnionEventIds,
    rugbyLeagueEventIds,
    volleyballEventIds,
    raceIds,
    tableTennisEventIds,
    tennisEventIds,
    iceHockeyEventIds,
    americanFootballEventIds,
    snookerEventIds,
    australianRulesEventIds,
    isLite,
    includeStats,
    includePlayers,
    footballPlayerIds,
    includePlayerStats,
    includeSubstitutions,
  }: GetScaUpdatesArgs): Promise<ScaUpdatesQuery> {
    const response = await GQLClient.execute({
      query: scaUpdatesQuery,
      variables: {
        baseballEventIds,
        basketballEventIds,
        cricketEventIds,
        dartsEventIds,
        footballEventIds,
        tableTennisEventIds,
        tennisEventIds,
        iceHockeyEventIds,
        americanFootballEventIds,
        rugbyUnionEventIds,
        rugbyLeagueEventIds,
        snookerEventIds,
        volleyballEventIds,
        australianRulesEventIds,
        raceIds,
        isLite,
        includeStats,
        includePlayers,
        footballPlayerIds,
        includePlayerStats,
        includeSubstitutions,
      },
    });

    if (response.errors && response.errors.length > 0) {
      console.warn(
        `The following errors occurred while fetching updates from SCA: ${response.errors
          .map((error: GQLError) => `{Message: ${error.message}; Description: ${error.description}}`)
          .join(", ")}`,
      );
    }
    return response.data;
  }

  return { getScaUpdates };
}

export default SportsContentAPIClient;
