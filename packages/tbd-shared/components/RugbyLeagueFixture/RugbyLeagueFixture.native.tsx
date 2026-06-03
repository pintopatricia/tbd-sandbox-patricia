import { memo, FunctionComponent, ReactElement } from "react";
import { View } from "react-native";
import { AvBFixture as RugbyLeagueFixtureComponent, AvBScoreboard } from "@ppb/the-wall-native";
import { GenericIcon, Icons } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { ScoreboardViewMode } from "@ppb/the-wall-common/types";
import { SportsIconName, SystemIconName } from "@ppb/the-wall-icons";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { ComponentProps } from "./props";
import { isRugbyLeagueFixtureEqual } from "./RugbyLeagueFixture.helper";
import { RUGBY_LEAGUE_FIXTURE } from "./RugbyLeagueFixture.native.selectors";

const RugbyLeagueFixture: FunctionComponent<ComponentProps> = ({
  competition,
  event,
  date,
  dateTime,
  matchStatus,
  icon = SportsIconName.RUGBY_LEAGUE,
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
  let competitionIcon: Icons | undefined;
  let competitionLabel: string | undefined;
  let notificationsSubscriptionIcon: ReactElement | undefined;

  const data = [scoreData[0]];

  if (viewMode !== ScoreboardViewMode.COUPON) {
    competitionIcon = icon;
    competitionLabel = competition;
    notificationsSubscriptionIcon =
      notificationsSubscription && viewMode === ScoreboardViewMode.DEFAULT ? (
        <GenericIcon name={SystemIconName.NOTIFICATION_OFF} />
      ) : undefined;
  }

  return (
    <View {...getTestProps(RUGBY_LEAGUE_FIXTURE, false)}>
      <RugbyLeagueFixtureComponent
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
          scoreData={data}
          date={date}
          dateTime={dateTime}
          time={time}
          matchStatus={matchStatus}
          liveVideo={videoAvailable}
          inplayLabel={labels.inplay}
          showEventDateBelow={showEventDateBelow}
          showHorizontalDuration={showHorizontalDuration}
        />
      </RugbyLeagueFixtureComponent>
    </View>
  );
};

export default memo(RugbyLeagueFixture, isRugbyLeagueFixtureEqual);
