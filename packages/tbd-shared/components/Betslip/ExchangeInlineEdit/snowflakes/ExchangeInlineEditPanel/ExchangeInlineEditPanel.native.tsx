import { FunctionComponent, useCallback, useMemo } from "react";
import { View } from "react-native";

import { CardHeaderSize, CardTheme, AlertViewModel, PNLAndWhatIfSize } from "@ppb/the-wall-common/types";

import {
  Alerts,
  Card,
  NudgesNumberInputField,
  PebbleList,
  PNLAndWhatIf,
  PrimaryButton,
  QuickStakes,
  SecondaryButton,
} from "@ppb/the-wall-native";

import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";

import {
  EXCHANGE_INLINE_EDIT_PANEL,
  INPUT,
  NOTIFICATIONS,
  PLACE_BUTTON,
} from "./ExchangeInlineEditPanel.native.selectors";
import styles from "./ExchangeInlineEditPanel.native.styles";
import type { ExchangeInlineEditPanelViewModel } from "./ExchangeInlineEditPanel.types";

const DEFAULT_NOTIFICATIONS: AlertViewModel[] = [];

export const ExchangeInlineEditPanel: FunctionComponent<ExchangeInlineEditPanelViewModel> = ({
  sizeInputId,
  priceInputId,
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
  notifications = DEFAULT_NOTIFICATIONS,
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
}) => {
  const isPriceFocused = focusedInputId ? priceInputId === focusedInputId : false;
  const isSizeFocused = focusedInputId ? sizeInputId === focusedInputId : false;

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
    <View {...getTestProps(EXCHANGE_INLINE_EDIT_PANEL, false)}>
      <View style={styles.row}>
        <View {...getTestProps(INPUT, false)} style={styles.item}>
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
        </View>
        <View {...getTestProps(INPUT, false)} style={styles.item}>
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
        </View>
      </View>
      {notifications?.length ? (
        <View style={styles.notifications} {...getTestProps(NOTIFICATIONS, false)}>
          <Alerts alerts={notifications} />
        </View>
      ) : null}
      <View style={styles.row}>
        <View style={styles.item}>
          <SecondaryButton label={labels.cancel} onTap={onCancel} />
        </View>
        <View style={styles.item} {...getTestProps(PLACE_BUTTON, false)}>
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
        </View>
      </View>
      <View style={styles.persistence}>
        <Card
          isCollapsible
          fullWidthContent
          title={persistenceTitle}
          onTitleClick={onPersistenceToggle}
          startOpen={isPersistenceMenuOpen}
          theme={CardTheme.TRANSPARENT}
          size={CardHeaderSize.MEDIUM}
        >
          <View style={[styles.collapseChildren, isPersistenceMenuOpen ? {} : styles.paddingBottom]}>
            <PebbleList
              items={persistenceOptions}
              defaultSelectedPebble={persistenceSelectedId}
              onPebblePress={onPersistenceChange}
            />
          </View>
        </Card>
      </View>
      {quickStakes.length > 0 && (
        <View style={styles.quickStakes}>
          <QuickStakes quickStakes={quickStakes} onTouch={onQuickStakeAdd} />
        </View>
      )}
    </View>
  );
};
