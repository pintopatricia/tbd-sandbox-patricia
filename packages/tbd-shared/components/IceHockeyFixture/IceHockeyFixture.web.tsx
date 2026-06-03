import { memo, FunctionComponent } from "react";

import { AvBFixture as IceHockeyFixtureComponent, AvBScoreboard } from "@ppb/the-wall-web";
import { ScoreboardViewMode, ScoreData } from "@ppb/the-wall-common/types";
import { SportsIconName } from "@ppb/the-wall-icons";
import { Icons } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import styles from "./IceHockeyFixture.web.css";
import { ComponentProps } from "./props";
import { getStatusLabel, isIceHockeyFixtureEqual } from "./IceHockeyFixture.helper";

/**
 * Function component that wraps the connected ice hockey fixture component
 *
 * @param clock Clock scoreboard information
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
 * @returns IceHockeyFixture component
 */

const IceHockeyFixture: FunctionComponent<ComponentProps> = memo(
  ({
    clock,
    competition,
    event,
    date,
    dateTime,
    icon = SportsIconName.ICE_HOCKEY,
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

    const statusLabel = getStatusLabel(clock, viewMode);

    return (
      <div className={styles.iceHockeyFixture}>
        <IceHockeyFixtureComponent
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
            statusLabel={statusLabel}
            time={time}
            liveVideo={videoAvailable}
            inplayLabel={labels.inplay}
            showEventDateBelow={showEventDateBelow}
            showHorizontalDuration={showHorizontalDuration}
          />
        </IceHockeyFixtureComponent>
      </div>
    );
  },
  isIceHockeyFixtureEqual,
);

IceHockeyFixture.displayName = "IceHockeyFixture";

export default IceHockeyFixture;
