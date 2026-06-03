import { FunctionComponent, useCallback, useMemo } from "react";
import classnames from "classnames";

import { CardHeaderSize, CardTheme, AlertViewModel, PNLAndWhatIfSize } from "@ppb/the-wall-common/types";

import {
  BetslipNotifications,
  Card,
  NudgesNumberInputField,
  PebbleList,
  PNLAndWhatIf,
  PrimaryButton,
  QuickStakes,
  SecondaryButton,
} from "@ppb/the-wall-web";

import styles from "./ExchangeInlineEditPanel.web.module.css";
import type { ExchangeInlineEditPanelViewModel } from "./ExchangeInlineEditPanel.types";

const DEFAULT_ALERTS: AlertViewModel[] = [];

export const ExchangeInlineEditPanel: FunctionComponent<ExchangeInlineEditPanelViewModel> = ({
  priceInputId,
  sizeInputId,
  profitLabel,
  profitValue,
  profitRawValue,
  labels,
  placeLabel,
  loadingLabel,
  price,
  size,
  currencySymbol,
  betDelay,
  hasPlaceError = false,
  isUpdateDisabled,
  isPriceDisabled,
  isSizeDisabled,
  isPersistenceMenuOpen,
  persistenceOptions,
  persistenceSelectedId,
  quickStakes,
  notifications = DEFAULT_ALERTS,
  focusedInputId,
  onPriceNudgeDown,
  onPriceNudgeUp,
  onSizeNudgeDown,
  onSizeNudgeUp,
  onPriceChange,
  onPriceBlur,
  onPriceFocus,
  onSizeChange,
  onSizeBlur,
  onSizeFocus,
  onCancel,
  onUpdate,
  onPersistenceToggle,
  onPersistenceChange,
  onQuickStakeAdd,
  onPriceMouseDown,
  onSizeMouseDown,
}) => {
  const isPriceFocused = focusedInputId ? focusedInputId === priceInputId : false;
  const isSizeFocused = focusedInputId ? focusedInputId === sizeInputId : false;

  const handleOnPriceFocus = useCallback(
    (focused: boolean): void => {
      if (focused && onPriceFocus) {
        onPriceFocus(true);
      }
    },
    [onPriceFocus],
  );

  const handleOnSizeFocus = useCallback(
    (focused: boolean): void => {
      if (focused && onSizeFocus) {
        onSizeFocus(true);
      }
    },
    [onSizeFocus],
  );

  const selectedOption = persistenceOptions.find((o) => o.id === persistenceSelectedId);

  const persistenceTitle = useMemo(
    () => `${labels.persistence}${selectedOption ? `: ${selectedOption.text}` : ""}`,
    [labels.persistence, selectedOption],
  );

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
        <div className={styles.item} onMouseDown={onPriceMouseDown}>
          <NudgesNumberInputField
            id={priceInputId}
            disabled={isPriceDisabled}
            label={labels.price}
            value={price}
            focused={isPriceFocused}
            hasCaret={isPriceFocused}
            onNudgeUp={onPriceNudgeUp}
            onNudgeDown={onPriceNudgeDown}
            onFocus={handleOnPriceFocus}
            onBlur={onPriceBlur}
            onChange={onPriceChange}
          />
        </div>
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
        <div className={styles.item} onMouseDown={onSizeMouseDown}>
          <NudgesNumberInputField
            id={sizeInputId}
            disabled={isSizeDisabled}
            label={labels.size}
            value={size}
            currencySymbol={currencySymbol}
            focused={isSizeFocused}
            hasCaret={isSizeFocused}
            onFocus={handleOnSizeFocus}
            onBlur={onSizeBlur}
            onChange={onSizeChange}
            onNudgeUp={onSizeNudgeUp}
            onNudgeDown={onSizeNudgeDown}
          />
        </div>
      </div>
      {notifications?.length ? (
        <div className={styles.notifications}>
          <BetslipNotifications alerts={notifications} />
        </div>
      ) : null}
      <div className={styles.row}>
        <div className={styles.item}>
          <SecondaryButton label={labels.cancel} onTap={onCancel} />
        </div>
        <div className={styles.item}>
          <PrimaryButton
            label={placeLabel}
            secondaryLabel={profitLabel}
            delay={betDelay}
            loadingLabel={loadingLabel}
            stopAnimation={hasPlaceError}
            disabled={isUpdateDisabled}
            onTap={onUpdate}
          >
            <PNLAndWhatIf
              pnl={profitValue}
              rawPnl={profitRawValue}
              size={PNLAndWhatIfSize.MEDIUM}
              agnostic={true}
              disabled={isUpdateDisabled}
            />
          </PrimaryButton>
        </div>
      </div>
      <div className={styles.persistence}>
        <Card
          isCollapsible
          fullWidthContent
          title={persistenceTitle}
          onTitleClick={onPersistenceToggle}
          startOpen={isPersistenceMenuOpen}
          theme={CardTheme.TRANSPARENT}
          size={CardHeaderSize.MEDIUM}
        >
          <div className={classnames(styles.collapseChildren, { [styles.paddingBottom]: !isPersistenceMenuOpen })}>
            <PebbleList
              items={persistenceOptions}
              defaultSelectedPebble={persistenceSelectedId}
              onPebbleClick={onPersistenceChange}
            />
          </div>
        </Card>
      </div>
      {quickStakes.length > 0 && (
        <div className={styles.quickStakes}>
          <QuickStakes quickStakes={quickStakes} onTouch={onQuickStakeAdd} />
        </div>
      )}
    </div>
  );
};
