import { StyleSheet } from "react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  carouselContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  scrollContainer: {
    flexDirection: "row",
  },
  itemWrapper: {
    alignSelf: "center",
    marginRight: tokens.BetButtonCarouselButtonsHorizontalGap.gap,
    height: tokens.PriceButtonSbkContainerSizing,
  },
  arrowButton: {
    height: tokens.PriceButtonSbkContainerSizing,
    justifyContent: "center",
    alignItems: "center",
  },
  arrowButtonLeft: {
    marginRight: tokens.BetButtonCarouselSwimlaneHorizontalGap.gap,
  },
  arrowButtonRight: {
    marginLeft: tokens.BetButtonCarouselSwimlaneHorizontalGap.gap - tokens.BetButtonCarouselButtonsHorizontalGap.gap,
  },
  arrowIconWrapper: {
    height: tokens.BetButtonCarouselIconSizing,
    width: tokens.BetButtonCarouselIconSizing,
  },
  scrollOuterContainer: {
    flex: 1,
  },
  scrollContainerPlaceholder: {
    width: "100%",
    flexDirection: "row",
    height: tokens.PriceButtonSbkContainerSizing,
    position: "absolute",
  },
  itemPlaceholder: {
    marginRight: tokens.BetButtonCarouselButtonsHorizontalGap.gap,
    flex: 1,
  },
});
