import { StyleSheet } from "react-native";
import { spacings, tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  container: {
    gap: tokens.CardGroupVerticalGap.gap,
  },
  title: {
    ...tokens.CardGroupTitleTypography,
    color: tokens.CardGroupTitleColour,
    flexGrow: 1,
  },
  itemsContainer: {
    gap: spacings["spacing-3"],
  },
});
