import { StyleSheet } from "react-native";
import { typography, colors, spacings } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    justifyContent: "space-between",
    alignItems: "center",
  },
  skyLogoView: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  eflView: {
    flexDirection: "row",
    alignItems: "center",
    gap: 30,
  },
  saferGamblingView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 88,
  },
  image: {
    height: 30,
    width: 286,
  },
  title: {
    ...typography["typography-h380"],
    color: colors.PromotionalIndicatorTextColour,
    marginTop: spacings["spacing-4"],
  },
  eflText: {
    marginHorizontal: 50,
    color: "#00277C",
    textAlign: "center",
    fontFamily: "SSportsD",
    fontSize: 16,
    fontStyle: "italic",
    fontWeight: "500",
    lineHeight: 20,
  },
  logosContainer: {
    marginBottom: 40,
    alignItems: "center",
    gap: 20,
  },
  version: {
    marginHorizontal: 12,
    ...typography["typography-h280"],
    color: colors.PromotionalIndicatorTextColour,
  },
});
