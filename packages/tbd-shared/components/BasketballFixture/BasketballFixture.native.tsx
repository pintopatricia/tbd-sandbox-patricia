import { memo, FunctionComponent, ReactElement } from "react";
import { View } from "react-native";
import { AvBFixture as BasketballFixtureComponent, AvBScoreboard } from "@ppb/the-wall-native";
import { GenericIcon, type GenericIconProps, Icons } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { ScoreboardViewMode } from "@ppb/the-wall-common/types";
import { SportsIconName, SystemIconName } from "@ppb/the-wall-icons";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { ComponentProps } from "./props";
import { getStatusLabel, isBasketballFixtureEqual } from "./BasketballFixture.helper";
import { BASKETBALL_FIXTURE } from "./BasketballFixture.native.selectors";

/**
 * Function component that wraps the connected basketball fixture component
 *
 * @param clock Clock scoreboard information
 * @param competition The fixture competition
 * @param date Sport event scheduled date
 * @param dateTime Sport event scheduled datetime
 * @param icon Sport icon
 * @param matchStatus Status of the match
 * @param prefixLabel Prefix label
 * @param scoreData Scoreboard data
 * @param showBottomSeparator show bottom Separator flag
 * @param showEventDateBelow Shows the date and time of the event below the team names
 * @param teamA Team name
 * @param teamB Team name
 * @param time Sport event scheduled time
 * @param viewMode Fixture view mode
 * @param notificationsSubscription Notifications subscription
 * @returns BasketballFixture component
 */
const BasketballFixture: FunctionComponent<ComponentProps> = ({
  clock,
  competition,
  event,
  date,
  dateTime,
  icon = SportsIconName.BASKETBALL,
  matchStatus,
  notificationsSubscription,
  prefixLabel,
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
  let notificationsSubscriptionIcon: ReactElement<GenericIconProps, typeof GenericIcon> | undefined;

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
    <View {...getTestProps(BASKETBALL_FIXTURE, false)}>
      <BasketballFixtureComponent
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
          prefixLabel={prefixLabel}
          statusLabel={statusLabel}
          time={time}
          liveVideo={videoAvailable}
          inplayLabel={labels.inplay}
          showEventDateBelow={showEventDateBelow}
          showHorizontalDuration={showHorizontalDuration}
        />
      </BasketballFixtureComponent>
    </View>
  );
};

export default memo(BasketballFixture, isBasketballFixtureEqual);
