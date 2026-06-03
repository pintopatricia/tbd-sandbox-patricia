import { FunctionComponent, useCallback, useContext, useEffect, useRef, useId, useState } from "react";

import { BetslipBetControls } from "@ppb/the-wall-web";
import { ComponentProps } from "./props";
import { KeyboardContext } from "../Keyboard/KeyboardContext";
import { ConfigContext } from "../../Config/ConfigContext";

const KEYBOARD_POPUP_DELAY = 50;

export const ObbBetControls: FunctionComponent<ComponentProps> = ({
  i18n,
  shouldFocusStakeField,
  potentialBetId,
  odds,
  oddsMovement,
  stake,
  currencySymbol,
  isPanelDisabled,
  formattedPotentialReturns,
  separator,
  isStakeValid,
  hintType,
  hintMessage,
  displayReturns,
  isSingleObbBetBetslip,
  dispatchStakeValidate,
  dispatchStakeChange,
  dispatchQuotesUpdate,
  dispatchTransferStake,
  hasStakeCaret,
}) => {
  const ref = useRef(null);
  const betControlsRef = useRef<HTMLDivElement>(null);
  const uniqueInputId = useId();
  const [previousPotentialBetId, setPreviousPotentialBetId] = useState<string | null>(null);

  const {
    focusedKeyboardControls: { focusedInputId },
    setFocusedKeyboardControls,
  } = useContext(KeyboardContext);
  const { isDesktopLayout } = useContext(ConfigContext);

  const [myStake, setMyStake] = useState<number | undefined>(undefined);

  useEffect(() => {
    setMyStake(stake);
  }, [stake]);

  useEffect(() => {
    if (shouldFocusStakeField) {
      setFocusedKeyboardControls({
        focusedCombinationId: potentialBetId,
        focusedInputId: uniqueInputId,
        focusedInputRef: ref,
        focusedTargetRef: betControlsRef,
      });
    }
  }, [potentialBetId, shouldFocusStakeField, setFocusedKeyboardControls, uniqueInputId]);

  /**
   * We create this function to remove focus style when the user click out of the field.
   * We make sure that focusedInputId is equal of combinationId to prevent the focus be removed from the proper field in consecutive renders.
   */
  const removeFocus = useCallback(() => {
    if (uniqueInputId === focusedInputId && !isSingleObbBetBetslip) {
      setFocusedKeyboardControls((prev) => ({
        ...prev,
        focusedInputId: null,
      }));
    }
  }, [uniqueInputId, focusedInputId, isSingleObbBetBetslip, setFocusedKeyboardControls]);

  const onStakeFocusGuard = useCallback(
    (focused: boolean) => {
      if (!focused) {
        removeFocus();
        return;
      }

      setFocusedKeyboardControls({
        focusedCombinationId: potentialBetId,
        focusedInputId: uniqueInputId,
        focusedInputRef: ref,
        focusedTargetRef: betControlsRef,
      });

      dispatchQuotesUpdate();
    },
    [dispatchQuotesUpdate, removeFocus, setFocusedKeyboardControls, potentialBetId, uniqueInputId],
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
      setTimeout(() => dispatchStakeValidate({ potentialBetId }), KEYBOARD_POPUP_DELAY);
    }
  }, [dispatchStakeValidate, potentialBetId]);

  useEffect(() => {
    if (shouldFocusStakeField) {
      setFocusedKeyboardControls((prev) => ({
        ...prev,
        focusedCombinationId: potentialBetId,
        focusedInputId: uniqueInputId,
      }));
    }
  }, [potentialBetId, shouldFocusStakeField, setFocusedKeyboardControls, uniqueInputId]);

  useEffect(() => {
    if (previousPotentialBetId && previousPotentialBetId !== potentialBetId) {
      dispatchTransferStake({
        oldPotentialBetId: previousPotentialBetId,
        newPotentialBetId: potentialBetId,
      });
    }
    return () => {
      setPreviousPotentialBetId(potentialBetId);
    };
  }, [potentialBetId, dispatchTransferStake, previousPotentialBetId]);

  const onStakeChangeGuard = useCallback(
    (newValue?: number) => dispatchStakeChange({ potentialBetId, newValue }),
    [dispatchStakeChange, potentialBetId],
  );

  return (
    <div ref={betControlsRef}>
      <BetslipBetControls
        innerRef={ref}
        id={potentialBetId}
        odds={odds}
        oddsLabel={i18n.odds}
        oddsMovement={oddsMovement}
        oddsMovementUp={i18n.oddsMovementUp}
        oddsMovementDown={i18n.oddsMovementDown}
        stake={myStake}
        separator={separator}
        currencySymbol={currencySymbol}
        stakeLabel={i18n.stake}
        formattedPotentialReturns={formattedPotentialReturns}
        returnsLabel={i18n.returns}
        isPanelDisabled={isPanelDisabled}
        isStakeFocused={uniqueInputId === focusedInputId}
        hasStakeCaret={!isDesktopLayout && hasStakeCaret}
        isStakeReadonly={isPanelDisabled}
        isStakeValid={isStakeValid}
        hasEachWay={false}
        isAccaInsuranceSelected={false}
        hasAccaInsurance={false}
        hintMessage={hintMessage}
        hintType={hintType}
        displayReturns={displayReturns}
        onStakeChange={onStakeChangeGuard}
        onStakeBlur={onStakeBlurGuard}
        onStakeFocus={onStakeFocusGuard}
      />
    </div>
  );
};
