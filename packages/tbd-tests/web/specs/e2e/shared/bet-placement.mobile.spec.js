const { browser } = require("@wdio/globals");
const { addFeature, addLabel } = require("@wdio/allure-reporter");
const {
  SportsbookReceiptPanelPO,
  KeyboardPO,
  SportsbookPlacePanelPO,
  BetControlsPO,
  BetDetailsPO,
  RaceSwitcherCardPO,
  SportsbookBetButtonPO,
  FixedNumberInputFieldPO,
} = require("../../../page-objects");
const { loginWithSSOID } = require("../../../helpers/login.util");
const { Weaver } = require("../../../../utils/weaver");
const { getRaceViewUrl, getEventViewUrl } = require("../../../../utils/routes");
const {
  addFirstSelectionToBetslip,
  addFirstSelectionToBetslipWithStake,
  closeBetReceipt,
} = require("../../../helpers/betslip.util");
const { openPageAndAcceptCookieConsent } = require("../../../helpers/helper.util");
const { performCashout, navigateToMyBets } = require("../../../helpers/cashout.util");
const { openPage } = require("../../../helpers/navigation.util");

const keyboardPO = new KeyboardPO();
const placePanelPO = new SportsbookPlacePanelPO();
const potentialBetDetailsPO = new BetDetailsPO(placePanelPO.element);
const betControls = new BetControlsPO();
const fixedInputField = new FixedNumberInputFieldPO(betControls.fixedInput);
const betReceiptPO = new SportsbookReceiptPanelPO();
const raceSwitcherCardPO = new RaceSwitcherCardPO();
const weaver = new Weaver();
const betButtonPO = new SportsbookBetButtonPO();
let hrEvent;
let fbEvent;

