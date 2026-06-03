import { tokens } from "@ppb/the-wall-common/base-theme";
import { Platform, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flexDirection: "column",
  },
  stickyOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  headerHighlighted: {
    backgroundColor: tokens.PageHighlightedSectionBackgroundColor,
  },
  offsetContainer: {
    marginTop: tokens.PageVerticalGapPrimary.gap,
  },
  placeholder: {
    flexDirection: "column",
    gap: 8,
    padding: 16,
  },
});

export default styles;
