import { memo, FunctionComponent } from "react";

import { AvBFixture as AmericanFootballFixtureComponent, AvBScoreboard } from "@ppb/the-wall-web";
import { ScoreboardViewMode, ScoreData } from "@ppb/the-wall-common/types";
import { SportsIconName } from "@ppb/the-wall-icons";
import { Icons } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import styles from "./AmericanFootballFixture.web.css";
import { ComponentProps } from "./props";
import { isAmericanFootballFixtureEqual, getStatusLabel } from "./AmericanFootballFixture.helper";

const AmericanFootballFixture: FunctionComponent<ComponentProps> = memo(
  ({
    clock,
    competition,
    event,
    date,
    dateTime,
    icon = SportsIconName.AMERICAN_FOOTBALL,
    matchStatus,
    prefixLabel,
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

    if (scoreData.length) {
      scoreToDisplay = [scoreData[0]];
    }

    if (viewMode !== ScoreboardViewMode.COUPON) {
      competitionLabel = competition;
      competitionIcon = icon;
    }

    const statusLabel = getStatusLabel(clock, viewMode);

    return (
      <div className={styles.americanFootballFixture}>
        <AmericanFootballFixtureComponent
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
            prefixLabel={prefixLabel}
            statusLabel={statusLabel}
            time={time}
            liveVideo={videoAvailable}
            inplayLabel={labels.inplay}
            showEventDateBelow={showEventDateBelow}
            showHorizontalDuration={showHorizontalDuration}
          />
        </AmericanFootballFixtureComponent>
      </div>
    );
  },
  isAmericanFootballFixtureEqual,
);

AmericanFootballFixture.displayName = "AmericanFootballFixture";

export default AmericanFootballFixture;
