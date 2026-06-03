import { FunctionComponent } from "react";
import classnames from "classnames";
import { JackpotProps } from "@ppb/tbd-store/state/entities/Gaming.types";
import { ProgressBarType } from "@ppb/the-wall-common/types";
import { ProgressBar } from "@ppb/the-wall-web/components/bricks/ProgressBar/ProgressBar";
import { GameBadge } from "../../../GameInfo/snowflakes/GameBadge/GameBadge.web";
import styles from "./Jackpot.web.css";

export const Jackpot: FunctionComponent<JackpotProps> = ({
  title,
  value,
  description,
  progress = 0,
  state,
  hasBigTitle,
}) => {
  const titleTypography = hasBigTitle ? "typography-h380" : "typography-h180";

  return (
    <div className={styles.jackpot}>
      <div
        className={classnames(styles.title, titleTypography, {
          [styles.hotTitle]: state === "HOT",
        })}
      >
        {title}
      </div>
      <div className={styles.gameBadgeContainer}>
        <>
          <GameBadge></GameBadge>
          <div className={classnames("typography-h280", styles.label)}>{value}</div>
        </>
      </div>
      <div className={classnames(styles.description, "typography-h120")}>{description}</div>
      {(progress || progress > 0) && (
        <div className={styles.progressBarContainer}>
          {
            <ProgressBar
              home={progress}
              away={100 - progress}
              type={ProgressBarType.GAMING}
              animation={state === "HOT"}
            ></ProgressBar>
          }
        </div>
      )}
    </div>
  );
};
