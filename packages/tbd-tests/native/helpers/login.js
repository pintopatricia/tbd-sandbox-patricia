const { AcceptAllCookiesSO, HeaderSO, IdentitySsoPageSO, NotificationPromptSO } = require("../screen-objects");
const { extractUserAndPassword } = require("../../utils/extractCredential");
const { getPackageName } = require("../config/helpers/app-version-management");

const identitySsoPageSO = new IdentitySsoPageSO();
const acceptAllCookiesSO = new AcceptAllCookiesSO();
const headerSO = new HeaderSO();
const notificationPromptSO = new NotificationPromptSO();
const { PLATFORM, BRAND, BUILD_TYPE } = process.env;
const bundleId = getPackageName(PLATFORM, BRAND, BUILD_TYPE);

const Alert1stButtonElement = async () => {
  const selector = driver.isIOS
    ? "//XCUIElementTypeButton[@index='0']"
    : "//android.widget.ScrollView[ends-with(@resource-id, 'id/buttonPanel')]/android.widget.Button[@index='0']";
  return $(selector);
};

async function login(username) {
  const { user, password } = extractUserAndPassword(username);
  await acceptAllCookiesSO.dismissCookieBanner();
  await browser.waitUntilDisplayed(headerSO.loginButton);
  await headerSO.loginButton.click();
  await browser.waitUntilDisplayed(identitySsoPageSO.loginButton, "Login button was not displayed");
  await identitySsoPageSO.username.setValue(user);
  await identitySsoPageSO.password.setValue(password);
  await browser.waitUntilClickableNative(identitySsoPageSO.loginButton, "Login button was not clickable");
  await identitySsoPageSO.loginButton.click();

  if (driver.isIOS) {
    try {
      // ensure that app is not visible since alert is on top of the app
      // and both open means no access to element due to extended view
      await driver.background(-1);

      await browser.waitUntilDisplayed(notificationPromptSO.element);
      await notificationPromptSO.closeButton.click();

      await driver.activateApp(bundleId);
    } catch (e) {
      console.log("No Notification Prompt displayed.");
    }
  } else {
    await browser.waitUntilNotInDOM(identitySsoPageSO.element[0]);

    try {
      // closes 1st PIN alert
      let alert1stButton = await Alert1stButtonElement();
      await browser.waitUntilClickableNative(alert1stButton.getElement(), "Alert button was not clickable");
      await alert1stButton.click();

      // closes 2nd PIN alert
      alert1stButton = await Alert1stButtonElement();
      await browser.waitUntilClickableNative(alert1stButton.getElement(), "Alert button was not clickable");
      await alert1stButton.click();
    } catch (e) {
      console.log("No PIN alert was displayed.");
    }
  }
}

module.exports = {
  login,
};
