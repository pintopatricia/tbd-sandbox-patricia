import { Linking } from "react-native";
// eslint-disable-next-line import/no-named-as-default
import InAppBrowser from "react-native-inappbrowser-reborn";
import { useScrollToTop as scrollToTop } from "@react-navigation/native";

import { DisplayMode } from "@ppb/tbd-store/state/layout/views/ViewLink.types";
import { codecs, EntityType, getEntityType } from "@ppb/tbd-urn-codecs";

import {
  navigationRef,
  navigate,
  goBack,
  resetNavigationStack,
  navigateWithThirdPartyScreenName,
  ScreenName,
  navigateMyAccount,
  navigateMaintenanceScreen,
  useScrollToTop,
  NativeEntityTypes,
  navigateDeposit,
} from "./router";

jest.mock("@ppb/tbd-urn-codecs", () => ({
  ...jest.requireActual("@ppb/tbd-urn-codecs"),
  codecs: {
    myAccountView: {
      isValid: jest.fn(),
    },
    parse: jest.fn(),
  },
  getEntityType: jest.fn(),
}));

jest.mock("react-native-inappbrowser-reborn", () => ({
  open: jest.fn(),
}));

console.log = jest.fn();

jest.mock("react-native", () => ({
  Platform: { OS: "ios" },
  Linking: {
    openURL: jest.fn(),
    canOpenURL: jest.fn(() => ({
      then: (fn) => {
        fn(true);
        return {
          catch: (efn) => {
            efn("error with openingurl");
          },
        };
      },
    })),
  },
}));

jest.mock("@react-navigation/native", () => ({
  createNavigationContainerRef: jest.fn(() => ({
    navigate: jest.fn(),
    reset: jest.fn(),
    goBack: jest.fn(),
    dispatch: jest.fn(),
    getCurrentRoute: jest.fn(),
    getRootState: jest.fn(),
    getCurrentOptions: jest.fn(),
    isReady: jest.fn(() => true),
    canGoBack: jest.fn(() => true),
  })),
  useScrollToTop: jest.fn(),
}));

const EXTERNAL_URL = "https://www.google.com";
const EXTERNAL_URN = {
  type: "ppb:tbd:view:external",
  uid: "ppb:tbd:view:external:1",
};

const GENERIC_EXTERNAL_CARD_URN = {
  type: "ppb:tbd:card:genericViewLink:external",
  uid: "ppb:tbd:card:genericViewLink:external",
};

const SPORT_URN = {
  type: "ppb:tbd:view:sport",
  uid: "ppb:tbd:view:sport:1",
};

const VIEW_LINK_MOCK = {
  viewUrn: SPORT_URN.uid,
};

const MY_ACCOUNT_VIEW_LINK_MOCK = {
  viewUrn: "ppb:tbd:view:myAccountView:aHR0cHM6Ly9wcm9tb3MuYmV0ZmFpci5jb20vc3BvcnQ",
  viewUrl: "minha-conta/a-aHR0cHM6Ly9wcm9tb3MuYmV0ZmFpci5jb20vc3BvcnQ",
};

const EXTERNAL_VIEW_LINK_MOCK = {
  viewUrl: EXTERNAL_URL,
  viewUrn: EXTERNAL_URN.type,
};

const EXTERNAL_WEB_VIEW_LINK_MOCK = {
  ...EXTERNAL_VIEW_LINK_MOCK,
  viewDisplayMode: DisplayMode.BlankWebview,
};

const EXTERNAL_IN_APP_LINK_MOCK = {
  ...EXTERNAL_VIEW_LINK_MOCK,
  viewDisplayMode: DisplayMode.BlankInapp,
};

const EXTERNAL_BROWSER_MOCK = {
  ...EXTERNAL_VIEW_LINK_MOCK,
  viewDisplayMode: DisplayMode.BlankBrowser,
};

const EXTERNAL_INVALID_LINK_MOCK = {
  viewUrl: "",
  viewUrn: EXTERNAL_URN.type,
};

