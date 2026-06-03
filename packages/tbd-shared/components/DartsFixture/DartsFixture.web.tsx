import React, { FunctionComponent } from "react";

import { AvBFixture as DartsFixtureComponent, AvBScoreboard } from "@ppb/the-wall-web";
import { ScoreboardViewMode, ScoreData, MatchStatus } from "@ppb/the-wall-common/types";
import { SportsIconName } from "@ppb/the-wall-icons";
import { Icons } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import styles from "./DartsFixture.web.css";
import { ComponentProps } from "./props";
import { isDartsFixtureEqual, formatCouponScoreBoardData } from "./DartsFixture.helper";

/**
 * Function component that wraps the connected darts fixture component
 */
const DartsFixture: FunctionComponent<ComponentProps> = ({
  competition,
  event,
  date,
  dateTime,
  icon = SportsIconName.DARTS,
  matchStatus,
  scoreData,
  showBottomSeparator,
  showEventDateBelow,
  showHorizontalDuration,
  teamA,
  teamB,
  time,
  viewMode = ScoreboardViewMode.DEFAULT,
  videoAvailable,
  labels,
  currentSet,
  isDartsCouponScoreboardEnabled,
}) => {
  let scoreToDisplay: ScoreData[] | undefined;
  let competitionLabel: string | undefined;
  let competitionIcon: Icons | undefined;
  let effectiveMatchStatus = matchStatus;

  // Control Scoreboard visibility via Throttle
  if (!isDartsCouponScoreboardEnabled) {
    // THROTTLE OFF: Force PRE_MATCH status.
    effectiveMatchStatus = MatchStatus.PRE_MATCH;
  } else {
    // THROTTLE ON
    if (matchStatus === MatchStatus.IN_PLAY || matchStatus === MatchStatus.END) {
      scoreToDisplay = formatCouponScoreBoardData(scoreData, viewMode, currentSet, matchStatus);
    }
  }

  if (viewMode !== ScoreboardViewMode.COUPON) {
    competitionLabel = competition;
    competitionIcon = icon;
  }

  return (
    <div className={styles.dartsFixture}>
      <DartsFixtureComponent
        icon={competitionIcon}
        competitionLabel={competitionLabel}
        viewMode={viewMode}
        showBottomSeparator={showBottomSeparator}
      >
        <AvBScoreboard
          eventName={event}
          teamA={teamA}
          teamB={teamB}
          matchStatus={effectiveMatchStatus}
          viewMode={viewMode}
          scoreData={scoreToDisplay}
          date={date}
          dateTime={dateTime}
          time={time}
          liveVideo={videoAvailable}
          inplayLabel={labels.inplay}
          showEventDateBelow={showEventDateBelow}
          showHorizontalDuration={showHorizontalDuration}
        />
      </DartsFixtureComponent>
    </div>
  );
};

export default React.memo(DartsFixture, isDartsFixtureEqual);
