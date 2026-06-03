import type { JSX } from "react";
import { FunctionComponent } from "react";
import { View } from "react-native";
import { AvBScoreboard, AvBFixture } from "@ppb/the-wall-native";
import { GenericIcon, Icons } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { SportsIconName, SystemIconName } from "@ppb/the-wall-icons";
import { ScoreboardViewMode } from "@ppb/the-wall-common/types";
import { ComponentProps } from "./props";
import { TENNIS_FIXTURE } from "./TennisFixture.native.selectors";

/**
 * Function component that wraps the connected tennis scoreboard component
 *
 * @param scoreboardProps The scoreboards props
 * @param viewMode Fixture view mode
 * @returns TennisFixture component
 */
const TennisFixture: FunctionComponent<ComponentProps> = ({
  event,
  competition,
  date,
  dateTime,
  icon = SportsIconName.TENNIS,
  interrupted,
  viewMode = ScoreboardViewMode.DEFAULT,
  teamA,
  teamB,
  teamServing,
  scoreData,
  showBottomSeparator,
  showEventDateBelow,
  status,
  statusReason,
  surface,
  time,
  notificationsSubscription,
  videoAvailable,
  labels,
  showHorizontalDuration,
}) => {
  let competitionIcon: Icons | undefined;
  let competitionLabel: string | undefined;
  let notificationsSubscriptionIcon: JSX.Element | undefined;

  if (viewMode !== ScoreboardViewMode.COUPON) {
    competitionIcon = icon;
    competitionLabel = competition;
    notificationsSubscriptionIcon =
      notificationsSubscription && viewMode === ScoreboardViewMode.DEFAULT ? (
        <GenericIcon name={SystemIconName.NOTIFICATION_OFF} />
      ) : undefined;
  }

  return (
    <View {...getTestProps(TENNIS_FIXTURE, false)}>
      <AvBFixture
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
          viewMode={viewMode}
          interrupted={interrupted}
          matchStatus={status}
          matchStatusReason={statusReason}
          surface={surface}
          scoreData={scoreData}
          date={date}
          dateTime={dateTime}
          time={time}
          teamServing={teamServing}
          liveVideo={videoAvailable}
          inplayLabel={labels.inplay}
          showEventDateBelow={showEventDateBelow}
          showHorizontalDuration={showHorizontalDuration}
        />
      </AvBFixture>
    </View>
  );
};

export default TennisFixture;
