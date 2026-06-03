import type { FunctionComponent } from "react";
import { useContext, useEffect, useCallback, useRef, useId } from "react";
import { View } from "react-native";
import { BetControls as BetslipBetControls } from "@ppb/the-wall-native";
import type { ComponentProps } from "./props";
import { KeyboardContext } from "../Keyboard/KeyboardContext";
import { RootBetslipContext } from "../RootBetslip/RootBetslipContext";
import styles from "./BetControls.native.styles";

export const BetControls: FunctionComponent<ComponentProps> = ({
  accaInsuranceSubtitle,
  accaInsuranceTermsLabel,
  accaInsuranceTermsUrl,
  accaInsuranceTitle,
  betType,
  bonusAvailabilityLabel,
  combinationId,
  currencySymbol,
  eachWaySubtitle,
  hasAccaInsurance,
  hasEachWay,
  hasGenerosity,
  hasStartingPrice,
  hasStakeCaret,
  hintMessage,
  hintType,
  isAccaInsuranceSelected,
  isAccaInsuranceReadonly,
  isEachWaySelected,
  isPanelDisabled = false,
  isPriceBoostSelected,
  isGenerosityWalletSelected,
  isStartingPriceSelected,
  isStakeValid,
  labels,
  formattedOriginalPotentialReturns,
  formattedPotentialReturns,
  returnsLabel,
  displayReturns,
  linesLabel,
  dividendBetLabel,
  multiplier,
  odds,
  oddsAccessibilityLabel,
  oddsMovement,
  previousOdds,
  stake,
  separator,
  shouldFocusStakeField,
  generosityAlertMessage,
  isGenerosityDisabled,
  generosityIconName,
  generosityType,
  dispatchAccaInsurancePress,
  dispatchStartPricePress,
  dispatchEachWayPress,
  dispatchGenerosityPress,
  dispatchStakeChange,
  dispatchStakeValidate,
  dispatchGenerosityWalletRemoveAction,
  dispatchGenerosityRemoveAction,
}) => {
  const ref = useRef(null);
  const betControlsRef = useRef(null);
  const {
    focusedKeyboardControls: { focusedInputId, focusedInputRef },
    setFocusedKeyboardControls,
  } = useContext(KeyboardContext);
  const { registerCollapseListener, isBetConfirmationStep } = useContext(RootBetslipContext);
  const inputId = useId();

  useEffect(() => {
    if (shouldFocusStakeField) {
      setFocusedKeyboardControls({
        focusedCombinationId: combinationId,
        focusedInputId: inputId,
        focusedInputRef: ref,
        focusedTargetRef: betControlsRef,
      });
    }
  }, [shouldFocusStakeField, setFocusedKeyboardControls, inputId, combinationId]);

  const onStakeChangeGuard = useCallback(
    // FIXME: Updating the stake causes the betslip state to change, which causes multiple re-renders and layout recalculations.
    // Wrapping the stake change in requestAnimationFrame allows the UI updates to be batched together. Should be revisited to prevent unnecessary re-renders.
    (newValue?: number) => requestAnimationFrame(() => dispatchStakeChange({ id: combinationId, newValue })),
    [dispatchStakeChange, combinationId],
  );

  const onStakeFocusGuard = useCallback(
    (focused: boolean) => {
      if (focused) {
        setFocusedKeyboardControls({
          focusedCombinationId: combinationId,
          focusedInputId: inputId,
          focusedInputRef: ref,
          focusedTargetRef: betControlsRef,
        });
      }
    },
    [setFocusedKeyboardControls, combinationId, inputId],
  );

  const onStakeBlurGuard = useCallback(() => {
    if (dispatchStakeValidate) {
      dispatchStakeValidate({ id: combinationId });
    }

    setFocusedKeyboardControls({
      focusedCombinationId: null,
      focusedInputId: null,
      focusedInputRef: null,
      focusedTargetRef: null,
    });
  }, [dispatchStakeValidate, combinationId, setFocusedKeyboardControls]);

  const onStartingPricePressGuard = useCallback(
    (isSelected: boolean) => !isPanelDisabled && dispatchStartPricePress(combinationId, isSelected),
    [combinationId, dispatchStartPricePress, isPanelDisabled],
  );

  const onEachWayPressGuard = useCallback(
    (isSelected: boolean) => !isPanelDisabled && dispatchEachWayPress(combinationId, isSelected),
    [isPanelDisabled, dispatchEachWayPress, combinationId],
  );

  const onAccaInsurancePressGuard = useCallback(
    (isSelected: boolean) => !isPanelDisabled && dispatchAccaInsurancePress(combinationId, isSelected),
    [isPanelDisabled, dispatchAccaInsurancePress, combinationId],
  );

  const onGenerosityWalletPress = useCallback(() => {
    if (!isPanelDisabled && dispatchGenerosityPress) {
      dispatchGenerosityPress(combinationId, !!isGenerosityWalletSelected);
    }
  }, [isPanelDisabled, dispatchGenerosityPress, combinationId, isGenerosityWalletSelected]);

  const onGenerosityRemovePress = useCallback(() => {
    dispatchGenerosityWalletRemoveAction(combinationId, generosityType);
    dispatchGenerosityRemoveAction();
  }, [combinationId, dispatchGenerosityWalletRemoveAction, generosityType, dispatchGenerosityRemoveAction]);

  useEffect(() => {
    const unregister = registerCollapseListener(onStakeBlurGuard);
    return () => {
      onStakeBlurGuard();
      unregister();
    };
  }, [registerCollapseListener, onStakeBlurGuard]);

  if (!labels) {
    return null;
  }

  return (
    <View style={styles.container} ref={betControlsRef}>
      <BetslipBetControls
        innerRef={ref}
        isPanelDisabled={isPanelDisabled}
        id={combinationId}
        betType={betType}
        odds={odds}
        previousOdds={previousOdds}
        oddsLabel={labels.odds}
        oddsAccessibilityLabel={oddsAccessibilityLabel}
        stake={stake}
        separator={separator}
        currencySymbol={currencySymbol}
        stakeLabel={labels.stake}
        bonusAvailabilityLabel={bonusAvailabilityLabel}
        formattedOriginalPotentialReturns={formattedOriginalPotentialReturns}
        formattedPotentialReturns={formattedPotentialReturns}
        returnsLabel={returnsLabel}
        displayReturns={displayReturns}
        linesLabel={linesLabel}
        dividendBetLabel={dividendBetLabel}
        isStakeValid={isStakeValid}
        hasEachWay={hasEachWay}
        hasAccaInsurance={hasAccaInsurance}
        hasGenerosity={hasGenerosity}
        hasStartingPrice={hasStartingPrice}
        hasStakeCaret={hasStakeCaret}
        startingPriceTitle={labels.startingPriceTitle}
        eachWayTitle={labels.eachWayTitle}
        eachWaySubtitle={eachWaySubtitle}
        accaInsuranceTitle={accaInsuranceTitle}
        accaInsuranceSubtitle={accaInsuranceSubtitle}
        accaInsuranceTermsLabel={accaInsuranceTermsLabel}
        accaInsuranceTermsUrl={accaInsuranceTermsUrl}
        oddsMovement={oddsMovement}
        oddsMovementUp={labels.oddsMovementUp}
        oddsMovementDown={labels.oddsMovementDown}
        hintType={hintType}
        hintMessage={hintMessage}
        multiplier={multiplier}
        isPriceBoostSelected={isPriceBoostSelected}
        isGenerositySelected={isGenerosityWalletSelected}
        isStartingPriceSelected={isStartingPriceSelected}
        isStartingPriceDisabled={isBetConfirmationStep}
        isStakeReadonly={isBetConfirmationStep || isPanelDisabled}
        isEachWaySelected={isEachWaySelected}
        isEachWayDisabled={isBetConfirmationStep}
        isAccaInsuranceSelected={isAccaInsuranceSelected}
        isAccaInsuranceReadonly={isAccaInsuranceReadonly}
        isAccaInsuranceDisabled={isBetConfirmationStep}
        isStakeFocused={focusedInputRef !== null && inputId === focusedInputId}
        shouldDisableOnFocusListener={false}
        generosityAlertMessage={generosityAlertMessage}
        generosityAlertRemoveLabel={labels.generosityAlertRemoveLabel}
        isGenerosityDisabled={isGenerosityDisabled}
        onGenerosityRemovePress={isGenerosityDisabled ? undefined : onGenerosityRemovePress}
        onStakeChange={onStakeChangeGuard}
        onStakeBlur={onStakeBlurGuard}
        onStakeFocus={onStakeFocusGuard}
        onEachWayPress={onEachWayPressGuard}
        onAccaInsurancePress={onAccaInsurancePressGuard}
        onGenerosityPress={onGenerosityWalletPress}
        onStartingPricePress={onStartingPricePressGuard}
        generosityIconName={generosityIconName}
      />
    </View>
  );
};
