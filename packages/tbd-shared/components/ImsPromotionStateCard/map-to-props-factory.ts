import { MapStateToPropsFactory } from "react-redux";
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { EntityType } from "@ppb/tbd-urn-codecs";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { AlertType } from "@ppb/the-wall-common/types/";
import URN from "@ppb/tbd-store/state/layout/URN";
import { ImsPromotionStateCards } from "@ppb/tbd-store/state/layout/cards/Card.types";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import {
  ACCEPT_PROMOTION,
  CancelPromotion,
  CANCEL_PROMOTION,
  REMOVE_INTERACTIVE_RESPONSE_ERROR,
  RemoveInteractiveResponseError,
  AcceptPromotion,
  DepositNavigation,
  DEPOSIT_NAVIGATION,
  RefreshPromotion,
  REFRESH_PROMOTION,
  InteractCancelPromotionModal,
  INTERACT_CANCEL_PROMOTION_MODAL,
} from "@ppb/tbd-store/actions/promotion";
import {
  PromotionLayout,
  ImsPromotion,
  InteractiveResponseErrorCode,
  IMS_PROMOTION_MODULE_NAME,
} from "@ppb/tbd-store/state/entities";
import { getPromotionByURN } from "@ppb/tbd-store/state/entities/ims-promotions/ims-promotion-selectors";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { createGetUserMainWalletValueSelector } from "@ppb/tbd-store/state/entities/user-wallets/user-wallets-selectors";
import { SawCardAction, SAW_CARD } from "@ppb/tbd-store/actions/interface";
import { EXTERNAL_PUSH, ExternalPushAction } from "@ppb/tbd-store/actions/router";
import { AuthData } from "@ppb/tbd-store/state/initial-state/Environment.types";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { PromotionStatus } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import { DisclaimerI18N } from "./snowflakes/ClaimNowPromo/snowflakes/Disclaimer/Disclaimer.web";
import { OngoingPromoCardTypes } from "./snowflakes/OngoingPromoCard/OngoingPromoCard.types";
import { currencyFormatWithDecimalPlaces } from "../../formatters/currency-formatters";
import { secondsToDh } from "../../formatters/time-formatters";
import { i18n } from "../../helpers/i18n";
import { base64EncodeUrl } from "../../helpers/navigation";
import { getAuthData } from "../../config/endpoints";

type PromotionStateCardi18n = {
  deposit: string;
  availableFunds: string;
  cancel: string;
  refresh: string;
  footerText: string;
  badgeLabel: string;
  remainingHeader: string;
  remainingSubHeader: string;
  requirements: string;
  promotionTitle: string;
  promotionContent: string;
  confirmCancel: string;
  declineCancel: string;
  pendingWinnings: string;
};

type ResponseMessageType =
  | {
      type: AlertType;
      title: string;
      body: string;
    }
  | undefined;

type CurrencyDetails = {
  currencyCode: string;
  localeCode: string;
};

export type ContainerProps = {
  urn: URN;
};

export type ClaimNowExtraProps = {
  min: number;
  max: number;
  buyInMinValue: number;
  buyInMaxValue: number;
  bonusPercent: number;
  bonusAmount: number;
  disclaimerText: DisclaimerI18N;
  currencyDetails: CurrencyDetails;
  depositViewLink: ViewLink | undefined;
};

export type OngoingPromoExtraProps = {
  type: OngoingPromoCardTypes;
  progressValue: number;
  footerValue: string;
  pendingWinnings?: string | null;
};

export type CardProps = {
  promoCard: string;
  promotion: string;
  status: PromotionStatus;
  layout: PromotionLayout;
  availableFunds: number;
  title: string;
  subHeadline: string;
  ctaText: string;
  image: string;
  secondsLeft: number;
  notificationMessage?: ResponseMessageType;
  i18n: PromotionStateCardi18n;
  isLoggedIn: boolean;
  authData: AuthData | undefined;
} & ClaimNowExtraProps &
  OngoingPromoExtraProps;

