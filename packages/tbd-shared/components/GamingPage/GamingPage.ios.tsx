import { FunctionComponent, useEffect } from "react";
import { requireNativeComponent } from "react-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { ComponentProps } from "./props";
import { GAMES_LOBBY } from "./GamingPage.ios.selectors";

const GamesView = requireNativeComponent("GamesLobby");

const GamingPage: FunctionComponent<ComponentProps> = ({
  accountId,
  countryCode,
  currencyCode,
  environment,
  environmentType,
  drkHeaderValue,
  jurisdiction,
  localeCode,
  loggedIn,
  configs,
  handleCurrentRoute,
  dispatchHamburgerMenuCloseAction,
  currentRoute,
  lastLoginDate,
  regulatoryUserInfo,
  walletNames,
}) => {
  useEffect(() => {
    if (currentRoute) handleCurrentRoute(currentRoute);
  }, [currentRoute]);

  useEffect(() => {
    if (configs?.gameLaunchInfo) {
      dispatchHamburgerMenuCloseAction();
    }
  }, [configs]);

  const getGamesViewProps = (): Record<string, unknown> => ({
    configs: {
      ...configs,
      accountId,
      countryCode,
      currencyCode,
      environment,
      environmentType,
      drkHeaderValue,
      jurisdiction,
      localeCode,
      loggedIn,
      lastLoginDate,
      regulatoryUserInfo,
      walletNames,
    },
    style: {
      flex: 1,
    },
  });

  return <GamesView {...getGamesViewProps()} {...getTestProps(GAMES_LOBBY, false)} />;
};

export default GamingPage;
