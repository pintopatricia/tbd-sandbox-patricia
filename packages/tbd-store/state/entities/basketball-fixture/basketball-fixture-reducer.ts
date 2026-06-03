import produce from "immer";
import { BasketballFixtures } from "./BasketballFixture";
import mixin from "../../mixin";

import { FETCH_CATALOGUE_SUCCESS, FetchCatalogueSuccessAction } from "../../../actions/catalogue";
import { FetchFixtureUpdatesSuccessAction, NETWORK__FETCH_FIXTURE_UPDATES_SUCCESS } from "../../../actions/fixture";

type ActionTypes = FetchCatalogueSuccessAction | FetchFixtureUpdatesSuccessAction;

export default (currentState: undefined | BasketballFixtures, action: ActionTypes): BasketballFixtures => {
  const state = currentState || {};

  switch (action.type) {
    case FETCH_CATALOGUE_SUCCESS: {
      const fixtures = action.payload.data.BasketballFixture || [];

      return fixtures.reduce<BasketballFixtures>(
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
    case NETWORK__FETCH_FIXTURE_UPDATES_SUCCESS: {
      const fixtures = action.payload?.basketball;

      if (!fixtures) {
        return state;
      }

      const nextState = produce(state, (draft) => {
        Object.entries(fixtures).forEach(([urn, update]) => {
          if (!draft[urn]) {
            // eslint-disable-next-line no-param-reassign
            draft[urn] = {
              urn,
              typename: "BasketballFixture",
              isAmericanFormat: state[urn]?.isAmericanFormat,
              runnerNames: state[urn]?.runnerNames,
              ...update,
            };

            return;
          }

          mixin(draft[urn], update);
        });
      });

      return nextState;
    }
    default:
      return state;
  }
};
