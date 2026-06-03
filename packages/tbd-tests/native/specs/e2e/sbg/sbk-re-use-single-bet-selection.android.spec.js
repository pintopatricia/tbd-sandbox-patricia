const MarketSO = require("@ppb/tbd-shared/components/Market/Market.so");
const {
  SportsbookPlacePanelSO,
  GenericViewSO,
  GenericSwitcherCardSO,
  BetControlsSO,
  BetDetailsSO,
  CardSO,
  CurrencyNumberInputFieldSO,
  PrimaryButtonSO,
  SportsbookBetButtonSO,
  SportsbookReceiptPanelSO,
  MinimizedSO,
  SkyBetClubTrackerSO,
  SnackbarSO,
  TooltipSO,
} = require("../../../screen-objects");

const { Weaver } = require("../../../../utils/weaver");

const { checkIfDisplayedWithSwipe, VERTICAL, swipeUp } = require("../../../helpers/gestures");
const { startApp, openDeeplink } = require("../../../helpers/urls");
const { login } = require("../../../helpers/login");

const genericViewSO = new GenericViewSO();
const genericSwitcherCardSO = new GenericSwitcherCardSO();
const marketSO = new MarketSO();
const firstCardSO = new CardSO(marketSO.element);
const firstBetButtonSO = new SportsbookBetButtonSO();
const sportsbookPlaceSO = new SportsbookPlacePanelSO();
const singlesPlaceButton = new PrimaryButtonSO();
const betControlsSO = new BetControlsSO();
const currencyNumberInputFieldSO = new CurrencyNumberInputFieldSO(betControlsSO.currencyInput);
const sportsbookReceiptPanelSO = new SportsbookReceiptPanelSO();
const singleSelectionSO = new BetDetailsSO(sportsbookReceiptPanelSO.singles[0]);
const potentialBetDetailsSO = new BetDetailsSO(sportsbookPlaceSO.element);
const minimizedSO = new MinimizedSO();
const skyBetClubTrackerCardSO = new SkyBetClubTrackerSO();
const snackbarSO = new SnackbarSO();
const tooltipSO = new TooltipSO();

const weaver = new Weaver();

let selectionTitle;

describe("Sportsbook Place & Re-use selections", () => {
  beforeAll(async () => {
    const eventData = await weaver.fetchSingleEventData({
      eventTypeId: 1,
      productTypes: ["SPORTSBOOK"],
      selectBy: "LAST_TO_START",
    });

    await startApp("home");
    await login("oddsMovementOn");
    await openDeeplink(`sport/competititon/event/e-${eventData.eventId}`);

    await browser.waitUntilDisplayed(genericViewSO.element, "GenericView was not displayed");
    await browser.waitUntilDisplayed(genericSwitcherCardSO.element, "GenericSwitcherCard was not displayed");
    const isSBDisplayed = await browser.waitUntilDisplayed(snackbarSO.element, "Snackbar was not displayed", {
      timeout: 5000,
    });
    if (isSBDisplayed) {
      await snackbarSO.closeButton.click();
    }
    const istoolTipDisplayed = await browser.waitUntilDisplayed(tooltipSO.element, "Tooltip was not displayed", {
      timeout: 5000,
    });
    if (istoolTipDisplayed) {
      await tooltipSO.closeButton.click();
    }
  });

  describe("When the user places a single SBK bet with success", () => {
    beforeAll(async () => {
      await browser.waitUntilDisplayed(firstCardSO.element, "Card was not displayed", { timeout: 8000 });
      await browser.waitUntilDisplayed(firstBetButtonSO.element, "BetButton was not displayed", { timeout: 8000 });

      await checkIfDisplayedWithSwipe({
        scrollContainer: genericViewSO.element,
        searchableElement: firstCardSO.element,
        direction: VERTICAL.UP,
        percentage: 0.75,
      });

      await browser.waitUntilDisplayed(firstCardSO.element, "Card was not displayed");
      await browser.waitUntilDisplayed(firstBetButtonSO.element, "BetButton was not displayed");

      selectionTitle = await firstBetButtonSO.secondaryLabel.getText();
      await firstBetButtonSO.element.click();

      await browser.waitUntilDisplayed(minimizedSO.element, "Minimized Betslip was not displayed");
      await browser.waitUntilClickableNative(minimizedSO.element);
      await minimizedSO.element.click();

      await browser.waitUntilDisplayed(sportsbookPlaceSO.element, "SportsbookPlacePanel was not displayed");
      await browser.waitUntilDisplayed(singlesPlaceButton.element, "SinglesPlaceButton was not displayed");

      await currencyNumberInputFieldSO.numberField.setValue(0.11);

      await singlesPlaceButton.element.click();

      await browser.waitUntilDisplayed(sportsbookReceiptPanelSO.element, "Receipt Panel was not displayed");
    });

    it("[PRPI-1026] The 'Bet Placed' panel should be visible", async () => {
      expect(await sportsbookReceiptPanelSO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-1027] The Skybet Clut Tracker should be visible", async () => {
      await skyBetClubTrackerCardSO.element.waitForDisplayed();

      expect(await skyBetClubTrackerCardSO.logoTextContainer.isDisplayed()).toBe(true);
    });

    it("[PRPI-1028] The 'Re-use selections' CTA button should be visible", async () => {
      expect(await sportsbookReceiptPanelSO.reUseSelectionsContainer.isDisplayed()).toBe(true);
    });

    describe("When the user swipes to selection", () => {
      beforeAll(async () => {
        await swipeUp(0.5);
        await browser.waitUntilDisplayed(singleSelectionSO.element);
      });

      it("[PRPI-1029] The Selection title should be visible", async () => {
        expect(await singleSelectionSO.title.getText()).toBe(selectionTitle);
      });
    });

    describe("When the user taps 'Re-use selections' CTA button", () => {
      beforeAll(async () => {
        await sportsbookReceiptPanelSO.reUseSelectionsContainer.click();
        await browser.waitUntilDisplayed(sportsbookPlaceSO.element);
      });

      it("[PRPI-1030] The betslip should expand", async () => {
        expect(await sportsbookPlaceSO.element.isDisplayed()).toBe(true);
      });

      it("[PRPI-1031] The Selection title should be visible", async () => {
        expect(await potentialBetDetailsSO.title.getText()).toBe(selectionTitle);
      });
    });
  });
});
