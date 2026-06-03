const { getGenericLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const BroadcastsAndStatisticsCardSO = require("@ppb/tbd-shared/components/BroadcastsAndStatisticsCard/BroadcastsAndStatisticsCard.so");
const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");

const { LiveStreamSO, SupportingContentButtonSO, ModalHeaderSO } = require("../../../../screen-objects");

const broadcastsAndStatisticsCardSO = new BroadcastsAndStatisticsCardSO();

const liveVideoButtonSO = new SupportingContentButtonSO(
  broadcastsAndStatisticsCardSO.liveVideoAndStatisticsBroadcastsButtons[0],
);
const statisticsButtonSO = new SupportingContentButtonSO(
  broadcastsAndStatisticsCardSO.liveVideoAndStatisticsBroadcastsButtons[1],
);

const liveStreamSO = new LiveStreamSO();
const modalHeaderSO = new ModalHeaderSO();

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
  describe("When the user is on a given screen and BroadCastsAndStatisticsCard is retrieved with statistics and live-video info", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
      await startApp("home");
      await browser.waitUntilDisplayed(broadcastsAndStatisticsCardSO.element);
    });

    it("[PRPI-3882] The 'Live Video' label and icon should be visible", async () => {
      expect(await liveVideoButtonSO.title.getText()).toBe("Live Video");
      expect(await liveVideoButtonSO.icon.isDisplayed()).toBe(true);
    });

    it("[PRPI-3883] The live-video section should be collapsed", async () => {
      expect(await liveVideoButtonSO.chevronCollapsed.isDisplayed()).toBe(true);
    });

    it("[PRPI-3884] The live-video iframe should not be displayed", async () => {
      expect(await broadcastsAndStatisticsCardSO.liveVideoSection.isDisplayed()).toBe(false);
      expect(await liveStreamSO.element.isDisplayed()).toBe(false);
    });

    it("[PRPI-3885] The 'Statistics' label should be visible", async () => {
      expect(await statisticsButtonSO.title.getText()).toBe("Statistics");
    });

    describe("When the user taps live-video section", () => {
      beforeAll(async () => {
        await browser.waitUntilClickableNative(liveVideoButtonSO.element);
        await liveVideoButtonSO.element.click();
        await browser.waitUntilDisplayed(liveStreamSO.element);
      });

      it("[PRPI-3886] The 'Statistics' label should be visible", async () => {
        expect(await statisticsButtonSO.title.getText()).toBe("Statistics");
      });

      it("[PRPI-3887] The 'Live Video' label and icon should be visible", async () => {
        expect(await liveVideoButtonSO.title.getText()).toBe("Live Video");
        expect(await liveVideoButtonSO.icon.isDisplayed()).toBe(true);
      });

      it("[PRPI-3888] The live-video section should be expanded", async () => {
        expect(await liveVideoButtonSO.chevronExpanded.isDisplayed()).toBe(true);
      });

      it("[PRPI-3889] The live-video iframe should be displayed", async () => {
        expect(await liveStreamSO.element.isDisplayed()).toBe(true);
      });
    });

    describe("When the user taps statistics section", () => {
      beforeAll(async () => {
        await browser.waitUntilClickableNative(liveVideoButtonSO.element);
        await liveVideoButtonSO.element.click();
        await mockService.mockHttpRequest(
          getGenericLayout({
            ...BFF_MOCK,
            urn: "ppb:tbd:view:generic:statistics:YIA-BhEAACIAMO7n/e/31760538",
            title: "Statistics",
            category: "MODAL",
          }),
        );
        await browser.waitUntilClickableNative(statisticsButtonSO.element);
        await statisticsButtonSO.element.click();
        await browser.waitUntilDisplayed(modalHeaderSO.title);
      });

      it("[PRPI-3890] The statistics view should be rendered", async () => {
        expect(await modalHeaderSO.title.getText()).toBe("Statistics");
      });
    });
  });
});
