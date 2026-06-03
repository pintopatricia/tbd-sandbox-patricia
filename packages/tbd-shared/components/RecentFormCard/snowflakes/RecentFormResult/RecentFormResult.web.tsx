import { FunctionComponent } from "react";
import classNames from "classnames";
import { RecentFormCaptionContentType } from "@ppb/the-wall-common/types";
import { RecentFormIcon } from "@ppb/the-wall-web/components/bricks/RecentFormIcon/RecentFormIcon";
import styles from "./RecentFormResult.web.module.css";
import { RecentFormResultAlignment, RecentFormResultProps } from "./RecentFormResult.types";

export const RecentFormResult: FunctionComponent<RecentFormResultProps> = ({
  score,
  isExtraTimeScore,
  penaltyScore,
  opponent,
  competition,
  date,
  side,
  outcome,
  alignment,
  translations,
}) => {
  const containerClass = classNames(styles.container, {
    [styles.right]: alignment === RecentFormResultAlignment.RIGHT,
    [styles.left]: alignment === RecentFormResultAlignment.LEFT,
  });

  return (
    <div className={containerClass}>
      <div className={styles.recentFormIconContainer}>
        <RecentFormIcon outcome={outcome} label={translations[outcome]} />
      </div>
      <div className={styles.recentFormContainer}>
        {score && (
          <span className={`typography-h280 ${styles.recentFormScore}`}>
            {score.home} - {score.away}
            {isExtraTimeScore && (
              <span className={`typography-h120 ${styles.extraTime}`}>
                {translations[RecentFormCaptionContentType.AET]}
              </span>
            )}
          </span>
        )}
        {penaltyScore && (
          <span className={`typography-h120 ${styles.recentFormScorePenalties}`}>
            {penaltyScore.home} - {penaltyScore.away}
            <span className={`typography-h120 ${styles.penalties}`}>
              {translations[RecentFormCaptionContentType.PEN]}
            </span>
          </span>
        )}
        <span className={`typography-h120 ${styles.recentFormOpponent}`}>
          {opponent} ({translations[side]})
        </span>
        {competition && <span className={`typography-h120 ${styles.recentFormCompetition}`}>{competition}</span>}
        <span className={`typography-h120 ${styles.recentFormDate}`}>{date}</span>
      </div>
    </div>
  );
};