describe("Betslip Placement", () => {
  beforeAll(async () => {
    hrEvent = await weaver.fetchSingleRaceData({
      marketCountries: ["GB"],
      selectBy: "FIRST_TO_START",
      marketStartingAfter: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString(),
    });
    fbEvent = await weaver.fetchSingleEventData({ eventTypeId: 1 });
  });

  beforeEach(async () => {
    // Reset the state of the browser before each run
    await openPageAndAcceptCookieConsent();
    await browser.execute("window.localStorage.clear()");
    await loginWithSSOID("gtaTestAccount");
  });

  afterAll(async () => {
    await closeBetReceipt();
    await navigateToMyBets();
    // cashout single bet
    await performCashout();
    // cashout multiple bet
    await performCashout();
    // cashout EW bet
    await performCashout();
  });

  it("[PRPI-603] Place a single FB bet", async () => {
    addFeature("SHARED TESTS");
    await openPage(getEventViewUrl(fbEvent.eventId));
    await betButtonPO.element.waitForDisplayed();
    await browser.waitUntilStopsMoving(betButtonPO.element);
    await addFirstSelectionToBetslipWithStake();

    const placeButtonText = await placePanelPO.place.getText();

    expect(placeButtonText.toLowerCase()).toEqual(
      "Place £0.15 Bet".toLowerCase(),
      'Place button text did not include "Place £0.15 Bet"',
    );

    await placePanelPO.place.click();
    await betReceiptPO.element.waitForDisplayed();
    const betDetails = await betReceiptPO.element.getText();

    expect(betDetails).toContain("Stake\n£0.15");
    expect(betDetails).toContain(fbEvent.eventName);
  });

  it("[PRPI-605] Place an EW HR bet", async () => {
    addFeature("SHARED TESTS");
    await openPage(getRaceViewUrl(hrEvent.raceId));
    await raceSwitcherCardPO.element.waitForDisplayed();
    await addFirstSelectionToBetslipWithStake();

    const placeButtonText = await placePanelPO.place.getText();

    expect(placeButtonText.toLowerCase()).toContain(
      "Place £0.15 Bet".toLowerCase(),
      'Place button text did not include "Place £0.15 Bet"',
    );

    await betControls.eachWay.click();
    const ewPlaceButtonText = await placePanelPO.place.getText();

    expect(ewPlaceButtonText.toLowerCase()).toContain(
      "Place £0.30 Bet".toLowerCase(),
      'Place button text did not include "Place £0.30 Bet"',
    );

    await placePanelPO.place.click();
    await betReceiptPO.element.waitForDisplayed();
    const betDetails = await betReceiptPO.element.getText();

    expect(betDetails).toContain("Stake\n£0.30");
    expect(betDetails).toContain("Each Way");
    expect(betDetails).toContain(hrEvent.raceName);
  });

  it("[PRPI-606] Place an SP HR bet", async () => {
    addFeature("SHARED TESTS");
    await openPage(getRaceViewUrl(hrEvent.raceId));
    await raceSwitcherCardPO.element.waitForDisplayed();
    await addFirstSelectionToBetslipWithStake();

    const oddsValue = await fixedInputField.numberField.getValue();
    if (!oddsValue.includes("SP")) {
      await betControls.startingPrice.click();
    }

    const placeButtonText = await placePanelPO.place.getText();

    expect(placeButtonText.toLowerCase()).toContain(
      "Place £0.15 Bet".toLowerCase(),
      'Place button text did not include "Place £0.15 Bet"',
    );

    await placePanelPO.place.click();
    await betReceiptPO.element.waitForDisplayed();
    const betDetails = await betReceiptPO.element.getText();

    expect(betDetails).toContain("Stake\n£0.15");
    expect(betDetails).toContain("Odds\nSP");
    expect(betDetails).toContain(hrEvent.raceName);
  });

  it("[PRPI-611] Place a multi FB bet", async () => {
    addLabel("jira", "CRBRS-64");
    addFeature("SHARED TEST");
    await openPage(getEventViewUrl(fbEvent.eventId));
    await betButtonPO.element.waitForDisplayed();
    await browser.waitUntilStopsMoving(betButtonPO.element);
    await addFirstSelectionToBetslip();

    await openPage(getRaceViewUrl(hrEvent.raceId));
    await raceSwitcherCardPO.element.waitForDisplayed();
    await betButtonPO.element.waitForDisplayed();
    await browser.waitUntilStopsMoving(betButtonPO.element);
    await addFirstSelectionToBetslipWithStake();

    const placeButtonText = await placePanelPO.place.getText();

    expect(placeButtonText.toLowerCase()).toEqual(
      "place £0.15 bet",
      'Place button text did not include "Place £0.15 Bet"',
    );

    await placePanelPO.place.click();
    await betReceiptPO.element.waitForDisplayed();

    const betDetails = await betReceiptPO.element.getText();

    expect(betDetails).toContain("2 Selections");
    expect(betDetails).toContain("Double");
    expect(betDetails).toContain(hrEvent.raceName);
    expect(betDetails).toContain(fbEvent.eventName);
    expect(betDetails).toContain("Total Stake\n£0.15");
  });

  it("[PRPI-612] Re-use a bet", async () => {
    addFeature("SHARED TEST");
    await openPage(getEventViewUrl(fbEvent.eventId));
    await betButtonPO.element.waitForDisplayed();
    await browser.waitUntilStopsMoving(betButtonPO.element);
    await addFirstSelectionToBetslipWithStake();
    const betDetails = await potentialBetDetailsPO.subtitle.getText();

    expect(betDetails).toContain(fbEvent.eventName);

    await placePanelPO.place.click();
    await betReceiptPO.reUseSelectionsContainer.waitForDisplayed();
    await betReceiptPO.reUseSelectionsContainer.click();

    await placePanelPO.place.waitForDisplayed();

    const reusedBetDetails = await potentialBetDetailsPO.subtitle.getText();

    expect(betDetails).toContain(reusedBetDetails);
  });

  it("[PRPI-613] Min and max stake errors show on betslip", async () => {
    addFeature("SHARED TESTS");
    addLabel("jira", "CRBRS-62");
    addLabel("jira", "CRBRS-37");

    await openPage(getEventViewUrl(fbEvent.eventId));
    await betButtonPO.element.waitForDisplayed();
    await browser.waitUntilStopsMoving(betButtonPO.element);
    await addFirstSelectionToBetslipWithStake("0.01");

    expect(await placePanelPO.place.isEnabled()).toEqual(false);
    // Automatically sets stake to minimum value, breaking the test
    let placeButtonText = await placePanelPO.place.getText();

    expect(placeButtonText.toLowerCase()).toEqual(
      "Place £0.01 Bet".toLowerCase(),
      'Place button text did not include "Place £0.01 Bet"',
    );

    await keyboardPO.delete.click();
    await keyboardPO.delete.click();
    await keyboardPO.delete.click();

    await browser.keys(["5", "0", "0", "0", "0"]);
    // Automatically sets stake to maximum value, breaking the test
    expect(await placePanelPO.place.isEnabled()).toEqual(false);
    placeButtonText = await placePanelPO.place.getText();

    expect(placeButtonText.toLowerCase()).toEqual(
      "Deposit to place £50,000.00 Bet".toLowerCase(),
      'Place button text did not include "Deposit to place £50,000 Bet"',
    );
  });
});