export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getImsPromotionStateCardByURN = createCardByURNSelector<ImsPromotionStateCards, URN>();
  const getUserMainWalletValue = createGetUserMainWalletValueSelector();
  const authData = getAuthData();
  const formatPromotion = (
    promoDetails: ImsPromotion,
    state: ApplicationState,
    promoCard: string,
    depositLinkUrl: string | undefined,
  ): StateProps => {
    try {
       
      const {
        layout,
        headline: title,
        subHeadline,
        image,
        ctaText,
        timeLeft,
        status,
        percentCompleted,
        urn,
        bonusAwarded,
        wageringLeft,
        interactiveResponseError,
        currentBonusBalance,
        amountOnPendingWinnings,
      } = promoDetails;

      let depositViewLink;
      if (depositLinkUrl) {
        const encodedUrl = base64EncodeUrl(depositLinkUrl);
        depositViewLink = {
          viewUrn: `${EntityType.MyAccountView}:${encodedUrl}`,
          viewUrl: `/navigation/a-${encodedUrl}`,
        };
      }

      const bonusWagering = promoDetails?.bonusWagering ?? 0;
      let type = layout === PromotionLayout.OptIn ? OngoingPromoCardTypes.OPTIN : OngoingPromoCardTypes.CASH;

      let ctaTextBasedOnType;
      switch (layout) {
        case PromotionLayout.Accept: {
          ctaTextBasedOnType = i18n({ key: "I18N.PROMO.ACCEPT" });
          break;
        }
        case PromotionLayout.OptIn: {
          ctaTextBasedOnType = i18n({ key: "I18N.PROMO.OPTIN" });
          break;
        }
        case PromotionLayout.BuyIn: {
          ctaTextBasedOnType = i18n({ key: "I18N.PROMO.CLAIM_NOW" });
          break;
        }
        default:
          ctaTextBasedOnType = ctaText;
      }

      const bonusAmount =
        promoDetails?.buyIn?.intervals?.length && promoDetails?.buyIn?.intervals[0]?.amount
          ? promoDetails?.buyIn?.intervals[0]?.amount
          : 0;
      const bonusPercent =
        promoDetails?.buyIn?.intervals?.length && promoDetails?.buyIn?.intervals[0]?.percentage
          ? promoDetails?.buyIn?.intervals[0]?.percentage
          : 100;

      const buyInMaxValue = promoDetails?.buyIn?.buyInMaxValue ?? 0;
      const buyInMinValue = promoDetails?.buyIn?.buyInMinValue ?? 0;

      const wageringNumberOfTimes = bonusWagering / (bonusAwarded || 1);

      const min = bonusAmount || Math.ceil(buyInMinValue * (bonusPercent / 100));
      const max = bonusAmount || Math.floor(buyInMaxValue * (bonusPercent / 100));
      let pendingWinnings = currentBonusBalance + amountOnPendingWinnings;

      type = promoDetails.freeSpins ? OngoingPromoCardTypes.FREE_SPINS : type;
      type = promoDetails.goldenChips ? OngoingPromoCardTypes.GOLDEN_CHIPS : type;

      const { currencyCode, localeCodeBcp47 } = <UserDetails>getUserDetails(state);
      const mainWalletValue = getUserMainWalletValue(state);

      const footerValue = secondsToDh(timeLeft || 0);

      const currencyDetails: CurrencyDetails = { currencyCode, localeCode: localeCodeBcp47 };

      let pendingWinningsCurrency = currencyFormatWithDecimalPlaces({
        currencyCode,
        localeCodeBcp47,
        value: pendingWinnings,
      });

      const userDetails = getUserDetails(state);

      const promotionStateI18n = {
        deposit: i18n({ key: "I18N.PROMOTION.DEPOSIT" }),
        availableFunds: i18n({ key: "I18N.PROMO.AVAILABLE_FUNDS" }),
        pendingWinnings: i18n({ key: "I18N.PROMO.PENDING_WINNINGS" }),
        cancel: i18n({
          key: "I18N.PROMO.CANCEL",
        }),
        refresh: i18n({
          key: "I18N.PROMO.REFRESH",
        }),
        footerText: i18n({
          key: "I18N.PROMO.FOOTER_TEXT",
        }),
        badgeLabel: i18n({
          key: "I18N.PROMO.BADGE_LABEL",
        }),
        promotionTitle: i18n({
          key: "I18N.PROMO.PROMO_TITLE",
        }),
        promotionContent: i18n({
          key: "I18N.PROMO.PROMO_CONTENT",
          interpolationValues: {
            amount: currencyFormatWithDecimalPlaces({
              currencyCode,
              localeCodeBcp47,
              value: wageringLeft || 0,
            }),
            value: pendingWinningsCurrency,
          },
        }),
        confirmCancel: i18n({
          key: "I18N.PROMO.CONFIRM_CANCEL",
        }),
        declineCancel: i18n({
          key: "I18N.PROMO.DECLINE_CANCEL",
        }),
        remainingHeader: "",
        remainingSubHeader: "",
        requirements: "",
      };

      let errorTitle;
      let errorBody;

      switch (interactiveResponseError?.responseCode) {
        case InteractiveResponseErrorCode.OpenSession:
          errorTitle = "";
          errorBody = i18n({ key: "I18N.PROMOTION.ERROR.OPEN_SESSION" });
          break;
        default:
          errorTitle = i18n({ key: "I18N.PROMOTION.ERROR.TITLE" });
          errorBody = i18n({ key: "I18N.PROMOTION.ERROR.BODY" });
          break;
      }

      if ((interactiveResponseError?.responseMessage || "").indexOf("self-excluded") > 0) {
        errorTitle = i18n({ key: "I18N.PROMOTION.ERROR.TITLE" });
        errorBody = i18n({ key: "I18N.PROMOTION.ERROR.SELF_EXCLUDED" });
      } else if ((interactiveResponseError?.responseMessage || "").indexOf("ACCOUNT_LOCKED") > 0) {
        errorTitle = i18n({ key: "I18N.PROMOTION.ERROR.TITLE" });
        errorBody = i18n({ key: "I18N.PROMOTION.ERROR.SUSPENDED" });
      }

      const notificationMessage: ResponseMessageType = interactiveResponseError
        ? {
            type: interactiveResponseError.responseCode ? AlertType.Warning : AlertType.Success,
            title: errorTitle,
            body: errorBody,
          }
        : undefined;

      switch (type) {
        case OngoingPromoCardTypes.FREE_SPINS: {
          promotionStateI18n.remainingHeader = i18n({
            key: "I18N.PROMO.REMAINING_FREE_SPINS",
            interpolationValues: { remainingFreeSpins: promoDetails?.freeSpins?.remainingFreeSpins || "" },
          });
          promotionStateI18n.remainingSubHeader = "";
          promotionStateI18n.requirements = "";
          break;
        }
        case OngoingPromoCardTypes.GOLDEN_CHIPS: {
          if (pendingWinnings) {
            pendingWinnings -=
              (promoDetails?.goldenChips?.remainingGoldenChips ?? 0) *
              (promoDetails?.goldenChips?.goldenChipsAmount ?? 0);

            pendingWinningsCurrency = currencyFormatWithDecimalPlaces({
              currencyCode,
              localeCodeBcp47,
              value: pendingWinnings,
            });
          }

          promotionStateI18n.remainingSubHeader = i18n({
            key: "I18N.PROMO.REMAINING_GOLDEN_CHIPS",
            interpolationValues: {
              remainingGoldChips: promoDetails?.goldenChips?.remainingGoldenChips || "",
              goldChipsAmount: currencyFormatWithDecimalPlaces({
                currencyCode,
                localeCodeBcp47,
                value: promoDetails?.goldenChips?.goldenChipsAmount ?? 0,
              }),
            },
          });

          promotionStateI18n.remainingHeader = i18n({
            key: "I18N.PROMO.SUBHEADER_GOLDEN_CHIPS",
            interpolationValues: {
              remainingWagger: currencyFormatWithDecimalPlaces({
                currencyCode,
                localeCodeBcp47,
                value: wageringLeft ?? 0,
              }),
            },
          });
          if (wageringNumberOfTimes === 1) {
            promotionStateI18n.requirements = i18n({
              key: "I18N.PROMO.REQUIREMENTS_ONE_TIME",
              interpolationValues: {
                value: currencyFormatWithDecimalPlaces({
                  currencyCode,
                  localeCodeBcp47,
                  value: bonusAwarded || 0,
                }),
              },
            });
          } else {
            promotionStateI18n.requirements = i18n({
              key: "I18N.PROMO.REQUIREMENTS",
              interpolationValues: {
                value: currencyFormatWithDecimalPlaces({
                  currencyCode,
                  localeCodeBcp47,
                  value: bonusAwarded || 0,
                }),
                times: wageringNumberOfTimes,
              },
            });
          }
          break;
        }
        default: {
          promotionStateI18n.requirements = "";
          promotionStateI18n.remainingHeader = i18n({
            key: "I18N.PROMO.REMAINING_CASH",
            interpolationValues: {
              amount: currencyFormatWithDecimalPlaces({
                currencyCode,
                localeCodeBcp47,
                value: wageringLeft ?? 0,
              }),
            },
          });
          if (bonusAwarded && bonusAwarded !== 0) {
            if (wageringNumberOfTimes === 1) {
              promotionStateI18n.remainingSubHeader = i18n({
                key: "I18N.PROMO.REQUIREMENTS_CASH_ONE_TIME",
                interpolationValues: {
                  value: currencyFormatWithDecimalPlaces({
                    currencyCode,
                    localeCodeBcp47,
                    value: bonusAwarded || 0,
                  }),
                },
              });
            } else {
              promotionStateI18n.remainingSubHeader = i18n({
                key: "I18N.PROMO.REQUIREMENTS_CASH",
                interpolationValues: {
                  value: currencyFormatWithDecimalPlaces({
                    currencyCode,
                    localeCodeBcp47,
                    value: bonusAwarded || 0,
                  }),
                  times: Number.isInteger(wageringNumberOfTimes)
                    ? wageringNumberOfTimes.toString()
                    : wageringNumberOfTimes.toFixed(2).replace(/\.?0+$/, ""),
                },
              });
            }
          }
        }
      }

      const disclaimerText: DisclaimerI18N = {
        titleFirstPart: i18n({
          key: "I18N.PROMOTION.DISCLAIMER.TITLE",
        }),
        titleSecondPart: i18n({
          key: "I18N.PROMOTION.DISCLAIMER.TITLE.NEXT",
        }),
        listTitle: i18n({
          key: "I18N.PROMOTION.DISCLAIMER.LIST.TITLE",
        }),
        listItemOne: i18n({
          key: "I18N.PROMOTION.DISCLAIMER.LIST.ITEM.FIRST",
        }),
        listItemTwo: i18n({
          key: "I18N.PROMOTION.DISCLAIMER.LIST.ITEM.SECOND",
        }),
        bottomText: i18n({
          key: "I18N.PROMOTION.DISCLAIMER.BOTTOM",
        }),
      };

      return {
        promoCard,
        layout,
        promotion: urn,
        status,
        subHeadline: subHeadline ?? "",
        title: title ?? "",
        ctaText: ctaTextBasedOnType ?? "",
        image: image?.url ?? "",
        min,
        max,
        buyInMaxValue,
        buyInMinValue,
        bonusAmount,
        bonusPercent,
        disclaimerText,
        depositViewLink,
        currencyDetails,
        type,
        footerValue,
        secondsLeft: timeLeft ?? 0,
        progressValue: percentCompleted ?? 0,
        i18n: promotionStateI18n,
        availableFunds: mainWalletValue ?? 0,
        notificationMessage,
        pendingWinnings: pendingWinningsCurrency,
        isLoggedIn: userDetails?.loggedIn || false,
        authData,
      };
    } catch (e) {
      console.error(e);  

      return {};
    }
  };
  return function mapStateToProps(state: ApplicationState, { urn }: ContainerProps): StateProps {
    const card = getImsPromotionStateCardByURN(state.layouts.cards.imspromotionstate, urn);

    if (!card) {
      return {};
    }
    const { promotion, depositLink } = card;

    const promoDetails = getPromotionByURN(state.entities.imspromotions, promotion);
    if (!promoDetails) {
      return {};
    }

    const props = formatPromotion(promoDetails, state, urn, depositLink?.viewUrl);

    return {
      ...props,
    };
  };
};

