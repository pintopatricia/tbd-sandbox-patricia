import { StyleSheet } from "react-native";

import { spacings } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  inputsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  firstInput: {
    flexDirection: "row",
    flexGrow: 1,
    flexBasis: 1,
    marginRight: spacings["spacing-1"],
  },
  lastInput: {
    flexDirection: "row",
    flexGrow: 1,
    flexBasis: 1,
    marginLeft: spacings["spacing-1"],
  },
  freebets: {
    marginTop: spacings["spacing-2"],
  },
  placeButton: {
    marginTop: spacings["spacing-2"],
    marginBottom: spacings["spacing-1"],
  },
  notifications: {
    marginTop: spacings["spacing-2"],
  },
  quickStakes: {
    paddingVertical: spacings["spacing-1"],
  },
});
