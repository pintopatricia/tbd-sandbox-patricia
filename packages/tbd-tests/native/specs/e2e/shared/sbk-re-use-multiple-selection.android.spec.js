const MarketSO = require("@ppb/tbd-shared/components/Market/Market.so");

const {
  MultiplesCardSO,
  BetLegsSO,
  GenericViewSO,
  BetControlsSO,
  BetSelectionDetailsSO,
  CardSO,
  CurrencyNumberInputFieldSO,
  InlineSportsbookMarketSO,
  PrimaryButtonSO,
  SelectionsBoardSO,
  SportsbookBetButtonSO,
  SportsbookReceiptPanelSO,
  MinimizedSO,
  SportsbookPlacePanelSO,
  GenericSwitcherCardSO,
  SnackbarSO,
  TooltipSO,
} = require("../../../screen-objects");
const { Weaver } = require("../../../../utils/weaver");
const { openDeeplink, startApp } = require("../../../helpers/urls");
const { login } = require("../../../helpers/login");
const { checkIfDisplayedWithSwipe, VERTICAL } = require("../../../helpers/gestures");

const genericViewSO = new GenericViewSO();
const genericSwitcherCardSO = new GenericSwitcherCardSO();
const marketSO = new MarketSO();
const firstCardSO = new CardSO(marketSO.element);
const firstSportsbookMarketSO = new InlineSportsbookMarketSO(firstCardSO.inlineSportsbookMarket);
const firstBetButtonSO = new SportsbookBetButtonSO(firstSportsbookMarketSO.sbkBetButtons[0]);
const minimizedSO = new MinimizedSO();

const sportsbookPlacePanelSO = new SportsbookPlacePanelSO();
const multiplesCardSO = new MultiplesCardSO(sportsbookPlacePanelSO.element);
const multiplesCollapseSO = new CardSO(multiplesCardSO.element);
const selectionsBoardSO = new SelectionsBoardSO(multiplesCollapseSO.element);
const multipleControlsSO = new BetControlsSO(sportsbookPlacePanelSO.element);
const multiplesStakeInputFiled = new CurrencyNumberInputFieldSO(multipleControlsSO.currencyInput);
const multiplesPlaceButton = new PrimaryButtonSO();
const sportsbookReceiptPanelSO = new SportsbookReceiptPanelSO();
const betLegsSO = new BetLegsSO(selectionsBoardSO.element);
const firstSelectionDetail = new BetSelectionDetailsSO(betLegsSO.selections[0]);
const secondSelectionDetail = new BetSelectionDetailsSO(betLegsSO.selections[1]);
const thirdSelectionDetail = new BetSelectionDetailsSO(betLegsSO.selections[2]);
const snackbarSO = new SnackbarSO();
const tooltipSO = new TooltipSO();

const weaver = new Weaver();
const selectionTitles = [];

async function goToEventAndAddSelection(eventId) {
  // Init always new SO's so there's no cache issues related to getting the wrong element
  const firstCardSelectionSO = new CardSO();

  await openDeeplink(`sport/competititon/event/e-${eventId}`);
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

  // Wait for the initial card render instead of trying swiping first
  // to see if there is already a bet button present
  // a grace period no fail timeout is used
  await browser.waitUntilDisplayed(firstCardSelectionSO.element, "Card was not displayed", { timeout: 8000 });
  await browser.waitUntilDisplayed(firstBetButtonSO.element, "BetButton was not displayed", { timeout: 8000 });

  await checkIfDisplayedWithSwipe({
    scrollContainer: genericViewSO.element,
    searchableElement: firstBetButtonSO.element,
    direction: VERTICAL.UP,
    percentage: 0.65,
  });

  await browser.waitUntilDisplayed(firstCardSelectionSO.element, "Card was not displayed");
  await browser.waitUntilDisplayed(firstSportsbookMarketSO.element, "SportsbookMarket was not displayed");
  await browser.waitUntilDisplayed(firstBetButtonSO.element, "BetButton was not displayed");
  await browser.waitUntilClickableNative(firstBetButtonSO.element, "BetButton was not clickable");

  selectionTitles.push(await firstBetButtonSO.secondaryLabel.getText());

  await firstBetButtonSO.element.click();
}

