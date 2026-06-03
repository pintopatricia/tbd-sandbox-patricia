import { StyleSheet } from "react-native";
import { colors, typography, spacings } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  timelineBar: {
    flexDirection: "row",
  },
  wrapper: {
    flexGrow: 1,
  },
  incidents: {
    paddingRight: 6,
    height: 12,
  },
  incident: {
    position: "absolute",
    width: 12,
    height: 12,
  },
  bar: {
    height: 5,
    marginVertical: spacings["spacing-3"],
    backgroundColor: colors.NeutralsBackgroundElevation4,
    borderRadius: 3,
  },
  inplay: {
    marginVertical: 0,
    backgroundColor: colors.SignpostingInplayBackgroundDefault,
  },
  condensed: {
    marginVertical: spacings["spacing-1"],
  },
  caption: {
    ...typography["typography-h120"],
    alignSelf: "center",
    paddingHorizontal: spacings["spacing-2"],
    color: colors.NeutralsTextSecondary,
  },
});
