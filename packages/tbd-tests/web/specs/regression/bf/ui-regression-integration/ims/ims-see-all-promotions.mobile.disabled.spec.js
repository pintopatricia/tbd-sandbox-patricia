const ImsPromotionErrorCardPO = require("@ppb/tbd-shared/components/ImsPromotionErrorCard/ImsPromotionErrorCard.web.po");

const routes = require("../../../../../../../utils/routes");

const imsPromotionErrorCardPO = new ImsPromotionErrorCardPO();

describe("IMS Promotions - See All Our Promotions", () => {
  describe("When user is on a invalid IMS Promotion page and clicks on See All Our Promotions", () => {
    beforeAll(async () => {
      await browser.url(routes.getImsPromotionViewUrl("invalid-ims-promotion"));
      await browser.waitUntilDisplayed(imsPromotionErrorCardPO.element);
      await imsPromotionErrorCardPO.button.click();
    });

    it("[PRPI-6609] the user should be redirected to promotion hub page", async () => {
      const url = await browser.getUrl();

      expect(url.endsWith("casino/p-1")).toBe(true, `${url} does not have the promotion hub page ending`);
    });
  });
});
