import { FunctionComponent, useCallback, useId, useMemo } from "react";

import classnames from "classnames";

import { AlertType } from "@ppb/the-wall-common/types";

import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { SystemIconName, ValueIconName } from "@ppb/the-wall-icons";

import { Alert, BetsSummary, FreeBets, Link, PrimaryButton } from "@ppb/the-wall-web";

import { PlaceFooterViewModel } from "./PlaceFooter.types";

import styles from "./PlaceFooter.web.css";
import { JurisdictionalOperatorInfo } from "../../../JurisdictionalOperatorInfo/JurisdictionalOperatorInfo.web";

export const PlaceFooter: FunctionComponent<PlaceFooterViewModel> = ({
  i18n,
  isPanelDisabled,
  isPlaceDisabled,
  notifications,
  footerPrefix,
  termsUrl,

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
  const oddsMovementSwitchId = useId();

  const iconTrashColor = isPanelDisabled
    ? "var(--place-footer-icon-disable-colour)"
    : "var(--place-footer-icon-default-colour)";

  const freeBetsContainer = classnames({
    [styles.freeBetsContainer]: hasFreeBets || freeBetsAlertMessage,
  });

  const handleOddsMovementChange = useCallback(
    (isChecked: boolean) => {
      onOddsMovementPreferencesChange(isChecked);
    },
    [onOddsMovementPreferencesChange],
  );

  const oddsMovementAlertAction = useMemo(
    () => ({
      checkboxId: oddsMovementSwitchId,
      onChange: handleOddsMovementChange,
      isChecked: isOddsMovementOn,
      label: oddsMovementLabels.message,
    }),
    [oddsMovementSwitchId, handleOddsMovementChange, isOddsMovementOn, oddsMovementLabels.message],
  );

  return (
    <footer className={styles.footerContainer}>
      {notifications}
      <div className={freeBetsContainer}>
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
            onClose={(!isPanelDisabled && onFreeBetsRemovePress) || undefined}
            showCloseIcon={false}
            iconOverload={ValueIconName.FREE_BET}
            dismissLabel={(!isPanelDisabled && i18n.freeBetsAlertRemoveLabel) || undefined}
          />
        )}
      </div>
      {showAcceptOddsMovementAlert && isLoggedIn && (
        <div className={styles.oddsMovementAlertContainer}>
          <Alert
            message={oddsMovementLabels.message}
            detail={oddsMovementLabels.detailMessage}
            type={AlertType.Info}
            showCloseIcon={false}
            action={oddsMovementAlertAction}
          />
        </div>
      )}
      {footerPrefix}
      <div className={styles.summaryContainer}>
        <BetsSummary
          disabled={isPanelDisabled || isSummaryDisabled}
          totalStake={balanceAfterBet ?? ""}
          totalStakeLabel={balanceAfterBet ? i18n.balanceAfterBet : ""}
          totalReturns={totalReturns}
          totalOriginalReturns={totalOriginalReturns}
          totalReturnsLabel={i18n.totalReturns}
          isOddsBoosted={isOddsBoosted}
        />
        <JurisdictionalOperatorInfo />
        <div className={styles.actions}>
          {secondaryButton || (
            <button className={styles.removeButton} type="button" disabled={isPanelDisabled} onClick={onRemoveAllPress}>
              <span className={styles.screenReaderOnly}>{i18n.removeLabel}</span>
              <div className={styles.trashIcon}>
                <GenericIcon name={SystemIconName.TRASH} color={iconTrashColor} />
              </div>
            </button>
          )}
          <PrimaryButton
            disabled={isPanelDisabled || isPlaceDisabled}
            label={placeBtnLabel}
            secondaryLabel={placeBtnSecondaryLabel}
            onTap={onPlacePress}
            loadingLabel={hasCTALoading ? placeBtnLoadingLabel : undefined}
            stopAnimation={!!hasPlaceError}
            variant={isLoggedIn ? "transactional" : "primary"}
            reverseLabels={reversePlaceBtnLabels}
          />
        </div>
        {!!termsUrl && (
          <div className={styles.termsContainer}>
            {i18n.termsLabel}{" "}
            <Link onClick={() => {}} item={{ viewLink: { viewUrl: termsUrl }, target: "_blank" }}>
              {i18n.termsLinkLabel}
            </Link>
          </div>
        )}
      </div>
    </footer>
  );
};
