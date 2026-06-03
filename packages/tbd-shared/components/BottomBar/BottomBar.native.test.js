import { render, act, waitFor } from "@testing-library/react-native";

import { cetMainConfiguration } from "@flutter-global/react-native-cet-framework";
import { ProductsOption } from "@ppb/tbd-store/state/entities/user-preferences/UserPreferences.types";
import { initDeepLinking, removeDeepLinkingEventListeners } from "@ppb/tbd-router/native/deep-linking";
import { GamesLobbyObject, navigate, navigationRef } from "@ppb/tbd-router/native/router";
import { BottomBar as BottomBarComponent } from "@ppb/the-wall-native";

import BottomBar, { BottomBarCreateItemsForNative } from "./BottomBar.native";

import { CookieNames } from "../../config/cookies";
import { getCookie, setCookie } from "../../helpers/cookies.native";

jest.mock("../Navigation/navigators/BrowseNavigator.native", () => "BrowseNavigatorReactElement");
jest.mock("../Navigation/navigators/BrowseSwitchNavigator.native", () => "BrowseSwitchNavigatorReactElement");
jest.mock("../Navigation/navigators/HomeNavigator.native", () => "HomeNavigatorReactElement");
jest.mock("../Navigation/navigators/MyBetsNavigator.native", () => "MyBetsNavigatorReactElement");
jest.mock("../Navigation/navigators/GamingNavigator.native", () => "GamingNavigatorReactElement");

jest.mock("react-native-device-info", () => ({
  getBuildNumber: jest.fn(() => "build-number"),
}));

jest.mock("@ppb/tbd-router/native/deep-linking", () => ({
  initDeepLinking: jest.fn(),
  removeDeepLinkingEventListeners: jest.fn(),
}));

jest.mock("@ppb/the-wall-native", () => ({
  BottomBar: jest.fn((props) => <bottom-bar-mock {...props} />),
}));

jest.mock("@ppb/tbd-router/native/router", () => ({
  navigate: jest.fn(),
  navigationRef: { current: { navigate: jest.fn(), getCurrentRoute: jest.fn() } },
  ScreenName: { GamingMySelectionsScreen: "GamingMySelectionsScreen", PredictsScreen: "PredictsScreen" },
  GamesLobbyObject: {
    gamesLobbyTabActive: jest.fn(),
  },
}));

jest.mock("../../config/endpoints", () => ({
  getEndpoint: jest.fn(() => "betfairexchange.site"),
  getHost: jest.fn().mockReturnValue("betfair.com"),
  getHomepagePaths: jest.fn().mockReturnValue("betting|bbbb|dddd"),
}));

jest.mock("../../helpers/cookies.native", () => ({
  getCookie: jest.fn(() => Promise.resolve(null)),
  setCookie: jest.fn(() => Promise.resolve()),
}));

jest.mock("../../config/app-configuration.native", () => ({
  appBrand: "betfair",
  deeplinkConfiguration: "deeplinkConfiguration",
}));

jest.mock("../../gtm/tagging-collector.native", () => ({
  sendEvent: jest.fn(),
}));

jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

jest.mock("@flutter-global/react-native-cet-framework", () => ({
  CetContext: {
    authorizationToken: "fake-token",
  },
}));

jest.mock("@react-native-cookies/cookies", () => ({
  set: jest.fn(() => Promise.resolve(true)),
  get: jest.fn(() => Promise.resolve({})),
  clearAll: jest.fn(() => Promise.resolve(true)),
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn(() => ({
    authorizationToken: "fake-token",
  })),
}));

const ITEMS = [
  {
    tileType: "HOME",
    viewLink: { viewUrn: "ppb:tbd:view:sport:1" },
    title: "Home",
  },
  {
    tileType: "GAMING",
    viewLink: { viewUrn: "ppb:tbd:view:gaming:1" },
    title: "casino",
  },
];

