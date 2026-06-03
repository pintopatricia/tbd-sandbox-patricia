import { Middleware } from "redux";
import { codecs } from "@ppb/tbd-urn-codecs";
import { SportsbookMarketPricesCallbackPayload } from "./sportsbook-market-prices-observable";
import { Observer } from "./http-poller/http-poller-observable";
import {
  FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS,
  FetchSportsbookMarketUpdatesSuccessAction,
  SUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
  SubscribeSportsbookMarketUpdatesAction,
  UNSUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
  UnsubscribeSportsbookMarketUpdatesAction,
} from "../actions/sportsbook-markets";
import { getSportsbookMarket } from "../state/entities/sportsbook-markets/sportsbook-market-selectors";
import { ApplicationState, SportsbookRunner } from "../state";
import { isRaceHierarchy } from "../helpers/markets";
import { PUSH, PushAction } from "../actions";
import { SwitchProductPreferenceAction, UI__SWITCH_PRODUCT_PREFERENCE } from "../actions/preferences";
import { SportsbookServiceGetPricesResult } from "../services/sportsbook-market-service";

type Actions =
  | SubscribeSportsbookMarketUpdatesAction
  | UnsubscribeSportsbookMarketUpdatesAction
  | PushAction
  | SwitchProductPreferenceAction;

let sportsbookMarketPricesUpdatesObserver: Observer<SportsbookMarketPricesCallbackPayload>;

function isRaceMarket(state: ApplicationState, marketId: string) {
  const marketUrn = codecs.market.encode(marketId).uid;
  const sportsbookMarket = getSportsbookMarket(state, marketUrn);

  if (sportsbookMarket && !sportsbookMarket.inplay && isRaceHierarchy(sportsbookMarket.hierarchy)) {
    return true;
  }

  return false;
}

// Find out runners that are no longer available and set them as removed
function getClosedRunners(updates: SportsbookServiceGetPricesResult | undefined, state: ApplicationState) {
  if (!updates) {
    return [];
  }

  // Not sure if this was ever a requirement, but it's here to avoid setting runners as
  // removed when the market is closed. Some visual baselines have this scenario.
  if (updates.markets.filter((market) => market.status === "CLOSED").length > 0) {
    return [];
  }

  const runnersToSetAsRemoved: SportsbookRunner[] = [];

  updates.markets.forEach((market) => {
    const sportsbookMarket = state.entities.sportsbookmarkets[market.urn];

    if (!sportsbookMarket) {
      return;
    }
    const filteredRunnersByMarket = updates.runners.filter((runner) => runner.urn && runner.market === market.urn);

    sportsbookMarket.runners.forEach((marketRunner) => {
      const isRunnerMissing = !filteredRunnersByMarket.some((runner) => marketRunner.urn === runner.urn);

      if (isRunnerMissing) {
        runnersToSetAsRemoved.push({
          urn: marketRunner.urn,
          market: market.urn,
          selectionId: marketRunner.selectionId,
          status: "REMOVED",
        });
      }
    });
  });

  return runnersToSetAsRemoved;
}

export const sportsbookMarketPricesMiddleware: Middleware =
  ({ dispatch, getState }) =>
  (next) =>
  async (action: Actions) => {
    next(action); // foward the action for further processing

    const state = getState();

    const SportsbookMarketPricesObservable = await import(
      /* webpackChunkName: "sportsbook-market-prices-observable" */ "./sportsbook-market-prices-observable"
    ).then((module) => module.default);
    const sportsbookMarketPricesObservable = SportsbookMarketPricesObservable.getInstance();

    // register subscriber to "sportsbookMarketPricesObservable" which produces messages every time
    // there's and update from the polling mechanism
    if (!sportsbookMarketPricesUpdatesObserver) {
      sportsbookMarketPricesUpdatesObserver = (response) => {
        const closedRunners = getClosedRunners(response.updates, getState());

        const updates = {
          markets: response.updates?.markets || [],
          runners: [...(response.updates?.runners || []), ...closedRunners],
          runnerDetails: response.updates?.runnerDetails,
        };

        dispatch<FetchSportsbookMarketUpdatesSuccessAction>({
          type: FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS,
          payload: updates,
        });
      };

      sportsbookMarketPricesObservable.subscribe(sportsbookMarketPricesUpdatesObserver);
    }

    switch (action.type) {
      case SUBSCRIBE_SPORTSBOOK_MARKET_UPDATES: {
        const { marketId, subscriberId } = action.payload;

        sportsbookMarketPricesObservable.addMarket({
          marketId,
          subscriberId,
          isRacing: isRaceMarket(state, marketId),
        });

        break;
      }
      case UNSUBSCRIBE_SPORTSBOOK_MARKET_UPDATES: {
        const { marketId, subscriberId } = action.payload;

        sportsbookMarketPricesObservable.removeMarket(marketId, subscriberId);

        break;
      }
      case PUSH: {
        const exclusions = ["sportsbook-betting-saga", "sbcs"];

        sportsbookMarketPricesObservable.resetMarkets(exclusions);
        break;
      }
      case UI__SWITCH_PRODUCT_PREFERENCE: {
        sportsbookMarketPricesObservable.resetMarkets();
        break;
      }
      default:
        break;
    }
  };
