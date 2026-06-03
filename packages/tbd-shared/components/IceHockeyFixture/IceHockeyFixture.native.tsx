import { memo, FunctionComponent, ReactElement } from "react";
import { View } from "react-native";
import { AvBFixture as IceHockeyFixtureComponent, AvBScoreboard } from "@ppb/the-wall-native";
import { GenericIcon, Icons } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { ScoreboardViewMode } from "@ppb/the-wall-common/types";
import { SportsIconName, SystemIconName } from "@ppb/the-wall-icons";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { ComponentProps } from "./props";
import { getStatusLabel, isIceHockeyFixtureEqual } from "./IceHockeyFixture.helper";
import { ICE_HOCKEY_FIXTURE } from "./IceHockeyFixture.native.selectors";

/**
 * Function component that wraps the connected ice hockey fixture component
 *
 * @param clock Clock scoreboard information
 * @param competition The fixture competition
 * @param date Sport event scheduled date
 * @param dateTime Sport event scheduled datetime
 * @param icon Sport icon
 * @param matchStatus Status of the match
 * @param scoreData Scoreboard data
 * @param showBottomSeparator show bottom Separator flag
 * @param showEventDateBelow Shows the date and time of the event below the team names
 * @param teamA Team name
 * @param teamB Team name
 * @param time Sport event scheduled time
 * @param viewMode Fixture view mode
 * @param notificationsSubscription Notifications subscription
 * @returns IceHockeyFixture component
 */
const IceHockeyFixture: FunctionComponent<ComponentProps> = ({
  clock,
  competition,
  event,
  date,
  dateTime,
  icon = SportsIconName.ICE_HOCKEY,
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
}) => {
  let data;
  let competitionIcon: Icons | undefined;
  let competitionLabel: string | undefined;
  let notificationsSubscriptionIcon: ReactElement | undefined;

  if (viewMode === ScoreboardViewMode.COUPON) {
    data = [scoreData[0]];
  } else {
    data = scoreData;
    competitionIcon = icon;
    competitionLabel = competition;
    notificationsSubscriptionIcon =
      notificationsSubscription && viewMode === ScoreboardViewMode.DEFAULT ? (
        <GenericIcon name={SystemIconName.NOTIFICATION_OFF} />
      ) : undefined;
  }

  const statusLabel = getStatusLabel(clock, viewMode);

  return (
    <View {...getTestProps(ICE_HOCKEY_FIXTURE, false)}>
      <IceHockeyFixtureComponent
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
      </IceHockeyFixtureComponent>
    </View>
  );
};

export default memo(IceHockeyFixture, isIceHockeyFixtureEqual);
