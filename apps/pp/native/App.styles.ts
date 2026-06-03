import { colors, stackings, typography } from "@ppb/the-wall-common/base-theme";
import { DarkTheme, Theme } from "@react-navigation/native";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  // solves issue where whilst navigator is loading the screen is white
  rootBackground: { backgroundColor: colors.NeutralsBackgroundElevation1, ...StyleSheet.absoluteFillObject },
  fallbackText: {
    ...typography["typography-h152"],
    color: colors.NeutralsTextDefault,
    alignSelf: "center",
  },
  screenCentered: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  activityIndicator: {
    flex: 1,
    justifyContent: "center",
  },
  safeAreaView: {
    flex: 1,
  },
  feedbackButton: {
    zIndex: stackings["overlay-stack"],
    alignItems: "center",
    position: "absolute",
    left: 0,
    top: 205,
  },
  feedbackWVContainer: {
    alignSelf: "center",
    width: 320,
    height: 360,
  },
});

/**
 * App theme defaults
 * The CustomTheme is a temporary one. The final theme should come from the-wall-common
 */
export const CustomTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.NeutralsTextDefault,
    background: colors.NeutralsBackgroundElevation1,
    text: colors.NeutralsTextDefault,
    card: colors.NeutralsBackgroundElevation1,
  },
};
