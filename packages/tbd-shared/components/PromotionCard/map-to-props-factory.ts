import { MapDispatchToProps, MapStateToPropsFactory } from "react-redux";
import { Dispatch } from "redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import URN from "@ppb/tbd-store/state/layout/URN";
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import {
  PromotionAction,
  PromotionBackgroundImage,
  PromotionCards,
  PromotionTermsAndConditions,
} from "@ppb/tbd-store/state/layout/cards/Card.types";
import { EXTERNAL_PUSH, ExternalPushAction, PUSH, PushAction } from "@ppb/tbd-store/actions/router";
import {
  PromotionCallToActionClickAction,
  PromotionTermsAndConditionsClickAction,
  UI__CLICK_PROMOTION_CALL_TO_ACTION,
  UI__CLICK_PROMOTION_TERMS_AND_CONDITIONS,
} from "@ppb/tbd-store/actions/interface";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import { createSportsbookMarketByURNSelector } from "@ppb/tbd-store/state/entities/sportsbook-markets/sportsbook-market-selectors";
import {
  SUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
  SubscribeSportsbookMarketUpdatesAction,
  UNSUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
  UnsubscribeSportsbookMarketUpdatesAction,
} from "@ppb/tbd-store/actions/sportsbook-markets";
import { createSportsbookRunnerWithBettingLegStateByURNSelector } from "@ppb/tbd-store/state/entities/sportsbook-runners/sportsbook-runner-selectors";
import { SportsbookOdds } from "@ppb/tbd-store/state/entities/SportsbookOdds.types";
import {
  BettingSportsbookToggleLegAction,
  BETTING__REMOVE_ALL_POTENTIAL_BETS_ACTION,
  BETTING__SBK_TOGGLE_LEG_ACTION,
  MarketSportsbookBetButtonClickAction,
  PlacingBetPayload,
  RemoveAllPotentialBetsAction,
  UI__MARKET_SBK_BET_BUTTON_CLICK,
} from "@ppb/tbd-store/actions/betting";
import { PlacingBetMetadata } from "@ppb/tbd-store/middlewares/tagging-resolvers/Betting.types";
import { createGetThrottleSelector } from "@ppb/tbd-store/state/entities/throttles/throttles-selectors";
import { createIsCookieConsentCategoryActiveSelector } from "@ppb/tbd-store/state/cookie-consent/cookie-consent-selectors";
import { getCookieConsentCategories } from "@ppb/tbd-store/helpers/cookie-consent";
import {
  BetslipExcRemovePotentialSelectionAction,
  BetslipOpenAction,
  BetslipSbkRemovePotentialSelectionAction,
  UI__BETSLIP_EXC_REMOVE_POTENTIAL_SELECTION,
  UI__BETSLIP_OPEN,
  UI__BETSLIP_SBK_REMOVE_POTENTIAL_SELECTION,
} from "@ppb/tbd-store/actions/betslip";
import { TaggingAction } from "@ppb/tbd-store/middlewares/tagging-resolvers/AnalyticsConstants";
import { Product } from "@ppb/tbd-store/state/entities/user-preferences/UserPreferences.types";
import { PromotionContentType } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import { i18n } from "../../helpers/i18n";
import { TranslationKey } from "../../translations/keys";

export type ContainerProps = {
  urn: URN;
  visible?: boolean;
};

export type CardProps = {
  cardUrn: URN;
  action: PromotionAction;
  backgroundImage: (PromotionBackgroundImage | null)[];
  name: string;
  promotionContentType?: PromotionContentType;
  promotionTitle: string | null;
  termsAndConditions: PromotionTermsAndConditions | null;
  termsAndConditionsLabel?: string;
  promotionUrn: URN;
  isImsPromo?: boolean;
  isPlayNewPromo?: boolean;
  hasPersonalisation?: boolean;
  promoTypeLabel?: string;
  description?: string;
  currentUrl?: string;
  currentUrn?: string;
  isCasino?: boolean;
  headline?: string;
  subHeadline?: string;
  strapline?: string;

  runnerUrn?: string;
  marketId?: string;
  marketUrn?: URN;
  betButtondisplayPreviousOdd?: boolean;
  hasBetfairBoost?: boolean;

  odds?: SportsbookOdds;
};

export type StateProps = CardProps | Record<string, never>;

