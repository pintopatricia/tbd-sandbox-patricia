import { BottomBarPO, MyBetsPagePO, CookieConsentBannerPO } from "../page-objects";
import { browser } from "@wdio/globals";
import { openPage } from "./navigation.util";
import { getMyBetsViewUrl } from "./../../utils/routes";

const bottomBarPO = new BottomBarPO();
const myBetsPagePO = new MyBetsPagePO();
const cookieBanner = new CookieConsentBannerPO();

export async function navigateToMyBets() {
  // navigate to My Bets
  await bottomBarPO.myBetsTile.waitForClickable();
  await bottomBarPO.myBetsTile.click();
  await myBetsPagePO.element.waitForDisplayed();
  // force my bets update with refresh
  await openPage(getMyBetsViewUrl());
  await myBetsPagePO.element.waitForDisplayed();
  await cookieBanner.acceptAllCookies();
}

export async function scrollToCashoutButton() {
  // Check if element is visible on load
  const isCashoutAvailable = await myBetsPagePO.cashoutButton.isExisting();

  if (!isCashoutAvailable) {
    await browser.waitUntil(
      async () => {
        // Scroll down to get cashout button if not visible
        await browser.execute(() => {
          window.scrollBy(0, 250);
        });

        await browser.pause(1000); // wait for lazy loading

        return myBetsPagePO.cashoutButton.isExisting();
      },
      {
        timeout: 90000,
        timeoutMsg: "Element not visible after scrolling",
      },
    );
  }

  // double click on the cashout button to trigger the cashout & confirm
  await myBetsPagePO.cashoutButton.scrollIntoView({ block: "center" });
  await browser.waitUntilStopsMoving(myBetsPagePO.cashoutButton);
}

export async function performCashout() {
  await scrollToCashoutButton();
  await myBetsPagePO.cashoutButton.click();
  await myBetsPagePO.cashoutButton.click();
}

export async function waitForClickable(element) {
  // Checking if the cashout button contains the label is the only way to know if you can click on the button
  await browser.waitUntil(async () => (await element.getText()).includes("Cash Out:"), {
    timeoutMsg: `The current cashout button doesn't have the correct label. Current label ${element.getText()}`,
  });

  await element.waitForClickable();
}
