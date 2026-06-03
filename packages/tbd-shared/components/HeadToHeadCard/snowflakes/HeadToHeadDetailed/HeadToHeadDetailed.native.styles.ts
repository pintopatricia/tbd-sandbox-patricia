import { StyleSheet } from "react-native";
import { colors, spacings } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  headToHeadDetailedContainer: {
    flex: 1,
    justifyContent: "space-between",
  },

  headToHeadResultContainer: {
    marginVertical: spacings["spacing-6"],
    borderBottomWidth: 1,
    borderBottomColor: colors.NeutralsBorderElevation1,
  },

  caption: {
    marginTop: spacings["spacing-6"],
    marginBottom: spacings["spacing-3"],
    paddingHorizontal: spacings["spacing-3"],
  },
});
