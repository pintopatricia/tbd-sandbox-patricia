import {
  HeaderPO,
  UserProfileHeaderPO,
  UserProfilePO,
  SectionElementsPO,
  QuickLinkPO,
  CookieConsentBannerPO,
  RadioListPO,
} from "../page-objects";
import NavigationTabsListPO from "@ppb/tbd-shared/components/NavigationTabsList/NavigationTabsList.po";
import { browser } from "@wdio/globals";

const { extractJsonData } = require("../../utils/extractJsonData");

const brand = process.env.BRAND;
const userSettings = extractJsonData(`../../../packages/tbd-tests/web/specs/e2e/${brand}/config/settings.json`);

const headerPO = new HeaderPO();
const userProfileHeaderPO = new UserProfileHeaderPO();
const userProfilePO = new UserProfilePO();
const accountDetailsLinksSection = new SectionElementsPO(userProfilePO.groupSections[userSettings.settingsPosition]);
const settingsAndDetailsQuicklink = new QuickLinkPO(accountDetailsLinksSection.links[1]);
const cookieBanner = new CookieConsentBannerPO();
const navigationTabsListPO = new NavigationTabsListPO();
const radioListPO = new RadioListPO(navigationTabsListPO.tabItems[1]);

export async function navigateToSettingsAndDetails() {
  //Open User Profile Page
  await headerPO.balanceIcon.waitForDisplayed({ timeoutMsg: "Balance icon was not displayed" });
  await headerPO.balanceIcon.click();

  await userProfileHeaderPO.element.waitForDisplayed({ timeoutMsg: "User profile header was not displayed" });
  await cookieBanner.acceptAllCookies();

  // Go to Settings and Details
  await browser.waitUntilDisplayed(accountDetailsLinksSection.title);
  await accountDetailsLinksSection.title.scrollIntoView();
  await accountDetailsLinksSection.title.waitForDisplayed({
    timeoutMsg: "Settings & Details was not displayed",
  });
  await browser.waitUntilDisplayed(accountDetailsLinksSection.title);
  await settingsAndDetailsQuicklink.element.click();
}

export async function disableOddsMovement() {
  await navigateToSettingsAndDetails();
  await cookieBanner.acceptAllCookies();

  await radioListPO.itemInput[1].click();
  await userProfileHeaderPO.closeButton.click();
  await cookieBanner.acceptAllCookies();
}

export async function validateOddsMovementIsEnabled() {
  await cookieBanner.acceptAllCookies();

  const isSelected = await radioListPO.itemInput[0].isSelected();
  await userProfileHeaderPO.closeButton.click();
  return isSelected;
}