function renderBottomBar({
  items = ITEMS,
  selectedIndex = 1,
  isReceiptOpen = false,
  productSwitcherConfig = {
    title: "title",
    productPreference: "preference",
    isProductSwitcherAvailable: { native: true },
    showOnboardingNewLabel: false,
    isLoggedIn: false,
    isExcAllowedJurisdictionThrottleActive: false,
  },
  dispatchBottomBarPushAction = jest.fn(),
  dispatchSwitchProductPreferenceAction = jest.fn(),
  dispatchCampaignMeasurementAction = jest.fn(),
  dispatchLaunchGameFromPN = jest.fn(),
  dispatchOpenPredicts = jest.fn(),
  stateIndicatorView = <view-mock testID="state_indicator" />,
} = {}) {
  return render(
    <BottomBar
      items={items}
      selectedIndex={selectedIndex}
      isReceiptOpen={isReceiptOpen}
      productSwitcherConfig={productSwitcherConfig}
      dispatchBottomBarPushAction={dispatchBottomBarPushAction}
      dispatchNativeSwitchProductPreferenceAction={dispatchSwitchProductPreferenceAction}
      dispatchCampaignMeasurementAction={dispatchCampaignMeasurementAction}
      dispatchLaunchGameFromPN={dispatchLaunchGameFromPN}
      dispatchOpenPredicts={dispatchOpenPredicts}
      stateIndicatorView={stateIndicatorView}
    />,
  );
}

