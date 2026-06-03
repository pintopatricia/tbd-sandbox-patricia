import { FunctionComponent } from "react";
import { View } from "react-native";

import { typography } from "@ppb/the-wall-common/base-theme";
import { Text } from "@ppb/the-wall-native";
import { CombinationsListLine } from "../Preview/snowflakes/CombinationsList/CombinationsList.native";
import { ComponentProps } from "./props";
import styles from "./PreviewLine.native.styles";

export const PreviewLine: FunctionComponent<ComponentProps> = ({ order, odd, payout, runners, isLast }) => (
  <CombinationsListLine id={`${order}`} odd={odd} payout={payout} isLast={!!isLast}>
    {runners.map(({ id, title, subtitle }, index) => (
      <View key={id} style={[styles.previewSelection, index === runners.length - 1 && styles.lastPreview]}>
        <Text style={typography["typography-h088"]}>{title}</Text>
        <Text style={typography["typography-h082"]}>{subtitle}</Text>
      </View>
    ))}
  </CombinationsListLine>
);
