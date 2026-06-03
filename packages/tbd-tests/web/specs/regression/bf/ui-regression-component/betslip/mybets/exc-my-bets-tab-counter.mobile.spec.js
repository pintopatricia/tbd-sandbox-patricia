const { getMyBetsEXCViewMock } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");

const { getIndexHTML } = require("../../../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMyBetsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const routes = require("../../../../../../../utils/routes");
const MockService = require("../../../../../../mock-essentials/mocking-service");
const { MyBetsPagePO, MyBetsHeaderPO, TabsGroupPO, SegmentedControlPO } = require("../../../../../../page-objects");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../../../helpers/mybets.util");

const mockService = new MockService();

const myBetsPagePO = new MyBetsPagePO();
const myBetsHeaderPO = new MyBetsHeaderPO(myBetsPagePO.header);
const tabsGroupPO = new TabsGroupPO(myBetsHeaderPO.orderTypeFilter);
const segmentedControlPO = new SegmentedControlPO(myBetsHeaderPO.orderStatusFilter);

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

const setup = async ({ unmatchedCount = 0, matchedCount = 0 } = {}) => {
  const BFF_MOCK = getBFFMock({ unmatchedCount, matchedCount });
  await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
  await mockService.mockHttpRequest(getMyBetsLayout(BFF_MOCK));
  await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));

  await browser.url(routes.getMyBetsViewUrl("open", { matchedStatus: "matched" }));
  await browser.waitUntilDisplayed(myBetsPagePO.element, "My Bets page not visible");
  await browser.waitUntilEquals(tabsGroupPO.selectedTab, "Open");
};

describe("My Bets - Tab Counter", () => {
  describe("when navigating to my bets page with no open bets (totalUnmatchedBets = 0 and totalMatchedBets = 0)", () => {
    beforeAll(async () => {
      await setup({ unmatchedCount: 0, matchedCount: 0 });
    });
    it("[PRPI-5076] the matched/unmatched bets tabs should not display the bet counter", async () => {
      await expect(segmentedControlPO.options[0]).toHaveText("Unmatched");
      await expect(segmentedControlPO.options[1]).toHaveText("Matched");
    });
  });

  describe("when navigating to my bets page with matched and unmatched bets (totalUnmatchedBets > 0 and totalMatchedBets > 0)", () => {
    beforeAll(async () => {
      await setup({ unmatchedCount: 1, matchedCount: 100 });
    });
    it("[PRPI-5077] the unmatched bets tab should display the bet counter at 1", async () => {
      await expect(segmentedControlPO.options[0]).toHaveText("Unmatched (1)");
    });
    it("[PRPI-5078] the matched bets tab should display the bet counter at 100", async () => {
      await expect(segmentedControlPO.options[1]).toHaveText("Matched (100)");
    });
  });

  describe("when navigating to my bets page with only matched bets (totalUnmatchedBets = 0 and totalMatchedBets > 0)", () => {
    beforeAll(async () => {
      await setup({ unmatchedCount: 0, matchedCount: 1 });
    });
    it("[PRPI-5079] the unmatched bets tab should not display the bet counter", async () => {
      await expect(segmentedControlPO.options[0]).toHaveText("Unmatched");
    });
    it("[PRPI-5080] the matched bets tab should display the bet counter at 1", async () => {
      await expect(segmentedControlPO.options[1]).toHaveText("Matched (1)");
    });
  });

  describe("when navigating to my bets page with only unmatched bets (totalUnmatchedBets > 0 and totalMatchedBets = 0)", () => {
    beforeAll(async () => {
      await setup({ unmatchedCount: 50, matchedCount: 0 });
    });
    it("[PRPI-5081] the unmatched bets tab should display the bet counter at 50", async () => {
      await expect(segmentedControlPO.options[0]).toHaveText("Unmatched (50)");
    });
    it("[PRPI-5082] the matched bets tab should not display the bet counter", async () => {
      await expect(segmentedControlPO.options[1]).toHaveText("Matched");
    });
  });
});
