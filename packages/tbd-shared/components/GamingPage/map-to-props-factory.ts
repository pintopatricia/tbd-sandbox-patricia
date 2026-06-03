import { MapStateToPropsFactory } from "react-redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { Jurisdiction, jurisdictionToTopLevelDomainMap } from "@ppb/tbd-store/config/Jurisdiction";
import { close as closeHamburgerMenu } from "@ppb/tbd-store/state/hamburger-menu";
import { NativeViewLink } from "@ppb/tbd-router/native";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { getUserWallets } from "@ppb/tbd-store/state/entities/user-wallets/user-wallets-selectors";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { WalletNames } from "@ppb/tbd-store/state/constants";
import { getBasePath, getCurrentEnv } from "../../config/base-path-utils.native";
import { i18n } from "../../helpers/i18n";
import { GamesFrameworkConfigProps } from "./GamingPage.ios.types";
import { Environment } from "../../config/environments.native";

export type ContainerProps = {
  configs?: GamesFrameworkConfigProps | undefined;
  handleCurrentRoute: (currentRoute: NativeViewLink) => void;
};

type CardProps = {
  accountId: number;
  countryCode: string;
  currencyCode: string;
  environment: string;
  environmentType: string;
  drkHeaderValue?: string;
  jurisdiction: string;
  localeCode: string;
  loggedIn: boolean;
  regulatoryUserInfo: string;
  lastLoginDate?: string;
  walletNames: (WalletNames | undefined)[];
  currentRoute: NativeViewLink;
};
export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () =>
  function mapStateToProps(state: ApplicationState, props: ContainerProps): StateProps {
    try {
      const userDetails = <UserDetails>getUserDetails(state);
      const route = state.router;
      const { configs } = props;
      const wallets = getUserWallets(state);
      const walletNames: (WalletNames | undefined)[] = [];
      if (wallets) {
        Object.keys(wallets).forEach((wallet) => {
          if (wallet === "MAIN") {
            walletNames.push(wallets[wallet]?.walletName);
          }
        });
      }
      const labels = {
        nationalIdentifierLabel: i18n({ key: "I18N.USER.NATIONAL_IDENTIFIER" }),
        contractNumberLabel: i18n({ key: "I18N.USER.CONTRACT_NUMBER" }),
      };
      const regulatoryUserInfo = `${userDetails.firstName} ${userDetails.lastName} - ${
        userDetails.jurisdictionalData?.nationalIdentifier && labels?.nationalIdentifierLabel
          ? labels.nationalIdentifierLabel
          : ""
      } ${userDetails.jurisdictionalData?.nationalIdentifier || ""} - ${
        userDetails.jurisdictionalData?.contractNumber && labels?.contractNumberLabel ? labels.contractNumberLabel : ""
      } ${userDetails.jurisdictionalData?.contractNumber || ""}`;
      const brand = configs ? configs.theme?.toLowerCase() : "betfair";
      const topLevelDomain = jurisdictionToTopLevelDomainMap[userDetails.jurisdiction.jurisdiction as Jurisdiction];

      const getEnvironment = (): string => {
        if (getBasePath().includes(".nxt.")) {
          return `${brand}.${topLevelDomain}.nxt.ppbdev.com`;
        }
        return `${brand}.${topLevelDomain}`;
      };

      const envType = getCurrentEnv() || Environment.prd;

      // The DRK header is only needed for the DRK environment, and the value is mocked until we know the exact value
      const getDrkHeaderValue = (): string | undefined =>
        envType !== Environment.drk ? undefined : "cdd300af6427415b9d9ad031bfaea98b150e95da";

      return {
        accountId: userDetails.accountId,
        countryCode: userDetails.countryCode,
        currencyCode: userDetails.currencyCode,
        environment: getEnvironment(),
        environmentType: envType,
        drkHeaderValue: getDrkHeaderValue(),
        jurisdiction: userDetails.jurisdiction.jurisdiction,
        localeCode: userDetails.localeCode,
        loggedIn: userDetails.loggedIn,
        currentRoute: route.currentRoute,
        regulatoryUserInfo,
        lastLoginDate: userDetails.lastLoginDate,
        walletNames,
      };
    } catch (e) {
      console.error(e);
      return {};
    }
  };
const dispatchHamburgerMenuCloseAction = (): ReturnType<typeof closeHamburgerMenu> => closeHamburgerMenu();
export type DispatchProps = {
  dispatchHamburgerMenuCloseAction: typeof dispatchHamburgerMenuCloseAction;
};

export const mapDispatchToProps: DispatchProps = { dispatchHamburgerMenuCloseAction };
