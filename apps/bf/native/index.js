/**
 * This file represents the entry point for our native apps.
 */
// TODO: Import only the polyfills we truly need for native
import "./polyfills";

/**
 * React Navigation gesture dependency required at the topmost level of the app.
 * [Reference] https://reactnavigation.org/docs/getting-started
 */
import "react-native-gesture-handler";
import "react-native-get-random-values";
import { AppRegistry, LogBox } from "react-native";
import { LaunchArguments } from "react-native-launch-arguments";
import { isCurrentEnv, initEnvironment } from "@ppb/tbd-shared/config/base-path-utils.native";
import { Environment } from "@ppb/tbd-shared/config/environments.native";
import appConfiguration from "@ppb/tbd-shared/config/app-configuration.native";
import { hideSplash } from "@ppb/tbd-shared/helpers/splash";
import App from "./App";
import { name as appName, brand as appBrand } from "./app.json";
import config from "./app.config.json";
import { HELP_CENTER_URLS } from "./config/help-center-urls";
import { MAX_PAYOUT_LIMITS } from "./config/max-payout-limits";
import { initI18n, initStore } from "./setup";
import initialCetFrameworkSetup from "./helpers/init-cet-framework";

const launchArgs = LaunchArguments.value();

AppRegistry.registerRunnable(appName, async (initialProps) => {
  const params = {
    appConfig: config,
    appName,
    appBrand,
    helpCenterUrls: HELP_CENTER_URLS,
    maxPayoutLimits: MAX_PAYOUT_LIMITS,
  };

  const deeplinkConfiguration = {
    subdomainPattern: /(?<!w{3})\.betfair\./,
    subdomainWhitelistPattern: /^https:\/\/(promos|promotions)\.betfair(\.\w+)+/,
    extractViewURLPattern: /^bfe:\/\/|^bsm:\/\/|^.*betfair(\.\w+)+(\/betting)?\/?/,
    gameLaunchURLPattern: /^https:\/\/launcher\.betfair(\.\w+)+/,
    casinoWhitelistPattern: /casino\.betfair(\.\w+)+\/(prize-pinball|promotions)/,
    gameCollectionUrnPattern: /betfair\.\w+\/betting\/casino\/c/,
    cetLoginUrlPattern: /^https:\/\/identitysso\.betfair(\.\w+)+\/view\/login/,
    newGameLaunchPattern: /^https:\/\/([a-zA-Z0-9-]+\.)?betfair\.com(\.\w+)*\/gaming-launcher\/play\/?\?gameId=[^&]+/,
  };

  appConfiguration.setup(params);
  appConfiguration.setupDeeplinkConfiguration(deeplinkConfiguration);

  await Promise.all([initEnvironment(), initI18n()]);

  const store = await initStore(initialCetFrameworkSetup);

  function AppWrapper(props) {
    return <App {...props} store={store} />;
  }

  AppRegistry.registerComponent(appName, () => AppWrapper);
  AppRegistry.runApplication(appName, initialProps);

  if (isCurrentEnv(Environment.mockserver) || launchArgs.e2e) {
    // hide splash screen as soon as possible to prevent regression tests from failing
    hideSplash();

    // hide log messages in the debug build to prevent regression tests from failing
    LogBox.ignoreAllLogs();

    // ignoreAllLogs for some reason isn't working seems to be a bug
    // for now we'll just use regular console.log and the logbox wont ever appear
    console.error = console.log;
    console.warn = console.log;
  }
});
