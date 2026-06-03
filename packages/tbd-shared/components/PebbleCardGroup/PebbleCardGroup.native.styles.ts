import { StyleSheet } from "react-native";

import { colors, spacings, tokens, typography } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  marketContainer: {
    marginHorizontal: spacings["spacing-3"],
  },
  titleContainer: {
    paddingVertical: spacings["spacing-3"],
    paddingLeft: spacings["spacing-3"],
    width: "100%",
    textAlign: "left",
  },
  title: {
    ...typography["typography-h280"],
    color: colors.NeutralsTextDefault,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacings["spacing-4"],
  },
  outerTitle: {
    ...typography["typography-h380"],
    color: colors.NeutralsTextDefault,
  },
  shell: {
    paddingHorizontal: spacings["spacing-3"],
  },
  collapseEndElements: {
    ...tokens.CardHorizontalGap,
    flexDirection: "row",
  },
});
