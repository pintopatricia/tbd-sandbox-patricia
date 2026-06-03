import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { Snackbar } from "@ppb/the-wall-web";
import LoyaltyMessaging from "./LoyaltyMessaging.web";
import { LOYALTY_MESSAGE_DISMISS_TIMEOUT } from "../../config/loyalty-messaging";
import * as TEST_ID from "./LoyaltyMessaging.web.selectors";
import { LoyaltyMessageModal } from "./snowflakes/LoyaltyMessageModal/LoyaltyMessageModal.web";

jest.mock("@ppb/the-wall-web", () => ({
  Snackbar: jest.fn(() => <snackbar-mock />),
}));

jest.mock("./snowflakes/LoyaltyMessageModal/LoyaltyMessageModal.web", () => ({
  LoyaltyMessageModal: jest.fn(() => <loyalty-messasing-mock />),
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useRef: jest.fn(() => ({ current: null })),
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
  dispatchConnect = jest.fn(),
  dispatchAcknowledgeMessage = jest.fn(),
  dispatchExternalPushAction = jest.fn(),
  dispatchDismissMessage = jest.fn(),
}) =>
  render(
    <LoyaltyMessaging
      message={message}
      userDetails={userDetails}
      dispatchConnect={dispatchConnect}
      dispatchAcknowledgeMessage={dispatchAcknowledgeMessage}
      dispatchExternalPushAction={dispatchExternalPushAction}
      dispatchDismissMessage={dispatchDismissMessage}
    />,
  );

const dispatchExternalPushActionMock = jest.fn();

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

  describe("when a message is received", () => {
    let dispatchAcknowledgeMessageSpy;
    let setTimeoutSpy;
    let clearTimeoutSpy;

    beforeEach(() => {
      dispatchAcknowledgeMessageSpy = jest.fn();
    });

    describe("and the displayType is Toast", () => {
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

      it("should display the message with the correct values", () => {
        const { container } = renderLoyaltyMessaging({
          message: { ...toastMessageMock, acknowledged: false },
          dispatchAcknowledgeMessage: dispatchAcknowledgeMessageSpy,
        });

        expect(container.querySelector(TEST_ID.TOAST)).toBeDefined();
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

      it("should dismiss the message after the timeout", () => {
        jest.useFakeTimers();

        setTimeoutSpy = jest.spyOn(global, "setTimeout");
        clearTimeoutSpy = jest.spyOn(global, "clearTimeout");

        renderLoyaltyMessaging({
          message: { ...toastMessageMock, acknowledged: false },
          dispatchAcknowledgeMessage: dispatchAcknowledgeMessageSpy,
        });

        expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), LOYALTY_MESSAGE_DISMISS_TIMEOUT);

        jest.runAllTimers();

        expect(dispatchAcknowledgeMessageSpy).toHaveBeenCalled();
        expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe("and the displayType is Modal", () => {
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

      it("should display the message with the correct values", () => {
        const { container } = renderLoyaltyMessaging({
          message: { ...modalMessageMock, acknowledged: false },
          dispatchAcknowledgeMessage: dispatchAcknowledgeMessageSpy,
        });

        expect(container.querySelector(TEST_ID.MODAL)).toBeDefined();
        expect(LoyaltyMessageModal).toHaveBeenCalledWith(
          {
            title: "Modal Header!",
            message: "Modal Text!",
            onDismiss: expect.any(Function),
            tcText: "T&C Apply",
            tcUrl: "https://promotions.betfair.com",
            onTcClick: expect.any(Function),
            buttonText: "Check active bonuses",
            onTap: expect.any(Function),
            imageSrc: "https://someimage.png",
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

      describe("and the Action Button triggered", () => {
        it("should dispatchExternalPushAction", () => {
          const { container } = renderLoyaltyMessaging({
            message: { ...modalMessageMock, acknowledged: false },
            dispatchExternalPushAction: dispatchExternalPushActionMock,
          });
          expect(container.querySelector(TEST_ID.MODAL)).toBeDefined();

          const { onTap } = LoyaltyMessageModal.mock.calls[0][0];
          onTap();

          expect(dispatchExternalPushActionMock).toHaveBeenCalled();
        });
      });

      describe("and on t&c click", () => {
        it("should dispatchExternalPushAction", () => {
          const event = {
            preventDefault: jest.fn(),
          };
          const { container } = renderLoyaltyMessaging({
            message: { ...modalMessageMock, acknowledged: false },
            dispatchExternalPushAction: dispatchExternalPushActionMock,
          });
          expect(container.querySelector(TEST_ID.MODAL)).toBeDefined();

          const { onTcClick } = LoyaltyMessageModal.mock.calls[0][0];
          onTcClick(event);

          expect(dispatchExternalPushActionMock).toHaveBeenCalled();
        });
      });
    });
  });
});
