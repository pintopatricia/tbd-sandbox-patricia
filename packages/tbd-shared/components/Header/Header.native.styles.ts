import { tokens } from "@ppb/the-wall-common/base-theme";
import { StyleSheet } from "react-native";
import { shadowStyle } from "react-native-fast-shadow";

export default StyleSheet.create({
  hamburgerMenu: {
    flex: 1,
  },
  shadow: {
    zIndex: 1,
    ...shadowStyle({
      color: tokens.HeaderContainerDropShadow.shadowColor,
      opacity: tokens.HeaderContainerDropShadow.shadowOpacity,
      radius: tokens.HeaderContainerDropShadow.shadowRadius,
      offset: [
        tokens.HeaderContainerDropShadow.shadowOffset.width,
        tokens.HeaderContainerDropShadow.shadowOffset.height,
      ],
    }),
  },
});
