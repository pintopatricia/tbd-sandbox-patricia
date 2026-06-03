const { browser } = require("@wdio/globals");
const { addFeature } = require("@wdio/allure-reporter");
const {
  BottomBarPO,
  SkyBetClubTrackerPO,
  SportsbookReceiptPanelPO,
  SportsbookPlacePanelPO,
  SportsbookBetButtonPO,
} = require("../../../page-objects");
const { loginWithSSOID } = require("../../../helpers/login.util");
const { Weaver } = require("../../../../utils/weaver");
const { getEventViewUrl } = require("../../../../utils/routes");
const { addFirstSelectionToBetslipWithStake } = require("../../../helpers/betslip.util");
const { openPageAndAcceptCookieConsent } = require("../../../helpers/helper.util");
const { extractEndpoints } = require("../../../../utils/extractEndpoints");
const { openPage } = require("../../../helpers/navigation.util");

const placePanelPO = new SportsbookPlacePanelPO();
const betReceiptPO = new SportsbookReceiptPanelPO();
const betButtonPO = new SportsbookBetButtonPO();
const bottomBarPO = new BottomBarPO();
const skyBetClubTrackerCardPO = new SkyBetClubTrackerPO();
const weaver = new Weaver();
let fbEvent;

describe("Skybet Club Tracker", () => {
  beforeAll(async () => {
    fbEvent = await weaver.fetchSingleEventData({ eventTypeId: 1 });
  });

  describe("Logged out", () => {
    beforeEach(async () => {
      // Reset the state of the browser before each run
      await openPageAndAcceptCookieConsent();
      await browser.execute("window.localStorage.clear()");
    });

    it("[PRPI-671] entry point on bottom bar with Sky Bet Club", async () => {
      addFeature("SKYBET TESTS");

      expect(await bottomBarPO.element.isDisplayed()).toBe(true);
      expect(await bottomBarPO.tiles.length).toBe(5);
      expect(await bottomBarPO.tiles[0].getText()).toBe("Home");
      expect(await bottomBarPO.tiles[1].getText()).toBe("Browse");
      expect(await bottomBarPO.tiles[2].getText()).toBe("Sky Bet Club");
      expect(await bottomBarPO.tiles[3].getText()).toBe("My Bets");
      expect(await bottomBarPO.tiles[4].getText()).toBe("Games");
    });
  });

  describe("Logged in", () => {
    beforeEach(async () => {
      // Reset the state of the browser before each run
      await openPageAndAcceptCookieConsent();
      await browser.execute("window.localStorage.clear()");
      await loginWithSSOID("gtaTestAccount");
    });

    it("[PRPI-672] entry point on bottom bar with Sky Bet Club", async () => {
      addFeature("SKYBET TESTS");

      expect(await bottomBarPO.element.isDisplayed()).toBe(true);
      expect(await bottomBarPO.tiles.length).toBe(5);
      expect(await bottomBarPO.tiles[0].getText()).toBe("Home");
      expect(await bottomBarPO.tiles[1].getText()).toBe("Browse");
      expect(await bottomBarPO.tiles[2].getText()).toBe("Sky Bet Club");
      expect(await bottomBarPO.tiles[3].getText()).toBe("My Bets");
      expect(await bottomBarPO.tiles[4].getText()).toBe("Games");

      await bottomBarPO.tiles[2].click();

      expect(await browser.getUrl()).toContain(extractEndpoints().SKYBET_CLUB_TRACKER.endpoint);
    });

    it("[PRPI-674] tracker bar visible after place bet", async () => {
      addFeature("SKYBET TESTS");
      await openPage(getEventViewUrl(fbEvent.eventId));
      await browser.waitUntilStopsMoving(betButtonPO.element);
      await addFirstSelectionToBetslipWithStake();

      await placePanelPO.place.click();
      await betReceiptPO.element.waitForDisplayed();

      await skyBetClubTrackerCardPO.element.waitForDisplayed();

      expect(await skyBetClubTrackerCardPO.logoTextContainer.isDisplayed()).toBe(true);
    });
  });
});
