import { SportsbookBettingState } from "../state/betting/sportsbook-betting/SportsbookBetting.types";
import { BetslipState, ObbTaggingMetadata, TaggingMetadataState } from "../state/betslip/Betslip.types";
import { BootState } from "../state/boot/BootState.types";
import { NotificationsState, ThrottlesState, FavouriteMarkets } from "../state";
import { StorageModule } from "../modules/StorageModule.types";
import { RatingState } from "../state/rating/Rating.types";
import { ObbBettingState } from "../state/betting/obb-betting/ObbBetting.types";

export type BetslipStorage = Pick<
  BetslipState,
  "group" | "isCollapsed" | "showMaxPayoutNotification" | "lastSuccessfulStake"
>;

export type StorageState = {
  rating: RatingState;
  notifications: NotificationsState;
  sportsbookBettingState: SportsbookBettingState;
  taggingMetadata: TaggingMetadataState;
  obbTaggingMetadata: ObbTaggingMetadata;
  enableExc: boolean;
  wasExchangeOnboardingShown: boolean;
  betslip: Partial<BetslipStorage>;
  throttles_override: ThrottlesState;
  obbBettingState: ObbBettingState;
  favouriteMarkets?: FavouriteMarkets;
};

export type StorageData = {
  notifications?: NotificationsState;
  rating?: RatingState;
  boot?: BootState;
  favouriteMarkets: FavouriteMarkets;
};

/**
 * Updates the *rating* on local storage
 * Currently we always set the *rateMyAppTriggered* to false to mitigate the scenario of
 * having the rate my app being triggered on app startup.
 */
export const updateRatingData = async (storage: StorageModule<StorageState>, state: RatingState): Promise<void> => {
  const rating = {
    ...state,
    rateMyAppTriggered: false,
  };

  await storage.setItem("rating", rating);
};

export const updateNotificationsData = async (
  storage: StorageModule<StorageState>,
  state: NotificationsState,
): Promise<void> => storage.setItem("notifications", state);

export const updateThrottlesData = async (
  storage: StorageModule<StorageState>,
  state: ThrottlesState,
): Promise<void> => {
  storage.setItem("throttles_override", state);
};

export const updateSportsbookBettingData = async (
  storage: StorageModule<StorageState>,
  state: SportsbookBettingState,
): Promise<void> => storage.setItem("sportsbookBettingState", state);

export const updateObbBettingData = async (
  storage: StorageModule<StorageState>,
  state: ObbBettingState,
): Promise<void> => storage.setItem("obbBettingState", state);

export const getSportsbookBettingData = async (storage: StorageModule<StorageState>): Promise<unknown> =>
  storage.getItem("sportsbookBettingState");

export const getObbBettingData = async (storage: StorageModule<StorageState>): Promise<unknown> =>
  storage.getItem("obbBettingState");

export const removeSportsbookBettingData = async (storage: StorageModule<StorageState>): Promise<void> =>
  storage.removeItem("sportsbookBettingState");

export const removeObbBettingData = async (storage: StorageModule<StorageState>): Promise<void> =>
  storage.removeItem("obbBettingState");

export const updateTaggingMetadata = async (
  storage: StorageModule<StorageState>,
  taggingMetadata: TaggingMetadataState,
): Promise<void> => storage.setItem("taggingMetadata", taggingMetadata);

export const resetTaggingMetadata = async (storage: StorageModule<StorageState>): Promise<void> =>
  storage.setItem("taggingMetadata", {});

export const getTaggingMetadata = async (storage: StorageModule<StorageState>): Promise<unknown> =>
  storage.getItem("taggingMetadata");

export const updateObbTaggingMetadata = async (
  storage: StorageModule<StorageState>,
  obbTaggingMetadata: ObbTaggingMetadata,
): Promise<void> => storage.setItem("obbTaggingMetadata", obbTaggingMetadata);

export const resetObbTaggingMetadata = async (storage: StorageModule<StorageState>): Promise<void> =>
  storage.setItem("obbTaggingMetadata", {});

export const getObbTaggingMetadata = async (storage: StorageModule<StorageState>): Promise<unknown> =>
  storage.getItem("obbTaggingMetadata");

export const enableExc = async (storage: StorageModule<StorageState>): Promise<void> =>
  storage.setItem("enableExc", true);

export const disableExc = async (storage: StorageModule<StorageState>): Promise<void> =>
  storage.setItem("enableExc", false);

export const getBetslip = async (storage: StorageModule<StorageState>): Promise<Partial<BetslipStorage>> =>
  storage.getItem("betslip");

export const updateFavouriteMarketsTooltipClosedCounter = async (
  storage: StorageModule<StorageState>,
): Promise<void> => {
  const favouriteMarkets = (await storage.getItem("favouriteMarkets")) || { tooltipClosedCounter: 0 };

  return storage.setItem("favouriteMarkets", {
    ...favouriteMarkets,
    tooltipClosedCounter: favouriteMarkets.tooltipClosedCounter + 1,
  });
};

export const loadStorageData = async <M extends StorageModule<S>, S extends StorageState>(
  storage: S extends StorageState ? StorageModule<S> : M,
): Promise<StorageData> => {
  const {
    notifications,
    enableExc: exchangeEnabled,
    rating,
    favouriteMarkets,
  } = await storage.multiGet(["notifications", "enableExc", "rating", "favouriteMarkets"]);

  const commonStorageData = {
    notifications: {
      ...notifications,
      wasNotificationNativePromptShown: !!notifications?.wasNotificationNativePromptShown,
      wasNotificationHowToSubscribeEventsShown: !!notifications?.wasNotificationHowToSubscribeEventsShown,
      subscribedEventIds: notifications?.subscribedEventIds || [],
      unsupportedEventIds: notifications?.unsupportedEventIds || [],
    },
    boot: {
      exchangeEnabled: !!exchangeEnabled,
    },
    favouriteMarkets: {
      tooltipClosedCounter: favouriteMarkets?.tooltipClosedCounter || 0,
    },
  };

  return {
    ...commonStorageData,
    ...(rating && { rating }),
  };
};
