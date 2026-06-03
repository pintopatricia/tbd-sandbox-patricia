import { colors, spacings, typography } from "@ppb/the-wall-common/base-theme";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  titleStyle: {
    ...typography["typography-h580"],
    paddingVertical: spacings["spacing-2"],
    color: colors.NeutralsTextDefault,
  },
  buttons: {
    flexDirection: "row",
  },
  reload: {
    paddingRight: 2,
  },
  title: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  identifier: {
    color: colors.NeutralsTextDefault,
    flexShrink: 1,
    marginRight: 20,
    ...typography["typography-h120"],
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 1,
    borderRadius: 2,
    padding: spacings["spacing-3"],
    backgroundColor: colors.NeutralsBackgroundElevation3,
  },
});

export default styles;
