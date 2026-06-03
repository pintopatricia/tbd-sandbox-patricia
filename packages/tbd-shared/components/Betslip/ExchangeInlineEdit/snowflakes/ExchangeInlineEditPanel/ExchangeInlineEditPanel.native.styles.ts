import { StyleSheet } from "react-native";

import { tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: tokens.SmSpacingXSmall,
    gap: tokens.SmSpacingXSmall,
  },
  item: {
    flexDirection: "row",
    flexGrow: 1,
    flexBasis: 1,
  },
  paddingBottom: {
    paddingBottom: tokens.SmSpacingXSmall,
  },
  persistence: {
    backgroundColor: tokens.AgnosticNeutralsBackgroundTransparency1,
    marginBottom: tokens.SmSpacingXxxSmall,
    borderRadius: 4,
  },
  collapseChildren: {
    padding: tokens.SmSpacingXSmall,
  },
  quickStakes: {
    paddingVertical: tokens.SmSpacingXxxSmall,
  },
  notifications: {
    marginBottom: tokens.SmSpacingXSmall,
  },
});
