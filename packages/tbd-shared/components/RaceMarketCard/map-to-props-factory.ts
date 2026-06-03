import { MapStateToPropsFactory } from "react-redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { createRaceByURNSelector } from "@ppb/tbd-store/state/entities/races/race-selectors";
import { createMeetingByURNSelector } from "@ppb/tbd-store/state/entities/meetings/meeting-selectors";
import URN from "@ppb/tbd-store/state/layout/URN";
import { NavigateToView, UI__NAVIGATE_TO_VIEW } from "@ppb/tbd-store/actions/navigation";
import {
  RaceMarketCards,
  RunnerViewLinks,
  DisplayRunners,
  MarketCard,
} from "@ppb/tbd-store/state/layout/cards/Card.types";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import { RaceDetailsProps, type SportsbookMarketProps } from "@ppb/the-wall-common/types";
import { PUSH, PushAction } from "@ppb/tbd-store/actions/router";
import {
  SUBSCRIBE_RACE_UPDATES,
  SubscribeRaceUpdatesAction,
  UNSUBSCRIBE_RACE_UPDATES,
  UnsubscribeRaceUpdatesAction,
} from "@ppb/tbd-store/actions/race";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { RaceStatus } from "@ppb/tbd-store/state/constants";
import { i18n } from "../../helpers/i18n";
import { TranslationKey } from "../../translations/keys";
import { formatTime } from "../../helpers/dates";
import { isRaceRunningStatus } from "../../helpers/race";

export type ContainerProps = { urn: string; visible?: boolean };

export type CardProps = {
  displayRunners: DisplayRunners;
  meetingEntityName: string;
  raceURN: URN;
  raceViewLink: ViewLink;
  runnerViewLinks?: RunnerViewLinks;
  title: string | undefined;
  urn: URN;
  raceStatus?: RaceStatus;
  isRunnerExpandable?: boolean;
} & Omit<RaceDetailsProps, "bellIcon"> &
  Pick<SportsbookMarketProps, "onMarketPromoClick" | "onLinkClick"> &
  Pick<MarketCard, "infoBlurbs" | "marketPromo">;

export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getRaceMarketCardByURN = createCardByURNSelector<RaceMarketCards, URN>();
  const getRaceByURN = createRaceByURNSelector();
  const getMeetingByURN = createMeetingByURNSelector();
  const getUserDetailsSelector = createGetCountryLocalCurrencyCodeSelector();

  return function mapStateToProps(state: ApplicationState, { urn }: ContainerProps): StateProps {
    const raceMarketCard = getRaceMarketCardByURN(state.layouts.cards.racemarkets, urn);
    const { localeCodeBcp47, timezone } = <UserDetails>getUserDetailsSelector(state);

    if (!raceMarketCard) {
      return {};
    }

    const {
      race: raceURN,
      runnerViewLinks,
      raceViewLink = { viewUrn: "", viewUrl: "" },
      numberOfRunners,
      title,
      displayRunners,
      isRunnerExpandable,
      marketPromo,
      infoBlurbs,
    } = raceMarketCard;
    const { details: raceDetails, meeting: meetingURN, startTime, name } = getRaceByURN(state.entities.races, raceURN);
    const { venue: meetingName, countryFlag, entityName } = getMeetingByURN(state.entities.meetings, meetingURN);
    const raceTime = formatTime(startTime, localeCodeBcp47, timezone);
    const runnersLabel = i18n({ key: "I18N.LABELS.RUNNERS" });
    const raceStatusLabel =
      raceDetails?.status && raceDetails.status !== RaceStatus.DORMANT
        ? i18n({ key: `I18N.RACE_STATUS.${raceDetails.status}` as keyof TranslationKey })
        : undefined;

    const trackGoing =
      raceDetails?.going && i18n({ key: `I18N.RACE_GOING.${raceDetails.going}` as keyof TranslationKey });

    return {
      urn,
      title,
      raceViewLink,
      runnerViewLinks,
      raceTime,
      raceURN,
      meetingName,
      countryFlag,
      raceName: name,
      numberOfRunners,
      displayRunners,
      runnersLabel,
      trackGoing,
      raceStatus: raceDetails?.status,
      raceStatusLabel,
      isRaceRunningStatus: isRaceRunningStatus(raceDetails?.status),
      meetingEntityName: entityName,
      showMeetingInfo: true,
      isRunnerExpandable,
      marketPromo,
      infoBlurbs,
    };
  };
};

const dispatchPush = (raceViewLink: ViewLink): PushAction => ({
  type: PUSH,
  payload: raceViewLink,
});

const dispatchSubscribeRaceUpdates = (raceUrn: URN): SubscribeRaceUpdatesAction => ({
  type: SUBSCRIBE_RACE_UPDATES,
  payload: { urn: raceUrn },
});

const dispatchUnsubscribeRaceUpdates = (raceUrn: URN): UnsubscribeRaceUpdatesAction => ({
  type: UNSUBSCRIBE_RACE_UPDATES,
  payload: { urn: raceUrn },
});

const dispatchNavigateToRaceFromRaceDetails = (
  destination: string,
  cardURN: URN,
  meetingName: string,
): NavigateToView => ({
  type: UI__NAVIGATE_TO_VIEW,
  payload: {
    url: destination,
    cardURN,
    label: meetingName,
    module: "primary swimlane",
  },
});

export type DispatchProps = {
  dispatchPush: typeof dispatchPush;
  dispatchSubscribeRaceUpdates: typeof dispatchSubscribeRaceUpdates;
  dispatchUnsubscribeRaceUpdates: typeof dispatchUnsubscribeRaceUpdates;
  dispatchNavigateToRaceFromRaceDetails: typeof dispatchNavigateToRaceFromRaceDetails;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchPush,
  dispatchSubscribeRaceUpdates,
  dispatchUnsubscribeRaceUpdates,
  dispatchNavigateToRaceFromRaceDetails,
};
