const { getAppContext, getGenericLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { GenericScreenSO, FeedbackSO } = require("../../../../../screen-objects");
const MockService = require("../../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../../helpers/urls");

const feedbackSO = new FeedbackSO();
const genericScreenSO = new GenericScreenSO();
const mockService = new MockService();

const BFF_HOME_VIEW_MOCK = {
  urn: "ppb:tbd:view:generic:home",
  bottomBar: {
    tiles: [
      {
        tileType: "HOME",
        viewLink: {
          viewUrn: "ppb:tbd:view:generic:home",
          viewUrl: "",
        },
      },
      {
        tileType: "BROWSE",
        viewLink: {
          viewUrn: "ppb:tbd:view:browse:sports",
          viewUrl: "browse/b-sports",
        },
      },
      {
        tileType: "MY_BETS",
        viewLink: {
          viewUrn: "ppb:tbd:view:myBets:open",
          viewUrl: "mybets/mybets-open",
        },
      },
      {
        tileType: "GAMING",
        viewLink: {
          viewUrn: "ppb:tbd:view:gaming:1",
          viewUrl: "casino/gm-1",
        },
      },
    ],

    hasProductSwitcher: true,
  },
  edges: [],
  partialEdges: [],
};

const setup = async ({ loggedIn = "false", isExcFeedbackThrottleActive = false, dismissOnboarding = false } = {}) => {
  const APP_CONTEXT_MOCK = {
    throttles: {
      PRODUCT_SWITCHER_NATIVE: {
        isActive: true,
      },
      EXC_ALLOWED_JURISDICTION: { isActive: true },
      EXC_FEEDBACK_BUTTON: { isActive: isExcFeedbackThrottleActive },
    },
    loggedIn,
    selectedExchangeDefaultProduct: "NEME",
    phoenixMigratedUser: true,
    selectedDefaultProduct: "EXCHANGE",
  };

  await mockService.mockHttpRequest(getAppContext(APP_CONTEXT_MOCK));
  await mockService.mockHttpRequest(getGenericLayout(BFF_HOME_VIEW_MOCK));
  await startApp("home", { shouldTerminateAppBeforeStart: true, dismissOnboarding });
  await browser.waitUntilDisplayed(genericScreenSO.element);
};
describe("Feedback Button", () => {
  describe("when navigating to the exchange landing page", () => {
    describe("and the user is logged in", () => {
      describe("and the throttle 'EXC_FEEDBACK_BUTTON' is on", () => {
        beforeAll(async () => {
          await setup({ loggedIn: true, isExcFeedbackThrottleActive: true, dismissOnboarding: true });
        });

        it("[PRPI-10466]the feedback button should be displayed", async () => {
          await browser.waitUntilDisplayed(feedbackSO.element, "Feedback button is not visible");
        });
      });

      describe("and the throttle 'EXC_FEEDBACK_BUTTON' is off", () => {
        beforeAll(async () => {
          await setup({ loggedIn: true, isExcFeedbackThrottleActive: false });
        });

        it("[PRPI-10467]the feedback button should not be displayed", async () => {
          expect(await feedbackSO.element.isDisplayed()).toEqual(false);
        });
      });
    });

    describe("and user is logged out", () => {
      beforeAll(async () => {
        await setup({ isExcFeedbackThrottleActive: true });
      });

      it("[PRPI-10468]the feedback button should not be displayed", async () => {
        expect(await feedbackSO.element.isDisplayed()).toEqual(false);
      });
    });
  });
});
