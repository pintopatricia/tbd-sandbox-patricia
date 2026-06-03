const addStake = async (inputFieldSO, value) => {
  await browser.waitUntilDisplayed(inputFieldSO.element, "Multiples stake is not visible");
  await inputFieldSO.element.click();
  await browser.waitUntil(async () => inputFieldSO.numberField.getAttribute("focused"));
  await browser.waitUntilStopsMoving(inputFieldSO.numberField);
  await inputFieldSO.setValue(value);
};

module.exports = addStake;
