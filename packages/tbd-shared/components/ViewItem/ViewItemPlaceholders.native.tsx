import { withStyle } from "@ppb/the-wall-native";
import { spacings } from "@ppb/the-wall-common/base-theme";
import SwimlaneCardGroupPlaceholder from "../SwimlaneCardGroup/SwimlaneCardGroupPlaceholder.native";

export const NavigationTabsListPlaceholder = withStyle(SwimlaneCardGroupPlaceholder, {
  height: 166,
  margin: spacings["spacing-3"],
});
