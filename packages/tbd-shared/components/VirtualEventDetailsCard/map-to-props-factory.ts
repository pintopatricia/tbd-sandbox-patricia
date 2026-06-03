import { MapStateToPropsFactory } from "react-redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { getVirtualSportByURN } from "@ppb/tbd-store/state/entities/virtual-sport/virtual-sport-selectors";
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { VirtualEventDetailsCards } from "@ppb/tbd-store/state/layout/cards/Card.types";
import { VirtualEvent } from "@ppb/tbd-store/state/entities/virtual-event/VirtualEvent.types";
import URN from "@ppb/tbd-store/state/layout/URN";
import { createVirtualEventByURNSelector } from "@ppb/tbd-store/state/entities/virtual-event/virtual-event-selectors";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { formatTime } from "../../helpers/dates";

export type ContainerProps = { urn: string };

export enum VirtualEventKind {
  Racing,
  Football,
}

export type RacingCardProps = {
  kind: VirtualEventKind.Racing;
  startTime: string;
  name: string;
  venue: string;
  showMeetingInfo?: boolean;
  distance?: string;
};

export type FootballCardProps = {
  kind: VirtualEventKind.Football;
  home: string;
  away: string;
};

export type CardProps = RacingCardProps | FootballCardProps;

export type StateProps = CardProps | Record<string, never>;

const TEAMS_SEPARATOR = " v ";

const mapTeamsFromVirtualEvent = (virtualEvent: VirtualEvent): Pick<FootballCardProps, "home" | "away"> => {
  const [home, away] = virtualEvent.name.split(TEAMS_SEPARATOR);

  return home && away ? { home, away } : { home: "", away: "" };
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getVirtualEventDetailsCardByURN = createCardByURNSelector<VirtualEventDetailsCards, URN>();
  const getUserDetails = createGetCountryLocalCurrencyCodeSelector();
  const getVirtualEventByURN = createVirtualEventByURNSelector();

  return function mapStateToProps(state: ApplicationState, { urn }: ContainerProps): StateProps {
    const virtualEventDetailsCard = getVirtualEventDetailsCardByURN(state.layouts.cards.virtualeventdetails, urn);
    const { localeCodeBcp47, timezone } = getUserDetails(state);

    if (!virtualEventDetailsCard) {
      return {};
    }

    const { virtualEvent: virtualEventURN } = virtualEventDetailsCard;
    const virtualEvent = getVirtualEventByURN(state.entities.virtualevents, virtualEventURN);

    if (!virtualEvent) {
      return {};
    }

    const { openDate, venue, name, sport, distance } = virtualEvent;
    const virtualSport = getVirtualSportByURN(state.entities.virtualsports, sport);

    if (!virtualSport) {
      return {};
    }

    const { kind } = virtualSport;
    const startTime = formatTime(openDate, localeCodeBcp47, timezone);

    if (kind === "FOOTBALL") {
      return {
        kind: VirtualEventKind.Football,
        ...mapTeamsFromVirtualEvent(virtualEvent),
      };
    }

    if (kind === "RACING") {
      return {
        kind: VirtualEventKind.Racing,
        startTime,
        name,
        venue: venue === null ? "" : venue,
        showMeetingInfo: true,
        distance: distance === null ? undefined : distance,
      };
    }

    return {};
  };
};

export type DispatchProps = Record<string, never>;

export const mapDispatchToProps: DispatchProps = {};
