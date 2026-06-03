import { StyleSheet } from "react-native";
import { spacings, tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  card: {
    marginHorizontal: spacings["spacing-3"],
  },
  packagedCreatedBetsContainer: {
    margin: spacings["spacing-3"],
    gap: spacings["spacing-3"],
  },
  collapseHeader: {
    flexDirection: "row",
    alignItems: "center",
    ...tokens.PopularBetBuilderCardHeaderHorizontalGap,
  },
  opportunitiesList: {
    ...tokens.RunnerVerticalGap,
  },
  collapseHeaderIconContainer: {
    height: tokens.PopularBetBuilderCardHeaderBoostIconBoxSizing,
    width: tokens.PopularBetBuilderCardHeaderBoostIconBoxSizing,
    ...tokens.PopularBetBuilderCardHeaderBoostIconBoxPadding,
    ...tokens.PopularBetBuilderCardHeaderBoostIconBoxBorderRadius,
    backgroundColor: tokens.PopularBetBuilderCardHeaderBoostIconBoxColour,
  },
  collapseHeaderIcon: {
    height: tokens.PopularBetBuilderCardHeaderBoostIconSizing,
    width: tokens.PopularBetBuilderCardHeaderBoostIconSizing,
  },
});
