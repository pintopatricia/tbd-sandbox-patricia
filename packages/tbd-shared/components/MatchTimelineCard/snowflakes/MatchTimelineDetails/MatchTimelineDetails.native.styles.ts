import { StyleSheet } from "react-native";
import { colors, typography, spacings } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  incidentEvents: {
    marginTop: spacings["spacing-6"],
  },
  minuteByMinuteTitle: {
    ...typography["typography-h220"],
    color: colors.NeutralsTextDefault,
    marginTop: spacings["spacing-8"],
    marginBottom: spacings["spacing-3"],
    textAlign: "center",
  },
  matchStatsContainer: {
    marginTop: 1,
  },
  periodEndContainer: {
    borderRadius: 4,
    overflow: "hidden",
  },
  lineExtensionTop: {
    marginTop: spacings["spacing-6"],
  },
  lineExtensionBottom: {
    marginBottom: spacings["spacing-6"],
  },
  sequentialMinByMin: {
    marginTop: spacings["spacing-4"],
  },
});
