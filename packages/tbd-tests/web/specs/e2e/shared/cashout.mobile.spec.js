const { browser } = require("@wdio/globals");
const { addFeature, addLabel } = require("@wdio/allure-reporter");
const { SportsbookReceiptPanelPO, MyBetsPagePO, SportsbookBetButtonPO } = require("../../../page-objects");
const { loginWithSSOID } = require("../../../helpers/login.util");
const { Weaver } = require("../../../../utils/weaver");
const { getEventViewUrl } = require("../../../../utils/routes");
const { placeSingleBet, closeBetReceipt } = require("../../../helpers/betslip.util");
const { openPageAndAcceptCookieConsent } = require("../../../helpers/helper.util");
const { performCashout, navigateToMyBets } = require("../../../helpers/cashout.util");
const { openPage } = require("../../../helpers/navigation.util");

const betReceiptPO = new SportsbookReceiptPanelPO();

const weaver = new Weaver();
const myBetsPagePO = new MyBetsPagePO();
const betButtonPO = new SportsbookBetButtonPO();

let fbEvent;

describe("Cashout", () => {
  beforeAll(async () => {
    await openPageAndAcceptCookieConsent();
    await loginWithSSOID("gtaAccount");
    fbEvent = await weaver.fetchSingleEventData({ eventTypeId: 1 });
  });

  it("[PRPI-595] Place a single FB bet and cashout", async () => {
    addFeature("SHARED TEST");
    addLabel("jira", "CRBRS-46");
    // Open the event page
    await openPage(getEventViewUrl(fbEvent.eventId));
    await betButtonPO.element.waitForDisplayed();
    await browser.waitUntilStopsMoving(betButtonPO.element);

    // place a bet
    await placeSingleBet();

    // wait for the bet receipt to be displayed & close betslip
    await betReceiptPO.reUseSelectionsContainer.waitForDisplayed({ timeoutMsg: "Bet receipt did not appear" });

    await closeBetReceipt();

    await navigateToMyBets();

    await performCashout();

    expect(await myBetsPagePO.cashoutButtonLabel).toHaveTextContaining("Cash Out Successful");
  });
});
