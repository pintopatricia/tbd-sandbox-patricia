const { getAppContext, getGenericLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getWallets } = require("@flutter-global/uki-channels-http-clients/mock-index").WALLET;

const { startApp } = require("../../../../../../helpers/urls");
const MockService = require("../../../../../../mock-essentials/mocking-service");
const { HeaderSO, StatusLabelSO } = require("../../../../../../screen-objects");

const mockService = new MockService(browser);
const headerSO = new HeaderSO();
const statusLabelSO = new StatusLabelSO(headerSO.generosityWalletButton);

const BFF_HOME_VIEW_MOCK = {
  urn: "ppb:tbd:view:generic:home",
};

describe("Sportsbook Generosity Wallet", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      getAppContext({
        throttles: {
          FREE_BETS_WALLET: {
            isActive: true,
          },
        },
        userdetails: {
          timezone: "Europe/London",
          localeCodeBcp47: "en-US",
        },
      }),
    );

    await mockService.mockHttpRequest(
      getWallets([
        { amount: "5.00", walletName: "MAIN" },
        { amount: "0.00", walletName: "SPORTSBOOK_BONUS" },
        { amount: "0", walletName: "BOOST_TOKENS" },
        { amount: "0", walletName: "ACCA_INSURANCE_TOKENS" },
      ]),
    );

    await mockService.mockHttpRequest(getGenericLayout(BFF_HOME_VIEW_MOCK));
    await startApp("home");
    await browser.waitUntilClickableNative(headerSO.balance);
  });

  describe("When the user has no tokens", () => {
    it("[PRPI-3589] should not display the generosity label", async () => {
      expect(await headerSO.generosityWalletButton).not.toBeDisplayed();
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
      await browser.waitUntil(async () => (await statusLabelSO.text.getText()) === "$40.00");
    });

    it("[PRPI-3590] should display the Free Bet total value", async () => {
      expect(await headerSO.generosityWalletButton).toBeDisplayed();
      expect(await statusLabelSO.text.getText()).toBe("$40.00");
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
      await browser.waitUntil(async () => (await statusLabelSO.text.getText()) === "Bonuses");
    });
    it("[PRPI-3592] should display the 'Bonuses' label", async () => {
      expect(await headerSO.generosityWalletButton).toBeDisplayed();
      expect(await statusLabelSO.text.getText()).toBe("Bonuses");
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
      await browser.waitUntil(async () => (await statusLabelSO.text.getText()) === "$40.00");
    });

    it("[PRPI-3591] should display the Free Bet total value", async () => {
      expect(await headerSO.generosityWalletButton).toBeDisplayed();
      expect(await statusLabelSO.text.getText()).toBe("$40.00");
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
      await browser.waitUntil(async () => (await statusLabelSO.text.getText()) === "Bonuses");
    });

    it("[PRPI-3593] should display the 'Bonuses' label", async () => {
      expect(await headerSO.generosityWalletButton).toBeDisplayed();
      expect(await statusLabelSO.text.getText()).toBe("Bonuses");
    });
  });
});
