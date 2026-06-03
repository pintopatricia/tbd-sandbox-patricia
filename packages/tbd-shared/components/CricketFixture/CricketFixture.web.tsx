import { memo, FunctionComponent } from "react";

import { AvBFixture as CricketFixtureComponent, AvBScoreboard } from "@ppb/the-wall-web";
import { ScoreboardViewMode, ScoreData } from "@ppb/the-wall-common/types";
import { SportsIconName } from "@ppb/the-wall-icons";
import { Icons } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";

import { ComponentProps } from "./props";
import { formatCouponViewScoreData, isCricketFixtureEqual } from "./CricketFixture.helper";
import styles from "./CricketFixture.web.css";

/**
 * Function component that wraps the connected cricket fixture component
 *
 * @param competition The fixture competition
 * @param date Sport event scheduled date
 * @param dateTime Sport event scheduled datetime
 * @param icon Sport icon
 * @param matchStatus Status of the match
 * @param cricketScoreData Scoreboard data
 * @param showBottomSeparator show bottom Separator flag
 * @param showEventDateBelow shows the date and time of the event below the team names
 * @param teamA Team name
 * @param teamB Team name
 * @param teamServing Team serving
 * @param time Sport event scheduled time
 * @param viewMode Fixture view mode
 * @returns CricketFixture component
 */
const CricketFixture: FunctionComponent<ComponentProps> = ({
  competition,
  event,
  date,
  dateTime,
  icon = SportsIconName.CRICKET,
  matchStatus,
  cricketScoreData,
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
  let formattedScoreData: ScoreData[] | undefined;
  let competitionLabel: string | undefined;
  let competitionIcon: Icons | undefined;

  if (viewMode === ScoreboardViewMode.COUPON) {
    if (cricketScoreData) {
      formattedScoreData = formatCouponViewScoreData(cricketScoreData, matchStatus);
    }
  } else {
    if (cricketScoreData) {
      formattedScoreData = cricketScoreData.scoreData;
    }
    competitionLabel = competition;
    competitionIcon = icon;
  }

  return (
    <div className={styles.cricketFixture}>
      <CricketFixtureComponent
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
          scoreData={formattedScoreData}
          date={date}
          dateTime={dateTime}
          teamServing={teamServing}
          time={time}
          liveVideo={videoAvailable}
          inplayLabel={labels.inplay}
          showEventDateBelow={showEventDateBelow}
          showHorizontalDuration={showHorizontalDuration}
        />
      </CricketFixtureComponent>
    </div>
  );
};

export default memo(CricketFixture, isCricketFixtureEqual);