describe("BottomBar.native", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  describe("when there is one or more items", () => {
    it("should not render StateIndicator component", () => {
      const { queryByTestId } = renderBottomBar();
      expect(queryByTestId("state_indicator")).toBeNull();
    });
    // it("should call BottomBarCreateItemsForNative", () => {
    //   renderBottomBar();

    //   expect(BottomBarCreateItemsForNative).toHaveBeenCalledTimes(1);
    //   expect(BottomBarCreateItemsForNative).toHaveBeenCalledWith([
    //     {
    //       tileType: "HOME",
    //       viewLink: { viewUrn: "ppb:tbd:view:sport:1" },
    //       title: "Home",
    //     },
    //     {
    //       tileType: "GAMING",
    //       viewLink: { viewUrn: "ppb:tbd:view:gaming:1" },
    //       title: "casino",
    //     },
    //   ]);
    // });

    it("should create BottomBar component", () => {
      renderBottomBar();

      expect(BottomBarComponent).toHaveBeenCalledTimes(1);
      expect(BottomBarComponent).toHaveBeenCalledWith(
        {
          hasProductSwitcher: true,
          isVisible: true,
          skipAnimation: false,
          items: [
            {
              isExternalNavigation: false,
              screen: "HomeNavigatorReactElement",
              tileType: "HOME",
              title: "Home",
              viewLink: {
                viewUrn: "ppb:tbd:view:sport:1",
              },
            },
            {
              isExternalNavigation: false,
              screen: "GamingNavigatorReactElement",
              tileType: "GAMING",
              title: "casino",
              viewLink: {
                viewUrn: "ppb:tbd:view:gaming:1",
              },
            },
          ],
          selectedIndex: 1,
          productSwitcherTitle: "title",
          onTilePress: expect.any(Function),
          onProductSwitch: expect.any(Function),
          checkForGamesTriggeringPopup: expect.any(Function),
          hasOnboardingLabel: false,
        },
        undefined,
      );
    });

    it("should initialize deep linking with brand and deeplinkConfiguration", () => {
      const mockDispatchLaunchGameFromPN = jest.fn();
      renderBottomBar({
        dispatchLaunchGameFromPN: mockDispatchLaunchGameFromPN,
      });
      expect(initDeepLinking).toHaveBeenCalledWith(
        "betfair",
        "deeplinkConfiguration",
        "betfair.com",
        "betting|bbbb|dddd",
        expect.any(Function),
        mockDispatchLaunchGameFromPN,
      );
    });

    it("should call dispatchCampaignMeasurementAction", () => {
      const dispatchCampaignMeasurementAction = jest.fn();
      renderBottomBar({ dispatchCampaignMeasurementAction });

      expect(dispatchCampaignMeasurementAction).toHaveBeenCalled();
    });

    describe("when the number of items change", () => {
      it("should call initialize deep linking only once", () => {
        const { rerender } = renderBottomBar({
          items: [
            {
              tileType: "HOME",
              viewLink: { viewUrn: "ppb:tbd:view:sport:1" },
              title: "Home",
            },
          ],
        });
        rerender(<BottomBar items={ITEMS} />);

        expect(initDeepLinking).toHaveBeenCalledTimes(1);
      });
    });

    describe("when isProductSwitcherAvailable is undefined", () => {
      it("should create the items for native and pass them to BottomBar items", () => {
        renderBottomBar({ productSwitcherConfig: {} });

        // expect(BottomBarCreateItemsForNative).toHaveBeenCalledTimes(1);
        // expect(BottomBarCreateItemsForNative).toHaveBeenCalledWith([
        //   {
        //     tileType: "HOME",
        //     viewLink: { viewUrn: "ppb:tbd:view:sport:1" },
        //     title: "Home",
        //   },
        //   {
        //     tileType: "GAMING",
        //     viewLink: { viewUrn: "ppb:tbd:view:gaming:1" },
        //     title: "casino",
        //   },
        // ]);

        expect(BottomBarComponent).toHaveBeenCalledWith(
          {
            hasProductSwitcher: false,
            isVisible: true,
            skipAnimation: false,
            items: [
              {
                isExternalNavigation: false,
                screen: "HomeNavigatorReactElement",
                tileType: "HOME",
                title: "Home",
                viewLink: {
                  viewUrn: "ppb:tbd:view:sport:1",
                },
              },
              {
                isExternalNavigation: false,
                screen: "GamingNavigatorReactElement",
                tileType: "GAMING",
                title: "casino",
                viewLink: {
                  viewUrn: "ppb:tbd:view:gaming:1",
                },
              },
            ],
            selectedIndex: 1,
            productSwitcherTitle: undefined,
            onTilePress: expect.any(Function),
            onProductSwitch: expect.any(Function),
            checkForGamesTriggeringPopup: expect.any(Function),
            hasOnboardingLabel: false,
          },
          undefined,
        );
      });
    });

    describe("when the first tile is pressed", () => {
      it("should call the dispatchBottomBarPushAction", () => {
        const dispatchBottomBarPushAction = jest.fn();
        renderBottomBar({ dispatchBottomBarPushAction });

        act(() => {
          const { onTilePress } = BottomBarComponent.mock.calls[0][0];
          onTilePress({ viewUrn: "ppb:tbd:view:sport:1" });
        });

        expect(dispatchBottomBarPushAction).toHaveBeenCalledWith({ viewUrn: "ppb:tbd:view:sport:1" });
      });

      it("should call the gamesLobbyTabActive", () => {
        renderBottomBar();
        act(() => {
          const { onTilePress } = BottomBarComponent.mock.calls[0][0];
          onTilePress({ viewUrn: "ppb:tbd:view:sport:1" });
        });

        expect(GamesLobbyObject.gamesLobbyTabActive).toHaveBeenCalledWith(false);
      });
    });

    describe("when an external view type tile is pressed", () => {
      it("should call the navigate", () => {
        const TILE_ITEM = {
          tileType: "EXTERNAL",
          viewLink: { viewUrn: "ppb:tbd:view:external:external", viewUrl: "www.getmeoutofhere.com" },
          title: "Home",
        };

        renderBottomBar({ items: [TILE_ITEM] });
        act(() => {
          const { onTilePress } = BottomBarComponent.mock.calls[0][0];
          onTilePress(TILE_ITEM.viewLink);
        });

        expect(navigate).toHaveBeenCalledWith({
          viewUrn: "ppb:tbd:view:external:external",
          viewUrl: "www.getmeoutofhere.com",
        });
      });
    });

    describe("when the cashout receipt opens", () => {
      it("should hide the bottom bar", async () => {
        const { rerender } = renderBottomBar();
        await act(() => {
          rerender(<BottomBar items={ITEMS} selectedIndex={1} isReceiptOpen />);
        });

        expect(BottomBarComponent).toHaveBeenCalledWith(
          {
            productSwitcherTitle: undefined,
            hasProductSwitcher: false,
            isVisible: false,
            skipAnimation: true,
            items: [
              {
                isExternalNavigation: false,
                screen: "HomeNavigatorReactElement",
                tileType: "HOME",
                title: "Home",
                viewLink: {
                  viewUrn: "ppb:tbd:view:sport:1",
                },
              },
              {
                isExternalNavigation: false,
                screen: "GamingNavigatorReactElement",
                tileType: "GAMING",
                title: "casino",
                viewLink: {
                  viewUrn: "ppb:tbd:view:gaming:1",
                },
              },
            ],
            selectedIndex: 1,
            onTilePress: expect.any(Function),
            onProductSwitch: expect.any(Function),
            checkForGamesTriggeringPopup: expect.any(Function),
            hasOnboardingLabel: false,
          },
          undefined,
        );
      });
    });

    describe("when the cashout receipt closes", () => {
      it("should display the bottom bar", async () => {
        const { rerender } = renderBottomBar({ isReceiptOpen: true });
        await act(() => {
          rerender(<BottomBar items={ITEMS} selectedIndex={1} isReceiptOpen={false} />);
        });

        expect(BottomBarComponent).toHaveBeenCalledWith(
          {
            productSwitcherTitle: undefined,
            hasProductSwitcher: false,
            isVisible: true,
            skipAnimation: true,
            items: [
              {
                isExternalNavigation: false,
                screen: "HomeNavigatorReactElement",
                tileType: "HOME",
                title: "Home",
                viewLink: {
                  viewUrn: "ppb:tbd:view:sport:1",
                },
              },
              {
                isExternalNavigation: false,
                screen: "GamingNavigatorReactElement",
                tileType: "GAMING",
                title: "casino",
                viewLink: {
                  viewUrn: "ppb:tbd:view:gaming:1",
                },
              },
            ],
            selectedIndex: 1,
            onTilePress: expect.any(Function),
            onProductSwitch: expect.any(Function),
            checkForGamesTriggeringPopup: expect.any(Function),
            hasOnboardingLabel: false,
          },
          undefined,
        );
      });
    });

    describe("when onProductSwitcher is called", () => {
      const setupOnProductSwitcher = async ({
        isXSell = false,
        isLoggedIn = false,
        isExcAllowedJurisdictionThrottleActive = false,
        productPreference = ProductsOption.sportsbook,
        title = "Exchange",
        showOnboardingNewLabel = false,
        dispatchSwitchProductPreferenceAction = jest.fn(),
      } = {}) => {
        renderBottomBar({
          items: ITEMS,
          productSwitcherConfig: {
            isLoggedIn,
            isXSell,
            isExcAllowedJurisdictionThrottleActive,
            productPreference,
            title,
            showOnboardingNewLabel,
            isProductSwitcherAvailable: { native: true },
          },
          dispatchSwitchProductPreferenceAction,
        });

        if (!isLoggedIn && isExcAllowedJurisdictionThrottleActive) {
          await waitFor(() => {
            expect(getCookie).toHaveBeenCalledWith(CookieNames.PHOENIX_ENABLED);
          });
        }

        await act(async () => {
          const lastCall = BottomBarComponent.mock.calls.length - 1;
          const { onProductSwitch } = BottomBarComponent.mock.calls[lastCall][0];
          await onProductSwitch();
        });
      };

      describe("when user is logged in", () => {
        describe("when onProductSwitch is called with a productSwitcherConfig true isXSell", () => {
          describe("and productPreference is Sportsbook", () => {
            it("should call the navigate to external view", async () => {
              await setupOnProductSwitcher({
                isLoggedIn: true,
                isXSell: true,
                productPreference: ProductsOption.sportsbook,
                title: "Exchange",
              });

              expect(navigate).toHaveBeenCalledWith({
                fallbackViewUrl: "betfairexchange.site",
                viewUrl: "bfsportsbetting://",
                viewUrn: "ppb:tbd:view:external",
              });
            });
          });
        });
      });

      describe("when user is logged out", () => {
        describe("and PHOENIX_ENABLED cookie is 'true'", () => {
          const dispatchSwitchProductPreferenceAction = jest.fn();

          beforeEach(async () => {
            getCookie.mockResolvedValue("true");

            await setupOnProductSwitcher({
              isLoggedIn: false,
              isExcAllowedJurisdictionThrottleActive: true,
              isXSell: true,
              productPreference: ProductsOption.sportsbook,
              dispatchSwitchProductPreferenceAction,
            });
          });

          it("should call dispatchSwitchProductPreferenceAction", () => {
            expect(dispatchSwitchProductPreferenceAction).toHaveBeenCalledWith(ProductsOption.sportsbook);
          });

          it("should call Bottom Bar with hasOnboardingLabel as true", () => {
            expect(BottomBarComponent).toHaveBeenCalledWith(
              expect.objectContaining({
                hasOnboardingLabel: true,
              }),
              undefined,
            );
          });
        });

        describe("and PHOENIX_ENABLED cookie is 'false'", () => {
          beforeEach(async () => {
            getCookie.mockResolvedValue("false");

            await setupOnProductSwitcher({
              isLoggedIn: false,
              isExcAllowedJurisdictionThrottleActive: true,
              isXSell: false,
            });
          });

          it("should call the navigate to external view", async () => {
            expect(navigate).toHaveBeenCalledWith({
              fallbackViewUrl: "betfairexchange.site",
              viewUrl: "bfsportsbetting://",
              viewUrn: "ppb:tbd:view:external",
            });
          });

          it("should call Bottom Bar with hasOnboardingLabel as false", () => {
            expect(BottomBarComponent).toHaveBeenCalledWith(
              expect.objectContaining({
                hasOnboardingLabel: false,
              }),
              undefined,
            );
          });
        });
      });

      describe("when no cookie is present", () => {
        const dispatchSwitchProductPreferenceAction = jest.fn();

        beforeEach(async () => {
          getCookie.mockResolvedValue(undefined);

          await setupOnProductSwitcher({
            isLoggedIn: false,
            isExcAllowedJurisdictionThrottleActive: true,
            isXSell: false,
            dispatchSwitchProductPreferenceAction,
          });
        });

        it("should fallback to isXSell prop value and call switch action", async () => {
          expect(dispatchSwitchProductPreferenceAction).toHaveBeenCalledWith(ProductsOption.sportsbook);
        });

        it("should call Bottom Bar with hasOnboardingLabel as true", () => {
          expect(BottomBarComponent).toHaveBeenCalledWith(
            expect.objectContaining({
              hasOnboardingLabel: true,
            }),
            undefined,
          );
        });
      });
    });

    describe("when shouldShowXSellToPredicts is true", () => {
      it("should call dispatchOpenPredicts when onProductSwitch is fired", async () => {
        const dispatchSwitchProductPreferenceAction = jest.fn();
        const dispatchOpenPredicts = jest.fn();
        renderBottomBar({
          productSwitcherConfig: {
            title: "Predicts",
            productPreference: ProductsOption.sportsbook,
            isProductSwitcherAvailable: { native: true },
            showOnboardingNewLabel: false,
            isLoggedIn: false,
            isExcAllowedJurisdictionThrottleActive: false,
            shouldShowXSellToPredicts: true,
            isXSell: true,
          },
          dispatchSwitchProductPreferenceAction,
          dispatchOpenPredicts,
        });

        await act(async () => {
          const lastCall = BottomBarComponent.mock.calls.length - 1;
          const { onProductSwitch } = BottomBarComponent.mock.calls[lastCall][0];
          await onProductSwitch();
        });

        expect(dispatchOpenPredicts).toHaveBeenCalledTimes(1);
        expect(navigationRef.current.navigate).toHaveBeenCalledWith("PredictsScreen", {});
        expect(dispatchSwitchProductPreferenceAction).not.toHaveBeenCalled();
        expect(navigate).not.toHaveBeenCalledWith(expect.objectContaining({ viewUrn: "ppb:tbd:view:external" }));
      });

      it("should not call dispatchOpenPredicts when shouldShowXSellToPredicts is false", async () => {
        const dispatchOpenPredicts = jest.fn();
        renderBottomBar({
          productSwitcherConfig: {
            title: "Exchange",
            productPreference: ProductsOption.sportsbook,
            isProductSwitcherAvailable: { native: true },
            showOnboardingNewLabel: false,
            isLoggedIn: true,
            isExcAllowedJurisdictionThrottleActive: false,
            shouldShowXSellToPredicts: false,
            isXSell: true,
          },
          dispatchOpenPredicts,
        });

        await act(async () => {
          const lastCall = BottomBarComponent.mock.calls.length - 1;
          const { onProductSwitch } = BottomBarComponent.mock.calls[lastCall][0];
          await onProductSwitch();
        });

        expect(dispatchOpenPredicts).not.toHaveBeenCalled();
        expect(navigationRef.current.navigate).not.toHaveBeenCalledWith("PredictsScreen");
      });
    });

    describe("on component update", () => {
      describe("when user is logged out", () => {
        it("should not call setCookie even if throttle is active", () => {
          renderBottomBar({
            productSwitcherConfig: {
              isLoggedIn: false,
              isExcAllowedJurisdictionThrottleActive: true,
            },
          });

          expect(setCookie).not.toHaveBeenCalled();
        });
      });

      describe("when user is logged in", () => {
        describe("and phoenix is available", () => {
          describe("and isXSell is false", () => {
            it("should set PHOENIX_ENABLED cookie to 'true'", async () => {
              renderBottomBar({
                productSwitcherConfig: {
                  isLoggedIn: true,
                  isExcAllowedJurisdictionThrottleActive: true,
                  isXSell: false,
                },
              });
              await waitFor(() => {
                expect(setCookie).toHaveBeenCalledWith(CookieNames.PHOENIX_ENABLED, "true");
              });
            });
          });

          describe("and isXSell is true", () => {
            it("should set PHOENIX_ENABLED cookie to 'false'", async () => {
              renderBottomBar({
                productSwitcherConfig: {
                  isLoggedIn: true,
                  isExcAllowedJurisdictionThrottleActive: true,
                  isXSell: true,
                },
              });
              await waitFor(() => {
                expect(setCookie).toHaveBeenCalledWith(CookieNames.PHOENIX_ENABLED, "false");
              });
            });
          });
        });

        describe("and phoenix is not available", () => {
          it("should not set the PHOENIX_ENABLED cookie", async () => {
            renderBottomBar({
              productSwitcherConfig: {
                isLoggedIn: true,
                isExcAllowedJurisdictionThrottleActive: false,
                isXSell: false,
              },
            });
            await waitFor(() => {
              expect(setCookie).not.toHaveBeenCalled();
            });
          });
        });
      });
    });

    describe("when the BottomBar component unmounts", () => {
      it("should remove deep linking event listeners", () => {
        const { unmount } = renderBottomBar();

        act(() => {
          unmount();
        });

        expect(removeDeepLinkingEventListeners).toHaveBeenCalled();
      });
    });

    describe("when the selected index is -1", () => {
      it("should call BottomBarComponent with index equal to 0", () => {
        const PROPS = {
          selectedIndex: -1,
        };

        renderBottomBar(PROPS);

        expect(BottomBarComponent).toHaveBeenCalledWith(
          {
            productSwitcherTitle: "title",
            hasProductSwitcher: true,
            isVisible: true,
            items: [
              {
                isExternalNavigation: false,
                screen: "HomeNavigatorReactElement",
                tileType: "HOME",
                title: "Home",
                viewLink: {
                  viewUrn: "ppb:tbd:view:sport:1",
                },
              },
              {
                isExternalNavigation: false,
                screen: "GamingNavigatorReactElement",
                tileType: "GAMING",
                title: "casino",
                viewLink: {
                  viewUrn: "ppb:tbd:view:gaming:1",
                },
              },
            ],
            selectedIndex: 0,
            skipAnimation: false,
            onTilePress: expect.any(Function),
            onProductSwitch: expect.any(Function),
            checkForGamesTriggeringPopup: expect.any(Function),
            hasOnboardingLabel: false,
          },
          undefined,
        );
      });
    });
  });

  describe("when the items are empty", () => {
    it("should not render BottomBar component", () => {
      renderBottomBar({ items: [] });

      expect(BottomBarComponent).not.toHaveBeenCalled();
    });

    it("should not initialize deep linking", () => {
      renderBottomBar({ items: [] });

      expect(initDeepLinking).not.toHaveBeenCalled();
    });

    it("should render stateIndicator component", () => {
      const { queryByTestId } = renderBottomBar({ items: [] });

      expect(queryByTestId("state_indicator")).toBeTruthy();
    });
  });
});

