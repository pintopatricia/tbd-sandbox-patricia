import { FunctionComponent, useCallback } from "react";
import { View } from "react-native";

import { AlertViewModel, PNLAndWhatIfSize } from "@ppb/the-wall-common/types";
import { Alerts, FreeBets, PNLAndWhatIf, PrimaryButton, QuickStakes } from "@ppb/the-wall-native";
import { NudgesNumberInputField } from "@ppb/the-wall-native/components/InputsAndControls/NudgesNumberInputField/NudgesNumberInputField";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";

import {
  INPUT,
  FREE_BETS,
  NOTIFICATIONS,
  PLACE_BUTTON,
  QUICKSTAKES,
} from "./ExchangeInlinePlacePanel.native.selectors";
import styles from "./ExchangeInlinePlacePanel.native.styles";
import type {
  ExchangeInlinePlacePanelOnQuickStakeTouch,
  ExchangeInlinePlacePanelViewModel,
} from "./ExchangeInlinePlacePanel.types";

const DEFAULT_ALERTS: AlertViewModel[] = [];

export const ExchangeInlinePlacePanel: FunctionComponent<ExchangeInlinePlacePanelViewModel> = ({
  sizeInputId,
  priceInputId,
  currencySymbol,
  hasFreeBets,
  hasPlaceError = false,
  isFreeBetsSelected,
  isPlaceButtonDisabled,
  loadingLabel,
  disabled = false,
  placeBtnLabel,
  pricePlaceholder,
  quickStakes,
  sizePlaceholder,
  betDelay,
  freeBetsLabel,
  notifications = DEFAULT_ALERTS,
  price,
  profitLabel,
  profitValue,
  profitRawValue,
  size,
  focusedInputId,
  onFreeBetsChange,
  onPriceNudgeDown,
  onPriceNudgeUp,
  onSizeNudgeDown,
  onSizeNudgeUp,
  onPlaceClick,
  onPriceChange,
  onPriceBlur,
  onPriceFocus,
  onQuickStakeTouch,
  onSizeChange,
  onSizeBlur,
  onSizeFocus,
}) => {
  const isPriceFocused = focusedInputId ? priceInputId === focusedInputId : false;
  const isSizeFocused = focusedInputId ? sizeInputId === focusedInputId : false;

  const handleOnPriceFocus = useCallback(
    (isFocused: boolean): void => {
      if (isFocused && onPriceFocus) {
        onPriceFocus();
      }
    },
    [onPriceFocus],
  );

  const handleOnSizeFocus = useCallback(
    (isFocused: boolean): void => {
      if (isFocused && onSizeFocus) {
        onSizeFocus();
      }
    },
    [onSizeFocus],
  );

  const handleQuickStakeTouch = useCallback<ExchangeInlinePlacePanelOnQuickStakeTouch>(
    (...args) => !disabled && onQuickStakeTouch(...args),
    [disabled, onQuickStakeTouch],
  );

  return (
    <>
      <View style={styles.inputsContainer}>
        <View {...getTestProps(INPUT, false)} style={styles.firstInput}>
          <NudgesNumberInputField
            id={priceInputId}
            disabled={disabled}
            label={pricePlaceholder}
            value={price}
            focused={isPriceFocused}
            hasCaret={isPriceFocused}
            onNudgeUp={onPriceNudgeUp}
            onNudgeDown={onPriceNudgeDown}
            onFocus={handleOnPriceFocus}
            onBlur={onPriceBlur}
            onChange={onPriceChange}
          />
        </View>
        <View {...getTestProps(INPUT, false)} style={styles.lastInput}>
          <NudgesNumberInputField
            id={sizeInputId}
            disabled={disabled}
            label={sizePlaceholder}
            value={size}
            focused={isSizeFocused}
            currencySymbol={currencySymbol}
            hasCaret={isSizeFocused}
            onChange={onSizeChange}
            onFocus={handleOnSizeFocus}
            onBlur={onSizeBlur}
            onNudgeUp={onSizeNudgeUp}
            onNudgeDown={onSizeNudgeDown}
          />
        </View>
      </View>
      {hasFreeBets && (
        <View style={styles.freebets} {...getTestProps(FREE_BETS, false)}>
          <FreeBets
            disabled={disabled}
            label={freeBetsLabel}
            isSelected={isFreeBetsSelected}
            onFreeBetsChange={onFreeBetsChange}
          />
        </View>
      )}
      {notifications?.length ? (
        <View style={styles.notifications} {...getTestProps(NOTIFICATIONS, false)}>
          <Alerts alerts={notifications} />
        </View>
      ) : null}
      <View style={styles.placeButton} {...getTestProps(PLACE_BUTTON, false)}>
        <PrimaryButton
          stopAnimation={hasPlaceError}
          label={placeBtnLabel}
          delay={betDelay}
          disabled={disabled || isPlaceButtonDisabled}
          loadingLabel={loadingLabel}
          onTap={onPlaceClick}
          secondaryLabel={profitLabel}
        >
          <PNLAndWhatIf
            pnl={profitValue}
            rawPnl={profitRawValue}
            size={PNLAndWhatIfSize.MEDIUM}
            agnostic={true}
            disabled={disabled || isPlaceButtonDisabled}
          />
        </PrimaryButton>
      </View>
      {quickStakes.length > 0 && (
        <View style={styles.quickStakes} {...getTestProps(QUICKSTAKES, false)}>
          <QuickStakes quickStakes={quickStakes} onTouch={handleQuickStakeTouch} isDisabled={disabled} />
        </View>
      )}
    </>
  );
};
