import { StyleSheet } from "react-native";
import { spacings } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  container: {
    width: "100%",
    gap: spacings["spacing-2"],
  },

  icon: {
    alignSelf: "flex-end",
    width: 87,
    height: 24,
  },

  controls: {
    marginTop: spacings["spacing-4"],
  },
});
