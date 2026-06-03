import { FunctionComponent } from "react";
import { View } from "react-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { TBDImage } from "@ppb/the-wall-native/components/TBDImage/TBDImage";
import DefaultHorseSilk from "@ppb/the-wall-native/assets/images/default_silk.svg";
import { Text } from "@ppb/the-wall-native";
import { RunnerInfoProps } from "./RunnerInfo.types";
import styles from "./RunnerInfo.native.styles";
import {
  RUNNER_INFO,
  RUNNER_INFO_JOCKEY_LABEL,
  RUNNER_INFO_JOCKEY_NAME,
  RUNNER_INFO_NAME,
  RUNNER_INFO_SILK,
  RUNNER_INFO_TRAINER_LABEL,
  RUNNER_INFO_TRAINER_NAME,
  RUNNER_INFO_SILK_DEFAULT,
} from "./RunnerInfo.native.selectors";

export const RunnerInfo: FunctionComponent<RunnerInfoProps> = ({
  silkURL,
  runnerNumber,
  runnerName,
  jockeyLabel,
  jockey,
  trainerLabel,
  trainer,
}) => (
  <View {...getTestProps(RUNNER_INFO, false)} style={styles.runnerInfo}>
    {silkURL && (
      <TBDImage
        {...getTestProps(RUNNER_INFO_SILK, false)}
        source={silkURL}
        style={styles.silk}
        fallbackTestID={RUNNER_INFO_SILK_DEFAULT}
        fallbackSource={DefaultHorseSilk}
      />
    )}
    <View style={styles.runnerContainer}>
      <View style={styles.runner}>
        {!!runnerNumber && !!runnerName && (
          <Text {...getTestProps(RUNNER_INFO_NAME)} numberOfLines={1} style={styles.runnerTitleAttribute}>
            {runnerNumber}. {runnerName}
          </Text>
        )}
      </View>
      {!!jockey && (
        <View style={styles.jockeyContainer}>
          <Text {...getTestProps(RUNNER_INFO_JOCKEY_LABEL)} style={styles.runnerAttributeLabel}>
            {jockeyLabel}
          </Text>
          <Text {...getTestProps(RUNNER_INFO_JOCKEY_NAME)} numberOfLines={1} style={styles.runnerAttribute}>
            {jockey}
          </Text>
        </View>
      )}
      {!!trainer && (
        <View style={styles.trainerContainer}>
          <Text {...getTestProps(RUNNER_INFO_TRAINER_LABEL)} style={styles.runnerAttributeLabel}>
            {trainerLabel}
          </Text>
          <Text {...getTestProps(RUNNER_INFO_TRAINER_NAME)} numberOfLines={1} style={styles.runnerAttribute}>
            {trainer}
          </Text>
        </View>
      )}
    </View>
  </View>
);
