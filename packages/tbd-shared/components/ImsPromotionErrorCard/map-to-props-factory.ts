import { MapStateToPropsFactory } from "react-redux";
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { PUSH, PushAction } from "@ppb/tbd-store/actions/router";
import { UI__NAVIGATE_TO_SEE_ALL_PROMOTIONS, NavigateToSeeAllPromotions } from "@ppb/tbd-store/actions/navigation";
import URN from "@ppb/tbd-store/state/layout/URN";
import { ImsPromotionErrorCards } from "@ppb/tbd-store/state/layout/cards/Card.types";
import { AlertType } from "@ppb/the-wall-common/types";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import { SawCardAction, SAW_CARD } from "@ppb/tbd-store/actions/interface";
import { IMS_PROMOTION_MODULE_NAME } from "@ppb/tbd-store/state/entities/ims-promotions/ImsPromotion";
import { ImsPromotionErrorCodes } from "@ppb/tbd-store/state/constants";
import { i18n } from "../../helpers/i18n";

export type ContainerProps = {
  urn: URN;
};

export type CardProps = {
  title: string;
  body: string;
  type: AlertType;
  i18n: {
    seeAllLabel: string;
    seeAllInfo: string;
    recommended: string;
  };
  seeAllLink?: ViewLink;
};

export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getImsPromotionErrorCardByURN = createCardByURNSelector<ImsPromotionErrorCards, URN>();

  return function mapStateToProps(state: ApplicationState, { urn }: ContainerProps): StateProps {
    const card = getImsPromotionErrorCardByURN(state.layouts.cards.imspromotionerror, urn);

    if (!card) {
      return {};
    }

    let title;
    let body;
    let type;
    const seelAlli18n = {
      seeAllLabel: i18n({ key: "I18N.PROMOTION.SEEALL.TITLE" }),
      seeAllInfo: i18n({ key: "I18N.PROMOTION.SEEALL.INFO" }),
      recommended: i18n({ key: "I18N.PROMOTION.ERROR.RECOMMENDED" }),
    };
    switch (card.errorCode) {
      case ImsPromotionErrorCodes.Completed:
        title = i18n({ key: "I18N.PROMOTION.COMPLETED.TITLE" });
        body = i18n({ key: "I18N.PROMOTION.COMPLETED.BODY" });
        type = AlertType.Success;
        break;
      case ImsPromotionErrorCodes.NotEligible:
        title = i18n({ key: "I18N.PROMOTION.UNAVAILABLE.TITLE" });
        body = i18n({ key: "I18N.PROMOTION.UNAVAILABLE.BODY" });
        type = AlertType.Warning;
        break;
      default:
        title = i18n({ key: "I18N.PROMOTION.ERROR.TITLE" });
        body = i18n({ key: "I18N.PROMOTION.ERROR.BODY" });
        type = AlertType.Error;
        break;
    }

    return {
      title,
      body,
      type,
      i18n: seelAlli18n,
      seeAllLink: card.seeAll,
    };
  };
};

const dispatchNavigateToSeeAllPromotions = (viewLink: ViewLink): NavigateToSeeAllPromotions => ({
  type: UI__NAVIGATE_TO_SEE_ALL_PROMOTIONS,
  payload: viewLink,
});

const dispatchPushAction = (viewLink: ViewLink): PushAction => ({
  type: PUSH,
  payload: viewLink,
});

const dispatchSawPromotionError = (label: string): SawCardAction => ({
  type: SAW_CARD,
  payload: { label, moduleName: IMS_PROMOTION_MODULE_NAME },
});

export type DispatchProps = {
  dispatchPushAction: typeof dispatchPushAction;
  dispatchNavigateToSeeAllPromotions: typeof dispatchNavigateToSeeAllPromotions;
  dispatchSawPromotionError: typeof dispatchSawPromotionError;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchPushAction,
  dispatchNavigateToSeeAllPromotions,
  dispatchSawPromotionError,
};
