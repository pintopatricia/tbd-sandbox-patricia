const placeBet = async ({ placeButtonElement }) => {
  await browser.waitUntilDisplayed(placeButtonElement, "Place button is not displayed");
  await browser.waitUntilClickableNative(placeButtonElement);
  await placeButtonElement.click();
};

const advanceToConfirmStep = async ({ placeButtonElement, editButtonElement }) => {
  await placeBet({ placeButtonElement });
  await browser.waitUntilDisplayed(editButtonElement, "Confirm bet was not succeed");
  await browser.waitUntilClickableNative(editButtonElement);
};

module.exports = { advanceToConfirmStep };
