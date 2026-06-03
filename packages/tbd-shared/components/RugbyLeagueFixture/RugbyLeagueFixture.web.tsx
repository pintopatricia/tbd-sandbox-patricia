import { memo, FunctionComponent } from "react";

import { AvBFixture as RugbyLeagueFixtureComponent, AvBScoreboard } from "@ppb/the-wall-web";
import { ScoreboardViewMode } from "@ppb/the-wall-common/types";
import { SportsIconName } from "@ppb/the-wall-icons";
import { Icons } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import styles from "./RugbyLeagueFixture.web.css";
import { ComponentProps } from "./props";
import { isRugbyLeagueFixtureEqual } from "./RugbyLeagueFixture.helper";

const RugbyLeagueFixture: FunctionComponent<ComponentProps> = memo(
  ({
    competition,
    event,
    date,
    dateTime,
    matchStatus,
    icon = SportsIconName.RUGBY_LEAGUE,
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
    const scoreToDisplay = scoreData.length ? [scoreData[0]] : undefined;
    let competitionLabel: string | undefined;
    let competitionIcon: Icons | undefined;

    if (viewMode !== ScoreboardViewMode.COUPON) {
      competitionLabel = competition;
      competitionIcon = icon;
    }

    return (
      <div className={styles.rugbyLeagueFixture}>
        <RugbyLeagueFixtureComponent
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
        </RugbyLeagueFixtureComponent>
      </div>
    );
  },
  isRugbyLeagueFixtureEqual,
);

RugbyLeagueFixture.displayName = "RugbyLeagueFixture";

export default RugbyLeagueFixture;
