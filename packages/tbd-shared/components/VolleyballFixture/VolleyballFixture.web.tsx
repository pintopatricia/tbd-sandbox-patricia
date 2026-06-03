import { memo, FunctionComponent } from "react";

import { AvBFixture as VolleyballComponent, AvBScoreboard } from "@ppb/the-wall-web";
import { ScoreboardViewMode } from "@ppb/the-wall-common/types";
import { SportsIconName } from "@ppb/the-wall-icons";
import { Icons } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { ComponentProps } from "./props";
import styles from "./VolleyballFixture.web.css";

import { formatCouponScoreBoardData, getStatusLabel, isEqualFixture } from "./VolleyballFixture.helper";

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
 * @param showEventDateBelow shows the date and time of the event below the team names
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
  let competitionLabel: string | undefined;
  let competitionIcon: Icons | undefined;

  if (viewMode !== ScoreboardViewMode.COUPON) {
    competitionLabel = competition;
    competitionIcon = icon;
  }

  return (
    <div className={styles.volleyballFixture}>
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
    </div>
  );
};

export default memo(VolleyballFixture, isEqualFixture);
