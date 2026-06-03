const { BottomBarSO, FooterSO, QuickLinkSO, SectionElementsSO, BottomSheetSO } = require("../screen-objects");
const { longPress, touch } = require("./gestures");

const {
  getPackageName,
  getSplashActivity,
  getMainActivity,
  getBaseDeeplink,
} = require("../config/helpers/app-version-management");

const footerSO = new FooterSO();
const sectionElementsSO = new SectionElementsSO(footerSO.sections[0]);
const bottomSheetSO = new BottomSheetSO();

const { PLATFORM, BRAND, BUILD_TYPE } = process.env;
const packageName = getPackageName(PLATFORM, BRAND, BUILD_TYPE);
const bundleId = getPackageName(PLATFORM, BRAND, BUILD_TYPE);
const splashActivity = getSplashActivity(BRAND);
const mainActivity = getMainActivity(BRAND);
const prefix = getBaseDeeplink(BRAND);
const bundleIdSafari = "com.apple.mobilesafari";

async function openIosViewWithDeepLink(url) {
  console.log(`Navigating with DeepLink ...`);

  // Terminate Safari before opening a new deep link
  const appState = await driver.execute("mobile: queryAppState", { bundleId: bundleIdSafari });
  if (appState === 2 || appState === 3) {
    // App states: https://developer.apple.com/documentation/xctest/xcuiapplicationstate?language=objc
    console.log(`Terminating Safari before opening the new deep link...`);
    await browser.terminateApp(bundleIdSafari);
  }
  // Launch Safari to open the deep link
  await driver.execute("mobile: launchApp", { bundleId: bundleIdSafari });

  // When resetting the iOS simulators and opening the Safari for the first time, an onboarding screen appears
  // messing with the tests. We need to click on the continue buttons so that the tests proceed.
  const firstContinueButton = await driver.findElement("xpath", `(//XCUIElementTypeStaticText[@name="Continue"])[1]`);
  const secondContinueButton = await driver.findElement("xpath", `(//XCUIElementTypeStaticText[@name="Continue"])`);
  if (firstContinueButton.ELEMENT !== undefined) {
    await driver.elementClick(firstContinueButton.ELEMENT);
  }
  if (secondContinueButton.ELEMENT !== undefined) {
    await driver.elementClick(secondContinueButton.ELEMENT);
  }
  const browserTab = await browser.$('//*[@label="Tabs"]');

  try {
    await longPress(browserTab);
  } catch (ex) {
    throw new Error(
      "💀 Verify that the language of your simulator is set to English. [Settings -> General -> Language & Region -> iPhone Language]",
    );
  }

  const closeTabButton = await browser.$('//*[@label="Close This Tab"]');
  if (!closeTabButton.error) {
    console.log("Closing Safari tab");
    await closeTabButton.click();
  } else {
    console.log("No tabs opened at the moment");
    // Click outside the view
    await touch(100, 100);
  }

  // iOS 15 no longer displays the virtual keyboard by default so there is no
  // need to wait until it is displayed before clicking into it.
  const urlField = await browser.$("//XCUIElementTypeTextField");
  await browser.waitUntilClickableNative(urlField);
  await urlField.click();
  // set clipboard only works for simulators
  const clipboardContent = Buffer.from(`${prefix}${url}`).toString("base64");
  // debug the clipboard content for "Paste and Go" option.
  console.log("clipboardContent Base64:", clipboardContent, "Decoded:", `${prefix}${url}`);
  await driver.setClipboard(clipboardContent);
  await urlField.setValue("");
  await urlField.click();

  const pasteLinkOption = await browser.$("~Paste");
  await browser.waitUntilClickableNative(pasteLinkOption);
  await pasteLinkOption.click();
  await driver.isKeyboardShown();
  // iOS equivalent of enter key
  await browser.sendKeys(["\n"]);

  const openButton = await browser.$("~Open");
  await browser.waitUntilClickableNative(openButton);
  await openButton.click();
}

async function openHomeViewLink(nthViewLink = 0) {
  if (nthViewLink !== 0) {
    console.log("Going back to the Homepage");
    await browser.waitUntilClickableNative(BottomBarSO.home, "Home button is not clickable");
    await BottomBarSO.home.click();
  }

  console.log(`Navigating with ViewLink ...`);
  const nthQuickLink = new QuickLinkSO(sectionElementsSO.linkElements[nthViewLink]);
  await browser.waitUntilClickableNative(nthQuickLink.element, `ViewLink ${nthViewLink + 1} is not clickable`);
  await nthQuickLink.element.click();
}

/**
 * Create a cross platform solution for opening a deep link
 *
 * @param {string} url
 */