function adaptActionLabel(text: string): string {
  const label = text.toUpperCase();
  switch (label) {
    case "ACCEPT":
      return i18n({ key: "I18N.PROMO.ACCEPT" });
    case "OPT IN":
      return i18n({ key: "I18N.PROMO.OPTIN" });
    case "CLAIM NOW":
      return i18n({ key: "I18N.PROMO.CLAIM_NOW" });
    case "VIEW DETAILS":
      return i18n({ key: "I18N.PROMO.VIEW_DETAILS" });
    default:
      return text;
  }
}

/**
 * Map global state to component local state
 *
 * @param state The application state
 * @param urn The connected component input URN
 * @returns Component local state
 */
export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getPromotionCardByUrn = createCardByURNSelector<PromotionCards, URN>();
  const getSportsbookMarketByURN = createSportsbookMarketByURNSelector();
  const getThrottle = createGetThrottleSelector();
  const isCookieConsentCategoryActive = createIsCookieConsentCategoryActiveSelector();

  return function mapStateToProps(state: ApplicationState, { urn }: ContainerProps): StateProps {
    const promotionCard = getPromotionCardByUrn(state.layouts.cards.promotions, urn);

    if (!promotionCard) {
      return {};
    }
    const {
      action,
      backgroundImage,
      promotionName,
      promotionContentType,
      promotionTitle,
      termsAndConditions,
      isImsPromo,
      promoTypeLabel,
      headline,
      subHeadline,
      strapline,
      hasBetfairBoost,
    } = promotionCard;

    let label = "";

    if ("label" in action) {
      label = adaptActionLabel(action.label);
    }

    let termsAndConditionsLabel = "";
    if (isImsPromo) {
      termsAndConditionsLabel = i18n({ key: "I18N.PROMO.T&C.TEXT" });
    } else {
      const fetchedTermsAndConditionsLabel = termsAndConditions?.label;

      termsAndConditionsLabel = fetchedTermsAndConditionsLabel
        ? fetchedTermsAndConditionsLabel.name ||
          i18n({ key: fetchedTermsAndConditionsLabel.translationKey as keyof TranslationKey })
        : "";
    }

    const isCasino = promotionContentType === PromotionContentType.Casino;

    const basePromotionProps = {
      cardUrn: urn,
      action: {
        ...action,
        label,
      },
      backgroundImage,
      name: promotionName || "",
      promotionTitle,
      termsAndConditions: isImsPromo
        ? {
            summary: promotionCard.promotionTitle,
          }
        : termsAndConditions,
      promotionUrn: urn,
    };

    if (isCasino) {
      return {
        ...basePromotionProps,
        isCasino,
        currentUrl: state.router.currentUrl || undefined,
        currentUrn: state.router.currentUrn || undefined,
        isImsPromo: isImsPromo || undefined,
        headline: headline || undefined,
        subHeadline: subHeadline || undefined,
        strapline: strapline || undefined,
      };
    }

    const PLAY_NEW_TAGS = {
      STATIC: "styw-static",
      MECHANIC: "styw",
    };

    const { MARKETING_TARGETING_3RD_PARTY } = getCookieConsentCategories();

    const promotionProps = {
      ...basePromotionProps,
      promotionContentType,
      termsAndConditionsLabel,
      isImsPromo: !!isImsPromo,
      hasPersonalisation:
        !!getThrottle(state.entities.throttles, "INJECT_MI_SCRIPT")?.isActive &&
        isCookieConsentCategoryActive(state?.cookieConsent, MARKETING_TARGETING_3RD_PARTY),
      promoTypeLabel,
      description: promotionCard.promotionTitle || undefined,
      isPlayNewPromo: (promotionCard.tags || []).some(
        (tag) => tag === PLAY_NEW_TAGS.MECHANIC || tag === PLAY_NEW_TAGS.STATIC,
      ),
    };

    if (promotionContentType === PromotionContentType.Oddsboost && "market" in action) {
      const market = getSportsbookMarketByURN(state.entities.sportsbookmarkets, action.market.urn);
      const getSportsbookRunnerWithBettingLegStateByURN = createSportsbookRunnerWithBettingLegStateByURNSelector();

      if (!market) {
        return {};
      }

      const { urn: marketUrn, marketId } = market;

      const runnerUrn = action.runner.runnerURN;

      const runner = getSportsbookRunnerWithBettingLegStateByURN(state, { marketUrn, runnerUrn });

      return {
        ...promotionProps,
        runnerUrn,
        odds: runner?.odds,
        marketId,
        marketUrn,
        hasBetfairBoost,
        betButtondisplayPreviousOdd: true,
      };
    }

    return promotionProps;
  };
};

