import { MapStateToPropsFactory } from "react-redux";
import { createGetUserMainWalletValueSelector } from "@ppb/tbd-store/state/entities/user-wallets/user-wallets-selectors";
import {
  getUserDetails,
  getUserJurisdiction,
  getUserRegion,
} from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { FETCH_CARDS, FetchCardsAction } from "@ppb/tbd-store";
import { codecs } from "@ppb/tbd-urn-codecs";
import { getCookie } from "../../helpers/cookies.web";
import { getEndpoint, getDesktopHeaderConfig } from "../../config/endpoints";

export type AuthenticationConfiguration = {
  loginEndpoint: string;
  loginRedirectUrl: string;
  loginRedirectMethod: string;
  logoutEndpoint: string;
  logoutRedirectUrl: string;
  logoutRedirectMethod: string;
};

export type ClientConfiguration = {
  version: string;
  brand: string;
  product: string;
  channel: string;
  platform: string;
  selectedTab: string;
};

export type ContentConfiguration = {
  headerType: string;
};

export type DimensionConfiguration = {
  jurisdiction: string;
  language: string;
  region: string;
  productDomain: string;
};

export type SscConfig = {
  authenticationConfiguration: AuthenticationConfiguration;
  clientConfiguration: ClientConfiguration;
  contentConfiguration: ContentConfiguration;
  dimension: DimensionConfiguration;
};

export type ContainerProps = {};

export type StateProps = {
  authenticationConfiguration: AuthenticationConfiguration;
  clientConfiguration: ClientConfiguration;
  contentConfiguration: ContentConfiguration;
  jurisdiction: string;
  language: string;
  region: string;
  productDomain: string;
  sscContentUrl: string;
  currentUrl: string | null;
  accountBalance: number | null;
  ssoidCookie: string;
};

const EXTRA_WALLET_CARD_GROUP_URN = codecs.cardGroup.extraWallet.encode().uid;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getUserMainWalletValue = createGetUserMainWalletValueSelector();
  const sscContentUrl = getEndpoint("SSC");
  const desktopHeaderConfig = getDesktopHeaderConfig();

  return function mapStateToProps(state: ApplicationState): StateProps {
    const language = getCookie("language") || "en";
    const ssoidCookie = getCookie("ssoid") || "";
    // Fallbacks
    let jurisdiction = "INTERNATIONAL";
    let region = "ALL_REGIONS";

    const { currentUrl } = state.router;
    const accountBalance = getUserMainWalletValue(state);

    try {
      const userDetails = <UserDetails>getUserDetails(state);
      const userDetailsJurisdiction = getUserJurisdiction(userDetails);
      const userDetailsRegion = getUserRegion(userDetails);

      if (userDetailsJurisdiction) {
        jurisdiction = userDetailsJurisdiction;
      }

      if (userDetailsRegion) {
        region = userDetailsRegion;
      }
    } catch (e) {
      console.error(e);
    }

    return {
      authenticationConfiguration: desktopHeaderConfig.authenticationConfiguration,
      clientConfiguration: desktopHeaderConfig.clientConfiguration,
      contentConfiguration: desktopHeaderConfig.contentConfiguration,
      jurisdiction,
      language,
      region,
      productDomain: desktopHeaderConfig.productDomain,
      ssoidCookie,
      sscContentUrl,
      currentUrl,
      accountBalance,
    };
  };
};

const dispatchFetchGenerosityWalletCardGroupAction = (): FetchCardsAction => ({
  type: FETCH_CARDS,
  payload: {
    urns: [EXTRA_WALLET_CARD_GROUP_URN],
  },
});

export type DispatchProps = {
  dispatchFetchGenerosityWalletCardGroupAction: typeof dispatchFetchGenerosityWalletCardGroupAction;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchFetchGenerosityWalletCardGroupAction,
};
