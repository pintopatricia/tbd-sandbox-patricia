import { GQL } from "@flutter-global/uki-channels-http-clients";
import { BetsResultQuery, InputBet } from "./bet-live-hypotheticals-response-types";
import betsResultQuery from "./blh_updates_query.graphql";

type GQLError = {
  message: string;
  description: string;
};

type GQLClientOptions = { overrideUserAgent?: string };

export type GetBetsResultArgs = {
  bets: Array<InputBet>;
};

function BetLiveHipotheticalsClient(
  endpoint: string,
  config: GQLClientOptions,
): {
  getBetsResult: (args: GetBetsResultArgs) => Promise<BetsResultQuery>;
} {
  const GQLClient = GQL(endpoint, config);

  async function getBetsResult({ bets }: GetBetsResultArgs): Promise<BetsResultQuery> {
    const response = await GQLClient.execute({
      query: betsResultQuery,
      variables: {
        bets,
      },
    });

    if (response.errors && response.errors.length > 0) {
      // eslint-disable-next-line no-console
      console.warn(
        `The following errors occurred while fetching bet results from BLH: ${response.errors
          .map((error: GQLError) => `{Message: ${error.message}; Description: ${error.description}}`)
          .join(", ")}`,
      );
    }

    return response.data;
  }

  return { getBetsResult };
}

export default BetLiveHipotheticalsClient;
