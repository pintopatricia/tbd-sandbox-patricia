import { MapStateToPropsFactory } from "react-redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import URN from "@ppb/tbd-store/state/layout/URN";
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { PackagedCreatedBetsCards } from "@ppb/tbd-store/state/layout/cards/Card.types";
import { PackagedLayoutType } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import { FETCH_CARDS, FetchCardsAction, createGetThrottleSelector } from "@ppb/tbd-store";
import { createViewTypeSelector } from "@ppb/tbd-store/state/layout/layout-selectors";
import { getLayoutMetadata } from "@ppb/tbd-store/state/layout-snapshot";

export type ContainerProps = {
  urn: URN;
  visible?: boolean;
};

export type CardProps = {
  title?: string;
  layoutType: PackagedLayoutType;
  favouriteMarketsStateURN?: URN;
  items: string[];
  cursor?: string;
  hasNextPage: boolean;
  hasMoreItems: boolean;
  cardUrn: URN;
  pageType: string | null;
  tabName: string | undefined;
  refreshEnabled: boolean;
};

export const OPPORTUNITIES_INITIAL_PAGE_SIZE = 4;
export const OPPORTUNITIES_PAGE_SIZE = 20;
export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getPackagedCreatedBetsCardByURN = createCardByURNSelector<PackagedCreatedBetsCards, URN>();
  const getViewTypeSelector = createViewTypeSelector();
  const getThrottleSelector = createGetThrottleSelector();

  return function mapStateToProps(state: ApplicationState, { urn }: ContainerProps): StateProps {
    const card = getPackagedCreatedBetsCardByURN(state.layouts.cards.packagedcreatedbets, urn);
    const pageType = getViewTypeSelector(state);
    const refreshEnabled = !!getThrottleSelector(state.entities.throttles, "PACKAGED_CREATED_BETS_CARD")?.isActive;

    if (!card || !card.layout) {
      return {};
    }

    const title = card.displayName?.name || undefined;
    const { tabName } = getLayoutMetadata(urn);

    return {
      title,
      layoutType: card.layout,
      favouriteMarketsStateURN: card.favouriteMarketsStateURN,
      items: card.items.map((item) => item.urn),
      cursor: card.endCursor,
      hasNextPage: card.hasNextPage,
      hasMoreItems: card.items.length > OPPORTUNITIES_INITIAL_PAGE_SIZE || card.hasNextPage,
      cardUrn: urn,
      pageType,
      tabName,
      refreshEnabled,
    };
  };
};

const dispatchFetchCards = (urn: string, cursor?: string): FetchCardsAction => ({
  type: FETCH_CARDS,
  payload: {
    urns: [urn],
    forceRefresh: true,
    first: OPPORTUNITIES_PAGE_SIZE,
    cursor,
  },
});

const dispatchRefreshCards = (urn: string, first?: number): FetchCardsAction => ({
  type: FETCH_CARDS,
  payload: {
    urns: [urn],
    forceRefresh: true,
    forceRefreshComponent: true,
    first,
  },
});

export type DispatchProps = {
  dispatchFetchCards: typeof dispatchFetchCards;
  dispatchRefreshCards: typeof dispatchRefreshCards;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchFetchCards,
  dispatchRefreshCards,
};
