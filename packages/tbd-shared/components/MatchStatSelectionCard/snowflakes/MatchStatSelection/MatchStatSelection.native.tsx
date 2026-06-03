import { FunctionComponent } from "react";
import { View } from "react-native";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { tokens } from "@ppb/the-wall-common/base-theme";
import { ContextualStats } from "../ContextualStats/ContextualStats.native";
import { Text } from "@ppb/the-wall-native";
import { MatchStatSelectionProps } from "./MatchStatSelection.types";
import styles from "./MatchStatSelection.native.styles";
import {
  MATCH_STAT_SELECTION_CARD_CONTAINER,
  MATCH_STAT_SELECTION_CARD_ICON,
  MATCH_STAT_SELECTION_CARD_SUBTITLE,
  MATCH_STAT_SELECTION_CARD_TITLE,
  MATCH_STAT_SELECTION_CARD_STATS,
} from "./MatchStatSelection.native.selectors";

export const MatchStatSelection: FunctionComponent<MatchStatSelectionProps> = ({
  title,
  subtitle,
  stats,
  children,
  icon,
}) => (
  <View style={styles.matchStatSelectionCardContainer} {...getTestProps(MATCH_STAT_SELECTION_CARD_CONTAINER, false)}>
    <View style={styles.marketDetailsContainer}>
      {icon && (
        <View style={styles.icon} {...getTestProps(MATCH_STAT_SELECTION_CARD_ICON, false)}>
          <GenericIcon name={icon} color={tokens.HalfTimePulseMarketCardIconColour} />
        </View>
      )}
      <View style={styles.titleContainer}>
        <View {...getTestProps(MATCH_STAT_SELECTION_CARD_TITLE, false)} style={styles.titleWrapper}>
          {title}
        </View>
        {!!subtitle && (
          <Text style={styles.subtitle} {...getTestProps(MATCH_STAT_SELECTION_CARD_SUBTITLE, false)}>
            {subtitle}
          </Text>
        )}
      </View>
      <View style={styles.odds}>{children}</View>
    </View>
    {stats && (
      <View style={styles.infoContainerStyle} {...getTestProps(MATCH_STAT_SELECTION_CARD_STATS, false)}>
        <ContextualStats text={stats} />
      </View>
    )}
  </View>
);
