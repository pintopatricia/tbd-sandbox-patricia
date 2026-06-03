const { HeaderPO } = require("../../../../../page-objects");
const { getWallets } = require("@flutter-global/uki-channels-http-clients/mock-index").WALLET;
const { getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const { WALLET_UPDATE_TIMEOUT } = require("../../../../../config/intervals.conf");
const routes = require("../../../../../../utils/routes");

const headerPO = new HeaderPO();

const mockService = new MockService();

const EVENT_ID = "29465861";

const BFF_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  edges: [
    {
      node: {
        away: "Portugal",
        home: "Ukraine",
        sportevent: {
          name: "Ukraine v Portugal",
          openDate: "2010-10-14T18:45",
          urn: "ppb:event:29465861",
          __typename: "SportsEvent",
        },
        urn: "ppb:tbd:card:fixture:29465861",
        __typename: "FixtureCard",
      },
    },
  ],
};

describe("Header", () => {
  describe("When the user opens the event page and is logged in", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn, { date: "2009-10-10T18:00" }));
      await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
    });

    describe("When the first wallet request succeeds", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(
          getWallets([
            { amount: "123.68", walletName: "MAIN" },
            { amount: "10.00", walletName: "EXCHANGE_BONUS_CASH" },
            { amount: "10.00", walletName: "SPORTSBOOK_BONUS" },
          ]),
        );
        await browser.url(routes.getEventViewUrl(EVENT_ID));
        await browser.waitUntilEquals(headerPO.balanceLabel, "$123.68");
      });

      it("[PRPI-7664] the balance should be displayed", async () => {
        expect(await headerPO.balanceLabel.getText()).toEqual("$123.68");
      });

      describe("When the balance changes", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(
            getWallets([
              { amount: "25.00", walletName: "MAIN" },
              { amount: "10.00", walletName: "EXCHANGE_BONUS_CASH" },
              { amount: "10.00", walletName: "SPORTSBOOK_BONUS" },
            ]),
          );
          await browser.tickFakeClock(WALLET_UPDATE_TIMEOUT);
          await browser.waitUntilEquals(headerPO.balanceLabel, "$25.00");
        });

        it("[PRPI-7665] the wallet balance should be updated", async () => {
          expect(await headerPO.balanceLabel.getText()).toEqual("$25.00");
        });
      });

      describe("When the balance fails after a first successful request", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(
            getWallets([
              { amount: "123.68", walletName: "MAIN" },
              { amount: "10.00", walletName: "EXCHANGE_BONUS_CASH" },
              { amount: "10.00", walletName: "SPORTSBOOK_BONUS" },
            ]),
          );
          await browser.tickFakeClock(WALLET_UPDATE_TIMEOUT);
          await browser.waitUntilEquals(headerPO.balanceLabel, "$123.68");

          await mockService.mockHttpRequest(
            getWallets(
              [{ walletName: "MAIN" }, { walletName: "EXCHANGE_BONUS_CASH" }, { walletName: "SPORTSBOOK_BONUS" }],
              true,
            ),
          );
          await browser.tickFakeClock(WALLET_UPDATE_TIMEOUT);
          await browser.waitUntilEquals(headerPO.balanceLabel, "$123.68");
        });

        it("[PRPI-7666] the wallet balance should be updated", async () => {
          expect(await headerPO.balanceLabel.getText()).toEqual("$123.68");
        });
      });
    });

    describe("When the balance fails on the first request", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(
          getWallets(
            [{ walletName: "MAIN" }, { walletName: "EXCHANGE_BONUS_CASH" }, { walletName: "SPORTSBOOK_BONUS" }],
            true,
          ),
        );
        await browser.url(routes.getEventViewUrl(EVENT_ID));

        await browser.waitUntilEquals(headerPO.balanceLabel, "NA");
      });

      it("[PRPI-7667] NA message is displayed", async () => {
        expect(await headerPO.balanceLabel.getText()).toEqual("NA");
      });

      describe("but then succeeds", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(
            getWallets([
              { amount: "42.42", walletName: "MAIN" },
              { amount: "10.00", walletName: "EXCHANGE_BONUS_CASH" },
              { amount: "10.00", walletName: "SPORTSBOOK_BONUS" },
            ]),
          );
          await browser.tickFakeClock(WALLET_UPDATE_TIMEOUT);
          await browser.waitUntilEquals(headerPO.balanceLabel, "$42.42");
        });

        it("[PRPI-7668] the balance is updated", async () => {
          expect(await headerPO.balanceLabel.getText()).toEqual("$42.42");
        });
      });
    });
  });
});
