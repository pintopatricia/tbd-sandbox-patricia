import { colors, typography } from "@ppb/the-wall-common/base-theme";
import { memo, FunctionComponent, useCallback, useEffect, useMemo, useRef } from "react";
import { TouchableWithoutFeedback, View } from "react-native";
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { useOptimistic } from "@ppb/the-wall-native/hooks/useOptimistic";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { Text } from "@ppb/the-wall-native";
import {
  BetButtonColor,
  type BetButtonLabelProps,
  BetButtonStatus,
  BetButtonType,
  type BetButtonViewModel,
  LabelColors,
} from "./BetButton.types";
import styles from "./BetButton.native.styles";
import {
  BET_BUTTON_CONTAINER_TEST_ID,
  BET_BUTTON_PRIMARY_LABEL_TEST_ID,
  BET_BUTTON_SECONDARY_LABEL_TEST_ID,
  BET_BUTTON_SECONDARY_LABEL_HANDICAP_TEST_ID,
  BET_BUTTON_TEST_ID,
  BET_BUTTON_ICON_TEST_ID,
} from "./BetButton.native.selectors";

// TODO: Should be updated in near future
const TEMPORARY_OPACITY = 0.37;

const backgroundColors = {
  [BetButtonColor.Blue]: {
    [BetButtonStatus.Normal]: colors.ActionExchangeBackBackgroundDefault,
    [BetButtonStatus.Selected]: colors.ActionExchangeBackBackgroundHit,
    flash: colors.ActionExchangeBackBackgroundFlash,
  },
  [BetButtonColor.Teal]: {
    [BetButtonStatus.Normal]: colors.ActionSportsbookBackgroundDefault,
    [BetButtonStatus.Selected]: colors.ActionSportsbookBackgroundHit,
    flash: colors.ActionSportsbookBackgroundFlash,
  },
  [BetButtonColor.DarkBlue]: {
    [BetButtonStatus.Normal]: colors.ActionExchangeBackBackgroundDefault,
    [BetButtonStatus.Selected]: colors.ActionExchangeBackBackgroundHit,
    flash: colors.ActionExchangeBackBackgroundFlash,
  },
  [BetButtonColor.Pink]: {
    [BetButtonStatus.Normal]: colors.ActionExchangeLayBackgroundDefault,
    [BetButtonStatus.Selected]: colors.ActionExchangeLayBackgroundHit,
    flash: colors.ActionExchangeLayBackgroundFlash,
  },
  [BetButtonColor.DarkPink]: {
    [BetButtonStatus.Normal]: colors.ActionExchangeLayBackgroundDefault,
    [BetButtonStatus.Selected]: colors.ActionExchangeLayBackgroundHit,
    flash: colors.ActionExchangeLayBackgroundFlash,
  },
  [BetButtonColor.Grey]: {
    [BetButtonStatus.Normal]: colors.ActionBoostBackgroundDefault,
    [BetButtonStatus.Selected]: colors.ActionBoostBackgroundHit,
    flash: colors.ActionBoostBackgroundHit,
  },
  [BetButtonColor.DarkGrey]: {
    [BetButtonStatus.Normal]: colors.ActionSportsbookBackgroundClosed,
    [BetButtonStatus.Selected]: colors.ActionSportsbookBackgroundClosed,
    flash: colors.ActionBoostBackgroundHit,
  },
};

const BetButtonPrimaryLabel: FunctionComponent<BetButtonLabelProps> = ({ label, labelColor, numberOfLines = 1 }) => {
  const primaryLabelStyles = [styles.primaryLabel, typography["typography-h280"], labelColor && styles[labelColor]];
  return (
    <Text
      {...getTestProps(BET_BUTTON_PRIMARY_LABEL_TEST_ID, false)}
      numberOfLines={numberOfLines}
      style={primaryLabelStyles}
    >
      {label}
    </Text>
  );
};

const BetButtonSecondaryLabel: FunctionComponent<BetButtonLabelProps> = ({
  label,
  type,
  labelColor,
  isOddsboostMarketType,
  isSecondaryLabelStruckThrough,
  handicap,
}) => {
  const secondaryLabelStyles = [
    styles.secondaryLabel,
    isOddsboostMarketType ? typography["typography-h120"] : typography["typography-h082"],
    type === BetButtonType.Sbk && isSecondaryLabelStruckThrough && styles.lineThrough,
    labelColor && styles[labelColor],
  ];

  const secondaryLabelHandicapStyles = [styles.secondaryLabelHandicap, labelColor && styles[labelColor]];

  return (
    <View style={styles.secondaryLabelContainer}>
      <Text {...getTestProps(BET_BUTTON_SECONDARY_LABEL_TEST_ID)} numberOfLines={1} style={secondaryLabelStyles}>
        {label}
      </Text>
      {handicap ? (
        <Text
          {...getTestProps(BET_BUTTON_SECONDARY_LABEL_HANDICAP_TEST_ID)}
          numberOfLines={1}
          style={secondaryLabelHandicapStyles}
        >
          {handicap}
        </Text>
      ) : null}
    </View>
  );
};

