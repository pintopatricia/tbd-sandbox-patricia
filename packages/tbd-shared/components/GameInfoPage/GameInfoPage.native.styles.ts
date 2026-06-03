import { StyleSheet } from "react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  gameInfoPage: {
    flex: 1,
    ...tokens.ModalVerticalGap,
  },

  gameInfoViewContainer: {
    flex: 1,
  },

  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    ...tokens.GameInfoThumbnailPadding,
    ...tokens.GameInfoHorizontalGap,
  },

  link: {
    flex: 1,
    justifyContent: "space-between",
    alignSelf: "stretch",
    textDecorationLine: "none",
  },
});