const dispatchCancelPromotion = (promoUrn: string): CancelPromotion => ({
  type: CANCEL_PROMOTION,
  payload: { urn: promoUrn },
});

const dispatchClearErrorMessage = (promoUrn: string): RemoveInteractiveResponseError => ({
  type: REMOVE_INTERACTIVE_RESPONSE_ERROR,
  payload: { urn: promoUrn },
});

const dispatchSawPromotionError = (label: string): SawCardAction => ({
  type: SAW_CARD,
  payload: { label, moduleName: IMS_PROMOTION_MODULE_NAME },
});

const dispatchInteractCancelPromotionModal = (
  promoUrn: string,
  name: string,
  promoStatus: string,
  userStatus: PromotionStatus,
  label: string,
  type?: OngoingPromoCardTypes,
  progressValue?: number,
): InteractCancelPromotionModal => ({
  type: INTERACT_CANCEL_PROMOTION_MODAL,
  payload: { urn: promoUrn, name, promoStatus, userStatus, label, type, progressValue },
});

const dispatchAcceptPromotion = (
  promoUrn: string,
  name: string,
  promoStatus: string,
  userStatus: PromotionStatus,
  amount?: number,
  type?: OngoingPromoCardTypes,
  progressValue?: number,
): AcceptPromotion => ({
  type: ACCEPT_PROMOTION,
  payload: { urn: promoUrn, amount, name, promoStatus, userStatus, type, progressValue },
});

