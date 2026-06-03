import { tokens } from "@ppb/the-wall-common/base-theme";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    ...tokens.SessionHorizontalGap,
  },
  textLabel: {
    color: tokens.SessionTextContentTextColour,
    ...tokens.SessionContentTextTypography,
    flexShrink: 1,
  },
  timeLabel: {
    color: tokens.SessionTextContentTextHighlightedColour,
    ...tokens.SessionContentTextHighlightedTypography,
    flexShrink: 1,
  },
});
