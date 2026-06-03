import type { Dispatch } from "redux";
import { MapDispatchToProps, MapStateToPropsFactory } from "react-redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";

import {
  GenerosityWalletCloseClickAction,
  GenerosityWalletApplyButtonClickAction,
  GenerosityWalletPebbleClickAction,
  UI__GENEROSITY_WALLET_CLOSE_CLICK,
  UI__GENEROSITY_WALLET_APPLY_BUTTON_CLICK,
  UI__GENEROSITY_WALLET_PEBBLE_CLICK,
} from "@ppb/tbd-store/actions/interface";

import { ExtraWalletCardGroups } from "@ppb/tbd-store/state/layout/cardgroups/CardGroup.types";
import { codecs, EntityType } from "@ppb/tbd-urn-codecs";
import { WalletTypes } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import { createCardGroupByURNSelector } from "@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors";
import {
  BETTING__SBK_ACCA_INSURANCE_TOGGLE,
  BETTING__SBK_GHOST_LEG_TOGGLE,
  BETTING__SBK_MONEY_BACK_TOGGLE,
  BETTING__SBK_PRICE_BOOST_TOGGLE,
  BETTING__SPORTSBOOK_FREE_BETS_WALLETS_APPLY_ACTION,
  BETTING__SPORTSBOOK_GENEROSITY_WALLETS_CLOSE_ACTION,
  BETTING__SPORTSBOOK_REMOVE_ALL_COMBINATION_FREE_BETS_WALLETS_ACTION,
  BettingSportsbookAccaInsuranceToggleAction,
  BettingSportsbookApplyFreeBetsWalletsAction,
  BettingSportsbookGenerosityWalletsCloseAction,
  BettingSportsbookGhostLegToggleAction,
  BettingSportsbookMoneyBackToggleAction,
  BettingSportsbookPriceBoostToggleAction,
  BettingSportsbookRemoveAllCombinationWalletsAction,
} from "@ppb/tbd-store/actions/betting";
import URN from "@ppb/tbd-store/state/layout/URN";
import {
  isGenerosityContextEqual,
  createGetCombinationEligibleGenerosityWalletsSelector,
  WalletsTokensMap,
} from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { createSelector, createSelectorCreator, defaultMemoize } from "reselect";
import { EXTERNAL_PUSH_BLANK, ExternalPushBlankAction, UserDetails } from "@ppb/tbd-store";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { PebbleListItem } from "@ppb/the-wall-common/types";
import { BettingState } from "@ppb/betslip-core";
import { GenerosityPageNavigationAction, UI__NAVIGATE_GENEROSITY_PAGE } from "@ppb/tbd-store/actions/navigation";
import { i18n } from "../../helpers/i18n";
import {
  createGenerosityCardsURNByTypeSelector,
  OptionWallets,
  PebbleFilterOptions,
  type GenerosityCardsURNByType,
} from "../../helpers/generosity-wallets";

export type I18nLabels = {
  title: string;
  bonusPageMessage: string;
  defaultApplyButtonLabel: string;
  alertMessage: string;
  alertDetail: string;
};

type CardProps = {
  selectedCombinationId: string | undefined;
  userDetails: UserDetails | undefined;
  optionWallets: OptionWallets;
  bonusPageUrl?: string;
  i18nLabels: I18nLabels;
  generosityFilterOptions: PebbleListItem[];
  shouldShowAlert: boolean;
};

export type BonusPageActionLinkPropsNative = Pick<CardProps, "bonusPageUrl"> &
  Pick<I18nLabels, "bonusPageMessage"> &
  Pick<DispatchProps, "dispatchGenerosityPageNavigationAction"> & {
    currentPebbleGALabel: string;
  };

export type BonusPageActionLinkPropsWeb = BonusPageActionLinkPropsNative &
  Pick<DispatchProps, "dispatchPushExternalBlankAction" | "dispatchGenerosityPageNavigationAction"> & {
    currentPebbleGALabel: string;
  };

export type BottomSheetHeaderProps = Pick<CardProps, "generosityFilterOptions"> & {
  onFilterPebblePress: (pebbleId: string) => void;
  pebbleFilterOption: PebbleFilterOptions;
};

export type ApplyButtonProps = Pick<
  CardProps & DispatchProps,
  | "dispatchApplyButtonAction"
  | "optionWallets"
  | "selectedCombinationId"
  | "userDetails"
  | "shouldShowAlert"
  | "dispatchGenerosityWalletApplyButtonClick"
