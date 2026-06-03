import { MapStateToPropsFactory } from "react-redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { RaceViewLinkCards } from "@ppb/tbd-store/state/layout/cards/Card.types";
import URN from "@ppb/tbd-store/state/layout/URN";
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { createRaceByURNSelector } from "@ppb/tbd-store/state/entities/races/race-selectors";
import { createMeetingByURNSelector } from "@ppb/tbd-store/state/entities/meetings/meeting-selectors";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import { PUSH, PushAction } from "@ppb/tbd-store/actions/router";

export type ContainerProps = { urn: string };

export type RaceViewLinkCardProps = {
  venue: string;
  countryFlag?: {
    small?: string;
    medium?: string;
    large?: string;
  };
  viewLink: ViewLink;
};

export type StateProps = RaceViewLinkCardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getRaceViewLinkCardbyURN = createCardByURNSelector<RaceViewLinkCards, URN>();
  const getRaceByURN = createRaceByURNSelector();
  const getMeetingByURN = createMeetingByURNSelector();

  return function mapStateToProps(state: ApplicationState, { urn }: ContainerProps): StateProps {
    const card = getRaceViewLinkCardbyURN(state.layouts.cards.raceviewlink, urn);

    if (!card) {
      return {};
    }

    const { race: raceURN, viewLink } = card;
    const { meeting: meetingURN } = getRaceByURN(state.entities.races, raceURN);
    const { countryFlag, venue } = getMeetingByURN(state.entities.meetings, meetingURN);

    return {
      venue,
      countryFlag,
      viewLink,
    };
  };
};

const dispatchPushAction = (viewLink: ViewLink): PushAction => ({
  type: PUSH,
  payload: viewLink,
});

export type DispatchProps = {
  dispatchPushAction: typeof dispatchPushAction;
};

export const mapDispatchToProps: DispatchProps = { dispatchPushAction };
