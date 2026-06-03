import { FunctionComponent, useCallback, useEffect, memo, useState, useContext } from "react";
import { Alert, BottomSheet, PrimaryButton, Overlay, Modal, PebbleList, ActionLink } from "@ppb/the-wall-web";
import { AlertType } from "@ppb/the-wall-common/types";
import { WalletTypes } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import { ComponentProps } from "./props";
import ConnectedExtraWalletCardGroup from "../ExtraWalletCardGroup";
import ExtraWalletCardGroup from "../ExtraWalletCardGroup/ExtraWalletCardGroup.web";
import { i18n } from "../../helpers/i18n";
import { currencyFormatWithDecimalPlaces } from "../../formatters/currency-formatters";
import {
  OptionWallet,
  sumWalletsAmounts,
  updateOptionWallets,
  MAP_PEBBLE_OPTION_TO_GA_LABEL,
  PebbleFilterOptions,
} from "../../helpers/generosity-wallets";
import styles from "./GenerosityWallet.web.css";
import { ConfigContext } from "../Config/ConfigContext";
import {
  BonusPageActionLinkPropsWeb,
  BottomSheetHeaderProps,
  ApplyButtonProps,
  FooterAlertProps,
} from "./map-to-props-factory";

const BonusPageActionLink = memo(
  ({
    bonusPageUrl,
    bonusPageMessage,
    dispatchPushExternalBlankAction,
    dispatchGenerosityPageNavigationAction,
    currentPebbleGALabel,
  }: BonusPageActionLinkPropsWeb) => {
    if (!bonusPageUrl) return null;

    const onActionLinkClick = () => {
      dispatchPushExternalBlankAction(bonusPageUrl);
      dispatchGenerosityPageNavigationAction(bonusPageUrl, currentPebbleGALabel);
    };

    return (
      <div className={styles.bonusPageActionLink}>
        <ActionLink text={bonusPageMessage} onClick={onActionLinkClick} noPadding={true} />
      </div>
    );
  },
);

const BottomSheetHeader = memo(
  ({ generosityFilterOptions, pebbleFilterOption, onFilterPebblePress }: BottomSheetHeaderProps) => (
    <PebbleList
      items={generosityFilterOptions}
      defaultSelectedPebble={pebbleFilterOption}
      onPebbleClick={onFilterPebblePress}
    />
  ),
);

const FooterAlert = memo(({ shouldShowAlert, alertMessage, alertDetail }: FooterAlertProps) => {
  if (!shouldShowAlert) return null;
  return <Alert type={AlertType.Info} message={alertMessage} detail={alertDetail}></Alert>;
});

