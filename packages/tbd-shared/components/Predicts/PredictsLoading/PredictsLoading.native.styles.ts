import { StyleSheet } from "react-native";
import { colors, spacings } from "@ppb/the-wall-common/base-theme";

export const PREDICTS_LOADING_YES_BG = "#395ACF";
export const PREDICTS_LOADING_NO_BG = "#CE3970";

export const BUTTON_WIDTH_PX = 220.19;
export const BUTTON_HEIGHT_PX = 52;
export const NATIVE_FLIP_TRANSLATE_PX = 57;
export const DOT_TRANSLATE_PX = 6;

export default StyleSheet.create({
  predictsLoading: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.SmColoursSurfaceStaticBrandPrimaryBase,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
  },
  logo: {
    width: "72%",
    maxWidth: 320,
    minWidth: 200,
    height: 120,
  },
  stack: {
    marginTop: spacings["spacing-10"],
    alignItems: "center",
    width: BUTTON_WIDTH_PX,
  },
  buttonShadow: {
    width: BUTTON_WIDTH_PX,
    shadowOffset: { width: 0, height: 9.75 },
    shadowOpacity: 0.8,
    shadowRadius: 26,
    elevation: 8,
  },
  button: {
    width: BUTTON_WIDTH_PX,
    height: BUTTON_HEIGHT_PX,
    borderRadius: 3.25,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonInnerHighlight: {
    width: 0,
    height: 0,
  },
  buttonInnerShadow: {
    width: 0,
    height: 0,
  },
  label: {
    width: BUTTON_WIDTH_PX,
    height: BUTTON_HEIGHT_PX,
    textAlignVertical: "center",
    fontFamily: "Noto Sans",
    fontSize: 20,
    lineHeight: 29,
    fontWeight: "700",
    color: "#D9D9D9",
    textTransform: "uppercase",
    textAlign: "center",
    includeFontPadding: false,
  },
  footer: {
    position: "absolute",
    bottom: 48,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  dots: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacings["spacing-4"],
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#000000",
    marginHorizontal: 3.5,
  },
  caption: {
    fontFamily: "Noto Sans",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400",
    color: "#444446",
    textAlign: "center",
  },
});
