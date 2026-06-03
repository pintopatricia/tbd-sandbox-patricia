import { memo, FunctionComponent } from "react";

import { AvBFixture as RugbyUnionFixtureComponent, AvBScoreboard } from "@ppb/the-wall-web";
import { ScoreboardViewMode } from "@ppb/the-wall-common/types";
import { SportsIconName } from "@ppb/the-wall-icons";
import { Icons } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import styles from "./RugbyUnionFixture.web.css";
import { ComponentProps } from "./props";
import { formatScoreBoardData, isRugbyUnionFixtureEqual } from "./RugbyUnionFixture.helper";

/**
 * Function component that wraps the connected rugbyUnion fixture component
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
 * @returns RugbyUnionFixture component
 */

const RugbyUnionFixture: FunctionComponent<ComponentProps> = memo(
  ({
    competition,
    event,
    date,
    dateTime,
    matchStatus,
    icon = SportsIconName.RUGBY_UNION,
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
    const scoreToDisplay = formatScoreBoardData(scoreData);
    let competitionLabel: string | undefined;
    let competitionIcon: Icons | undefined;

    if (viewMode !== ScoreboardViewMode.COUPON) {
      competitionLabel = competition;
      competitionIcon = icon;
    }

    return (
      <div className={styles.rugbyUnionFixture}>
        <RugbyUnionFixtureComponent
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
            scoreData={scoreToDisplay}
            date={date}
            dateTime={dateTime}
            time={time}
            matchStatus={matchStatus}
            liveVideo={videoAvailable}
            inplayLabel={labels.inplay}
            showEventDateBelow={showEventDateBelow}
            showHorizontalDuration={showHorizontalDuration}
          />
        </RugbyUnionFixtureComponent>
      </div>
    );
  },
  isRugbyUnionFixtureEqual,
);

RugbyUnionFixture.displayName = "RugbyUnionFixture";

export default RugbyUnionFixture;
