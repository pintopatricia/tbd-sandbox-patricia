import { StyleSheet } from "react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  container: {
    ...tokens.SupportingContentCardGroupPadding,
    ...tokens.SupportingContentCardGroupVerticalGap,
  },
  content: {
    ...tokens.SupportingContentCardGroupContentCardPadding,
    backgroundColor: tokens.SupportingContentCardGroupContentCardBackground,
  },
  scrollView: {
    flexGrow: 1,
    ...tokens.ScrollableSwimlaneVerticalGap,
  },
  swimlaneItem: {
    flexGrow: 1,
    flexBasis: 0,
  },
  swimlaneItemTwoItems: {
    width: 0,
  },
});
