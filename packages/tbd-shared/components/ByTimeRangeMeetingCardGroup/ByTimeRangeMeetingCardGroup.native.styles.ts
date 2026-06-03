import { StyleSheet } from "react-native";
import { colors, spacings, tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  container: {
    flexDirection: "column",
    ...tokens.ScrollableSwimlaneVerticalGap,
    paddingHorizontal: spacings["spacing-3"],
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: tokens.ScrollableSwimlaneContainerSizing,
    ...tokens.ScrollableSwimlaneHeaderHorizontalGap,
  },
  icon: {
    width: tokens.ScrollableSwimlaneIconSizing,
    height: tokens.ScrollableSwimlaneIconSizing,
  },
  title: {
    ...tokens.ScrollableSwimlaneTitleTypography,
    color: tokens.ScrollableSwimlaneTitleColour,
    flexShrink: 2,
  },
  racePair: {
    flex: 2,
    flexDirection: "row",
  },
  raceLeft: {
    flex: 1 / 2,
    flexDirection: "row",
  },
  raceRight: {
    flex: 1 / 2,
    flexDirection: "row",

    paddingRight: spacings["spacing-2"],
  },
  racePaddingTop: {
    paddingTop: spacings["spacing-2"],
  },

  placeholder: {
    display: "flex",
    flexWrap: "wrap",
    height: "100%",
  },
  placeholderContainer: {
    width: "100%",
    flex: 1,

    backgroundColor: colors.NeutralsBackgroundElevation4,
    borderRadius: 4,
    marginTop: spacings["spacing-2"],
  },
  placeholderHeader: {
    height: 24,
    marginBottom: spacings["spacing-half"],
    justifyContent: "space-between",
    flexDirection: "row",
  },
  placeholderAction: {
    width: 64,
    backgroundColor: colors.NeutralsBackgroundElevation6,
    height: "100%",
  },
  placeholderTitle: {
    width: "50%",
    height: "100%",

    backgroundColor: colors.NeutralsBackgroundElevation6,
    borderRadius: 4,
  },
});
