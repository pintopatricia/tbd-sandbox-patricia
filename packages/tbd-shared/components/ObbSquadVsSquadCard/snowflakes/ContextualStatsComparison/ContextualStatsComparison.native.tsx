import { FunctionComponent } from "react";
import { SupportingContentIconName } from "@ppb/the-wall-icons";
import { Text } from "@ppb/the-wall-native";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { View } from "react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { ContextualStatsComparisonProps } from "./ContextualStatsComparison.types";
import styles from "./ContextualStatsComparison.native.styles";
import { CONTEXTUAL_STATS_CONTAINER } from "./ContextualStatsComparison.native.selectors";

export const ContextualStatsComparison: FunctionComponent<ContextualStatsComparisonProps> = ({
  text,
  leftValue,
  rightValue,
}) => (
  <View style={styles.contextualStatsComparisonContainer} {...getTestProps(CONTEXTUAL_STATS_CONTAINER, false)}>
    <View style={styles.statsContainer}>
      <View style={styles.iconContainer}>
        <GenericIcon name={SupportingContentIconName.MATCH_STATS} color={tokens.HalfTimePulseStatIconColour} />
      </View>
      <Text style={styles.text}>{leftValue}</Text>
    </View>
    <View style={styles.contextualTextContainer}>
      <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">
        {text}
      </Text>
    </View>
    <View style={styles.statsContainer}>
      <Text style={styles.text}>{rightValue}</Text>
      <View style={styles.iconContainer}>
        <GenericIcon name={SupportingContentIconName.MATCH_STATS} color={tokens.HalfTimePulseStatIconColour} />
      </View>
    </View>
  </View>
);
