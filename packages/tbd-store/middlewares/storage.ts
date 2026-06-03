import { Middleware } from "redux";
import { ApplicationState } from "../state/ApplicationState.types";
import {
  PNPartialSubscribeEventsSuccessAction,
  PNRegisterDeviceAction,
  PNSubscribeEventsSuccessAction,
  PNUnsubscribeEventsAction,
  PNUnsupportedSubscribeEventsSuccessAction,
  PN_PARTIAL_SUBSCRIBE_EVENTS_SUCCESS,
  PN_REGISTER_DEVICE,
  PN_SUBSCRIBE_EVENTS_SUCCESS,
  PN_UNSUBSCRIBE_EVENTS,
  PN_UNSUPPORTED_SUBSCRIBE_EVENTS_SUCCESS,
} from "../actions/push-notifications";
import { SetThrottlesAction, SET_THROTTLES, RESET_THROTTLES, ResetThrottlesAction } from "../actions/settings-page";
import {
  updateNotificationsData,
  updateThrottlesData,
  updateRatingData,
  updateSportsbookBettingData,
  updateTaggingMetadata,
  StorageState,
  updateObbBettingData,
  updateObbTaggingMetadata,
  updateFavouriteMarketsTooltipClosedCounter,
  BetslipStorage,
} from "../helpers/storage";
import { StorageModule } from "../modules/StorageModule.types";
import {
  RatingResetAction,
  RatingUpdateBetsAction,
  RatingUpdateSessionAction,
  RATING__RESET,
  RATING__UPDATE_BETS,
  RATING__UPDATE_SESSION,
} from "../actions/rating";
import {
  BETTING__OBB_STATE_UPDATE,
  BETTING__SBK_STATE_UPDATE,
  BETTING__SBK_LOAD_STORAGE_SUCCESS,
  BETTING_UPDATE_OBB_TAGGING_METADATA,
  BettingObbStateUpdateAction,
  BettingObbUpdateTaggingMetadata,
  BettingSportsbookStateUpdateAction,
  BettingSportsbookLoadStorageActionSuccess,
  MarketExchangeBetButtonClickAction,
  MarketSportsbookBetButtonClickAction,
  UI__MARKET_EXC_BET_BUTTON_CLICK,
  UI__MARKET_SBK_BET_BUTTON_CLICK,
} from "../actions/betting";
import { getBetslipCard } from "../state/betslip/betslip-card-selectors";
import {
  UI__BETSLIP_BET_BUILDER_ADD_SELECTIONS,
  BetslipBetBuilderAddSelectionsAction,
  UI__BETSLIP_SET_COLLAPSE_ACTION,
  BetslipCollapseToggleAction,
  UI__BETSLIP_MAX_PAYOUT_NOTIFICATION_ACCEPTED,
  BetslipMaxPayoutNotificationAcceptedAction,
  UI__BETSLIP_SET_LAST_SUCCESSFUL_STAKE,
  BetslipSetLastSuccessfulStakeAction,
} from "../actions/betslip";
import { NavigateToEventViewFirstTime, UI__NAVIGATE_TO_EVENT_FIRST_TIME } from "../actions/navigation";
import { FavouriteMarketsTooltipCloseAction, UI__FAVOURITE_MARKETS_TOOLTIP_CLOSE } from "../actions/favourite-markets";
import { BettingSbkModuleLoadedAction, MODULES__SBK_BETTING_LOADED } from "../actions/modules";
import {
  FetchAppContextAuthFailureAction,
  FetchAppContextSuccessAction,
  InvalidSessionAction,
  NETWORK__FETCH_APP_CONTEXT_AUTH_FAILURE,
  NETWORK__FETCH_APP_CONTEXT_SUCCESS,
  NETWORK__INVALID_SESSION,
} from "../actions/app-context";

type ActionTypes =
  | SetThrottlesAction
  | PNRegisterDeviceAction
  | PNSubscribeEventsSuccessAction
  | PNPartialSubscribeEventsSuccessAction
  | PNUnsupportedSubscribeEventsSuccessAction
  | PNUnsubscribeEventsAction
  | RatingUpdateBetsAction
  | RatingUpdateSessionAction
  | RatingResetAction
  | BettingSportsbookStateUpdateAction
  | MarketExchangeBetButtonClickAction
  | MarketSportsbookBetButtonClickAction
  | BetslipBetBuilderAddSelectionsAction
  | NavigateToEventViewFirstTime
  | BetslipCollapseToggleAction
  | BetslipMaxPayoutNotificationAcceptedAction
  | ResetThrottlesAction
  | BettingObbStateUpdateAction
  | BettingObbUpdateTaggingMetadata
  | FavouriteMarketsTooltipCloseAction
  | BetslipSetLastSuccessfulStakeAction
  | BettingSportsbookLoadStorageActionSuccess
  | FetchAppContextAuthFailureAction
  | FetchAppContextSuccessAction
  | InvalidSessionAction
  | BettingSbkModuleLoadedAction;

