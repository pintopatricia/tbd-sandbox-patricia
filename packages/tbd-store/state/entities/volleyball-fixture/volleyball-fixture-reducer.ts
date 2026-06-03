import { VolleyballFixtures } from "./VolleyballFixture";
import { FETCH_CATALOGUE_SUCCESS, FetchCatalogueSuccessAction } from "../../../actions/catalogue";
import { FetchFixtureUpdatesSuccessAction, NETWORK__FETCH_FIXTURE_UPDATES_SUCCESS } from "../../../actions/fixture";

type ActionTypes = FetchCatalogueSuccessAction | FetchFixtureUpdatesSuccessAction;

export default (currentState: undefined | VolleyballFixtures, action: ActionTypes): VolleyballFixtures => {
  const state = currentState || {};

  switch (action.type) {
    case FETCH_CATALOGUE_SUCCESS: {
      const fixtures = action.payload.data.VolleyballFixture || [];

      return fixtures.reduce<VolleyballFixtures>(
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
      if (!action.payload?.volleyball) return state;

      return Object.entries(action.payload.volleyball).reduce<VolleyballFixtures>(
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
