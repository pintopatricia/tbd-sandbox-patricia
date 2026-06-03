import { StyleSheet } from "react-native";
import { colors, spacings, tokens, typography } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  defaultGamingContainer: {
    marginVertical: spacings["spacing-3"],
  },
  quickLinksSubtitle: {
    ...typography["typography-h380"],
    margin: spacings["spacing-3"],
    color: colors.NeutralsTextDefault,
  },
  quickLinksContainer: {
    overflow: "hidden",
    ...tokens.QuickLinkCardGap,
    marginHorizontal: spacings["spacing-3"],
    marginBottom: spacings["spacing-6"],
  },
});
