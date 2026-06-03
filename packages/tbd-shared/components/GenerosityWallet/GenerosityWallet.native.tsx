import { FunctionComponent, memo, useCallback, useEffect, useRef, useState } from "react";
import { ActionLink, BottomSheet, PebbleList, PrimaryButton, Alert } from "@ppb/the-wall-native";
import { ScrollView, View } from "react-native";
import { AlertType } from "@ppb/the-wall-common/types";
import { WalletTypes } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import { EntityType } from "@ppb/tbd-urn-codecs";
import { navigate } from "@ppb/tbd-router";
import { DisplayMode } from "@ppb/the-wall-common/types/ViewLink.types";
import { ComponentProps } from "./props";
import styles from "./GenerosityWallet.native.styles";
import ConnectedExtraWalletCardGroup from "../ExtraWalletCardGroup";
import ExtraWalletCardGroup from "../ExtraWalletCardGroup/ExtraWalletCardGroup.native";
import { currencyFormatWithDecimalPlaces } from "../../formatters/currency-formatters";
import { i18n } from "../../helpers/i18n";
import {
  MAP_PEBBLE_OPTION_TO_GA_LABEL,
  OptionWallet,
  PebbleFilterOptions,
  sumWalletsAmounts,
  updateOptionWallets,
} from "../../helpers/generosity-wallets";
import {
  BonusPageActionLinkPropsNative,
  BottomSheetHeaderProps,
  ApplyButtonProps,
  FooterAlertProps,
} from "./map-to-props-factory";

const BonusPageActionLink = memo(
  ({
    bonusPageUrl,
    bonusPageMessage,
    dispatchGenerosityPageNavigationAction,
    currentPebbleGALabel,
  }: BonusPageActionLinkPropsNative) => {
    if (!bonusPageUrl) return null;

    const onActionLinkPress = () => {
      navigate({
        viewUrl: bonusPageUrl,
        viewUrn: EntityType.ExternalView,
        viewDisplayMode: DisplayMode.BlankWebview,
      });
      dispatchGenerosityPageNavigationAction(bonusPageUrl, currentPebbleGALabel);
    };

    return (
      <View style={styles.bonusPageActionLink}>
        <ActionLink text={bonusPageMessage} onClick={onActionLinkPress} noPadding={true} />
      </View>
    );
  },
);

const BottomSheetHeader = memo(
  ({ generosityFilterOptions, pebbleFilterOption, onFilterPebblePress }: BottomSheetHeaderProps) => (
    <PebbleList
      items={generosityFilterOptions}
      defaultSelectedPebble={pebbleFilterOption}
      onPebblePress={onFilterPebblePress}
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
    currentPebbleGALabel,
    dispatchApplyButtonAction,
    dispatchGenerosityWalletApplyButtonClick,
  }: ApplyButtonProps) => {
    if (!defaultApplyButtonLabel) return null;

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
  dispatchGenerosityWalletApplyButtonClick,
  dispatchCloseBottomSheetAction,
  generosityFilterOptions,
  i18nLabels,
  optionWallets,
  selectedCombinationId,
  userDetails,
  shouldShowAlert,
  dispatchGenerosityWalletPebbleClick,
  dispatchGenerosityPageNavigationAction,
}) => {
  const [updatedOptionWallets, setUpdatedOptionWallets] = useState(optionWallets);
  const [pebbleFilterOption, setPebbleFilterOption] = useState(PebbleFilterOptions.All);

  const currentPebbleGALabel = MAP_PEBBLE_OPTION_TO_GA_LABEL[pebbleFilterOption];

  const bottomSheetScrollViewRef = useRef<ScrollView>(null);

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

  const onFilterPebbleClick = useCallback(
    (pebbleId: string) => {
      const toPebble = MAP_PEBBLE_OPTION_TO_GA_LABEL[pebbleId as PebbleFilterOptions];

      setPebbleFilterOption(pebbleId as PebbleFilterOptions);
      dispatchGenerosityWalletPebbleClick(!!selectedCombinationId, currentPebbleGALabel, toPebble);

      if (bottomSheetScrollViewRef.current) {
        bottomSheetScrollViewRef.current.scrollTo({
          y: 0,
          animated: false,
        });
      }
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
      dispatchGenerosityWalletApplyButtonClick={dispatchGenerosityWalletApplyButtonClick}
      currentPebbleGALabel={currentPebbleGALabel}
    />
  ) : (
    <BonusPageActionLink
      bonusPageUrl={bonusPageUrl}
      bonusPageMessage={i18nLabels.bonusPageMessage}
      dispatchGenerosityPageNavigationAction={dispatchGenerosityPageNavigationAction}
      currentPebbleGALabel={currentPebbleGALabel}
    />
  );

  const headerContent = (
    <BottomSheetHeader
      generosityFilterOptions={generosityFilterOptions}
      pebbleFilterOption={pebbleFilterOption}
      onFilterPebblePress={onFilterPebbleClick}
    />
  );

  return (
    <View style={styles.generosityWallet}>
      <BottomSheet
        onHeaderIconTap={handleOnClose}
        title={i18nLabels.title}
        showOverlay={true}
        footerContent={footerContent}
        headerContent={generosityFilterOptions.length <= 2 ? null : headerContent}
        scrollViewRef={bottomSheetScrollViewRef}
      >
        <ConnectedExtraWalletCardGroup
          component={ExtraWalletCardGroup}
          onOptionWalletsUpdate={onOptionWalletsUpdate}
          optionWallets={updatedOptionWallets}
          itemsFilter={pebbleFilterOption}
        />
      </BottomSheet>
    </View>
  );
};

export default GenerosityWallet;
