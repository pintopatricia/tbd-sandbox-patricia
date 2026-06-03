import { FunctionComponent, useCallback } from "react";

import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { NavigationIconName } from "@ppb/the-wall-icons/types";
import { tokens } from "@ppb/the-wall-common/base-theme";
import { Pressable, View } from "react-native";
import { navigate } from "@ppb/tbd-router";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { ComponentProps } from "./props";
import { TEST_ID } from "./OpenBets.native.selectors";
import styles from "./OpenBets.native.styles";

export const OpenBets: FunctionComponent<ComponentProps> = ({ viewLink, dispatchResetFilters }) => {
  const onOpenBetsPress = useCallback(() => {
    if (viewLink) {
      dispatchResetFilters();
      navigate(viewLink);
    }
  }, [dispatchResetFilters, viewLink]);

  if (!viewLink) {
    return null;
  }

  return (
    <Pressable {...getTestProps(TEST_ID)} onPress={onOpenBetsPress}>
      <View style={styles.openBets}>
        <GenericIcon name={NavigationIconName.MY_BETS} color={tokens.MyBetsIconColour} />
      </View>
    </Pressable>
  );
};
