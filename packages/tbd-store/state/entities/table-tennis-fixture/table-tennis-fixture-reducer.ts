import { TableTennisFixtures } from "./TableTennisFixture.types";
import { FETCH_CATALOGUE_SUCCESS, FetchCatalogueSuccessAction } from "../../../actions/catalogue";
import { FetchFixtureUpdatesSuccessAction, NETWORK__FETCH_FIXTURE_UPDATES_SUCCESS } from "../../../actions/fixture";

type ActionTypes = FetchCatalogueSuccessAction | FetchFixtureUpdatesSuccessAction;

export default (currentState: undefined | TableTennisFixtures, action: ActionTypes): TableTennisFixtures => {
  const state = currentState || {};

  switch (action.type) {
    case FETCH_CATALOGUE_SUCCESS: {
      const fixtures = action.payload.data.TableTennisFixture || [];

      return fixtures.reduce<TableTennisFixtures>(
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
      if (!action.payload?.tabletennis) return state;

      return Object.entries(action.payload.tabletennis).reduce<TableTennisFixtures>(
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
