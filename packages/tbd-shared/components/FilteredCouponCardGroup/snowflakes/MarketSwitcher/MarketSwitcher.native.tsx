import { tokens } from "@ppb/the-wall-common/base-theme";
import { SystemIconName } from "@ppb/the-wall-icons";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { FunctionComponent, useCallback, useMemo } from "react";
import { Pressable, View } from "react-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { Text } from "@ppb/the-wall-native";
import { MarketSwitcherProps } from "./MarketSwitcher.types";
import {
  MARKET_SWITCHER,
  MARKET_SWITCHER_BUTTON,
  MARKET_SWITCHER_TITLE,
  MARKET_SWITCHER_ICON,
  MARKET_SWITCHER_LABEL_CONTAINER,
  MARKET_SWITCHER_LABEL,
} from "./MarketSwitcher.native.selectors";
import styles from "./MarketSwitcher.native.styles";

export const MarketSwitcher: FunctionComponent<MarketSwitcherProps> = ({ onTap, title, label, value }) => {
  const onTapAction = useCallback(() => {
    onTap(value);
  }, [onTap, value]);

  const renderItem = useMemo(
    () => (
      <>
        {!!title && (
          <Text {...getTestProps(MARKET_SWITCHER_TITLE)} style={styles.title}>
            {title}
          </Text>
        )}
        <View {...getTestProps(MARKET_SWITCHER_LABEL_CONTAINER, false)} style={styles.labelContainer}>
          <Text {...getTestProps(MARKET_SWITCHER_LABEL)} style={styles.label} numberOfLines={1}>
            {label}
          </Text>

          <View {...getTestProps(MARKET_SWITCHER_ICON, false)} style={styles.icon}>
            <GenericIcon name={SystemIconName.CHEVRON_DOWN} color={tokens.MarketSwitcherIconColour} />
          </View>
        </View>
      </>
    ),
    [label, title],
  );
  return (
    <View {...getTestProps(MARKET_SWITCHER, false)}>
      <Pressable {...getTestProps(MARKET_SWITCHER_BUTTON, false)} style={styles.marketSwitcher} onPress={onTapAction}>
        {renderItem}
      </Pressable>
    </View>
  );
};
