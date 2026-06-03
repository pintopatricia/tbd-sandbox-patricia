const { GenericPagePO, FooterPO } = require("@ppb/tbd-tests-web/page-objects");
const { scrollDown } = require("../../utils/scroll");

const genericPagePO = new GenericPagePO();
const footerPO = new FooterPO().element;

describe("Inplay page logged out", () => {
  let networkRecording;

  beforeAll(
    async function () {
      this.journeyName = "inplay-page-logged-out";
      networkRecording = this.networkRecording;
      await networkRecording.recordUrl("view/d-inplay?throttlesOff=PRELOAD_CATALOG");

      await browser.waitUntil(async () => (await genericPagePO.genericViewCards.length) > 0, {
        timeoutMsg: "Timed out waiting for generic view cards to be present.",
      });
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

       
      await browser.pause(100); // wait for network req to be sent (or to not be sent)
      await browser.waitUntil(() => networkRecording.isNetworkStable());

      return (await genericPagePO.placeholders.length) === 0;
    });

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
