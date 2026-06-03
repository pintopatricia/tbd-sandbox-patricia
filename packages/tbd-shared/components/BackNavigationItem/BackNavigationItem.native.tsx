import { FunctionComponent, useCallback } from "react";
import { View, Pressable } from "react-native";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { SystemIconName } from "@ppb/the-wall-icons";
import { useNavigation } from "@react-navigation/native";
import { tokens } from "@ppb/the-wall-common/base-theme";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { Text } from "@ppb/the-wall-native";
import styles from "./BackNavigationItem.native.styles";
import { ComponentProps } from "./props";
import selectors from "./BackNavigationItem.native.selectors";

const BackNavigationItem: FunctionComponent<ComponentProps> = ({ title, dispatchGamingBackButtonClickAction }) => {
  const navigation = useNavigation();

  const onBackClick = useCallback(() => {
    navigation.goBack();
    dispatchGamingBackButtonClickAction();
  }, [navigation, dispatchGamingBackButtonClickAction]);

  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={onBackClick} {...getTestProps(selectors.BACK_NAVIGATION, false)}>
        <GenericIcon name={SystemIconName.ARROW_BIG_LEFT} color={tokens.PrimaryButtonPrimaryDefaultTextLabelColour} />
      </Pressable>
      <Text style={styles.content} numberOfLines={1} ellipsizeMode="tail">
        {title}
      </Text>
    </View>
  );
};

export default BackNavigationItem;
