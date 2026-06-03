import { Middleware } from "redux";

import { WinLoseVoidStateUpdateCallbackPayload } from "./win-lose-void-state-observable";
import { Observer } from "./http-poller/http-poller-observable";
import { PUSH, PushAction } from "../actions";
import { getActiveThrottles } from "../state/entities/throttles/throttles-selectors";
import { ApplicationState, BetLeg } from "../state";
import { Result as BetLegResult } from "../state/constants";
import { createSportsbookBetSelector } from "../state/betting/sportsbook-bets/sportsbook-bets-selectors";
import {
  SUBSCRIBE_BET_RESULT,
  UNSUBSCRIBE_BET_RESULT,
  SubscribeBetResultAction,
  UnsubscribeBetResultAction,
  UI__MY_BETS_ORDER_TYPE_FILTER_CLICK,
  MyBetsOrderTypeFilterClick,
  NETWORK__FETCH_BETS_RESULT_SUCCESS,
  FetchBetsResultSuccessAction,
  FetchBetsResultFailureAction,
  NETWORK__FETCH_BETS_RESULT_FAILURE,
} from "../actions/my-bets";
import { createSportsbookBetLegsSelector } from "../state/entities/sportsbook-bet-legs/sportsbook-bet-legs-selectors";
import { InputBet, ResultType, Result } from "../clients/blh/bet-live-hypotheticals-response-types";

type Actions = SubscribeBetResultAction | UnsubscribeBetResultAction | MyBetsOrderTypeFilterClick | PushAction;

let winLoseVoidUpdatesObserver: Observer<WinLoseVoidStateUpdateCallbackPayload>;
const getSportsbookBetByURN = createSportsbookBetSelector();
const getSportsbookBetLegsByURN = createSportsbookBetLegsSelector();

const LEGS_MAPPER = new Map<string, { [key: number]: string }>();
const RESULTS_TO_MAP_LIST = [BetLegResult.WON, BetLegResult.LOST, BetLegResult.VOID];
const MAP_BET_LEG_RESULT_TO_RESULT = {
  [BetLegResult.WON]: Result.WIN,
  [BetLegResult.LOST]: Result.LOSE,
  [BetLegResult.VOID]: Result.VOID,
};

export const winLoseVoidUpdatesMiddleware: Middleware =
  ({ dispatch, getState }) =>
  (next) =>
  async (action: Actions) => {
    next(action); // foward the action for further processing

    const state: ApplicationState = getState();
    const throttles: string[] = getActiveThrottles(state.entities.throttles);

    if (throttles.includes("MY_BETS_WIN_LOSE_VOID")) {
      const WinLoseVoidUpdatesObservable = await import(
        /* webpackChunkName: "win-lose-void-state-observer" */ "./win-lose-void-state-observable"
      ).then((module) => module.default);
      const winLoseVoidUpdatesObservable = WinLoseVoidUpdatesObservable.getInstance();

      // register subscriber to "winLoseVoidUpdatesObservable" which produces messages every time
      // there's and update from the polling mechanism
      if (!winLoseVoidUpdatesObserver) {
        winLoseVoidUpdatesObserver = (response) => {
          if (response.updates) {
            dispatch<FetchBetsResultSuccessAction>({
              type: NETWORK__FETCH_BETS_RESULT_SUCCESS,
              payload: { bets: response.updates, legsMapper: LEGS_MAPPER },
            });
          } else if (response.error) {
            dispatch<FetchBetsResultFailureAction>({
              type: NETWORK__FETCH_BETS_RESULT_FAILURE,
              error: response.error,
            });
          }
        };

        winLoseVoidUpdatesObservable.subscribe(winLoseVoidUpdatesObserver);
      }

      switch (action.type) {
        case SUBSCRIBE_BET_RESULT:
          {
            const bet = getSportsbookBetByURN(state.betting.sportsbookbets, action.payload.urn);

            if (!bet || bet.resultType === ResultType.CONFIRMED) {
              return;
            }

            const { legs, urn: betURN } = bet;

            const betLegs: BetLeg[] = getSportsbookBetLegsByURN(state.entities.sportsbookbetlegs, legs);
            const { betType }: { betType: any } = bet; // @todo - review typing

            const params: InputBet = {
              betType,
              legs: betLegs.map(({ urn: legUrn, parts, legNumber, resultType: legResultType, result }) => {
                if (legNumber) {
                  const currentLegsMap = LEGS_MAPPER.get(betURN);
                  LEGS_MAPPER.set(betURN, { ...currentLegsMap, [legNumber]: legUrn });
                }

                return {
                  legNumber: String(legNumber),
                  runners: parts.map(({ marketId = "", selectionId }) => ({
                    id: String(selectionId),
                    marketId,
                    result:
                      legResultType === ResultType.CONFIRMED && result && RESULTS_TO_MAP_LIST.includes(result)
                        ? MAP_BET_LEG_RESULT_TO_RESULT[result as keyof typeof MAP_BET_LEG_RESULT_TO_RESULT]
                        : null,
                  })),
                };
              }),
            };

            winLoseVoidUpdatesObservable.addBet({ betURN, ...params });
          }
          break;
        case UNSUBSCRIBE_BET_RESULT:
          winLoseVoidUpdatesObservable.removeBet(action.payload.urn);
          break;

        case UI__MY_BETS_ORDER_TYPE_FILTER_CLICK:
        case PUSH:
          winLoseVoidUpdatesObservable.resetBets();
          LEGS_MAPPER.clear();
          break;

        default:
          break;
      }
    }
  };
