const { getGenericLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const BroadcastsAndStatisticsCardPO = require("@ppb/tbd-shared/components/BroadcastsAndStatisticsCard/BroadcastsAndStatisticsCard.web.po");
const { LiveStreamPO, FullScreenModalPO, SupportingContentButtonPO } = require("../../../../../page-objects");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const broadcastsAndStatisticsCardPO = new BroadcastsAndStatisticsCardPO();
const liveVideoButtonPO = new SupportingContentButtonPO(
  broadcastsAndStatisticsCardPO.liveVideoAndStatisticsBroadcastsButtons[0],
);
const statisticsButtonPO = new SupportingContentButtonPO(
  broadcastsAndStatisticsCardPO.liveVideoAndStatisticsBroadcastsButtons[1],
);
const liveStreamPO = new LiveStreamPO();
const fullScreenModalPO = new FullScreenModalPO();
const mockService = new MockService();

const BFF_MOCK = {
  urn: "ppb:tbd:view:generic:home",
  edges: [
    {
      node: {
        urn: "ppb:tbd:card:broadcastsAndStatistics:YIA-BhEAACIAMO7n/e/31760538",
        __typename: "BroadcastsAndStatisticsCard",
        eventBroadCasts: {
          dataVizUrl: "https://dummy.com.betfair/livevideoURL",
          liveVideoUrl: "https://dummy.com.betfair/livevideoURL",
        },
        eventBroadCastsIsCollapsed: true,
        statisticsViewLink: {
          viewUrn: "ppb:tbd:view:generic:statistics:YIA-BhEAACIAMO7n/e/31760538",
          viewUrl: "view/d-YIA-BhEAACIAMO7n%2Fe%2F31760538",
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        urn: "ppb:tbd:card:broadcastsAndStatistics:YIA-BhEAACIAMO7n/e/31760538",
        __typename: "BroadcastsAndStatisticsCard",
      },
    },
  ],
};

describe("Layout Entity - BroadcastsAndStatisticsCard", () => {
  describe("BroadCastsAndStatisticsCard is retrieved with statistics and live-video info ", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
      await browser.url(routes.getGenericViewUrl("home"));
      await browser.waitUntilDisplayed(broadcastsAndStatisticsCardPO.element);
    });

    it("[PRPI-8468] The 'Live Video' label and icon should be visible", async () => {
      expect(await liveVideoButtonPO.title.getText()).toBe("Live Video");
      expect(await liveVideoButtonPO.icon.isDisplayed()).toBe(true);
    });

    it("[PRPI-8469] The live-video iframe should not be displayed", async () => {
      expect(await broadcastsAndStatisticsCardPO.liveVideoSection.isDisplayed()).toBe(false);
      expect(await liveStreamPO.element.isDisplayed()).toBe(false);
    });

    it("[PRPI-8470] The 'Statistics' label and icon should be visible", async () => {
      expect(await statisticsButtonPO.title.getText()).toBe("Statistics");
      expect(await statisticsButtonPO.icon.isDisplayed()).toBe(true);
    });

    describe("When the user taps live-video section", () => {
      beforeAll(async () => {
        await liveVideoButtonPO.element.waitForClickable();
        await liveVideoButtonPO.element.click();
        await browser.waitUntilDisplayed(liveStreamPO.element);
      });

      it("[PRPI-8471] The 'Statistics' label and icon should be visible", async () => {
        expect(await statisticsButtonPO.title.getText()).toBe("Statistics");
        expect(await statisticsButtonPO.icon.isDisplayed()).toBe(true);
      });

      it("[PRPI-8472] The 'Live Video' label and icon should be visible", async () => {
        expect(await liveVideoButtonPO.title.getText()).toBe("Live Video");
        expect(await liveVideoButtonPO.icon.isDisplayed()).toBe(true);
      });

      it("[PRPI-8473] The live-video iframe should be displayed", async () => {
        expect(await broadcastsAndStatisticsCardPO.liveVideoSection.isDisplayed()).toBe(true);
        expect(await liveStreamPO.element.isDisplayed()).toBe(true);
      });
    });

    describe("When the user taps statistics section", () => {
      beforeAll(async () => {
        await statisticsButtonPO.element.waitForClickable();
        await statisticsButtonPO.element.click();
        await browser.waitUntilDisplayed(fullScreenModalPO.element);
      });

      it("[PRPI-8474] The statistics view should be rendered", async () => {
        expect(await fullScreenModalPO.element.isDisplayed()).toBe(true);
      });
    });
  });
});
