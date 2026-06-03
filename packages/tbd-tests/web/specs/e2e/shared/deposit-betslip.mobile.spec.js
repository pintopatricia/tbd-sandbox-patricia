const { addFeature, addLabel } = require("@wdio/allure-reporter");
const { DepositsPagePO, SportsbookPlacePanelPO, RaceSwitcherCardPO } = require("../../../page-objects");
const { loginWithSSOID } = require("../../../helpers/login.util");
const { Weaver } = require("../../../../utils/weaver");
const { getRaceViewUrl } = require("../../../../utils/routes");
const { addFirstSelectionToBetslipWithStake } = require("../../../helpers/betslip.util");
const { openPageAndAcceptCookieConsent } = require("../../../helpers/helper.util");
const { openPage } = require("../../../helpers/navigation.util");

const weaver = new Weaver();
const placePanelPO = new SportsbookPlacePanelPO();
const depositsPagePO = new DepositsPagePO();
const raceSwitcherCardPO = new RaceSwitcherCardPO();

let fbEvent;

describe("Deposit test", () => {
  addLabel("jira", "CRBRS-41");

  beforeAll(async () => {
    fbEvent = await weaver.fetchSingleRaceData({ selectBy: "FIRST_TO_START" });
  });

  beforeEach(async () => {
    await openPageAndAcceptCookieConsent();
    await loginWithSSOID("gtaAccount");
  });

  it("[PRPI-630] Deposit page is displayed with Deposit title, and add card ,when stake entered is higher than balance", async () => {
    addFeature("SHARED TESTS");
    await openPage(getRaceViewUrl(fbEvent.raceId));
    await raceSwitcherCardPO.element.waitForDisplayed();
    await addFirstSelectionToBetslipWithStake("100");

    await placePanelPO.place.waitForClickable();
    await placePanelPO.place.click();

    await depositsPagePO.element.waitForDisplayed();
  });
});
