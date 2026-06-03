import { MapStateToPropsFactory } from "react-redux";

import { createGetThrottleSelector } from "@ppb/tbd-store";
import URN from "@ppb/tbd-store/state/layout/URN";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import {
  RunnerViewLinks,
  DisplayRunners,
  DisplayRunnersDefinition,
  MarketCard,
  MarketBlurbLink,
  TabLink,
} from "@ppb/tbd-store/state/layout/cards/Card.types";
import {
  MarketBlurbLinkClick,
  NavigateToEventFromSport,
  NavigateToMarketView,
  NavigateToView,
  UI__MARKET_BLURB_LINK_CLICK,
  UI__NAVIGATE_TO_EVENT_FROM_SPORT,
  UI__NAVIGATE_TO_MARKET_VIEW,
  UI__NAVIGATE_TO_VIEW,
} from "@ppb/tbd-store/actions/navigation";
import {
  PromoDescriptionToggleAction,
  ToggleShowMoreRunnersAction,
  UI__PROMO_DESCRIPTION_TOGGLE,
  UI__TOGGLE_SHOW_MORE_RUNNERS,
} from "@ppb/tbd-store/actions/interface";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import { createSportsbookMarketByURNSelector } from "@ppb/tbd-store/state/entities/sportsbook-markets/sportsbook-market-selectors";

import { EXTERNAL_PUSH_BLANK, ExternalPushBlankAction, PUSH, PushAction } from "@ppb/tbd-store/actions/router";
import { SportsbookMarketProps } from "@ppb/the-wall-common/types";
import { MarketTemplate } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import { MarketBlurb, MARKET_BLURB_SUPER_SUB } from "../../config/market-blurb";
import MarketBlurbsGA4Variants from "../../helpers/market-blurbs-ga4-variants";

export type GetCardType = (isCashoutQuoteAvailable?: boolean) => "MarketCard" | "MarketExtendedCard";

export type StateProps = {
  marketUrn?: URN;
  runnerUrns: URN[];
  runnersAmount: number;
  marketBlurb?: MarketBlurb;
  getCardType: GetCardType;
};

export type ContainerProps = {
  title?: string;
  cardUrn: string;
  marketViewLinks?: ViewLink[];
  eventViewLink?: ViewLink;
  runnerViewLinks?: RunnerViewLinks;
  isCashoutQuoteAvailable?: boolean;
  displayRunners?: DisplayRunners;
  isRunnerExpandable?: boolean;
  sporteventURN?: URN;
  template: MarketTemplate;
  numberOfItemsToDisplay?: number;
  inline?: boolean;
  show90MinBlurb?: boolean;
  tabLink?: TabLink;
  visible?: boolean;
} & Pick<SportsbookMarketProps, "onMarketPromoClick" | "onLinkClick"> &
  Pick<MarketCard, "marketPromo" | "infoBlurbs">;

const getCardType: GetCardType = (isCashoutQuoteAvailable?: boolean) =>
  isCashoutQuoteAvailable ? "MarketExtendedCard" : "MarketCard";

const getMarketDefinitions = (runners?: DisplayRunners): DisplayRunnersDefinition | undefined => {
  const { exchange, sportsbook } = runners || {};

  return sportsbook || exchange;
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getSportsbookMarketByURN = createSportsbookMarketByURNSelector();
  const getThrottle = createGetThrottleSelector();

  return function mapStateToProps(state: ApplicationState, { displayRunners }: ContainerProps): StateProps {
    const isSuperSubBlurbThrottleActive = getThrottle(state.entities.throttles, "SUPER_SUB_MARKET_BLURBS")?.isActive;
    const marketDefinitions = getMarketDefinitions(displayRunners);
    const marketUrn = marketDefinitions?.market;

    const sportsbookMarket = marketUrn
      ? getSportsbookMarketByURN(state.entities.sportsbookmarkets, marketUrn)
      : undefined;
    const hasSuperSubBlurb = isSuperSubBlurbThrottleActive && sportsbookMarket?.isSuperSub;

    return {
      marketUrn,
      runnerUrns: marketDefinitions?.runners.map((r) => r.urn) || [],
      runnersAmount: marketDefinitions?.runners.length || 0,
      marketBlurb: hasSuperSubBlurb ? MARKET_BLURB_SUPER_SUB : undefined,
      getCardType,
    };
  };
};

const navigateToMarketView = (
  cardType: "MarketViewLinkCard" | "MarketCard" | "MarketExtendedCard",
  href: string,
  cardUrn: string,
  marketName?: string,
): NavigateToMarketView => ({
  type: UI__NAVIGATE_TO_MARKET_VIEW,
  payload: { cardType, href, cardUrn, marketName },
});

const pushAction = (viewLink: ViewLink): PushAction => ({
  type: PUSH,
  payload: viewLink,
});

const dispatchToggleShowMoreRunners = (
  cardUrn: URN,
  showMore: boolean,
  gaModuleSuffix?: string,
): ToggleShowMoreRunnersAction => ({
  type: UI__TOGGLE_SHOW_MORE_RUNNERS,
  payload: {
    cardUrn,
    showMore,
    gaModuleSuffix,
  },
});

const dispatchTogglePromoDescription = (
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
  navigateToMarketView: typeof navigateToMarketView;
  pushAction: typeof pushAction;
  dispatchToggleShowMoreRunners: typeof dispatchToggleShowMoreRunners;
  dispatchTogglePromoDescription: typeof dispatchTogglePromoDescription;
  dispatchNavigateToView: typeof dispatchNavigateToView;
  dispatchPushExternalBlankAction: typeof dispatchPushExternalBlankAction;
  dispatchMarketBlurbLinkClick: typeof dispatchMarketBlurbLinkClick;
  dispatchClickCardAction: typeof dispatchClickCardAction;
};

const dispatchPushExternalBlankAction = (url: string): ExternalPushBlankAction => ({
  type: EXTERNAL_PUSH_BLANK,
  payload: {
    viewUrl: url,
    viewUrn: "",
  },
});

const dispatchNavigateToView = (destination: string, cardURN: URN, label?: string): NavigateToView => ({
  type: UI__NAVIGATE_TO_VIEW,
  payload: {
    url: destination,
    cardURN,
    label: label || "",
    module: "primary swimlane",
  },
});

const dispatchClickCardAction = (
  cardUrn: URN,
  sportEventURN: URN,
  href: string,
  elementText?: string,
): NavigateToEventFromSport => ({
  type: UI__NAVIGATE_TO_EVENT_FROM_SPORT,
  payload: {
    cardUrn,
    href,
    sportEventURN,
    elementText: elementText || "",
    type: "primary swimlane",
  },
});

const dispatchMarketBlurbLinkClick = (link: MarketBlurbLink): MarketBlurbLinkClick => ({
  type: UI__MARKET_BLURB_LINK_CLICK,
  payload: {
    destinationUrl: link.url,
    elementText: link.text,
    variant: MarketBlurbsGA4Variants.INFORMATIVE,
  },
});

export const mapDispatchToProps: DispatchProps = {
  navigateToMarketView,
  pushAction,
  dispatchToggleShowMoreRunners,
  dispatchTogglePromoDescription,
  dispatchNavigateToView,
  dispatchPushExternalBlankAction,
  dispatchMarketBlurbLinkClick,
  dispatchClickCardAction,
};
