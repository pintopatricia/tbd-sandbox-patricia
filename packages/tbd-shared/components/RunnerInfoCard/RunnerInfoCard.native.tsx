import { FunctionComponent } from "react";
import { View } from "react-native";
import { RunnerInfo } from "./snowflakes/RunnerInfo/RunnerInfo.native";
import { ComponentProps } from "./props";
import styles from "./RunnerInfoCard.native.styles";

const RunnerInfoCard: FunctionComponent<ComponentProps> = ({
  silkURL,
  runnerNumber,
  runnerName,
  jockeyLabel,
  jockey,
  trainerLabel,
  trainer,
}) => (
  <View style={styles.runnerInfo}>
    <RunnerInfo
      silkURL={silkURL}
      runnerNumber={runnerNumber}
      runnerName={runnerName}
      jockeyLabel={jockeyLabel}
      jockey={jockey}
      trainerLabel={trainerLabel}
      trainer={trainer}
    />
  </View>
);

export default RunnerInfoCard;
