import { MapDispatchToProps, MapStateToPropsFactory } from "react-redux";
import { createSelector } from "reselect";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { ExtraWalletCardGroup, ExtraWalletCardGroups } from "@ppb/tbd-store/state/layout/cardgroups/CardGroup.types";
import { codecs, EntityType } from "@ppb/tbd-urn-codecs";
import { createCardGroupByURNSelector } from "@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors";
import URN from "@ppb/tbd-store/state/layout/URN";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import {
  WalletsTokensMap,
  createGetCombinationEligibleGenerosityWalletsSelector,
} from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { BettingState } from "@ppb/betslip-core";
import { ValueIconName } from "@ppb/the-wall-icons";
import { Dispatch } from "redux";
import { GenerosityWalletHelpAction, UI__NAVIGATE_GENEROSITY_WALLET_HELP } from "@ppb/tbd-store/actions/navigation";
import { EXTERNAL_PUSH_BLANK, ExternalPushBlankAction } from "@ppb/tbd-store";
import { WalletTypes } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import { i18n } from "../../helpers/i18n";
import { currencyFormatWithDecimalPlaces } from "../../formatters/currency-formatters";
import {
  OptionWallets,
  createGenerosityCardsURNByTypeSelector,
  GenerosityCardsURNByType,
  PebbleFilterOptions,
  MAP_PEBBLE_OPTION_TO_GA_LABEL,
} from "../../helpers/generosity-wallets";

export type ContainerProps = {
  optionWallets?: OptionWallets;
  onOptionWalletsUpdate?: (walletId: string, isSelected: boolean) => void;
  itemsFilter?: PebbleFilterOptions;
};

export type I18nLabels = {
  helpMessage: string;
  helpButtonLabel: string;
};

type CardProps = {
  items: URN[];
  optionTitle: string | undefined;
  optionIcon: ValueIconName | undefined;
  i18nLabels: I18nLabels;
  helpUrl?: string;
  showAlert?: boolean;
  currentPebble: string;
  isFromBetslip: boolean;
};

const EXTRA_WALLET_CARD_GROUP_URN = codecs.cardGroup.extraWallet.encode().uid;

export type StateProps = CardProps | Record<string, never>;

const FILTER_OPTIONS_TO_ICON: Partial<Record<PebbleFilterOptions, ValueIconName>> = {
  [PebbleFilterOptions.FreeBets]: ValueIconName.FREE_BET,
  [PebbleFilterOptions.AccaInsuranceToken]: ValueIconName.MONEY_BACK,
  [PebbleFilterOptions.PriceBoostToken]: ValueIconName.BOOSTER,
  [PebbleFilterOptions.GhostLegToken]: ValueIconName.GHOST_LEG,
};

const createCombinationItemsSelector = () => {
  const getCombinationEligibleGenerosityWallets = createGetCombinationEligibleGenerosityWalletsSelector();

  return createSelector(
    [
      (state: ApplicationState) => getCombinationEligibleGenerosityWallets(state),
      (_: ApplicationState, items: URN[]) => items,
    ],
    (
      eligibleGenerosityWallets: WalletsTokensMap,
      items: URN[],
    ): { combinationItems: URN[]; filteredWalletsAmount: BettingState.Wallet["amount"] } => {
      const walletIds = Object.keys(eligibleGenerosityWallets);
      const combinationItems = items.filter((urn) => walletIds.some((id) => urn.includes(id)));

      const filteredWalletsAmount = Object.values(eligibleGenerosityWallets).reduce(
        (acc, wallet) => (wallet.type === WalletTypes.BonusCash && wallet.amount ? acc + wallet.amount : acc),
        0,
      );

      return { combinationItems, filteredWalletsAmount };
    },
  );
};

