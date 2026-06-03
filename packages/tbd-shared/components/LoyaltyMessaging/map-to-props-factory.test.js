import { makeMapStateToProps } from "./map-to-props-factory";

const messageMock = {
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

const state = {
  entities: {
    loyaltyMessages: {
      messages: [{ ...messageMock }, { ...messageMock, acknowledged: true }],
      connected: true,
    },
  },
};

jest.mock("@ppb/onsite-gateway-client", () => ({
  Connection: {
    connect: jest.fn(),
  },
}));

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  getUserDetails: jest.fn().mockReturnValue({
    countryCode: "IE",
    localeCodeBcp47: "en",
    currencyCode: "EUR",
    loggedIn: true,
  }),
}));

const setupMapStateToProps = () => {
  const containerProps = {};

  return makeMapStateToProps()(state, containerProps);
};

describe("makeMapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  it("should return the correct state props with no message", () => {
    const stateProps = setupMapStateToProps();

    expect(stateProps).toEqual({
      message: { ...messageMock },
      userDetails: {
        countryCode: "IE",
        localeCodeBcp47: "en",
        currencyCode: "EUR",
        loggedIn: true,
      },
    });
  });
});