> &
  Pick<I18nLabels, "defaultApplyButtonLabel" | "alertMessage" | "alertDetail"> & {
    updatedOptionWallets: CardProps["optionWallets"];
    setPebbleFilterOption: React.Dispatch<React.SetStateAction<PebbleFilterOptions>>;
    currentPebbleGALabel: string;
  };

export type FooterAlertProps = Pick<CardProps, "shouldShowAlert"> & Pick<I18nLabels, "alertMessage" | "alertDetail">;

const EXTRA_WALLET_CARD_GROUP_URN = codecs.cardGroup.extraWallet.encode().uid;

export type StateProps = CardProps | Record<string, never>;

const createOptionWalletsSelector = () => {
  const getCombinationEligibleGenerosityWallets = createGetCombinationEligibleGenerosityWalletsSelector();

  return createSelectorCreator(defaultMemoize, isGenerosityContextEqual)(
    [
      (state: ApplicationState) => ({
        eligibleWallets: getCombinationEligibleGenerosityWallets(state),
        selectedCombinationId: state?.betslip?.selectedCombinationId,
        combinations: state?.betting?.sportsbookBetting?.combinations,
      }),
    ],
    ({
      eligibleWallets,
      selectedCombinationId,
      combinations,
    }: {
      eligibleWallets: WalletsTokensMap;
      selectedCombinationId: string | undefined;
      combinations: BettingState.CombinationsMap;
    }): OptionWallets =>
      Object.values(eligibleWallets).reduce((acc, wallet) => {
        const { walletId, type, combinationId } = wallet;

        if (type === WalletTypes.BonusCash) {
          return {
            ...acc,
            [walletId]: {
              ...wallet,
              isSelected: !!combinationId,
              isDisabled: !!combinationId && combinationId !== selectedCombinationId,
            },
          };
        }

        const isWalletSelectedCombinationId = Object.values(combinations ?? {}).find(
          ({ accaInsuranceTokenId, priceBoostTokenId, moneyBackTokenId, ghostLegTokenId }) =>
            accaInsuranceTokenId === String(walletId) ||
            priceBoostTokenId === String(walletId) ||
            moneyBackTokenId === String(walletId) ||
            ghostLegTokenId === String(walletId),
        )?.id;

        const isSelectedInOtherCombination =
          !!isWalletSelectedCombinationId && isWalletSelectedCombinationId !== selectedCombinationId;

        const isDisabled =
          type === WalletTypes.PriceBoostToken && selectedCombinationId
            ? !(combinations[selectedCombinationId]?.isPriceBoostAvailable && !isSelectedInOtherCombination)
            : isSelectedInOtherCombination;

        return {
          ...acc,
          [walletId]: {
            ...wallet,
            isSelected: !!isWalletSelectedCombinationId,
            isDisabled,
            combinationId: isWalletSelectedCombinationId,
          },
        };
      }, {}),
  );
};

const pebbleFilterOrder = [
  PebbleFilterOptions.FreeBets,
  PebbleFilterOptions.GhostLegToken,
  PebbleFilterOptions.PriceBoostToken,
  PebbleFilterOptions.AccaInsuranceToken,
];