const dispatchDepositNavigation = (viewLink: ViewLink): DepositNavigation => ({
  type: DEPOSIT_NAVIGATION,
  payload: { viewLink },
});

const dispatchRefreshPromotion = (
  promoUrn: string,
  name: string,
  promoStatus: string,
  userStatus: PromotionStatus,
  label: string,
  promotion: string,
  type?: OngoingPromoCardTypes,
  progressValue?: number,
): RefreshPromotion => ({
  type: REFRESH_PROMOTION,
  payload: { urn: promoUrn, name, promoStatus, userStatus, label, promotion, type, progressValue },
});

const dispatchExternalPushAction = (label: string, moduleName: string, url: string): ExternalPushAction => ({
  type: EXTERNAL_PUSH,
  payload: {
    viewUrn: "",
    viewUrl: url,
    gtmData: {
      label,
      moduleName,
    },
  },
});

export type DispatchProps = {
  dispatchCancelPromotion: typeof dispatchCancelPromotion;
  dispatchClearErrorMessage: typeof dispatchClearErrorMessage;
  dispatchInteractCancelPromotionModal: typeof dispatchInteractCancelPromotionModal;
  dispatchAcceptPromotion: typeof dispatchAcceptPromotion;
  dispatchDepositNavigation: typeof dispatchDepositNavigation;
  dispatchRefreshPromotion: typeof dispatchRefreshPromotion;
  dispatchSawPromotionError: typeof dispatchSawPromotionError;
  dispatchExternalPushAction: typeof dispatchExternalPushAction;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchCancelPromotion,
  dispatchClearErrorMessage,
  dispatchInteractCancelPromotionModal,
  dispatchAcceptPromotion,
  dispatchDepositNavigation,
  dispatchRefreshPromotion,
  dispatchSawPromotionError,
  dispatchExternalPushAction,
};