async function openUrl(url, options = {}) {
  console.log(`Navigating to url ${url}...`);

  // wait until for:
  // `if (isMounting) {` in `router.ts` which will go to homepage
  await browser.waitUntilDisplayed(BottomBarSO.home);

  if (driver.isIOS) {
    if (options.isViewLinkStartPage) {
      await openHomeViewLink(options.nthViewLink);
    } else {
      await openIosViewWithDeepLink(url, options);
    }
  } else {
    // Android: Deep link execution
    await driver.execute("mobile: deepLink", {
      url: `${prefix}${url}`,
      package: packageName,
      waitForLaunch: true,
    });
  }
}

async function openDeeplink(url, options = {}) {
  console.log(`Navigating to url ${url}...`);

  if (driver.isIOS) {
    await openIosViewWithDeepLink(url, options);
  } else {
    // Android: Deep link execution
    await driver.execute("mobile: deepLink", {
      url: `${prefix}${url}`,
      package: packageName,
      waitForLaunch: true,
    });
  }
}

async function executeDeeplinkCommand(url) {
  console.log(`Navigating to url ${url}...`);

  await driver.execute("mobile: deepLink", {
    url: `${prefix}${url}`,
    package: packageName,
    waitForLaunch: true,
  });
}

async function startApp(url, options = {}) {
  const mergedOptions = {
    pullToRefresh: false,
    isViewLinkStartPage: false,
    wdyrEnabled: false,
    ...options,
  };

  if (!url) {
    throw new Error("You must define a base url to start your test in, use 'home' if you want the homepage");
  }

  console.log("Opening app...");

  const appArguments =
    browser.capabilities["appium:optionalIntentArguments"] ||
    browser.capabilities.optionalIntentArguments ||
    browser.capabilities["appium:processArguments"]?.args ||
    browser.capabilities.processArguments?.args;

  if (driver.isIOS) {
    const environment =
      browser.capabilities["appium:processArguments"]?.env || browser.capabilities.processArguments?.env;

    const args = [...appArguments];

    if (mergedOptions.pullToRefresh) args.push("--pullToRefresh=true");
    if (mergedOptions.wdyrEnabled) args.push("--wdyrEnabled=true");

    if (mergedOptions.shouldTerminateAppBeforeStart) {
      await driver.terminateApp(bundleId);
    }

    await driver.execute("mobile: launchApp", {
      bundleId,
      arguments: args,
      environment,
    });
  } else {
    if (mergedOptions.shouldTerminateAppBeforeStart) {
      await driver.terminateApp(packageName);
    }

    await driver.startActivity(
      packageName,
      splashActivity,
      packageName,
      mainActivity,
      "android.intent.action.MAIN",
      "android.intent.category.LAUNCHER",
      "",
      `${appArguments} --ez pullToRefresh ${mergedOptions.pullToRefresh} --ez wdyrEnabled ${mergedOptions.wdyrEnabled}`,
      "false",
    );
  }

  if (mergedOptions.dismissOnboarding) {
    await bottomSheetSO.dismiss();
  }

  if (url !== "home") {
    await openUrl(url, { isViewLinkStartPage: mergedOptions.isViewLinkStartPage });
  } else if (mergedOptions.isViewLinkStartPage) {
    await openHomeViewLink();
  }
}

async function getInAppBrowserUrlDomain() {
  // ios
  if (driver.isIOS) {
    const urlBar = await browser.$('//XCUIElementTypeButton[@name="URL"]');

    await browser.waitUntilDisplayed(urlBar, "Can't find the url bar for in app browser.");

    const urlBarValue = await urlBar.getText();

    // split required because in iOS the value is as following: `support.betfair.com, secure and validated`
    return urlBarValue.split(",")[0];
  }

  // android
  const urlBar = await browser.$('//android.widget.TextView[ends-with(@resource-id, "url_bar")]');

  try {
    if (!(await urlBar.isDisplayed())) {
      // first time chrome is opened we need to accept terms and conditions
      const acceptTCButton = await browser.$('//android.widget.Button[ends-with(@resource-id, "terms_accept")]');
      const noThanksButton = await browser.$('//android.widget.Button[ends-with(@resource-id, "negative_button")]');

      await browser.waitUntilClickableNative(acceptTCButton, "Can't find T&C Chrome button.");
      await acceptTCButton.click();

      await browser.waitUntilClickableNative(noThanksButton, "Can't find 'No Thanks' button.");
      await noThanksButton.click();
    }
  } catch (e) {
    console.log("Chrome failed to accept T&C. Maybe it was already opened before?");
  }

  await browser.waitUntilDisplayed(urlBar, "Can't find the url bar for in app browser.");

  return urlBar.getText();
}

module.exports = {
  openUrl,
  openDeeplink,
  executeDeeplinkCommand,
  startApp,
  getInAppBrowserUrlDomain,
  openHomeViewLink,
};