describe("BottomBarCreateItemsForNative", () => {
  it("should be a function", () => {
    expect(BottomBarCreateItemsForNative).toStrictEqual(expect.any(Function));
  });

  it("should return a map of items according to each input item view URN", () => {
    const input = [
      {
        tileType: "HOME",
        viewLink: { viewUrn: "ppb:tbd:view:generic:home" },
        title: "Home",
      },
      {
        tileType: "BROWSE",
        viewLink: { viewUrn: "ppb:tbd:view:browse:sports" },
        title: "Browse",
      },
      {
        tileType: "MY_BETS",
        viewLink: { viewUrn: "ppb:tbd:view:myBets:open" },
        title: "Minhas apostas",
      },
      {
        tileType: "GAMING",
        viewLink: { viewUrn: "ppb:tbd:view:gaming:1" },
        title: "casino",
      },
      {
        tileType: "GAMING_EXTERNAL",
        viewLink: { viewUrn: "ppb:tbd:view:external:external" },
        title: "External Casino",
      },
    ];
    const expected = [
      {
        screen: "HomeNavigatorReactElement",
        tileType: "HOME",
        viewLink: { viewUrn: "ppb:tbd:view:generic:home" },
        title: "Home",
        isExternalNavigation: false,
      },
      {
        screen: "BrowseNavigatorReactElement",
        tileType: "BROWSE",
        viewLink: { viewUrn: "ppb:tbd:view:browse:sports" },
        title: "Browse",
        isExternalNavigation: false,
      },
      {
        screen: "MyBetsNavigatorReactElement",
        tileType: "MY_BETS",
        viewLink: { viewUrn: "ppb:tbd:view:myBets:open" },
        title: "Minhas apostas",
        isExternalNavigation: false,
      },
      {
        screen: "GamingNavigatorReactElement",
        tileType: "GAMING",
        viewLink: { viewUrn: "ppb:tbd:view:gaming:1" },
        title: "casino",
        isExternalNavigation: false,
      },
      {
        screen: "HomeNavigatorReactElement",
        tileType: "GAMING_EXTERNAL",
        title: "External Casino",
        viewLink: {
          viewUrn: "ppb:tbd:view:external:external",
        },
        isExternalNavigation: true,
      },
    ];
    expect(BottomBarCreateItemsForNative(input)).toEqual(expected);
  });

  it("should return a BrowseSwitchNavigator if tile is BROWSE and include throttle for BROWSE_PAGE_PRISMIC", () => {
    const input = [
      {
        tileType: "BROWSE",
        viewLink: { viewUrn: "ppb:tbd:view:browse:sports" },
        title: "Browse",
        throttles: { isBrowsePagePrismic: true },
      },
    ];
    const expected = [
      {
        screen: "BrowseSwitchNavigatorReactElement",
        tileType: "BROWSE",
        viewLink: { viewUrn: "ppb:tbd:view:browse:sports" },
        title: "Browse",
        isExternalNavigation: false,
        throttles: { isBrowsePagePrismic: true },
      },
    ];
    expect(BottomBarCreateItemsForNative(input)).toEqual(expected);
  });
});
