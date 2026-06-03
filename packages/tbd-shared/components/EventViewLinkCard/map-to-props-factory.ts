import { MapStateToPropsFactory } from "react-redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import {
  getEventViewLink,
  EventLink,
} from "@ppb/tbd-store/state/layout/cards/event-viewlinks/event-view-link-cards-selectors";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import { PushAction, PUSH } from "@ppb/tbd-store/actions/router";
import { NavigateToEventFromSport, UI__NAVIGATE_TO_EVENT_FROM_SPORT } from "@ppb/tbd-store/actions/navigation";
import URN from "@ppb/tbd-store/state/layout/URN";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { formatDate, formatTime } from "../../helpers/dates";
import { i18n } from "../../helpers/i18n";
import { SecondaryEventCardProps } from "./snowflakes/SecondaryEventCard/SecondaryEventCard.types";

export type ContainerProps = {
  urn: string;
};

export type CardProps = {
  viewlink: SecondaryEventCardProps;
  sportEventURN: URN;
  fixtureURN?: URN;
};

export type StateProps = CardProps | Record<string, never>;

const createSecondaryEventCardInfo = (viewlink: EventLink, userDetails: UserDetails): SecondaryEventCardProps => {
  let dateStr: string | undefined;
  let dateTimeStr: string | undefined;
  let startTimeStr: string | undefined;

  const { localeCodeBcp47, timezone } = userDetails;

  if (viewlink.scheduledAt || viewlink.startedAt) {
    const date = viewlink.inplay ? viewlink.startedAt : viewlink.scheduledAt;

    if (date) {
      try {
        dateTimeStr = date.toString();
        dateStr = formatDate(date, localeCodeBcp47, timezone);
        startTimeStr = formatTime(date, localeCodeBcp47, timezone);
      } catch (e) {
        console.error(e);
      }
    }
  }

  return {
    urn: viewlink.urn,
    viewLink: viewlink.viewLink,
    runnerNameHome: viewlink?.home?.name || viewlink.eventName,
    runnerNameAway: viewlink?.away?.name || "",
    inplay: viewlink.inplay ? i18n({ key: "I18N.SPORT_EVENT.IN_PLAY" }) : "",
    ...(dateStr ? { date: dateStr } : {}),
    ...(dateTimeStr ? { dateTime: dateTimeStr } : {}),
    ...(startTimeStr ? { startTime: startTimeStr } : {}),
  };
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getUserDetailsSelector = createGetCountryLocalCurrencyCodeSelector();

  return function mapStateToProps(state: ApplicationState, { urn }: ContainerProps): StateProps {
    const viewlink = getEventViewLink(state, urn);

    if (!viewlink) {
      return {};
    }
    const userDetails = <UserDetails>getUserDetailsSelector(state);

    const event = createSecondaryEventCardInfo(viewlink, userDetails);

    return {
      viewlink: event,
      fixtureURN: viewlink.fixtureURN,
      sportEventURN: viewlink.sportEventURN,
    };
  };
};

const dispatchClickCard = (
  cardUrn: URN,
  sportEventURN: URN,
  viewUrl: string,
  fixtureURN?: URN,
): NavigateToEventFromSport => ({
  type: UI__NAVIGATE_TO_EVENT_FROM_SPORT,
  payload: {
    cardUrn,
    fixtureURN,
    sportEventURN,
    href: viewUrl,
    type: "secondary swimlane",
  },
});

const dispatchPushAction = (viewLink: ViewLink): PushAction => ({
  type: PUSH,
  payload: viewLink,
});

export type DispatchProps = {
  dispatchClickCard: typeof dispatchClickCard;
  dispatchPushAction: typeof dispatchPushAction;
};

export const mapDispatchToProps: DispatchProps = { dispatchClickCard, dispatchPushAction };
