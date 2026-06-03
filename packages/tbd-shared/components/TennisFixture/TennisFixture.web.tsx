import { FunctionComponent } from "react";
import { AvBFixture, AvBScoreboard } from "@ppb/the-wall-web";
import { SportsIconName } from "@ppb/the-wall-icons";
import { Icons } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { ScoreboardViewMode } from "@ppb/the-wall-common/types";
import { ComponentProps } from "./props";
import styles from "./TennisFixture.web.css";

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
  videoAvailable,
  labels,
  showHorizontalDuration,
}) => {
  let competitionLabel: string | undefined;
  let competitionIcon: Icons | undefined;

  if (viewMode !== ScoreboardViewMode.COUPON) {
    competitionLabel = competition;
    competitionIcon = icon;
  }

  return (
    <div className={styles.tennisFixture}>
      <AvBFixture
        icon={competitionIcon}
        competitionLabel={competitionLabel}
        viewMode={viewMode}
        showBottomSeparator={showBottomSeparator}
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
    </div>
  );
};

export default TennisFixture;
