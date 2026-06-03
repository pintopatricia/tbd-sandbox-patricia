import { FunctionComponent, useCallback, useState } from "react";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { AssetsIconName } from "@ppb/the-wall-icons";
import { RunnerInfoProps } from "./RunnerInfo.types";
import styles from "./RunnerInfo.web.css";

export const RunnerInfo: FunctionComponent<RunnerInfoProps> = ({
  silkURL,
  silkAlt,
  runnerNumber,
  runnerName,
  jockeyLabel,
  jockey,
  trainerLabel,
  trainer,
}) => {
  const [silkValid, setSilkValid] = useState(true);

  const addDefaultSilk = useCallback(() => {
    setSilkValid(false);
  }, [setSilkValid]);

  return (
    <div className={styles.runnerInfo}>
      {silkURL &&
        (silkValid ? (
          <img loading="lazy" className={styles.silk} src={silkURL} alt={silkAlt} onError={addDefaultSilk} />
        ) : (
          <div className={styles.silkDefault}>
            <GenericIcon name={AssetsIconName.SILK} />
          </div>
        ))}
      <div className={styles.runnerContainer}>
        {runnerNumber && runnerName && (
          <div className={`typography-h380 ${styles.runner}`}>
            <span className={styles.runnerAttribute}>
              {runnerNumber}. {runnerName}
            </span>
          </div>
        )}
        {jockey && (
          <div className={`typography-h152 ${styles.jockey} ${styles.attribute}`}>
            <span className={styles.runnerAttributeLabel}>{jockeyLabel}</span>
            <span className={styles.runnerAttribute}>{jockey}</span>
          </div>
        )}
        {trainer && (
          <div className={`typography-h152 ${styles.attribute}`}>
            <span className={styles.runnerAttributeLabel}>{trainerLabel}</span>
            <span className={styles.runnerAttribute}>{trainer}</span>
          </div>
        )}
      </div>
    </div>
  );
};