type CallToActionTap = (
  viewLink: ViewLink,
  title: string,
  promotionUrn: URN,
  isImsPromo?: boolean,
) => PromotionCallToActionClickAction;

type TermsAndConditionsTap = (
  viewLink: ViewLink,
  title: string,
  promotionUrn: URN,
  isImsPromo?: boolean,
) => PromotionTermsAndConditionsClickAction;

type BetPlacement = (bet: PlacingBetPayload, metadata: PlacingBetMetadata) => void;

export type DispatchProps = {
  dispatchCallToActionTap: CallToActionTap;
  dispatchTermsAndConditionsTap: TermsAndConditionsTap;
  dispatchExternalPushAction: (viewLink: ViewLink) => ExternalPushAction;
  dispatchPushAction: (viewLink: ViewLink) => PushAction;
  dispatchSportsbookMarketUpdatesSubscribe: (marketId: string, subscriberId: string) => SubscribeSportsbookMarketUpdatesAction;
  dispatchSportsbookMarketUpdatesUnsubscribe: (marketId: string, subscriberId: string) => UnsubscribeSportsbookMarketUpdatesAction;
  dispatchBetPlacement: BetPlacement;
};

export const mapDispatchToProps: MapDispatchToProps<DispatchProps, ContainerProps> = (dispatch: Dispatch) => ({
  dispatchCallToActionTap: (viewLink, title, promotionUrn, isImsPromo): PromotionCallToActionClickAction =>
    dispatch<PromotionCallToActionClickAction>({
      type: UI__CLICK_PROMOTION_CALL_TO_ACTION,
      payload: {
        viewLink,
        title,
        promotionUrn,
        isImsPromo,
        taggingAction: TaggingAction.CLICKED_BANNER_CTA,
      },
    }),

  dispatchTermsAndConditionsTap: (viewLink, title, promotionUrn, isImsPromo): PromotionTermsAndConditionsClickAction =>
    dispatch<PromotionTermsAndConditionsClickAction>({
      type: UI__CLICK_PROMOTION_TERMS_AND_CONDITIONS,
      payload: {
        viewLink,
        title,
        promotionUrn,
        isImsPromo,
        taggingAction: TaggingAction.CLICKED_BANNER_TERMS_AND_CONDITIONS,
      },
    }),

  dispatchExternalPushAction: (viewLink): ExternalPushAction =>
    dispatch<ExternalPushAction>({
      type: EXTERNAL_PUSH,
      payload: viewLink,
    }),

  dispatchPushAction: (viewLink): PushAction =>
    dispatch<PushAction>({
      type: PUSH,
      payload: viewLink,
    }),

  dispatchSportsbookMarketUpdatesSubscribe: (marketId, subscriberId): SubscribeSportsbookMarketUpdatesAction =>
    dispatch<SubscribeSportsbookMarketUpdatesAction>({
      type: SUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
      payload: { marketId, subscriberId },
    }),

  dispatchSportsbookMarketUpdatesUnsubscribe: (marketId, subscriberId): UnsubscribeSportsbookMarketUpdatesAction =>
    dispatch<UnsubscribeSportsbookMarketUpdatesAction>({
      type: UNSUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
      payload: { marketId, subscriberId },
    }),

  dispatchBetPlacement: (bet: PlacingBetPayload, metadata: PlacingBetMetadata) => {
    dispatch<BetslipOpenAction>({
      type: UI__BETSLIP_OPEN,
      payload: {
        product: Product.Sportsbook,
      },
    });
    dispatch<BetslipSbkRemovePotentialSelectionAction>({
      type: UI__BETSLIP_SBK_REMOVE_POTENTIAL_SELECTION,
      payload: {
        urn: bet.urn,
      },
    });
    dispatch<BetslipExcRemovePotentialSelectionAction>({
      type: UI__BETSLIP_EXC_REMOVE_POTENTIAL_SELECTION,
    });
    dispatch<MarketSportsbookBetButtonClickAction>({
      type: UI__MARKET_SBK_BET_BUTTON_CLICK,
      payload: { ...bet, ...metadata, uniqueId: "", group: "REAL" },
    });
    dispatch<RemoveAllPotentialBetsAction>({
      type: BETTING__REMOVE_ALL_POTENTIAL_BETS_ACTION,
    });
    dispatch<BettingSportsbookToggleLegAction>({
      type: BETTING__SBK_TOGGLE_LEG_ACTION,
      payload: { ...bet, group: "REAL" },
    });
  },
});
