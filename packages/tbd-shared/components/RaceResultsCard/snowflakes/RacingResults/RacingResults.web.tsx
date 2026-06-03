import { FunctionComponent, useCallback, useState } from "react";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { AssetsIconName, OthersIconName, SystemIconName } from "@ppb/the-wall-icons";
import classnames from "classnames";
import styles from "./RacingResults.web.css";
import { RacingResultsProps, ResultRunner } from "./RacingResults.types";

const RacingResultsRunner: FunctionComponent<ResultRunner> = ({
  position,
  positionStatusCode,
  distance,
  horseName,
  jockeyName,
  favouriteLabel,
  trainerName,
  saddleCloth,
  draw,
  silk,
  startingPrice,
  hasPerformance,
  isNonRunner,
}) => {
  const [silkValid, setSilkValid] = useState(true);

  const addDefaultSilk = useCallback(() => {
    setSilkValid(false);
  }, [setSilkValid]);

  if (!hasPerformance && !isNonRunner) {
    return null;
  }

  return (
    <>
      <div>
        <div className={classnames("typography-h158", styles.positionLabel, styles.textOverflow)}>
          {position || positionStatusCode || "-"}
        </div>
      </div>
      <div className={classnames("typography-h120", styles.distanceLabel, styles.textOverflow)}>
        {position === 1 ? (
          <div className={styles.winnerRibbonContainer}>
            <GenericIcon name={OthersIconName.WINNER_RIBBON} color={"var(--neutrals-icon-default)"} />
          </div>
        ) : (
          distance || "-"
        )}
      </div>
      <div className={styles.runnerContainer}>
        <div className={styles.silkContainer}>
          {silk &&
            (silkValid ? (
              <img
                title="jockey silk"
                alt="jockey silk"
                width="25"
                height="20"
                src={silk}
                className={styles.silk}
                onError={addDefaultSilk}
              />
            ) : (
              <div className={styles.silk}>
                <GenericIcon name={AssetsIconName.SILK} />
              </div>
            ))}
        </div>
        <div className={styles.horseInfoContainer}>
          <div className={styles.leftColumn}>
            {!!saddleCloth && <p className={`typography-h158 ${styles.saddleCloth}`}>{saddleCloth}</p>}
            {typeof draw === "number" && <p className={`typography-h120 ${styles.drawNumber}`}>({draw})</p>}
          </div>
          <div className={styles.horseInformationWrapper}>
            <p className={`${styles.horseInformation} typography-h152`}>{horseName}</p>
            {jockeyName && <p className={`typography-h120 ${styles.jockeyName}`}>{`J: ${jockeyName}`}</p>}
            {trainerName && <p className={`typography-h120 ${styles.trainerName}`}>{`T: ${trainerName}`}</p>}
          </div>
        </div>
      </div>
      <div>
        <div className={classnames("typography-h152", styles.startingPriceLabel, styles.textOverflow)}>
          {startingPrice}
        </div>
        {!!favouriteLabel && <div className={classnames("typography-h120", styles.fav)}>{favouriteLabel}</div>}
      </div>
    </>
  );
};

export const RacingResults: FunctionComponent<RacingResultsProps> = ({
  title,
  labels,
  runners,
  ranNumber,
  dnfCodes,
}) => {
  const racingResultHeaders = [
    labels.positionLabel,
    labels.distanceLabel,
    labels.horseLabel,
    labels.startingPriceLabel,
  ];

  return (
    <div className={styles.container}>
      <div className={`typography-h380 ${styles.title}`}>{title}</div>
      {!!ranNumber && (
        <div className={styles.tableInfo}>
          <div className={styles.infoIcon}>
            <GenericIcon name={SystemIconName.NOTIFICATION_INFO} color={"var(--action-tertiary-icon-default)"} />
          </div>
          <div className={`typography-h082 ${styles.ranLabel}`}>{`${labels.ranLabel}: ${ranNumber}`}</div>
        </div>
      )}
      <div className={styles.resultsTable}>
        {racingResultHeaders.map((header, index) => (
          <div
            key={`${header}-${index}`}
            className={classnames(
              "typography-h098",
              styles.headerText,
              styles.textOverflow,
              index === racingResultHeaders.length - 1 ? styles.alignTextRight : {},
            )}
          >
            {header}
          </div>
        ))}
        {!!runners.length &&
          runners.map((resultRunner, index) => (
            <RacingResultsRunner key={`${resultRunner.position}-${index}`} {...resultRunner} />
          ))}
      </div>
      {!!dnfCodes && (
        <div className={styles.dnfsBoard}>
          <div className={styles.dnfIcon}>
            <GenericIcon name={SystemIconName.NOTIFICATION_INFO} color={"var(--action-tertiary-icon-default)"} />
          </div>

          <div className={styles.dnfCodesContainer}>
            {Object.entries(dnfCodes).map(([dnfCode, translation], index) => (
              <div key={`${dnfCode}-${index}`} className={styles.dnfItem}>
                <label className={`typography-h158 ${styles.dnfCode}`}>{dnfCode}:</label>
                <label className={`typography-h152`}>{translation}</label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
