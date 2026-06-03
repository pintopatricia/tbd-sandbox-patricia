import { FunctionComponent } from "react";

import styles from "./FootballRunner.web.css";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { AssetsIconName } from "@ppb/the-wall-icons";
import { i18n } from "../../helpers/i18n";
import { TranslationKey } from "../../translations/keys";
import { ImageWithFallback } from "../ImageWithFallback/ImageWithFallback.web";
import { FootballRunnerProps } from "./props";

const FootballRunner: FunctionComponent<FootballRunnerProps> = ({
  runnerName,
  statValue,
  statValueInterpolation,
  statLabel,
  rightColumn,
  jersey,
  useFallbackJersey,
  shouldRenderJerseySpace,
}) => {
  const hasJersey: boolean = !!jersey || !!useFallbackJersey;

  return (
    <div className={styles.container}>
      <div className={styles.leftColumn}>
        {(hasJersey || shouldRenderJerseySpace) && (
          <div className={styles.jerseyContainer} data-testid="jersey-container">
            {jersey && (
              <ImageWithFallback
                url={jersey}
                alt={`${runnerName} jersey`}
                fallbackIconName={AssetsIconName.FALLBACK_JERSEY}
              />
            )}

            {useFallbackJersey && <GenericIcon name={AssetsIconName.FALLBACK_JERSEY} />}
          </div>
        )}

        <div className={styles.runnerContainer}>
          <p className={styles.runnerName}>{runnerName}</p>
          {statValue && (
            <div className={styles.runnerStats}>
              <span>{i18n({ key: (statLabel ?? "I18N.IN_LINE_STATS_PER_MATCH_AVG") as keyof TranslationKey })}</span>{" "}
              <span className={styles.statValue}>
                {statValueInterpolation
                  ? i18n({ key: statValue as keyof TranslationKey, interpolationValues: statValueInterpolation })
                  : statValue}
              </span>
            </div>
          )}
        </div>
      </div>
      {rightColumn && <div className={styles.rightColumn}>{rightColumn}</div>}
    </div>
  );
};

export default FootballRunner;
