import type { JSX } from "react";

import { useSelector } from "react-redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { UserPreferencesState } from "@ppb/tbd-store/state/entities/user-preferences/UserPreferences.types";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import ConnectedBottomBar from "../../BottomBar";
import BottomBar from "../../BottomBar/BottomBar.native";
import ConnectedHeader from "../../Header";
import Header from "../../Header/Header.native";
import ConnectedWebMessagePopup from "../../WebMessagePopup";
import WebMessagePopup from "../../WebMessagePopup/WebMessagePopup.native";
import ConnectedTransactions from "../../Betslip/Transactions";
import { Transactions } from "../../Betslip/Transactions/Transactions.native";
import ConnectedGenerosityWallet from "../../GenerosityWallet";
import GenerosityWallet from "../../GenerosityWallet/GenerosityWallet.native";

const useHasUserPreferences = (): boolean => {
  const userPreferences = useSelector<ApplicationState, UserPreferencesState | null>(
    ({ entities }) =>
      (entities?.preferences && Object.keys(entities?.preferences).length && entities?.preferences) || null,
  );
  return !!userPreferences;
};

const useHasUserDetails = (): boolean => {
  const userDetails = useSelector<ApplicationState, number | null>(({ entities }) => {
    const details = entities.userdetails as UserDetails;
    return details.accountId || null;
  });

  return !!userDetails;
};

type BottomBarScreenProps = {
  StateIndicatorView: React.ComponentType;
};

/**
 * The Bottom Bar navigator contains the Screens and Navigator stacks for each
 * of the tab bar tiles available in the app.
 */
export function BottomBarScreen({ StateIndicatorView }: BottomBarScreenProps): JSX.Element {
  const hasUserPreferences = useHasUserPreferences();
  const hasUserDetails = useHasUserDetails();

  return (
    <>
      <ConnectedTransactions component={Transactions} />
      {hasUserPreferences && <ConnectedHeader component={Header} />}
      {hasUserDetails && <ConnectedWebMessagePopup component={WebMessagePopup} />}
      {hasUserPreferences && <ConnectedGenerosityWallet component={GenerosityWallet} />}
      <ConnectedBottomBar selectedIndex={0} component={BottomBar} stateIndicatorView={<StateIndicatorView />} />
    </>
  );
}
