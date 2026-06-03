import { PUSH, PushAction } from "@ppb/tbd-store/actions/router";
import { MyAccountIconClickAction, UI__MY_ACCOUNT_ICON_CLICK } from "@ppb/tbd-store/actions/interface";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { createUserPreferencesWithProductSwitcherSelector } from "@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors";
// Store
import { FetchUserMainWalletAction, FETCH_USER_MAIN_WALLET } from "@ppb/tbd-store/actions/user-wallets";
import { createGetUserMainWalletValueSelector } from "@ppb/tbd-store/state/entities/user-wallets/user-wallets-selectors";
import { createGetWalletsAvailabilitySelector } from "@ppb/tbd-store/state/entities/entities-selectors";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { MapStateToPropsFactory } from "react-redux";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { currencyFormatWithDecimalPlaces } from "../../formatters/currency-formatters";
import { i18n } from "../../helpers/i18n";
import { CurrencyUserDetails } from "../../formatters/formatters";

export type ContainerProps = {
  closeLocation: { urn: string; url: string; encodedUrl: string };
  labels: {
    title: string;
  };
  showBack: boolean;
  backToMyAccount: boolean;
  onClose: () => void;
};

type CardProps = {
  showBalances: boolean;
  accountBalance?: string;
  freeBetsBalance?: string;
  freeBetsLabel: string;
  url: string;
  urn: string;
};
export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getUserMainWalletValue = createGetUserMainWalletValueSelector();
  const getWalletsAvailability = createGetWalletsAvailabilitySelector();
  const getUserPreferencesWithProductSwitcher = createUserPreferencesWithProductSwitcherSelector();

  return function mapStateToProps(state: ApplicationState): StateProps {
    try {
      const userDetails = getUserDetails(state);
      const { showBalances } = getUserPreferencesWithProductSwitcher(state.entities.preferences);
      const accountBalance = getUserMainWalletValue(state);
      const { freeBetsBalance } = getWalletsAvailability(state);

      return {
        accountBalance:
          accountBalance !== undefined && accountBalance !== null
            ? currencyFormatWithDecimalPlaces({
                ...(<CurrencyUserDetails>userDetails),
                value: accountBalance,
              })
            : undefined,
        showBalances,
        freeBetsBalance: freeBetsBalance
          ? currencyFormatWithDecimalPlaces({
              ...(<UserDetails>userDetails),
              value: freeBetsBalance,
            })
          : undefined,
        freeBetsLabel: i18n({ key: "I18N.FREE_BETS" }),
        url: state.router.currentUrl ?? "",
        urn: state.router.currentUrn ?? "",
      };
    } catch (e) {
      console.error(e);

      return {};
    }
  };
};

const dispatchFetchUserMainWallet = (): FetchUserMainWalletAction => ({
  type: FETCH_USER_MAIN_WALLET,
});

const dispatchChangeUrl = (closeUrn: string, closeUrl: string): PushAction => ({
  type: PUSH,
  payload: {
    viewUrn: `${closeUrn}`,
    viewUrl: `${closeUrl}`,
  },
});

const dispatchMyAccountClickAction = (isOpen: boolean): MyAccountIconClickAction => ({
  type: UI__MY_ACCOUNT_ICON_CLICK,
  payload: isOpen,
});

export type DispatchProps = {
  dispatchFetchUserMainWallet: typeof dispatchFetchUserMainWallet;
  dispatchChangeUrl: typeof dispatchChangeUrl;
  dispatchMyAccountClickAction: typeof dispatchMyAccountClickAction;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchFetchUserMainWallet,
  dispatchChangeUrl,
  dispatchMyAccountClickAction,
};
