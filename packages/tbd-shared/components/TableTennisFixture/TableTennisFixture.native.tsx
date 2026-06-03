import { memo, FunctionComponent } from "react";
import { View } from "react-native";
import { AvBFixture as TableTennisComponent, AvBScoreboard } from "@ppb/the-wall-native";
import { ScoreboardViewMode } from "@ppb/the-wall-common/types";
import { SportsIconName } from "@ppb/the-wall-icons";
import { Icons } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { ComponentProps } from "./props";
import { formatCouponScoreBoardData, isEqualFixture } from "./TableTennisFixture.helper";
import { TABLE_TENNIS_FIXTURE } from "./TableTennisFixture.native.selectors";

/**
 * Function component that wraps the connected table tennis fixture component
 *
 * @param competition The fixture competition
 * @param currentSet The current Table Tennis set
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
 * @returns TableTennisFixture component
 */
const TableTennisFixture: FunctionComponent<ComponentProps> = ({
  competition,
  event,
  currentSet,
  date,
  dateTime,
  icon = SportsIconName.TABLE_TENNIS,
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

  let competitionIcon: Icons | undefined;
  let competitionLabel: string | undefined;

  if (viewMode !== ScoreboardViewMode.COUPON) {
    competitionIcon = icon;
    competitionLabel = competition;
  }

  return (
    <View {...getTestProps(TABLE_TENNIS_FIXTURE, false)}>
      <TableTennisComponent
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
          time={time}
          teamServing={teamServing}
          liveVideo={videoAvailable}
          inplayLabel={labels.inplay}
          showEventDateBelow={showEventDateBelow}
          showHorizontalDuration={showHorizontalDuration}
        />
      </TableTennisComponent>
    </View>
  );
};

export default memo(TableTennisFixture, isEqualFixture);