const getLabelColor = (
  betButtonType: BetButtonType,
  betButtonColor: BetButtonColor,
  isOddsBoost?: boolean,
): LabelColors => {
  if (isOddsBoost) {
    return LabelColors.oddsBoost;
  }

  if (betButtonType === BetButtonType.Exc) {
    return betButtonColor === BetButtonColor.Blue || betButtonColor === BetButtonColor.DarkBlue
      ? LabelColors.exchangeBack
      : LabelColors.exchangeLay;
  }

  if (betButtonColor === BetButtonColor.DarkGrey) {
    return LabelColors.sportsbookClosed;
  }

  return LabelColors.sportsbook;
};

export const BetButton: FunctionComponent<BetButtonViewModel> = memo(
  ({
    primaryLabel,
    secondaryLabel,
    handicapLabel,
    type,
    status = BetButtonStatus.Normal,
    disabled = false,
    onClick = () => {},
    bgColor,
    isOddsboostMarketType,
    isSecondaryLabelStruckThrough = true,
    fadeOut = true,
    icon,
    noAnimation,
  }) => {
    const actualStatus = disabled ? BetButtonStatus.Normal : status;
    const flashAnimation = useSharedValue(0);
    const prevPrimaryLabel = useRef<string>(undefined);
    const prevSecondaryLabel = useRef<string>(undefined);
    const optimisticUpdater = useCallback(
      (currentState: BetButtonStatus) =>
        currentState === BetButtonStatus.Normal && !disabled ? BetButtonStatus.Selected : BetButtonStatus.Normal,
      [disabled],
    );
    const [optimisticStatus, toggleOptimisticState] = useOptimistic(actualStatus, optimisticUpdater, {
      gracePeriod: 50,
    });

    const onClickGuard = useCallback(
      (...args: Parameters<typeof onClick>) => {
        toggleOptimisticState();

        // We break up React's batching with this allowing the optimistic update to render first
        requestAnimationFrame(() => onClick(...args));
      },
      [onClick, toggleOptimisticState],
    );

    const backgroundColorStyle = useAnimatedStyle(
      () => ({
        backgroundColor: interpolateColor(
          flashAnimation.value,
          [0, 0.1, 1],
          [
            backgroundColors[bgColor][optimisticStatus],
            backgroundColors[bgColor].flash,
            backgroundColors[bgColor][optimisticStatus],
          ],
        ),
      }),
      [flashAnimation, bgColor, optimisticStatus],
    );

    useEffect(() => {
      if (!noAnimation) {
        const primaryLabelUpdated = prevPrimaryLabel.current !== primaryLabel;
        const secondaryLabelUpdated = prevSecondaryLabel.current !== secondaryLabel;

        prevPrimaryLabel.current = primaryLabel;
        prevSecondaryLabel.current = secondaryLabel;

        if (primaryLabelUpdated || secondaryLabelUpdated) {
          flashAnimation.set(
            withTiming(1, { duration: 700 }, () => {
              flashAnimation.set(0);
            }),
          );
        }
      }
    }, [flashAnimation, noAnimation, primaryLabel, secondaryLabel]);

    const labelColor = getLabelColor(type, bgColor, isOddsboostMarketType);

    const primaryLabelElement = useMemo(
      () => <BetButtonPrimaryLabel key={1} label={primaryLabel} labelColor={labelColor} numberOfLines={icon ? 2 : 1} />,
      [labelColor, primaryLabel],
    );

    const [firstLabel, secondLabel] = useMemo(
      () => [
        ...(secondaryLabel && type === BetButtonType.Sbk
          ? [
              <BetButtonSecondaryLabel
                key={0}
                label={secondaryLabel}
                type={type}
                labelColor={labelColor}
                isOddsboostMarketType={isOddsboostMarketType}
                isSecondaryLabelStruckThrough={isSecondaryLabelStruckThrough}
                handicap={handicapLabel}
              />,
            ]
          : []),
        primaryLabelElement,
        ...(secondaryLabel && type === BetButtonType.Exc
          ? [
              <BetButtonSecondaryLabel
                key={2}
                label={secondaryLabel}
                type={type}
                labelColor={labelColor}
                isOddsboostMarketType={isOddsboostMarketType}
              />,
            ]
          : []),
      ],
      [
        handicapLabel,
        isOddsboostMarketType,
        isSecondaryLabelStruckThrough,
        labelColor,
        primaryLabelElement,
        secondaryLabel,
        type,
      ],
    );

    const betButtonStyles = useMemo(
      () => [
        styles.betButton,
        icon && styles.horizontalBetButton,
        {
          opacity: disabled && fadeOut ? TEMPORARY_OPACITY : 1,
        },
        backgroundColorStyle,
      ],
      [backgroundColorStyle, disabled, fadeOut],
    );

    return (
      <TouchableWithoutFeedback {...getTestProps(BET_BUTTON_TEST_ID, false)} disabled={disabled} onPress={onClickGuard}>
        <Animated.View {...getTestProps(BET_BUTTON_CONTAINER_TEST_ID, false)} style={betButtonStyles}>
          {icon ? (
            <View style={styles.icon} {...getTestProps(BET_BUTTON_ICON_TEST_ID, false)}>
              <GenericIcon name={icon.name} color={icon.color} />
            </View>
          ) : null}
          {firstLabel}
          {secondLabel}
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  },
);

BetButton.displayName = "BetButton";