const createOptionTitleSelector = () => {
  const getExtraWalletCardGroup = createCardGroupByURNSelector<ExtraWalletCardGroups, URN>();

  return createSelector(
    [
      (state: ApplicationState) =>
        getExtraWalletCardGroup(state.layouts.cardgroups.extrawalletcardgroups, EXTRA_WALLET_CARD_GROUP_URN),
      (_: ApplicationState, userDetails: UserDetails) => userDetails,
      (_: ApplicationState, __: UserDetails, combinationItems: URN[]) => combinationItems,
      (_: ApplicationState, __: UserDetails, ___: URN[], filteredWalletsAmount: number) => filteredWalletsAmount,
      (_: ApplicationState, __: UserDetails, ___: URN[], ____: number, itemsFilter: PebbleFilterOptions) => itemsFilter,
      (
        _: ApplicationState,
        __: UserDetails,
        ___: URN[],
        ____: number,
        _____: PebbleFilterOptions,
        generosityCardsURNByType: GenerosityCardsURNByType,
      ) => generosityCardsURNByType,
    ],
    (
      cardGroup: ExtraWalletCardGroup | null,
      userDetails: UserDetails,
      combinationItems: URN[],
      filteredWalletsAmount: number,
      itemsFilter: PebbleFilterOptions,
      generosityCardsURNByType: GenerosityCardsURNByType,
    ): string | undefined => {
      switch (itemsFilter) {
        case PebbleFilterOptions.FreeBets: {
          const amount = cardGroup?.amount ?? 0;
          const freeBetsAmount = currencyFormatWithDecimalPlaces({
            ...userDetails,
            value: combinationItems.length ? filteredWalletsAmount : amount,
          });

          const title = i18n({
            key: "I18N.FREE_BET_BALANCE",
            interpolationValues: { bonus: freeBetsAmount },
          });

          return title;
        }
        case PebbleFilterOptions.AccaInsuranceToken: {
          const count = generosityCardsURNByType[PebbleFilterOptions.AccaInsuranceToken]?.length ?? 0;

          return i18n({ key: "I18N.MONEY_BACK_ACCA_AVAILABLE", interpolationValues: { value: count } });
        }
        case PebbleFilterOptions.PriceBoostToken: {
          const count = generosityCardsURNByType[PebbleFilterOptions.PriceBoostToken]?.length ?? 0;

          return i18n({ key: "I18N.BOOST_AVAILABLE", interpolationValues: { value: count } });
        }
        case PebbleFilterOptions.GhostLegToken: {
          const count = generosityCardsURNByType[PebbleFilterOptions.GhostLegToken]?.length ?? 0;

          return i18n({ key: "I18N.GHOST_LEG_AVAILABLE", interpolationValues: { value: count } });
        }
        case PebbleFilterOptions.All:
        default:
          return undefined;
      }
    },
  );
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getCombinationItems = createCombinationItemsSelector();
  const getOptionTitle = createOptionTitleSelector();
  const getGenerosityCardsURNByType = createGenerosityCardsURNByTypeSelector();
  const getExtraWalletCardGroup = createCardGroupByURNSelector<ExtraWalletCardGroups, URN>();

  const i18nLabels = {
    helpMessage: i18n({ key: "I18N.BONUSES_HELP_MSG" }),
    helpButtonLabel: i18n({ key: "I18N.HELP_LABEL" }),
  };

  return (state: ApplicationState, { itemsFilter }: ContainerProps): StateProps => {
    let userDetails;
    try {
      userDetails = <UserDetails>getUserDetails(state);
    } catch (e) {
      console.error(e);
      return {};
    }

    const extraWalletCardGroup = getExtraWalletCardGroup(
      state.layouts.cardgroups.extrawalletcardgroups,
      EXTRA_WALLET_CARD_GROUP_URN,
    );

    if (!itemsFilter || !extraWalletCardGroup) {
      return {};
    }

    const generosityCardsURNByType = getGenerosityCardsURNByType(state);

    const filteredItems =
      itemsFilter === PebbleFilterOptions.All
        ? extraWalletCardGroup.items.map(({ urn }) => urn)
        : generosityCardsURNByType[itemsFilter];

    const { combinationItems = [], filteredWalletsAmount = 0 } = getCombinationItems(state, filteredItems);

    const { selectedCombinationId } = state.betslip || {};

    const optionTitle = getOptionTitle(
      state,
      userDetails,
      combinationItems,
      filteredWalletsAmount,
      itemsFilter,
      generosityCardsURNByType,
    );

    const optionIcon = FILTER_OPTIONS_TO_ICON[itemsFilter] ?? undefined;

    const currentPebble = MAP_PEBBLE_OPTION_TO_GA_LABEL[itemsFilter];

    const isFromBetslip = !!selectedCombinationId;

    return {
      i18nLabels,
      items: isFromBetslip ? combinationItems : filteredItems,
      optionTitle,
      optionIcon,
      helpUrl: extraWalletCardGroup?.helpUrl,
      showAlert: itemsFilter === PebbleFilterOptions.All || Object.keys(generosityCardsURNByType).length === 1,
      currentPebble,
      isFromBetslip,
    };
  };
};

export type DispatchProps = {
  dispatchPushExternalBlankAction: (url: string) => ExternalPushBlankAction;
  dispatchHelpNavigationAction: (
    destinationUrl: string,
    currentPebble: string,
    isFromBetslip: boolean,
  ) => GenerosityWalletHelpAction;
};

export const mapDispatchToProps: MapDispatchToProps<DispatchProps, ContainerProps> = (dispatch: Dispatch) => ({
  dispatchPushExternalBlankAction: (url: string): ExternalPushBlankAction =>
    dispatch<ExternalPushBlankAction>({
      type: EXTERNAL_PUSH_BLANK,
      payload: {
        viewUrl: url,
        viewUrn: EntityType.ExternalView,
      },
    }),
  dispatchHelpNavigationAction: (
    destinationUrl: string,
    currentPebble: string,
    isFromBetslip: boolean,
  ): GenerosityWalletHelpAction =>
    dispatch<GenerosityWalletHelpAction>({
      type: UI__NAVIGATE_GENEROSITY_WALLET_HELP,
      payload: {
        destinationUrl,
        currentPebble,
        isFromBetslip,
      },
    }),
});
