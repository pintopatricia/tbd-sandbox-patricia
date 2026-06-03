import { MapStateToPropsFactory } from "react-redux";
import { FetchCardsFromListAction, FETCH_CARDS_FROM_LIST } from "@ppb/tbd-store/actions/catalogue";
import URN from "@ppb/tbd-store/state/layout/URN";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { PartialItem } from "@ppb/tbd-store/state/layout/views/PartialItem.types";
import { createCardGroupByURNSelector } from "@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors";
import {
  FutureRacingCardGroupPartialItem,
  FutureRacingCardGroups,
} from "@ppb/tbd-store/state/layout/cardgroups/future-racing-cardgroups/FutureRacingCardgroups.types";
import { CardItemProps, createFutureRacingViewModel } from "../../../view-model-factories/future-racing-grouping";

export type CardProps = {
  urn: URN;
  urnList: FutureRacingCardGroupPartialItem[];
  items: CardItemProps[];
};

export type ContainerProps = {
  urn: URN;
  visible?: boolean;
};

export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getFutureRacingCardGroupByURN = createCardGroupByURNSelector<FutureRacingCardGroups, URN>();
  const getUserDetailsSelector = createGetCountryLocalCurrencyCodeSelector();
  const groupItemsByDate = createFutureRacingViewModel();

  return function mapStateToProps(state: ApplicationState, { urn }: ContainerProps): StateProps {
    const futureRacingCard = getFutureRacingCardGroupByURN(state.layouts.cardgroups.futureracingcardgroups, urn);

    if (!futureRacingCard) {
      return {};
    }

    const userDetails = <UserDetails>getUserDetailsSelector(state);
    const groupItems = groupItemsByDate(futureRacingCard, userDetails);

    if (!groupItems) {
      return {};
    }

    const { urnList, cardItems } = groupItems;

    return {
      urn,
      urnList,
      items: cardItems,
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

export type DispatchProps = {
  dispatchFetchCards: typeof dispatchFetchCards;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchFetchCards,
};
