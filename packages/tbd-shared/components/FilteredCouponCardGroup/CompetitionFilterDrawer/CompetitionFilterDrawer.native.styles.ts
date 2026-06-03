import { colors, spacings, typography } from "@ppb/the-wall-common/base-theme";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  headerContentContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexGrow: 1,
  },
  chip: {
    flexShrink: 0,
    marginRight: spacings["spacing-3"],
  },
  firstChip: {
    paddingLeft: spacings["spacing-3"],
  },
  sectionTitle: {
    marginVertical: spacings["spacing-3"],
    ...typography["typography-h158"],
    color: colors.NeutralsTextDefault,
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: colors.NeutralsBorderElevation2,
  },
  drawerContentWithPadding: {
    paddingHorizontal: 0,
  },
  drawerContentWithPaddingCheckbox: {
    paddingLeft: spacings["spacing-6"],
  },
  placeholderContainer: {
    height: 400,
    padding: spacings["spacing-2"],
  },
  placeholder: {
    backgroundColor: colors.NeutralsBackgroundElevation5,
    borderRadius: 4,
  },
});
