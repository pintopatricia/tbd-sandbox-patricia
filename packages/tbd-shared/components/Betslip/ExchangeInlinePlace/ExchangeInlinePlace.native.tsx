import { FunctionComponent, useContext, useCallback, useRef, useEffect } from "react";
import { View, DeviceEventEmitter } from "react-native";
import useLoginWithPendingState from "../../../hooks/useLoginWithPendingState.native";

import { Styled } from "@ppb/the-wall-native";
import { InlinePanel } from "../InlinePanel/InlinePanel.native";
import { InlinePanelColorMap } from "../InlinePanel/InlinePanel.types";
import { navigateDeposit } from "@ppb/tbd-router/native";

import { useScrollIntoView } from "../../../hooks/useScrollIntoView.native";
import { NotificationKeys, useNotifications } from "../../../hooks/useNotifications";
import { getEndpoint } from "../../../config/endpoints";
import { KeyboardContext } from "../Keyboard/KeyboardContext";
import { withKeyboardExc } from "../Keyboard/withKeyboardExc.native";
import { useKeyboardValueSync } from "../Keyboard/useKeyboardValueSync.native";
import { CUSTOM_KEYBOARD__VALUE_UPDATE } from "@ppb/the-wall-common/types/Keyboard/Keyboard.types";
import { JurisdictionalOperatorInfo } from "../JurisdictionalOperatorInfo/JurisdictionalOperatorInfo.native";

import { ExchangeInlinePlacePanel } from "./snowflakes/ExchangeInlinePlacePanel/ExchangeInlinePlacePanel.native";
import { ComponentProps } from "./props";
import styles from "./ExchangeInlinePlace.native.styles";

const CUSTOM_KEYBOARD__INPUT_VALUE_RESET = "CUSTOM_KEYBOARD__INPUT_VALUE_RESET";

const DEPOSIT_ENDPOINT = getEndpoint("DEPOSIT");

const KeyboardExchangeInlinePlacePanel = withKeyboardExc(ExchangeInlinePlacePanel);

