import { FunctionComponent, useEffect } from "react";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withDelay,
  withRepeat,
  Easing,
} from "react-native-reanimated";

import { Text } from "@ppb/the-wall-native";
import styles from "./AnimatedIcon.native.styles";
import { ANIMATED_ICON_CONTAINER, ANIMATED_ICON_TEXT } from "./AnimatedIcon.native.selectors";

const AnimatedIcon: FunctionComponent = () => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withDelay(400, withTiming(1.4, { duration: 600, easing: Easing.ease })),
        withTiming(1, { duration: 400, easing: Easing.ease }),
        withDelay(9600, withTiming(1, { duration: 0 })),
        withTiming(0, { duration: 200, easing: Easing.ease }),
      ),
      -1,
    );

    opacity.value = withRepeat(
      withSequence(
        withDelay(400, withTiming(1, { duration: 600, easing: Easing.ease })),
        withTiming(1, { duration: 400, easing: Easing.ease }),
        withDelay(9600, withTiming(1, { duration: 0 })),
        withTiming(0, { duration: 200, easing: Easing.ease }),
      ),
      -1,
    );
  }, [scale, opacity]);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.iconContainer, animatedIconStyle]} {...getTestProps(ANIMATED_ICON_CONTAINER, false)}>
      <Text style={styles.text} {...getTestProps(ANIMATED_ICON_TEXT, false)}>
        NEW
      </Text>
    </Animated.View>
  );
};

export default AnimatedIcon;
