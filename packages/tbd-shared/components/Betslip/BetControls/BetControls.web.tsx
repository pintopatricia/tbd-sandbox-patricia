import type { FunctionComponent } from "react";
import { useCallback, useContext, useEffect, useId, useRef } from "react";
import { BetslipBetControls } from "@ppb/the-wall-web";
import type { ComponentProps } from "./props";

import { KeyboardContext } from "../Keyboard/KeyboardContext";
import { RootBetslipContext } from "../RootBetslip/RootBetslipContext";

import { ConfigContext } from "../../Config/ConfigContext";

export const KEYBOARD_POPUP_DELAY = 50;

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
  linesLabel,
  dividendBetLabel,
  multiplier,
  odds,
  oddsMovement,
  previousOdds,
  formattedOriginalPotentialReturns,
  formattedPotentialReturns,
  returnsLabel,
  stake,
  separator,
  shouldFocusStakeField,
  generosityAlertMessage,
  isGenerosityDisabled,
  displayReturns,
  isSingleBetBetslip,
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
  const betControlsRef = useRef<HTMLDivElement>(null);
  const uniqueInputId = useId();

  const {
    focusedKeyboardControls: { focusedInputId },
    setFocusedKeyboardControls,
  } = useContext(KeyboardContext);
  const { isBetConfirmationStep } = useContext(RootBetslipContext);
  const { isDesktopLayout } = useContext(ConfigContext);

  useEffect(() => {
    if (shouldFocusStakeField) {
      setFocusedKeyboardControls({
        focusedCombinationId: combinationId,
        focusedInputId: uniqueInputId,
        focusedInputRef: ref,
        focusedTargetRef: betControlsRef,
      });
    }
  }, [combinationId, shouldFocusStakeField, setFocusedKeyboardControls, uniqueInputId]);

  const onStakeChangeGuard = useCallback(
    (newValue?: number) => dispatchStakeChange({ id: combinationId, newValue }),
    [dispatchStakeChange, combinationId],
  );

  /**
   * We create this function to remove  focus style when the user click out of the field.
   * We make sure that focusedInputId is equal of combinationId to prevent the focus be removed from the proper field in consecutive renders.
   */
  const removeFocus = useCallback(() => {
    if (uniqueInputId === focusedInputId && !isSingleBetBetslip) {
      setFocusedKeyboardControls((prev) => ({
        ...prev,
        focusedInputId: null,
      }));
    }
  }, [focusedInputId, isSingleBetBetslip, setFocusedKeyboardControls, uniqueInputId]);

  const onStakeFocusGuard = useCallback(
    (focused: boolean) => {
      if (!focused) {
        removeFocus();
        return;
      }

      if (shouldFocusStakeField) {
        setFocusedKeyboardControls({
          focusedCombinationId: combinationId,
          focusedInputId: uniqueInputId,
          focusedInputRef: ref,
          focusedTargetRef: betControlsRef,
        });
      } else {
        setFocusedKeyboardControls({
          focusedCombinationId: combinationId,
          focusedInputId: uniqueInputId,
          focusedInputRef: ref,
          focusedTargetRef: betControlsRef,
        });
      }
    },
    [shouldFocusStakeField, removeFocus, setFocusedKeyboardControls, uniqueInputId, combinationId],
  );

  const onStakeBlurGuard = useCallback(() => {
    /*
     * The setTimeout prevents a race condition between the blur event and the click event handlers.
     *
     * Without the timeout, the DOM event order would be: blur fires before, and the click after, which causes
     * issues in the following scenario:
     * 1. The user adds free bets wallets to the betslip selection
     * 2. The user edits/clicks the stake field in the betslip for a value over the max stake.
     * 3. The user clicks on the remove Freebets wallets action label immediately.
     * 4. The blur event is triggered on the stake field, which immediately triggers the stake correction.
     * 5. The click event is triggered on the remove Freebets wallets, which removes the Freebets wallets.
     * This leads to an unnecessary update of the stake on step 4 since free bets have a direct impact on the max
     * allowed stake.
     */
    if (dispatchStakeValidate) {
      setTimeout(() => dispatchStakeValidate({ id: combinationId }), KEYBOARD_POPUP_DELAY);

      if (!isSingleBetBetslip) {
        setFocusedKeyboardControls((prev) => ({
          ...prev,
          focusedInputRef: null,
          focusedTargetRef: null,
        }));
      }
    }
  }, [combinationId, dispatchStakeValidate, isSingleBetBetslip, setFocusedKeyboardControls]);

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

  const onGenerosityPressGuard = useCallback(() => {
    if (!isPanelDisabled && dispatchGenerosityPress) {
      dispatchGenerosityPress(combinationId, !!isGenerosityWalletSelected);
    }
  }, [isPanelDisabled, dispatchGenerosityPress, combinationId, isGenerosityWalletSelected]);

  const onGenerosityRemovePress = useCallback(() => {
    dispatchGenerosityWalletRemoveAction(combinationId, generosityType);
    dispatchGenerosityRemoveAction();
  }, [combinationId, dispatchGenerosityWalletRemoveAction, generosityType, dispatchGenerosityRemoveAction]);

  if (!labels) {
    return null;
  }

  return (
    <div ref={betControlsRef}>
      <BetslipBetControls
        innerRef={ref}
        id={combinationId}
        betType={betType}
        odds={odds}
        previousOdds={previousOdds}
        oddsLabel={labels.odds}
        stake={stake}
        separator={separator}
        currencySymbol={currencySymbol}
        stakeLabel={labels.stake}
        bonusAvailabilityLabel={bonusAvailabilityLabel}
        formattedOriginalPotentialReturns={formattedOriginalPotentialReturns}
        formattedPotentialReturns={formattedPotentialReturns}
        returnsLabel={returnsLabel}
        linesLabel={linesLabel}
        dividendBetLabel={dividendBetLabel}
        hasEachWay={hasEachWay}
        hasAccaInsurance={hasAccaInsurance}
        hasGenerosity={hasGenerosity}
        hasStartingPrice={hasStartingPrice}
        hasStakeCaret={!isDesktopLayout && hasStakeCaret}
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
        isAccaInsuranceSelected={isAccaInsuranceSelected}
        isAccaInsuranceReadonly={isAccaInsuranceReadonly}
        isEachWaySelected={isEachWaySelected}
        isPanelDisabled={isPanelDisabled}
        isPriceBoostSelected={isPriceBoostSelected}
        isGenerositySelected={isGenerosityWalletSelected}
        isStartingPriceSelected={isStartingPriceSelected}
        isStartingPriceDisabled={isBetConfirmationStep}
        isEachWayDisabled={isBetConfirmationStep}
        isAccaInsuranceDisabled={isBetConfirmationStep}
        isStakeFocused={uniqueInputId === focusedInputId}
        isStakeReadonly={isBetConfirmationStep || isPanelDisabled}
        isStakeValid={isStakeValid}
        generosityAlertMessage={generosityAlertMessage}
        generosityAlertRemoveLabel={labels.generosityAlertRemoveLabel}
        displayReturns={displayReturns}
        isGenerosityDisabled={isGenerosityDisabled}
        onGenerosityRemovePress={isGenerosityDisabled ? undefined : onGenerosityRemovePress}
        onStakeChange={onStakeChangeGuard}
        onStakeBlur={onStakeBlurGuard}
        onStakeFocus={onStakeFocusGuard}
        onEachWayPress={onEachWayPressGuard}
        onAccaInsurancePress={onAccaInsurancePressGuard}
        onGenerosityPress={onGenerosityPressGuard}
        onStartingPricePress={onStartingPricePressGuard}
        generosityIconName={generosityIconName}
      />
    </div>
  );
};
