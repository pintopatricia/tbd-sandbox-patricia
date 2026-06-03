import { tokens, spacings } from "@ppb/the-wall-common/base-theme";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  // ErrorFallback
  buttonRow: {
    flexDirection: "row",
    paddingLeft: spacings["spacing-2"],
    marginTop: spacings["spacing-2"],
    justifyContent: "center",
  },
  debugContainer: { justifyContent: "center", margin: spacings["spacing-2"], padding: spacings["spacing-2"] },
  buttonText: { color: tokens.NeutralsTextDefault, fontWeight: "700" },
  button: {
    minWidth: 80,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: tokens.ActionPrimaryIconActive,
    marginRight: spacings["spacing-4"],
    padding: spacings["spacing-2"],
    borderRadius: 2,
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: tokens.NeutralsBackgroundElevation1,
    justifyContent: "center",
  },
});