const GENERIC_EXTERNAL_CARD_LINK_MOCK = {
  viewUrl: EXTERNAL_URL,
  viewUrn: GENERIC_EXTERNAL_CARD_URN.type,
};

const GENERIC_EXTERNAL_CARD_VIEW_LINK_MOCK = {
  ...GENERIC_EXTERNAL_CARD_LINK_MOCK,
  viewDisplayMode: DisplayMode.BlankWebview,
};

const GENERIC_EXTERNAL_CARD_IN_APP_LINK_MOCK = {
  ...GENERIC_EXTERNAL_CARD_LINK_MOCK,
  viewDisplayMode: DisplayMode.BlankInapp,
};

const GENERIC_EXTERNAL_CARD_BROWSER_MOCK = {
  ...GENERIC_EXTERNAL_CARD_LINK_MOCK,
  viewDisplayMode: DisplayMode.BlankBrowser,
};

const GENERIC_EXTERNAL_CARD_INVALID_LINK_MOCK = {
  viewUrl: "",
  viewUrn: EXTERNAL_URN.type,
};

const CET_SCREEN = ScreenName.CetStackNavigator;

const PARAMS_MOCKS = {
  screen: "SomeScreen",
};

describe("RouterService", () => {
  beforeAll(() => {
    global.requestAnimationFrame = (cb) => cb();

    global.__DEV__ = true;
  });

  beforeEach(jest.clearAllMocks);

  describe("when navigating forward", () => {
    describe("and is an internal urn", () => {
      describe("and the current Screen is MyAccount", () => {
        beforeEach(() => {
          navigationRef.getCurrentRoute.mockReturnValueOnce({ name: ScreenName.CetMyAccountScreen });
          getEntityType.mockReturnValue(EntityType.MyBetsView);
          navigate({
            viewUrn: EntityType.MyBetsView,
            isDeepLink: true,
          });
        });

        it("should call reset with correct parameters", () => {
          expect(navigationRef.reset).toHaveBeenCalledTimes(1);
          expect(navigationRef.reset).toHaveBeenCalledWith({
            routes: [
              {
                name: NativeEntityTypes.BottomBar,
                state: {
                  index: 0,
                  routes: [
                    {
                      name: "MY_BETS",
                      state: {
                        routes: [
                          {
                            name: EntityType.MyBetsView,
                            params: {
                              viewLink: {
                                viewUrn: EntityType.MyBetsView,
                                isDeepLink: true,
                              },
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          });
        });
      });

      describe("and is a deep link for a non root view", () => {
        describe.each([
          [EntityType.GamingCategoryView, "GAMING"],
          [EntityType.GamingSegmentationView, "GAMING"],
          [EntityType.GameView, "GAMING"],
          [EntityType.BrowseView, "BROWSE"],
          [EntityType.CompetitionView, "HOME"],
        ])("and the tab name is resolved with `%s` to `%s`", (entityType, tabName) => {
          beforeEach(() => {
            getEntityType.mockReturnValue(entityType);
            navigate({
              viewUrn: entityType,
              isDeepLink: true,
            });
          });

          it("should call navigate with correct parameters", () => {
            expect(navigationRef.navigate).toHaveBeenCalledTimes(1);
            expect(navigationRef.navigate).toHaveBeenCalledWith(tabName, {
              params: { viewLink: { viewUrn: entityType, isDeepLink: true } },
              screen: entityType,
            });
          });
        });
      });

      describe("and is a deep link for a root view", () => {
        describe.each([
          [EntityType.GamingView, "GAMING"],
          [NativeEntityTypes.Home, "HOME"],
          [EntityType.MyBetsView, "MY_BETS"],
        ])("and the tab name is resolved with `%s` to `%s`", (entityType, tabName) => {
          beforeEach(() => {
            getEntityType.mockReturnValue(entityType);
            navigate({
              viewUrn: entityType,
              isDeepLink: true,
            });
          });

          it("should call reset with correct parameters", () => {
            expect(navigationRef.reset).toHaveBeenCalledTimes(1);
            expect(navigationRef.reset).toHaveBeenCalledWith({
              index: 0,
              routes: [
                {
                  name: tabName,
                  state: {
                    routes: [
                      {
                        name: entityType,
                        params: {
                          viewLink: {
                            viewUrn: entityType,
                            isDeepLink: true,
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            });
          });
        });
      });

      describe("and is a deep link for a root view with viewUrl", () => {
        describe.each([
          [EntityType.GamingView, "GAMING"],
          [NativeEntityTypes.Home, "HOME"],
          [EntityType.MyBetsView, "MY_BETS"],
        ])("and the tab name is resolved with `%s` to `%s`", (entityType, tabName) => {
          beforeEach(() => {
            getEntityType.mockReturnValue(entityType);
            navigate({
              viewUrl: "viewUrlMock",
              viewUrn: entityType,
              isDeepLink: true,
            });
          });

          it("should call navigate with correct parameters", () => {
            expect(navigationRef.navigate).toHaveBeenCalledTimes(1);
            expect(navigationRef.navigate).toHaveBeenCalledWith(tabName, {
              params: {
                viewLink: {
                  isDeepLink: true,
                  viewUrl: "viewUrlMock",
                  viewUrn: entityType,
                },
              },
              screen: entityType,
            });
          });
        });
      });

      describe("and is a deep link for a root view with viewUrl set as '/'", () => {
        describe.each([
          [EntityType.GamingView, "GAMING"],
          [NativeEntityTypes.Home, "HOME"],
          [EntityType.MyBetsView, "MY_BETS"],
        ])("and the tab name is resolved with `%s` to `%s`", (entityType, tabName) => {
          beforeEach(() => {
            getEntityType.mockReturnValue(entityType);
            navigate({
              viewUrl: "/",
              viewUrn: entityType,
              isDeepLink: true,
            });
          });

          it("should call reset with correct parameters", () => {
            expect(navigationRef.reset).toHaveBeenCalledTimes(1);
            expect(navigationRef.reset).toHaveBeenCalledWith({
              index: 0,
              routes: [
                {
                  name: tabName,
                  state: {
                    routes: [
                      {
                        name: entityType,
                        params: {
                          viewLink: {
                            viewUrl: "/",
                            viewUrn: entityType,
                            isDeepLink: true,
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            });
          });
        });
      });

      describe("and is a deeplink with a viewUrl without query params", () => {
        beforeEach(() => {
          getEntityType.mockReturnValue(EntityType.SportView);
          navigate({
            viewUrn: EntityType.SportView,
            viewUrl: "https://www.betfair.com/betting",
            isDeepLink: true,
          });
        });

        it("should call navigate with correct parameters", () => {
          expect(navigationRef.navigate).toHaveBeenCalledTimes(1);
          expect(navigationRef.navigate).toHaveBeenCalledWith("HOME", {
            params: {
              viewLink: {
                viewUrn: EntityType.SportView,
                viewUrl: "https://www.betfair.com/betting",
                isDeepLink: true,
              },
            },
            screen: EntityType.SportView,
          });
        });
      });

      describe("and is a deeplink with a viewUrl without blacklisted query params", () => {
        beforeEach(() => {
          getEntityType.mockReturnValue(EntityType.SportView);
          navigate({
            viewUrn: EntityType.SportView,
            viewUrl: "https://www.betfair.com/betting?a=b",
            isDeepLink: true,
          });
        });

        it("should call navigate with correct parameters", () => {
          expect(navigationRef.navigate).toHaveBeenCalledTimes(1);
          expect(navigationRef.navigate).toHaveBeenCalledWith("HOME", {
            params: {
              viewLink: {
                viewUrn: EntityType.SportView,
                viewUrl: "https://www.betfair.com/betting?a=b",
                isDeepLink: true,
              },
            },
            screen: EntityType.SportView,
          });
        });
      });

      describe("and is a deeplink to betslip", () => {
        beforeEach(() => {
          getEntityType.mockReturnValue(EntityType.SportView);
        });

        describe("and only has the 'bets' query param", () => {
          beforeEach(() => {
            navigate({
              viewUrn: EntityType.SportView,
              viewUrl: "https://www.betfair.com/betting?bets=1234",
              isDeepLink: true,
            });
          });

          it("should call navigate the first time with query params", () => {
            expect(navigationRef.navigate).toHaveBeenCalledTimes(2);
            expect(navigationRef.navigate).toHaveBeenNthCalledWith(1, "HOME", {
              params: {
                viewLink: {
                  viewUrn: EntityType.SportView,
                  viewUrl: "https://www.betfair.com/betting?bets=1234",
                  isDeepLink: true,
                },
              },
              screen: EntityType.SportView,
            });
          });

          it("should call navigate the second time without query params and isDeepLink false", () => {
            expect(navigationRef.navigate).toHaveBeenNthCalledWith(2, "HOME", {
              params: {
                viewLink: {
                  viewUrn: EntityType.SportView,
                  viewUrl: "https://www.betfair.com/betting",
                  isDeepLink: false,
                },
              },
              screen: EntityType.SportView,
            });
          });
        });

        describe("and has more than one query param", () => {
          beforeEach(() => {
            navigate({
              viewUrn: EntityType.SportView,
              viewUrl: "https://www.betfair.com/betting?bets=1234&a=b",
              isDeepLink: true,
            });
          });

          it("should call navigate the first time with query params", () => {
            expect(navigationRef.navigate).toHaveBeenCalledTimes(2);
            expect(navigationRef.navigate).toHaveBeenNthCalledWith(1, "HOME", {
              params: {
                viewLink: {
                  viewUrn: EntityType.SportView,
                  viewUrl: "https://www.betfair.com/betting?bets=1234&a=b",
                  isDeepLink: true,
                },
              },
              screen: EntityType.SportView,
            });
          });

          it("should call navigate the second time without 'bets' query param and isDeepLink false", () => {
            expect(navigationRef.navigate).toHaveBeenNthCalledWith(2, "HOME", {
              params: {
                viewLink: {
                  viewUrn: EntityType.SportView,
                  viewUrl: "https://www.betfair.com/betting?a=b",
                  isDeepLink: false,
                },
              },
              screen: EntityType.SportView,
            });
          });
        });
      });

      describe("and is a deeplink to betslip for a not resolved tab (p.e. statistics)", () => {
        beforeEach(() => {
          getEntityType.mockReturnValue(EntityType.StatisticsView);
          navigate({
            viewUrn: EntityType.StatisticsView,
            viewUrl: "https://www.betfair.com/betting?bets=1234",
            isDeepLink: true,
          });
        });

        it("should call navigate with correct parameters and default tab", () => {
          expect(navigationRef.navigate).toHaveBeenCalledTimes(2);
          expect(navigationRef.navigate).toHaveBeenNthCalledWith(1, EntityType.StatisticsView, {
            viewLink: {
              viewUrn: EntityType.StatisticsView,
              viewUrl: "https://www.betfair.com/betting?bets=1234",
              isDeepLink: true,
            },
          });
          expect(navigationRef.navigate).toHaveBeenNthCalledWith(2, "HOME", {
            params: {
              viewLink: {
                viewUrn: EntityType.StatisticsView,
                viewUrl: "https://www.betfair.com/betting",
                isDeepLink: false,
              },
            },
            screen: EntityType.StatisticsView,
          });
        });
      });

      describe("and is a deeplink to settings", () => {
        beforeEach(() => {
          getEntityType.mockReturnValue(EntityType.SettingsView);
          navigate({
            viewUrn: EntityType.SettingsView,
            isDeepLink: true,
          });
        });

        it("should call navigate with correct parameters", () => {
          expect(navigationRef.navigate).toHaveBeenCalledTimes(1);
          expect(navigationRef.navigate).toHaveBeenCalledWith(EntityType.SettingsView, {
            viewLink: { viewUrn: EntityType.SettingsView, isDeepLink: true },
          });
        });
      });

      describe("and is not a deep link", () => {
        beforeEach(() => {
          getEntityType.mockReturnValue(SPORT_URN.type);
          navigate({
            viewUrn: "ppb:tbd:view:sport:1",
            isDeepLink: false,
          });
        });

        it("should call navigate with correct parameters", () => {
          expect(navigationRef.navigate).toHaveBeenCalledWith("HOME", {
            params: {
              viewLink: { ...VIEW_LINK_MOCK, isDeepLink: false },
            },
            screen: SPORT_URN.type,
          });
        });

        describe("and is a navigation to browse", () => {
          const viewUrnMock = "ppb:tbd:view:browse:sports";

          beforeEach(() => {
            getEntityType.mockReturnValue(EntityType.BrowseView);
            navigate({
              viewUrn: viewUrnMock,
              isDeepLink: false,
            });
          });

          it("should call navigate with correct parameters", () => {
            expect(navigationRef.navigate).toHaveBeenCalledWith("BROWSE", {
              params: { viewLink: { viewUrn: viewUrnMock, isDeepLink: false } },
              screen: EntityType.BrowseView,
            });
          });
        });

        describe("and is a navigation to my bets", () => {
          const viewUrnMock = "ppb:tbd:view:myBets:sbk/open";

          beforeEach(() => {
            getEntityType.mockReturnValue(EntityType.MyBetsView);
            navigate({
              viewUrn: viewUrnMock,
              isDeepLink: false,
            });
          });

          it("should call reset with correct parameters", () => {
            expect(navigationRef.reset).toHaveBeenCalledWith({
              index: 0,
              routes: [
                {
                  name: "MY_BETS",
                  state: {
                    routes: [
                      {
                        name: EntityType.MyBetsView,
                        params: {
                          viewLink: {
                            viewUrn: viewUrnMock,
                            isDeepLink: false,
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            });
          });
        });

        describe("and is a navigation to casino", () => {
          const viewUrnMock = "ppb:tbd:view:gaming:1";

          beforeEach(() => {
            getEntityType.mockReturnValue(EntityType.GamingView);
            navigate({
              viewUrn: viewUrnMock,
              isDeepLink: false,
            });
          });

          it("should call reset with correct parameters", () => {
            expect(navigationRef.reset).toHaveBeenCalledWith({
              index: 0,
              routes: [
                {
                  name: "GAMING",
                  state: {
                    routes: [
                      {
                        name: EntityType.GamingView,
                        params: {
                          viewLink: {
                            viewUrn: viewUrnMock,
                            isDeepLink: false,
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            });
          });
        });

        describe("and is a navigation to home", () => {
          const viewUrnMock = "ppb:tbd:view:generic:home";

          beforeEach(() => {
            getEntityType.mockReturnValue(NativeEntityTypes.Home);
            navigate({
              viewUrn: viewUrnMock,
              isDeepLink: false,
            });
          });

          it("should call reset with correct parameters", () => {
            expect(navigationRef.reset).toHaveBeenCalledWith({
              index: 0,
              routes: [
                {
                  name: "HOME",
                  state: {
                    routes: [
                      {
                        name: viewUrnMock,
                        params: {
                          viewLink: {
                            viewUrn: viewUrnMock,
                            isDeepLink: false,
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            });
          });
        });
      });
    });

    describe("and is an external urn", () => {
      describe("and is an external view type", () => {
        beforeEach(() => {
          getEntityType.mockReturnValue(EXTERNAL_URN.type);
        });

        describe("and the viewUrl is missing", () => {
          beforeEach(() => {
            navigate(EXTERNAL_INVALID_LINK_MOCK);
          });
          it("should log invalid viewUrl", () => {
            expect(console.log).toHaveBeenLastCalledWith("Invalid `viewUrl`", "");
          });
        });

        describe("and the viewDisplayMode is WebView", () => {
          beforeEach(() => {
            navigate(EXTERNAL_WEB_VIEW_LINK_MOCK);
          });

          it("should navigate using NavigationContainerRef without dispatch the push action", () => {
            expect(navigationRef.navigate).toHaveBeenCalledWith(EntityType.ExternalView, {
              viewLink: EXTERNAL_WEB_VIEW_LINK_MOCK,
            });
          });
        });

        describe("and the viewDisplayMode is InApp", () => {
          beforeEach(() => {
            InAppBrowser.open.mockResolvedValue(EXTERNAL_IN_APP_LINK_MOCK.viewUrl);
            navigate(EXTERNAL_IN_APP_LINK_MOCK);
          });

          it("should navigate using InAppBrowser.open with proper options and log success", () => {
            expect(InAppBrowser.open).toHaveBeenCalledWith(EXTERNAL_URL);
          });
        });

        describe("and the viewDisplayMode is something else", () => {
          describe("and the link is valid", () => {
            beforeEach(() => {
              navigate(EXTERNAL_BROWSER_MOCK);
            });

            it("should call Linking.openURL", () => {
              expect(Linking.openURL).toHaveBeenCalledWith(EXTERNAL_BROWSER_MOCK.viewUrl);
            });
          });

          describe("and the link is valid but cannot be open", () => {
            beforeEach(() => {
              Linking.canOpenURL.mockImplementationOnce(
                jest.fn(() => ({
                  then: (canOpenResult) => {
                    canOpenResult(false);
                    return {
                      catch: (efn) => {
                        efn("error with openingurl");
                      },
                    };
                  },
                })),
              );
            });

            describe("when fallbackViewUrl does not exist", () => {
              beforeEach(() => {
                navigate(EXTERNAL_BROWSER_MOCK);
              });

              it("should not call Linking.openURL", () => {
                expect(Linking.openURL).not.toHaveBeenCalled();
              });
            });

            describe("when fallbackViewUrl exists", () => {
              beforeEach(() => {
                navigate({ ...EXTERNAL_BROWSER_MOCK, fallbackViewUrl: "https://save.the.day" });
              });

              it("should call Linking.openURL with fallbackViewUrl", () => {
                expect(Linking.openURL).toHaveBeenCalledWith("https://save.the.day");
              });
            });
          });
        });
      });
      describe("and is an external view card type", () => {
        beforeEach(() => {
          getEntityType.mockReturnValue(EXTERNAL_URN.type);
        });

        describe("and the viewUrl is missing", () => {
          beforeEach(() => {
            navigate(GENERIC_EXTERNAL_CARD_INVALID_LINK_MOCK);
          });

          it("should log invalid viewUrl", () => {
            expect(console.log).toHaveBeenLastCalledWith("Invalid `viewUrl`", "");
          });
        });

        describe("and the viewDisplayMode is WebView", () => {
          beforeEach(() => {
            navigate(GENERIC_EXTERNAL_CARD_VIEW_LINK_MOCK);
          });

          it("should navigate using NavigationContainerRef without dispatch the push action", () => {
            expect(navigationRef.navigate).toHaveBeenCalledWith(EntityType.ExternalView, {
              viewLink: GENERIC_EXTERNAL_CARD_VIEW_LINK_MOCK,
            });
          });
        });

        describe("and the viewDisplayMode is InApp", () => {
          beforeEach(() => {
            InAppBrowser.open.mockResolvedValue(GENERIC_EXTERNAL_CARD_IN_APP_LINK_MOCK.viewUrl);
            navigate(GENERIC_EXTERNAL_CARD_IN_APP_LINK_MOCK);
          });

          it("should navigate using InAppBrowser.open with proper options and log success", () => {
            expect(InAppBrowser.open).toHaveBeenCalledWith(EXTERNAL_URL);
          });
        });

        describe("and the viewDisplayMode is something else", () => {
          describe("and the link is valid", () => {
            beforeEach(() => {
              navigate(GENERIC_EXTERNAL_CARD_BROWSER_MOCK);
            });

            it("should call Linking.openURL", () => {
              expect(Linking.openURL).toHaveBeenCalledWith(GENERIC_EXTERNAL_CARD_BROWSER_MOCK.viewUrl);
            });
          });

          describe("and the link is valid but cannot be open", () => {
            beforeEach(() => {
              Linking.canOpenURL.mockImplementationOnce(
                jest.fn(() => ({
                  then: (canOpenResult) => {
                    canOpenResult(false);
                    return {
                      catch: (efn) => {
                        efn("error with openingurl");
                      },
                    };
                  },
                })),
              );
            });

            describe("when fallbackViewUrl does not exist", () => {
              beforeEach(() => {
                navigate(GENERIC_EXTERNAL_CARD_BROWSER_MOCK);
              });

              it("should not call Linking.openURL", () => {
                expect(Linking.openURL).not.toHaveBeenCalled();
              });
            });

            describe("when fallbackViewUrl exists", () => {
              beforeEach(() => {
                navigate({
                  ...GENERIC_EXTERNAL_CARD_BROWSER_MOCK,
                  fallbackViewUrl: "https://save.the.day",
                });
              });

              it("should call Linking.openURL with fallbackViewUrl", () => {
                expect(Linking.openURL).toHaveBeenCalledWith("https://save.the.day");
              });
            });
          });
        });
      });
    });

    describe("and is a my account view link", () => {
      beforeEach(() => {
        getEntityType.mockReturnValue();
        codecs.parse.mockReturnValue({
          referenceId: "aHR0cHM6Ly9wcm9tb3MuYmV0ZmFpci5jb20vc3BvcnQ",
          type: "ppb:tbd:view:myAccountView",
          uid: "ppb:tbd:view:myAccountView:aHR0cHM6Ly9wcm9tb3MuYmV0ZmFpci5jb20vc3BvcnQ",
        });
        codecs.myAccountView.isValid.mockReturnValue(true);
        navigate(MY_ACCOUNT_VIEW_LINK_MOCK, "PROMOTIONS");
      });

      it("should navigate correctly", () => {
        expect(navigationRef.navigate).toHaveBeenCalledWith(ScreenName.CetStackNavigator, {
          screen: ScreenName.CetWebViewScreen,
          params: {
            hideBalances: false,
            isBiometricSupported: true,
            link: {
              linkName: "PROMOTIONS",
              url: "https://promos.betfair.com/sport",
            },
            showNativeHeader: true,
            showRegulatoryHeader: false,
          },
        });
      });
    });

    describe("and is a CET screen name", () => {
      it("should navigate to the given screen if navigation is ready", () => {
        navigateWithThirdPartyScreenName(CET_SCREEN, PARAMS_MOCKS);

        expect(navigationRef.navigate).toHaveBeenCalledWith(ScreenName.CetStackNavigator, PARAMS_MOCKS);
      });

      it("should log unable to navigate when navigationRef is not ready", () => {
        navigationRef.isReady = jest.fn(() => false);
        navigateWithThirdPartyScreenName(CET_SCREEN, PARAMS_MOCKS);

        expect(console.log).toHaveBeenLastCalledWith("Unable to navigate as app hasn't finished mounting", "");
      });
    });

    describe("and is a GamingLobbyScreen screen name", () => {
      it("should call reset with the correct params", () => {
        navigationRef.isReady = jest.fn(() => true);
        navigateWithThirdPartyScreenName(ScreenName.GamingLobbyScreen, PARAMS_MOCKS);

        expect(navigationRef.reset).toHaveBeenCalledTimes(1);
        expect(navigationRef.reset).toHaveBeenCalledWith({
          index: 0,
          routes: [
            { name: "GAMING", state: { routes: [{ name: ScreenName.GamingLobbyScreen, params: PARAMS_MOCKS }] } },
          ],
        });
      });
    });

    describe("and urn is NOT valid", () => {
      beforeEach(() => {
        getEntityType.mockReturnValue(undefined);
        codecs.parse.mockReturnValue();
        navigate(VIEW_LINK_MOCK);
      });

      it("should not call navigate", () => {
        expect(navigationRef.navigate).not.toHaveBeenCalled();
      });
    });

    describe("and when navigation is not ready", () => {
      beforeEach(() => {
        navigationRef.isReady = jest.fn(() => false);
        navigate(VIEW_LINK_MOCK);
      });

      it("should log unable to navigate", () => {
        expect(console.log).toHaveBeenLastCalledWith("Unable to navigate as app hasn't finished mounting", "");
      });
    });
  });

  describe("when navigating backward", () => {
    it("should call goBack", () => {
      goBack();

      expect(navigationRef.goBack).toHaveBeenCalled();
    });

    describe("and when canGoBack is false", () => {
      it("shouldn't call goBack", () => {
        navigationRef.canGoBack = jest.fn(() => false);
        goBack();

        expect(navigationRef.goBack).not.toHaveBeenCalled();
      });
    });
  });

  describe("when navigating to my account", () => {
    it("should navigate correctly", () => {
      navigationRef.isReady = jest.fn(() => true);
      navigateMyAccount();

      expect(navigationRef.navigate).toHaveBeenCalledWith(ScreenName.CetStackNavigator, {
        screen: ScreenName.CetMyAccountScreen,
      });
    });
  });

  describe("when navigating to deposit", () => {
    it("should navigate using the CetDepositScreen with url", () => {
      navigateDeposit("http://test.test/x");

      expect(navigationRef.navigate).toHaveBeenCalledWith(ScreenName.CetStackNavigator, {
        screen: ScreenName.CetDepositScreen,
        params: {
          link: {
            url: "http://test.test/x",
          },
        },
      });
    });
  });

  describe("when navigating to a Full Splash Maintenance Screen", () => {
    describe("when current options represents a modal screen", () => {
      beforeEach(() => {
        navigationRef.getCurrentOptions.mockReturnValue({
          presentation: "modal",
        });
        navigationRef.canGoBack.mockReturnValue(true);
        navigateMaintenanceScreen(true);
      });

      it("should call goBack", () => {
        expect(navigationRef.goBack).toHaveBeenCalled();
      });

      it("should navigate to the RootMaintenanceScreen", () => {
        expect(navigationRef.navigate).toHaveBeenCalledTimes(1);
        expect(navigationRef.navigate).toHaveBeenCalledWith(ScreenName.RootMaintenanceScreen, {});
      });
    });

    describe("when current options doesn't represent a modal screen", () => {
      beforeEach(() => {
        navigationRef.getCurrentOptions.mockReturnValue({
          presentation: "card",
        });
        navigationRef.canGoBack.mockReturnValue(true);
        navigateMaintenanceScreen(true);
      });

      it("shouldn't call goBack", () => {
        expect(navigationRef.goBack).not.toHaveBeenCalled();
      });

      it("should navigate to the RootMaintenanceScreen", () => {
        expect(navigationRef.navigate).toHaveBeenCalledTimes(1);
        expect(navigationRef.navigate).toHaveBeenCalledWith(ScreenName.RootMaintenanceScreen, {});
      });
    });
  });

  describe("when navigating to a Partial Splash Maintenance Screen", () => {
    it("should navigate to Maintenance View", () => {
      getEntityType.mockReturnValue(EntityType.MaintenanceView);
      navigateMaintenanceScreen(false);

      expect(navigationRef.navigate).toHaveBeenCalledTimes(1);
      expect(navigationRef.navigate).toHaveBeenCalledWith(EntityType.MaintenanceView, {
        viewLink: { viewUrn: `${EntityType.MaintenanceView}:maintenance` },
      });
    });
  });

  describe("when resetting the Navigation Stack", () => {
    describe("when navigation is not ready", () => {
      it("should log unable to reset stack", () => {
        navigationRef.isReady = jest.fn(() => false);
        resetNavigationStack();

        expect(console.log).toHaveBeenLastCalledWith("Unable to reset stack as app hasn't finished mounting", "");
      });
    });

    describe("when navigation is ready", () => {
      it("should call reset with the correct parameters", () => {
        navigationRef.isReady = jest.fn(() => true);
        resetNavigationStack();

        expect(navigationRef.reset).toHaveBeenCalledWith({
          index: 0,
          routes: [{ name: NativeEntityTypes.BottomBar }],
        });
      });
    });
  });

  describe("useScrollToTop", () => {
    it("should call scrollToTop with correct params", () => {
      useScrollToTop("mockedRef");

      expect(scrollToTop).toHaveBeenCalledWith("mockedRef");
    });

    describe("when there is no ref", () => {
      it("should not call scrollToTop", () => {
        useScrollToTop(null);

        expect(scrollToTop).not.toHaveBeenCalled();
      });
    });
  });
});
