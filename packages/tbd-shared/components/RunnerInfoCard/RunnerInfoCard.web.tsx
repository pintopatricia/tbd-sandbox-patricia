import { FunctionComponent } from "react";
import { RunnerInfo } from "./snowflakes/RunnerInfo/RunnerInfo.web";
import { ComponentProps } from "./props";
import styles from "./RunnerInfoCard.web.css";

const RunnerInfoCard: FunctionComponent<ComponentProps> = ({
  silkURL,
  silkAlt,
  runnerNumber,
  runnerName,
  jockeyLabel,
  jockey,
  trainerLabel,
  trainer,
}) => (
  <div className={styles.runnerInfo}>
    <RunnerInfo
      silkURL={silkURL}
      silkAlt={silkAlt}
      runnerNumber={runnerNumber}
      runnerName={runnerName}
      jockeyLabel={jockeyLabel}
      jockey={jockey}
      trainerLabel={trainerLabel}
      trainer={trainer}
    />
  </div>
);

export default RunnerInfoCard;
