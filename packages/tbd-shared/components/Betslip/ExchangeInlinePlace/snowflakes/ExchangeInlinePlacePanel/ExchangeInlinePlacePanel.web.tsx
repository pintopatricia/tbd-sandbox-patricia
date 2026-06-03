import { FunctionComponent, useCallback } from "react";

import { AlertViewModel, PNLAndWhatIfSize } from "@ppb/the-wall-common/types";
import {
  BetslipNotifications,
  FreeBets,
  NudgesNumberInputField,
  PNLAndWhatIf,
  PrimaryButton,
  QuickStakes,
} from "@ppb/the-wall-web";

import styles from "./ExchangeInlinePlacePanel.web.module.css";
import type {
  ExchangeInlinePlacePanelOnQuickStakeTouch,
  ExchangeInlinePlacePanelViewModel,
} from "./ExchangeInlinePlacePanel.types";

const DEFAULT_NOTIFICATIONS: AlertViewModel[] = [];

export const ExchangeInlinePlacePanel: FunctionComponent<ExchangeInlinePlacePanelViewModel> = ({
  priceInputId,
  sizeInputId,
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
  notifications = DEFAULT_NOTIFICATIONS,
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
  onSizeFocus,
  onSizeBlur,
  onPriceMouseDown,
  onSizeMouseDown,
}) => {
  const handleOnPriceFocus = useCallback(
    (isFocused: boolean): void => {
      if (isFocused) {
        onPriceFocus();
      }
    },
    [onPriceFocus],
  );

  const handleOnSizeFocus = useCallback(
    (isFocused: boolean): void => {
      if (isFocused) {
        onSizeFocus();
      }
    },
    [onSizeFocus],
  );

  const handleQuickStakeTouch = useCallback<ExchangeInlinePlacePanelOnQuickStakeTouch>(
    (...args) => !disabled && onQuickStakeTouch(...args),
    [disabled, onQuickStakeTouch],
  );

  const isPriceFocused = focusedInputId ? focusedInputId === priceInputId : false;
  const isSizeFocused = focusedInputId ? focusedInputId === sizeInputId : false;

  return (
    <div className={styles.container}>
      <div className={styles.inputsContainer}>
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
        <span className={styles.input} onMouseDown={onPriceMouseDown}>
          <NudgesNumberInputField
            id={priceInputId}
            disabled={disabled}
            label={pricePlaceholder}
            value={price}
            focused={isPriceFocused}
            hasCaret={isPriceFocused}
            onNudgeUp={onPriceNudgeUp}
            onNudgeDown={onPriceNudgeDown}
            onBlur={onPriceBlur}
            onFocus={handleOnPriceFocus}
            onChange={onPriceChange}
          />
        </span>
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
        <span className={styles.input} onMouseDown={onSizeMouseDown}>
          <NudgesNumberInputField
            id={sizeInputId}
            disabled={disabled}
            label={sizePlaceholder}
            value={size}
            currencySymbol={currencySymbol}
            focused={isSizeFocused}
            hasCaret={isSizeFocused}
            onBlur={onSizeBlur}
            onFocus={handleOnSizeFocus}
            onChange={onSizeChange}
            onNudgeUp={onSizeNudgeUp}
            onNudgeDown={onSizeNudgeDown}
          />
        </span>
      </div>
      {hasFreeBets && (
        <div className={styles.freebets}>
          <FreeBets
            disabled={disabled}
            label={freeBetsLabel}
            isSelected={isFreeBetsSelected}
            onFreeBetsChange={onFreeBetsChange}
          />
        </div>
      )}
      {notifications?.length ? (
        <div className={styles.notifications}>
          <BetslipNotifications alerts={notifications} />
        </div>
      ) : null}
      <div className={styles.placeButton}>
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
      </div>
      {quickStakes && (
        <div className={styles.quickStakes}>
          <QuickStakes quickStakes={quickStakes} onTouch={handleQuickStakeTouch} isDisabled={disabled} />
        </div>
      )}
    </div>
  );
};
