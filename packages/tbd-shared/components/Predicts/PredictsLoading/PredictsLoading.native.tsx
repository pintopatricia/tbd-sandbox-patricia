import { FunctionComponent, useEffect, useMemo, useState } from "react";
import { AccessibilityInfo, Animated, Easing, Image, View } from "react-native";

import { Text } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";

import { i18n } from "../../../helpers/i18n";

import styles, {
  BUTTON_HEIGHT_PX,
  DOT_TRANSLATE_PX,
  PREDICTS_LOADING_NO_BG,
  PREDICTS_LOADING_YES_BG,
} from "./PredictsLoading.native.styles";
import { PREDICTS_LOADING_SCREEN } from "./PredictsLoading.native.selectors";
import {
  ANIMATION_END_BUFFER_MS,
  ANIMATION_TOTAL_MS,
  DEFAULT_MIN_DISPLAY_MS,
  DOT_BOUNCE_MS,
  DOT_RISE_MS,
  DOT_STAGGER_MS,
  FADE_OUT_MS,
  FINAL_LABEL,
  FLIP_BEZIER,
  FLIP_SEQUENCE,
  INITIAL_LABEL,
  PREDICTS_LOADING_CAPTION_KEY,
  PREDICTS_LOADING_LABEL,
} from "./PredictsLoading.config";
import { PredictsLoadingProps } from "./PredictsLoading.types";

const FLIP_EASING = Easing.bezier(...FLIP_BEZIER);

const PredictsLoading: FunctionComponent<PredictsLoadingProps> = ({
  isLoading,
  onDismiss,
  minDisplayMs = DEFAULT_MIN_DISPLAY_MS,
}) => {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [animationDone, setAnimationDone] = useState(false);
  const [minDisplayElapsed, setMinDisplayElapsed] = useState(false);

  const currentStep = FLIP_SEQUENCE[stepIndex];

  const [slotPosition] = useState(() => new Animated.Value(0));
  const [colorProgress] = useState(() => new Animated.Value(INITIAL_LABEL === PREDICTS_LOADING_LABEL.YES ? 1 : 0));
  const [rootOpacity] = useState(() => new Animated.Value(1));
  const [dot1] = useState(() => new Animated.Value(0));
  const [dot2] = useState(() => new Animated.Value(0));
  const [dot3] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const timer = setTimeout(() => setMinDisplayElapsed(true), minDisplayMs);
    return () => clearTimeout(timer);
  }, [minDisplayMs]);

  useEffect(() => {
    let cancelled = false;
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (!cancelled) {
        setReducedMotion(enabled);
        if (enabled) {
          setStepIndex(FLIP_SEQUENCE.length - 1);
          setAnimationDone(true);
          slotPosition.setValue(FLIP_SEQUENCE.length - 1);
          colorProgress.setValue(FINAL_LABEL === PREDICTS_LOADING_LABEL.YES ? 1 : 0);
        }
      }
    });
    return () => {
      cancelled = true;
    };
  }, [slotPosition, colorProgress]);

  useEffect(() => {
    if (reducedMotion) return undefined;

    const timeouts: ReturnType<typeof setTimeout>[] = [];

    FLIP_SEQUENCE.slice(1).forEach((step, idxFromOne) => {
      const sequenceIndex = idxFromOne + 1;
      timeouts.push(setTimeout(() => setStepIndex(sequenceIndex), step.at));
    });

    timeouts.push(setTimeout(() => setAnimationDone(true), ANIMATION_TOTAL_MS + ANIMATION_END_BUFFER_MS));

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion || stepIndex === 0) return;

    Animated.timing(slotPosition, {
      toValue: stepIndex,
      duration: currentStep.flipMs,
      easing: FLIP_EASING,
      useNativeDriver: true,
    }).start();

    Animated.timing(colorProgress, {
      toValue: currentStep.label === PREDICTS_LOADING_LABEL.YES ? 1 : 0,
      duration: currentStep.flipMs,
      easing: Easing.bezier(0.22, 1, 0.36, 1),
      useNativeDriver: false,
    }).start();
  }, [stepIndex, reducedMotion, slotPosition, colorProgress, currentStep.flipMs, currentStep.label]);

  useEffect(() => {
    if (reducedMotion) return undefined;

    const makeLoop = (value: Animated.Value) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(value, {
            toValue: 1,
            duration: DOT_RISE_MS,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 0,
            duration: DOT_BOUNCE_MS - DOT_RISE_MS,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      );

    const loops = [makeLoop(dot1), makeLoop(dot2), makeLoop(dot3)];
    loops[0].start();
    const t2 = setTimeout(() => loops[1].start(), DOT_STAGGER_MS);
    const t3 = setTimeout(() => loops[2].start(), DOT_STAGGER_MS * 2);

    return () => {
      clearTimeout(t2);
      clearTimeout(t3);
      loops.forEach((l) => l.stop());
    };
  }, [reducedMotion, dot1, dot2, dot3]);

  useEffect(() => {
    if (!animationDone || isLoading || !minDisplayElapsed) return undefined;

    Animated.timing(rootOpacity, {
      toValue: 0,
      duration: FADE_OUT_MS,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
    const finishTimer = setTimeout(onDismiss, FADE_OUT_MS);

    return () => clearTimeout(finishTimer);
  }, [animationDone, isLoading, minDisplayElapsed, onDismiss, rootOpacity]);

  const bgColor = useMemo(
    () =>
      colorProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [PREDICTS_LOADING_NO_BG, PREDICTS_LOADING_YES_BG],
      }),
    [colorProgress],
  );
  const shadowColor = bgColor;

  const slotTranslateY = useMemo(
    () =>
      slotPosition.interpolate({
        inputRange: [0, FLIP_SEQUENCE.length - 1],
        outputRange: [0, -(FLIP_SEQUENCE.length - 1) * BUTTON_HEIGHT_PX],
      }),
    [slotPosition],
  );

  const dotStyle = (value: Animated.Value) => ({
    transform: [
      {
        translateY: value.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -DOT_TRANSLATE_PX],
        }),
      },
    ],
    opacity: value.interpolate({
      inputRange: [0, 1],
      outputRange: [0.4, 1],
    }),
  });

  return (
    <Animated.View
      {...getTestProps(PREDICTS_LOADING_SCREEN, false)}
      style={[styles.predictsLoading, { opacity: rootOpacity }]}
      accessibilityLiveRegion="polite"
      accessibilityRole="progressbar"
    >
      <Image
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        source={require("../../../assets/images/betfair_predicts_logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <View style={styles.stack}>
        <Animated.View style={[styles.buttonShadow, { shadowColor }]}>
          <Animated.View style={[styles.button, { backgroundColor: bgColor }]}>
            <Animated.View
              style={{ position: "absolute", top: 0, left: 0, right: 0, transform: [{ translateY: slotTranslateY }] }}
            >
              {FLIP_SEQUENCE.map((step, i) => (
                <Text key={i} style={styles.label}>
                  {step.label}
                </Text>
              ))}
            </Animated.View>
          </Animated.View>
        </Animated.View>
      </View>
      <View style={styles.footer}>
        <View style={styles.dots}>
          <Animated.View style={[styles.dot, dotStyle(dot1)]} />
          <Animated.View style={[styles.dot, dotStyle(dot2)]} />
          <Animated.View style={[styles.dot, dotStyle(dot3)]} />
        </View>
        <Text style={styles.caption}>{i18n({ key: PREDICTS_LOADING_CAPTION_KEY })}</Text>
      </View>
    </Animated.View>
  );
};

export default PredictsLoading;