export const storageMiddleware = <M extends StorageModule<S>, S extends StorageState>(
  storage: S extends StorageState ? StorageModule<S> : M,
): Middleware<{}, ApplicationState> => {
  // In-memory storage to avoid race conditions between:
  // - Multiple overlapping actions that can update the betslip storage
  // - Usage of getItem from storage to write theses updates
  // Depending on the timing, getItem can return outdated data, which can cause loss of some updates.
  // By using in-memory storage we ensure that all updates are based on the latest data.
  let betslipStorage: Partial<BetslipStorage> = {};
  let betslipStorageLoaded = false;

  return ({ getState }) =>
    (next) =>
    (action: ActionTypes) => {
      const result = next(action);

      const state = getState();
      const { notifications, rating } = state;
      let shouldPersistBetslip = false;

      switch (action.type) {
        case RATING__UPDATE_BETS: {
          const { payload } = action;
          updateRatingData(storage, { ...rating, ...payload });

          break;
        }

        case RATING__UPDATE_SESSION: {
          const { payload } = action;
          updateRatingData(storage, { ...rating, ...payload });

          break;
        }

        case RATING__RESET: {
          const { payload } = action;
          updateRatingData(storage, payload);

          break;
        }

        case PN_REGISTER_DEVICE:
        case PN_SUBSCRIBE_EVENTS_SUCCESS:
        case PN_PARTIAL_SUBSCRIBE_EVENTS_SUCCESS:
        case PN_UNSUPPORTED_SUBSCRIBE_EVENTS_SUCCESS:
        case PN_UNSUBSCRIBE_EVENTS: {
          updateNotificationsData(storage, notifications);

          break;
        }

        case RESET_THROTTLES: {
          updateThrottlesData(storage, {});
          break;
        }

        case SET_THROTTLES: {
          const { throttles } = state.entities;
          const overridenThrottles = Object.keys(throttles).reduce((acc, curr) => {
            if (throttles[curr]?.isOverriden) {
              return { ...acc, [curr]: throttles[curr] };
            }
            return acc;
          }, {});

          updateThrottlesData(storage, overridenThrottles);
          break;
        }

        case BETTING__SBK_LOAD_STORAGE_SUCCESS: {
          betslipStorage = {
            ...action.payload.betslip,
            ...betslipStorage,
          };

          betslipStorageLoaded = true;
          shouldPersistBetslip = true;

          break;
        }

        case BETTING__SBK_STATE_UPDATE: {
          betslipStorage.group = action.payload.group;
          shouldPersistBetslip = true;

          updateSportsbookBettingData(storage, action.payload.state);
          break;
        }

        case BETTING__OBB_STATE_UPDATE: {
          updateObbBettingData(storage, action.payload.state);
          break;
        }

        case UI__BETSLIP_MAX_PAYOUT_NOTIFICATION_ACCEPTED: {
          betslipStorage.showMaxPayoutNotification = false;
          shouldPersistBetslip = true;

          break;
        }

        case UI__MARKET_EXC_BET_BUTTON_CLICK:
        case UI__MARKET_SBK_BET_BUTTON_CLICK:
        case UI__BETSLIP_BET_BUILDER_ADD_SELECTIONS: {
          const betslipState = getBetslipCard(state);

          if (betslipState) {
            updateTaggingMetadata(storage, betslipState.taggingMetadata);
          }
          break;
        }

        case UI__NAVIGATE_TO_EVENT_FIRST_TIME: {
          updateNotificationsData(storage, {
            ...notifications,
            wasNotificationHowToSubscribeEventsShown: true,
          });
          break;
        }

        case UI__BETSLIP_SET_COLLAPSE_ACTION: {
          betslipStorage.isCollapsed = action.payload.collapse;
          shouldPersistBetslip = true;
          break;
        }

        case BETTING_UPDATE_OBB_TAGGING_METADATA: {
          const { metadata } = action.payload;
          updateObbTaggingMetadata(storage, metadata);
          break;
        }

        case UI__FAVOURITE_MARKETS_TOOLTIP_CLOSE: {
          updateFavouriteMarketsTooltipClosedCounter(storage);
          break;
        }

        case UI__BETSLIP_SET_LAST_SUCCESSFUL_STAKE: {
          betslipStorage.lastSuccessfulStake = action.payload.stake;
          shouldPersistBetslip = true;
          break;
        }

        case NETWORK__FETCH_APP_CONTEXT_SUCCESS: {
          const {
            initialState: {
              entities: { userdetails },
            },
          } = action.payload;

          if (!userdetails?.loggedIn) {
            delete betslipStorage.lastSuccessfulStake;
            shouldPersistBetslip = true;
          }

          break;
        }
        case NETWORK__FETCH_APP_CONTEXT_AUTH_FAILURE:
        case NETWORK__INVALID_SESSION: {
          delete betslipStorage.lastSuccessfulStake;
          shouldPersistBetslip = true;
          break;
        }

        case MODULES__SBK_BETTING_LOADED: {
          // If no storage load happened (e.g.: empty state)
          // Write current in-memory betslip changes
          if (!betslipStorageLoaded) {
            betslipStorageLoaded = true;
            shouldPersistBetslip = Object.keys(betslipStorage).length > 0;
          }
          break;
        }

        default:
          break;
      }

      if (shouldPersistBetslip && betslipStorageLoaded) {
        storage.setItem("betslip", betslipStorage);
      }

      return result;
    };
};
