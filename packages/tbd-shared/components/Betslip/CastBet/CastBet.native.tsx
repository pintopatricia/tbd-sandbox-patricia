import { FunctionComponent, useCallback, useContext, useMemo } from "react";
import { View, Keyboard } from "react-native";

import { CastBet as BetslipCastBet, PebbleList } from "@ppb/the-wall-native";

import ConnectedCastRunner from "../CastRunner";
import { CastRunner } from "../CastRunner/CastRunner.native";

import ConnectedBetControls from "../BetControls";
import { BetControls } from "../BetControls/BetControls.native";

import { ComponentProps } from "./props";
import { KeyboardContext } from "../Keyboard/KeyboardContext";
import { RootBetslipContext } from "../RootBetslip/RootBetslipContext";

export const CastBet: FunctionComponent<ComponentProps> = ({
  id,
  title,
  selectedCastType,
  runnersOrder,
  castTypes,
  isOrderable,
  shouldFocusStakeField,
  dispatchCastBetChange,
  dispatchOrderChange,
  dispatchConfirmCastBetChange,
}) => {
  const { setFocusedKeyboardControls } = useContext(KeyboardContext);
  const { isBetConfirmationStep } = useContext(RootBetslipContext);

  const handleCastBetChange = useCallback(
    (pebbleId: string) => {
      // Dismiss keyboard when selected cast type changes
      if (id !== pebbleId) {
        setFocusedKeyboardControls((prev) => ({
          ...prev,
          focusedInputId: null,
        }));

        // You might be wondering why dismiss the keyboard, when a custom keyboard is present
        // Focusing an input, theoretically, enables the keyboard flow even when disabled without showing it
        // Without this, the custom keyboard is gone, but the input is still focused, not allowing new focus
        //
        // TL;DR: focus/blur cycles are inherently tied to the Native Keyboard lifecycle
        Keyboard.dismiss();
      }
      if (isBetConfirmationStep) {
        dispatchConfirmCastBetChange(id, pebbleId);
      } else {
        dispatchCastBetChange(id, pebbleId);
      }
    },
    [id, isBetConfirmationStep, setFocusedKeyboardControls, dispatchConfirmCastBetChange, dispatchCastBetChange],
  );

  const handleOrderChange = useCallback(
    (changedRunnerId: string, order: string[]) => {
      if (selectedCastType) {
        const castType = selectedCastType;
        dispatchOrderChange(castType, changedRunnerId, order);
      }
    },
    [dispatchOrderChange, selectedCastType],
  );

  const pebbleList = useMemo(
    () =>
      castTypes && selectedCastType ? (
        <PebbleList items={castTypes} defaultSelectedPebble={selectedCastType} onPebblePress={handleCastBetChange} />
      ) : undefined,
    [castTypes, selectedCastType, handleCastBetChange],
  );

  const runners = useMemo(
    () =>
      runnersOrder.map((runnerId) => (
        <View key={runnerId}>
          <ConnectedCastRunner component={CastRunner} id={runnerId} isOrderable={isOrderable} />
        </View>
      )),
    [isOrderable, runnersOrder],
  );

  const controls = useMemo(
    () => (
      <ConnectedBetControls
        component={BetControls}
        combinationId={selectedCastType || ""}
        isDividend
        shouldFocusStakeField={shouldFocusStakeField}
        hasAvailabilityHints
      />
    ),
    [selectedCastType, shouldFocusStakeField],
  );

  if (!id || !title || !selectedCastType || !castTypes) {
    return null;
  }

  return (
    <BetslipCastBet
      // Remount on reorder: DraggableList's internal itemsOrder doesn't reset
      // when children re-order without a length change, so a stale mapping
      // would render the previous order. Re-keying forces useSortable to
      // re-initialize itemsOrder to [0,1,...] against the new children.
      key={runnersOrder.join("|")}
      title={title}
      runners={runners}
      controls={controls}
      runnersOrder={runnersOrder}
      castTypes={pebbleList}
      onRunnerOrderChange={isOrderable ? handleOrderChange : undefined}
    />
  );
};
