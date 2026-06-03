import produce from "immer";
import { RugbyUnionFixtures } from "./RugbyUnionFixture";
import mixin from "../../mixin";

import { FETCH_CATALOGUE_SUCCESS, FetchCatalogueSuccessAction } from "../../../actions/catalogue";
import { FetchFixtureUpdatesSuccessAction, NETWORK__FETCH_FIXTURE_UPDATES_SUCCESS } from "../../../actions/fixture";

type ActionTypes = FetchCatalogueSuccessAction | FetchFixtureUpdatesSuccessAction;

export default (currentState: undefined | RugbyUnionFixtures, action: ActionTypes): RugbyUnionFixtures => {
  const state = currentState || {};

  switch (action.type) {
    case FETCH_CATALOGUE_SUCCESS: {
      const fixtures = action.payload.data.RugbyUnionFixture || [];

      return fixtures.reduce<RugbyUnionFixtures>(
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
      const fixtures = action.payload?.rugbyunion;

      if (!fixtures) {
        return state;
      }

      const nextState = produce(state, (draft) => {
        Object.entries(fixtures).forEach(([urn, update]) => {
          if (!draft[urn]) {
            draft[urn] = {
              urn,
              typename: "RugbyUnionFixture",
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