const ApplyButton = memo(
  ({
    defaultApplyButtonLabel,
    optionWallets,
    selectedCombinationId,
    updatedOptionWallets,
    userDetails,
    alertMessage,
    alertDetail,
    shouldShowAlert,
    setPebbleFilterOption,
    dispatchApplyButtonAction,
    currentPebbleGALabel,
    dispatchGenerosityWalletApplyButtonClick,
  }: ApplyButtonProps) => {
    if (!selectedCombinationId) {
      return null;
    }
    const isCombinationSelectedWallet = ({ isSelected, combinationId }: OptionWallet) =>
      isSelected && combinationId === selectedCombinationId;

    const initialSelectedWallets = Object.values(optionWallets).filter((wallet) => isCombinationSelectedWallet(wallet));

    const initialSelectedWalletsIds = initialSelectedWallets.map(({ walletId }) => walletId);

    const updatedSelectedWallets = Object.values(updatedOptionWallets).filter((wallet) =>
      isCombinationSelectedWallet(wallet),
    );
    const updatedSelectedWalletsIds = updatedSelectedWallets.map(({ walletId }) => walletId);

    const areWalletsEqual = JSON.stringify(initialSelectedWalletsIds) === JSON.stringify(updatedSelectedWalletsIds);

    const freeBetsWalletsAmountSelected = updatedSelectedWallets.reduce(
      (sum, { amount }) => sumWalletsAmounts(sum, amount),
      0,
    );

    const initialSelectedType = initialSelectedWallets[0]?.type;
    const updatedSelectedType = updatedSelectedWallets[0]?.type;

    let applyButtonLabel;
    switch (updatedSelectedType) {
      case WalletTypes.BonusCash:
        {
          const freeBetsWalletsAmountSelectedLabel =
            userDetails && freeBetsWalletsAmountSelected
              ? currencyFormatWithDecimalPlaces({
                  ...userDetails,
                  value: freeBetsWalletsAmountSelected,
                })
              : undefined;
          applyButtonLabel =
            freeBetsWalletsAmountSelectedLabel &&
            i18n({
              key: "I18N.LABEL.WALLET",
              interpolationValues: { bonus: freeBetsWalletsAmountSelectedLabel },
            });
        }
        break;
      case WalletTypes.AccaInsuranceToken:
        applyButtonLabel = i18n({ key: "I18N.APPLY_MONEY_BACK_ACCA" });
        break;
      case WalletTypes.PriceBoostToken:
        applyButtonLabel = i18n({ key: "I18N.APPLY_BET_BOOST" });
        break;
      case WalletTypes.MoneyBackToken:
        applyButtonLabel = i18n({ key: "I18N.APPLY_MONEY_BACK_ACCA" });
        break;
      case WalletTypes.GhostLegToken:
        applyButtonLabel = i18n({ key: "I18N.APPLY_GHOST_LEG_BAB" });
        break;
      default:
        break;
    }

    const handleOnApply = (): void => {
      if (!selectedCombinationId) return;

      dispatchApplyButtonAction(
        selectedCombinationId,
        updatedSelectedWalletsIds,
        updatedSelectedType,
        initialSelectedType,
        freeBetsWalletsAmountSelected.toFixed(2),
      );

      const totalAmountGenerosity =
        updatedSelectedWallets[0]?.amountLimit ||
        updatedSelectedWallets[0]?.generosity ||
        freeBetsWalletsAmountSelected.toFixed(2);

      dispatchGenerosityWalletApplyButtonClick(
        MAP_PEBBLE_OPTION_TO_GA_LABEL[updatedSelectedWallets[0]?.type],
        updatedSelectedWallets[0]?.numberOfLegs,
        totalAmountGenerosity,
        currentPebbleGALabel,
        updatedSelectedWallets[0]?.numberOfPlaces,
        updatedSelectedWallets[0]?.type,
      );
      setPebbleFilterOption(PebbleFilterOptions.All);
    };

    if (!updatedSelectedWallets.length) {
      return (
        <>
          <FooterAlert shouldShowAlert={shouldShowAlert} alertMessage={alertMessage} alertDetail={alertDetail} />
          <PrimaryButton disabled={areWalletsEqual} label={defaultApplyButtonLabel} onTap={handleOnApply} />
        </>
      );
    }

    return (
      <>
        <FooterAlert shouldShowAlert={shouldShowAlert} alertMessage={alertMessage} alertDetail={alertDetail} />
        <PrimaryButton disabled={areWalletsEqual} label={applyButtonLabel} onTap={handleOnApply} />
      </>
    );
  },
);

BonusPageActionLink.displayName = "BonusPageActionLink";
BottomSheetHeader.displayName = "BottomSheetHeader";
ApplyButton.displayName = "ApplyButton";
FooterAlert.displayName = "FooterAlert";

