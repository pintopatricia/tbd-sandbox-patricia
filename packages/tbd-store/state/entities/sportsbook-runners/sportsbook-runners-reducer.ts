/* eslint-disable no-param-reassign */
import produce from "immer";
import { SportsbookRunner, SportsbookRunners } from "./SportsbookRunner.types";
import {
  FetchSportsbookMarketUpdatesSuccessAction,
  FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS,
  SubscribeSportsbookMarketUpdatesAction,
  UnsubscribeSportsbookMarketUpdatesAction,
} from "../../../actions/sportsbook-markets";
import URN from "../../layout/URN";
import mixinDeep from "../../mixin";
import { FETCH_CATALOGUE_SUCCESS, FetchCatalogueSuccessAction } from "../../../actions/catalogue";

type ActionTypes =
  | SubscribeSportsbookMarketUpdatesAction
  | FetchSportsbookMarketUpdatesSuccessAction
  | UnsubscribeSportsbookMarketUpdatesAction
  | FetchCatalogueSuccessAction;

/** *****************************
 *  Sportsbook market reducer  *
 ****************************** */
export default (currentState: undefined | SportsbookRunners, action: ActionTypes): SportsbookRunners => {
  const state = currentState || {};

  switch (action.type) {
    /**
     * Update runners with new odds, when still maintaining all that was
     * already existing props (e.g. selectionId)
     */
    case FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS: {
      return produce(state, (draft) => {
        // Update runners with the received data
        action.payload.runners.forEach((runner) => {
          if (runner.urn === undefined) {
            throw new Error("Runner URN is required");
          }

          if (!draft[runner.urn]) {
            draft[runner.urn] = {} as SportsbookRunner;
          }

          draft[runner.urn].urn = runner.urn;
          draft[runner.urn].market = runner.market;
          draft[runner.urn].selectionId = runner.selectionId;
          draft[runner.urn].handicap = runner.handicap;
          draft[runner.urn].status = runner.status;

          // Update odds
          mixinDeep(draft[runner.urn], {
            odds: runner.odds,
            trueOdds: runner.trueOdds,
            eachWayOdds: runner.eachWayOdds,
            previousOdds: runner.previousOdds,
          });
        });
      });
    }

    case FETCH_CATALOGUE_SUCCESS: {
      const updates = (action.payload.data.SportsbookRunnerLiveData || []).reduce(
        (acc, runnerUpdate) => ({
          ...acc,
          [runnerUpdate.urn]: {
            ...acc[runnerUpdate.urn],
            ...runnerUpdate,
            status: runnerUpdate.status,
          },
        }),
        state,
      );

      return updates || state;
    }

    default:
      return state;
  }
};

/**
 * TODO: MEMOIZATION
 * DEPRECATED! Please use createSportsbookRunnerByURNSelector instead.
 * This selector is being deprecated because does not provide memoization and does not follow the current guidelines.
 *
 * Selector that for a given runner URN, returns the corresponding runner or undefined if there's none
 */
export const getSportsbookRunnerByURN = (state: SportsbookRunners, urn: URN): SportsbookRunner | undefined =>
  state[urn];
