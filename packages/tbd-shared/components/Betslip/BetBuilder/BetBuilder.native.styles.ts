import { StyleSheet } from "react-native";
import { colors, spacings, typography, heights } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  container: {
    gap: spacings["spacing-2"],
  },
  subtitle: {
    color: colors.NeutralsTextDefault,
    ...typography["typography-h152"],
  },

  title: {
    color: colors.NeutralsTextDefault,
    ...typography["typography-h280"],
  },

  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  popularBadge: {
    flexDirection: "row",
    paddingVertical: spacings["spacing-1"],
    paddingHorizontal: spacings["spacing-2"],
    borderRadius: 4,
    backgroundColor: colors.MessagingWarningBackgroundElevation2,
  },

  popularIcon: {
    width: heights["icon-size-small"],
    height: heights["icon-size-small"],
  },

  popularLabel: {
    marginLeft: spacings["spacing-1"],
    ...typography["typography-h098"],
    color: colors.NeutralsTextDefault,
  },
});
