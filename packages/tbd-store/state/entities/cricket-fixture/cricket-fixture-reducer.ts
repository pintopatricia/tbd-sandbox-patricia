import { CricketFixtures } from "./CricketFixture.types";
import { FETCH_CATALOGUE_SUCCESS, FetchCatalogueSuccessAction } from "../../../actions/catalogue";
import { FetchFixtureUpdatesSuccessAction, NETWORK__FETCH_FIXTURE_UPDATES_SUCCESS } from "../../../actions/fixture";

type ActionTypes = FetchCatalogueSuccessAction | FetchFixtureUpdatesSuccessAction;

export default (currentState: undefined | CricketFixtures, action: ActionTypes): CricketFixtures => {
  const state = currentState || {};

  switch (action.type) {
    case FETCH_CATALOGUE_SUCCESS: {
      const fixtures = action.payload.data.CricketFixture || [];

      return fixtures.reduce<CricketFixtures>(
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
      if (!action.payload?.cricket) return state;

      return Object.entries(action.payload.cricket).reduce<CricketFixtures>(
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
