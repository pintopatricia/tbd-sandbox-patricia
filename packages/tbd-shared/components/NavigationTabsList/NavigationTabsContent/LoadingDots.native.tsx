import { memo, useEffect } from "react";
import Svg, { Circle } from "react-native-svg";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedProps,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { tokens } from "@ppb/the-wall-common/base-theme";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const BRAND_COLOR = tokens.SmColoursIconStaticPrimaryBase;
const DURATION = 800;
const BOUNCE = 8;
const DOT_CX = [7, 21, 35];
const DELAYS = [0, 100, 200];

function Dot({ cx, delay }: { cx: number; delay: number }) {
  const t = useSharedValue(0);

  useEffect(() => {
    t.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: DURATION / 2, easing: Easing.bezier(0.42, 0, 0.58, 1) }),
          withTiming(0, { duration: DURATION / 2, easing: Easing.bezier(0.42, 0, 0.58, 1) }),
        ),
        -1,
      ),
    );
    return () => cancelAnimation(t);
  }, [delay, t]);

  const animatedProps = useAnimatedProps(() => ({
    cy: 20 - t.value * BOUNCE,
    fillOpacity: 1 - t.value * 0.62,
  }));

  return <AnimatedCircle cx={cx} r={4} fill={BRAND_COLOR} animatedProps={animatedProps} />;
}

function LoadingDots() {
  return (
    <Svg viewBox="0 0 42 24" width={42} height={24}>
      {DOT_CX.map((cx, i) => (
        <Dot key={cx} cx={cx} delay={DELAYS[i]} />
      ))}
    </Svg>
  );
}

export default memo(LoadingDots);
