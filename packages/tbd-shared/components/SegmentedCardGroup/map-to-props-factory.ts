import { MapStateToPropsFactory } from "react-redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import URN from "@ppb/tbd-store/state/layout/URN";
import { createCardGroupByURNSelector } from "@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors";
import { PartialItem } from "@ppb/tbd-store/state/layout/views/PartialItem.types";
import { FETCH_CARDS_FROM_LIST, FetchCardsFromListAction } from "@ppb/tbd-store/actions/catalogue";
import { SegmentedCardGroups } from "@ppb/tbd-store/state/layout/cardgroups/CardGroup.types";

export type ContainerProps = {
  urn: string;
};

export type CardProps = {
  segmentedCardGroupUrn: string;
  zones: PartialItem[];
};

export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () =>
  function mapStateToProps(state: ApplicationState, { urn }: ContainerProps): StateProps {
    const getSegmentedCardByURN = createCardGroupByURNSelector<SegmentedCardGroups, URN>();

    const segmentedCard = getSegmentedCardByURN(state.layouts.cardgroups.segmentedcardgroups, urn);
    if (!segmentedCard) {
      return {};
    }

    return {
      segmentedCardGroupUrn: urn,
      zones: segmentedCard.items,
    };
  };

const dispatchFetchCards = (urn: string, partials: PartialItem[]): FetchCardsFromListAction => ({
  type: FETCH_CARDS_FROM_LIST,
  payload: {
    urn,
    partials,
  },
});

export type DispatchProps = {
  dispatchFetchCards: typeof dispatchFetchCards;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchFetchCards,
};
