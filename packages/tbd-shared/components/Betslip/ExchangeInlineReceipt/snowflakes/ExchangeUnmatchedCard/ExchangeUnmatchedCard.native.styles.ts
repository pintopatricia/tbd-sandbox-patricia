import { ImageStyle, StyleSheet } from "react-native";
import { spacings } from "@ppb/the-wall-common/base-theme";

const actionItem: ImageStyle = {
  flexGrow: 1,
  flexShrink: 1,
  flexBasis: "50%",
};

export default StyleSheet.create({
  notificationsSpaced: {
    marginBottom: spacings["spacing-2"],
  },
  actions: {
    flexDirection: "row",
  },
  actionItem,
  actionItemSecondary: {
    ...actionItem,
    marginRight: spacings["spacing-2"],
  },
});
