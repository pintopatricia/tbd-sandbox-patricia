import { StyleSheet } from "react-native";
import { spacings, tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  container: {
    paddingHorizontal: spacings["spacing-3"],
  },
  containerTopMargin: {
    marginTop: spacings["spacing-4"],
  },
  listHeaderComponentStyle: {
    zIndex: 1,
  },
  itemsList: {
    height: "100%",
  },
  myBetsHeaderContainer: {
    marginHorizontal: -spacings["spacing-3"],
  },
  emptyState: {
    alignItems: "center",
    padding: spacings["spacing-6"],
  },
  emptyStateImage: {
    width: 300,
    height: 197,
    marginBottom: spacings["spacing-3"],
  },
  emptyStateSubtitle: {
    ...tokens.EmptyStateSupportingTextTypography,
    color: tokens.EmptyStateTextSupportingTextColour,
    textAlign: "center",
  },
  swimlane: {
    paddingTop: spacings["spacing-3"],
  },
  dynamicToastListStyleContainer: {
    position: "absolute",
    right: spacings["spacing-3"],
    bottom: spacings["spacing-2"],
    left: spacings["spacing-3"],
  },
  dynamicToastList: {
    display: "flex",
    flexDirection: "column-reverse",
    gap: spacings["spacing-2"],
  },
  headerActionContainer: {
    ...tokens.MyBetsHeaderContentMobilePadding,
    zIndex: 1,
    display: "flex",
    flexDirection: "row",

    alignItems: "center",
    ...tokens.MyBetsHeaderHorizontalGap,
  },
  segmentedControlContainer: {
    flex: 1,
  },
});
