import { EntityType } from "@ppb/tbd-urn-codecs";
import classnames from "classnames";
import { lazy, FunctionComponent, Suspense, useEffect, useState } from "react";
import {
  HEADER_SPACE_ID,
  HEADER_CONTAINER_ID,
} from "@ppb/the-wall-web/components/bricks/StickyHeader/StickyHeader.types";
import buildRouter from "../../config/routes";
import useViewportHeight from "../../hooks/useViewportHeight.web";
import styles from "./App.web.css";
import stylesDesktop from "./App.desktop.web.css";
import { ComponentProps } from "./props";

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

const ConnectedSnacks = lazy(() => import(/* webpackChunkName: "Snacks" */ "../Snacks"));
const Snacks = lazy(() => import(/* webpackChunkName: "Snacks" */ "../Snacks/Snacks.web"));

const ConnectedExchangeOnboarding = lazy(
  () => import(/* webpackChunkName: "ExchangeOnboarding" */ "../ExchangeOnboarding"),
);

const ExchangeOnboarding = lazy(
  () => import(/* webpackChunkName: "ExchangeOnboarding" */ "../ExchangeOnboarding/ExchangeOnboarding.web"),
);

const ConnectedSpainSessionWs = lazy(() => import(/* webpackChunkName: "SpainSessionWs" */ "../SpainSessionWS"));

const SpainSessionWs = lazy(
  () => import(/* webpackChunkName: "ExchangeOnboarding" */ "../SpainSessionWS/SpainSessionWS.web"),
);

const ConnectedLoyaltyMessaging = lazy(() => import(/* webpackChunkName: "LoyaltyMessaging" */ "../LoyaltyMessaging"));
const LoyaltyMessaging = lazy(
  () => import(/* webpackChunkName: "LoyaltyMessaging" */ "../LoyaltyMessaging/LoyaltyMessaging.web"),
);

const ConnectedDesktopHeader = lazy(() => import(/* webpackChunkName: "DesktopHeader" */ "../DesktopHeader"));
const DesktopHeader = lazy(() => import(/* webpackChunkName: "DesktopHeader" */ "../DesktopHeader/DesktopHeader.web"));

const ConnectedLeftSidebar = lazy(() => import(/* webpackChunkName: "LeftSidebar" */ "../LeftSidebar"));
const LeftSidebar = lazy(() => import(/* webpackChunkName: "LeftSidebar" */ "../LeftSidebar/LeftSidebar.web"));

const App: FunctionComponent<ComponentProps> = ({ currentUrn, currentView, isBettingActive }) => {
  const [view, setView] = useState();

  const { vh } = useViewportHeight();

  if (vh) {
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }

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

  const isSettingsView = currentView === EntityType.SettingsView;
  const isMyAccountView = currentView === EntityType.MyAccountView;

  const webWrappedExperienceView = window.__TBD_CLIENT_CONTEXT__?.webWrappedExperience;

  return (
    <>
      <Suspense fallback={<></>}>
        <ConnectedSpainSessionWs component={SpainSessionWs} />
      </Suspense>
      <div className={stylesDesktop.headerAndScrollableContainer}>
        {!webWrappedExperienceView && (
          <div className={stylesDesktop.header}>
            <Suspense fallback={<></>}>
              <ConnectedDesktopHeader component={DesktopHeader} />
            </Suspense>
          </div>
        )}
        <div id="scrollable-desktop-container" className={stylesDesktop.scrollbarContainer}>
          <div className={stylesDesktop.sectionsContainer}>
            <section
              className={classnames(stylesDesktop.sideBar, stylesDesktop.leftSideBar, {
                [stylesDesktop.webWrappedVersion]: webWrappedExperienceView,
              })}
            >
              <Suspense fallback={<></>}>
                <ConnectedLeftSidebar component={LeftSidebar} />
              </Suspense>
            </section>
            <div className={stylesDesktop.scrollable}>
              <div id={HEADER_CONTAINER_ID} className={stylesDesktop.stickyContainer}>
                <div id={HEADER_SPACE_ID} />
              </div>
              <section
                className={classnames(styles.scrollable, stylesDesktop.scrollableSectionDesktop, {
                  [styles.scrollableFadeOut]: isMyAccountView,
                  [styles.fullHeightContainer]: isSettingsView,
                  [styles.overlayed]: isMyAccountView,
                })}
                id="scrollable-section"
              >
                <div
                  className={classnames(stylesDesktop.mainContainer, {
                    fullHeightContainer: isSettingsView,
                  })}
                >
                  {view}
                </div>
                <Suspense fallback={<></>}>
                  <ConnectedSnacks component={Snacks} />
                </Suspense>
              </section>
            </div>
            <section
              className={classnames(stylesDesktop.sideBar, stylesDesktop.rightSideBar, {
                [stylesDesktop.webWrappedVersion]: webWrappedExperienceView,
              })}
            >
              {isBettingActive && (
                <Suspense fallback={<></>}>
                  <ConnectedRootBetslip component={RootBetslip} />
                </Suspense>
              )}
              <Suspense fallback={<></>}>
                <ConnectedGenerosityWallet component={GenerosityWallet} />
              </Suspense>
            </section>
          </div>
        </div>
      </div>
      <Suspense fallback={<></>}>
        <ConnectedExchangeOnboarding component={ExchangeOnboarding} />
      </Suspense>

      {/* this will be the container for every modal that is opened in the application */}
      <div id="modal-root" />
      {/* this will be the container for every overlay that is opened in the application */}
      <div id="overlay-root"></div>

      <Suspense fallback={<></>}>
        <ConnectedReceipt component={Receipt} />
      </Suspense>

      <Suspense fallback={<></>}>
        <ConnectedLoyaltyMessaging component={LoyaltyMessaging} />
      </Suspense>
    </>
  );
};

export default App;
