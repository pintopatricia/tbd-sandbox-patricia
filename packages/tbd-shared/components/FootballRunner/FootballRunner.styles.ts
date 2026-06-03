import { tokens } from "@ppb/the-wall-common/base-theme";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  leftColumn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.SmSpacingXxxSmall,
  },
  jerseyContainer: {
    width: 32,
    height: 32,
  },
  jerseyImage: {
    width: 32,
    height: 32,
  },
  runnerName: {
    overflow: "hidden",
    flex: 1,
    color: tokens.SmColoursTextStaticNeutralBase,
    ...tokens.SmBodyMediumBase,
  },
  runnerStats: {
    flexDirection: "row",
    gap: 4,
  },
  statName: {
    color: tokens.SmColoursTextStaticNeutralBase,
    ...tokens.SmBodySmallBase,
  },
  statValue: {
    color: tokens.SmColoursTextStaticNeutralBase,
    ...tokens.SmBodySmallStrong,
  },
  rightColumn: {
    flexDirection: "row",
  },
});

export default styles;
