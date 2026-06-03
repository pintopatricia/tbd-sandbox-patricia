import { StyleSheet } from "react-native";
import { colors, gutters, heights, spacings, typography, tokens } from "@ppb/the-wall-common/base-theme";

const containerHeight =
  heights["gaming-card-size"] + spacings["spacing-card-top-default"] + typography["typography-h158"].lineHeight;
const gutterTop = 2 * spacings["spacing-card-top-default"] + typography["typography-h158"].lineHeight;
const gutterHeight = heights["gaming-card-size"] - 2 * spacings["spacing-card-top-default"];

export default StyleSheet.create({
  scrollableContainer: {
    flexDirection: "row",
    flexWrap: "nowrap",
    height: containerHeight,
  },
  scrollSection: {
    flexDirection: "row",
    ...tokens.ScrollableSwimlaneSwimlaneHorizontalGap,
    ...tokens.ScrollableSwimlaneSwimlanePadding,
  },
  item: {
    flexDirection: "row",
    flexWrap: "nowrap",
  },
  sectionGutter: {
    width: gutters["gutter-1"],
    height: gutterHeight,
    backgroundColor: colors.NeutralsBackgroundElevation5,
    marginTop: gutterTop,
  },
  placeholder: {
    height: containerHeight,
    width: heights["gaming-card-size"] + spacings["spacing-3"],
  },
  placeholderTitle: {
    height: typography["typography-h158"].lineHeight,
    width: heights["gaming-card-size"] / 2,
    marginBottom: spacings["spacing-3"],
    backgroundColor: colors.NeutralsBackgroundElevation2,
  },
  segmentedCardPlaceholder: {
    width: heights["gaming-card-size"],
    height: heights["gaming-card-size"],
    backgroundColor: colors.NeutralsBackgroundElevation2,
  },
});
