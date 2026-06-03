import { FunctionComponent, useEffect } from "react";
import { Alert } from "@ppb/the-wall-web";
import { RacingResults } from "./snowflakes/RacingResults/RacingResults.web";
import { ComponentProps } from "./props";
import styles from "./RaceResultsCard.web.css";

const RaceResultsCard: FunctionComponent<ComponentProps> = ({
  title,
  resultType,
  labels,
  resultLabels,
  runners,
  ranNumber,
  winningTime,
  bspAdvantage,
  raceUrn,
  dispatchSubscribeRaceUpdates,
  dispatchUnsubscribeRaceUpdates,
  dnfCodes,
  statusAlert,
}) => {
  useEffect(() => {
    dispatchSubscribeRaceUpdates(raceUrn);

    return () => {
      dispatchUnsubscribeRaceUpdates(raceUrn);
    };
  }, [dispatchSubscribeRaceUpdates, dispatchUnsubscribeRaceUpdates, raceUrn]);

  return (
    <div className={styles.container}>
      {statusAlert && <Alert {...statusAlert} />}
      {!!resultType && runners.some((runner) => runner.hasPerformance) && (
        <RacingResults title={title} labels={labels} runners={runners} ranNumber={ranNumber} dnfCodes={dnfCodes} />
      )}
      {!!(winningTime || bspAdvantage) && (
        <>
          <h1 className={`typography-h380 ${styles.winningAndBspTitle}`}>{resultLabels.winningAndBspAdvantageLabel}</h1>
          {!!winningTime && (
            <div className={styles.infoWrapper}>
              <span className={`typography-h098 ${styles.winningTimeLabel}`}>{resultLabels.winningTimeLabel}</span>
              <span className={`typography-h152 ${styles.winningTime}`}>{winningTime || "-"}</span>
            </div>
          )}
          {!!bspAdvantage && (
            <div className={styles.infoWrapper}>
              <span className={`typography-h098 ${styles.bspAdvantageLabel}`}>{resultLabels.bspAdvantageLabel}</span>
              <span className={`typography-h152 ${styles.bspAdvantage}`}>{bspAdvantage || "-"}</span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RaceResultsCard;
