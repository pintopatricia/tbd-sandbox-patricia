import React, { FunctionComponent, ReactElement } from "react";
import { View } from "react-native";
import { AvBFixture as DartsFixtureComponent, AvBScoreboard } from "@ppb/the-wall-native";
import { GenericIcon, Icons } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { ScoreboardViewMode, MatchStatus } from "@ppb/the-wall-common/types";
import { SportsIconName, SystemIconName } from "@ppb/the-wall-icons";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { ComponentProps } from "./props";
import { isDartsFixtureEqual, formatCouponScoreBoardData } from "./DartsFixture.helper";
import { DARTS_FIXTURE } from "./DartsFixture.native.selectors";

/**
 * Function component that wraps the connected darts fixture component
 *
 * @param competition - The competition name
 * @param event - The event name
 * @param date - The event date string
 * @param dateTime - The event date as Date object
 * @param icon - The competition icon
 * @param matchStatus - The current match status
 * @param scoreData - The array of score data
 * @param showBottomSeparator - Whether to show bottom separator
 * @param showEventDateBelow - Whether to show event date below
 * @param showHorizontalDuration - Whether to show horizontal duration
 * @param teamA - Team A details
 * @param teamB - Team B details
 * @param time - The event time string
 * @param viewMode - The scoreboard view mode
 * @param videoAvailable - Whether video is available
 * @param labels - Labels for the fixture
 * @param currentSet - The current set details
 */
const DartsFixture: FunctionComponent<ComponentProps> = ({
  competition,
  event,
  date,
  dateTime,
  icon = SportsIconName.DARTS,
  matchStatus,
  notificationsSubscription,
  scoreData,
  showBottomSeparator,
  showEventDateBelow,
  teamA,
  teamB,
  time,
  viewMode = ScoreboardViewMode.DEFAULT,
  videoAvailable,
  labels,
  showHorizontalDuration,
  currentSet,
  isDartsCouponScoreboardEnabled,
}) => {
  let competitionIcon: Icons | undefined;
  let competitionLabel: string | undefined;
  let notificationsSubscriptionIcon: ReactElement | undefined;
  
  let data: any[] | undefined;
  let effectiveMatchStatus = matchStatus;

  // Control Scoreboard visibility via Throttle
  if (!isDartsCouponScoreboardEnabled) {
    // THROTTLE OFF
    effectiveMatchStatus = MatchStatus.PRE_MATCH;
  } else {
    // THROTTLE ON
    if (matchStatus === MatchStatus.IN_PLAY || matchStatus === MatchStatus.END) {
      data = formatCouponScoreBoardData(scoreData, viewMode, currentSet, matchStatus);
    }
  }

  if (viewMode !== ScoreboardViewMode.COUPON) {
    competitionIcon = icon;
    competitionLabel = competition;
    notificationsSubscriptionIcon =
      notificationsSubscription && viewMode === ScoreboardViewMode.DEFAULT ? (
        <GenericIcon name={SystemIconName.NOTIFICATION_OFF} />
      ) : undefined;
  }

  const statusLabel = undefined;

  return (
    <View {...getTestProps(DARTS_FIXTURE, false)}>
      <DartsFixtureComponent
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
          matchStatus={effectiveMatchStatus}
          viewMode={viewMode}
          scoreData={data}
          date={date}
          dateTime={dateTime}
          statusLabel={statusLabel}
          time={time}
          liveVideo={videoAvailable}
          inplayLabel={labels.inplay}
          showEventDateBelow={showEventDateBelow}
          showHorizontalDuration={showHorizontalDuration}
        />
      </DartsFixtureComponent>
    </View>
  );
};

export default React.memo(DartsFixture, isDartsFixtureEqual);
