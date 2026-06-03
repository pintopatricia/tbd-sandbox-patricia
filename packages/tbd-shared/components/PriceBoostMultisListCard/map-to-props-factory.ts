import { MapStateToPropsFactory } from "react-redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import URN from "@ppb/tbd-store/state/layout/URN";
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { MarketBlurbInfo, PriceBoostMultisListCards } from "@ppb/tbd-store/state/layout/cards/Card.types";
import { FETCH_CARDS, FetchCardsAction } from "@ppb/tbd-store";
import { createViewTypeSelector } from "@ppb/tbd-store/state/layout/layout-selectors";
import { getLayoutMetadata } from "@ppb/tbd-store/state/layout-snapshot";

export type ContainerProps = {
  urn: URN;
  visible?: boolean;
};

export type CardProps = {
  title?: string;
  blurb: MarketBlurbInfo | null;
  items: string[];
  cursor?: string;
  hasNextPage: boolean;
  hasMoreItems: boolean;
  cardUrn: URN;
  pageType: string | null;
  tabName: string | undefined;
  showWasPrice: boolean;
};

export const OPPORTUNITIES_PAGE_SIZE = 4;
export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getPriceBoostMultisListCardByURN = createCardByURNSelector<PriceBoostMultisListCards, URN>();
  const getViewTypeSelector = createViewTypeSelector();

  return function mapStateToProps(state: ApplicationState, { urn }: ContainerProps): StateProps {
    const card = getPriceBoostMultisListCardByURN(state.layouts.cards.priceboostmultislistcards, urn);

    if (!card) {
      return {};
    }

    const pageType = getViewTypeSelector(state);
    const title = card.displayName?.name || undefined;
    const { tabName } = getLayoutMetadata(urn);

    return {
      title,
      blurb: card.blurb,
      items: card.items.map((item) => item.urn),
      cursor: card.endCursor,
      hasNextPage: card.hasNextPage,
      hasMoreItems: card.items.length > OPPORTUNITIES_PAGE_SIZE || card.hasNextPage,
      cardUrn: urn,
      pageType,
      tabName,
      showWasPrice: card.showWasPrice,
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

export type DispatchProps = {
  dispatchFetchCards: typeof dispatchFetchCards;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchFetchCards,
};
