import { EntityType } from "@ppb/tbd-urn-codecs";
import classnames from "classnames";
import { lazy, useRef, FunctionComponent, Suspense, useEffect, useState, useCallback } from "react";
import { HeaderPlaceholder } from "../Header/snowflakes/Header/HeaderPlaceholder.web";
import BottomBarPlaceholder from "../BottomBar/Placeholder.web";
import buildRouter from "../../config/routes";
import useViewportHeight from "../../hooks/useViewportHeight.web";
import styles from "./App.web.css";
import ConnectedFloatingContainer from "../FloatingContainer";
import FloatingContainer from "../FloatingContainer/FloatingContainer.web";
import { ComponentProps } from "./props";
import { useIsWebMessagesModuleLoaded } from "../../hooks/useHasWebMessagesModuleLoaded";

const ConnectedRootBetslip = lazy(
  () => import(/* webpackChunkName: "betslip", webpackPrefetch:true */ "../Betslip/RootBetslip"),
);

const RootBetslip = lazy(
  () => import(/* webpackChunkName: "betslip", webpackPrefetch:true */ "../Betslip/RootBetslip/RootBetslip.web"),
);

const ConnectedGenerosityWallet = lazy(
  () => import(/* webpackChunkName: "GenerosityWallet", webpackPrefetch:true */ "../GenerosityWallet"),
);

const GenerosityWallet = lazy(
  () =>
    import(/* webpackChunkName: "GenerosityWallet", webpackPrefetch:true */ "../GenerosityWallet/GenerosityWallet.web"),
);

const ConnectedReceipt = lazy(() => import(/* webpackChunkName: "Receipt" */ "../Receipt"));
const Receipt = lazy(() => import(/* webpackChunkName: "Receipt" */ "../Receipt/Receipt.web"));

const ConnectedPredicts = lazy(() => import(/* webpackChunkName: "Predicts" */ "../Predicts"));
const Predicts = lazy(() => import(/* webpackChunkName: "Predicts" */ "../Predicts/Predicts.web"));

const ConnectedSnacks = lazy(() => import(/* webpackChunkName: "Snacks" */ "../Snacks"));
const Snacks = lazy(() => import(/* webpackChunkName: "Snacks" */ "../Snacks/Snacks.web"));

const ConnectedExchangeOnboarding = lazy(
  () => import(/* webpackChunkName: "ExchangeOnboarding" */ "../ExchangeOnboarding"),
);

const ExchangeOnboarding = lazy(
  () => import(/* webpackChunkName: "ExchangeOnboarding" */ "../ExchangeOnboarding/ExchangeOnboarding.web"),
);

const Feedback = lazy(() => import(/* webpackChunkName: "Feedback" */ "../Feedback/Feedback.web"));

const ConnectedSpainSessionWs = lazy(() => import(/* webpackChunkName: "SpainSessionWs" */ "../SpainSessionWS"));

const SpainSessionWs = lazy(
  () => import(/* webpackChunkName: "ExchangeOnboarding" */ "../SpainSessionWS/SpainSessionWS.web"),
);

const ConnectedWebMessagePopup = lazy(() => import(/* webpackChunkName: "WebMessagePopup" */ "../WebMessagePopup"));
const WebMessagePopup = lazy(
  () => import(/* webpackChunkName: "WebMessagePopup" */ "../WebMessagePopup/WebMessagePopup.web"),
);

const ConnectedLoyaltyMessaging = lazy(() => import(/* webpackChunkName: "LoyaltyMessaging" */ "../LoyaltyMessaging"));
const LoyaltyMessaging = lazy(
  () => import(/* webpackChunkName: "LoyaltyMessaging" */ "../LoyaltyMessaging/LoyaltyMessaging.web"),
);

const ConnectedHeader = lazy(() => import(/* webpackChunkName: "Header" */ "../Header"));
const Header = lazy(() => import(/* webpackChunkName: "Header" */ "../Header/Header.web"));

const ConnectedBottomBar = lazy(() => import(/* webpackChunkName: "BottomBar" */ "../BottomBar"));
const BottomBar = lazy(() => import(/* webpackChunkName: "BottomBar" */ "../BottomBar/BottomBar.web"));

