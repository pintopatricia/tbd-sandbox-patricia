import { StyleSheet } from "react-native";
import { colors, spacings, heights, typography } from "@ppb/the-wall-common/base-theme";

// TODO: Should be updated in near future
const TEMPORARY_OPACITY = 0.37;

export default StyleSheet.create({
  highlightedSelectionCard: {
    padding: spacings["spacing-2"],
    backgroundColor: colors.NeutralsBackgroundElevation2,
    borderRadius: 4,
  },
  infoContainerStyle: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    flex: 1,
    ...typography["typography-h152"],
    color: colors.NeutralsTextDefault,
  },
  button: {
    height: heights["bet-button-height"],
    width: heights["bet-button-width"],
    marginLeft: spacings["spacing-2"],
    alignSelf: "flex-end",
    borderRadius: 4,
    overflow: "hidden",
  },
  closedOpacity: {
    opacity: TEMPORARY_OPACITY,
  },
  closedBackground: {
    backgroundColor: colors.NeutralsBackgroundElevation2,
  },
});
