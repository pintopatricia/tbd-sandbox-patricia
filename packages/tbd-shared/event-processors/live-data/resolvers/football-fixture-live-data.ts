import {
  FootballFixtureUpdateResult,
  FootballFixtureUpdatesResult,
} from "@ppb/tbd-store/services/sports-content-api-service-mapper";
import { getApolloClient } from "../../../apollo-client/client";

type TransformUndefinedToNull<T> = {
  [K in keyof T]: T[K] extends undefined ? null : TransformUndefinedToNull<T[K]>;
};

export function transformUndefinedToNull<T>(obj: T): TransformUndefinedToNull<T> {
  const transform = <U>(value: U): TransformUndefinedToNull<U> => {
    if (Array.isArray(value)) {
      return value.map((item) =>
        item === undefined ? null : transform(item),
      ) as unknown as TransformUndefinedToNull<U>;
    }

    if (value !== null && typeof value === "object") {
      return Object.keys(value).reduce((acc, key) => {
        const val = (value as Record<string, unknown>)[key];
        (acc as Record<string, unknown>)[key] = val === undefined ? null : transform(val);
        return acc;
      }, {} as TransformUndefinedToNull<U>);
    }

    return value as unknown as TransformUndefinedToNull<U>;
  };

  return transform(obj);
}

export const updateFootballFixture = (payload: FootballFixtureUpdatesResult) => {
  if (payload) {
    const { cache } = getApolloClient();

    Object.keys(payload).forEach((urn) => {
      const id = cache.identify({
        __typename: "FootballFixture",
        urn,
      });

      const fixtureUpdate = payload[urn];

      cache.modify<FootballFixtureUpdateResult>({
        id,
        fields: {
          duration(cachedValue) {
            if (fixtureUpdate.duration?.clock) {
              return {
                ...cachedValue,
                ...fixtureUpdate.duration,
              };
            }

            return cachedValue;
          },
          home(cachedValue) {
            if (fixtureUpdate.home) {
              return { ...cachedValue, formation: fixtureUpdate.home.formation };
            }
            return cachedValue;
          },
          away(cachedValue) {
            if (fixtureUpdate.away) {
              return { ...cachedValue, formation: fixtureUpdate.away.formation };
            }
            return cachedValue;
          },
          score(cachedValue) {
            if (fixtureUpdate.score) {
              return {
                ...cachedValue,
                ...fixtureUpdate.score,
              };
            }

            return cachedValue;
          },
          stats(cachedValue) {
            if (fixtureUpdate.stats) {
              const result = cachedValue ? [...cachedValue] : [];

              fixtureUpdate.stats.forEach((stat, index) => {
                result[index] = {
                  ...transformUndefinedToNull(stat),
                };
              });

              return result;
            }
            return cachedValue;
          },
          incidents(cachedValue) {
            if (fixtureUpdate.incidents) {
              const result = cachedValue ? [...cachedValue] : [];

              fixtureUpdate.incidents.forEach((incident, index) => {
                result[index] = {
                  ...transformUndefinedToNull(incident),
                  type: incident.details.__typename,
                };
              });

              return result;
            }
            return cachedValue;
          },
        },
      });
    });
  }
};
