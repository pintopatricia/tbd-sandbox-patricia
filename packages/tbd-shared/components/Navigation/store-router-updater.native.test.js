import { navigationRef, ScreenName } from "@ppb/tbd-router/native";
import { MY_BETS_RESET_FILTERS } from "@ppb/tbd-store/actions/my-bets";
import { DELETE_VIEW } from "@ppb/tbd-store/actions/catalogue";
import { APOLLO_VIEW_PUSH, PUSH_SAME_VIEW, REFRESH } from "@ppb/tbd-store/actions/router";
import { EntityType } from "@ppb/tbd-urn-codecs";
import { QUANTUM_METRIC__SEND_NEW_PAGE_NAMED } from "@ppb/tbd-store/actions/quantum-metric";
import { QUALTRICS__SEND_NEW_PAGE_NAMED } from "@ppb/tbd-store/actions/qualtrics";
import { dispatchRoutePushAction } from "@ppb/tbd-store/helpers/store";
import { close as closeHamburgerMenu } from "@ppb/tbd-store/state/hamburger-menu";
import analytics from "@react-native-firebase/analytics";
import { resetApolloCacheWithAppContext } from "../../apollo-client/client";
import { updateStoreRoute } from "./store-router-updater.native";

const mockedLogScreenViewEvent = jest.fn();

jest.mock("../../apollo-client/client", () => ({
  resetApolloCacheWithAppContext: jest.fn(),
}));

jest.mock("../../cookie-consent/cookie-consent.native", () => ({
  updateOneTrustJavascriptWithinCET: jest.fn(),
}));

jest.mock("@react-native-firebase/analytics", () => () => ({
  logScreenView: mockedLogScreenViewEvent,
}));

jest.mock("@ppb/tbd-store/helpers/store", () => ({
  dispatchRoutePushAction: jest.fn(),
}));

console.log = jest.fn();

jest.mock("@ppb/tbd-urn-codecs", () => ({
  ...jest.requireActual("@ppb/tbd-urn-codecs"),
  getEntityType: jest.fn(),
}));

jest.mock("@react-navigation/native", () => ({}));

jest.mock("@ppb/tbd-router/native", () => ({
  ScreenName: {
    BottomBar: "BottomBar",
    RootMaintenanceScreen: "RootMaintenanceScreen",
  },
  ThirdPartyScreenName: {
    CetMyAccountScreen: "MyAccountScreen",
  },
  NativeEntityTypes: {
    Home: "HomeView",
  },
  navigationRef: {
    current: {
      getCurrentRoute: jest.fn(),
    },
  },
}));

