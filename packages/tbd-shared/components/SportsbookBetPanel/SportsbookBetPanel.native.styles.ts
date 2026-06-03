import { StyleSheet } from "react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  container: {
    ...tokens.SportsbookBetPanelContainerVerticalGap,
    backgroundColor: tokens.SportsbookBetPanelBackgroundColour,
    ...tokens.SportsbookBetPanelBorderRadius,
    overflow: "hidden",
  },
  containerBody: {
    ...tokens.SportsbookBetPanelContainerVerticalGap,
    ...tokens.SportsbookBetPanelContainerPadding,
  },
  headerContainer: {
    ...tokens.BetTitleVerticalGap,
    ...tokens.BetTitlePadding,
    backgroundColor: tokens.BetTitleBackgroundColour,
  },
  title: {
    ...tokens.BetTitleTitleTypography,
    color: tokens.BetTitleTextTitleColour,
    flexShrink: 1,
  },
  titleIndicatorsContainer: {
    flexDirection: "row",
    ...tokens.BetTitleHorizontalGap,
  },
  statusLabelContainer: {
    flex: 1,
    ...tokens.BetTitleVerticalGap,
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    ...tokens.BetTitleHorizontalGap,
  },
  button: {
    width: tokens.SupportingContentButtonMinWidth,
  },
  subtitle: {
    ...tokens.BetTitleSubtitleTypography,
    color: tokens.BetTitleTextSubtitleColour,
    flexShrink: 1,
    flexGrow: 1,
  },
  supportingText: {
    ...tokens.BetTitleSupportingTextTypography,
    color: tokens.BetTitleTextSupportingTextColour,
    flexShrink: 1,
    flexGrow: 1,
  },
  supportingTextContainer: {
    flexDirection: "row",
    ...tokens.BetTitleHorizontalGap,
    alignItems: "center",
  },
  betSegmentInfo: {
    flexDirection: "row",
    flexWrap: "wrap",
    ...tokens.SportsbookBetPanelLabelsHorizontalGap,
  },
});