export const ExchangeInlinePlace: FunctionComponent<ComponentProps> = ({
  side,
  title,
  titlePrefix,
  profitLabel,
  profitValue,
  profitRawValue,
  quickStakes,
  size,
  price,
  runner,
  currencySymbol,
  prefersConfirm,
  betDelay,
  freeBetsLabel,
  hasFreeBets = false,
  isFreeBetsSelected = false,
  eligibleBonus,
  isPlacing,
  marketError,
  placeError,
  priceError,
  sizeError,
  isDepositRequired,
  placeBtnLabel,
  pricePlaceholder,
  sizePlaceholder,
  loadingLabel,
  isLoggedIn,
  isEditing,
  dispatchExchangeSizeInputChangeAction,
  dispatchExchangeSizeInputBlurAction,
  dispatchExchangeSizeNudgeUpAction,
  dispatchExchangeSizeNudgeDownAction,
  dispatchExchangePriceInputChangeAction,
  dispatchExchangePriceInputBlurAction,
  dispatchExchangePriceNudgeUpAction,
  dispatchExchangePriceNudgeDownAction,
  dispatchIncrementByQuickStakeAction,
  dispatchExchangeBonusChangeAction,
  dispatchExchangePlaceBetAction,
  dispatchExchangeSelectionRemoveAction,
  dispatchCloseAction,
  dispatchDepositRedirect,
  dispatchLoginToPlaceBetAction,
}) => {
  const priceInputId = `${runner}-price`;
  const sizeInputId = `${runner}-size`;

  useKeyboardValueSync(sizeInputId, size);
  useKeyboardValueSync(priceInputId, price);

  const { focusedKeyboardControls, setFocusedKeyboardControls } = useContext(KeyboardContext);
  const focusedInputId = focusedKeyboardControls?.focusedInputId;
  const login = useLoginWithPendingState();

  const { addNotifications, clearNotifications, notifications } = useNotifications(
    marketError?.notification,
    placeError?.notification,
    runner,
  );

  const handleOnPriceBlur = useCallback(() => {
    if (priceError && runner && side) {
      dispatchExchangePriceInputBlurAction(runner, side, priceError.newPrice, size);
      addNotifications({ price: priceError.notification });
    }
  }, [priceError, runner, side, dispatchExchangePriceInputBlurAction, size, addNotifications]);

  const handleOnSizeBlur = useCallback(() => {
    if (sizeError && runner && side) {
      dispatchExchangeSizeInputBlurAction(runner, side, price, sizeError.newSize);
      addNotifications({ size: sizeError.notification });
    }
  }, [sizeError, runner, side, dispatchExchangeSizeInputBlurAction, price, addNotifications]);

  const handleOnSizeChange = useCallback(
    (newSize?: number) => {
      clearNotifications(NotificationKeys.Size);
      if (runner && side) {
        dispatchExchangeSizeInputChangeAction(runner, side, price, newSize);
      }
    },
    [clearNotifications, dispatchExchangeSizeInputChangeAction, runner, side, price],
  );

  const handleOnPriceChange = useCallback(
    (newPrice?: number) => {
      clearNotifications(NotificationKeys.Price);
      if (runner && side) {
        dispatchExchangePriceInputChangeAction(runner, side, newPrice, size);
      }
    },
    [clearNotifications, dispatchExchangePriceInputChangeAction, runner, side, size],
  );

  // Workaround to prevent the nudges from clearing the input value on focus, a refactor will be done in the US SLBY-698
  const lastNudgePressTimeRef = useRef<number>(0);
  // Skip the next focus reset when quick-stake updates the value.
  const skipResetOnFocusRef = useRef<boolean>(false);
  const NUDGE_PRESS__TIME_FRAME = 100;

  const onPriceNudgeUp = useCallback(() => {
    lastNudgePressTimeRef.current = Date.now();
    clearNotifications(NotificationKeys.Price);
    if (runner && side) {
      dispatchExchangePriceNudgeUpAction(runner, side);
    }
  }, [clearNotifications, runner, side, dispatchExchangePriceNudgeUpAction]);

  const onPriceNudgeDown = useCallback(() => {
    lastNudgePressTimeRef.current = Date.now();
    clearNotifications(NotificationKeys.Price);
    if (runner && side) {
      dispatchExchangePriceNudgeDownAction(runner, side);
    }
  }, [clearNotifications, runner, side, dispatchExchangePriceNudgeDownAction]);

  const onSizeNudgeUp = useCallback(() => {
    lastNudgePressTimeRef.current = Date.now();
    clearNotifications(NotificationKeys.Size);
    if (runner && side) {
      dispatchExchangeSizeNudgeUpAction(runner, side);
    }
  }, [clearNotifications, runner, side, dispatchExchangeSizeNudgeUpAction]);

  const onSizeNudgeDown = useCallback(() => {
    lastNudgePressTimeRef.current = Date.now();
    clearNotifications(NotificationKeys.Size);
    if (runner && side) {
      dispatchExchangeSizeNudgeDownAction(runner, side);
    }
  }, [clearNotifications, runner, side, dispatchExchangeSizeNudgeDownAction]);

  const onPriceFocus = useCallback(() => {
    clearNotifications(NotificationKeys.Price);
    const timeSinceNudgePress = Date.now() - lastNudgePressTimeRef.current;
    if (timeSinceNudgePress > NUDGE_PRESS__TIME_FRAME) {
      handleOnPriceChange();
      DeviceEventEmitter.emit(CUSTOM_KEYBOARD__INPUT_VALUE_RESET, {
        id: priceInputId,
        value: "",
      });
    }
  }, [clearNotifications, handleOnPriceChange, priceInputId]);

  const onSizeFocus = useCallback(() => {
    clearNotifications(NotificationKeys.Size);
    // If a quick-stake just updated the value, skip the usual focus reset.
    if (skipResetOnFocusRef.current) {
      skipResetOnFocusRef.current = false;
      return;
    }
    const timeSinceNudgePress = Date.now() - lastNudgePressTimeRef.current;
    if (timeSinceNudgePress > NUDGE_PRESS__TIME_FRAME) {
      handleOnSizeChange();
      DeviceEventEmitter.emit(CUSTOM_KEYBOARD__INPUT_VALUE_RESET, {
        id: sizeInputId,
        value: "",
      });
    }
  }, [clearNotifications, handleOnSizeChange, sizeInputId]);

  const handleQuickStakeTouch = useCallback(
    (quickStakeValue: number) => {
      clearNotifications();
      if (!runner || !side) return;
      // record quick-stake press time and skip the next focus reset
      lastNudgePressTimeRef.current = Date.now();
      skipResetOnFocusRef.current = true;

      let transformed = false;

      try {
        const focusedRef = focusedKeyboardControls?.focusedInputRef;
        if (focusedRef?.current && typeof focusedRef.current.transformValue === "function" && side) {
          let computed: string | undefined;
          focusedRef.current.transformValue((currentValue: string) => {
            const decoded = `${currentValue}`.replace(/,/g, ".");
            const parsed = Number(decoded.replace(/[^0-9.]/g, ""));
            const base = Number.isNaN(parsed) ? 0 : parsed;
            const next = base + quickStakeValue;
            computed = `${next}`;
            return computed;
          });

          if (computed != null) {
            transformed = true;
          }
        }
      } catch (err) {
        void err;
      }

      if (!transformed) {
        dispatchIncrementByQuickStakeAction(runner, side, quickStakeValue, currencySymbol);

        const newSize = (size ?? 0) + quickStakeValue;
        DeviceEventEmitter.emit(CUSTOM_KEYBOARD__VALUE_UPDATE, {
          id: sizeInputId,
          value: `${newSize}`,
        });
      }
    },
    [
      clearNotifications,
      runner,
      side,
      dispatchIncrementByQuickStakeAction,
      currencySymbol,
      size,
      sizeInputId,
      focusedKeyboardControls,
    ],
  );

  const handleFreeBetsChange = useCallback(
    (isSelected: boolean) => {
      if (runner && eligibleBonus) {
        dispatchExchangeBonusChangeAction(isSelected, runner, eligibleBonus);
      }
    },
    [runner, eligibleBonus, dispatchExchangeBonusChangeAction],
  );

  const onPlaceBetCallback = useCallback(() => {
    if (!isLoggedIn) {
      if (side) {
        dispatchLoginToPlaceBetAction(side);
      }

      login();

      return;
    }

    if (isDepositRequired) {
      dispatchDepositRedirect();
      navigateDeposit(DEPOSIT_ENDPOINT);

      return;
    }

    if (runner) {
      try {
        const focusedRef = focusedKeyboardControls?.focusedInputRef;
        if (focusedRef?.current && typeof focusedRef.current.transformValue === "function") {
          let captured: string | undefined;
          focusedRef.current.transformValue((currentValue: string) => {
            captured = `${currentValue}`;
            return currentValue;
          });

          if (captured != null) {
            const decoded = `${captured}`.replace(/,/g, ".");
            const parsed = Number(decoded.replace(/[^0-9.]/g, ""));
            if (!Number.isNaN(parsed) && side) {
              dispatchExchangeSizeInputChangeAction(runner, side, price, parsed);
            }
          }
        }
      } catch (err) {
        void err;
      }

      dispatchExchangePlaceBetAction(runner, !!prefersConfirm);
    }
  }, [
    isLoggedIn,
    isDepositRequired,
    runner,
    side,
    login,
    dispatchLoginToPlaceBetAction,
    dispatchDepositRedirect,
    dispatchExchangePlaceBetAction,
    prefersConfirm,
    dispatchExchangeSizeInputChangeAction,
    focusedKeyboardControls,
    price,
  ]);

  const onInlinePanelClose = useCallback(() => {
    if (runner && side) {
      dispatchExchangeSelectionRemoveAction(runner, side);
    }

    dispatchCloseAction();
  }, [dispatchCloseAction, runner, side, dispatchExchangeSelectionRemoveAction]);

  const wrapperRef = useRef<View>(null);

  const onLayout = useScrollIntoView(wrapperRef);

  useEffect(() => {
    if (!isEditing) {
      setFocusedKeyboardControls((prev) => ({
        ...prev,
        focusedInputId: sizeInputId,
      }));
    }
  }, [setFocusedKeyboardControls, sizeInputId, isEditing]);

  if (!side || !quickStakes) {
    return null;
  }

  const isPlaceBtnDisabled = !price || !size || !!priceError;
  const disabled = !!isPlacing || !!marketError;

  const placeButtonLabel = <Styled translation={placeBtnLabel} styles={{ depositTo: styles.depositTo }} />;

  return (
    <View ref={wrapperRef} onLayout={onLayout}>
      <InlinePanel
        titlePrefix={titlePrefix}
        title={title}
        color={InlinePanelColorMap[side]}
        onAction={onInlinePanelClose}
      >
        <View style={styles.container}>
          <KeyboardExchangeInlinePlacePanel
            sizeInputId={sizeInputId}
            priceInputId={priceInputId}
            disabled={disabled}
            currencySymbol={currencySymbol || ""}
            hasFreeBets={hasFreeBets}
            isFreeBetsSelected={isFreeBetsSelected}
            isPlaceButtonDisabled={isPlaceBtnDisabled}
            quickStakes={quickStakes}
            betDelay={betDelay}
            freeBetsLabel={freeBetsLabel}
            price={price}
            profitLabel={profitLabel}
            profitValue={profitValue}
            profitRawValue={profitRawValue}
            size={size}
            hasPlaceError={!!placeError}
            notifications={notifications}
            loadingLabel={loadingLabel}
            placeBtnLabel={placeButtonLabel}
            pricePlaceholder={pricePlaceholder}
            sizePlaceholder={sizePlaceholder}
            focusedInputId={focusedInputId}
            onFreeBetsChange={handleFreeBetsChange}
            onPriceNudgeDown={onPriceNudgeDown}
            onPriceNudgeUp={onPriceNudgeUp}
            onSizeNudgeDown={onSizeNudgeDown}
            onSizeNudgeUp={onSizeNudgeUp}
            onPlaceClick={onPlaceBetCallback}
            onPriceChange={handleOnPriceChange}
            onPriceBlur={handleOnPriceBlur}
            onPriceFocus={onPriceFocus}
            onQuickStakeTouch={handleQuickStakeTouch}
            onSizeChange={handleOnSizeChange}
            onSizeBlur={handleOnSizeBlur}
            onSizeFocus={onSizeFocus}
          />
          <JurisdictionalOperatorInfo />
        </View>
      </InlinePanel>
    </View>
  );
};
