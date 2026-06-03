const { getMyBetsEXCViewMock } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");
const {
  getAppContext,
  getMyBetsLayout,
  getHomeLayoutWithViewLink,
  getCardResults,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");
const { startApp, openHomeViewLink } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");

const {
  MyBetsScreenSO,
  BottomBarSO,
  SegmentedControlSO,
  MyBetsHeaderSO,
  TabsGroupSO,
} = require("../../../../screen-objects");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const mockService = new MockService();
const myBetsSO = new MyBetsScreenSO();
const myBetsHeaderSO = new MyBetsHeaderSO();
const tabsSO = new TabsGroupSO();
const openTab = new TabsGroupSO(tabsSO.tabButtons[0]);
const settledTab = new TabsGroupSO(tabsSO.tabButtons[1]);
const segmentedControlSO = new SegmentedControlSO();

const OPEN_VIEW_MOCK = getMyBetsEXCViewMock([], { isOpen: true });
const OPEN_UNMATCHED_VIEW_MOCK = getMyBetsEXCViewMock([], { isOpenUnmatched: true });
const OPEN_MATCHED_VIEW_MOCK = getMyBetsEXCViewMock([], { isOpenMatched: true });
const SETTLED_VIEW_MOCK = getMyBetsEXCViewMock([], {});

const clickOnElement = async (element) => {
  await browser.waitUntilClickableNative(element, "Element is not clickable");
  await element.click();
};

const clickOnOpenFilter = async () => {
  await clickOnElement(openTab.element);
  await browser.waitUntilEquals(openTab.selectedTab, "Open");

  await browser.waitUntilDisplayed(myBetsHeaderSO.orderStatusFilter, "Order Status filter is not displayed");
};

const clickOnSettledFilter = async () => {
  await clickOnElement(settledTab.element);
  await browser.waitUntilEquals(settledTab.selectedTab, "Settled");
  await browser.waitUntilNotDisplayed(myBetsHeaderSO.orderStatusFilter, "Order Status filter is still displayed");
};

const clickOnMatchedFilter = async () => {
  await clickOnElement(segmentedControlSO.options[1]);
  await browser.waitUntilEquals(segmentedControlSO.selectedOptionText, "Matched");
};

const goToHome = async () => {
  await clickOnElement(BottomBarSO.home);
  await browser.waitUntilNotDisplayed(myBetsSO.element, "My Bets Page is visible");
};

const goToHomeAndBackToMyBets = async () => {
  await goToHome();
  await clickOnElement(BottomBarSO.myBets);
  await browser.waitUntilDisplayed(myBetsSO.element, "My Bets Page is not visible");
  await browser.waitUntilDisplayed(myBetsHeaderSO.element, "My Bets Header is not visible");
};

const validateOpenBets = async (matchedStatus) => {
  it("[PRPI-1842] should have the 'Open' order type tab selected", async () => {
    expect(await tabsSO.selectedTab.getText()).toBe("Open");
  });

  it("[PRPI-4218] should have the '${matchedStatus}' order status segment selected", async () => {
    expect(await segmentedControlSO.selectedOptionText.getText()).toBe(matchedStatus);
  });
};

const validateSettledBets = async () => {
  it("[PRPI-1843] should have the 'Settled' order type tab selected", async () => {
    await browser.waitUntilEquals(settledTab.selectedTab, "Settled");
  });

  it("[PRPI-1844] should not have the order status segment", async () => {
    await browser.waitUntilNotDisplayed(myBetsHeaderSO.orderStatusFilter, "Segment Filter is visible");
  });
};

const MY_BETS_URL = routes.getMyBetsViewUrl("open", { matchedStatus: "unmatched" });
const MY_BETS_URN = routes.getMyBetsURN("open", { matchedStatus: "unmatched" });

const HOME_VIEW_LINK = getStartViewLink(MY_BETS_URL, MY_BETS_URN);

const resetHomePageMock = async (props) => {
  await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK, props));
};

