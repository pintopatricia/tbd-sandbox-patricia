import { StyleSheet } from "react-native";
import { colors, heights, spacings, typography } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  combinationsList: {
    flexDirection: "column",
  },
  withoutMore: {
    borderBottomColor: colors.ActionSportsbookBackgroundElevation1,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    borderBottomWidth: 1,
  },
  header: {
    flexDirection: "row",
    backgroundColor: colors.ActionSportsbookBackgroundElevation3,
    height: 32,
    borderRadius: 4,
  },
  headerOpen: {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  headerIcon: {
    color: colors.ActionSportsbookTextDefault,
    width: heights["icon-size"],
    height: heights["icon-size"],
  },
  headerCell: {
    justifyContent: "center",
    alignContent: "center",
  },
  headerId: {
    width: 20,
  },
  headerTitleContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  headerOdd: {
    width: 64,
    alignItems: "center",
    textAlign: "center",
    color: colors.ActionSportsbookTextDefault,
    ...typography["typography-h098"],
  },
  headerPayout: {
    width: 100,
    alignItems: "center",
    textAlign: "center",
    color: colors.ActionSportsbookTextDefault,
    ...typography["typography-h098"],
  },
  headerTitle: {
    color: colors.ActionSportsbookTextDefault,
    ...typography["typography-h098"],
  },
  line: {
    display: "flex",
    flexDirection: "row",
    borderBottomColor: colors.ActionSportsbookBackgroundElevation1,
    borderBottomWidth: 1,
  },
  lastLine: {
    borderBottomWidth: 0,
  },
  lineCell: {
    flex: 1,
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
    borderRightColor: colors.ActionSportsbookBackgroundElevation1,
    borderRightWidth: 1,
    padding: spacings["spacing-1"],
  },
  idCell: {
    flex: 0,
    padding: 0,
    width: 20,
    textAlign: "center",
    backgroundColor: colors.ActionSportsbookBackgroundElevation1,
    borderRightWidth: 0,
  },
  id: {
    textAlign: "center",
    ...typography["typography-h078"],
    color: colors.ActionSportsbookTextDefault,
  },
  content: {
    flex: 1,
  },
  oddCell: {
    flex: 0,
    width: 64,
    padding: spacings["spacing-1-and-half"],
  },
  odd: {
    ...typography["typography-h098"],
    color: colors.NeutralsTextDefault,
  },
  payoutCell: {
    flex: 0,
    width: 100,
  },
  payout: {
    textAlign: "center",
    ...typography["typography-h098"],
    color: colors.NeutralsTextDefault,
  },
  headerContainer: {
    justifyContent: "center",
    minHeight: 54,
    paddingVertical: spacings["spacing-3"],
    paddingHorizontal: spacings["spacing-2"],
  },
  moreButton: {
    height: 32,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.ActionSportsbookBackgroundElevation3,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  moreIcon: {
    width: heights["icon-size"],
    height: heights["icon-size"],
  },
  moreLabel: {
    color: colors.ActionSportsbookTextDefault,
    ...typography["typography-h182"],
  },
});
