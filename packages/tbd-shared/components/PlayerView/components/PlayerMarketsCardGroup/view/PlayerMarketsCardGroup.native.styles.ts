import { StyleSheet } from "react-native";
import { tokens, spacings } from "@ppb/the-wall-common/base-theme";

export const sectionStyles = StyleSheet.create({
  container: {
    gap: spacings["spacing-2"],
    marginBottom: spacings["spacing-3"],
  },
  title: {
    ...tokens.CardGroupTitleTypography,
    color: tokens.CardGroupTitleColour,
    paddingHorizontal: spacings["spacing-3"],
  },
  fixture: {
    marginHorizontal: spacings["spacing-3"],
    padding: spacings["spacing-4"],
    overflow: "hidden",
    backgroundColor: tokens.StickyHeaderBackgroundColour,
    borderRadius: spacings["spacing-2"],
  },
});

export default StyleSheet.create({
  container: {
    flex: 1,
    gap: spacings["spacing-4"],
  },
  placeholder: {
    height: 600,
  }
});
