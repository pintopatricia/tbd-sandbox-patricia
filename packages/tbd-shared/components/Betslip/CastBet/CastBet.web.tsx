import { FunctionComponent, useContext, useCallback, useMemo } from "react";

import { BetslipCastBet, PebbleList } from "@ppb/the-wall-web";
import ConnectedCastRunner from "../CastRunner";
import { CastRunner } from "../CastRunner/CastRunner.web";
import ConnectedBetControls from "../BetControls";
import { BetControls } from "../BetControls/BetControls.web";

import { ComponentProps } from "./props";
import { KeyboardContext } from "../Keyboard/KeyboardContext";
import { ConfigContext } from "../../Config/ConfigContext";
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
  const { isDesktopLayout } = useContext(ConfigContext);
  const { isBetConfirmationStep } = useContext(RootBetslipContext);

  const handleCastBetChange = useCallback(
    (pebbleId: string) => {
      // Dismiss keyboard when selected cast type changes
      if (id !== pebbleId) {
        setFocusedKeyboardControls((prev) => ({
          ...prev,
          focusedInputId: null,
        }));
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
        dispatchOrderChange(selectedCastType, changedRunnerId, order);
      }
    },
    [dispatchOrderChange, selectedCastType],
  );

  const pebbleList = useMemo(
    () =>
      selectedCastType && castTypes?.length ? (
        <PebbleList
          items={castTypes}
          defaultSelectedPebble={selectedCastType}
          onPebbleClick={handleCastBetChange}
          isDesktopLayout={isDesktopLayout}
        />
      ) : undefined,
    [castTypes, selectedCastType, isDesktopLayout, handleCastBetChange],
  );
  const runners = useMemo(
    () =>
      runnersOrder.map((runnerId) => (
        <ConnectedCastRunner key={runnerId} component={CastRunner} id={runnerId} isOrderable={isOrderable} />
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
      title={title}
      runnersOrder={runnersOrder}
      runners={runners}
      controls={controls}
      castTypes={pebbleList}
      onRunnerOrderChange={isOrderable ? handleOrderChange : undefined}
      isDesktop={isDesktopLayout}
    />
  );
};
