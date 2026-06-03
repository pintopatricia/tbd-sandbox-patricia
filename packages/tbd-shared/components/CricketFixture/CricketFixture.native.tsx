import { memo, FunctionComponent, ReactElement } from "react";
import { View } from "react-native";

import { AvBFixture as CricketFixtureComponent, AvBScoreboard } from "@ppb/the-wall-native";
import { ScoreboardViewMode, ScoreData } from "@ppb/the-wall-common/types";
import { SportsIconName, SystemIconName } from "@ppb/the-wall-icons";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { GenericIcon, type GenericIconProps, Icons } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";

import { ComponentProps } from "./props";
import { formatCouponViewScoreData, isCricketFixtureEqual } from "./CricketFixture.helper";
import { CRICKET_FIXTURE } from "./CricketFixture.native.selectors";

/**
 * Function component that wraps the connected cricket fixture component
 *
 * @param competition The fixture competition
 * @param date Sport event scheduled date
 * @param dateTime Sport event scheduled datetime
 * @param icon Sport icon
 * @param matchStatus Status of the match
 * @param cricketScoreData Scoreboard data
 * @param showBottomSeparator show bottom Separator flag
 * @param showEventDateBelow Shows the date and time of the event below the team names
 * @param teamA Team name
 * @param teamB Team name
 * @param teamServing Team serving
 * @param time Sport event scheduled time
 * @param viewMode Fixture view mode
 * @param notificationsSubscription Notifications subscription
 * @returns CricketFixture component
 */
const CricketFixture: FunctionComponent<ComponentProps> = ({
  competition,
  event,
  date,
  dateTime,
  icon = SportsIconName.CRICKET,
  matchStatus,
  cricketScoreData,
  showBottomSeparator,
  showEventDateBelow,
  teamA,
  teamB,
  teamServing,
  time,
  viewMode = ScoreboardViewMode.DEFAULT,
  notificationsSubscription,
  videoAvailable,
  labels,
  showHorizontalDuration,
}) => {
  const hasCricketScoreData = cricketScoreData !== undefined;
  let formattedScoreData: ScoreData[] | undefined;
  let competitionIcon: Icons | undefined;
  let competitionLabel: string | undefined;
  let notificationsSubscriptionIcon: ReactElement<GenericIconProps, typeof GenericIcon> | undefined;

  if (viewMode === ScoreboardViewMode.COUPON) {
    formattedScoreData = hasCricketScoreData ? formatCouponViewScoreData(cricketScoreData, matchStatus) : undefined;
  } else {
    formattedScoreData = hasCricketScoreData ? cricketScoreData.scoreData : undefined;
    competitionIcon = icon;
    competitionLabel = competition;
    notificationsSubscriptionIcon =
      notificationsSubscription && viewMode === ScoreboardViewMode.DEFAULT ? (
        <GenericIcon name={SystemIconName.NOTIFICATION_OFF} />
      ) : undefined;
  }

  return (
    <View {...getTestProps(CRICKET_FIXTURE, false)}>
      <CricketFixtureComponent
        icon={competitionIcon}
        competitionLabel={competitionLabel}
        viewMode={viewMode}
        showBottomSeparator={showBottomSeparator}
        notificationsSubscription={notificationsSubscriptionIcon}
      >
        <AvBScoreboard
          eventName={event}
          teamA={teamA}
          teamB={teamB}
          matchStatus={matchStatus}
          viewMode={viewMode}
          scoreData={formattedScoreData}
          date={date}
          dateTime={dateTime}
          teamServing={teamServing}
          time={time}
          liveVideo={videoAvailable}
          inplayLabel={labels.inplay}
          showEventDateBelow={showEventDateBelow}
          showHorizontalDuration={showHorizontalDuration}
        />
      </CricketFixtureComponent>
    </View>
  );
};

export default memo(CricketFixture, isCricketFixtureEqual);
