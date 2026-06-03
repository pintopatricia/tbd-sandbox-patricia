import URN from "../../layout/URN";
import { BUSINESS, DEVICE } from "../../../middlewares/tagging-resolvers/AnalyticsDimensions";
import { GenericEvent } from "../../../middlewares/tagging-resolvers/Event.types";
import { PromotionStatus } from "../../../clients/catalogue/catalogue-response-types";

export const IMS_PROMOTION_MODULE_NAME = "promo hub - promo details";

export type InteractiveResponseError = {
  responseCode: number;
  responseMessage: string;
};

export type ImsPromoImageDimension = {
  width: number;
  height: number;
};

type ImsPromoImage = {
  url: string;
  alt: string | null;
  dimensions: ImsPromoImageDimension;
};

export enum PromotionLayout {
  Accept = "ACCEPT",
  BuyIn = "BUY_IN",
  OptIn = "OPT_IN",
}

export enum PromotionWagerType {
  PreWager = "PRE_WAGER",
  AfterWager = "AFTER_WAGER",
  FreeSpins = "FREE_SPINS",
  GoldenChips = "GOLDEN_CHIPS",
  Unknown = "UNKNOWN",
}

export type ImsPromotion = {
  typename: "ImsPromotion";
  urn: URN;
  headline: string;
  subHeadline: string | null;
  bonusInstanceCode: string | null;
  image: ImsPromoImage | null;
  ctaText: string;
  layout: PromotionLayout;
  status: PromotionStatus;
  timeLeft: number | null;
  wagerType: PromotionWagerType | null;
  percentCompleted: number | null;
  bonusWagering: number | null;
  wageringLeft: number | null;
  bonusAwarded: number | null;
  freeSpins: FreeSpinsDetails | null;
  goldenChips: GoldenChipsDetails | null;
  buyIn: BuyInDetails | null;
  currentBonusBalance: number;
  amountOnPendingWinnings: number;
  interactiveResponseError?: InteractiveResponseError;
};

export type GoldenChipsDetails = {
  initialGoldenChips: number | null;
  remainingGoldenChips: number | null;
  goldenChipsAmount: number | null;
};

export type FreeSpinsDetails = {
  initialFreeSpins: number | null;
  remainingFreeSpins: number | null;
};

export type BuyInDetailsIntervals = {
  min: number;
  max: number;
  amount?: number | null;
  percentage?: number | null;
} | null;

export type BuyInDetails = {
  buyInMinValue: number | null;
  buyInMaxValue: number | null;
  boughtIn: number | null;
  intervals: BuyInDetailsIntervals[] | null;
};

/**
 * Data model holding a key-value structure where the key is a unique identifier (event URN in this case) stored on the value too
 *
 * @example
 *  {
 *    "myUniqueId": { id: "myUniqueId", name: "", ... }
 *  }
 */
export type ImsPromotions = {
  [urn: string]: ImsPromotion;
};

/**
 * the response code for the error caused by open session is 67
 */
export enum InteractiveResponseErrorCode {
  OpenSession = 67,
}
export type ImsPromotionViewEventsClick = GenericEvent & {
  [BUSINESS.DESTINATION_URL]: string | null;
  [DEVICE.POSITION]: number | null;
  [BUSINESS.PROMOTION_ID]: string | null;
  [BUSINESS.PROMOTION_NAME]: string | null;
  [BUSINESS.PROMOTION_STATUS]: string | null;
  [BUSINESS.PROMOTION_USER_STATUS]: PromotionStatus;
};
