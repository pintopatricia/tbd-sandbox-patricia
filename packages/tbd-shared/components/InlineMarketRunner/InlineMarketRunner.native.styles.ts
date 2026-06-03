import { StyleSheet } from "react-native";
import { colors, heights, spacings, typography } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  betButtonContainer: {
    minHeight: heights["bet-button-height"],
  },
  marketContainer: {
    width: "100%",
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    minWidth: 0,
    gap: 1,
  },
  betButtonContainerLarge: {
    width: "auto",
  },
  betButtonContainerOnly: {
    borderRadius: spacings["spacing-1"],
    overflow: "hidden",
  },
  betButtonContainerFirst: {
    borderTopLeftRadius: spacings["spacing-1"],
    borderBottomLeftRadius: spacings["spacing-1"],
    overflow: "hidden",
  },
  betButtonContainerLast: {
    borderTopRightRadius: spacings["spacing-1"],
    borderBottomRightRadius: spacings["spacing-1"],
    overflow: "hidden",
  },
  labels: {
    display: "flex",
    alignItems: "center",
    paddingBottom: spacings["spacing-1"],
    paddingHorizontal: 0,
    textAlign: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  labelsNotLast: {
    marginRight: spacings["spacing-1"],
  },
  handicap: {
    color: colors.NeutralsTextDefault,

    ...typography["typography-h120"],
  },
});