const App: FunctionComponent<ComponentProps> = ({
  currentUrn,
  currentView,
  isBettingActive,
  isBetslipCollapsed,
  loggedIn,
  showXSellBar,
  showExcFeedbackButton,
  accountId,
  dispatchPushExternalBlankAction,
}) => {
  const [view, setView] = useState();
  const isWebMessagesModuleLoaded = useIsWebMessagesModuleLoaded();
  const scrollableSectionRef = useRef<HTMLDivElement | null>(null);
  const { vh } = useViewportHeight();

  if (vh) {
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }

  // Listener to restrict the maximum font size of dynamic type (for accessibility) on browsers that support -apple-system-body
  useEffect(() => {
    const intervalId = setInterval(() => {
      const root = document.documentElement;
      const computedStyles = getComputedStyle(root);
      const sysBody = computedStyles.getPropertyValue("--apple-system-body");

      if (sysBody) {
        root.style.setProperty("-webkit-text-size-adjust", "100%");
        const fontSize = parseInt(computedStyles.fontSize, 10);

        const maxPx = parseFloat(computedStyles.getPropertyValue("--page-px-max"));

        if (fontSize > maxPx) {
          root.style.setProperty("-webkit-text-size-adjust", `${Math.floor((maxPx / fontSize) * 100)}%`);
        }
      } else {
        clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // Build router
  useEffect(() => {
    async function resolve(): Promise<void> {
      const router = buildRouter();

      if (!currentView) {
        throw new Error("Panic mode!");
      }

      const result = await router.resolve({
        pathname: currentView,
        urn: currentUrn,
      });

      setView(result);
    }

    resolve();
  }, [currentView, currentUrn]);

  const handlePortalContainerResize = useCallback((size: number) => {
    if (scrollableSectionRef.current) {
      scrollableSectionRef.current.style.marginTop = `${size}px`;
    }
  }, []);

  const openFeedbackSurvey = useCallback(() => {
    dispatchPushExternalBlankAction(accountId);
  }, [dispatchPushExternalBlankAction, accountId]);

  const isSettingsView = currentView === EntityType.SettingsView;
  const isMyAccountView = currentView === EntityType.MyAccountView;

  const webWrappedExperienceView = window.__TBD_CLIENT_CONTEXT__?.webWrappedExperience;

  return (
    <>
      <Suspense fallback={<></>}>
        <ConnectedSpainSessionWs component={SpainSessionWs} />
      </Suspense>
      {isWebMessagesModuleLoaded && (
        <Suspense fallback={<></>}>
          <ConnectedWebMessagePopup component={WebMessagePopup} />
        </Suspense>
      )}
      <Suspense fallback={<HeaderPlaceholder loggedIn={loggedIn} showXSellBar={showXSellBar} />}>
        <ConnectedHeader
          component={Header}
          hideHeader={isMyAccountView || webWrappedExperienceView}
          onPortalContainerResize={handlePortalContainerResize}
        />
      </Suspense>
      {showExcFeedbackButton && (
        <Suspense fallback={<></>}>
          <Feedback onFeedbackTap={openFeedbackSurvey} />
        </Suspense>
      )}
      {!webWrappedExperienceView && (
        <Suspense fallback={<BottomBarPlaceholder />}>
          <ConnectedBottomBar component={BottomBar} />
        </Suspense>
      )}
      <div
        className={classnames(styles.scrollable, {
          [styles.scrollableFadeOut]: isMyAccountView,
          [styles.fullHeightContainer]: isSettingsView,
          [styles.overlayed]: isMyAccountView,
          [styles.betslipCollapsed]: isBetslipCollapsed,
          [styles.webWrappedVersion]: webWrappedExperienceView,
        })}
        ref={scrollableSectionRef}
        id="scrollable-section"
      >
        <main
          className={classnames({
            fullHeightContainer: isSettingsView,
          })}
        >
          {view}
        </main>
        <footer id="page-footer" />
      </div>
      <Suspense fallback={<></>}>
        <ConnectedSnacks component={Snacks} />
      </Suspense>
      <Suspense fallback={<></>}>
        <ConnectedExchangeOnboarding component={ExchangeOnboarding} />
      </Suspense>
      {isBettingActive && (
        <Suspense fallback={<></>}>
          <ConnectedRootBetslip component={RootBetslip} />
        </Suspense>
      )}

      <Suspense fallback={<></>}>
        <ConnectedGenerosityWallet component={GenerosityWallet} />
      </Suspense>

      {isMyAccountView ? <div id="overlay" className={classnames(styles.overlayFadeOut, styles.overlay)}></div> : null}
      <ConnectedFloatingContainer component={FloatingContainer} />
      {/* this will be the container for every modal that is opened in the application */}
      <div id="modal-root" />
      {/* this will be the container for every overlay that is opened in the application */}
      <div id="overlay-root"></div>

      <Suspense fallback={<></>}>
        <ConnectedReceipt component={Receipt} />
      </Suspense>

      <Suspense fallback={<></>}>
        <ConnectedPredicts component={Predicts} />
      </Suspense>

      <Suspense fallback={<></>}>
        <ConnectedLoyaltyMessaging component={LoyaltyMessaging} />
      </Suspense>
    </>
  );
};

export default App;
