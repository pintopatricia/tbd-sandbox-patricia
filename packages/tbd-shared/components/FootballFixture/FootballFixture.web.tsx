import { FunctionComponent } from "react";
import { AvBFixture as FootballFixtureComponent, FootballScoreboard } from "@ppb/the-wall-web";
import { ScoreboardViewMode } from "@ppb/the-wall-common/types";
import styles from "./FootballFixture.web.css";
import { ComponentProps } from "./props";

/**
 * Function component that wraps the connected football fixture component
 *
 * @param competition The fixture competition
 * @param scoreboardProps The scoreboards props
 * @param viewMode Fixture view mode
 * @param showBottomSeparator Displays bottom separator
 * @param showEventDateBelow Shows the date and time of the event below the team names
 * @param iconsList List of icons to be displayed in the scoreboard
 * @returns FootballFixture component
 */
const FootballFixture: FunctionComponent<ComponentProps> = ({
  competition,
  scoreboardProps,
  viewMode = ScoreboardViewMode.DEFAULT,
  showBottomSeparator,
  showEventDateBelow,
  iconsList,
  showHorizontalDuration,
}) => {
  const competitionLabel = viewMode === ScoreboardViewMode.DEFAULT ? competition : undefined;
  const isCouponView = ScoreboardViewMode.COUPON === viewMode;

  return (
    <div className={styles.footballFixture}>
      <FootballFixtureComponent
        competitionLabel={competitionLabel}
        viewMode={viewMode}
        showBottomSeparator={showBottomSeparator}
      >
        <FootballScoreboard
          viewMode={viewMode}
          {...scoreboardProps}
          iconsList={iconsList}
          showEventDateBelow={showEventDateBelow}
          showHorizontalDuration={showHorizontalDuration}
          isHighlighted={!isCouponView}
        />
      </FootballFixtureComponent>
    </div>
  );
};

export default FootballFixture;
