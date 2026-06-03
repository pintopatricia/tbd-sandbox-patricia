import { StyleSheet } from "react-native";

import { tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  favouriteIcon: {
    paddingHorizontal: tokens.SmSpacingXSmall,
  },
  pressable: {
    alignItems: "center",
    justifyContent: "center",
    gap: tokens.SmSpacingXxxSmall,
  },
  iconContainer: {
    position: "relative",
    height: tokens.SmSizingAssetsMedium,
    width: tokens.SmSizingAssetsMedium,
  },
  targetArea: {
    position: "absolute",
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
  },
});
