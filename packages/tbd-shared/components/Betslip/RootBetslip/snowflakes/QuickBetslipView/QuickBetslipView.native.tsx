import { FunctionComponent, useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from "react";
import { Animated, Easing, Keyboard, Pressable, View } from "react-native";

import { tokens } from "@ppb/the-wall-common/base-theme";
import { AlertType, CounterColor, KeyboardSeparator } from "@ppb/the-wall-common/types";
import { SystemIconName } from "@ppb/the-wall-icons";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import {
  Alert,
  BetsSummary,
  CurrencyNumberInputField,
  PrimaryButton,
  QuickStakes,
  Styled,
  Text,
} from "@ppb/the-wall-native";

import { Minimized } from "../Minimized/Minimized.native";
import { ComponentProps } from "./props";
import { KeyboardContext } from "../../../Keyboard/KeyboardContext";
import styles from "./QuickBetslipView.native.styles";
import { FooterCustomKeyboard } from "../../../Keyboard/FooterCustomKeyboard.native";
import { JurisdictionalOperatorInfo } from "../../../JurisdictionalOperatorInfo/JurisdictionalOperatorInfo.native";
import { Notifier } from "../../../Notifier/Notifier.native";
import ConnectedNotifier from "../../../Notifier";
import { useScrollHandler } from "./useScrollHandler.native";
import { getEndpoint } from "../../../../../config/endpoints";
import { navigateDeposit } from "@ppb/tbd-router/native";

const titleStyle = {
  context: styles.titleOpaquePart,
  returns: styles.titleOpaquePart,
};

const subtitleStyle = {
  name: styles.subtitleBoldPart,
};

const useFocusedChangeEffect = (
  isFocused: boolean,
  focusedContentAnimation: Animated.Value,
  onShouldRender: (value: boolean) => void,
) => {
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    let animation: Animated.CompositeAnimation | undefined;

    if (isFocused) {
      focusedContentAnimation.setValue(0);

      timer = setTimeout(() => {
        onShouldRender(true);
      }, 0);

      const animationTimer = setTimeout(() => {
        animation = Animated.timing(focusedContentAnimation, {
          toValue: 1,
          duration: 250,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        });
        animation.start();
      }, 16);

      return () => {
        clearTimeout(timer);
        clearTimeout(animationTimer);
        animation?.stop();
      };
    }

    animation = Animated.timing(focusedContentAnimation, {
      toValue: 0,
      duration: 250,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    });
    animation.start(({ finished }) => {
      if (finished) {
        onShouldRender(false);
      }
    });

    return () => {
      animation?.stop();
    };
  }, [isFocused, focusedContentAnimation, onShouldRender]);
};

