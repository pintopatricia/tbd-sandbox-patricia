const {
  MinimizedPO,
  SportsbookBetButtonPO,
  NumberInputFieldPO,
  BetControlsPO,
  SportsbookPlacePanelPO,
  InlineSportsbookMarketPO,
  BetslipDrawerPO,
} = require("../page-objects");
const CouponCardGroupPO = require("@ppb/tbd-shared/components/FilteredCouponCardGroup/FilteredCouponCardGroup.web.po");
const { browser } = require("@wdio/globals");
const {
  sportsbook: betButtonID,
} = require("@ppb/the-wall-web/components/SportsbookBetButton/SportsbookBetButton.modules.json");
//Adding the first valid bet button to avoid flaky tests due to invalid bet buttons. This is a temporary solution, we've a final solution that is in progress on The Wall side.
const sportsbookBetButton = new SportsbookBetButtonPO($(betButtonID));
const minimizedPO = new MinimizedPO();
const betslipDrawerPO = new BetslipDrawerPO();
const betControlsPO = new BetControlsPO();
const numberInputField = new NumberInputFieldPO(betControlsPO.currencyInput);
const placePanelPO = new SportsbookPlacePanelPO();
const eventMarketsCardCouponPO = new CouponCardGroupPO();

async function getFirstValidBetButton() {
  let validBetButton = null;
  let line = 0;
  while (validBetButton == null) {
    const inlineSportsbookMarketPO = new InlineSportsbookMarketPO(eventMarketsCardCouponPO.eventCoupons[line]);
    const betButton = new SportsbookBetButtonPO(inlineSportsbookMarketPO.betButtons[0]);

    await betButton.element.scrollIntoView();
    await browser.waitUntilDisplayed(betButton.element, "Bet button was not displayed");

    const text = await betButton.element.getText();

    if (text.includes("-")) {
      line++;
    } else {
      validBetButton = betButton;
    }
  }

  return validBetButton;
}

async function addStake(inputFieldPO, value) {
  // wait until betslip opens and move to input field
  await browser.waitUntilStopsMoving(inputFieldPO.numberField);
  await inputFieldPO.element.waitForClickable();
  await inputFieldPO.element.click();
  await browser.waitUntil(async () => inputFieldPO.numberField.isFocused());
  // wait for keyboard animation to finish
  await browser.waitUntilStopsMoving(inputFieldPO.numberField);
  await inputFieldPO.setValue(value);
}

async function addFirstSelectionToBetslip() {
  await browser.waitUntilStopsMoving(sportsbookBetButton.element);
  await sportsbookBetButton.element.waitForClickable();
  await sportsbookBetButton.element.click();
  // wait for bet to be added to the betslip
  await minimizedPO.element.waitForDisplayed({ timeoutMsg: "Betslip did not open" });
}

async function addFirstSelectionToBetslipWithStake(stake = "0.15") {
  await addFirstSelectionToBetslip();
  // open betslip
  await minimizedPO.title.click();
  // add stake to the bet
  await addStake(numberInputField, stake);
}

async function placeSingleBet() {
  await addFirstSelectionToBetslipWithStake("0.11");
  await placePanelPO.place.click();
}

async function closeBetReceipt() {
  // close the betslip
  await betslipDrawerPO.header.click();
  // wait for betslip to be closed
  await betslipDrawerPO.element.waitForDisplayed({
    timeoutMsg: "Receipt did not close",
    reverse: true,
  });
}

async function advanceToConfirmStep({ placeButtonElement, editButtonElement }) {
  await browser.waitUntilDisplayed(placeButtonElement, "Place button is not displayed");
  await placeButtonElement.waitForClickable();
  await placeButtonElement.click();

  await browser.waitUntilDisplayed(editButtonElement, "Confirm bet was not succeed");
}

module.exports = {
  addStake,
  addFirstSelectionToBetslip,
  addFirstSelectionToBetslipWithStake,
  placeSingleBet,
  getFirstValidBetButton,
  closeBetReceipt,
  advanceToConfirmStep,
};
