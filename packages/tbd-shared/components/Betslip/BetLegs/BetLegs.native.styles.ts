import { StyleSheet } from "react-native";
import { colors, spacings, typography } from "@ppb/the-wall-common/base-theme";

const descriptionStyles = StyleSheet.create({
  description: {
    ...typography["typography-h120"],
    color: colors.ActionSportsbookTextDefault,
    paddingVertical: spacings["spacing-2"],
    paddingRight: spacings["spacing-1"],
    paddingLeft: spacings["spacing-3"],
  },
});

const warningStyles = StyleSheet.create({
  warning: {
    color: colors.MessagingWarningTextDefault,
  },
});

export default StyleSheet.create({
  headerTitle: {
    ...typography["typography-h280"],
    color: colors.ActionSportsbookTextSecondary,
    paddingLeft: spacings["spacing-2"],
  },
  headerTitleWarning: {
    ...typography["typography-h180"],
    color: colors.MessagingWarningTextDefault,
    paddingLeft: spacings["spacing-2"],
    alignSelf: "center",
    flexWrap: "wrap",
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacings["spacing-3"],
  },
  description: { ...descriptionStyles.description },
  descriptionWarning: { ...descriptionStyles.description, ...warningStyles.warning },
  betLegsContent: {
    backgroundColor: colors.ActionSportsbookBackgroundElevation1,
    padding: spacings["spacing-2"],
  },
  betLegsContentWithoutBackground: {
    backgroundColor: "transparent",
  },
  legContainer: {
    marginBottom: spacings["spacing-2"],
  },
});