describe("StoreRouterUpdater", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });
  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when updating store", () => {
    const ROUTER_MOCK = {
      currentUrn: "currentUrn",
      currentUrl: "currentUrl",
    };

    const store = {
      dispatch: jest.fn(),
      getState: jest.fn(() => ({
        layouts: {
          cards: {
            mybets: {
              viewUrn: "MY_BETS_CURRENT_URN",
            },
          },
        },
        router: ROUTER_MOCK,
        entities: {
          throttles: {
            RACE_MEETING_VIEW: { isActive: false },
          },
        },
      })),
    };

    describe("and isMounting parameter is false", () => {
      describe("and there's an existing viewUrn", () => {
        describe("and screen name is a MyBetsView", () => {
          describe("and there's no URN in my bets layout", () => {
            it("should dispatch route push action with the latest my bets filters URN", () => {
              const stateWithoutMyBetsUrn = {
                layouts: {
                  cards: {
                    mybets: {
                      viewUrn: undefined,
                    },
                  },
                },
                router: ROUTER_MOCK,
                entities: {
                  throttles: {
                    RACE_MEETING_VIEW: { isActive: false },
                  },
                },
              };
              store.getState.mockReturnValueOnce(stateWithoutMyBetsUrn).mockReturnValueOnce(stateWithoutMyBetsUrn);
              navigationRef.current?.getCurrentRoute.mockReturnValue({
                params: { viewLink: { viewUrn: "viewUrn" } },
                name: EntityType.MyBetsView,
              });
              updateStoreRoute(store);
              expect(dispatchRoutePushAction).toHaveBeenCalledWith(store, "viewUrn");
            });
          });

          describe("and exists an URN in my bets layout", () => {
            it("should dispatch route push action with the latest my bets filters URN", () => {
              navigationRef.current?.getCurrentRoute.mockReturnValue({
                params: { viewLink: { viewUrn: "viewUrn" } },
                name: EntityType.MyBetsView,
              });
              updateStoreRoute(store, false);
              expect(dispatchRoutePushAction).toHaveBeenCalledWith(store, "MY_BETS_CURRENT_URN");
            });

            describe("and navigation is a deepLink", () => {
              beforeEach(() => {
                navigationRef.current?.getCurrentRoute.mockReturnValue({
                  params: { viewLink: { viewUrn: "viewUrn", isDeepLink: true } },
                  name: EntityType.MyBetsView,
                });
                updateStoreRoute(store, false);
              });

              it("should dispatch my bets reset filters action", () => {
                expect(store.dispatch).toHaveBeenCalledWith({
                  type: MY_BETS_RESET_FILTERS,
                });
                expect(store.dispatch).toHaveBeenCalledTimes(1);
              });
              it("should dispatch route push action with the new my bets URN", () => {
                expect(dispatchRoutePushAction).toHaveBeenCalledWith(store, "viewUrn");
              });
            });
          });
        });

        describe("and screen name is not MyBetsView", () => {
          it("should dispatch route push action", () => {
            navigationRef.current?.getCurrentRoute.mockReturnValue({
              params: { viewLink: { viewUrn: "viewUrn", viewUrl: "viewUrl" } },
              name: "AnotherScreen",
            });
            updateStoreRoute(store);
            expect(dispatchRoutePushAction).toHaveBeenCalledWith(store, "viewUrn", "viewUrl");
          });
        });

        describe("and screen name is a PlayerView", () => {
          it("should dispatch an apollo view push action with the viewUrn, viewUrl and PlayerView type", () => {
            navigationRef.current?.getCurrentRoute.mockReturnValue({
              params: { viewLink: { viewUrn: "viewUrn", viewUrl: "viewUrl" } },
              name: EntityType.PlayerView,
            });

            updateStoreRoute(store);

            expect(store.dispatch).toHaveBeenNthCalledWith(1, closeHamburgerMenu());
            expect(store.dispatch).toHaveBeenNthCalledWith(2, {
              type: APOLLO_VIEW_PUSH,
              payload: {
                viewUrn: "viewUrn",
                viewUrl: "viewUrl",
                type: EntityType.PlayerView,
              },
            });
            expect(store.dispatch).toHaveBeenCalledTimes(2);
          });

          describe("and navigation is a deepLink", () => {
            beforeEach(() => {
              navigationRef.current?.getCurrentRoute.mockReturnValue({
                params: { viewLink: { viewUrn: "viewUrn", viewUrl: "viewUrl", isDeepLink: true } },
                name: EntityType.PlayerView,
              });
              updateStoreRoute(store, false);
            });

            it("should dispatch an apollo view push action with the viewUrn, viewUrl and PlayerView type", () => {
              expect(store.dispatch).toHaveBeenNthCalledWith(1, closeHamburgerMenu());
              expect(store.dispatch).toHaveBeenNthCalledWith(2, {
                type: APOLLO_VIEW_PUSH,
                payload: {
                  viewUrn: "viewUrn",
                  viewUrl: "viewUrl",
                  type: EntityType.PlayerView,
                },
              });
              expect(store.dispatch).toHaveBeenCalledTimes(2);
            });
          });
        });

        describe("and screen name is a RaceMeetingView", () => {
          it("should dispatch an apollo view push action with the viewUrn, viewUrl and RaceMeetingView type regardless of the RACE_MEETING_VIEW throttle", () => {
            store.getState.mockReturnValueOnce({
              layouts: { cards: { mybets: { viewUrn: "MY_BETS_CURRENT_URN" } } },
              router: ROUTER_MOCK,
              entities: {
                throttles: {
                  RACE_MEETING_VIEW: { isActive: false },
                },
              },
            });
            navigationRef.current?.getCurrentRoute.mockReturnValue({
              params: { viewLink: { viewUrn: "viewUrn", viewUrl: "viewUrl" } },
              name: EntityType.RaceMeetingView,
            });

            updateStoreRoute(store);

            expect(store.dispatch).toHaveBeenNthCalledWith(1, closeHamburgerMenu());
            expect(store.dispatch).toHaveBeenNthCalledWith(2, {
              type: APOLLO_VIEW_PUSH,
              payload: {
                viewUrn: "viewUrn",
                viewUrl: "viewUrl",
                type: EntityType.RaceMeetingView,
              },
            });
            expect(store.dispatch).toHaveBeenCalledTimes(2);
            expect(dispatchRoutePushAction).not.toHaveBeenCalled();
          });
        });

        describe("and screen name is a RaceView", () => {
          describe("and the RACE_MEETING_VIEW throttle is active", () => {
            it("should dispatch an apollo view push action with the viewUrn, viewUrl and RaceView type", () => {
              store.getState.mockReturnValueOnce({
                layouts: { cards: { mybets: { viewUrn: "MY_BETS_CURRENT_URN" } } },
                router: ROUTER_MOCK,
                entities: {
                  throttles: {
                    RACE_MEETING_VIEW: { isActive: true },
                  },
                },
              });
              navigationRef.current?.getCurrentRoute.mockReturnValue({
                params: { viewLink: { viewUrn: "viewUrn", viewUrl: "viewUrl" } },
                name: EntityType.RaceView,
              });

              updateStoreRoute(store);

              expect(store.dispatch).toHaveBeenCalledWith({
                type: APOLLO_VIEW_PUSH,
                payload: {
                  viewUrn: "viewUrn",
                  viewUrl: "viewUrl",
                  type: EntityType.RaceView,
                },
              });
              expect(dispatchRoutePushAction).not.toHaveBeenCalled();
            });
          });

          describe("and the RACE_MEETING_VIEW throttle is inactive", () => {
            it("should dispatch route push action like a normal view", () => {
              navigationRef.current?.getCurrentRoute.mockReturnValue({
                params: { viewLink: { viewUrn: "viewUrn", viewUrl: "viewUrl" } },
                name: EntityType.RaceView,
              });

              updateStoreRoute(store);

              expect(store.dispatch).not.toHaveBeenCalledWith(expect.objectContaining({ type: APOLLO_VIEW_PUSH }));
              expect(dispatchRoutePushAction).toHaveBeenCalledWith(store, "viewUrn", "viewUrl");
            });
          });
        });

        describe("and the view is the same", () => {
          beforeAll(() => {
            navigationRef.current?.getCurrentRoute.mockReturnValue({
              params: { viewLink: { viewUrn: ROUTER_MOCK.currentUrn, viewUrl: ROUTER_MOCK.currentUrl } },
              name: "AnotherScreen",
            });
            updateStoreRoute(store);
          });

          it("should not dispatch route push action", () => {
            navigationRef.current?.getCurrentRoute.mockReturnValue({
              params: { viewLink: { viewUrn: ROUTER_MOCK.currentUrn, viewUrl: ROUTER_MOCK.currentUrl } },
              name: "AnotherScreen",
            });
            updateStoreRoute(store);
            expect(dispatchRoutePushAction).not.toHaveBeenCalled();
          });

          it("should dispatch same view push action", () => {
            navigationRef.current?.getCurrentRoute.mockReturnValue({
              params: { viewLink: { viewUrn: ROUTER_MOCK.currentUrn, viewUrl: ROUTER_MOCK.currentUrl } },
              name: "AnotherScreen",
            });
            updateStoreRoute(store);
            expect(store.dispatch).toHaveBeenCalledWith({
              type: PUSH_SAME_VIEW,
              payload: {
                viewUrn: "currentUrn",
                viewUrl: "currentUrl",
              },
            });
            expect(store.dispatch).toHaveBeenCalledTimes(1);
          });
        });
      });

      describe("and there's no existing viewUrn", () => {
        it("should log invalid viewUrn", () => {
          navigationRef.current?.getCurrentRoute.mockReturnValue({
            params: { viewLink: {} },
          });
          updateStoreRoute(store, false);
          expect(dispatchRoutePushAction).toHaveBeenCalledTimes(0);
          expect(console.log).toHaveBeenLastCalledWith("updateStoreRoute Invalid `viewUrn`", "");
        });
      });

      describe("and screen name is a CET screen", () => {
        it("should log 'Open CET screen'", () => {
          navigationRef.current?.getCurrentRoute.mockReturnValue({
            name: "MyAccountScreen",
            params: { viewLink: {} },
          });
          updateStoreRoute(store, false);
          expect(dispatchRoutePushAction).toHaveBeenCalledTimes(0);
          expect(console.log).toHaveBeenLastCalledWith("Open CET screen", "");
        });
      });
    });

    describe("When currentRoute name is ExternalView", () => {
      it("should not dispatch route push action", () => {
        navigationRef.current?.getCurrentRoute.mockReturnValue({
          params: { viewLink: { viewUrn: "viewUrn" } },
          name: EntityType.ExternalView,
        });
        updateStoreRoute(store);
        expect(dispatchRoutePushAction).not.toHaveBeenCalled();
      });
    });

    describe("When currentRoute name is GamingExternalView", () => {
      it("should not dispatch route push action", () => {
        navigationRef.current?.getCurrentRoute.mockReturnValue({
          params: { viewLink: { viewUrn: "viewUrn" } },
          name: EntityType.GamingExternalView,
        });
        updateStoreRoute(store);
        expect(dispatchRoutePushAction).not.toHaveBeenCalled();
      });
    });

    describe("when currentRoute viewUrn is defined", () => {
      describe("when currentRoute viewUrn is different from previousRoute viewUrn", () => {
        it("should dispatch QuantumMetricSendNewPageNamedAction", () => {
          navigationRef.current?.getCurrentRoute.mockReturnValue({
            params: { viewLink: { viewUrn: "qm:view:urn" } },
          });
          updateStoreRoute(store);
          expect(store.dispatch).toHaveBeenCalledTimes(1);
          expect(store.dispatch).toHaveBeenCalledWith({
            type: QUANTUM_METRIC__SEND_NEW_PAGE_NAMED,
            payload: {
              pageName: "qm:view:urn",
            },
          });
        });
      });

      describe("when currentRoute viewUrn equals previousRoute viewUrn", () => {
        beforeAll(() => {
          navigationRef.current?.getCurrentRoute.mockReturnValueOnce({
            params: { viewLink: { viewUrn: "qm:previous:view:urn" } },
          });
          updateStoreRoute(store);
        });

        it("should not dispatch QuantumMetricSendNewPageNamedAction", () => {
          navigationRef.current?.getCurrentRoute.mockReturnValueOnce({
            params: { viewLink: { viewUrn: "qm:previous:view:urn" } },
          });
          updateStoreRoute(store);
          expect(store.dispatch).not.toHaveBeenCalledWith({
            type: QUANTUM_METRIC__SEND_NEW_PAGE_NAMED,
            payload: {
              pageName: "qm:previous:view:urn",
            },
          });
        });
      });

      describe("when currentRoute viewUrn equals previousRoute viewUrn and is HomeView", () => {
        beforeAll(() => {
          navigationRef.current?.getCurrentRoute.mockReturnValueOnce({
            params: { viewLink: { viewUrn: "HomeView" } },
          });
          updateStoreRoute(store);
        });

        it("should not dispatch QualtricsSendNewPageNamedAction", () => {
          navigationRef.current?.getCurrentRoute.mockReturnValueOnce({
            params: { viewLink: { viewUrn: "HomeView" } },
          });
          updateStoreRoute(store);
          expect(store.dispatch).not.toHaveBeenCalledWith({
            type: QUALTRICS__SEND_NEW_PAGE_NAMED,
            payload: {
              pageName: "Home",
            },
          });
        });
      });

      describe("when currentRoute viewUrn is different from previousRoute viewUrn and currentRoute viewUrn is equal to Home", () => {
        beforeAll(() => {
          navigationRef.current?.getCurrentRoute.mockReturnValueOnce({
            params: { viewLink: { viewUrn: "Football" } },
          });
          updateStoreRoute(store);
        });

        it("should dispatch QualtricsSendNewPageNamedAction", () => {
          navigationRef.current?.getCurrentRoute.mockReturnValue({
            params: { viewLink: { viewUrn: "HomeView" } },
          });
          updateStoreRoute(store);
          expect(store.dispatch).toHaveBeenCalledTimes(2);
          expect(store.dispatch).toHaveBeenCalledWith({
            type: QUALTRICS__SEND_NEW_PAGE_NAMED,
            payload: {
              pageName: "Home",
            },
          });
        });
      });

      describe("when currentRoute viewUrn is different from previousRoute viewUrn and currentRoute viewUrn is not Home", () => {
        it("should dispatch QualtricsSendNewPageNamedAction", () => {
          navigationRef.current?.getCurrentRoute.mockReturnValue({
            params: { viewLink: { viewUrn: "FootballView" } },
          });
          updateStoreRoute(store);
          expect(store.dispatch).not.toHaveBeenCalledWith({
            type: QUALTRICS__SEND_NEW_PAGE_NAMED,
            payload: {
              pageName: "Home",
            },
          });
        });
      });

      describe("when previousRoute is MaintenanceView and the currentRoute is not MaintenanceView", () => {
        it("should dispatch a delete_view and refresh action with the current urn", () => {
          navigationRef.current?.getCurrentRoute.mockReturnValueOnce({
            name: EntityType.MaintenanceView,
            params: { viewLink: { viewUrn: "maintenance:view:urn" } },
          });
          navigationRef.current?.getCurrentRoute.mockReturnValueOnce({
            name: EntityType.AllMarketsView,
            params: { viewLink: { viewUrn: "current:view:urn" } },
          });

          updateStoreRoute(store); // 1st update - current is MaintenanceView
          updateStoreRoute(store); // 2nd update - current is AllMarketsView, previous is MaintenanceView

          expect(store.dispatch).toHaveBeenCalledTimes(4); // the two 1st ones are quantum metrics actions
          expect(store.dispatch).toHaveBeenNthCalledWith(3, {
            type: DELETE_VIEW,
            payload: "current:view:urn",
          });
          expect(store.dispatch).toHaveBeenNthCalledWith(4, {
            type: REFRESH,
            payload: {
              urn: "current:view:urn",
              shouldRefreshBottomBar: true,
            },
          });
        });
      });

      describe("when previousRoute is RootMaintenanceScreen and the currentRoute is not RootMaintenanceScreen", () => {
        beforeEach(() => {
          navigationRef.current?.getCurrentRoute.mockReturnValueOnce({
            name: ScreenName.RootMaintenanceScreen,
            params: { viewLink: { viewUrn: "maintenance:view:urn" } },
          });
          navigationRef.current?.getCurrentRoute.mockReturnValueOnce({
            name: EntityType.AllMarketsView,
            params: { viewLink: { viewUrn: "current:view:urn" } },
          });

          updateStoreRoute(store); // 1st update - current is RootMaintenanceScreen
          updateStoreRoute(store); // 2nd update - current is AllMarketsView, previous is RootMaintenanceScreen
        });

        it("should dispatch a delete_view and a refresh action with the current urn", () => {
          expect(store.dispatch).toHaveBeenCalledTimes(4); // the two 1st ones are quantum metrics actions
          expect(store.dispatch).toHaveBeenNthCalledWith(3, {
            type: DELETE_VIEW,
            payload: "current:view:urn",
          });
          expect(store.dispatch).toHaveBeenNthCalledWith(4, {
            type: REFRESH,
            payload: {
              urn: "current:view:urn",
              shouldRefreshBottomBar: true,
            },
          });
        });

        it("should call apollo to reset cache", () => {
          expect(resetApolloCacheWithAppContext).toHaveBeenCalledTimes(1);
        });
      });

      describe("when previousRoute hasn't a viewUrn and the currentRoute has", () => {
        describe("and the screen is not the same", () => {
          beforeEach(() => {
            navigationRef.current?.getCurrentRoute.mockReturnValueOnce({
              name: ScreenName.GamingGamesCollectionScreen,
              params: {},
            });
            navigationRef.current?.getCurrentRoute.mockReturnValueOnce({
              name: ScreenName.GamingLobbyScreen,
              params: { viewLink: { viewUrn: "ppb:tbd:view:gaming:1", viewUrl: "/someUrl" } },
            });

            updateStoreRoute(store); // 1st update - current is GamingGamesCollectionScreen
            updateStoreRoute(store); // 2nd update - current is GamingLobbyScreen, previous is GamingGamesCollectionScreen
          });

          it("should dispatch route push action once with the correct params", () => {
            expect(dispatchRoutePushAction).toHaveBeenCalledTimes(1);
            expect(dispatchRoutePushAction).toHaveBeenCalledWith(store, "ppb:tbd:view:gaming:1", "/someUrl");
          });
        });
      });
    });

    describe("when currentRoute viewUrn is not defined", () => {
      it("should not dispatch QuantumMetricSendNewPageNamedAction", () => {
        navigationRef.current?.getCurrentRoute.mockReturnValue({
          params: undefined,
        });
        updateStoreRoute(store);
        expect(store.dispatch).not.toHaveBeenCalled();
      });
    });

    describe("When currentRoute name is defined", () => {
      it("should log screen view with Firebase Analytics", () => {
        navigationRef.current?.getCurrentRoute.mockReturnValue({
          params: { viewLink: { viewUrn: "qm:view:urn" } },
          name: "current view",
        });
        updateStoreRoute(store);

        expect(analytics().logScreenView).toHaveBeenCalledWith({
          screen_name: "current view",
          screen_class: "current view",
        });
      });
    });

    describe("when currentRoute name is not defined", () => {
      it("should not triger logScreenView", () => {
        navigationRef.current?.getCurrentRoute.mockReturnValue(undefined);

        updateStoreRoute(store);
        expect(analytics().logScreenView).not.toHaveBeenCalled();
      });
    });
  });
});