const createGenerosityFilterOptions = () =>
  createSelector(
    [(generosityCardsURNByType: GenerosityCardsURNByType) => generosityCardsURNByType],
    (generosityCardsURNByType: GenerosityCardsURNByType): PebbleListItem[] => {
      const generosityTypeToText: Record<string, string> = {
        [PebbleFilterOptions.AccaInsuranceToken]: i18n({ key: "I18N.MONEY_BACK_PEBBLE" }),
        [PebbleFilterOptions.FreeBets]: i18n({ key: "I18N.FREE_BETS" }),
        [PebbleFilterOptions.PriceBoostToken]: i18n({ key: "I18N.BET_BOOST_TOKEN" }),
        [PebbleFilterOptions.GhostLegToken]: i18n({ key: "I18N.GHOST_LEG_PEBBLE" }),
        [PebbleFilterOptions.All]: i18n({ key: "I18N.OBB.FILTERTAGS.ALL" }),
      };

      return pebbleFilterOrder.reduce<PebbleListItem[]>(
        (acc, promo) => {
          if (generosityCardsURNByType[promo]) {
            acc.push({ id: promo, text: generosityTypeToText[promo], count: generosityCardsURNByType[promo].length });
          }

          return acc;
        },
        [
          {
            id: PebbleFilterOptions.All,
            text: generosityTypeToText[PebbleFilterOptions.All],
            count: Object.values(generosityCardsURNByType).flat().length,
          },
        ],
      );
    },
  );

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, {}, ApplicationState> = () => {
  const getExtraWalletCardGroup = createCardGroupByURNSelector<ExtraWalletCardGroups, URN>();
  const getGenerosityCardsURNByType = createGenerosityCardsURNByTypeSelector();
  const getOptionWallets = createOptionWalletsSelector();
  const getGenerosityFilterOptions = createGenerosityFilterOptions();

  const i18nLabels = {
    title: i18n({ key: "I18N.BONUSES_TITLE" }),
    defaultApplyButtonLabel: i18n({ key: "I18N.FILTERS.APPLY" }),
    bonusPageMessage: i18n({ key: "I18N.MY_BONUS_PAGE" }),
    alertMessage: i18n({ key: "I18N.ALERT_BONUS_APPLIED" }),
    alertDetail: i18n({ key: "I18N.ALERT_REMOVE_SELECTION" }),
  };

  return (state: ApplicationState): StateProps => {
    let userDetails;
    try {
      userDetails = <UserDetails>getUserDetails(state);
    } catch (e) {
      console.error(e);
      return {};
    }

    const { selectedCombinationId } = state.betslip || {};

    const extraWalletCardGroup = getExtraWalletCardGroup(
      state.layouts.cardgroups.extrawalletcardgroups,
      EXTRA_WALLET_CARD_GROUP_URN,
    );

    const generosityCardsURNByType = getGenerosityCardsURNByType(state);
    const generosityFilterOptions = getGenerosityFilterOptions(generosityCardsURNByType);
    const optionWallets = getOptionWallets(state);

    const shouldShowAlert = Object.values(optionWallets).some(({ isDisabled, isSelected }) => isDisabled && isSelected);

    return {
      i18nLabels,
      bonusPageUrl: extraWalletCardGroup?.bonusPageUrl,
      generosityFilterOptions,
      optionWallets,
      selectedCombinationId,
      shouldShowAlert,
      userDetails,
    };
  };
};

export type DispatchProps = {
  dispatchCloseBottomSheetAction: (isFromBetslip: boolean, currentPebble: string) => void;
  dispatchApplyButtonAction: (
    combinationId: string,
    selectedWallets: string[],
    type: WalletTypes,
    previousType: WalletTypes | undefined,
    amount: string,
  ) => void;
  dispatchPushExternalBlankAction: (url: string) => ExternalPushBlankAction;
  dispatchGenerosityPageNavigationAction: (url: string, currentPebble: string) => GenerosityPageNavigationAction;
  dispatchGenerosityWalletPebbleClick: (
    isFromBetslip: boolean,
    currentPebble: string,
    toPebble: string,
  ) => GenerosityWalletPebbleClickAction;
  dispatchGenerosityWalletApplyButtonClick: (
    walletDescription: string | undefined,
    value: number | undefined,
    totalAmount: number | string,
    currentPebble: string,
    numberOfPlaces: number | undefined,
    walletType: WalletTypes,
  ) => GenerosityWalletApplyButtonClickAction;
};

