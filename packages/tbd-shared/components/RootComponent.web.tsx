/* eslint-disable @typescript-eslint/no-require-imports */
import WdyrDashboard from "./Wdyr/wdyr.web";

import type { IModuleStore } from "redux-dynamic-modules";

import { FunctionComponent, useState, useEffect, StrictMode, useCallback } from "react";
import { APP_VISIBILITY_CHANGE } from "@ppb/tbd-store/actions/interface";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { createGetThrottleSelector } from "@ppb/tbd-store/state/entities/throttles/throttles-selectors";
import { ThemeContextProvider, type ThemeContextName } from "@ppb/the-wall-theme";
import { Provider } from "react-redux";
import { ApolloProvider } from "@apollo/client/react";
import { ErrorBoundaryProvider } from "./ErrorBoundary/ErrorBoundaryProvider.web";
import { EnvironmentBanner } from "./EnvironmentBanner/EnvironmentBanner.web";
import { ConfigContextProvider } from "./Config/ConfigContext";
import { getApolloClient } from "../apollo-client/client";
import { addGtmScript } from "../helpers/google-analytics/google-analytics-helper.web";
import { useRealityCheckAlert } from "../hooks/useRealityCheckAlert.web";
import { LoopProvider } from "../experimentation/provider/LoopProvider";
import { resolveVisitorId } from "../experimentation/visitor-id-resolver.web";

const ConnectedApp = require("./App").default;
const App = require("./App/App.web").default;
const AppDesktop = require("./App/App.desktop.web").default;

const DESKTOP_MEDIA = window.matchMedia("(min-width: 900px)");

const RootComponent: FunctionComponent<{ store: IModuleStore<ApplicationState>; theme: ThemeContextName }> = ({
  store,
  theme,
}) => {
  const state = store.getState();
  const getThrottle = createGetThrottleSelector();
  const isDesktopThrottleActive = !!getThrottle(state.entities.throttles, "DESKTOP_EXPERIENCE")?.isActive;
  const deferGTMLoading = getThrottle(state.entities.throttles, "DEFER_GTM_LOADING")?.isActive;
  const isGA4Active = getThrottle(state.entities.throttles, "ENABLE_GA4")?.isActive;
  const isUADisabled = getThrottle(state.entities.throttles, "DISABLE_UA")?.isActive;

  // SEO needs quite some changes to be able to adapt to a responsive design...
  const isPrerender = !!window.__CONTENT_LOADING_PARAMETERS__.catalog;
  const isPrerenderDesktop = !!window.__CONTENT_LOADING_PARAMETERS__.isDesktop;
  const isNotMobileBot = !isPrerender || isPrerenderDesktop;

  useRealityCheckAlert();

  const isDesktop = useCallback(
    (evt: MediaQueryListEvent | MediaQueryList): boolean => evt.matches && isDesktopThrottleActive && isNotMobileBot,
    [isDesktopThrottleActive, isNotMobileBot],
  );

  const [isDesktopLayout, setIsDesktopLayout] = useState(isDesktop(DESKTOP_MEDIA));

  const setLayout = useCallback(
    (evt: MediaQueryListEvent) => {
      setIsDesktopLayout(isDesktop(evt));
    },
    [isDesktop],
  );

  // Add listener for visibilitychange event
  useEffect(() => {
    function handleVisibilityChange(): void {
      const visible = !window.document.hidden;

      store.dispatch({
        type: APP_VISIBILITY_CHANGE,
        payload: { visible },
      });
    }

    window.addEventListener("visibilitychange", handleVisibilityChange);

    return () => window.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [store]);

  useEffect(() => {
    DESKTOP_MEDIA.addEventListener("change", setLayout);

    return () => DESKTOP_MEDIA.removeEventListener("change", setLayout);
  }, [setLayout]);

  useEffect(() => {
    if (deferGTMLoading) {
      addGtmScript(isGA4Active, isUADisabled);
    }
  }, []);

  return (
    <ApolloProvider client={getApolloClient()}>
      <Provider store={store}>
        <LoopProvider store={store} visitorIdResolver={resolveVisitorId}>
          <ConfigContextProvider value={{ isDesktopLayout }}>
            <ThemeContextProvider value={{ theme }}>
              <ErrorBoundaryProvider>
                <StrictMode>
                  <WdyrDashboard />
                  <ConnectedApp component={isDesktopLayout ? AppDesktop : App} />
                  <EnvironmentBanner />
                </StrictMode>
              </ErrorBoundaryProvider>
            </ThemeContextProvider>
          </ConfigContextProvider>
        </LoopProvider>
      </Provider>
    </ApolloProvider>
  );
};

export default RootComponent;
