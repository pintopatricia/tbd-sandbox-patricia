import { render } from "@testing-library/react-native";
import { AppState, Platform } from "react-native";
import { Snackbar } from "@ppb/the-wall-native";
import { LoyaltyMessageModal } from "./snowflakes/LoyaltyMessageModal/LoyaltyMessageModal.native";
import LoyaltyMessaging from "./LoyaltyMessaging.native";
import { TOAST, MODAL } from "./LoyaltyMessaging.native.selectors";

const mockNavigate = jest.fn();

jest.mock("@ppb/tbd-router/native", () => ({
  navigate: (viewLink) => mockNavigate(viewLink),
  DisplayModeTypes: jest.fn(() => ({
    Browser: "browser",
  })),
}));

jest.mock("@ppb/the-wall-native", () => ({
  Snackbar: jest.fn(() => <snackbar-mock />),
}));

jest.mock("./snowflakes/LoyaltyMessageModal/LoyaltyMessageModal.native", () => ({
  LoyaltyMessageModal: jest.fn(() => <loyalty-message-mock />),
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useRef: jest.fn(() => ({ current: null })),
}));

jest.mock("../../helpers/external-links", () => ({
  getExternalLink: jest.fn((linkType) => {
    if (linkType === "LOYALTY_CLUB") {
      return "https://promos.skybet.com.nxt.ppbdev.com/skybetclub";
    }
    if (linkType === "SAFER_GAMBLING_LOGGED_IN") {
      return "https://playerprotection.skybet.com.nxt.ppbdev.com/";
    }
    throw new Error(`Unknown link type passed to getExternalLink mock: ${linkType}`);
  }),
}));

const userDetails = {
  currencyCode: "GBP",
  timezone: "timezone",
  exchangeContentGroup: {
    regionCode: "en",
    language: "en",
  },
  localeCode: "en",
  localeCodeBcp47: "en-GB",
  loggedIn: false,
  countryCode: "en",
  jurisdiction: { jurisdiction: "international" },
  productExclusions: [],
};

const renderLoyaltyMessaging = ({
  message = null,
  basePath = null,
  dispatchConnect = jest.fn(),
  dispatchAcknowledgeMessage = jest.fn(),
  dispatchAppVisibilityChange = jest.fn(),
  dispatchDismissMessageAction = jest.fn(),
}) =>
  render(
    <LoyaltyMessaging
      message={message}
      userDetails={userDetails}
      basePath={basePath}
      dispatchConnect={dispatchConnect}
      dispatchAcknowledgeMessage={dispatchAcknowledgeMessage}
      dispatchAppVisibilityChange={dispatchAppVisibilityChange}
      dispatchDismissMessage={dispatchDismissMessageAction}
    />,
  );

