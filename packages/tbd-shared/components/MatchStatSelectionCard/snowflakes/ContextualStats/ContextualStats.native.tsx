import { FunctionComponent } from "react";
import { SupportingContentIconName } from "@ppb/the-wall-icons";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { View } from "react-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { tokens } from "@ppb/the-wall-common/base-theme";
import { Text } from "@ppb/the-wall-native";
import { ContextualStatsProps } from "./ContextualStats.types";
import styles from "./ContextualStats.native.styles";
import {
  CONTEXTUAL_STATS_CONTAINER,
  CONTEXTUAL_STATS_ICON,
  CONTEXTUAL_STATS_TEXT,
} from "./ContextualStats.native.selectors";

export const ContextualStats: FunctionComponent<ContextualStatsProps> = ({ text, showIcon = true }) => (
  <View style={styles.contextualStatsContainer} {...getTestProps(CONTEXTUAL_STATS_CONTAINER, false)}>
    {showIcon && (
      <View style={styles.icon} {...getTestProps(CONTEXTUAL_STATS_ICON, false)}>
        <GenericIcon name={SupportingContentIconName.MATCH_STATS} color={tokens.HalfTimePulseStatIconColour} />
      </View>
    )}
    <Text style={styles.contextualStatsText} {...getTestProps(CONTEXTUAL_STATS_TEXT, false)}>
      {text}
    </Text>
  </View>
);
