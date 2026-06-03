import { spacings, tokens, typography } from "@ppb/the-wall-common/base-theme";
import { StyleSheet } from "react-native";

export const legacyColors = {
  "grey-400": "#8C8C90",
};

const styles = StyleSheet.create({
  titleStyle: {
    ...typography["typography-h580"],
    paddingVertical: spacings["spacing-2"],
    color: tokens.NeutralsTextDefault,
    flexGrow: 1,
  },
  environmentsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    color: tokens.NeutralsTextDefault,
    borderRadius: 4,
    padding: spacings["spacing-2"],
    borderWidth: 1,
    borderColor: legacyColors["grey-400"],
  },
  buttons: {
    flexDirection: "row",
  },
  reload: {
    paddingRight: 2,
  },
  inlineContainer: { flexDirection: "row", alignItems: "center" },
  label: { color: tokens.NeutralsTextDefault },
  radioForm: { paddingTop: spacings["spacing-2"] },
  title: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  identifier: {
    color: tokens.NeutralsTextDefault,
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
    backgroundColor: tokens.NeutralsBackgroundElevation3,
  },
  gameDebugContainer: {
    gap: 5,
    marginTop: 10,
  },
});

export default styles;
