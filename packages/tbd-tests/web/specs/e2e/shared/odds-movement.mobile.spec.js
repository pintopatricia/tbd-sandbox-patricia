const { addFeature } = require("@wdio/allure-reporter");
const { SportsbookReceiptPanelPO, SwitchPO } = require("../../../page-objects");
const { loginWithSSOID } = require("../../../helpers/login.util");
const { placeSingleBet, closeBetReceipt } = require("../../../helpers/betslip.util");
const { openPageAndAcceptCookieConsent } = require("../../../helpers/helper.util");
const { openPage } = require("../../../helpers/navigation.util");
const { performCashout, navigateToMyBets } = require("../../../helpers/cashout.util");
const { getEventViewUrl } = require("../../../../utils/routes");
const {
  navigateToSettingsAndDetails,
  disableOddsMovement,
  validateOddsMovementIsEnabled,
} = require("../../../helpers/oddsmovement.util");
const { Weaver } = require("../../../../utils/weaver");

const betReceiptPO = new SportsbookReceiptPanelPO();
const sportsbookReceiptPanelPO = new SportsbookReceiptPanelPO();
const switchPO = new SwitchPO(sportsbookReceiptPanelPO.element);

const weaver = new Weaver();
let fbEvent;

const baseUrl = process.env.BASE_URL;
const shouldSkip = baseUrl.includes("ie");

(shouldSkip ? xdescribe : describe)("Odds Movement", () => {
  addFeature("SHARED TESTS");
  beforeAll(async () => {
    fbEvent = await weaver.fetchSingleEventData({ eventTypeId: 1 });
    await openPageAndAcceptCookieConsent();
    await loginWithSSOID("gtaTestAccount");
  });

  afterAll(async () => {
    await closeBetReceipt();
    await disableOddsMovement();
    await navigateToMyBets();
    await performCashout();
  });

  describe("when the user place a bet with Odds Movements disabled", () => {
    beforeAll(async () => {
      await openPage(getEventViewUrl(fbEvent.eventId));
      await placeSingleBet();
    });

    it("[PRPI-648] Should show odds movement label option to enable", async () => {
      expect(await betReceiptPO.oddsMovementLabel.isDisplayed()).toBe(true);
    });

    describe("when the user enables odds movement notification on bet receipt", () => {
      beforeAll(async () => {
        await switchPO.switch.click();
        expect(await switchPO.switch.isExisting()).toBe(true);
        await closeBetReceipt();
        await navigateToSettingsAndDetails();
      });

      it("[PRPI-649] Verify 'Accept Odds Movement' is ON on Settings & Details page", async () => {
        await validateOddsMovementIsEnabled();
      });

      describe("when the user place a single FB bet with Odds Movements already enabled", () => {
        beforeAll(async () => {
          await openPage(getEventViewUrl(fbEvent.eventId));
          await placeSingleBet();
        });

        it("[PRPI-650] Verify odds movement notification is not displayed on bet receipt", async () => {
          expect(await switchPO.switch.isExisting()).toBe(false);
        });
      });
    });
  });
});
