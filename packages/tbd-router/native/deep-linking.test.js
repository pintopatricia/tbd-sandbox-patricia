import { Linking, Platform, NativeModules } from "react-native";
import { Notifications } from "react-native-notifications";
import { EventType, UrbanAirship } from "urbanairship-react-native";
import { findRouteWithUrl } from "@ppb/tbd-routes";
import { DisplayMode } from "@ppb/tbd-store/state/layout/views/ViewLink.types";
import { buildNotificationEvent } from "tagging-library";
import { PlatformType, TaggingAction } from "@ppb/tbd-store/middlewares/tagging-resolvers/AnalyticsConstants";
import { Brand } from "@ppb/tbd-store/config/Brand";
import { EntityType } from "@ppb/tbd-urn-codecs";
import {
  initDeepLinking,
  isMovableInkSubdomain,
  navigateWithDeepLinking,
  removeDeepLinkingEventListeners,
  dispatchLaunchGameFromPush,
} from "./deep-linking";
import { getInfoFromPush } from "./helpers/get-url-from-push";
import {
  BottomTypeScreenName,
  navigate,
  navigateWithThirdPartyScreenName,
  navigationRef,
  GamesLobbyObject,
} from "./router";

jest.mock("react-native", () => {
  const listeners = [];

  return {
    Platform: {
      OS: "android",
    },
    Linking: {
      getInitialURL: jest.fn(),
      addEventListener: jest.fn((event, handler) => {
        listeners.push({ event, handler });
      }),
      emit: jest.fn((event, props) => {
        listeners.filter((l) => l.event === event).forEach((l) => l.handler(props));
      }),
      removeEventListener: jest.fn(() => {
        listeners.pop();
      }),
    },
    NativeModules: {
      ShortcutModule: {
        getShortcut: jest.fn(() => Promise.resolve(null)),
      },
    },
  };
});

jest.mock("react-native-notifications", () => ({
  Notifications: {
    getInitialNotification: jest.fn(),
    events: () => ({
      registerNotificationOpened: jest.fn(),
    }),
  },
}));

jest.mock("urbanairship-react-native", () => ({
  UrbanAirship: {
    addListener: jest.fn(() => {}),
  },
  EventType: {
    NotificationResponse: "NotificationResponse",
    PushReceived: "pushReceived",
  },
}));

jest.mock("@ppb/tbd-routes", () => ({
  findRouteWithUrl: jest.fn(),
}));

jest.mock("./router", () => ({
  navigate: jest.fn(),
  navigateWithThirdPartyScreenName: jest.fn(),
  isSubDomainWhitelisted: jest.fn(),
  ScreenName: { CetStackNavigator: "CetStackNavigator", GameLaunchScreen: "GameLaunchScreen" },
  GamesLobbyObject: {
    closeModalView: jest.fn(),
    openWebView: jest.fn(),
  },
  navigationRef: {
    current: {
      navigate: jest.fn(),
    },
  },
  BottomTypeScreenName: {
    GamingTab: "Gaming",
  },
}));

jest.mock("./helpers/get-url-from-push", () => ({
  getInfoFromPush: jest.fn(() => ({
    url: "bfe://pushNotificationFakeURL",
    title: "test title",
    body: "test body",
    pushMessagePlatform: "test platform",
  })),
}));

jest.mock("tagging-library", () => ({
  buildNotificationEvent: jest.fn().mockReturnValue("notification event"),
}));

jest.mock("./deep-linking", () => ({
  ...jest.requireActual("./deep-linking"),
  dispatchLaunchGameFromPush: jest.fn(),
}));

const SPORT_URL = "soccer/sport:1";
const SPORT_URN = {
  type: "ppb:tbd:view:sport",
  uid: "ppb:tbd:view:sport:1",
};
const GAMING_URN = {
  type: "ppb:tbd:view:gaming",
  uid: "ppb:tbd:view:gaming:1",
};
const HOME_URN = {
  type: "ppb:tbd:view:generic:home",
  uid: "ppb:tbd:view:generic:home",
};
const HOST = "www.rebuild.com";
const APPLICATION_PATHS = "betting|aaaa";
const EXTERNAL_VIEW_URN = "ppb:tbd:view:external:external";
const GAMING_VIEW_URN = "ppb:tbd:view:gaming";
const CET_LOGIN_URL = "CetStackNavigator/LoginWithEmailAndPasswordScreen";
const GAME_LAUNCH_URL = "https://launcher.rebuild.com/?gameid=gameId";
const GAME_LAUNCH_BRAZIL_URL = "https://launcher.rebuild.bet.br/";
const CPP_PROMOTION_URL = "https://promotions.rebuild.com/promotions";
const CPP_PROMOTION_BRAZIL_URL = "https://promotions.rebuild.bet.br/promotions";
const PRIZE_PINBALL_URL = "https://casino.betfair.com/prize-pinball";
const IMS_PROMOTION_URL = "https://casino.betfair.com/promotions";
const IMS_PROMOTION_BRAZIL_URL = "https://casino.betfair.bet.br/promotions";
const CASINO_INVALID_URL = "https://casino.betfair.com/invalid-url";
const EXTRACT_VIEW_URL = "bfe://sport/?bets=X,Y";
const EXTRACT_BRAZIL_URL = "rebuild.betfair.bet.br/betting/sport/?bets=A, B";
const GAME_COLLECTION_URL = "https://www.betfair.com/betting/casino/c/";

