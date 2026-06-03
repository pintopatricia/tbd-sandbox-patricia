import { MapStateToPropsFactory } from "react-redux";

import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { Jurisdiction, RaceStatus } from "@ppb/tbd-store/state/constants";
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { RaceDetailsCards } from "@ppb/tbd-store/state/layout/cards/Card.types";
import { EntityType } from "@ppb/tbd-urn-codecs";
import URN from "@ppb/tbd-store/state/layout/URN";
import { createRaceByURNSelector } from "@ppb/tbd-store/state/entities/races/race-selectors";
import { createMeetingByURNSelector } from "@ppb/tbd-store/state/entities/meetings/meeting-selectors";
import { RaceDetailsProps } from "@ppb/the-wall-common/types";
import {
  SUBSCRIBE_RACE_UPDATES,
  SubscribeRaceUpdatesAction,
  UNSUBSCRIBE_RACE_UPDATES,
  UnsubscribeRaceUpdatesAction,
} from "@ppb/tbd-store/actions/race";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import { PUSH, PushAction } from "@ppb/tbd-store/actions/router";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { CountryCode, UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import type { PartialItem } from "@ppb/tbd-store/state/layout/views/PartialItem.types";

import { i18n } from "../../helpers/i18n";
import { TranslationKey } from "../../translations/keys";
import { formatDateWithToday, formatTime } from "../../helpers/dates";
import { isRaceRunningStatus } from "../../helpers/race";

export type ContainerProps = {
  urn: string;
  visible?: boolean;
} & Pick<PartialItem, "theme">;

export type CardProps = {
  raceURN: string;
  stickyOnScroll: boolean;
  raceStatus?: RaceStatus;
  viewLink: ViewLink | null;
  availableToSubscribe: boolean;
} & RaceDetailsProps;

export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getRaceDetailsCardByURN = createCardByURNSelector<RaceDetailsCards, URN>();
  const getRaceByURN = createRaceByURNSelector();
  const getMeetingByURN = createMeetingByURNSelector();
  const getUserDetailsSelector = createGetCountryLocalCurrencyCodeSelector();

  return function mapStateToProps(state: ApplicationState, { urn, theme }: ContainerProps): StateProps {
    const raceDetailsCard = getRaceDetailsCardByURN(state.layouts.cards.racedetails, urn);

    if (!raceDetailsCard) {
      return {};
    }

    const { localeCodeBcp47, timezone, jurisdiction, countryCode } = <UserDetails>getUserDetailsSelector(state);

    const {
      race: raceURN,
      numberOfRunners,
      showMeetingInfo,
      raceViewLink,
      availableToSubscribe,
      raceClass: raceClassNumber,
    } = raceDetailsCard;
    const {
      details: raceDetails,
      startTime,
      name: raceName,
      meeting: meetingURN,
    } = getRaceByURN(state.entities.races, raceURN);
    const meeting = getMeetingByURN(state.entities.meetings, meetingURN);
    const raceTime = formatTime(startTime, localeCodeBcp47, timezone);
    const dateTime = new Date(startTime);
    const raceStatus = raceDetails?.status;
    const raceStatusLabel =
      raceStatus && raceStatus !== RaceStatus.DORMANT
        ? i18n({ key: `I18N.RACE_STATUS.${raceStatus}` as keyof TranslationKey })
        : undefined;
    const runnersLabel = i18n({ key: "I18N.LABELS.RUNNERS" });
    const trackGoing =
      raceDetails?.going && i18n({ key: `I18N.RACE_GOING.${raceDetails.going}` as keyof TranslationKey });
    const isMyBetsView = state.router.currentView === EntityType.MyBetsView;

    const raceClass = raceClassNumber ? `${i18n({ key: "I18N.LABELS.CLASS" })} ${raceClassNumber}` : undefined;

    // Only populate raceDetailesTitle if in UNITED_KINGDOM, this is because the title is not translated in SCA
    const raceDetailsTitle =
      (countryCode === CountryCode.UNITED_KINGDOM || countryCode === CountryCode.IRELAND) && raceDetails
        ? raceDetails.raceDetailsTitle
        : undefined;

    return {
      countryFlag: meeting.countryFlag,
      meetingName: meeting.venue,
      raceTime,
      showDuration: jurisdiction.jurisdiction === Jurisdiction.BRAZIL,
      date: formatDateWithToday(dateTime, localeCodeBcp47, timezone),
      dateTime,
      raceName,
      raceStatus,
      raceStatusLabel,
      numberOfRunners,
      raceClass,
      isRaceRunningStatus: isRaceRunningStatus(raceDetails?.status),
      raceDetailsTitle,
      runnersLabel,
      trackGoing,
      stickyOnScroll: !isMyBetsView,
      raceURN,
      showMeetingInfo,
      viewLink: raceViewLink,
      availableToSubscribe,
      isHighlighted: theme === "HIGHLIGHTED",
    };
  };
};

const dispatchSubscribeRaceUpdates = (raceUrn: URN): SubscribeRaceUpdatesAction => ({
  type: SUBSCRIBE_RACE_UPDATES,
  payload: { urn: raceUrn },
});

const dispatchUnsubscribeRaceUpdates = (raceUrn: URN): UnsubscribeRaceUpdatesAction => ({
  type: UNSUBSCRIBE_RACE_UPDATES,
  payload: { urn: raceUrn },
});

const dispatchPushAction = (viewLink: ViewLink): PushAction => ({
  type: PUSH,
  payload: viewLink,
});

export type DispatchProps = {
  dispatchSubscribeRaceUpdates: typeof dispatchSubscribeRaceUpdates;
  dispatchUnsubscribeRaceUpdates: typeof dispatchUnsubscribeRaceUpdates;
  dispatchPushAction: typeof dispatchPushAction;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchSubscribeRaceUpdates,
  dispatchUnsubscribeRaceUpdates,
  dispatchPushAction,
};
