import { FunctionComponent, useCallback, useContext, useEffect, useId, useRef, useState } from "react";

import { BetControls as BetslipBetControls } from "@ppb/the-wall-native";
import { View } from "react-native";
import { ComponentProps } from "./props";
import { KeyboardContext } from "../Keyboard/KeyboardContext";

export const ObbBetControls: FunctionComponent<ComponentProps> = ({
  i18n,
  shouldFocusStakeField,
  potentialBetId,
  odds,
  stake,
  currencySymbol,
  isPanelDisabled,
  formattedPotentialReturns,
  separator,
  isStakeValid,
  hintMessage,
  hintType,
  displayReturns,
  hasStakeCaret,
  dispatchStakeValidate,
  dispatchStakeChange,
  dispatchQuotesUpdate,
  dispatchTransferStake,
}) => {
  const ref = useRef(null);
  const betcontrolsRef = useRef(null);
  const uniqueInputId = useId();
  const [previousPotentialBetId, setPreviousPotentialBetId] = useState<string | null>(null);

  const {
    focusedKeyboardControls: { focusedInputId, focusedInputRef },
    setFocusedKeyboardControls,
  } = useContext(KeyboardContext);

  const [myStake, setMyStake] = useState<number | undefined>(undefined);

  useEffect(() => {
    setMyStake(stake);
  }, [stake]);

  const onStakeFocusGuard = useCallback(
    (focused: boolean) => {
      if (focused) {
        setFocusedKeyboardControls({
          focusedCombinationId: potentialBetId,
          focusedInputId: uniqueInputId,
          focusedInputRef: ref,
          focusedTargetRef: betcontrolsRef,
        });

        dispatchQuotesUpdate();
      }
    },
    [uniqueInputId, potentialBetId, setFocusedKeyboardControls, dispatchQuotesUpdate],
  );

  const onStakeBlurGuard = useCallback(() => {
    dispatchStakeValidate({ potentialBetId });
    setFocusedKeyboardControls({
      focusedCombinationId: null,
      focusedInputId: null,
      focusedInputRef: null,
      focusedTargetRef: null,
    });
  }, [potentialBetId, dispatchStakeValidate, setFocusedKeyboardControls]);

  useEffect(() => {
    if (shouldFocusStakeField) {
      setFocusedKeyboardControls({
        focusedCombinationId: potentialBetId,
        focusedInputId: uniqueInputId,
        focusedInputRef: ref,
        focusedTargetRef: betcontrolsRef,
      });
    }
  }, [uniqueInputId, potentialBetId, shouldFocusStakeField, setFocusedKeyboardControls]);

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
    <View ref={betcontrolsRef}>
      <BetslipBetControls
        innerRef={ref}
        id={potentialBetId}
        odds={odds}
        oddsLabel={i18n.odds}
        stake={myStake}
        separator={separator}
        currencySymbol={currencySymbol}
        stakeLabel={i18n.stake}
        formattedPotentialReturns={formattedPotentialReturns}
        returnsLabel={i18n.returns}
        isPanelDisabled={isPanelDisabled}
        isStakeFocused={uniqueInputId === focusedInputId && focusedInputRef != null}
        hasStakeCaret={hasStakeCaret}
        isStakeReadonly={isPanelDisabled}
        isStakeValid={isStakeValid}
        onStakeChange={onStakeChangeGuard}
        onStakeBlur={onStakeBlurGuard}
        onStakeFocus={onStakeFocusGuard}
        hasEachWay={false}
        isAccaInsuranceSelected={false}
        hasAccaInsurance={false}
        hintMessage={hintMessage}
        hintType={hintType}
        displayReturns={displayReturns}
      />
    </View>
  );
};
