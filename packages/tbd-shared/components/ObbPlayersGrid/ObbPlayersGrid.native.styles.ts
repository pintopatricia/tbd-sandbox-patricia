import { spacings } from "@ppb/the-wall-common/base-theme";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },

  flatListContainer: {
    justifyContent: "flex-start",
    gap: spacings["spacing-2"],
  },

  player: {
    marginBottom: spacings["spacing-2"],
  },
});

export default styles;
