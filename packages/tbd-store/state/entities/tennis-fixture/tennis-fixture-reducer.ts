import { TennisFixtures } from "./TennisFixture";
import { FetchCatalogueSuccessAction, FETCH_CATALOGUE_SUCCESS } from "../../../actions/catalogue";
import { FetchFixtureUpdatesSuccessAction, NETWORK__FETCH_FIXTURE_UPDATES_SUCCESS } from "../../../actions/fixture";

type ActionTypes = FetchCatalogueSuccessAction | FetchFixtureUpdatesSuccessAction;

export default (currentState: undefined | TennisFixtures, action: ActionTypes): TennisFixtures => {
  const state = currentState || {};

  switch (action.type) {
    case FETCH_CATALOGUE_SUCCESS: {
      const fixtures = action.payload.data.TennisMatch || [];

      return fixtures.reduce<TennisFixtures>(
        (acc, fixture) => {
          const { urn, actualStartTime, scheduledStartTime } = fixture;
          return {
            ...acc,
            [urn]: {
              ...state[urn],
              ...fixture,
              scheduledStartTime: scheduledStartTime ? new Date(scheduledStartTime) : undefined,
              actualStartTime: actualStartTime ? new Date(actualStartTime) : undefined,
              status: {
                ...state[urn]?.status,
                ...fixture.status,
              },
            },
          };
        },
        { ...state },
      );
    }
    case NETWORK__FETCH_FIXTURE_UPDATES_SUCCESS:
      if (!action.payload?.tennis) return state;

      return Object.entries(action.payload.tennis).reduce<TennisFixtures>(
        (acc, [urn, fixture]) => ({
          ...acc,
          [urn]: {
            ...state[urn],
            ...fixture,
          },
        }),
        { ...state },
      );
    default:
      return state;
  }
};
