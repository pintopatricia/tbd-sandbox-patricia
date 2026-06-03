import { RaceStatusAndResultTypeUpdatesResult } from "@ppb/tbd-store/services/sports-content-api-service-mapper";
import { getApolloClient } from "../../../apollo-client/client";

const mergeRaceDetailsUpdate = <T extends Record<string, unknown> | null | undefined>(
  cachedValue: T,
  status: string | null | undefined,
  resultType: string | null | undefined,
) => {
  if (!cachedValue) return cachedValue;

  return {
    ...cachedValue,
    ...(status !== undefined ? { status } : {}),
    ...(resultType !== undefined ? { resultType } : {}),
  };
};

export const updateRaceStatus = (payload: RaceStatusAndResultTypeUpdatesResult | undefined) => {
  if (!payload) return;

  const { cache } = getApolloClient();

  Object.keys(payload).forEach((urn) => {
    const raceUpdate = payload[urn];
    if (!raceUpdate) return;

    const id = cache.identify({ __typename: "Race", urn });
    if (!id) return;

    cache.modify({
      id,
      fields: {
        details(cachedValue) {
          return mergeRaceDetailsUpdate(cachedValue, raceUpdate.status, raceUpdate.resultType);
        },
        raceKind(cachedValue) {
          if (!cachedValue || cachedValue.__typename !== "HorseRaceKind" || !cachedValue.details) {
            return cachedValue;
          }

          return {
            ...cachedValue,
            details: mergeRaceDetailsUpdate(cachedValue.details, raceUpdate.status, raceUpdate.resultType),
          };
        },
      },
    });
  });
};
