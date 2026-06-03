const { HeaderPO } = require("../../../../../page-objects");
const { getWallets } = require("@flutter-global/uki-channels-http-clients/mock-index").WALLET;
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const headerPO = new HeaderPO();

const mockService = new MockService();

const EVENT_ID = "29465861";

describe("show/hide balance feature", () => {
  describe("[620751] When showBalance = true, NA is displayed when WAS not responding", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(`ppb:tbd:view:event:${EVENT_ID}`, { showBalances: "true" }));
      await browser.url(routes.getEventViewUrl(EVENT_ID));
      await browser.waitUntilDisplayed(headerPO.element);
      await browser.waitUntilEquals(headerPO.balanceLabel, "NA");
    });

    it("[PRPI-5952] then balance label and balance icon are also displayed", async () => {
      expect(await headerPO.balanceLabel.isDisplayed()).toBe(true);
      expect(await headerPO.balanceIcon.isDisplayed()).toBe(true);
    });

    describe("[620751] When WAS return balance on response, $123.68 value is displayed", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(
          getWallets([
            { amount: "123.68", walletName: "MAIN" },
            { amount: "10.00", walletName: "EXCHANGE_BONUS_CASH" },
            { amount: "10.00", walletName: "SPORTSBOOK_BONUS" },
          ]),
        );
        await browser.tickFakeClock();
        await browser.waitUntilDisplayed(headerPO.element);
        await browser.waitUntilEquals(headerPO.balanceLabel, "$123.68");
      });

      it("[PRPI-5953] then balance label and balance icon are also displayed", async () => {
        expect(await headerPO.balanceLabel.isDisplayed()).toBe(true);
        expect(await headerPO.balanceIcon.isDisplayed()).toBe(true);
      });

      describe("[620751] When showBalance = false, balance label is not displayed in header", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(
            await getIndexHTML(`ppb:tbd:view:event:${EVENT_ID}`, { showBalances: "false" }),
          );
          await browser.url(routes.getEventViewUrl(EVENT_ID));
          await browser.waitUntilDisplayed(headerPO.element);
          await browser.waitUntilNotDisplayed(headerPO.balanceLabel);
        });

        it("[PRPI-5954] then only the balance icon is displayed in header (without the balance value)", async () => {
          expect(await headerPO.balanceIcon.isDisplayed()).toBe(true);
        });
      });
    });
  });
});
