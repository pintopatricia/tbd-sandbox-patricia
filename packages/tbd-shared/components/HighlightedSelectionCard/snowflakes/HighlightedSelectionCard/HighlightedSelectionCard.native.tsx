import { FunctionComponent } from "react";
import { View, type ViewStyle, type TextStyle } from "react-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { Text } from "@ppb/the-wall-native";
import { HighlightedSelectionCardProps } from "./HighlightedSelectionCard.types";
import {
  HIGHLIGHTED_SELECTION_CARD,
  HIGHLIGHTED_SELECTION_CARD_TEXT,
  HIGHLIGHTED_SELECTION_CARD_BUTTON,
} from "./HighlightedSelectionCard.native.selectors";
import styles from "./HighlightedSelectionCard.native.styles";

export const HighlightedSelectionCard: FunctionComponent<HighlightedSelectionCardProps> = ({
  text,
  isMarketClosed,
  children,
}) => {
  const highlightedSelectionCardStyles: ViewStyle[] = [styles.highlightedSelectionCard];
  const textStyles: TextStyle[] = [styles.text];

  if (isMarketClosed) {
    highlightedSelectionCardStyles.push(styles.closedBackground);
    textStyles.push(styles.closedOpacity);
  }

  return (
    <View style={highlightedSelectionCardStyles} {...getTestProps(HIGHLIGHTED_SELECTION_CARD, false)}>
      <View style={styles.infoContainerStyle}>
        <Text style={textStyles} numberOfLines={3} {...getTestProps(HIGHLIGHTED_SELECTION_CARD_TEXT)}>
          {text}
        </Text>
        <View style={styles.button} {...getTestProps(HIGHLIGHTED_SELECTION_CARD_BUTTON, false)}>
          {children}
        </View>
      </View>
    </View>
  );
};
