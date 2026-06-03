import { MapStateToPropsFactory } from "react-redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { FETCH_CARDS_FROM_LIST, FetchCardsFromListAction } from "@ppb/tbd-store/actions/catalogue";
import URN from "@ppb/tbd-store/state/layout/URN";
import { PartialItem } from "@ppb/tbd-store/state/layout/views/PartialItem.types";
import { ToggleExpandableCardGroupAction, UI__TOGGLE_EXPANDABLE_CARDGROUP } from "@ppb/tbd-store/actions/interface";
import { createCardGroupByURNSelector } from "@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors";
import { ExpandableCardGroups } from "@ppb/tbd-store/state/layout/cardgroups/CardGroup.types";

export type ContainerProps = {
  urn: URN;
  isSegmented?: boolean;
};

export type CardProps = {
  items: PartialItem[];
  title?: string;
  isExpanded?: boolean;
  isExpandable?: boolean;
} & ContainerProps;

export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getExpandableCardGroupByURN = createCardGroupByURNSelector<ExpandableCardGroups, URN>();

  return function mapStateToProps(state: ApplicationState, { urn }: ContainerProps): StateProps {
    const expandablecardgroup = getExpandableCardGroupByURN(state.layouts.cardgroups.expandablecardgroups, urn);

    if (!expandablecardgroup) {
      return {};
    }

    return {
      urn,
      title: expandablecardgroup.title,
      items: expandablecardgroup.items || [],
      isExpanded: expandablecardgroup.isExpanded,
      isExpandable: expandablecardgroup.isExpandable,
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

const dispatchExpandableCardGroupToggle = (
  isExpanded: boolean,
  urn: URN,
  title?: string,
): ToggleExpandableCardGroupAction => ({
  type: UI__TOGGLE_EXPANDABLE_CARDGROUP,
  payload: { isExpanded, urn, title },
});

export type DispatchProps = {
  dispatchFetchCards: typeof dispatchFetchCards;
  dispatchExpandableCardGroupToggle: typeof dispatchExpandableCardGroupToggle;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchFetchCards,
  dispatchExpandableCardGroupToggle,
};
