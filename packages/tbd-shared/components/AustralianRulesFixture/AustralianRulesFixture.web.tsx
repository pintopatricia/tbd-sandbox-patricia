import { memo, FunctionComponent } from "react";

import { AvBFixture as AustralianRulesFixtureComponent, AvBScoreboard } from "@ppb/the-wall-web";
import { ScoreboardViewMode, ScoreData } from "@ppb/the-wall-common/types";
import { SportsIconName } from "@ppb/the-wall-icons";
import { Icons } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import styles from "./AustralianRulesFixture.web.css";
import { ComponentProps } from "./props";
import { isAustralianRulesFixtureEqual } from "./AustralianRulesFixture.helper";

/**
 * Function component that wraps the connected australian rules fixture component
 *
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
 * @returns AustralianRulesFixture component
 */

const AustralianRulesFixture: FunctionComponent<ComponentProps> = memo(
  ({
    competition,
    event,
    date,
    dateTime,
    icon = SportsIconName.AUSSIE_FOOTBALL,
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
  }) => {
    let scoreToDisplay: ScoreData[] | undefined;
    let competitionLabel: string | undefined;
    let competitionIcon: Icons | undefined;

    if (viewMode === ScoreboardViewMode.COUPON) {
      if (scoreData.length) {
        scoreToDisplay = [scoreData[0]];
      }
    } else {
      if (scoreData.length) {
        scoreToDisplay = scoreData;
      }
      competitionLabel = competition;
      competitionIcon = icon;
    }

    return (
      <div className={styles.australianRulesFixture}>
        <AustralianRulesFixtureComponent
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
            scoreData={scoreToDisplay}
            date={date}
            dateTime={dateTime}
            time={time}
            liveVideo={videoAvailable}
            inplayLabel={labels.inplay}
            showEventDateBelow={showEventDateBelow}
            showHorizontalDuration={showHorizontalDuration}
          />
        </AustralianRulesFixtureComponent>
      </div>
    );
  },
  isAustralianRulesFixtureEqual,
);

AustralianRulesFixture.displayName = "AustralianRulesFixture";

export default AustralianRulesFixture;
