import { FunctionComponent, useContext, useCallback, useMemo, useRef } from "react";
import { DeviceEventEmitter, View } from "react-native";

import { Styled } from "@ppb/the-wall-native";
import { InlinePanel } from "../InlinePanel/InlinePanel.native";
import { navigateDeposit } from "@ppb/tbd-router/native";
import { ExchangePersistenceType } from "@ppb/tbd-store/state";

import { InlinePanelColorMap } from "../InlinePanel/InlinePanel.types";
import { NotificationKeys, useNotifications } from "../../../hooks/useNotifications";
import { useScrollIntoView } from "../../../hooks/useScrollIntoView.native";
import { getEndpoint } from "../../../config/endpoints";
import { KeyboardContext } from "../Keyboard/KeyboardContext";
import { withKeyboardExc } from "../Keyboard/withKeyboardExc.native";
import { useKeyboardValueSync } from "../Keyboard/useKeyboardValueSync.native";
import { JurisdictionalOperatorInfo } from "../JurisdictionalOperatorInfo/JurisdictionalOperatorInfo.native";

import { ExchangeInlineEditPanel } from "./snowflakes/ExchangeInlineEditPanel/ExchangeInlineEditPanel.native";
import { ComponentProps } from "./props";
import styles from "./ExchangeInlineEdit.native.styles";

const CUSTOM_KEYBOARD__INPUT_VALUE_RESET = "CUSTOM_KEYBOARD__INPUT_VALUE_RESET";

const DEPOSIT_ENDPOINT = getEndpoint("DEPOSIT");

const KeyboardExchangeInlineEditPanel = withKeyboardExc(ExchangeInlineEditPanel);

