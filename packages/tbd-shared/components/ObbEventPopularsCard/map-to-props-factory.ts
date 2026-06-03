import { MapDispatchToProps, MapStateToPropsFactory } from "react-redux";
import { Dispatch } from "redux";

import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { createObbLegByIdSelector } from "@ppb/tbd-store/state/entities/obb-legs/obb-legs-selector";
import { createObbEventPopularsCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/obb-event-populars-card/obb-event-populars-card-selectors";

import { ContainerProps, DispatchProps, StateProps } from "./ObbEventPopularsCard.props";
import { buildPopularBettingOpportunitiesVm } from "./ObbEventPopularsCard.helpers";
import { FixtureStatus } from "@ppb/tbd-store/state/constants";
import { DELETE_VIEW_ITEMS, DeleteViewItems } from "@ppb/tbd-store";
import { OBB_EVENT_POPULARS_CARD__SHOW_MORE_CLICKED, ObbEventPopularsShowMoreAction } from "@ppb/tbd-store/actions/obb";

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getObbEventPopularsCardByURN = createObbEventPopularsCardByURNSelector();
  const getObbLegById = createObbLegByIdSelector();

  return (state: ApplicationState, { urn }: ContainerProps): StateProps => {
    const obbEventPopularsCard = getObbEventPopularsCardByURN(state, urn);

    if (!obbEventPopularsCard?.popularBettingOpportunities.length) {
      return {};
    }

    const {
      title,
      badgeLabel: badgeText,
      showPopularEvidence,
      showStats,
      numberOfVisibleBettingOpportunities: initialNumberOfVisibleBettingOpportunities,
      sportEvent: { name: eventName },
      popularBettingOpportunities,
      fixture,
    } = obbEventPopularsCard;

    const fixtureStatus = fixture?.fixtureStatus;
    const fixtureScheduledAt = fixture?.scheduledAt;

    const hasEventStarted =
      (!!fixtureStatus && fixtureStatus !== FixtureStatus.PRE_MATCH) ||
      (!!fixtureScheduledAt && fixtureScheduledAt?.getTime() <= Date.now());

    const popularBettingOpportunitiesVm = buildPopularBettingOpportunitiesVm(
      popularBettingOpportunities,
      (legId: string) => getObbLegById(state, legId),
    );

    return {
      title,
      badgeText,
      showPopularEvidence,
      showStats,
      eventName,
      popularBettingOpportunities: popularBettingOpportunitiesVm,
      initialNumberOfVisibleBettingOpportunities,
      hasEventStarted,
    };
  };
};

export type DispatchActions = DeleteViewItems | ObbEventPopularsShowMoreAction;

export const mapDispatchToProps: MapDispatchToProps<DispatchProps, ContainerProps> = (
  dispatch: Dispatch<DispatchActions>,
  { urn }: ContainerProps,
) => ({
  dispatchDeleteObbEventPopularsCard: () =>
    dispatch<DeleteViewItems>({
      type: DELETE_VIEW_ITEMS,
      payload: [urn],
    }),
  dispatchObbEventPopularsCardToggleShowMore: (cardUrn, eventName, showMore) =>
    dispatch<ObbEventPopularsShowMoreAction>({
      type: OBB_EVENT_POPULARS_CARD__SHOW_MORE_CLICKED,
      payload: {
        cardUrn,
        eventName,
        showMore,
      },
    }),
});