const GenerosityWallet: FunctionComponent<ComponentProps> = ({
  bonusPageUrl,
  dispatchApplyButtonAction,
  dispatchCloseBottomSheetAction,
  dispatchPushExternalBlankAction,
  dispatchGenerosityPageNavigationAction,
  dispatchGenerosityWalletPebbleClick,
  generosityFilterOptions,
  i18nLabels,
  optionWallets,
  selectedCombinationId,
  userDetails,
  shouldShowAlert,
  dispatchGenerosityWalletApplyButtonClick,
}) => {
  const { isDesktopLayout } = useContext(ConfigContext);
  const [updatedOptionWallets, setUpdatedOptionWallets] = useState(optionWallets);
  const [pebbleFilterOption, setPebbleFilterOption] = useState(PebbleFilterOptions.All);

  const currentPebbleGALabel = MAP_PEBBLE_OPTION_TO_GA_LABEL[pebbleFilterOption];

  useEffect(() => {
    if (generosityFilterOptions.length === 2 && pebbleFilterOption === PebbleFilterOptions.All) {
      setPebbleFilterOption(generosityFilterOptions[1].id as PebbleFilterOptions);
    }
  }, [generosityFilterOptions, pebbleFilterOption]);

  useEffect(() => {
    setUpdatedOptionWallets(optionWallets);
  }, [optionWallets]);

  const onOptionWalletsUpdate = useCallback<(walletId: string, isSelected: boolean) => void>(
    (walletId, isSelected) => {
      setUpdatedOptionWallets((prev) => updateOptionWallets(prev, walletId, isSelected, selectedCombinationId));
    },
    [setUpdatedOptionWallets, selectedCombinationId],
  );

  const handleOnClose = useCallback((): void => {
    dispatchCloseBottomSheetAction(!!selectedCombinationId, currentPebbleGALabel);
    setPebbleFilterOption(PebbleFilterOptions.All);
  }, [dispatchCloseBottomSheetAction, selectedCombinationId, currentPebbleGALabel]);

  const onFilterPebblePress = useCallback(
    (pebbleId: string) => {
      const toPebble = MAP_PEBBLE_OPTION_TO_GA_LABEL[pebbleId as PebbleFilterOptions];

      setPebbleFilterOption(pebbleId as PebbleFilterOptions);
      dispatchGenerosityWalletPebbleClick(!!selectedCombinationId, currentPebbleGALabel, toPebble);
    },
    [currentPebbleGALabel, dispatchGenerosityWalletPebbleClick, selectedCombinationId],
  );

  if (generosityFilterOptions.length === 1) return null;

  const footerContent = selectedCombinationId ? (
    <ApplyButton
      defaultApplyButtonLabel={i18nLabels.defaultApplyButtonLabel}
      alertMessage={i18nLabels.alertMessage}
      alertDetail={i18nLabels.alertDetail}
      optionWallets={optionWallets}
      selectedCombinationId={selectedCombinationId}
      updatedOptionWallets={updatedOptionWallets}
      userDetails={userDetails}
      shouldShowAlert={shouldShowAlert}
      setPebbleFilterOption={setPebbleFilterOption}
      dispatchApplyButtonAction={dispatchApplyButtonAction}
      currentPebbleGALabel={currentPebbleGALabel}
      dispatchGenerosityWalletApplyButtonClick={dispatchGenerosityWalletApplyButtonClick}
    />
  ) : (
    <BonusPageActionLink
      bonusPageUrl={bonusPageUrl}
      bonusPageMessage={i18nLabels.bonusPageMessage}
      dispatchPushExternalBlankAction={dispatchPushExternalBlankAction}
      dispatchGenerosityPageNavigationAction={dispatchGenerosityPageNavigationAction}
      currentPebbleGALabel={currentPebbleGALabel}
    />
  );

  const headerContent = (
    <BottomSheetHeader
      generosityFilterOptions={generosityFilterOptions}
      pebbleFilterOption={pebbleFilterOption}
      onFilterPebblePress={onFilterPebblePress}
    />
  );

  const connectedExtraWalletCardGroup = (
    <ConnectedExtraWalletCardGroup
      component={ExtraWalletCardGroup}
      onOptionWalletsUpdate={onOptionWalletsUpdate}
      optionWallets={updatedOptionWallets}
      itemsFilter={pebbleFilterOption}
    />
  );

  return isDesktopLayout ? (
    <Modal
      onDismiss={handleOnClose}
      title={i18nLabels.title}
      footerContent={footerContent}
      dismissOnOutsideTap={true}
      headerContent={generosityFilterOptions.length <= 2 ? undefined : headerContent}
    >
      {connectedExtraWalletCardGroup}
    </Modal>
  ) : (
    <Overlay className={styles.generosityOverlay} onOutsideTap={handleOnClose} fullPageOverlay>
      <BottomSheet
        onHeaderIconTap={handleOnClose}
        title={i18nLabels.title}
        footerContent={footerContent}
        headerContent={generosityFilterOptions.length <= 2 ? null : headerContent}
      >
        {connectedExtraWalletCardGroup}
      </BottomSheet>
    </Overlay>
  );
};

export default GenerosityWallet;
