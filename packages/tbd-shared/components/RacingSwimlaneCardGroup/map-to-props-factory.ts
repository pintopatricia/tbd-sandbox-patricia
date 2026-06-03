import type { MapStateToPropsFactory } from "react-redux";
import { PUSH, type PushAction } from "@ppb/tbd-store/actions/router";
import type { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import {
  FETCH_CARDS,
  FETCH_CARDS_FROM_LIST,
  FetchCardsAction,
  type FetchCardsFromListAction,
} from "@ppb/tbd-store/actions/catalogue";
import { UI__CARDGROUP_VIEW_ALL_LINK_TAP, type CardGroupViewAllLinkTapAction } from "@ppb/tbd-store/actions/navigation";
import type URN from "@ppb/tbd-store/state/layout/URN";
import type { RacingSwimlaneCardGroups } from "@ppb/tbd-store/state/layout/cardgroups/CardGroup.types";
import type { PartialItem } from "@ppb/tbd-store/state/layout/views/PartialItem.types";
import type { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import type { ViewAllLink } from "@ppb/tbd-store/state/layout/views/ViewAll.types";
import { createCardGroupByURNSelector } from "@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors";

export type ContainerProps = {
  urn: URN;
  visible?: boolean;
};

export type CardProps = {
  title?: string;
  items: PartialItem[];
  cardgroupURN: URN;
  viewAll?: ViewAllLink;
};

export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getSwimlaneCardGroupByURN = createCardGroupByURNSelector<RacingSwimlaneCardGroups, URN>();

  return function mapStateToProps(state: ApplicationState, { urn: cardgroupURN }: ContainerProps): StateProps {
    const cardgroup = getSwimlaneCardGroupByURN(state.layouts.cardgroups.racingswimlanecardgroups, cardgroupURN);

    if (!cardgroup || !cardgroup.items?.length) {
      return {};
    }

    return {
      title: cardgroup.title,
      items: cardgroup.items,
      cardgroupURN,
      viewAll: cardgroup.viewAll,
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

const dispatchFetchCardsAction = (urn: URN): FetchCardsAction => ({
  type: FETCH_CARDS,
  payload: {
    urns: [urn],
    forceRefresh: true,
  },
});

const dispatchPushAction = (viewLink: ViewLink): PushAction => ({
  type: PUSH,
  payload: viewLink,
});

const dispatchViewAllTap = ({
  title,
  viewAll,
  cardgroupURN,
}: {
  title?: string;
  viewAll: ViewAllLink;
  cardgroupURN: URN;
}): CardGroupViewAllLinkTapAction => ({
  type: UI__CARDGROUP_VIEW_ALL_LINK_TAP,
  payload: {
    title: title || "",
    viewAllLink: viewAll,
    cardgroupURN,
  },
});

export type DispatchProps = {
  dispatchPushAction: typeof dispatchPushAction;
  dispatchViewAllTap: typeof dispatchViewAllTap;
  dispatchFetchCards: typeof dispatchFetchCards;
  dispatchFetchCardsAction: typeof dispatchFetchCardsAction;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchPushAction,
  dispatchViewAllTap,
  dispatchFetchCards,
  dispatchFetchCardsAction,
};
