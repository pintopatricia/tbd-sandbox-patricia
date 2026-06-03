import { MapStateToPropsFactory } from "react-redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { PUSH, PushAction } from "@ppb/tbd-store/actions/router";
import { FETCH_CARDS_FROM_LIST, FetchCardsFromListAction } from "@ppb/tbd-store/actions/catalogue";
import { UI__CARDGROUP_VIEW_ALL_LINK_TAP, CardGroupViewAllLinkTapAction } from "@ppb/tbd-store/actions/navigation";
import URN from "@ppb/tbd-store/state/layout/URN";
import { PartialItem } from "@ppb/tbd-store/state/layout/views/PartialItem.types";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import { createCardGroupByURNSelector } from "@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors";
import {
  CardGroupLayout,
  DisplayMode,
  GamingCardGroups,
  GameTileSize,
  GamingCardGroupType,
} from "@ppb/tbd-store/state/layout/cardgroups/CardGroup.types";
import { ViewAllLink } from "@ppb/tbd-store/state/layout/views/ViewAll.types";
import { createGetThrottleSelector } from "@ppb/tbd-store";
import { LoadedPageContent, UI__PAGE_CONTENT_LOADED } from "@ppb/tbd-store/actions/game-interactions";
import { i18n } from "../../helpers/i18n";
import { TranslationKey } from "../../translations/keys";
import {
  getBetslipExchangeContext,
  getSportsbookPlacedCombinations,
} from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import { createSimpleSelectionsCounterSelector } from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";

export type ContainerProps = {
  segmentedCardGroupUrn?: string;
  urn: URN;
  isTitleHidden?: boolean;
  isSegmented?: boolean;
  isRecommendedCardGroup?: boolean;
  theme?: string;
};

export type CardProps = {
  title: string;
  items: PartialItem[];
  cardgroupURN: URN;
  segmentedCardGroupUrn?: string;
  displayMode: DisplayMode;
  viewAll?: ViewAllLink;
  defaultLayout: CardGroupLayout;
  decoration?: string;
  gameTileSize?: GameTileSize;
  type: GamingCardGroupType;
  pinGamingRibbonNav: boolean;
  isGamesRibbonHighlighted: boolean;
  isBetslipContainerDisplayed: boolean;
  isXmallGameTile?: boolean;
  isGameTileRefined?: boolean;
};

export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getGamingCardGroupByURN = createCardGroupByURNSelector<GamingCardGroups, URN>();
  const getThrottle = createGetThrottleSelector();
  const getSportsbookSimpleSelectionsCounter = createSimpleSelectionsCounterSelector();

  return function mapStateToProps(
    state: ApplicationState,
    { urn: cardgroupURN, isTitleHidden, segmentedCardGroupUrn, theme }: ContainerProps,
  ): StateProps {
    const cardgroup = getGamingCardGroupByURN(state.layouts.cardgroups.gamingcardgroups, cardgroupURN);
    const pinGamingRibbonNav = !!getThrottle(state.entities.throttles, "PIN_GAMING_RIBBON_NAV")?.isActive;
    const isGameTileRefined = !!getThrottle(state.entities.throttles, "GAME_TILE_REFINED_DESIGN")?.isActive;

    if (!cardgroup) {
      return {};
    }
    const hasExchangeContext = getBetslipExchangeContext(state);
    const hasPlacedCombinations = !!getSportsbookPlacedCombinations(state);
    const totalSportsbookSelections = getSportsbookSimpleSelectionsCounter(state);
    const isBetslipContainerDisplayed =
      !!hasExchangeContext || hasPlacedCombinations || totalSportsbookSelections !== 0;

    const isGamesRibbonHighlighted = state.entities?.brandSettings?.HIGHLIGHTED_SPORTS_RIBBON || false;
    const title =
      cardgroup.displayName && cardgroup.displayName.translationKey
        ? i18n({ key: cardgroup.displayName.translationKey as unknown as keyof TranslationKey })
        : cardgroup.title;
    return {
      title: !isTitleHidden ? title || "" : "",
      items: cardgroup.items || [],
      cardgroupURN,
      segmentedCardGroupUrn: segmentedCardGroupUrn || "",
      displayMode: cardgroup.displayMode ?? "SCROLLABLE",
      viewAll: cardgroup.viewAll,
      defaultLayout: cardgroup.defaultLayout || CardGroupLayout.CARD_LIST,
      decoration: cardgroup.decoration,
      gameTileSize: cardgroup.gameTileSize,
      type: cardgroup.cardGroupType,
      pinGamingRibbonNav,
      isGamesRibbonHighlighted,
      isBetslipContainerDisplayed,
      isXmallGameTile: theme === "GAMING_SMALL_TILES",
      isGameTileRefined,
    };
  };
};

const dispatchFetchCards = (urn: string, partials: PartialItem[]): FetchCardsFromListAction => ({
  type: FETCH_CARDS_FROM_LIST,
  payload: {
    urn,
    partials,
  },
});

const dispatchPushAction = (viewLink: ViewLink): PushAction => ({
  type: PUSH,
  payload: viewLink,
});

const dispatchViewAllTap = (
  title: string,
  viewAllLink: ViewAllLink,
  cardgroupURN: URN,
): CardGroupViewAllLinkTapAction => ({
  type: UI__CARDGROUP_VIEW_ALL_LINK_TAP,
  payload: {
    title,
    viewAllLink,
    cardgroupURN,
  },
});

const dispatchLoadedContent = (urn: string, title: string, itemUrns: string[]): LoadedPageContent => ({
  type: UI__PAGE_CONTENT_LOADED,
  payload: {
    urn,
    title,
    itemUrns,
  },
});

export type DispatchProps = {
  dispatchPushAction: typeof dispatchPushAction;
  dispatchViewAllTap: typeof dispatchViewAllTap;
  dispatchFetchCards: typeof dispatchFetchCards;
  dispatchLoadedContent: typeof dispatchLoadedContent;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchPushAction,
  dispatchViewAllTap,
  dispatchFetchCards,
  dispatchLoadedContent,
};
