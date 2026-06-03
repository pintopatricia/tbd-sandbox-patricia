import { spacings } from "@ppb/the-wall-common/base-theme";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  single: {
    gap: spacings["spacing-2"],
  },
  betDetails: {
    overflow: "hidden",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
  },
  signposting: {
    alignSelf: "flex-end",
    flexDirection: "row",
    height: 24,
  },
});
