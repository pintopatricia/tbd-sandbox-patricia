import { FunctionComponent, useCallback, useRef } from "react";
import { View, LayoutChangeEvent } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { ObbSquadBetAnimationWrapperProps } from "./props";
import { styles } from "./ObbSquadBetAnimationWrapper.native.styles";

export const ObbSquadBetAnimationWrapper: FunctionComponent<ObbSquadBetAnimationWrapperProps> = ({
  children,
  trigger,
  animationDuration = 500,
}) => {
  const animatedHeight = useSharedValue(0);
  const isFirstMount = useRef(true);
  const lastTrigger = useRef(trigger);

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { height } = event.nativeEvent.layout;

      if (height === 0) return;

      // skip animation on mount
      if (isFirstMount.current) {
        animatedHeight.set(height);
        isFirstMount.current = false;
        lastTrigger.current = trigger;
        return;
      }

      // trigger changed -> animate
      if (lastTrigger.current !== trigger) {
        // TODO: Review if we should remove stiffness or the others
        // withSprint can only be physics-based (damping and stiffness), or duration-based (duration and dampingRatio)
        // https://docs.swmansion.com/react-native-reanimated/docs/animations/withSpring
        animatedHeight.set(
          withSpring(height, {
            duration: animationDuration,
            dampingRatio: 0.55,
          }),
        );
        lastTrigger.current = trigger;
        return;
      }

      // same trigger, just update
      animatedHeight.set(height);
    },
    [trigger, animationDuration, animatedHeight],
  );

  const animatedStyle = useAnimatedStyle(
    () => ({
      height: animatedHeight.value || undefined,
      overflow: "hidden",
    }),
    [],
  );

  return (
    <Animated.View style={[styles.animationWrapper, animatedStyle]}>
      <View onLayout={handleLayout}>{children}</View>
    </Animated.View>
  );
};

export default ObbSquadBetAnimationWrapper;
