import { memo, FunctionComponent } from "react";
import { View } from "react-native";
import { AvBFixture as VolleyballComponent, AvBScoreboard } from "@ppb/the-wall-native";
import { ScoreboardViewMode } from "@ppb/the-wall-common/types";
import { SportsIconName } from "@ppb/the-wall-icons";
import { Icons } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { ComponentProps } from "./props";
import { formatCouponScoreBoardData, getStatusLabel, isEqualFixture } from "./VolleyballFixture.helper";
import { VOLLEYBALL_FIXTURE } from "./VolleyballFixture.native.selectors";

/**
 * Function component that wraps the connected volleyball fixture component
 *
 * @param competition The fixture competition
 * @param currentSet The current Volleyball set
 * @param date Sport event scheduled date
 * @param dateTime Sport event scheduled datetime
 * @param icon Sport icon
 * @param matchStatus Status of the match
 * @param scoreData Scoreboard data
 * @param showBottomSeparator show bottom Separator flag
 * @param showEventDateBelow Shows the date and time of the event below the team names
 * @param teamA Team name
 * @param teamB Team name
 * @param teamServing Team currently serving if any
 * @param time Sport event scheduled time
 * @param viewMode Fixture view mode
 * @returns VolleyballFixture component
 */
const VolleyballFixture: FunctionComponent<ComponentProps> = ({
  competition,
  event,
  currentSet,
  date,
  dateTime,
  icon = SportsIconName.VOLLEYBALL,
  matchStatus,
  scoreData,
  showBottomSeparator,
  showEventDateBelow,
  teamA,
  teamB,
  teamServing,
  time,
  viewMode = ScoreboardViewMode.DEFAULT,
  videoAvailable,
  labels,
  showHorizontalDuration,
}) => {
  const data = formatCouponScoreBoardData(scoreData, viewMode, currentSet, matchStatus);
  const statusLabel = getStatusLabel(currentSet);

  let competitionIcon: Icons | undefined;
  let competitionLabel: string | undefined;

  if (viewMode !== ScoreboardViewMode.COUPON) {
    competitionIcon = icon;
    competitionLabel = competition;
  }

  return (
    <View {...getTestProps(VOLLEYBALL_FIXTURE, false)}>
      <VolleyballComponent
        icon={competitionIcon}
        competitionLabel={competitionLabel}
        viewMode={viewMode}
        showBottomSeparator={showBottomSeparator}
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
          teamServing={teamServing}
          liveVideo={videoAvailable}
          inplayLabel={labels.inplay}
          showEventDateBelow={showEventDateBelow}
          showHorizontalDuration={showHorizontalDuration}
        />
      </VolleyballComponent>
    </View>
  );
};

export default memo(VolleyballFixture, isEqualFixture);
