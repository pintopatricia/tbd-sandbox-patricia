import { FunctionComponent, useCallback, useState } from "react";
import { Button, View, Switch, DevSettings } from "react-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { colors } from "@ppb/the-wall-common/base-theme";
import { Text } from "@ppb/the-wall-native";
import { ComponentProps } from "./props";
import styles from "./Throttles.native.styles";

type ThrottleItemProps = {
  item: {
    id: string;
    isActive: boolean;
  };
  onChangeThrottle: (id: string, newValue: boolean) => void;
};

const ThrottleItem: FunctionComponent<ThrottleItemProps> = ({ item, onChangeThrottle }) => {
  const { id, isActive } = item;
  const [isThrottleActive, setThrottleActive] = useState(isActive);
  const onChangeThrottleGuard = useCallback(
    (newValue: boolean) => {
      setThrottleActive(newValue);
      onChangeThrottle(id, newValue);
    },
    [id, onChangeThrottle],
  );

  return (
    <View style={styles.item}>
      <Text style={styles.identifier} {...getTestProps("throttles-id", false)}>
        {id}
      </Text>
      <Switch
        trackColor={{ false: colors.ActionQuaternaryBackgroundOff, true: colors.ActionQuaternaryBackgroundOn }}
        thumbColor={colors.ActionQuaternaryIconDefault}
        value={isThrottleActive}
        onValueChange={onChangeThrottleGuard}
        {...getTestProps("throttles-switch", false)}
      ></Switch>
    </View>
  );
};

export const Throttles: FunctionComponent<ComponentProps> = ({
  throttles,
  dispatchSetThrottlesAction,
  dispatchResetThrottlesAction,
}) => {
  const [overridenThrottles, setOverridenThrottles] = useState({});

  const onThrottleChange = useCallback(
    (id: string, isActive: boolean) => {
      const updatedOverridenThrottles = {
        ...overridenThrottles,
        [id]: { isActive, isOverriden: true },
      };
      setOverridenThrottles(updatedOverridenThrottles);

      dispatchSetThrottlesAction(updatedOverridenThrottles);
    },
    [dispatchSetThrottlesAction, overridenThrottles],
  );

  const onResetPress = useCallback(() => {
    dispatchResetThrottlesAction();
    DevSettings.reload();
  }, [dispatchResetThrottlesAction]);

  const onReloadPress = useCallback(() => {
    DevSettings.reload();
  }, []);

  return (
    <View {...getTestProps("throttles", false)}>
      <View style={styles.title} {...getTestProps("throttles-title-section", false)}>
        <Text style={styles.titleStyle} {...getTestProps("throttles-title", false)}>
          Throttles
        </Text>
        <View style={styles.buttons}>
          <View style={styles.reload}>
            <Button
              color={colors.ActionPrimaryTextDefault}
              title={"Reload"}
              onPress={onReloadPress}
              {...getTestProps("throttles-reload", false)}
            ></Button>
          </View>
          <Button
            color={colors.ActionPrimaryTextDefault}
            title={"Reset"}
            onPress={onResetPress}
            {...getTestProps("throttles-reset", false)}
          ></Button>
        </View>
      </View>
      <View>
        {throttles.map((item) => (
          <ThrottleItem key={item.id} item={item} onChangeThrottle={onThrottleChange} />
        ))}
      </View>
    </View>
  );
};

export default Throttles;
