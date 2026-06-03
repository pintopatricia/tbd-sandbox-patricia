import { StyleSheet } from "react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    ...tokens.ScrollableSwimlaneVerticalGap,
  },
  header: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: tokens.ScrollableSwimlaneContainerSizing,
    ...tokens.TitleLargeHorizontalGap,
  },
  title: {
    ...tokens.ScrollableSwimlaneTitleTypography,
    color: tokens.ScrollableSwimlaneTitleColour,
    flexShrink: 2,
  },
  unavailableIcon: {
    width: tokens.EmptyStateIconSizing,
    height: tokens.EmptyStateIconSizing,
  },
  bottomSheetContent: {
    ...tokens.BottomSheetVerticalGap,
  },
  filters: {
    marginTop: tokens.PebbleListVerticalGap.gap,
    marginBottom: tokens.PebbleListVerticalGap.gap,
  },
});
