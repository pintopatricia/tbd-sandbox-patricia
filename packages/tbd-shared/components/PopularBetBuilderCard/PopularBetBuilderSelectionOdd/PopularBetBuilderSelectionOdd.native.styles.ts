import { StyleSheet } from "react-native";

import { colors, typography } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  racingTitle: {
    ...typography["typography-h158"],
  },
  defaultTitle: {
    ...typography["typography-h180"],
  },
  titleInfo: {
    color: colors.NeutralsTextDefault,
    flexWrap: "wrap",
    flexShrink: 0,
  },
});
