import { SportsbookEventReadonly } from "@flutter-global/uki-channels-http-clients";
import { EventDetails } from "@flutter-global/uki-channels-http-clients/src/clients/SportsbookEventReadonly/SportsbookEventReadonly";
import { createClientFactory } from "./client-factory";

const DEFAULT_LANGUAGE = "en_GB";

export const getEventsDetailsForMarkets = (
  marketIds: string[],
  language = DEFAULT_LANGUAGE,
): Promise<EventDetails[]> => {
  if (marketIds.length === 0) {
    return Promise.resolve([]);
  }

  const sportsbookEventReadOnlyService = createClientFactory(SportsbookEventReadonly)("SER");

  return sportsbookEventReadOnlyService.getEventsDetailsForMarkets(marketIds, { language });
};
