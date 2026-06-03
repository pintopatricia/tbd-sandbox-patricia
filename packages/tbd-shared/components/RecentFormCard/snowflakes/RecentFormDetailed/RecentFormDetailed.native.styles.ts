import { StyleSheet } from "react-native";
import { colors, spacings } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "space-between",
  },
  resultsContainer: {
    paddingVertical: spacings["spacing-6"],
  },
  resultContainer: {
    flexDirection: "row",
  },
  homeContainer: {
    flexBasis: "50%",
    paddingVertical: spacings["spacing-4"],
    paddingRight: spacings["spacing-4"],
    borderRightWidth: 1,
    borderColor: colors.NeutralsBorderElevation1,
  },
  awayContainer: {
    flexBasis: "50%",
    paddingVertical: spacings["spacing-4"],
    paddingLeft: spacings["spacing-4"],
  },
  innerContainerFirst: {
    paddingTop: 0,
  },
  innerContainerLast: {
    paddingBottom: 0,
  },
  caption: {
    margin: spacings["spacing-3"],
    marginTop: 0,
  },
});
