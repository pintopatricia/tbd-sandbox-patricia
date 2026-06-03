import {
  NavigateToAllCompetitionsViewFromQuickLink,
  NavigateToAllMarketsFromAllMarketsLink,
  NavigateToCompetitionView,
  NavigateToEventFromMarket,
  NavigateToMarketView,
  NavigateToRaceFromMarket,
  UI__CLICK_ALLMARKETS_LINK,
  UI__NAVIGATE_TO_COMPETITION_VIEW,
  UI__NAVIGATE_TO_EVENT_FROM_MARKET,
  UI__NAVIGATE_TO_MARKET_VIEW,
  UI__NAVIGATE_TO_RACE_FROM_MARKET,
  UI__TAP_ALL_COMPETITIONS_LINK,
} from "@ppb/tbd-store/actions/navigation";
import { PUSH, PushAction } from "@ppb/tbd-store/actions/router";
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { QuickLink, QuickLinksCards } from "@ppb/tbd-store/state/layout/cards/Card.types";
import URN from "@ppb/tbd-store/state/layout/URN";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import { MapStateToPropsFactory } from "react-redux";
import { SearchAzLinkClickAction, UI__SEARCH_AZ_LINK_CLICK } from "@ppb/tbd-store/actions/browse";
import { i18n } from "../../helpers/i18n";
import { TranslationKey } from "../../translations/keys";

export type ContainerProps = {
  urn: URN;
};

export type CardProps = {
  title?: string;
  accordionTitle?: string;
  accordionExpanded: boolean;
  links: QuickLink[];
};

export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getQuickLinksCardByURN = createCardByURNSelector<QuickLinksCards, URN>();

  return function mapStateToProps(state: ApplicationState, { urn }: ContainerProps): StateProps {
    const quickLinks = getQuickLinksCardByURN(state.layouts.cards.quicklinks, urn);

    if (!quickLinks) {
      return {};
    }

    return {
      title: i18n({ key: quickLinks.label?.translationKey as keyof TranslationKey }) || quickLinks.title || undefined,
      links: quickLinks.links,
      accordionTitle: quickLinks.accordionTitle || undefined,
      accordionExpanded: !!quickLinks.accordionExpanded,
    };
  };
};

type QuickLinkNavigation =
  | NavigateToAllCompetitionsViewFromQuickLink
  | NavigateToAllMarketsFromAllMarketsLink
  | NavigateToEventFromMarket
  | NavigateToCompetitionView
  | NavigateToRaceFromMarket
  | SearchAzLinkClickAction
  | NavigateToMarketView
  | {};

export const navigateToAllCompetitionsViewFromQuickLink = (
  href: string,
  cardUrn: string,
  text: string,
): NavigateToAllCompetitionsViewFromQuickLink => ({
  type: UI__TAP_ALL_COMPETITIONS_LINK,
  payload: { href, text, cardUrn },
});

export const navigateToAllMarketsFromAllMarketsLink = (
  destinationUrl: string,
): NavigateToAllMarketsFromAllMarketsLink => ({
  type: UI__CLICK_ALLMARKETS_LINK,
  payload: { destinationUrl },
});

export const navigateToEventViewFromMarketQuickLink = (
  destinationUrl: string,
  text: string,
): NavigateToEventFromMarket => ({
  type: UI__NAVIGATE_TO_EVENT_FROM_MARKET,
  payload: { url: destinationUrl, text },
});

export const navigateToCompetitionView = (
  cardUrn: URN,
  destinationUrl: string,
  text: string,
): NavigateToCompetitionView => ({
  type: UI__NAVIGATE_TO_COMPETITION_VIEW,
  payload: { cardType: "QuickLinksCard", cardUrn, href: destinationUrl, text },
});

export const navigateToRaceViewFromMarketQuickLink = (
  destinationUrl: string,
  text: string,
): NavigateToRaceFromMarket => ({
  type: UI__NAVIGATE_TO_RACE_FROM_MARKET,
  payload: { url: destinationUrl, text },
});

const navigateToMarketView = (destinationUrl: string, text: string, cardUrn: URN): NavigateToMarketView => ({
  type: UI__NAVIGATE_TO_MARKET_VIEW,
  payload: { cardType: "QuickLinksCard", href: destinationUrl, cardUrn, marketName: text },
});

export const dispatchSearchLinkClick = (text: string, viewLink: ViewLink, title?: string): SearchAzLinkClickAction => ({
  type: UI__SEARCH_AZ_LINK_CLICK,
  payload: { text, url: viewLink.viewUrl, title },
});

export const pushAction = (viewLink: ViewLink): PushAction => ({
  type: PUSH,
  payload: viewLink,
});

// TODO: A QuickLinksCard can be an item on any page,
//  this gtm events logic is related to when quicklink is clicked on a market view.
//  this should be dealt agnostically in middlewares/tagging where we can know the navigation origin and destiny
const navigateToQuickLink = (viewLink: ViewLink, text: string, urn: string, title?: string): QuickLinkNavigation => {
  const { viewUrl, viewUrn } = viewLink;

  if (viewUrl) {
    if (viewUrn.endsWith("allCompetitions:1")) {
      return navigateToAllCompetitionsViewFromQuickLink(viewUrl, urn, text);
    }
    if (viewUrn.includes("allMarkets")) {
      return navigateToAllMarketsFromAllMarketsLink(viewUrl);
    }
    if (viewUrn.includes("view:competition")) {
      return navigateToCompetitionView(urn, viewUrl, text);
    }
    if (viewUrn.includes("event")) {
      return navigateToEventViewFromMarketQuickLink(viewUrl, text);
    }
    if (viewUrn.includes("race")) {
      return navigateToRaceViewFromMarketQuickLink(viewUrl, text);
    }
    // virtuals and inplay pages should have same behaviour as sport pages
    if (
      viewUrn.includes("sport") ||
      viewUrn.includes("view:generic:inplay") ||
      viewUrn.includes("view:generic:virtuals")
    ) {
      return dispatchSearchLinkClick(text, viewLink, title);
    }
    if (viewUrn.includes("view:market")) {
      return navigateToMarketView(viewUrl, text, urn);
    }
  }

  return {};
};

export type DispatchProps = {
  navigateToQuickLink: typeof navigateToQuickLink;
  pushAction: typeof pushAction;
};

export const mapDispatchToProps: DispatchProps = {
  navigateToQuickLink,
  pushAction,
};
