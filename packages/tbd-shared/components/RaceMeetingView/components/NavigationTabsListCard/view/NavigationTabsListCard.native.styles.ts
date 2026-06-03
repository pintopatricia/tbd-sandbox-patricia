import { StyleSheet } from "react-native";

import { spacings, tokens } from "@ppb/the-wall-common/base-theme";

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContent: {
    ...tokens.TabsGroupRegularVerticalGap,
    marginTop: tokens.TabsGroupRegularVerticalGap.gap,
  },
  tabItem: {
    paddingHorizontal: spacings["spacing-1"],
  },
  placeholder: {
    height: 300,
  },
});
