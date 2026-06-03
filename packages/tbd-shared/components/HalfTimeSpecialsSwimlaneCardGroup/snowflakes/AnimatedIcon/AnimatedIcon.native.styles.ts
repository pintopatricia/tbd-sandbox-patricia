import { StyleSheet } from "react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";

const styles = StyleSheet.create({
  iconContainer: {
    position: "relative",

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: tokens.StatusLabelBrandedBackgroundColour,
    ...tokens.StatusLabelBorderRadius,
  },
  text: {
    flex: 1,

    zIndex: 1,

    ...tokens.StatusLabelSmallPadding,
    ...tokens.StatusLabelTextSmallTypography,

    color: tokens.StatusLabelBrandedLabelColour,

    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    textAlignVertical: "center",
  },
});

export default styles;