describe("Loyalty Messaging component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe("when message is null", () => {
    it("should not display any content", () => {
      renderLoyaltyMessaging({ message: null });

      expect(Snackbar).not.toHaveBeenCalled();
    });
  });

  describe("when a toast message is received", () => {
    let dispatchAcknowledgeMessageSpy;
    let addEventListenerSpy;
    const toastMessageMock = {
      content: {
        subscriptionId: "_Wehpntb_80Fwp-N-kiR-",
        messageType: "TOPIC_MESSAGE",
        correlationId: "27146e3a-a343-4e21-bf8c-07bc58e0f871",
        templateId: "ToastWithHeaderBodyMessage",
        message: {
          urn: "ppb:e2e:qualificationToastMessage",
          template: {
            header: "Over ${params.experts} experts hate him!",
            text: "Learn how, in just ${params.days} days, he went from ${params.max:monetary} to ${params.min:monetary}!",
            icon: "https://external.icon.url/externalIcon.png",
          },
          params: {
            experts: "5000",
            days: "12",
            max: "1000",
            min: "0",
          },
          displayType: "TOAST",
        },
        key: "E2E_PROGRESS",
        ackRequired: true,
        topic: "relevantMessaging",
        publishTime: "2022-03-24T14:55:09.117104",
      },
      acknowledged: false,
      isDisplayed: true,
    };

    beforeEach(() => {
      dispatchAcknowledgeMessageSpy = jest.fn();
      addEventListenerSpy = jest.spyOn(AppState, "addEventListener");
    });

    it("should add an eventListener for visibilitychange", () => {
      renderLoyaltyMessaging({
        message: { ...toastMessageMock, acknowledged: false },
        dispatchAcknowledgeMessage: dispatchAcknowledgeMessageSpy,
      });

      expect(addEventListenerSpy).toHaveBeenCalledWith("change", expect.any(Function));
    });

    it("should display the message with the correct values", () => {
      const component = renderLoyaltyMessaging({
        message: { ...toastMessageMock, acknowledged: false },
        dispatchAcknowledgeMessage: dispatchAcknowledgeMessageSpy,
      });

      expect(component.getByTestId(TOAST)).toBeDefined();
      expect(Snackbar).toHaveBeenCalledWith(
        {
          bigIcon: true,
          centeredIcon: true,
          description: "Learn how, in just 12 days, he went from £1,000.00 to £0.00!",
          externalIcon: "https://external.icon.url/externalIcon.png",
          onClose: expect.any(Function),
          title: "Over 5000 experts hate him!",
        },
        undefined,
      );
    });

    it("should dispatch an acknowledgeMessage action", () => {
      renderLoyaltyMessaging({
        message: { ...toastMessageMock, acknowledged: false },
        dispatchAcknowledgeMessage: dispatchAcknowledgeMessageSpy,
      });

      expect(dispatchAcknowledgeMessageSpy).toHaveBeenCalled();
    });
  });

  describe("when a loyalty message is received", () => {
    let dispatchAcknowledgeMessageSpy;
    const modalMessageMock = {
      content: {
        subscriptionId: "_Wehpntb_80Fwp-N-kiR-",
        messageType: "TOPIC_MESSAGE",
        correlationId: "27146e3a-a343-4e21-bf8c-07bc58e0f871",
        templateId: "ModalMessage",
        message: {
          urn: "ppb:e2e:qualificationModalMessage",
          template: {
            header: "Modal Header!",
            text: "Modal Text!",
            image: "https://someimage.png",
            buttonText: "Check active bonuses",
            buttonUrl: "football/s-1",
            tcText: "T&C Apply",
            tcUrl: "https://promotions.betfair.com",
          },
          displayType: "FULL_SCREEN",
        },
        key: "E2E_PROGRESS",
        ackRequired: true,
        topic: "relevantMessaging",
        publishTime: "2022-03-24T14:55:09.117104",
      },
      acknowledged: false,
      isDisplayed: true,
    };

    beforeEach(() => {
      dispatchAcknowledgeMessageSpy = jest.fn();
    });

    it("should display the message with the correct values", () => {
      const component = renderLoyaltyMessaging({
        message: { ...modalMessageMock, acknowledged: false },
        dispatchAcknowledgeMessage: dispatchAcknowledgeMessageSpy,
      });

      expect(component.getByTestId(MODAL)).toBeDefined();
      expect(LoyaltyMessageModal).toHaveBeenCalledWith(
        {
          buttonText: "Check active bonuses",
          imageAlt: undefined,
          imageSrc: "https://someimage.png",
          message: "Modal Text!",
          tcText: "T&C Apply",
          tcUrl: "https://promotions.betfair.com",
          onTcClick: expect.any(Function),
          onDismiss: expect.any(Function),
          onTap: expect.any(Function),
          title: "Modal Header!",
        },
        undefined,
      );
    });

    it("should dispatch an acknowledgeMessage action", () => {
      renderLoyaltyMessaging({
        message: { ...modalMessageMock, acknowledged: false },
        dispatchAcknowledgeMessage: dispatchAcknowledgeMessageSpy,
      });

      expect(dispatchAcknowledgeMessageSpy).toHaveBeenCalled();
    });

    describe("and the action button is pressed", () => {
      it("should set the state as visible", () => {
        renderLoyaltyMessaging({
          message: { ...modalMessageMock, acknowledged: false },
          dispatchAcknowledgeMessage: dispatchAcknowledgeMessageSpy,
          basePath: "football/s-1",
        });

        const { onTap } = LoyaltyMessageModal.mock.calls[0][0];
        onTap();

        expect(mockNavigate).toHaveBeenCalled();
      });
    });

    describe("and the t&c is pressed", () => {
      it("should navigate", () => {
        renderLoyaltyMessaging({
          message: { ...modalMessageMock, acknowledged: false },
          dispatchAcknowledgeMessage: dispatchAcknowledgeMessageSpy,
        });

        const { onTcClick } = LoyaltyMessageModal.mock.calls[0][0];
        onTcClick();

        expect(mockNavigate).toHaveBeenCalled();
      });
    });
  });

  describe("when a loyalty message for Sky Bet Club is received", () => {
    const modalMessageMock = {
      content: {
        subscriptionId: "_Wehpntb_80Fwp-N-kiR-",
        messageType: "TOPIC_MESSAGE",
        correlationId: "27146e3a-a343-4e21-bf8c-07bc58e0f871",
        templateId: "ModalMessage",
        message: {
          urn: "ppb:messaging:promoQualification",
          template: {
            header: "Congratulations",
            text: "Your weekly reward has landed!",
            image: "https://someimage.png",
            buttonText: "Go to Sky Bet Club",
            buttonUrl: "https://promos.skybet.com.nxt.ppbdev.com/skybetclub",
            tcText: "T&C Apply",
            tcUrl: "https://promos.skybet.com.nxt.ppbdev.com/skybetclub",
          },
          displayType: "FULL_SCREEN",
        },
        key: "E2E_PROGRESS",
        ackRequired: false,
        topic: "relevantMessaging",
        publishTime: "2022-03-24T14:55:09.117104",
      },
      acknowledged: false,
      isDisplayed: true,
    };

    it("should display the message with the correct values", () => {
      const component = renderLoyaltyMessaging({
        message: { ...modalMessageMock, acknowledged: false },
        basePath: "skybetClubURL",
      });

      expect(component.getByTestId(MODAL)).toBeDefined();
      expect(LoyaltyMessageModal).toHaveBeenCalledWith(
        {
          buttonText: "Go to Sky Bet Club",
          imageAlt: undefined,
          imageSrc: "https://someimage.png",
          message: "Your weekly reward has landed!",
          tcText: "T&C Apply",
          tcUrl: "https://promos.skybet.com.nxt.ppbdev.com/skybetclub",
          onTcClick: expect.any(Function),
          onDismiss: expect.any(Function),
          onTap: expect.any(Function),
          title: "Congratulations",
        },
        undefined,
      );
    });

    describe("and the action button is pressed", () => {
      it("should invoke navigate with the correct viewDisplayMode", () => {
        renderLoyaltyMessaging({
          message: { ...modalMessageMock, acknowledged: false },
          basePath: "skybetClubURL",
        });

        const { onTap } = LoyaltyMessageModal.mock.calls[0][0];
        onTap();

        expect(mockNavigate).toHaveBeenCalledWith({
          viewDisplayMode: "BLANK_WEBVIEW",
          viewUrl: "https://promos.skybet.com.nxt.ppbdev.com/skybetclub",
          viewUrn: "ppb:tbd:view:external",
        });
      });

      it("should dispatch a dismissMessage action on android", () => {
        Platform.OS = "android";
        const dispatchDismissMessageSpy = jest.fn();

        renderLoyaltyMessaging({
          message: { ...modalMessageMock, acknowledged: false },
          dispatchDismissMessageAction: dispatchDismissMessageSpy,
          basePath: "skybetClubURL",
        });

        const { onTap } = LoyaltyMessageModal.mock.calls[0][0];
        onTap();

        expect(dispatchDismissMessageSpy).toHaveBeenCalled();
      });
    });
  });

  describe("when a loyalty message for Safer Gambling is received", () => {
    const modalMessageMock = {
      content: {
        subscriptionId: "_Wehpntb_80Fwp-N-kiR-",
        messageType: "TOPIC_MESSAGE",
        correlationId: "27146e3a-a343-4e21-bf8c-07bc58e0f871",
        templateId: "ModalMessage",
        message: {
          urn: "ppb:messaging:saferGambling",
          template: {
            header: "Play Responsibly",
            text: "Set your limits today",
            image: "https://someimage.png",
            buttonText: "Safer Gambling",
            buttonUrl: "https://playerprotection.skybet.com.nxt.ppbdev.com/",
            tcText: "T&C Apply",
          },
          displayType: "FULL_SCREEN",
        },
        key: "SAFER_GAMBLING",
        ackRequired: false,
        topic: "relevantMessaging",
        publishTime: "2022-03-24T14:55:09.117104",
      },
      acknowledged: false,
      isDisplayed: true,
    };

    it("should display the message with the correct values", () => {
      const component = renderLoyaltyMessaging({
        message: { ...modalMessageMock, acknowledged: false },
        basePath: "saferGamblingURL",
      });

      expect(component.getByTestId(MODAL)).toBeDefined();
      expect(LoyaltyMessageModal).toHaveBeenCalledWith(
        {
          buttonText: "Safer Gambling",
          imageAlt: undefined,
          imageSrc: "https://someimage.png",
          message: "Set your limits today",
          tcText: "T&C Apply",
          tcUrl: undefined,
          onTcClick: expect.any(Function),
          onDismiss: expect.any(Function),
          onTap: expect.any(Function),
          title: "Play Responsibly",
        },
        undefined,
      );
    });

    describe("and the action button is pressed", () => {
      it("should invoke navigate with the correct viewDisplayMode", () => {
        renderLoyaltyMessaging({
          message: { ...modalMessageMock, acknowledged: false },
          basePath: "saferGamblingURL",
        });

        const lastCallIndex = LoyaltyMessageModal.mock.calls.length - 1;
        const { onTap } = LoyaltyMessageModal.mock.calls[lastCallIndex][0];
        onTap();

        expect(mockNavigate).toHaveBeenCalledWith({
          viewDisplayMode: "BLANK_WEBVIEW",
          viewUrl: "https://playerprotection.skybet.com.nxt.ppbdev.com/",
          viewUrn: "ppb:tbd:view:external",
        });
      });
    });
  });
});
