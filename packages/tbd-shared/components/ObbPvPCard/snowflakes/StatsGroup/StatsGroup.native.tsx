import { FunctionComponent } from "react";
import { View } from "react-native";

import { Placeholder, ProgressBar, Text } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { ProgressBarVariant } from "@ppb/the-wall-common/types";

import styles from "./StatsGroup.native.styles";
import { StatsGroupProps } from "./StatsGroup.types";
import { getProgressBarProps } from "./StatsGroup.helper";

import * as selector from "./StatsGroup.native.selectors";

export const StatsGroup: FunctionComponent<StatsGroupProps> = ({
  label,
  secondaryLabel,
  left,
  right,
  maxValue,
  disabled = false,
  placeholder = false,
}) => {
  if (placeholder) {
    return (
      <View style={styles.container} {...getTestProps(selector.TEST_ID, false)}>
        <View style={[styles.statZone, styles.statZonePlaceholder]}>
          {/* Left Side */}
          <View style={styles.progressBar}>
            <ProgressBar variant={ProgressBarVariant.PLACEHOLDER} />
          </View>
          <View style={styles.statZoneLabelPlaceholder}>
            <Placeholder style={[styles.placeholder]} />
          </View>
        </View>
        <View style={[styles.textZone, styles.textZonePlaceholder]}>
          {/* Group title */}
          <View style={[styles.mainLabelPlaceholder]} {...getTestProps(selector.MAIN_LABEL)}>
            <Placeholder style={[styles.placeholder]} />
          </View>
          {secondaryLabel && (
            <View style={[styles.secondaryLabelPlaceholder]} {...getTestProps(selector.SECONDARY_LABEL, false)}>
              <Placeholder style={[styles.placeholder]} />
            </View>
          )}
        </View>
        <View style={[styles.statZone, styles.statZonePlaceholder]}>
          {/* Right Side */}
          <View style={styles.statZoneLabelPlaceholder}>
            <Placeholder style={[styles.placeholder]} />
          </View>
          <View style={styles.progressBar}>
            <ProgressBar variant={ProgressBarVariant.PLACEHOLDER} />
          </View>
        </View>
      </View>
    );
  }

  const leftValue = left.value !== null ? left.value.toFixed(2) : "-";
  const rightValue = right.value !== null ? right.value.toFixed(2) : "-";

  return (
    <View style={styles.container} {...getTestProps(selector.TEST_ID, false)}>
      <View style={styles.statZone}>
        {/* Left Side */}
        <View style={styles.progressBar}>
          <ProgressBar barStat {...getProgressBarProps(left, maxValue, "left", disabled)} />
        </View>
        <View>
          <Text
            style={[styles.statZoneLabel, styles.inverted, disabled && styles.disabled]}
            {...getTestProps(selector.STAT_LABEL, false)}
          >
            {leftValue}
          </Text>
        </View>
      </View>
      <View style={styles.textZone}>
        {/* Group title */}
        <Text style={[styles.mainLabel, disabled && styles.disabled]} {...getTestProps(selector.MAIN_LABEL)}>
          {label}
        </Text>
        {secondaryLabel && (
          <Text
            style={[styles.secondaryLabel, disabled && styles.disabled]}
            {...getTestProps(selector.SECONDARY_LABEL, false)}
          >
            {secondaryLabel}
          </Text>
        )}
      </View>
      <View style={styles.statZone}>
        {/* Right Side */}
        <View>
          <Text
            style={[styles.statZoneLabel, disabled && styles.disabled]}
            {...getTestProps(selector.STAT_LABEL, false)}
          >
            {rightValue}
          </Text>
        </View>
        <View style={styles.progressBar}>
          <ProgressBar barStat {...getProgressBarProps(right, maxValue, "right", disabled)} />
        </View>
      </View>
    </View>
  );
};
