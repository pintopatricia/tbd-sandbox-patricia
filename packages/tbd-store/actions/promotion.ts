import { PromotionStatus } from "../clients/catalogue/catalogue-response-types";
import { InteractiveResponseError } from "../state/entities";
import { ViewLink } from "../state/layout/cards/ViewLink.types";
import URN from "../state/layout/URN";

export const CANCEL_PROMOTION = "CANCEL_PROMOTION";
export const ACCEPT_PROMOTION = "ACCEPT_PROMOTION";
export const DEPOSIT_NAVIGATION = "DEPOSIT_NAVIGATION";
export const REFRESH_PROMOTION = "REFRESH_PROMOTION";
export const INTERACT_CANCEL_PROMOTION_MODAL = "INTERACT_CANCEL_PROMOTION_MODAL";
export const ADD_INTERACTIVE_RESPONSE_ERROR = "ADD_INTERACTIVE_RESPONSE_ERROR";
export const REMOVE_INTERACTIVE_RESPONSE_ERROR = "REMOVE_INTERACTIVE_RESPONSE_ERROR";
export const CLEAR_ERROR_MESSAGE = "CLEAR_ERROR_MESSAGE";

export type CancelPromotion = {
  type: typeof CANCEL_PROMOTION;
  payload: {
    urn: URN;
  };
};

export type InteractCancelPromotionModal = {
  type: typeof INTERACT_CANCEL_PROMOTION_MODAL;
  payload: {
    urn: URN;
    name: string;
    promoStatus: string;
    userStatus: PromotionStatus;
    label: string;
    type?: string;
    progressValue?: number;
  };
};

export type AcceptPromotion = {
  type: typeof ACCEPT_PROMOTION;
  payload: {
    urn: URN;
    name: string;
    promoStatus: string;
    userStatus: PromotionStatus;
    amount?: number;
    type?: string;
    progressValue?: number;
  };
};

export type DepositNavigation = {
  type: typeof DEPOSIT_NAVIGATION;
  payload: {
    viewLink: ViewLink;
  };
};

export type RefreshPromotion = {
  type: typeof REFRESH_PROMOTION;
  payload: {
    urn: URN;
    name: string;
    promoStatus: string;
    userStatus: PromotionStatus;
    label: string;
    promotion: string;
    type?: string;
    progressValue?: number;
  };
};

export type AddInteractiveResponseError = {
  type: typeof ADD_INTERACTIVE_RESPONSE_ERROR;
  payload: {
    data: InteractiveResponseError;
    urn: URN;
  };
};

export type RemoveInteractiveResponseError = {
  type: typeof REMOVE_INTERACTIVE_RESPONSE_ERROR;
  payload: {
    urn: URN;
  };
};

export type ClearErrorMessage = {
  type: typeof CLEAR_ERROR_MESSAGE;
  payload: {
    data: Record<string, never>;
    urn: URN;
  };
};
