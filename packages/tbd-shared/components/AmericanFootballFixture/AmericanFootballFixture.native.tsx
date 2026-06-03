import { FunctionComponent, memo, ReactElement } from "react";
import { View } from "react-native";
import { AvBScoreboard, AvBFixture } from "@ppb/the-wall-native";
import { GenericIcon, Icons } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { SportsIconName, SystemIconName } from "@ppb/the-wall-icons";
import { ScoreboardViewMode } from "@ppb/the-wall-common/types";
import { ComponentProps } from "./props";
import { AMERICAN_FOOTBALL_FIXTURE } from "./AmericanFootballFixture.native.selectors";
import { getStatusLabel, isAmericanFootballFixtureEqual } from "./AmericanFootballFixture.helper";

const AmericanFootballFixture: FunctionComponent<ComponentProps> = ({
  clock,
  competition,
  event,
  date,
  dateTime,
  icon = SportsIconName.AMERICAN_FOOTBALL,
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
  let competitionIcon: Icons | undefined;
  let competitionLabel: string | undefined;
  let notificationsSubscriptionIcon: ReactElement | undefined;

  if (viewMode !== ScoreboardViewMode.COUPON) {
    competitionIcon = icon;
    competitionLabel = competition;
    notificationsSubscriptionIcon =
      notificationsSubscription && viewMode === ScoreboardViewMode.DEFAULT ? (
        <GenericIcon name={SystemIconName.NOTIFICATION_OFF} />
      ) : undefined;
  }

  const statusLabel = getStatusLabel(clock, viewMode);

  return (
    <View {...getTestProps(AMERICAN_FOOTBALL_FIXTURE, false)}>
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
          matchStatus={matchStatus}
          scoreData={[scoreData[0]]}
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
      </AvBFixture>
    </View>
  );
};

export default memo(AmericanFootballFixture, isAmericanFootballFixtureEqual);
