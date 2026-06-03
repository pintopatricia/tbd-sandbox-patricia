import { StyleSheet } from "react-native";
import { colors, spacings } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  minuteIncidentsContainer: {
    zIndex: 2,
  },
  minuteIncident: {
    marginTop: spacings["spacing-2"],
  },
  lineContainer: {
    position: "absolute",
    width: "100.1%",
    height: "100%",
    flexDirection: "row",
    justifyContent: "center",
  },
  line: {
    width: 1,
    backgroundColor: colors.SignpostingInplayBorderDisabled,
  },
});
