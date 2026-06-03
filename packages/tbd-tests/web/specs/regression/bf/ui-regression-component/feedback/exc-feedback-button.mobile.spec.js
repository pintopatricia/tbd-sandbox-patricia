const { AppPO, FeedbackPO } = require("../../../../../page-objects");
const { getGenericLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const routes = require("../../../../../../utils/routes");
const MockService = require("../../../../../mock-essentials/mocking-service");

const feedbackPO = new FeedbackPO();
const appPO = new AppPO();
const mockService = new MockService();

const BFF_HOME_VIEW_MOCK = {
  urn: "ppb:tbd:view:generic:home",
  edges: [],
};

const createMocksAndOpenPage = async ({ loggedIn = "false", isExcFeedbackThrottleActive = false } = {}) => {
  const WEBSERVER_MOCK = {
    products: ["exchange"],
    exchangeEnabled: true,
    EXC_FEEDBACK_BUTTON: { isActive: isExcFeedbackThrottleActive },
    loggedIn,
  };
  await mockService.mockHttpRequest(getGenericLayout(BFF_HOME_VIEW_MOCK));
  await mockService.mockHttpRequest(await getIndexHTML(BFF_HOME_VIEW_MOCK.urn, WEBSERVER_MOCK));

  await browser.url(routes.getHomeViewUrl());
  await browser.waitUntilDisplayed(appPO.element);
};
describe("Feedback Button", () => {
  describe("when navigating to the exchange landing page", () => {
    describe("and the user is logged in", () => {
      describe("and the throttle 'EXC_FEEDBACK_BUTTON' is on", () => {
        beforeAll(async () => {
          await createMocksAndOpenPage({ loggedIn: "true", isExcFeedbackThrottleActive: true });
        });

        it("[PRPI-10466]the feedback button should be displayed", async () => {
          await browser.waitUntilDisplayed(feedbackPO.element, "Feedback button is not visible");
        });
      });

      describe("and the throttle 'EXC_FEEDBACK_BUTTON' is off", () => {
        beforeAll(async () => {
          await createMocksAndOpenPage({ loggedIn: "true", isExcFeedbackThrottleActive: false });
        });

        it("[PRPI-10467]the feedback button should not be displayed", async () => {
          expect(await feedbackPO.element.isDisplayed()).toEqual(false);
        });
      });
    });

    describe("and user is logged out", () => {
      beforeAll(async () => {
        await createMocksAndOpenPage({ loggedIn: "false", isExcFeedbackThrottleActive: true });
      });

      it("[PRPI-10468]the feedback button should not be displayed", async () => {
        expect(await feedbackPO.element.isDisplayed()).toEqual(false);
      });
    });
  });
});
