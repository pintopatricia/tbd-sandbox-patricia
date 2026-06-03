const {
  MyBetsPagePO,
  MyBetsHeaderPO,
  SegmentedControlPO,
  BottomBarPO,
  TabsGroupPO,
} = require("../../../../page-objects");

const { getMyBetsEXCViewMock } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");

const { getMyBetsLayout, getGenericLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const mockService = new MockService();
const myBetsPO = new MyBetsPagePO();
const myBetsHeaderPO = new MyBetsHeaderPO(myBetsPO.header);
const tabsPO = new TabsGroupPO(myBetsHeaderPO.orderTypeFilter);
const segmentedControlPO = new SegmentedControlPO(myBetsHeaderPO.orderStatusFilter);
const bottomBarPO = new BottomBarPO();

const BFF_HOME_VIEW_MOCK = {
  urn: "ppb:tbd:view:generic:home",
  edges: [],
};

const OPEN_UNMATCHED_VIEW_MOCK = getMyBetsEXCViewMock([], { isOpenUnmatched: true });
const OPEN_MATCHED_VIEW_MOCK = getMyBetsEXCViewMock([], { isOpenMatched: true });
const SETTLED_VIEW_MOCK = getMyBetsEXCViewMock([], {});

const clickOnElement = async (element) => {
  await element.waitForClickable();
  await element.click();
};

const clickOnOpenFilter = async () => {
  await clickOnElement(tabsPO.tabs[0]);
  await browser.waitUntilEquals(tabsPO.selectedTab, "Open");
  await browser.waitUntilDisplayed(myBetsHeaderPO.orderStatusFilter, "Order Status filter is not displayed");
};

const clickOnSettledFilter = async () => {
  await clickOnElement(tabsPO.tabs[1]);
  await browser.waitUntilEquals(tabsPO.selectedTab, "Settled");
  await browser.waitUntilNotDisplayed(myBetsHeaderPO.orderStatusFilter, "Order Status filter is still displayed");
};

const clickOnMatchedFilter = async () => {
  await clickOnElement(segmentedControlPO.options[1]);
  await browser.waitUntilEquals(segmentedControlPO.selectedOption, "Matched");
};

const goToHomeAndBackToMyBets = async () => {
  await clickOnElement(bottomBarPO.tiles[0]);
  await browser.waitUntilNotDisplayed(myBetsPO.element, "My Bets Page is visible");
  await clickOnElement(bottomBarPO.tiles[2]);
  await browser.waitUntilDisplayed(myBetsPO.element, "My Bets Page is not visible");
  await browser.waitUntilDisplayed(myBetsHeaderPO.element, "My Bets Header is not visible");
};

describe("EXC My Bets - Navigation", () => {
  beforeAll(async () => {
    // My Bets Open Unmatched as entrypoint
    await mockService.mockHttpRequest(await getIndexHTML(OPEN_UNMATCHED_VIEW_MOCK.urn));
    await mockService.mockHttpRequest(getMyBetsLayout(OPEN_UNMATCHED_VIEW_MOCK));
    await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));

    // Home Page
    await mockService.mockHttpRequest(getGenericLayout(BFF_HOME_VIEW_MOCK, { withBottomBar: false }));
  });

  // JOURNEY: My Bets Open -> Settled -> Home -> My Bets (Settled)
  describe("when the user enters on my bets for the first time (open unmatched)", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMyBetsLayout(SETTLED_VIEW_MOCK));

      await browser.url(routes.getMyBetsViewUrl("open", { matchedStatus: "unmatched" }));
      await browser.waitUntilDisplayed(myBetsPO.emptyState, "My Bets Empty State not visible");
    });

    it("[PRPI-5545] should have the 'Open' order type tab selected", async () => {
      expect(await tabsPO.selectedTab.getText()).toBe("Open");
    });

    it("[PRPI-5546] should have the 'Unmatched' order status segment selected", async () => {
      expect(await segmentedControlPO.selectedOption.getText()).toBe("Unmatched");
    });

    describe("and then the user clicks on the 'Settled' order type filter", () => {
      beforeAll(async () => {
        await clickOnSettledFilter();
      });

      it("[PRPI-5547] should have the 'Settled' order type tab selected", async () => {
        await browser.waitUntilEquals(tabsPO.selectedTab, "Settled");
      });

      it("[PRPI-5548] should not have the order status segment", async () => {
        await browser.waitUntilNotDisplayed(myBetsHeaderPO.orderStatusFilter, "Segment Filter is visible");
      });

      describe("and the user goes to 'Home' and back to 'My Bets' trough the navigation bar", () => {
        beforeAll(async () => {
          await goToHomeAndBackToMyBets();
        });

        it("[PRPI-5549] should have the 'Settled' order type tab selected", async () => {
          await browser.waitUntilEquals(tabsPO.selectedTab, "Settled");
        });

        it("[PRPI-5549] should not have the order status segment", async () => {
          await browser.waitUntilNotDisplayed(myBetsHeaderPO.orderStatusFilter, "Segment Filter is visible");
        });
      });
    });
  });

  // JOURNEY: My Bets Open -> Matched -> Home -> My Bets (Open Matched)
  describe("when the user enters on my bets for the first time (open unmatched)", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMyBetsLayout(OPEN_MATCHED_VIEW_MOCK));

      await browser.url(routes.getMyBetsViewUrl("open", { matchedStatus: "unmatched" }));
      await browser.waitUntilDisplayed(myBetsPO.emptyState, "My Bets Empty State not visible");
    });

    it("[PRPI-8357] should have the 'Open' unmatched order type tab selected", async () => {
      expect(await tabsPO.selectedTab.getText()).toBe("Open");
    });

    it("[PRPI-8358] should have the 'Unmatched' open order status segment selected", async () => {
      expect(await segmentedControlPO.selectedOption.getText()).toBe("Unmatched");
    });

    describe("and then the user clicks on the 'Matched' status filter", () => {
      beforeAll(async () => {
        await clickOnMatchedFilter();
      });

      it("[PRPI-5550] should have the 'Open' order type tab selected", async () => {
        expect(await tabsPO.selectedTab.getText()).toBe("Open");
      });

      it("[PRPI-5551] should have the 'Matched' order status segment selected", async () => {
        expect(await segmentedControlPO.selectedOption.getText()).toBe("Matched");
      });

      describe("and the user goes to 'Home' and back to 'My Bets' trough the navigation bar", () => {
        beforeAll(async () => {
          await goToHomeAndBackToMyBets();
          await browser.waitUntilDisplayed(
            segmentedControlPO.selectedOption,
            "Order Status selected filter is not displayed",
          );
          await browser.waitUntilEquals(segmentedControlPO.selectedOption, "Matched");
        });

        it("[PRPI-5552] should have the 'Open' order type tab selected", async () => {
          expect(await tabsPO.selectedTab.getText()).toBe("Open");
        });

        it("[PRPI-5552] should have the 'Matched' order status segment selected", async () => {
          expect(await segmentedControlPO.selectedOption.getText()).toBe("Matched");
        });
      });
    });
  });

  // JOURNEY: My Bets Open -> Matched -> Settled -> My Bets Open
  describe("when the user enters on my bets for the first time (open unmatched)", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMyBetsLayout(OPEN_MATCHED_VIEW_MOCK));

      await browser.url(routes.getMyBetsViewUrl("open", { matchedStatus: "unmatched" }));
      await browser.waitUntilDisplayed(myBetsPO.emptyState, "My Bets Empty State not displayed");
    });

    it("[PRPI-8639] should have tab 'Open' unmatched order type selected", async () => {
      expect(await tabsPO.selectedTab.getText()).toBe("Open");
    });

    it("[PRPI-8359] should have the 'Unmatched' settled order status segment selected", async () => {
      expect(await segmentedControlPO.selectedOption.getText()).toBe("Unmatched");
    });

    describe("and then the user clicks on the 'Matched' status filter", () => {
      beforeAll(async () => {
        await clickOnMatchedFilter();
      });

      it("[PRPI-8637] should have the 'Open' matched order type tab selected", async () => {
        expect(await tabsPO.selectedTab.getText()).toBe("Open");
      });

      it("[PRPI-8638] should have selected the 'Matched' order status segment", async () => {
        expect(await segmentedControlPO.selectedOption.getText()).toBe("Matched");
      });

      describe("and the user clicks on the 'Settled' order type filter and back to 'Open'", () => {
        beforeAll(async () => {
          await clickOnSettledFilter();
          await clickOnOpenFilter();
        });

        it("[PRPI-5553] should have the 'Open' settled order type tab selected", async () => {
          expect(await tabsPO.selectedTab.getText()).toBe("Open");
        });

        it("[PRPI-5553] should have the 'Matched' order status segment selected", async () => {
          expect(await segmentedControlPO.selectedOption.getText()).toBe("Matched");
        });
      });
    });
  });
});