const resetToHome = async () => {
  await clickOnOpenFilter();
  await clickOnElement(segmentedControlSO.options[0]);
  await browser.waitUntilEquals(segmentedControlSO.selectedOptionText, "Unmatched");
  await resetHomePageMock({ withBottomBar: true });
  await goToHome();
};

describe("EXC My Bets - Navigation", () => {
  beforeAll(async () => {
    // My Bets Open Unmatched as entrypoint
    await mockService.mockHttpRequest(getAppContext({}));
    await mockService.mockHttpRequest(getMyBetsLayout(OPEN_VIEW_MOCK));
    await mockService.mockHttpRequest(getMyBetsLayout(OPEN_UNMATCHED_VIEW_MOCK));
    await mockService.mockHttpRequest(getMyBetsLayout(OPEN_MATCHED_VIEW_MOCK));
    await mockService.mockHttpRequest(getMyBetsLayout(SETTLED_VIEW_MOCK));

    await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));

    await resetHomePageMock({ withBottomBar: true });

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });

    await browser.waitUntilDisplayed(myBetsSO.emptyState, "My Bets Empty State not visible");
  });

  // JOURNEY: My Bets Open -> Settled -> Home -> My Bets (Settled)
  describe("when the user enters on my bets for the first time (open unmatched)", () => {
    beforeAll(async () => {
      // To avoid overrides from home bottom bar
      await resetHomePageMock({ withBottomBar: false });
    });

    afterAll(async () => {
      await resetToHome();
    });

    validateOpenBets("Unmatched");

    describe("and then the user clicks on the 'Settled' order type filter", () => {
      beforeAll(async () => {
        await clickOnSettledFilter();
      });

      validateSettledBets();

      describe("and the user goes to 'Home' and back to 'My Bets' trough the navigation bar", () => {
        beforeAll(async () => {
          await goToHomeAndBackToMyBets();
        });

        validateSettledBets();
      });
    });
  });

  // JOURNEY: My Bets Open -> Matched -> Home -> My Bets (Open Matched)
  describe("when the user enters on my bets for the first time (open unmatched)", () => {
    beforeAll(async () => {
      await openHomeViewLink();
      await browser.waitUntilDisplayed(myBetsSO.emptyState, "My Bets Empty State not visible");
      // To avoid overrides from home bottom bar
      await resetHomePageMock({ withBottomBar: false });
    });

    afterAll(async () => {
      await resetToHome();
    });

    validateOpenBets("Unmatched");

    describe("and then the user clicks on the 'Matched' status filter", () => {
      beforeAll(async () => {
        await clickOnMatchedFilter();
      });

      validateOpenBets("Matched");

      describe("and the user goes to 'Home' and back to 'My Bets' trough the navigation bar", () => {
        beforeAll(async () => {
          await goToHomeAndBackToMyBets();
          await browser.waitUntilDisplayed(
            segmentedControlSO.selectedOptionText,
            "Order Status selected filter is not displayed",
          );
          await browser.waitUntilEquals(segmentedControlSO.selectedOptionText, "Matched");
        });

        validateOpenBets("Matched");
      });
    });
  });

  // JOURNEY: My Bets Open -> Matched -> Settled -> My Bets Open
  describe("when the user enters on my bets for the first time (open unmatched)", () => {
    beforeAll(async () => {
      await openHomeViewLink();
      await browser.waitUntilDisplayed(myBetsSO.emptyState, "My Bets Empty State not displayed");
      // To avoid overrides from home bottom bar
      await resetHomePageMock({ withBottomBar: false });
    });

    afterAll(async () => {
      await resetToHome();
    });

    validateOpenBets("Unmatched");

    describe("and then the user clicks on the 'Matched' status filter", () => {
      beforeAll(async () => {
        await clickOnMatchedFilter();
      });

      validateOpenBets("Matched");

      describe("and the user clicks on the 'Settled' order type filter and back to 'Open'", () => {
        beforeAll(async () => {
          await clickOnSettledFilter();
          await clickOnOpenFilter();
        });

        validateOpenBets("Matched");
      });
    });
  });
});