export const QuickBetslipView: FunctionComponent<ComponentProps> = ({
  header,
  combinationId,
  balanceAfterBet,
  placeButtonLabel,
  placeBtnLoadingLabel,
  hasCTALoading,
  totalReturns,
  currencySymbol,
  stake,
  isDepositRequired,
  requiredDepositValue,
  isPlacing,
  isPlaceDisabled,
  hasPlaceError,
  isStakeValid,
  isLastStakeValid,
  quickStakes,
  i18n,
  lastSuccessfulStake,

  // Accept Odds Movement
  showAcceptOddsMovementAlert,
  isOddsMovementOn,
  oddsMovementLabels,

  onClick: openBetslip,
  dispatchStakeChange,
  dispatchPlacement,
  dispatchDepositRedirect,
  dispatchIncrementPress,
  dispatchOddsMovementChange,
}) => {
  const keyboardContext = useContext(KeyboardContext);
  const {
    focusedKeyboardControls: { focusedInputId },
    setFocusedKeyboardControls,
  } = keyboardContext;

  const inputRef = useRef(null);
  const hasStakeInit = useRef(false);
  const uniqueInputId = useId();
  const [isExpanded, setIsExpanded] = useState(true);
  const isFocused = isExpanded && uniqueInputId === focusedInputId;

  const [shouldRenderContent, setShouldRenderContent] = useState(true);
  const [shouldRenderFocusedContent, setShouldRenderFocusedContent] = useState(false);
  const [hasNotifier, setHasNotifierHeight] = useState(false);

  const [expandAnimation] = useState(() => new Animated.Value(isExpanded ? 1 : 0));
  const [focusedContentAnimation] = useState(() => new Animated.Value(0));

  useFocusedChangeEffect(isFocused, focusedContentAnimation, setShouldRenderFocusedContent);

  useEffect(() => {
    // Auto-populate on first open
    // On unmount the ref gets reset to false, restarting the cycle
    // Further adds produce no stake change dispatches
    if (!hasStakeInit.current && stake === undefined && lastSuccessfulStake !== undefined && isLastStakeValid) {
      dispatchStakeChange({ id: combinationId, newValue: lastSuccessfulStake });
      hasStakeInit.current = true;
    }
  }, [isLastStakeValid]);

  useEffect(() => {
    const animation = Animated.timing(expandAnimation, {
      toValue: isExpanded ? 1 : 0,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    });

    animation.start(({ finished }) => {
      if (finished && !isExpanded) {
        setShouldRenderContent(false);
      }
    });

    return () => {
      animation.stop();
    };
  }, [isExpanded, expandAnimation]);

  const onTitleClick = useCallback(() => {
    if (isExpanded) {
      openBetslip();
    } else {
      setIsExpanded((prev) => {
        const newValue = !prev;
        if (newValue) {
          setShouldRenderContent(true);
        }
        return newValue;
      });
    }
  }, [isExpanded, openBetslip]);

  const removeFocus = useCallback(() => {
    Keyboard.dismiss();
    setFocusedKeyboardControls((prev) => ({
      ...prev,
      focusedInputId: null,
    }));
  }, [setFocusedKeyboardControls]);

  const onScrollUp = useCallback(() => {
    if (!isExpanded) {
      setIsExpanded(true);
      setShouldRenderContent(true);
    }
  }, [isExpanded]);

  const onScrollDown = useCallback(() => {
    if (isExpanded) {
      Keyboard.dismiss();
      setIsExpanded(false);
      removeFocus();
    }
  }, [removeFocus, isExpanded]);

  useScrollHandler(isExpanded, onScrollUp, onScrollDown);

  const onPlace = useCallback(() => {
    if (isDepositRequired) {
      dispatchDepositRedirect();
      const url = new URL(getEndpoint("DEPOSIT"));
      if (requiredDepositValue) {
        url.searchParams.set("amount", requiredDepositValue.toString());
      }
      navigateDeposit(url.toString());

      return;
    }

    dispatchPlacement();
  }, [dispatchDepositRedirect, dispatchPlacement, isDepositRequired, requiredDepositValue]);

  const handleOddsMovementChange = useCallback(
    (isChecked: boolean) => {
      dispatchOddsMovementChange(isChecked);
    },
    [dispatchOddsMovementChange],
  );

  const onStakeChangeGuard = useCallback(
    (newValue?: number) => {
      dispatchStakeChange({ id: combinationId, newValue });
    },
    [dispatchStakeChange, combinationId],
  );

  const onStakeFocusGuard = useCallback(() => {
    if (!isFocused) {
      dispatchStakeChange({ id: combinationId, newValue: undefined });

      setFocusedKeyboardControls({
        focusedCombinationId: combinationId,
        focusedInputId: uniqueInputId,
        focusedInputRef: inputRef,
        focusedTargetRef: null,
      });
    }
  }, [isFocused, dispatchStakeChange, combinationId, setFocusedKeyboardControls, uniqueInputId]);

  const onStakeBlurGuard = useCallback(() => {
    setFocusedKeyboardControls((prev) => ({
      ...prev,
      focusedInputId: null,
    }));
  }, [setFocusedKeyboardControls]);

  const onQuickStakePress = useCallback(
    (stake: number) => {
      dispatchIncrementPress(combinationId, stake, currencySymbol);
    },
    [dispatchIncrementPress, combinationId, currencySymbol],
  );

  const animatedContentStyle = useMemo(
    () => ({
      opacity: expandAnimation,
      maxHeight: expandAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 400],
      }),
    }),
    [expandAnimation],
  );

  const animatedFooterStyle = useMemo(
    () => ({
      opacity: expandAnimation,
      maxHeight: expandAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 70],
      }),
    }),
    [expandAnimation],
  );

  const showFooterTopPadding = !hasNotifier && isExpanded && !isFocused;

  const sheetFooterStyle = useMemo(
    () => [styles.sheetFooter, animatedFooterStyle, showFooterTopPadding && styles.sheetFooterWithoutNotification],
    [animatedFooterStyle, showFooterTopPadding],
  );

  const quickStakesComponent = useMemo(
    () => (
      <View style={styles.quickStakesContainer}>
        <QuickStakes quickStakes={quickStakes} onTouch={onQuickStakePress} isDisabled={false} />
      </View>
    ),
    [quickStakes, onQuickStakePress],
  );

  return (
    <View style={styles.sheetWrapper}>
      <View style={styles.sheetContainer}>
        <Pressable style={styles.sheetHeader} onPress={onTitleClick}>
          <View style={styles.headerContainer}>
            <View style={styles.headerTitle}>
              <Minimized counter={header.counter} color={CounterColor.Teal}>
                <Styled
                  style={styles.minimizedTitle}
                  numberOfLines={2}
                  translation={header.title}
                  styles={titleStyle}
                />
              </Minimized>
            </View>
            <View style={styles.headerAction}>
              <View style={[styles.actionIcon]}>
                <GenericIcon name={SystemIconName.CHEVRON_UP} color={tokens.ExpandableIconColour} />
              </View>
            </View>
          </View>
          {isExpanded && (
            <View style={styles.headerDetails}>
              <Styled
                style={styles.headerDetailsInfo}
                numberOfLines={header.isPriceBoostMultiple ? 3 : 1}
                translation={header.subtitle}
                styles={subtitleStyle}
              />
              {header.moreLabel && <Text style={styles.headerDetailsMore}>{header.moreLabel}</Text>}
            </View>
          )}
        </Pressable>

        {(shouldRenderContent || isExpanded) && (
          <Animated.View
            style={[styles.sheetContent, animatedContentStyle, hasNotifier && styles.sheetContentWithNotifier]}
          >
            <View
              onLayout={(e) => {
                setHasNotifierHeight(e.nativeEvent.layout.height > 0);
              }}
            >
              <ConnectedNotifier component={Notifier} />
            </View>
            {showAcceptOddsMovementAlert && (
              <View style={styles.oddsMovementAlertContainer}>
                <Alert
                  message={oddsMovementLabels.message}
                  detail={oddsMovementLabels.detailMessage}
                  type={AlertType.Info}
                  showCloseIcon={false}
                  action={{
                    onChange: handleOddsMovementChange,
                    isChecked: isOddsMovementOn,
                    label: oddsMovementLabels.message,
                  }}
                />
              </View>
            )}
            {shouldRenderContent && shouldRenderFocusedContent && (
              <Animated.View style={{ opacity: focusedContentAnimation }}>
                <FooterCustomKeyboard
                  id={uniqueInputId}
                  prefix={quickStakesComponent}
                  separator={KeyboardSeparator.Dot}
                  isDisabled={false}
                />
                <View style={styles.betSummaryContainer}>
                  <BetsSummary
                    disabled={false}
                    totalStake={balanceAfterBet}
                    totalStakeLabel={i18n.totalStakeLabel}
                    totalReturns={totalReturns}
                    totalReturnsLabel={i18n.totalReturnsLabel}
                    isOddsBoosted={false}
                  />
                </View>
                <JurisdictionalOperatorInfo />
              </Animated.View>
            )}
          </Animated.View>
        )}

        <Animated.View style={sheetFooterStyle}>
          {(shouldRenderContent || isPlacing) && (
            <>
              <View style={styles.stakeInput}>
                <CurrencyNumberInputField
                  containerStyle={styles.currencyNumberInputFieldStakeInput}
                  ref={inputRef}
                  id={combinationId}
                  disabled={isPlacing}
                  readonly={false}
                  label={i18n.stakePlaceholder}
                  value={stake}
                  invalid={!isStakeValid}
                  separator={KeyboardSeparator.Dot}
                  focused={isFocused}
                  hasCaret
                  currencySymbol={currencySymbol}
                  onChange={onStakeChangeGuard}
                  onFocus={onStakeFocusGuard}
                  onBlur={onStakeBlurGuard}
                />
              </View>
              <View style={styles.placeButton}>
                <PrimaryButton
                  disabled={isPlacing || isPlaceDisabled}
                  label={placeButtonLabel}
                  loadingLabel={hasCTALoading ? placeBtnLoadingLabel : undefined}
                  stopAnimation={hasPlaceError || isDepositRequired}
                  onTap={onPlace}
                  variant="transactional"
                />
              </View>
            </>
          )}
        </Animated.View>
      </View>
    </View>
  );
};