const deeplinkConfiguration = {
  subdomainPattern: /(?<!w{3})\.rebuild\./,
  subdomainWhitelistPattern: /^https:\/\/(promos|promotions)\.rebuild(\.\w+)+/,
  extractViewURLPattern: /^bfe:\/\/|^bsm:\/\/|^.*rebuild(\.\w+)+(\/betting)?\/?/,
  gameLaunchURLPattern: /launcher\.rebuild(\.\w+)+/,
  casinoWhitelistPattern: /casino\.betfair(\.\w+)+\/(prize-pinball|promotions)/,
  gameCollectionUrnPattern: /betfair\.\w+\/betting\/casino\/c/,
  superSpinsPattern: /^https:\/\/sbgames\.skybet(\.\w+)+\/(super-spins|free-to-play)/,
  newGameLaunchPattern: /newLauncher\.rebuild(\.\w+)+/,
};

const sendEventMock = jest.fn();

describe("DeepLinkingService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.requestAnimationFrame = (cb) => cb();
  });

  describe("when initDeepLinking function is called: rebuild", () => {
    describe("and Platform is iOS", () => {
      beforeEach(async () => {
        Platform.OS = "ios";
        await initDeepLinking(Brand.Betfair, deeplinkConfiguration, HOST, APPLICATION_PATHS, sendEventMock);
      });

      it("should add PushReceived listener", () => {
        expect(UrbanAirship.addListener).toHaveBeenCalledWith(EventType.PushReceived, expect.any(Function));
        expect(UrbanAirship.addListener).toHaveBeenCalledTimes(1);
      });
    });

    describe("and Platform is Android", () => {
      beforeEach(async () => {
        Platform.OS = "android";
        await initDeepLinking(Brand.Betfair, deeplinkConfiguration, HOST, APPLICATION_PATHS, sendEventMock);
      });

      it("should add NotificationResponse and PushReceived listeners", () => {
        expect(UrbanAirship.addListener).toHaveBeenCalledWith(EventType.NotificationResponse, expect.any(Function));
        expect(UrbanAirship.addListener).toHaveBeenCalledWith(EventType.PushReceived, expect.any(Function));
        expect(UrbanAirship.addListener).toHaveBeenCalledTimes(2);
      });
    });

    describe("when app is launching for the first time and called with homepage url", () => {
      beforeEach(async () => {
        Linking.getInitialURL.mockResolvedValue("https://www.rebuild.com/betting/");
        await initDeepLinking(Brand.Betfair, deeplinkConfiguration, HOST, APPLICATION_PATHS, sendEventMock);
      });

      it("should call getInitialURL", () => {
        expect(Linking.getInitialURL).toHaveBeenCalled();
      });

      it("should call findRouteWithUrl", () => {
        expect(findRouteWithUrl).toHaveBeenCalledWith("https://www.rebuild.com/betting/", HOST, APPLICATION_PATHS);
      });

      it("should add event listener url", () => {
        expect(Linking.addEventListener).toHaveBeenCalledWith("url", expect.any(Function));
      });

      it("should call navigate with correct params", () => {
        expect(navigate).toHaveBeenCalledWith({
          isDeepLink: true,
          viewUrl: "",
          viewUrn: HOME_URN.uid,
        });
      });
    });

    describe("when app is launching for the first time and called with no valid internal url", () => {
      beforeEach(async () => {
        findRouteWithUrl.mockReturnValue(null);
        Linking.getInitialURL.mockResolvedValue("https://www.rebuild.com/betting/batatas");
        await initDeepLinking(Brand.Betfair, deeplinkConfiguration, HOST, APPLICATION_PATHS, sendEventMock);
      });

      it("should call getInitialURL", () => {
        expect(Linking.getInitialURL).toHaveBeenCalled();
      });

      it("should call findRouteWithUrl with correct url", () => {
        expect(findRouteWithUrl).toHaveBeenCalledWith(
          "https://www.rebuild.com/betting/batatas",
          HOST,
          APPLICATION_PATHS,
        );
      });

      it("should add event listener url", () => {
        expect(Linking.addEventListener).toHaveBeenCalledWith("url", expect.any(Function));
      });

      it("should call navigate with correct params", () => {
        expect(navigate).toHaveBeenCalledWith({
          isDeepLink: true,
          viewUrl: "batatas",
          viewUrn: HOME_URN.uid,
        });
      });
    });

    describe("when app is launching for the first time and called with query parameters", () => {
      beforeEach(async () => {
        findRouteWithUrl.mockReturnValue(SPORT_URN);
        Linking.getInitialURL.mockResolvedValue(EXTRACT_VIEW_URL);
        await initDeepLinking(Brand.Betfair, deeplinkConfiguration, HOST, APPLICATION_PATHS, sendEventMock);
      });

      it("should call getInitialURL", () => {
        expect(Linking.getInitialURL).toHaveBeenCalled();
      });

      it("should call findRouteWithUrl with correct url", () => {
        expect(findRouteWithUrl).toHaveBeenCalledWith(EXTRACT_VIEW_URL, HOST, APPLICATION_PATHS);
      });

      it("should add event listener url", () => {
        expect(Linking.addEventListener).toHaveBeenCalledWith("url", expect.any(Function));
      });

      it("should call navigate with correct params", () => {
        expect(navigate).toHaveBeenCalledWith({
          isDeepLink: true,
          viewUrl: "sport/?bets=X,Y",
          viewUrn: SPORT_URN.uid,
        });
      });
    });

    describe("when app is launching and called with extract url with country code second level domains", () => {
      beforeEach(async () => {
        Linking.getInitialURL.mockResolvedValue(EXTRACT_BRAZIL_URL);
        await initDeepLinking(Brand.Betfair, deeplinkConfiguration, HOST, APPLICATION_PATHS, sendEventMock);
      });

      it("should call getInitialURL", () => {
        expect(Linking.getInitialURL).toHaveBeenCalled();
      });

      it("should call findRouteWithUrl with correct url", () => {
        expect(findRouteWithUrl).toHaveBeenCalledWith(EXTRACT_BRAZIL_URL, HOST, APPLICATION_PATHS);
      });

      it("should add event listener url", () => {
        expect(Linking.addEventListener).toHaveBeenCalledWith("url", expect.any(Function));
      });

      it("should call navigate with correct params", () => {
        expect(navigate).toHaveBeenCalledWith({
          isDeepLink: true,
          viewUrl: "sport/?bets=A, B",
          viewUrn: SPORT_URN.uid,
        });
      });
    });

    describe("when app is launching for the first time and called with a whitelisted subdomain", () => {
      beforeEach(async () => {
        Platform.OS = "android";
        Linking.getInitialURL.mockResolvedValue("https://promotions.rebuild.com/botaremediointernet");
        await initDeepLinking(Brand.Betfair, deeplinkConfiguration, HOST, APPLICATION_PATHS, sendEventMock);
      });

      it("should call getInitialURL", () => {
        expect(Linking.getInitialURL).toHaveBeenCalled();
      });

      it("shouldn't call findRouteWithUrl", () => {
        expect(findRouteWithUrl).not.toHaveBeenCalled();
      });

      it("should add event listener url", () => {
        expect(Linking.addEventListener).toHaveBeenCalledWith("url", expect.any(Function));
      });

      it("should call navigate with correct params", () => {
        expect(navigate).toHaveBeenCalledWith({
          viewDisplayMode: DisplayMode.BlankWebview,
          viewUrl: "https://promotions.rebuild.com/botaremediointernet",
          viewUrn: EXTERNAL_VIEW_URN,
        });
      });
    });

    describe("when app is launching for the first time and called with a blacklisted applink", () => {
      beforeEach(async () => {
        Linking.getInitialURL.mockResolvedValue("https://batatas.rebuild.com/botaremediointernet");
        await initDeepLinking(Brand.Betfair, deeplinkConfiguration, HOST, APPLICATION_PATHS, sendEventMock);
      });

      it("should call getInitialURL", () => {
        expect(Linking.getInitialURL).toHaveBeenCalled();
      });

      it("shouldn't call findRouteWithUrl", () => {
        expect(findRouteWithUrl).not.toHaveBeenCalled();
      });

      it("should add event listener url", () => {
        expect(Linking.addEventListener).toHaveBeenCalledWith("url", expect.any(Function));
      });

      it("should call navigate with no viewDisplayMode and a striped viewUrl", () => {
        expect(navigate).toHaveBeenCalledWith({
          viewUrl: "https://batatas.rebuild.com/botaremediointernet",
          viewUrn: EXTERNAL_VIEW_URN,
        });
      });
    });

    describe("when app is launching for the first time", () => {
      beforeEach(async () => {
        findRouteWithUrl.mockReturnValue(SPORT_URN);
        Linking.getInitialURL.mockResolvedValue(`bfe://${SPORT_URL}`);
        await initDeepLinking(Brand.Betfair, deeplinkConfiguration, HOST, APPLICATION_PATHS, sendEventMock);
      });

      it("should call getInitialURL", () => {
        expect(Linking.getInitialURL).toHaveBeenCalled();
      });

      it("should call findRouteWithUrl with correct url", () => {
        expect(findRouteWithUrl).toHaveBeenCalledWith(`bfe://${SPORT_URL}`, HOST, APPLICATION_PATHS);
      });

      it("should add event listener url", () => {
        expect(Linking.addEventListener).toHaveBeenCalledWith("url", expect.any(Function));
      });

      it("should call navigate with correct params", () => {
        expect(navigate).toHaveBeenCalledWith({
          isDeepLink: true,
          viewUrl: SPORT_URL,
          viewUrn: SPORT_URN.uid,
        });
      });
    });

    describe("when app catch a dispatch from CET framework", () => {
      beforeEach(async () => {
        Linking.getInitialURL.mockResolvedValue(`bfe://${CET_LOGIN_URL}`);
        await initDeepLinking(Brand.Betfair, deeplinkConfiguration, sendEventMock);
      });

      it("should call getInitialURL", () => {
        expect(Linking.getInitialURL).toHaveBeenCalled();
      });

      it("shouldn't call findRouteWithUrl", () => {
        expect(findRouteWithUrl).not.toHaveBeenCalled();
      });

      it("should add event listener url", () => {
        expect(Linking.addEventListener).toHaveBeenCalledWith("url", expect.any(Function));
      });

      it("should call navigateWithThirdPartyScreenName with correct params", () => {
        expect(navigateWithThirdPartyScreenName).toHaveBeenCalledWith("CetStackNavigator", {
          screen: "LoginWithEmailAndPasswordScreen",
        });
      });
    });

    describe("when app is already running in background", () => {
      beforeEach(async () => {
        Linking.getInitialURL.mockResolvedValue(null);
        await initDeepLinking(Brand.Betfair, deeplinkConfiguration, sendEventMock);
      });

      it("should call getInitialURL", () => {
        expect(Linking.getInitialURL).toHaveBeenCalled();
      });

      it("should not call findRouteWithUrl", () => {
        expect(findRouteWithUrl).not.toHaveBeenCalled();
      });

      it("should add event listener url", () => {
        expect(Linking.addEventListener).toHaveBeenCalledWith("url", expect.any(Function));
      });

      it("should not call navigate", () => {
        expect(navigate).not.toHaveBeenCalled();
      });

      describe("and a Linking event is triggered", () => {
        beforeEach(() => {
          findRouteWithUrl.mockReturnValue(SPORT_URN);
          Linking.emit("url", { url: `bfe://${SPORT_URL}` });
        });

        it("should call findRouteWithUrl with correct url", () => {
          expect(findRouteWithUrl).toHaveBeenCalledWith(`bfe://${SPORT_URL}`, HOST, APPLICATION_PATHS);
        });

        it("should call navigate with correct params", () => {
          expect(navigate).toHaveBeenCalledWith({
            isDeepLink: true,
            viewUrl: SPORT_URL,
            viewUrn: SPORT_URN.uid,
          });
        });
      });
    });

    describe("when the app is launching from a push notification", () => {
      beforeEach(async () => {
        findRouteWithUrl.mockReturnValue(null);
        Notifications.getInitialNotification.mockReturnValue("fakeNotification");
        await initDeepLinking(Brand.Betfair, deeplinkConfiguration, HOST, APPLICATION_PATHS, sendEventMock);
      });

      it("should call getInfoFromPush with the notification", () => {
        expect(getInfoFromPush).toHaveBeenCalledWith("fakeNotification", Brand.Betfair);
      });

      it("should call sendEvent", () => {
        expect(sendEventMock).toHaveBeenCalledWith("notification event");
      });

      it("should call buildNotificationEvent with notification event", () => {
        expect(buildNotificationEvent).toHaveBeenCalledWith({
          action: TaggingAction.CLICKED,
          elementText: "test body",
          destinationUrl: "bfe://pushNotificationFakeURL",
          pushMessagePlatform: "test platform",
        });
      });

      it("should call findRouteWithUrl with the push url", () => {
        expect(findRouteWithUrl).toHaveBeenCalledWith("bfe://pushNotificationFakeURL", HOST, APPLICATION_PATHS);
      });

      it("should add event listener url", () => {
        expect(Linking.addEventListener).toHaveBeenCalledWith("url", expect.any(Function));
      });

      it("should call navigate with correct params", () => {
        expect(navigate).toHaveBeenCalledWith({
          isDeepLink: true,
          viewUrl: "pushNotificationFakeURL",
          viewUrn: HOME_URN.uid,
        });
      });
    });

    describe("when the app is launching from a push notification with no url", () => {
      beforeEach(async () => {
        findRouteWithUrl.mockReturnValue(null);
        getInfoFromPush.mockReturnValue({
          title: "test title",
          body: "test body",
          pushMessagePlatform: "test platform",
        });
        Notifications.getInitialNotification.mockReturnValue("fakeNotification");
        await initDeepLinking(Brand.Betfair, deeplinkConfiguration, HOST, APPLICATION_PATHS, sendEventMock);
      });

      it("should call buildNotificationEvent with null destinationUrl", () => {
        expect(buildNotificationEvent).toHaveBeenCalledWith({
          action: TaggingAction.CLICKED,
          elementText: "test body",
          destinationUrl: "null",
          pushMessagePlatform: "test platform",
        });
      });

      it("should not call navigate", () => {
        expect(navigate).not.toHaveBeenCalled();
      });
    });
  });

  describe("when removeDeepLinkingEventListeners function is called: rebuild", () => {
    const removeSpy = jest.fn();

    beforeEach(async () => {
      Linking.addEventListener.mockReturnValue({ remove: removeSpy });
      await initDeepLinking(Brand.Betfair, deeplinkConfiguration, HOST, APPLICATION_PATHS, sendEventMock);

      removeDeepLinkingEventListeners();
    });

    it("should remove event listener url", () => {
      expect(removeSpy).toHaveBeenCalled();
    });
  });

  describe("when navigateWithDeepLinking function is called: rebuild", () => {
    describe("when called with a path included in the SKIP_NAVIGATION_DEEPLINK_PATHS array", () => {
      beforeEach(() => {
        navigateWithDeepLinking(
          "https://www.rebuild.com/betting/authexternal",
          HOST,
          APPLICATION_PATHS,
          deeplinkConfiguration,
        );
      });

      it("should not call navigate", () => {
        expect(navigate).not.toHaveBeenCalled();
      });
    });

    describe("when called with an external url without the rebuild subdomain", () => {
      beforeEach(async () => {
        findRouteWithUrl.mockReturnValue(null);
        navigateWithDeepLinking("https://www.google.com", HOST, APPLICATION_PATHS, deeplinkConfiguration);
      });

      it("should not call findRouteWithUrl", () => {
        expect(findRouteWithUrl).not.toHaveBeenCalled();
      });

      it("should call navigate with correct params", () => {
        expect(navigate).toHaveBeenCalledWith({
          viewUrl: "https://www.google.com",
          viewUrn: EXTERNAL_VIEW_URN,
        });
      });
    });

    describe("when called with an external url", () => {
      describe("when the platform is android", () => {
        beforeEach(() => {
          Platform.OS = "android";
        });

        describe("when url is a whitelisted pattern and is a cpp promotion", () => {
          beforeEach(() => {
            navigateWithDeepLinking(CPP_PROMOTION_URL, HOST, APPLICATION_PATHS, deeplinkConfiguration);
          });

          it("should call navigate with correct params", () => {
            expect(navigate).toHaveBeenCalledWith({
              viewDisplayMode: DisplayMode.BlankWebview,
              viewUrl: CPP_PROMOTION_URL,
              viewUrn: EXTERNAL_VIEW_URN,
            });
          });
        });

        describe("when url is a whitelisted pattern and is an ims promotion", () => {
          beforeEach(() => {
            navigateWithDeepLinking(IMS_PROMOTION_URL, HOST, APPLICATION_PATHS, deeplinkConfiguration);
          });

          it("should call navigate with correct params", () => {
            expect(navigate).toHaveBeenCalledWith({
              viewDisplayMode: DisplayMode.BlankWebview,
              viewUrl: IMS_PROMOTION_URL,
              viewUrn: EXTERNAL_VIEW_URN,
            });
          });
        });

        describe("when url is a whitelisted pattern and is a prize pinball", () => {
          beforeEach(() => {
            navigateWithDeepLinking(PRIZE_PINBALL_URL, HOST, APPLICATION_PATHS, deeplinkConfiguration);
          });

          it("should call navigate with correct params", () => {
            expect(navigate).toHaveBeenCalledWith({
              viewDisplayMode: DisplayMode.BlankWebview,
              viewUrl: PRIZE_PINBALL_URL,
              viewUrn: EXTERNAL_VIEW_URN,
            });
          });
        });

        describe("when url has country code second level domains", () => {
          describe("and is a whitelisted pattern and is a cpp promotion", () => {
            beforeEach(() => {
              navigateWithDeepLinking(CPP_PROMOTION_BRAZIL_URL, HOST, APPLICATION_PATHS, deeplinkConfiguration);
            });

            it("should call navigate with correct params", () => {
              expect(navigate).toHaveBeenCalledWith({
                viewDisplayMode: DisplayMode.BlankWebview,
                viewUrl: CPP_PROMOTION_BRAZIL_URL,
                viewUrn: EXTERNAL_VIEW_URN,
              });
            });
          });

          describe("and is a whitelisted pattern and is an ims promotion", () => {
            beforeEach(() => {
              navigateWithDeepLinking(IMS_PROMOTION_BRAZIL_URL, HOST, APPLICATION_PATHS, deeplinkConfiguration);
            });

            it("should call navigate with correct params", () => {
              expect(navigate).toHaveBeenCalledWith({
                viewDisplayMode: DisplayMode.BlankWebview,
                viewUrl: IMS_PROMOTION_BRAZIL_URL,
                viewUrn: EXTERNAL_VIEW_URN,
              });
            });
          });
        });

        describe("when url is not whitelisted", () => {
          beforeEach(() => {
            navigateWithDeepLinking(CASINO_INVALID_URL, HOST, APPLICATION_PATHS, deeplinkConfiguration);
          });

          it("should call navigate with correct params", () => {
            expect(navigate).toHaveBeenCalledWith({
              viewDisplayMode: undefined,
              viewUrl: CASINO_INVALID_URL,
              viewUrn: EXTERNAL_VIEW_URN,
            });
          });
        });
      });

      describe("when platform is ios", () => {
        beforeEach(() => {
          Platform.OS = "ios";
        });

        describe("when app is launching potentially via a shortcut", () => {
          beforeEach(async () => {
            await initDeepLinking(Brand.Betfair, deeplinkConfiguration, HOST, APPLICATION_PATHS, sendEventMock);
          });

          describe("when app is launching from cold start with a valid shortcut url", () => {
            beforeEach(async () => {
              NativeModules.ShortcutModule.getShortcut.mockImplementationOnce(() =>
                Promise.resolve("https://www.rebuild.com/betting/"),
              );
            });

            it("should call getShortcut", () => {
              expect(NativeModules.ShortcutModule.getShortcut).toHaveBeenCalled();
            });

            it("should call findRouteWithUrl", () => {
              expect(findRouteWithUrl).toHaveBeenCalledWith(
                "https://www.rebuild.com/betting/",
                HOST,
                APPLICATION_PATHS,
              );
            });

            it("should call navigate with correct params", () => {
              expect(navigate).toHaveBeenCalledWith({
                isDeepLink: true,
                viewUrl: "",
                viewUrn: HOME_URN.uid,
              });
            });
          });

          describe("when app is launching from cold start with no shortcut url", () => {
            it("should call getShortcut", () => {
              expect(NativeModules.ShortcutModule.getShortcut).toHaveBeenCalled();
            });

            it("should not call findRouteWithUrl", () => {
              expect(findRouteWithUrl).not.toHaveBeenCalled();
            });

            it("should not call navigate with correct params", () => {
              expect(navigate).not.toHaveBeenCalled();
            });
          });
        });

        describe("when url is a whitelisted pattern and is a cpp promotion", () => {
          beforeEach(() => {
            navigateWithDeepLinking(CPP_PROMOTION_URL, HOST, APPLICATION_PATHS, deeplinkConfiguration);
          });

          it("should open promo using External View", () => {
            expect(navigate).toHaveBeenCalledWith({
              viewDisplayMode: DisplayMode.BlankWebview,
              viewUrn: EXTERNAL_VIEW_URN,
              viewUrl: CPP_PROMOTION_URL,
            });
          });
        });

        describe("when url is a whitelisted pattern and is an ims promotion", () => {
          beforeEach(() => {
            navigateWithDeepLinking(IMS_PROMOTION_URL, HOST, APPLICATION_PATHS, deeplinkConfiguration);
          });

          it("should navigate to Gaming View", () => {
            expect(navigate).toHaveBeenCalledWith({
              isDeepLink: true,
              viewUrn: GAMING_VIEW_URN,
              viewUrl: IMS_PROMOTION_URL,
            });
          });
        });

        describe("when url is a whitelisted pattern and is a prize pinball", () => {
          beforeEach(() => {
            navigateWithDeepLinking(PRIZE_PINBALL_URL, HOST, APPLICATION_PATHS, deeplinkConfiguration);
          });

          it("should call openWebView", async () => {
            expect(GamesLobbyObject.openWebView).toHaveBeenCalledWith(PRIZE_PINBALL_URL);
          });
        });

        describe("when url has country code second level domains", () => {
          describe("and is a whitelisted pattern and is a cpp promotion", () => {
            beforeEach(() => {
              navigateWithDeepLinking(CPP_PROMOTION_BRAZIL_URL, HOST, APPLICATION_PATHS, deeplinkConfiguration);
            });

            it("should call navigate with correct params", () => {
              expect(navigate).toHaveBeenCalledWith({
                viewDisplayMode: DisplayMode.BlankWebview,
                viewUrn: EXTERNAL_VIEW_URN,
                viewUrl: CPP_PROMOTION_BRAZIL_URL,
              });
            });
          });

          describe("and is a whitelisted pattern and is an ims promotion", () => {
            beforeEach(() => {
              navigateWithDeepLinking(IMS_PROMOTION_BRAZIL_URL, HOST, APPLICATION_PATHS, deeplinkConfiguration);
            });

            it("should call navigate with correct params", () => {
              expect(navigate).toHaveBeenCalledWith({
                isDeepLink: true,
                viewUrn: GAMING_VIEW_URN,
                viewUrl: IMS_PROMOTION_BRAZIL_URL,
              });
            });
          });
        });

        describe("when url is a whitelisted pattern and is a game collection", () => {
          beforeEach(() => {
            navigateWithDeepLinking(GAME_COLLECTION_URL, HOST, APPLICATION_PATHS, deeplinkConfiguration);
          });
          it("should navigate to Gaming View", () => {
            expect(navigate).toHaveBeenCalledWith({
              isDeepLink: true,
              viewUrn: GAMING_VIEW_URN,
              viewUrl: GAME_COLLECTION_URL,
            });
          });
        });

        describe("when url is not whitelisted", () => {
          beforeEach(() => {
            Platform.OS = "ios";
            navigateWithDeepLinking(CASINO_INVALID_URL, HOST, APPLICATION_PATHS, deeplinkConfiguration);
          });

          it("should not navigate to Gaming View", () => {
            expect(navigate).toHaveBeenCalledWith({
              viewDisplayMode: undefined,
              viewUrl: CASINO_INVALID_URL,
              viewUrn: EXTERNAL_VIEW_URN,
            });
          });
        });
      });
    });

    describe("when called with a blacklisted applink", () => {
      beforeEach(() => {
        navigateWithDeepLinking(
          "https://batatas.rebuild.com/botaremediointernet",
          HOST,
          APPLICATION_PATHS,
          deeplinkConfiguration,
        );
      });

      it("should not call findRouteWithUrl", () => {
        expect(findRouteWithUrl).not.toHaveBeenCalled();
      });

      it("should call navigate with no viewDisplayMode and a striped viewUrl", () => {
        expect(navigate).toHaveBeenCalledWith({
          viewUrl: "https://batatas.rebuild.com/botaremediointernet",
          viewUrn: EXTERNAL_VIEW_URN,
        });
      });
    });

    describe("when called with a CET framework url", () => {
      beforeEach(() => {
        navigateWithDeepLinking(`bfe://${CET_LOGIN_URL}`, HOST, APPLICATION_PATHS, deeplinkConfiguration);
      });

      it("should not call findRouteWithUrl", () => {
        expect(findRouteWithUrl).not.toHaveBeenCalled();
      });

      it("should call navigateWithThirdPartyScreenName with correct params", () => {
        expect(navigateWithThirdPartyScreenName).toHaveBeenCalledWith("CetStackNavigator", {
          screen: "LoginWithEmailAndPasswordScreen",
        });
      });
    });

    describe("when called with homepage url", () => {
      beforeEach(() => {
        navigateWithDeepLinking("https://www.rebuild.com/betting/", HOST, APPLICATION_PATHS, deeplinkConfiguration);
      });

      it("should call findRouteWithUrl", () => {
        expect(findRouteWithUrl).toHaveBeenCalledWith("https://www.rebuild.com/betting/", HOST, APPLICATION_PATHS);
      });

      it("should call navigate with correct params", () => {
        expect(navigate).toHaveBeenCalledWith({
          isDeepLink: true,
          viewUrl: "",
          viewUrn: HOME_URN.uid,
        });
      });
    });

    describe("when called with an invalid internal url", () => {
      beforeEach(() => {
        findRouteWithUrl.mockReturnValue(null);
        navigateWithDeepLinking(
          "https://www.rebuild.com/betting/batatas",
          HOST,
          APPLICATION_PATHS,
          deeplinkConfiguration,
        );
      });

      it("should call findRouteWithUrl with correct url", () => {
        expect(findRouteWithUrl).toHaveBeenCalledWith(
          "https://www.rebuild.com/betting/batatas",
          HOST,
          APPLICATION_PATHS,
        );
      });

      it("should call navigate with correct params", () => {
        expect(navigate).toHaveBeenCalledWith({
          isDeepLink: true,
          viewUrl: "batatas",
          viewUrn: HOME_URN.uid,
        });
      });
    });

    describe("when called with query parameters", () => {
      beforeEach(() => {
        findRouteWithUrl.mockReturnValue(SPORT_URN);
        navigateWithDeepLinking("bfe://sport/?bets=X,Y", HOST, APPLICATION_PATHS, deeplinkConfiguration);
      });

      it("should call findRouteWithUrl with correct url", () => {
        expect(findRouteWithUrl).toHaveBeenCalledWith("bfe://sport/?bets=X,Y", HOST, APPLICATION_PATHS);
      });

      it("should call navigate with correct params", () => {
        expect(navigate).toHaveBeenCalledWith({
          isDeepLink: true,
          viewUrl: "sport/?bets=X,Y",
          viewUrn: SPORT_URN.uid,
        });
      });
    });

    describe("when called with launchGameUrl", () => {
      describe("when platform is android", () => {
        const mockDispatchLaunchGameFromPN = jest.fn();

        beforeEach(() => {
          Platform.OS = "android";
          mockDispatchLaunchGameFromPN.mockClear();
        });

        it("should navigate with third-party screen GameLaunchScreen with correct params", () => {
          navigateWithDeepLinking(
            GAME_LAUNCH_URL,
            HOST,
            APPLICATION_PATHS,
            deeplinkConfiguration,
            mockDispatchLaunchGameFromPN,
          );

          expect(mockDispatchLaunchGameFromPN).toHaveBeenCalledWith(
            { viewUrl: GAME_LAUNCH_URL, viewUrn: "" },
            expect.any(String),
            PlatformType.Native,
          );
          expect(navigateWithThirdPartyScreenName).toHaveBeenCalledWith("GameLaunchScreen", {
            viewLink: {
              viewUrl: GAME_LAUNCH_URL,
              viewUrn: "",
            },
          });
          expect(navigate).not.toHaveBeenCalled();
        });

        describe("when url has country code second level domains", () => {
          it("should navigate with third-party screen GameLaunchScreen with correct params", () => {
            navigateWithDeepLinking(
              GAME_LAUNCH_BRAZIL_URL,
              HOST,
              APPLICATION_PATHS,
              deeplinkConfiguration,
              mockDispatchLaunchGameFromPN,
            );
            expect(mockDispatchLaunchGameFromPN).toHaveBeenCalled();
            expect(navigateWithThirdPartyScreenName).toHaveBeenCalledWith("GameLaunchScreen", {
              viewLink: {
                viewUrl: GAME_LAUNCH_BRAZIL_URL,
                viewUrn: "",
              },
            });
            expect(navigate).not.toHaveBeenCalled();
          });
        });
      });

      describe("when the platform is ios", () => {
        beforeEach(() => {
          Platform.OS = "ios";
          dispatchLaunchGameFromPush(
            {
              viewUrl: GAME_LAUNCH_URL,
              viewUrn: "",
            },
            PlatformType.Native,
          );
          navigateWithDeepLinking(GAME_LAUNCH_URL, HOST, APPLICATION_PATHS, deeplinkConfiguration);
        });

        it("should navigate with correct params", () => {
          expect(navigateWithThirdPartyScreenName).not.toHaveBeenCalled();
          expect(navigate).toHaveBeenCalledWith({
            viewUrn: EntityType.GamingView,
            isDeepLink: true,
            viewUrl: GAME_LAUNCH_URL,
          });
        });

        describe("when url has country code second level domains", () => {
          beforeEach(() => {
            navigateWithDeepLinking(GAME_LAUNCH_BRAZIL_URL, HOST, APPLICATION_PATHS, deeplinkConfiguration);
          });

          it("should navigate with correct params", () => {
            expect(dispatchLaunchGameFromPush).toHaveBeenCalled();
            expect(navigateWithThirdPartyScreenName).not.toHaveBeenCalled();
            expect(navigate).toHaveBeenCalledWith({
              viewUrn: EntityType.GamingView,
              isDeepLink: true,
              viewUrl: GAME_LAUNCH_BRAZIL_URL,
            });
          });
        });
      });
    });

    describe("when Platform is android and called with game collection", () => {
      beforeEach(() => {
        Platform.OS = "android";
        findRouteWithUrl.mockReturnValue(GAMING_URN);
        navigateWithDeepLinking(GAME_COLLECTION_URL, HOST, APPLICATION_PATHS, deeplinkConfiguration);
      });
      it("when is casino category url should navigate to gaming tab", () => {
        expect(navigationRef.current.navigate).toHaveBeenCalledWith(BottomTypeScreenName.GamingTab, {});
        expect(navigate).toHaveBeenCalledWith({ viewUrn: GAMING_URN.uid, viewUrl: GAME_COLLECTION_URL });
      });
    });
  });

  describe("when isMovableInkSubdomain is called: betfair", () => {
    describe("when subdomain has movableink", () => {
      describe("when domain is betfair", () => {
        it("should return true", () => {
          expect(isMovableInkSubdomain("https://movableink.betfair.com")).toEqual(true);
        });

        describe("and url has country code second level domains", () => {
          it("should return true", () => {
            expect(isMovableInkSubdomain("https://movableink.betfair.bet.br")).toEqual(true);
          });
        });
      });

      describe("when domain is something else", () => {
        it("should return false", () => {
          expect(isMovableInkSubdomain("https://movableink.else.com")).toEqual(false);
        });
      });
    });

    describe("when subdomain has something else", () => {
      it("should return false", () => {
        expect(isMovableInkSubdomain("https://else.betfair.com")).toEqual(false);
      });
    });
  });
});
