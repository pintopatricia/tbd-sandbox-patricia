const { getMyBetsEXCViewMock } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");

const routes = require("../../../../../utils/routes");
const MockService = require("../../../../mock-essentials/mocking-service");
const { MyBetsScreenSO, MyBetsHeaderSO, TabsGroupSO, SegmentedControlSO } = require("../../../../screen-objects");
const { getAppContext } = require("@ppb/tbd-shared/mocks/app-context/app-context.controller");
const { getMockedImage } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const {
  getMyBetsLayout,
  getHomeLayoutWithViewLink,
  getCardResults,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getStartViewLink } = require("../../../../helpers/view-link-start");
const { startApp } = require("../../../../helpers/urls");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const mockService = new MockService();

const myBetsScreenSO = new MyBetsScreenSO();
const myBetsHeaderSO = new MyBetsHeaderSO(myBetsScreenSO.header);
const tabsGroupSO = new TabsGroupSO(myBetsHeaderSO.orderTypeFilter);
const segmentedControlSO = new SegmentedControlSO();

const getBFFMock = ({ unmatchedCount = 0, matchedCount = 0 } = {}) => {
  const BASE_MOCK = [];
  return getMyBetsEXCViewMock(BASE_MOCK, {
    hasFooter: true,
    isOpenMatched: true,
    isOpenUnmatched: false,
    unmatchedCount,
    matchedCount,
  });
};

const setup = async ({ shouldTerminateAppBeforeStart = false, unmatchedCount = 0, matchedCount = 0 } = {}) => {
  const BFF_MOCK = getBFFMock({ unmatchedCount, matchedCount });
  await mockService.mockHttpRequest(getAppContext({}));
  await mockService.mockHttpRequest(getMockedImage({ path: ".*mockedImage.*" }, 404));
  await mockService.mockHttpRequest(getScaResponse({}));
  await mockService.mockHttpRequest(getMyBetsLayout(BFF_MOCK));
  await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));

  const HOME_VIEW_LINK = getStartViewLink(routes.getMyBetsViewUrl("open", { matchedStatus: "matched" }));
  await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));
  await startApp("home", {
    isViewLinkStartPage: !!HOME_VIEW_LINK,
    shouldTerminateAppBeforeStart,
  });

  await browser.waitUntilDisplayed(myBetsScreenSO.element, "My Bets screen not visible");
  await browser.waitUntilEquals(tabsGroupSO.selectedTab, "Open");
};

describe("My Bets - Tab Counter", () => {
  describe("when navigating to my bets page with no open bets (totalUnmatchedBets = 0 and totalMatchedBets = 0)", () => {
    beforeAll(async () => {
      await setup({ unmatchedCount: 0, matchedCount: 0 });
    });

    it("[PRPI-5076]the matched/unmatched bets tabs should not display the bet counter", async () => {
      expect(segmentedControlSO.options[0]).toHaveText("Unmatched");
      expect(segmentedControlSO.options[1]).toHaveText("Matched");
    });
  });

  describe("when navigating to my bets page with matched and unmatched bets (totalUnmatchedBets > 0 and totalMatchedBets > 0)", () => {
    beforeAll(async () => {
      await setup({ shouldTerminateAppBeforeStart: true, unmatchedCount: 1, matchedCount: 100 });
    });

    it("[PRPI-5077]the unmatched bets tab should display the bet counter at 1", async () => {
      expect(segmentedControlSO.options[0]).toHaveText("Unmatched (1)");
    });

    it("[PRPI-5078]the matched bets tab should display the bet counter at 100", async () => {
      expect(segmentedControlSO.options[1]).toHaveText("Matched (100)");
    });
  });

  describe("when navigating to my bets page with only matched bets (totalUnmatchedBets = 0 and totalMatchedBets > 0)", () => {
    beforeAll(async () => {
      await setup({ shouldTerminateAppBeforeStart: true, unmatchedCount: 0, matchedCount: 1 });
    });

    it("[PRPI-5079]the unmatched bets tab should not display the bet counter", async () => {
      expect(segmentedControlSO.options[0]).toHaveText("Unmatched");
    });

    it("[PRPI-5080]the matched bets tab should display the bet counter at 1", async () => {
      expect(segmentedControlSO.options[1]).toHaveText("Matched (1)");
    });
  });

  describe("when navigating to my bets page with only unmatched bets (totalUnmatchedBets > 0 and totalMatchedBets = 0)", () => {
    beforeAll(async () => {
      await setup({ shouldTerminateAppBeforeStart: true, unmatchedCount: 50, matchedCount: 0 });
    });

    it("[PRPI-5081]the unmatched bets tab should display the bet counter at 50", async () => {
      expect(segmentedControlSO.options[0]).toHaveText("Unmatched (50)");
    });

    it("[PRPI-5082]the matched bets tab should not display the bet counter", async () => {
      expect(segmentedControlSO.options[1]).toHaveText("Matched");
    });
  });
});
