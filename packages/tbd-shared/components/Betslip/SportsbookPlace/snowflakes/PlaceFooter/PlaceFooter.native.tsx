import { FunctionComponent, useCallback, useContext, useMemo } from "react";
import { DeviceEventEmitter, Pressable, View } from "react-native";

import { tokens } from "@ppb/the-wall-common/base-theme";
import { AlertType } from "@ppb/the-wall-common/types";
import { SystemIconName, ValueIconName } from "@ppb/the-wall-icons";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";

import { SCROLL_INTO_KEYBOARD_EVENT_NAME, FreeBets, BetsSummary, PrimaryButton, Alert } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import type { PlaceFooterViewModel } from "./PlaceFooter.types";

import {
  PLACE_FOOTER,
  PLACE_FOOTER_BUTTON,
  PLACE_FOOTER_REMOVE_ALL_BUTTON,
  PLACE_FOOTER_SECONDARY_BUTTON,
} from "./PlaceFooter.native.selectors";

import styles from "./PlaceFooter.native.styles";
import { KeyboardContext } from "../../../Keyboard/KeyboardContext";
import { JurisdictionalOperatorInfo } from "../../../JurisdictionalOperatorInfo/JurisdictionalOperatorInfo.native";
import { RootBetslipContext } from "../../../RootBetslip/RootBetslipContext";

export const PlaceFooter: FunctionComponent<PlaceFooterViewModel> = ({
  i18n,
  isPanelDisabled,
  isPlaceDisabled,
  notifications,
  footerPrefix,

  // Accept Odds Movement
  showAcceptOddsMovementAlert,
  isOddsMovementOn,
  oddsMovementLabels,

  // Free Bets
  hasFreeBets,
  isFreeBetsSelected,
  isFreeBetsDisabled = false,

  // Free Bets Wallets
  freeBetsAlertMessage,

  // Summary
  isSummaryDisabled,
  balanceAfterBet,
  totalReturns,
  totalOriginalReturns,
  isOddsBoosted = false,

  // Buttons
  hasCTALoading = true,
  hasPlaceError,
  placeBtnLabel,
  placeBtnSecondaryLabel,
  placeBtnLoadingLabel,
  reversePlaceBtnLabels = false,

  isLoggedIn = false,
  secondaryButton,

  // Actions
  onFreeBetsChange,
  onFreeBetsRemovePress,
  onRemoveAllPress,
  onPlacePress,
  onOddsMovementPreferencesChange,
}) => {
  const {
    focusedKeyboardControls: { focusedTargetRef },
  } = useContext(KeyboardContext);
  const { isBetConfirmationStep } = useContext(RootBetslipContext);

  const trashIcon = useMemo(() => {
    const iconColor = isPanelDisabled ? tokens.PlaceFooterIconDisableColour : tokens.PlaceFooterIconDefaultColour;

    return (
      <View style={styles.trashIcon}>
        <GenericIcon name={SystemIconName.TRASH} color={iconColor} />
      </View>
    );
  }, [isPanelDisabled]);

  const onLayoutCallback = useCallback(() => {
    if (!isBetConfirmationStep && focusedTargetRef?.current) {
      DeviceEventEmitter.emit(SCROLL_INTO_KEYBOARD_EVENT_NAME, focusedTargetRef.current);
    }
  }, [focusedTargetRef, isBetConfirmationStep]);

  const handleOddsMovementChange = useCallback(
    (isChecked: boolean) => {
      onOddsMovementPreferencesChange(isChecked);
    },
    [onOddsMovementPreferencesChange],
  );

  const oddsMovementAlertAction = useMemo(
    () => ({
      onChange: handleOddsMovementChange,
      isChecked: isOddsMovementOn,
      label: oddsMovementLabels.message,
    }),
    [handleOddsMovementChange, isOddsMovementOn, oddsMovementLabels.message],
  );

  return (
    <View style={styles.footerContainer} {...getTestProps(PLACE_FOOTER, false)} onLayout={onLayoutCallback}>
      {notifications}
      {hasFreeBets && (
        <FreeBets
          label={i18n.freeBetsLabel}
          isSelected={isFreeBetsSelected}
          disabled={isPanelDisabled || isFreeBetsDisabled}
          onFreeBetsChange={onFreeBetsChange}
        />
      )}
      {!!freeBetsAlertMessage && (
        <Alert
          message={freeBetsAlertMessage}
          type={AlertType.Generosity}
          iconOverload={ValueIconName.FREE_BET}
          onClose={(!isPanelDisabled && onFreeBetsRemovePress) || undefined}
          showCloseIcon={false}
          dismissLabel={(!isPanelDisabled && i18n.freeBetsAlertRemoveLabel) || undefined}
        />
      )}
      {showAcceptOddsMovementAlert && isLoggedIn && (
        <Alert
          message={oddsMovementLabels.message}
          detail={oddsMovementLabels.detailMessage}
          type={AlertType.Info}
          showCloseIcon={false}
          action={oddsMovementAlertAction}
        />
      )}
      {footerPrefix}
      <BetsSummary
        disabled={isPanelDisabled || isSummaryDisabled}
        totalStake={balanceAfterBet ?? ""}
        totalStakeLabel={balanceAfterBet ? i18n.balanceAfterBet : ""}
        totalReturns={totalReturns}
        totalReturnsLabel={i18n.totalReturns}
        totalOriginalReturns={totalOriginalReturns}
        isOddsBoosted={isOddsBoosted}
      />
      <JurisdictionalOperatorInfo />
      <View style={styles.actions}>
        {secondaryButton ? (
          <View {...getTestProps(PLACE_FOOTER_SECONDARY_BUTTON, false)}>{secondaryButton}</View>
        ) : (
          <Pressable
            style={styles.removeButton}
            {...getTestProps(PLACE_FOOTER_REMOVE_ALL_BUTTON)}
            accessibilityHint={i18n.removeLabel}
            onPress={onRemoveAllPress}
            disabled={isPanelDisabled}
          >
            {trashIcon}
          </Pressable>
        )}
        <View style={styles.primaryButton} {...getTestProps(PLACE_FOOTER_BUTTON, false)}>
          <PrimaryButton
            disabled={isPanelDisabled || isPlaceDisabled}
            label={placeBtnLabel}
            secondaryLabel={placeBtnSecondaryLabel}
            onTap={onPlacePress}
            loadingLabel={hasCTALoading ? placeBtnLoadingLabel : undefined}
            stopAnimation={hasPlaceError}
            variant={isLoggedIn ? "transactional" : "primary"}
            reverseLabels={reversePlaceBtnLabels}
          />
        </View>
      </View>
    </View>
  );
};