export const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = (dispatch: Dispatch) => ({
  dispatchCloseBottomSheetAction: (isFromBetslip: boolean, currentPebble: string) => {
    dispatch<BettingSportsbookGenerosityWalletsCloseAction>({
      type: BETTING__SPORTSBOOK_GENEROSITY_WALLETS_CLOSE_ACTION,
    });
    dispatch<GenerosityWalletCloseClickAction>({
      type: UI__GENEROSITY_WALLET_CLOSE_CLICK,
      payload: {
        isFromBetslip,
        currentPebble,
      },
    });
  },
  dispatchApplyButtonAction: (
    combinationId: string,
    selectedWallets: string[],
    type: WalletTypes,
    previousType: WalletTypes | undefined,
    amount: string,
  ) => {
    if (type === WalletTypes.BonusCash) {
      dispatch<BettingSportsbookApplyFreeBetsWalletsAction>({
        type: BETTING__SPORTSBOOK_FREE_BETS_WALLETS_APPLY_ACTION,
        payload: {
          combinationId,
          selectedWallets: selectedWallets.map(Number),
          amount,
        },
      });
      return;
    }

    if (type === WalletTypes.AccaInsuranceToken) {
      dispatch<BettingSportsbookAccaInsuranceToggleAction>({
        type: BETTING__SBK_ACCA_INSURANCE_TOGGLE,
        payload: {
          combinationId,
          selectedTokenId: selectedWallets[0],
        },
      });
      return;
    }

    if (type === WalletTypes.GhostLegToken) {
      dispatch<BettingSportsbookGhostLegToggleAction>({
        type: BETTING__SBK_GHOST_LEG_TOGGLE,
        payload: {
          combinationId,
          selectedTokenId: selectedWallets[0],
        },
      });
      return;
    }

    if (type === WalletTypes.PriceBoostToken) {
      dispatch<BettingSportsbookPriceBoostToggleAction>({
        type: BETTING__SBK_PRICE_BOOST_TOGGLE,
        payload: {
          combinationId,
          selectedTokenId: selectedWallets[0],
        },
      });
      return;
    }

    if (type === WalletTypes.MoneyBackToken) {
      dispatch<BettingSportsbookMoneyBackToggleAction>({
        type: BETTING__SBK_MONEY_BACK_TOGGLE,
        payload: {
          combinationId,
          selectedTokenId: selectedWallets[0],
        },
      });
      return;
    }

    if (previousType === WalletTypes.BonusCash) {
      dispatch<BettingSportsbookRemoveAllCombinationWalletsAction>({
        type: BETTING__SPORTSBOOK_REMOVE_ALL_COMBINATION_FREE_BETS_WALLETS_ACTION,
        payload: { combinationId },
      });
      return;
    }

    if (previousType === WalletTypes.AccaInsuranceToken) {
      dispatch<BettingSportsbookAccaInsuranceToggleAction>({
        type: BETTING__SBK_ACCA_INSURANCE_TOGGLE,
        payload: {
          combinationId,
        },
      });
      return;
    }

    if (previousType === WalletTypes.GhostLegToken) {
      dispatch<BettingSportsbookGhostLegToggleAction>({
        type: BETTING__SBK_GHOST_LEG_TOGGLE,
        payload: {
          combinationId,
        },
      });
      return;
    }

    if (previousType === WalletTypes.PriceBoostToken) {
      dispatch<BettingSportsbookPriceBoostToggleAction>({
        type: BETTING__SBK_PRICE_BOOST_TOGGLE,
        payload: {
          combinationId,
        },
      });
    }

    if (previousType === WalletTypes.MoneyBackToken) {
      dispatch<BettingSportsbookMoneyBackToggleAction>({
        type: BETTING__SBK_MONEY_BACK_TOGGLE,
        payload: {
          combinationId,
        },
      });
      return;
    }
  },
  dispatchPushExternalBlankAction: (url: string): ExternalPushBlankAction =>
    dispatch<ExternalPushBlankAction>({
      type: EXTERNAL_PUSH_BLANK,
      payload: {
        viewUrl: url,
        viewUrn: EntityType.ExternalView,
      },
    }),
  dispatchGenerosityPageNavigationAction: (
    destinationUrl: string,
    currentPebble: string,
  ): GenerosityPageNavigationAction =>
    dispatch<GenerosityPageNavigationAction>({
      type: UI__NAVIGATE_GENEROSITY_PAGE,
      payload: {
        destinationUrl,
        currentPebble,
      },
    }),
  dispatchGenerosityWalletPebbleClick: (
    isFromBetslip: boolean,
    currentPebble: string,
    toPebble: string,
  ): GenerosityWalletPebbleClickAction =>
    dispatch<GenerosityWalletPebbleClickAction>({
      type: UI__GENEROSITY_WALLET_PEBBLE_CLICK,
      payload: {
        isFromBetslip,
        currentPebble,
        toPebble,
      },
    }),
  dispatchGenerosityWalletApplyButtonClick: (
    walletDescription: string | undefined,
    value: number | undefined,
    totalAmount: number | string,
    currentPebble: string,
    numberOfPlaces: number | undefined,
    walletType: WalletTypes,
  ): GenerosityWalletApplyButtonClickAction =>
    dispatch<GenerosityWalletApplyButtonClickAction>({
      type: UI__GENEROSITY_WALLET_APPLY_BUTTON_CLICK,
      payload: {
        walletDescription,
        value,
        totalAmount,
        currentPebble,
        numberOfPlaces,
        walletType,
      },
    }),
});
