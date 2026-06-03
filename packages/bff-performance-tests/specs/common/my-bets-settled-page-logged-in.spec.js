const { MyBetsHeaderPO, MyBetsPagePO, FooterPO } = require("@ppb/tbd-tests-web/page-objects");
const { scrollDown } = require("../../utils/scroll");
const { getLoginData } = require("../../conf/login.conf");
const { getCookieDomain, setSsoIdCookie } = require("../../utils/login.utils");

const myBetsPO = new MyBetsPagePO();
const myBetsHeaderPO = new MyBetsHeaderPO(myBetsPO.header);
const footerPO = new FooterPO().element;

xdescribe("My Bets Settled Page Logged in", () => {
  let networkRecording;

  beforeAll(
    async function () {
      const { user, password } = getLoginData("performanceTest");

      await setSsoIdCookie(user, password, getCookieDomain());

      this.journeyName = "my-bets-settled-page-logged-in";
      networkRecording = this.networkRecording;
      await networkRecording.recordUrl("mybets/settled/mb-736574746c6564?throttlesOff=PRELOAD_CATALOG");

      await browser.waitUntilEquals(
        myBetsHeaderPO.title,
        "My Bets",
        "Timed out waiting for 'My Bets' header title to be present.",
      );
    },
    jasmine.DEFAULT_TIMEOUT_INTERVAL,
    2, // re-runs at most, CAL is returning timeouts and failing this
  );

  it("should be fast", async () => {
    await browser.waitUntil(() => networkRecording.isNetworkStable(), {
      timeoutMsg: "Timed out waiting for network to become stable before starting to scroll down.",
    });

    networkRecording.setInteractionTag("User scrolls");

    await browser.waitUntil(async () => {
      await scrollDown();
       
      return (await footerPO.isDisplayed()) === true;
    });

    await scrollDown();

    await browser.waitUntil(() => networkRecording.isNetworkStable(), {
      timeoutMsg: "Timed out waiting for network to become stable after scrolling down.",
    });
  });
});
