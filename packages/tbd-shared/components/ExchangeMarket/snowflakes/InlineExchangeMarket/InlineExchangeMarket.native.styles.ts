import { StyleSheet } from "react-native";
import { heights, spacings } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  inlineExchangeMarket: {
    maxWidth: heights["inline-market-max-width"],
    marginLeft: spacings["spacing-2"],
  },
  inlineExchangeMarketSmall: {
    maxWidth: heights["inline-market-small-max-width"],
  },
  scrollableSwimlane: {
    width: "100%",
  },

  contentContainerStyle: {
    minHeight: heights["bet-button-height"],
  },
  snapGroup: {
    flexDirection: "row",
  },
  snapGroupSmall: {
    flexDirection: "row",
  },

  betButton: {
    flexGrow: 1,
    flexShrink: 0,
    minWidth: heights["bet-button-width"],
  },

  betButtonNotLast: {
    marginRight: 1,
  },

  snapGroupLeft: {
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    overflow: "hidden",
  },

  snapGroupRight: {
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    overflow: "hidden",
  },
});
