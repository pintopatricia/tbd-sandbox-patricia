import produce from "immer";
import { RugbyLeagueFixtures } from "./RugbyLeagueFixture";
import mixin from "../../mixin";

import { FETCH_CATALOGUE_SUCCESS, FetchCatalogueSuccessAction } from "../../../actions/catalogue";
import { FetchFixtureUpdatesSuccessAction, NETWORK__FETCH_FIXTURE_UPDATES_SUCCESS } from "../../../actions/fixture";

type ActionTypes = FetchCatalogueSuccessAction | FetchFixtureUpdatesSuccessAction;

export default (currentState: undefined | RugbyLeagueFixtures, action: ActionTypes): RugbyLeagueFixtures => {
  const state = currentState || {};

  switch (action.type) {
    case FETCH_CATALOGUE_SUCCESS: {
      const fixtures = action.payload.data.RugbyLeagueFixture || [];

      return fixtures.reduce<RugbyLeagueFixtures>(
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
      const fixtures = action.payload?.rugbyleague;

      if (!fixtures) {
        return state;
      }

      const nextState = produce(state, (draft) => {
        Object.entries(fixtures).forEach(([urn, update]) => {
          if (!draft[urn]) {
            draft[urn] = {
              urn,
              typename: "RugbyLeagueFixture",
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
