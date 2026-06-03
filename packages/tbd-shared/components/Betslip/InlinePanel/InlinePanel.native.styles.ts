import { StyleSheet } from "react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  inlinePanel: {
    width: "100%",
  },
  inlinePanelPink: {
    backgroundColor: tokens.SmColoursSurfaceStaticLayBase,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: tokens.SmColoursBorderStaticExchangeLayBase,
    borderBottomColor: tokens.SmColoursBorderStaticExchangeLayBase,
  },
  inlinePanelBlue: {
    backgroundColor: tokens.SmColoursSurfaceStaticBackBase,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: tokens.SmColoursBorderStaticExchangeBackBase,
    borderBottomColor: tokens.SmColoursBorderStaticExchangeBackBase,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: tokens.SmSpacingXSmall,
    paddingHorizontal: tokens.SmSpacingXSmall,
    paddingVertical: tokens.SmSpacingNone,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.SmSpacingXxxSmall,
    paddingVertical: tokens.SmSpacingSmall,
    paddingHorizontal: tokens.SmSpacingNone,
    flexShrink: 1,
  },
  titlePrefix: {
    ...tokens.SmBodyMediumBase,
    color: tokens.SmColoursTextStaticNeutralBase,
  },
  title: {
    ...tokens.SmHeadingXxSmallStrong,
    color: tokens.SmColoursTextStaticNeutralBase,
    flexShrink: 1,
  },
  action: {
    flexShrink: 0,
    width: tokens.SmSizingAssetsMedium,
    height: tokens.SmSizingAssetsMedium,
    margin: tokens.SmSpacingXSmall,
  },
  content: {
    paddingTop: tokens.SmSpacingNone,
    paddingHorizontal: tokens.SmSpacingXSmall,
    paddingBottom: tokens.SmSpacingXSmall,
  },
});
