import { StyleSheet } from "react-native";
import { spacings } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  divider: {
    paddingVertical: spacings["spacing-2"],
  },
  liabilityContainer: {
    flexDirection: "row",
  },
  liability: {
    flexBasis: "40%",
  },
  cashout: {
    flexBasis: "60%",
  },
});
