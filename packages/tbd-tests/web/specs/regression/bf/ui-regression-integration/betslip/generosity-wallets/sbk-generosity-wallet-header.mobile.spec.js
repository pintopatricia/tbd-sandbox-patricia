const { getGenericLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getWallets } = require("@flutter-global/uki-channels-http-clients/mock-index").WALLET;

const { HeaderPO, StatusLabelPO } = require("../../../../../../page-objects");
const routes = require("../../../../../../../utils/routes");
const MockService = require("../../../../../../mock-essentials/mocking-service");
const { getIndexHTML } = require("../../../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../../../mock-essentials/controllers/fonts/fonts-controller");
const { WALLET_UPDATE_TIMEOUT } = require("../../../../../../config/intervals.conf");

const mockService = new MockService(browser);

const headerPO = new HeaderPO();
const statusLabelPO = new StatusLabelPO(headerPO.generosityWalletButton);

const BFF_HOME_VIEW_MOCK = {
  urn: "ppb:tbd:view:generic:home",
};

describe("Sportsbook Generosity Wallet", () => {
  beforeAll(async () => {
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(
      await getIndexHTML(BFF_HOME_VIEW_MOCK.urn, {
        FREE_BETS_WALLET: { isActive: true },
        date: "2019-06-26T09:00:00.000Z",
      }),
    );
    await mockService.mockHttpRequest(getGenericLayout(BFF_HOME_VIEW_MOCK));
    await browser.url(routes.getHomeViewUrl());
  });
  describe("When the user has no tokens", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(
        getWallets([
          { amount: "5.00", walletName: "MAIN" },
          { amount: "0.00", walletName: "SPORTSBOOK_BONUS" },
          { amount: "0", walletName: "BOOST_TOKENS" },
          { amount: "0", walletName: "ACCA_INSURANCE_TOKENS" },
        ]),
      );
      await browser.tickFakeClock(WALLET_UPDATE_TIMEOUT);
    });
    it("[PRPI-3589]should not display the generosity label", async () => {
      expect(await headerPO.generosityWalletButton).not.toBeDisplayed();
    });
  });

  describe("When the user has Free Bets", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(
        getWallets([
          { amount: "5.00", walletName: "MAIN" },
          { amount: "40.00", walletName: "SPORTSBOOK_BONUS" },
          { amount: "10", walletName: "BOOST_TOKENS" },
          { amount: "0", walletName: "ACCA_INSURANCE_TOKENS" },
        ]),
      );
      await browser.tickFakeClock(WALLET_UPDATE_TIMEOUT);
    });
    it("[PRPI-3590]should display the Free Bet total value", async () => {
      expect(await headerPO.generosityWalletButton).toBeDisplayed();
      expect(await statusLabelPO.text.getText()).toBe("$40.00");
    });
  });

  describe("When the user has Free Bets and other tokens", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(
        getWallets([
          { amount: "5.00", walletName: "MAIN" },
          { amount: "40.00", walletName: "SPORTSBOOK_BONUS" },
          { amount: "10", walletName: "BOOST_TOKENS" },
          { amount: "2", walletName: "ACCA_INSURANCE_TOKENS" },
        ]),
      );
      await browser.tickFakeClock(WALLET_UPDATE_TIMEOUT);
    });
    it("[PRPI-3591]should display the Free Bet total value", async () => {
      expect(await headerPO.generosityWalletButton).toBeDisplayed();
      expect(await statusLabelPO.text.getText()).toBe("$40.00");
    });
  });

  describe("When the user has boost tokens but no Free Bets", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(
        getWallets([
          { amount: "5.00", walletName: "MAIN" },
          { amount: "0.00", walletName: "SPORTSBOOK_BONUS" },
          { amount: "10", walletName: "BOOST_TOKENS" },
          { amount: "0", walletName: "ACCA_INSURANCE_TOKENS" },
        ]),
      );
      await browser.tickFakeClock(WALLET_UPDATE_TIMEOUT);
    });
    it("[PRPI-3592]should display the 'Bonuses' label", async () => {
      expect(await headerPO.generosityWalletButton).toBeDisplayed();
      expect(await statusLabelPO.text.getText()).toBe("Bonuses");
    });
  });

  describe("When the user has acca insurance tokens but no Free Bets", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(
        getWallets([
          { amount: "5.00", walletName: "MAIN" },
          { amount: "0.00", walletName: "SPORTSBOOK_BONUS" },
          { amount: "0", walletName: "BOOST_TOKENS" },
          { amount: "10", walletName: "ACCA_INSURANCE_TOKENS" },
        ]),
      );
      await browser.tickFakeClock(WALLET_UPDATE_TIMEOUT);
    });
    it("[PRPI-3593]should display the 'Bonuses' label", async () => {
      expect(await headerPO.generosityWalletButton).toBeDisplayed();
      expect(await statusLabelPO.text.getText()).toBe("Bonuses");
    });
  });
});
