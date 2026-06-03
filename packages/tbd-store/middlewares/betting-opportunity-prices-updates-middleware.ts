import { Middleware } from "redux";
import { codecs } from "@ppb/tbd-urn-codecs";
import { Observer } from "./http-poller/http-poller-observable";
import {
  FETCH_BETTING_OPPORTUNITY_PRICE_UPDATES_SUCCESS,
  FetchBettingOpportunityPriceUpdatesSuccessAction,
  SUBSCRIBE_BETTING_OPPORTUNITY_PRICE_UPDATES,
  SubscribeBettingOpportunityPriceUpdates,
  UNSUBSCRIBE_BETTING_OPPORTUNITY_PRICE_UPDATES,
  UnsubscribeBettingOpportunityPriceUpdates,
} from "../actions/sportsbook-markets";
import { PUSH, PushAction } from "../actions";
import { SwitchProductPreferenceAction, UI__SWITCH_PRODUCT_PREFERENCE } from "../actions/preferences";
import { BettingOpportunityPricesCallbackPayload } from "./betting-opportunity-prices-observable";
import { createEntityByURNSelector } from "../state/entities/entities-selectors";
import { PopularBettingOpportunities } from "../state";

type Actions =
  | SubscribeBettingOpportunityPriceUpdates
  | UnsubscribeBettingOpportunityPriceUpdates
  | PushAction
  | SwitchProductPreferenceAction;

const getBettingOpportunityByURN = createEntityByURNSelector<PopularBettingOpportunities, string>();

let bettingOpportunityPricesUpdatesObserver: Observer<BettingOpportunityPricesCallbackPayload>;

export const bettingOpportunityPricesMiddleware: Middleware =
  ({ dispatch, getState }) =>
  (next) =>
  async (action: Actions) => {
    next(action); // foward the action for further processing

    const state = getState();

    const BettingOpportunityPricesObservable = await import(
      /* webpackChunkName: "betting-opportunity-prices-observable" */ "./betting-opportunity-prices-observable"
    ).then((module) => module.default);

    const bettingOpportunityPricesObservable = BettingOpportunityPricesObservable.getInstance();

    // register subscriber to "bettingOpportunityPricesObservable" which produces
    // messages every time there's and update from the polling mechanism
    if (!bettingOpportunityPricesUpdatesObserver) {
      bettingOpportunityPricesUpdatesObserver = (response) => {
        if (response.updates === undefined) {
          return;
        }

        const { results, combinationGroups } = response.updates;

        results.forEach((update) => {
          dispatch<FetchBettingOpportunityPriceUpdatesSuccessAction>({
            type: FETCH_BETTING_OPPORTUNITY_PRICE_UPDATES_SUCCESS,
            payload: {
              result: update,
              combinationGroups,
            },
          });
        });
      };

      bettingOpportunityPricesObservable.subscribe(bettingOpportunityPricesUpdatesObserver);
    }

    switch (action.type) {
      case SUBSCRIBE_BETTING_OPPORTUNITY_PRICE_UPDATES: {
        const { bettingOppportunityUrn } = action.payload;

        const bettingOpportunity = getBettingOpportunityByURN(
          state.entities.popularbettingopportunities,
          bettingOppportunityUrn,
        );

        if (!bettingOpportunity) {
          return;
        }

        const mappedSelections = bettingOpportunity.selections.reduce(
          (acc, selection) => {
            const parsedUrn = codecs.parse(selection.runnerUrn);
            const runnerUrn = parsedUrn && codecs.sportsbookRunner.extract(parsedUrn);

            if (runnerUrn) {
              acc.push({
                marketId: runnerUrn.marketId,
                selectionId: runnerUrn.selectionId,
              });
            }

            return acc;
          },
          [] as { marketId: string; selectionId: number }[],
        );

        bettingOpportunityPricesObservable.addBettingOpportunity({
          bettingOpportunityUrn: bettingOpportunity.urn,
          bettingOpportunityType: bettingOpportunity.type,
          bettingOpportunityId: bettingOpportunity.id,
          selections: mappedSelections,
          subscriberId: "betting-opportunity-prices-updates-middleware",
        });

        break;
      }
      case UNSUBSCRIBE_BETTING_OPPORTUNITY_PRICE_UPDATES: {
        const { bettingOppportunityUrn } = action.payload;

        bettingOpportunityPricesObservable.removeBettingOpportunity(
          bettingOppportunityUrn,
          "betting-opportunity-prices-updates-middleware",
        );
        break;
      }
      case PUSH: {
        bettingOpportunityPricesObservable.resetBettingOpportunities();
        break;
      }
      case UI__SWITCH_PRODUCT_PREFERENCE: {
        bettingOpportunityPricesObservable.resetBettingOpportunities();
        break;
      }
      default:
        break;
    }
  };
