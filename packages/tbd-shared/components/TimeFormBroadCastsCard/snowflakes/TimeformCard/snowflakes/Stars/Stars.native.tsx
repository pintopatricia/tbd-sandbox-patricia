import { FunctionComponent } from "react";
import { View } from "react-native";
import { SystemIconName } from "@ppb/the-wall-icons";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { colors } from "@ppb/the-wall-common/base-theme";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { StarsProps } from "./Stars.types";
import styles from "./Stars.native.styles";
import { STARS, STAR_OUTLINE, STAR_FILLED } from "./Stars.native.selectors";

const getStarStyle = (isLast: boolean): Record<string, unknown>[] => [styles.star, isLast ? styles.noMarginRight : {}];

export const Stars: FunctionComponent<StarsProps> = ({ filled, outline }) => (
  <View style={styles.starsContent} {...getTestProps(STARS, false)}>
    {Array.from({ length: filled }).map((_, idx) => (
      <View key={idx} style={getStarStyle(idx + 1 === filled + outline)} {...getTestProps(STAR_FILLED, false)}>
        <GenericIcon name={SystemIconName.STAR_FILLED} color={colors.AgnosticSignpostingGenerosityIconDefault} />
      </View>
    ))}
    {Array.from({ length: outline }).map((_, idx) => (
      <View key={idx} style={getStarStyle(idx + 1 === outline)} {...getTestProps(STAR_OUTLINE, false)}>
        <GenericIcon name={SystemIconName.STAR_OUTLINED} color={colors.AgnosticNeutralsIconDisabled} />
      </View>
    ))}
  </View>
);