export const ExchangeInlineEdit: FunctionComponent<ComponentProps> = ({
  title,
  titlePrefix,
  profitLabel,
  profitValue,
  profitRawValue,
  market,
  runner,
  side,
  price,
  size,
  priceError,
  sizeError,
  placeError,
  marketError,
  currencySymbol,
  betId,
  persistenceListTypes,
  persistenceListSelectedKey,
  isPriceDisabled,
  isSizeDisabled,
  isUpdateButtonDisabled,
  isPersistenceTypeMenuExpanded,
  betDelay,
  labels,
  placeLabel,
  loadingLabel,
  isDepositRequired,
  dispatchUnmatchedCancel,
  dispatchUnmatchedUpdate,
  dispatchUnmatchedDone,
  dispatchUnmatchedPersistenceItemClick,
  dispatchUnmatchedPersistenceListClick,
  dispatchEditPriceInputChange,
  dispatchEditPriceInputBlur,
  dispatchEditSizeInputChange,
  dispatchEditSizeInputBlur,
  dispatchEditPriceNudgeUp,
  dispatchEditPriceNudgeDown,
  dispatchEditSizeNudgeUp,
  dispatchEditSizeNudgeDown,
  dispatchDepositRedirect,
}) => {
  const priceInputId = `${runner}-price`;
  const sizeInputId = `${runner}-size`;

  useKeyboardValueSync(sizeInputId, size);
  useKeyboardValueSync(priceInputId, price);

  const {
    focusedKeyboardControls: { focusedInputId },
  } = useContext(KeyboardContext);
  const { addNotifications, clearNotifications, notifications } = useNotifications(
    marketError?.notification,
    placeError?.notification,
    runner,
  );
  const noop = useCallback(() => {}, []);
  const quickStakes = useMemo(() => [], []);
  const handleExchangeEditPanelCancel = useCallback(
    () => betId && runner && dispatchUnmatchedCancel([betId], runner),
    [betId, dispatchUnmatchedCancel, runner],
  );

  const handleExchangeEditPanelUpdate = useCallback(() => {
    if (isDepositRequired) {
      dispatchDepositRedirect();
      navigateDeposit(DEPOSIT_ENDPOINT);

      return;
    }

    if (market && runner && betId) {
      dispatchUnmatchedUpdate(betId, market, runner, null);
    }
  }, [market, runner, betId, isDepositRequired, dispatchDepositRedirect, dispatchUnmatchedUpdate]);

  const handleExchangeEditPanelPersistenceItemClick = useCallback(
    (persistenceType: string) => {
      if (betId) {
        dispatchUnmatchedPersistenceItemClick(betId, persistenceType as ExchangePersistenceType);
      }
    },
    [betId, dispatchUnmatchedPersistenceItemClick],
  );

  const handleExchangeEditPanelPersistenceListToggle = useCallback(() => {
    clearNotifications(NotificationKeys.Price, NotificationKeys.Size);
    if (betId) {
      dispatchUnmatchedPersistenceListClick(betId, !isPersistenceTypeMenuExpanded);
    }
  }, [clearNotifications, betId, dispatchUnmatchedPersistenceListClick, isPersistenceTypeMenuExpanded]);

  const handleEditOnPriceChange = useCallback(
    (newPrice?: number) => {
      clearNotifications(NotificationKeys.Price);
      if (runner && side && betId) {
        dispatchEditPriceInputChange(runner, betId, side, newPrice, size);
      }
    },
    [clearNotifications, dispatchEditPriceInputChange, runner, side, betId, size],
  );

  const handleOnPriceBlur = useCallback(() => {
    if (priceError && runner && side && betId) {
      dispatchEditPriceInputBlur(runner, betId, side, priceError.newPrice, size);
      addNotifications({ price: priceError.notification });
    }
  }, [addNotifications, priceError, runner, side, betId, dispatchEditPriceInputBlur, size]);

  const handleEditOnSizeChange = useCallback(
    (newSize?: number) => {
      clearNotifications(NotificationKeys.Size);
      if (runner && side && betId) {
        dispatchEditSizeInputChange(runner, betId, side, newSize, price);
      }
    },
    [clearNotifications, dispatchEditSizeInputChange, runner, side, betId, price],
  );

  const handleOnSizeBlur = useCallback(() => {
    if (sizeError && runner && side && betId) {
      dispatchEditSizeInputBlur(runner, betId, side, price, sizeError.newSize);
      addNotifications({ size: sizeError.notification });
    }
  }, [addNotifications, sizeError, runner, side, betId, dispatchEditSizeInputBlur, price]);

  // Workaround to prevent the nudges from clearing the input value on focus, a refactor will be done in the US SLBY-698
  const lastNudgePressTimeRef = useRef<number>(0);
  const NUDGE_PRESS__TIME_FRAME = 100;

  const onPriceNudgeUp = useCallback(() => {
    lastNudgePressTimeRef.current = Date.now();
    clearNotifications(NotificationKeys.Price);
    if (runner && betId && side) {
      dispatchEditPriceNudgeUp(runner, betId, side);
    }
  }, [clearNotifications, runner, betId, side, dispatchEditPriceNudgeUp]);

  const onPriceNudgeDown = useCallback(() => {
    lastNudgePressTimeRef.current = Date.now();
    clearNotifications(NotificationKeys.Price);
    if (runner && betId && side) {
      dispatchEditPriceNudgeDown(runner, betId, side);
    }
  }, [clearNotifications, runner, betId, side, dispatchEditPriceNudgeDown]);

  const onSizeNudgeUp = useCallback(() => {
    lastNudgePressTimeRef.current = Date.now();
    clearNotifications(NotificationKeys.Size);
    if (runner && betId) {
      dispatchEditSizeNudgeUp(runner, betId);
    }
  }, [clearNotifications, runner, betId, dispatchEditSizeNudgeUp]);

  const onSizeNudgeDown = useCallback(() => {
    lastNudgePressTimeRef.current = Date.now();
    clearNotifications(NotificationKeys.Size);
    if (runner && betId) {
      dispatchEditSizeNudgeDown(runner, betId);
    }
  }, [clearNotifications, runner, betId, dispatchEditSizeNudgeDown]);

  const onPriceFocus = useCallback(() => {
    clearNotifications(NotificationKeys.Price);
    const timeSinceNudgePress = Date.now() - lastNudgePressTimeRef.current;
    // Clear value only if focus came from input, not from nudge
    if (timeSinceNudgePress > NUDGE_PRESS__TIME_FRAME) {
      handleEditOnPriceChange();
      // Emit reset event to sync keyboard wrapper value
      DeviceEventEmitter.emit(CUSTOM_KEYBOARD__INPUT_VALUE_RESET, {
        id: priceInputId,
        value: "",
      });
    }
  }, [clearNotifications, handleEditOnPriceChange, priceInputId]);

  const onSizeFocus = useCallback(() => {
    clearNotifications(NotificationKeys.Size);
    const timeSinceNudgePress = Date.now() - lastNudgePressTimeRef.current;
    // Clear value only if focus came from input, not from nudge
    if (timeSinceNudgePress > NUDGE_PRESS__TIME_FRAME) {
      handleEditOnSizeChange();
      // Emit reset event to sync keyboard wrapper value
      DeviceEventEmitter.emit(CUSTOM_KEYBOARD__INPUT_VALUE_RESET, {
        id: sizeInputId,
        value: "",
      });
    }
  }, [clearNotifications, handleEditOnSizeChange, sizeInputId]);

  const wrapperRef = useRef<View>(null);

  const onLayout = useScrollIntoView(wrapperRef);

  if (
    !title ||
    !side ||
    !currencySymbol ||
    isPersistenceTypeMenuExpanded === undefined ||
    !persistenceListSelectedKey
  ) {
    return null;
  }

  const placeButtonLabel = <Styled translation={placeLabel} styles={{ depositTo: styles.depositTo }} />;

  return (
    <View ref={wrapperRef} onLayout={onLayout}>
      <InlinePanel
        title={title}
        titlePrefix={titlePrefix}
        color={InlinePanelColorMap[side]}
        onAction={dispatchUnmatchedDone}
      >
        <View style={styles.container}>
          <KeyboardExchangeInlineEditPanel
            sizeInputId={sizeInputId}
            priceInputId={priceInputId}
            price={price}
            size={size}
            profitLabel={profitLabel}
            profitValue={profitValue}
            profitRawValue={profitRawValue}
            labels={labels}
            placeLabel={placeButtonLabel}
            loadingLabel={loadingLabel}
            isPriceDisabled={isPriceDisabled}
            isSizeDisabled={isSizeDisabled}
            isUpdateDisabled={isUpdateButtonDisabled}
            currencySymbol={currencySymbol}
            isPersistenceMenuOpen={isPersistenceTypeMenuExpanded}
            persistenceOptions={persistenceListTypes}
            persistenceSelectedId={persistenceListSelectedKey}
            quickStakes={quickStakes}
            betDelay={betDelay}
            hasPlaceError={!!placeError?.notification}
            notifications={notifications}
            focusedInputId={focusedInputId}
            onPriceNudgeDown={onPriceNudgeDown}
            onPriceNudgeUp={onPriceNudgeUp}
            onSizeNudgeDown={onSizeNudgeDown}
            onSizeNudgeUp={onSizeNudgeUp}
            onPersistenceChange={handleExchangeEditPanelPersistenceItemClick}
            onPersistenceToggle={handleExchangeEditPanelPersistenceListToggle}
            onPriceChange={handleEditOnPriceChange}
            onPriceBlur={handleOnPriceBlur}
            onPriceFocus={onPriceFocus}
            onSizeChange={handleEditOnSizeChange}
            onSizeBlur={handleOnSizeBlur}
            onSizeFocus={onSizeFocus}
            onCancel={handleExchangeEditPanelCancel}
            onUpdate={handleExchangeEditPanelUpdate}
            onQuickStakeAdd={noop}
          />
          <JurisdictionalOperatorInfo />
        </View>
      </InlinePanel>
    </View>
  );
};
