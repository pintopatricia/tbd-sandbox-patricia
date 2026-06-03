import { MapStateToPropsFactory } from "react-redux";
import { createSelector } from "reselect";

import { ApplicationState, FETCH_CARDS, FetchCardsAction, PUSH, PushAction, SportsbookMarket } from "@ppb/tbd-store";
import { PebbleItemSelectionAction, UI__CLICK_PEBBLE_ITEM } from "@ppb/tbd-store/actions/interface";
import { MarketFlags } from "@ppb/tbd-store/middlewares/tagging-resolvers/AnalyticsConstants";
import URN from "@ppb/tbd-store/state/layout/URN";
import { PebbleCardEdge } from "@ppb/tbd-store/state/layout/cardgroups/CardGroup.types";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import { PebbleCardGroupIcon } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import { ValueIconName } from "@ppb/the-wall-icons";
import { Icons } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import {
  createGetSelectedPebbleSportsbookMarketsSelector,
  createGetHydratedPebbleCardGroupByURNSelector,
  createPartialPebbleCardGroupByURNSelector,
} from "@ppb/tbd-store/state/layout/cardgroups/pebble-cardgroups/pebble-cardgroups-selectors";
import { createViewTypeSelector } from "@ppb/tbd-store/state/layout/layout-selectors";
import { getLayoutMetadata } from "@ppb/tbd-store/state/layout-snapshot";

import { buildTranslatableText } from "../../helpers/translatable-text";

type PebbleListItem = {
  id: string;
  text: string;
  typename: string;
};

export type ContainerProps = {
  urn: URN;
  visible?: boolean;
};

export type HydratedCardProps = {
  isShell: false;
  title?: string;
  icon?: Icons;
  outerTitle?: string;
  viewLink?: ViewLink;
  viewAllLabel?: string;
  pebbleExpanded: boolean;
  favouriteMarketsStateURN?: URN;
  items: PebbleListItem[];
  pebbleList: PebbleListItem[];
  selectedCardURN: URN;
  selectedCardTypename?: string;
  cardGroupURN: URN;
  pageType: string | null;
  gaTitle?: string;
  tabName?: string;
};

export type ShellCardProps = {
  isShell: true;
  title: string;
  favouriteMarketsStateURN?: URN;
  cardGroupURN: URN;
};

export type CardProps = HydratedCardProps | ShellCardProps;

export type StateProps = CardProps | Record<string, never>;

const getGaTitle = (
  translatedTitle: string | undefined,
  selectedPebbleSportsbookMarkets: SportsbookMarket[],
): string | undefined => {
  const hasSelectedPebbleSuperSub = selectedPebbleSportsbookMarkets.some(({ isSuperSub }): boolean => isSuperSub);
  const gaTitleSuffix = hasSelectedPebbleSuperSub ? MarketFlags.SUPER_SUB : "";

  return `${translatedTitle} ${gaTitleSuffix}`.trim();
};

const createPebbleList = () =>
  createSelector([(edges: PebbleCardEdge[]) => edges], (edges: PebbleCardEdge[]): PebbleListItem[] =>
    edges.map((item) => ({ id: item.urn, text: item.name || "", typename: item.typename })),
  );

const getBoostedIconName = (boostedIcon: PebbleCardGroupIcon | undefined) => {
  if (!boostedIcon) {
    return undefined;
  }

  switch (boostedIcon) {
    case PebbleCardGroupIcon.SuperBoost:
      return ValueIconName.SUPER_BOOST;
    case PebbleCardGroupIcon.DoubleUpBoost:
      return ValueIconName.DOUBLE_UP_BOOST;
    default:
      return ValueIconName.PRICE_BOOST;
  }
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getHydratedPebbleCardGroupByURN = createGetHydratedPebbleCardGroupByURNSelector();
  const getPartialPebbleCardGroupByURN = createPartialPebbleCardGroupByURNSelector();
  const getPebbleList = createPebbleList();
  const getViewTypeSelector = createViewTypeSelector();
  const getSelectedPebbleSportsbookMarkets = createGetSelectedPebbleSportsbookMarketsSelector();

  return function mapStateToProps(state: ApplicationState, { urn }: ContainerProps): StateProps {
    const pebbleCardGroup = getHydratedPebbleCardGroupByURN(state.layouts.cardgroups.pebblecardgroups, urn);
    const partialPebbleCardGroup = getPartialPebbleCardGroupByURN(state.layouts.cardgroups.pebblecardgroups, urn);
    const pageType = getViewTypeSelector(state);

    if (
      (!pebbleCardGroup && !partialPebbleCardGroup) ||
      // when partial card group is expanded, return an empty object so shell is rendered only when collapsed.
      partialPebbleCardGroup?.pebbleExpanded
    ) {
      return {};
    }

    if (!pebbleCardGroup && partialPebbleCardGroup) {
      const { title, favouriteMarketsStateURN } = partialPebbleCardGroup;
      const translatedTitle = buildTranslatableText(title);

      if (!translatedTitle) return {};

      return {
        isShell: true,
        title: translatedTitle,
        favouriteMarketsStateURN,
        cardGroupURN: urn,
      };
    }

    if (!pebbleCardGroup?.items.length) return {};

    const { title, icon, pebbleExpanded, items, favouriteMarketsStateURN, selectedItemUrn, outerTitle, viewAll } =
      pebbleCardGroup;
    const typename = items.find((item) => item.urn === selectedItemUrn)?.typename;
    const pebbleList = getPebbleList(items);
    const translatedTitle = buildTranslatableText(title);
    const { tabName } = getLayoutMetadata(urn);
    const selectedPebbleSportsbookMarkets = getSelectedPebbleSportsbookMarkets(state, selectedItemUrn);

    return {
      isShell: false,
      title: translatedTitle,
      icon: getBoostedIconName(icon),
      outerTitle: buildTranslatableText(outerTitle),
      viewLink: viewAll?.viewLink,
      viewAllLabel: viewAll?.label,
      pebbleExpanded,
      favouriteMarketsStateURN,
      items: pebbleList,
      pebbleList: pebbleList.length === 1 && pebbleList[0].text === translatedTitle ? [] : pebbleList,
      selectedCardURN: selectedItemUrn,
      selectedCardTypename: typename,
      cardGroupURN: urn,
      pageType,
      gaTitle: getGaTitle(translatedTitle, selectedPebbleSportsbookMarkets),
      tabName,
    };
  };
};

const dispatchPebbleItemSelection = (
  pebbleURN: URN,
  pebbleTypename: string,
  cardGroupURN: URN,
): PebbleItemSelectionAction => ({
  type: UI__CLICK_PEBBLE_ITEM,
  payload: {
    cardGroupURN,
    pebbleURN,
    pebbleTypename,
  },
});

const dispatchPushAction = (viewLink: ViewLink): PushAction => ({
  type: PUSH,
  payload: viewLink,
});

const dispatchFetchCardsAction = (urn: URN): FetchCardsAction => ({
  type: FETCH_CARDS,
  payload: {
    urns: [urn],
  },
});

export type DispatchProps = {
  dispatchPebbleItemSelection: typeof dispatchPebbleItemSelection;
  dispatchPushAction: typeof dispatchPushAction;
  dispatchFetchCardsAction: typeof dispatchFetchCardsAction;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchPebbleItemSelection,
  dispatchPushAction,
  dispatchFetchCardsAction,
};
