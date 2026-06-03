import { Middleware } from "redux";
import { codecs } from "@ppb/tbd-urn-codecs";
import { BetEligibilityCallbackPayload } from "./bet-mutation-eligibility-observable";
import { Observer } from "./http-poller/http-poller-observable";
import { PUSH, PushAction } from "../actions";
import { ApplicationState, createGetThrottleSelector } from "../state";
import { createSportsbookBetSelector } from "../state/betting/sportsbook-bets/sportsbook-bets-selectors";
import {
  SUBSCRIBE_BET_MUTATION_ELIGIBILITY,
  UNSUBSCRIBE_BET_MUTATION_ELIGIBILITY,
  SubscribeBetMutationEligibilityAction,
  UnsubscribeBetMutationEligibilityAction,
  UI__MY_BETS_ORDER_TYPE_FILTER_CLICK,
  MyBetsOrderTypeFilterClick,
  FetchBetsMutationEligibilitySuccessAction,
  NETWORK__FETCH_BETS_MUTATION_ELIGIBILITY_SUCCESS,
  FetchBetsMutationEligibilityFailureAction,
  NETWORK__FETCH_BETS_MUTATION_ELIGIBILITY_FAILURE,
} from "../actions/my-bets";

type Actions =
  | SubscribeBetMutationEligibilityAction
  | UnsubscribeBetMutationEligibilityAction
  | MyBetsOrderTypeFilterClick
  | PushAction;

let betMutationsEligibilityObserver: Observer<BetEligibilityCallbackPayload>;
const getSportsbookBetByURN = createSportsbookBetSelector();
const getThrottle = createGetThrottleSelector();

export const betMutationEligibilityMiddleware: Middleware =
  ({ dispatch, getState }) =>
  (next) =>
  async (action: Actions) => {
    next(action); // foward the action for further processing

    const state: ApplicationState = getState();
    const isAccaFreezeActive = getThrottle(state.entities.throttles, "ACCA_FREEZE")?.isActive;

    if (isAccaFreezeActive && state.entities.brandSettings?.ACCA_FREEZE) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const BetMutationEligibilityObservable = await import(
        /* webpackChunkName: "bet-mutation-eligibility-observable" */ "./bet-mutation-eligibility-observable"
      ).then((module) => module.default);
      const betMutationEligibilityObservable = BetMutationEligibilityObservable.getInstance();

      // register subscriber to "betMutationsEligibilityObserver" which produces messages every time
      // there's and update from the polling mechanism
      if (!betMutationsEligibilityObserver) {
        betMutationsEligibilityObserver = (response) => {
          if (response.updates) {
            dispatch<FetchBetsMutationEligibilitySuccessAction>({
              type: NETWORK__FETCH_BETS_MUTATION_ELIGIBILITY_SUCCESS,
              payload: response.updates,
            });
          } else if (response.error) {
            dispatch<FetchBetsMutationEligibilityFailureAction>({
              type: NETWORK__FETCH_BETS_MUTATION_ELIGIBILITY_FAILURE,
              error: response.error,
            });
          }
        };

        betMutationEligibilityObservable.subscribe(betMutationsEligibilityObserver);
      }

      switch (action.type) {
        case SUBSCRIBE_BET_MUTATION_ELIGIBILITY: {
          const bet = getSportsbookBetByURN(state.betting.sportsbookbets, action.payload.urn);
          if (bet) {
            betMutationEligibilityObservable.addBet({ betId: bet.betId });
          }
          break;
        }
        case UNSUBSCRIBE_BET_MUTATION_ELIGIBILITY: {
          const betId = codecs.sportsbookBet.decode(action.payload.urn);
          if (betId) {
            betMutationEligibilityObservable.removeBet(betId);
          }
          break;
        }
        case UI__MY_BETS_ORDER_TYPE_FILTER_CLICK:
        case PUSH:
          betMutationEligibilityObservable.resetBets();
          break;

        default:
          break;
      }
    }
  };
