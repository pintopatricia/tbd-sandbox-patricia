import { MapStateToPropsFactory } from "react-redux";

import { ApplicationState, EXTERNAL_PUSH_BLANK, ExternalPushBlankAction, UserDetails } from "@ppb/tbd-store";
import { MarketBlurbLinkClick, UI__MARKET_BLURB_LINK_CLICK } from "@ppb/tbd-store/actions/navigation";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { createGetBlurbCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/blurb/blurb-card.selectors";
import { MarketPromoIcon, MarketPromoProps, URN } from "@ppb/the-wall-common/types";

import { PromoDescriptionToggleAction, UI__PROMO_DESCRIPTION_TOGGLE } from "@ppb/tbd-store/actions/interface";
import { MarketPromoVariant } from "@ppb/the-wall-common/types/MarketPromo/MarketPromo.types";
import type { MarketBlurb } from "../../config/market-blurb";
import type { ComponentProps } from "./props";

import { getExternalLink } from "../../helpers/external-links";
import { i18n } from "../../helpers/i18n";

export type CardProps = {
  i18nLabels: {
    termsConditions: string;
  };
  termsAndConditionsURL: string;
} & Pick<MarketPromoProps, "title" | "description" | "isExpanded">;

export type StateProps = CardProps | Record<string, never>;

export type ContainerProps = {
  urn?: URN;
  component: React.ComponentType<ComponentProps>;
  variant: string;
  marketPromoVariant?: MarketPromoVariant;
} & Partial<MarketBlurb>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getUserDetails = createGetCountryLocalCurrencyCodeSelector();
  const getBlurbCardByURN = createGetBlurbCardByURNSelector();

  const i18nLabels: CardProps["i18nLabels"] = { termsConditions: i18n({ key: "I18N.MARKET_PROMO.T&C" }) };

  return (
    state: ApplicationState,
    { titleKey, descriptionKey, externalLinkType, urn, signposting }: ContainerProps,
  ): StateProps & { signposting: MarketPromoProps["signposting"] } => {
    const { jurisdiction, localeCode } = <UserDetails>getUserDetails(state);
    const blurbCard = urn ? getBlurbCardByURN(state.layouts.cards.blurb, urn) : undefined;

    // If we have blurbCard data, use it
    if (blurbCard?.title || blurbCard?.description) {
      return {
        title: blurbCard.title || "",
        description: blurbCard.description || "",
        isExpanded: blurbCard?.isExpanded,
        signposting: MarketPromoIcon.MarketRules,
        i18nLabels: {
          termsConditions: blurbCard.link?.text || "",
        },
        termsAndConditionsURL: blurbCard.link?.url || "",
      };
    }

    // Fallback to i18n keys if provided
    if (titleKey && descriptionKey) {
      return {
        title: i18n({ key: titleKey }),
        description: i18n({ key: descriptionKey }),
        signposting: signposting || MarketPromoIcon.NinetyMinPayout,
        i18nLabels,
        termsAndConditionsURL: externalLinkType
          ? getExternalLink(externalLinkType, jurisdiction.jurisdiction, localeCode)
          : "",
      };
    }

    // Return empty state if no data is available
    return {
      title: "",
      description: "",
      signposting: MarketPromoIcon.MarketRules,
      i18nLabels,
      termsAndConditionsURL: "",
    };
  };
};

const dispatchExternalPushAction = (url: string): ExternalPushBlankAction => ({
  type: EXTERNAL_PUSH_BLANK,
  payload: {
    viewUrn: "",
    viewUrl: url,
  },
});

const dispatchMarketBlurbLinkClick = (url: string, title: string, variant: string): MarketBlurbLinkClick => ({
  type: UI__MARKET_BLURB_LINK_CLICK,
  payload: {
    destinationUrl: url,
    elementText: title,
    variant,
  },
});

const dispatchToggleDescriptionBlurbCard = (
  title: string,
  isOpen: boolean,
  variant: string,
): PromoDescriptionToggleAction => ({
  type: UI__PROMO_DESCRIPTION_TOGGLE,
  payload: {
    title,
    isOpen,
    variant,
  },
});

export type DispatchProps = {
  dispatchExternalPushAction: typeof dispatchExternalPushAction;
  dispatchMarketBlurbLinkClick: typeof dispatchMarketBlurbLinkClick;
  dispatchToggleDescriptionBlurbCard: typeof dispatchToggleDescriptionBlurbCard;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchExternalPushAction,
  dispatchMarketBlurbLinkClick,
  dispatchToggleDescriptionBlurbCard,
};
