import { MapStateToPropsFactory } from "react-redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import URN from "@ppb/tbd-store/state/layout/URN";
import { PUSH, PushAction } from "@ppb/tbd-store/actions/router";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import { GamingCardGroupType } from "@ppb/tbd-store/state/constants";
import {
  NavigateToCategoryUsingMultifunctional,
  NavigateToCategoryUsingSeeAllButton,
  UI__NAVIGATE_TO_GAMING_CATEGORY_USING_MULTIFUNCTIONAL,
  UI__NAVIGATE_TO_GAMING_CATEGORY_USING_SEE_ALL_BUTTON,
} from "@ppb/tbd-store/actions/navigation";
import { PartialItem } from "@ppb/tbd-store/state/layout/views/PartialItem.types";
import { FETCH_CARDS_FROM_LIST, FetchCardsFromListAction } from "@ppb/tbd-store/actions/catalogue";
import { UI__PAGE_CONTENT_LOADED, LoadedPageContent } from "@ppb/tbd-store/actions/game-interactions";
import { getViewZoneByItemUrn } from "@ppb/tbd-store/state/layout/viewzones/viewzone-selectors";
import { createCardGroupByURNSelector } from "@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors";
import { CardGroupLayout, GamingCardGroups } from "@ppb/tbd-store/state/layout/cardgroups/CardGroup.types";
import { ViewAllLink } from "@ppb/tbd-store/state/layout/views/ViewAll.types";
import { i18n } from "../../helpers/i18n";
import type { GamingCategoryLinkProps } from "./snowflakes/GamingCategoryLink/GamingCategoryLink.types";

export type ContainerProps = {
  urn: URN;
  parentUrn?: string;
  isRecommendedCardGroup?: boolean;
};

export type CardProps = {
  items: PartialItem[];
  cardGroupUrn: URN;
  totalItems: number;
  title?: string;
  layout?: CardGroupLayout;
  viewAll?: ViewAllLink;
  hasDelimiter?: boolean;
  parentUrn?: string;
  viewZoneTitle: string;
  gamingCategoryLink?: GamingCategoryLinkProps;
  recentlyPlayedGames: PartialItem[];
};

export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getGamingCardGroupByURN = createCardGroupByURNSelector<GamingCardGroups, URN>();

  return function mapStateToProps(
    state: ApplicationState,
    { urn: cardGroupUrn, parentUrn }: ContainerProps,
  ): StateProps {
    const cardGroup = getGamingCardGroupByURN(state.layouts.cardgroups.gamingcardgroups, cardGroupUrn);
    const viewZone = parentUrn ? getViewZoneByItemUrn(state, parentUrn) : "";
    if (!cardGroup) {
      return {};
    }

    const isSegmentedCardGroup = cardGroup.defaultLayout === CardGroupLayout.CARD_LIST;
    const isFavouritesCardGroup = cardGroup.cardGroupType === GamingCardGroupType.FAVOURITE_GAMES;

    const gamingCategoryLink =
      cardGroup.viewAll?.viewLink && isSegmentedCardGroup
        ? {
            viewLink: cardGroup.viewAll.viewLink,
            label: cardGroup.viewAll.label,
            cardIcon: cardGroup.viewAll.icon,
            buttonText: i18n({ key: "I18N.GAME_PAGE.GRID_LAYOUT.SEE_ALL" }),
          }
        : undefined;
    return {
      ...(cardGroup.title && !isFavouritesCardGroup && { title: cardGroup.title }),
      ...(cardGroup.defaultLayout && { layout: cardGroup.defaultLayout }),
      ...(cardGroup.viewAll && !isSegmentedCardGroup && { viewAll: cardGroup.viewAll }),
      items: cardGroup.items,
      cardGroupUrn: cardGroup.urn,
      totalItems: cardGroup.items.length,
      parentUrn,
      viewZoneTitle: viewZone ? viewZone.viewZone?.title ?? "" : "",
      gamingCategoryLink,
      recentlyPlayedGames: state.layouts.recentlyPlayedGames,
    };
  };
};

const dispatchNavigateToCategoryUsingSeeAllButton = (
  viewLink: ViewLink,
  cardGroupUrn: string,
  text?: string,
  title?: string,
): NavigateToCategoryUsingSeeAllButton => ({
  type: UI__NAVIGATE_TO_GAMING_CATEGORY_USING_SEE_ALL_BUTTON,
  payload: {
    href: viewLink.viewUrl,
    label: text,
    viewUrn: viewLink.viewUrn,
    zoneTitle: title,
    cardUrn: cardGroupUrn,
  },
});

const dispatchPushAction = (viewLink: ViewLink): PushAction => ({
  type: PUSH,
  payload: viewLink,
});

const dispatchFetchCards = (urn: string, partials: PartialItem[]): FetchCardsFromListAction => ({
  type: FETCH_CARDS_FROM_LIST,
  payload: {
    urn,
    partials,
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

const dispatchLaunchCategory = (
  viewLink: ViewLink,
  categoryName: string,
  zoneTitle: string,
): NavigateToCategoryUsingMultifunctional => ({
  type: UI__NAVIGATE_TO_GAMING_CATEGORY_USING_MULTIFUNCTIONAL,
  payload: { href: viewLink.viewUrl, categoryName, zoneTitle },
});

export type DispatchProps = {
  dispatchNavigateToCategoryUsingSeeAllButton: typeof dispatchNavigateToCategoryUsingSeeAllButton;
  dispatchPushAction: typeof dispatchPushAction;
  dispatchFetchCards: typeof dispatchFetchCards;
  dispatchLaunchCategory: typeof dispatchLaunchCategory;
  dispatchLoadedContent: typeof dispatchLoadedContent;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchNavigateToCategoryUsingSeeAllButton,
  dispatchPushAction,
  dispatchFetchCards,
  dispatchLaunchCategory,
  dispatchLoadedContent,
};
