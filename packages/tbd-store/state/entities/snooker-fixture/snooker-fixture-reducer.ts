import { SnookerFixtures } from "./SnookerFixture.types";
import { FETCH_CATALOGUE_SUCCESS, FetchCatalogueSuccessAction } from "../../../actions/catalogue";
import { FetchFixtureUpdatesSuccessAction, NETWORK__FETCH_FIXTURE_UPDATES_SUCCESS } from "../../../actions/fixture";

type ActionTypes = FetchCatalogueSuccessAction | FetchFixtureUpdatesSuccessAction;

export default (currentState: undefined | SnookerFixtures, action: ActionTypes): SnookerFixtures => {
  const state = currentState || {};

  switch (action.type) {
    case FETCH_CATALOGUE_SUCCESS: {
      const fixtures = action.payload.data.SnookerFixture || [];

      return fixtures.reduce<SnookerFixtures>(
        (acc, fixture) => {
          const { urn } = fixture;
          return {
            ...acc,
            [urn]: {
              ...state[urn],
              ...fixture,
            },
          };
        },
        { ...state },
      );
    }
    case NETWORK__FETCH_FIXTURE_UPDATES_SUCCESS:
      if (!action.payload?.snooker) return state;

      return Object.entries(action.payload.snooker).reduce<SnookerFixtures>(
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