describe("Sportsbook Re-use selections", () => {
  beforeAll(async () => {
    await startApp("home");
    await login("oddsMovementOn");
  });

  describe("When the user adds multiple SBK bets to selection", () => {
    beforeAll(async () => {
      const {
        results: [firstEvent, secondEvent, thirdEvent],
      } = await weaver.fetchWeaverEvents({
        eventTypeId: 1,
      });

      await goToEventAndAddSelection(firstEvent.eventId);

      await browser.waitUntilDisplayed(minimizedSO.element, "Betslip was never minimized");

      await browser.waitUntilEquals(minimizedSO.counter, "1");
      await goToEventAndAddSelection(secondEvent.eventId);
      await browser.waitUntilEquals(minimizedSO.counter, "2");
      await goToEventAndAddSelection(thirdEvent.eventId);
      await browser.waitUntilEquals(minimizedSO.counter, "3");

      await browser.waitUntilClickableNative(minimizedSO.element, "Betslip is not accessible");
      const height = await minimizedSO.element.getSize("height");

      // Clicking at the bottom of the button because there may be a tooltip covering
      // the original click location (0, 0)
      await minimizedSO.element.click({ x: 0, y: height / 2 - 1 });
      await browser.waitUntilDisplayed(selectionsBoardSO.element, "Selections board not displayed");
    });

    it("[PRPI-1019] The Betslip should have 3 selections", async () => {
      expect(await selectionsBoardSO.title.getText()).toBe("3 Selections");

      expect(await betLegsSO.selections.length).toBe(3);

      expect(await firstSelectionDetail.title.getText()).toBe(selectionTitles[0]);
      expect(await secondSelectionDetail.title.getText()).toBe(selectionTitles[1]);
      expect(await thirdSelectionDetail.title.getText()).toBe(selectionTitles[2]);
    });

    describe("When the user places bets with success", () => {
      beforeAll(async () => {
        await browser.waitUntilDisplayed(multiplesPlaceButton.element, "multiplesPlaceButton was not displayed");

        await multiplesStakeInputFiled.numberField.setValue(0.11);

        await multiplesPlaceButton.element.click();

        await browser.waitUntilDisplayed(sportsbookReceiptPanelSO.element, "Receipt Panel was not displayed");
      });

      it("[PRPI-1020] The 'Bet Placed' panel should be visible", async () => {
        expect(await sportsbookReceiptPanelSO.element.isDisplayed()).toBe(true);
      });

      it("[PRPI-1021] The 'Re-use selections' CTA button should be visible", async () => {
        expect(await sportsbookReceiptPanelSO.reUseSelectionsContainer.isDisplayed()).toBe(true);
      });

      describe("When the user taps 'Re-use selections' CTA button", () => {
        beforeAll(async () => {
          await sportsbookReceiptPanelSO.reUseSelectionsContainer.click();
          await browser.waitUntilDisplayed(minimizedSO.element);
        });

        it("[PRPI-1022] The Betslip should collapse", async () => {
          expect(await minimizedSO.element.isDisplayed()).toBe(true);
        });

        it("[PRPI-1023] The Betslip counter should be '3'", async () => {
          expect(await minimizedSO.counter.getText()).toBe("3");
        });

        describe("When the users taps the handle button", () => {
          beforeAll(async () => {
            await minimizedSO.element.click();
            await browser.waitUntilDisplayed(sportsbookPlacePanelSO.element, "Place panel couldn't be opened");
          });

          it("[PRPI-1024] The Betslip should expand", async () => {
            expect(await sportsbookPlacePanelSO.element.isDisplayed()).toBe(true);
          });

          it("[PRPI-1025] The Selections should be visible and the same", async () => {
            expect(await firstSelectionDetail.title.getText()).toBe(selectionTitles[0]);
            expect(await secondSelectionDetail.title.getText()).toBe(selectionTitles[1]);
            expect(await thirdSelectionDetail.title.getText()).toBe(selectionTitles[2]);
          });
        });
      });
    });
  });
});
