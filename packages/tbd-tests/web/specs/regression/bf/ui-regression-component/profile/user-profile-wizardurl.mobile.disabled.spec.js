const { getWallets } = require("@flutter-global/uki-channels-http-clients/mock-index").WALLET;
const { getMyAccountLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const mockService = new MockService();
const URL = `${routes.getHomeViewUrl()}/`;

const USR_PRF_EDGES_MOCK = [
  {
    node: {
      __typename: "LinksCard",
      urn: "ppb:tbd:card:links:myaccount#menuSection",
      section: [
        {
          __typename: "LinksMenuSections",
          title: "My Betfair Rewards & Promotions",
          sectionType: "GENERIC",
          items: [
            {
              __typename: "RegulatoryLinkItem",
              url: "https://promos.qa.com.betfair/sport?prod=90&hideHeader=true&returnURL=https%3A%2F%2Fwww%2Eqa.com.betfair%2Fsport",
              text: "My Promotions",
              target: "_self",
              alignment: "LEFT",
            },
            {
              __typename: "RegulatoryLinkItem",
              url: "https://promos.qa.com.betfair/refer-and-earn?prod=90&hideHeader=true&returnURL=https%3A%2F%2Fwww%2Eqa.com.betfair%2Fsport",
              text: "Refer & Earn",
              target: "_self",
              alignment: "LEFT",
            },
            {
              __typename: "RegulatoryLinkItem",
              url: "https://promos.qa.com.betfair/mybonuses?prod=90&hideHeader=true&returnURL=https%3A%2F%2Fwww%2Eqa.com.betfair%2Fsport",
              text: "Active Bonuses",
              target: "_self",
              alignment: "LEFT",
            },
          ],
        },
        {
          __typename: "LinksMenuSections",
          title: "Account Details",
          sectionType: "GENERIC",
          items: [
            {
              __typename: "RegulatoryLinkItem",
              url: "https://myaccount.qa.com.betfair/accountdetails/mydetails?prod=90&width=320px&showHeader=0",
              text: "My Details",
              target: "_self",
              alignment: "LEFT",
            },
            {
              __typename: "RegulatoryLinkItem",
              url: "https://myaccount.qa.com.betfair/activity/premium-charges?prod=90",
              text: "Premium Charges",
              target: "_self",
              alignment: "LEFT",
            },
          ],
        },
        {
          __typename: "LinksMenuSections",
          title: "My Wallet",
          sectionType: "GENERIC",
          items: [
            {
              __typename: "RegulatoryLinkItem",
              url: "https://myfunds.qa.com.betfair/manage/cards?prod=90&width=320px&showHeader=0&returnURL=https%3A%2F%2Fmyaccount.qa.com.betfair%2Faccount%2Fnavigation%3Fprod%3D90",
              text: "My Card Details",
              target: "_self",
              alignment: "LEFT",
            },
            {
              __typename: "RegulatoryLinkItem",
              url: "https://myaccount.qa.com.betfair/payments/transfer?prod=90&showHeader=0",
              text: "Transfer Funds",
              target: "_self",
              alignment: "LEFT",
            },
          ],
        },
        {
          __typename: "LinksMenuSections",
          title: "Safer Gambling",
          sectionType: "GENERIC",
          items: [
            {
              __typename: "RegulatoryLinkItem",
              url: "https://myaccount.qa.com.betfair/playerprotection?prod=90&showHeader=0",
              text: "Player Protection Tools",
              target: "_self",
              alignment: "LEFT",
            },
            {
              __typename: "RegulatoryLinkItem",
              url: "https://responsiblegambling.qa.com.betfair?showHeader=1",
              text: "Responsible Gambling Information",
              target: "_blank",
              alignment: "LEFT",
            },
          ],
        },
        {
          __typename: "LinksMenuSections",
          title: "Betting Activity",
          sectionType: "GENERIC",
          items: [
            {
              __typename: "RegulatoryLinkItem",
              url: "https://myactivity.qa.com.betfair/#/sportsbook?prod=90&showHeader=0&returnURL=https%3A%2F%2Fmyaccount.qa.com.betfair%2Faccount%2Fnavigation%3Fprod%3D90/#/sportsbook",
              text: "My Sportsbook Bets",
              target: "_self",
              alignment: "LEFT",
            },
            {
              __typename: "RegulatoryLinkItem",
              url: "https://myactivity.qa.com.betfair/#/exchange?prod=90&showHeader=0&returnURL=https%3A%2F%2Fmyaccount.qa.com.betfair%2Faccount%2Fnavigation%3Fprod%3D90",
              text: "My Exchange Bets",
              target: "_self",
              alignment: "LEFT",
            },
            {
              __typename: "RegulatoryLinkItem",
              url: "https://myactivity.qa.com.betfair/#/transactions?prod=90&showHeader=0&returnURL=https%3A%2F%2Fmyaccount.qa.com.betfair%2Faccount%2Fnavigation%3Fprod%3D90/#/transactions",
              text: "Transaction History",
              target: "_self",
              alignment: "LEFT",
            },
          ],
        },
        {
          __typename: "LinksMenuSections",
          title: "Help & Support",
          sectionType: "GENERIC",
          items: [
            {
              __typename: "RegulatoryLinkItem",
              url: "https://support.qa.com.betfair/app/home/?prod=90",
              text: "Help & Support",
              target: "_blank",
              alignment: "LEFT",
            },
          ],
        },
      ],
    },
  },
  {
    node: {
      __typename: "QuickLinksCard",
      urn: "ppb:tbd:card:quickLinks:myAccount",
      quickLinksTitle: "All Competitions",
      links: [
        {
          label: "Deposit",
          viewLink: {
            viewUrn: "ppb:tbd:view:external:external",
            viewUrl:
              "https://myfunds.qa.com.betfair/deposit?prod=90&showHeader=0&returnURL=https%3A%2F%2Fmyaccount.qa.com.betfair%2Faccount%2Fnavigation%3Fprod%3D90",
          },
          target: "_self",
          icon: "deposit",
        },
        {
          label: "Withdraw",
          viewLink: {
            viewUrn: "ppb:tbd:view:external:external",
            viewUrl:
              "https://myfunds.qa.com.betfair/withdrawal?prod=90&showHeader=0&returnURL=https%3A%2F%2Fmyaccount.qa.com.betfair%2Faccount%2Fnavigation%3Fprod%3D90",
          },
          target: "_self",
          icon: "withdraw",
        },
      ],
    },
  },
  {
    node: {
      __typename: "BalanceCard",
      urn: "ppb:tbd:card:balance:myaccount#balanceCard",
      wallets: [
        {
          name: "MAIN",
        },
        {
          name: "XG",
        },
        {
          name: "POKER",
        },
        {
          name: "CASINO_BONUS",
        },
        {
          name: "ARCADE_BONUS",
        },
        {
          name: "SPORTSBOOK_BONUS",
        },
        {
          name: "FROZEN",
        },
        {
          name: "SPORTSBOOK_BONUS_CASH",
        },
        {
          name: "SPORTSBOOK_BONUS_WAGERING",
        },
        {
          name: "EXCHANGE_BONUS_CASH",
        },
        {
          name: "BOOST_TOKENS",
        },
      ],

      walletSections: [
        {
          __typename: "WalletSectios",
          key: "CASH",
          label: "Balance",
          name: "Cash",
          walletRules: [
            {
              __typename: "WalletRule",
              name: "Cash Total",
              hideIfZero: false,
              withCurrency: true,
              aggregationRules: [
                {
                  __typename: "WalletAggregationRule",
                  field: "amount",
                  sign: "+",
                  wallet: "MAIN",
                },
                {
                  __typename: "WalletAggregationRule",
                  field: "amount",
                  sign: "+",
                  wallet: "XG",
                },
                {
                  __typename: "WalletAggregationRule",
                  field: "amount",
                  sign: "+",
                  wallet: "POKER",
                },
              ],
            },
            {
              __typename: "WalletRule",
              name: "Main Wallet",
              hideIfZero: false,
              withCurrency: true,
              aggregationRules: [
                {
                  __typename: "WalletAggregationRule",
                  field: "amount",
                  sign: "+",
                  wallet: "MAIN",
                },
              ],
            },
            {
              __typename: "WalletRule",
              name: "Exchange Games Wallet",
              hideIfZero: false,
              withCurrency: true,
              aggregationRules: [
                {
                  __typename: "WalletAggregationRule",
                  field: "amount",
                  sign: "+",
                  wallet: "XG",
                },
              ],
            },
            {
              __typename: "WalletRule",
              name: "Poker Wallet",
              hideIfZero: false,
              withCurrency: true,
              aggregationRules: [
                {
                  __typename: "WalletAggregationRule",
                  field: "amount",
                  sign: "+",
                  wallet: "POKER",
                },
              ],
            },
          ],
        },
        {
          __typename: "WalletSectios",
          key: "SPORTSBOOK_BONUSES",
          label: "Free Bets",
          name: "Sportsbook",
          walletRules: [
            {
              __typename: "WalletRule",
              name: "Sportsbook Free Bets",
              hideIfZero: true,
              withCurrency: true,
              aggregationRules: [
                {
                  __typename: "WalletAggregationRule",
                  field: "amount",
                  sign: "+",
                  wallet: "SPORTSBOOK_BONUS_CASH",
                },
              ],
            },
            {
              __typename: "WalletRule",
              name: "Pending winning - awaiting bet settlement",
              hideIfZero: true,
              withCurrency: true,
              aggregationRules: [
                {
                  __typename: "WalletAggregationRule",
                  field: "amount",
                  sign: "+",
                  wallet: "FROZEN",
                },
              ],
            },
            {
              __typename: "WalletRule",
              name: "Odds Boosts",
              hideIfZero: false,
              withCurrency: false,
              aggregationRules: [
                {
                  __typename: "WalletAggregationRule",
                  field: "amount",
                  sign: "+",
                  wallet: "BOOST_TOKENS",
                },
              ],
            },
          ],
        },
        {
          __typename: "WalletSectios",
          key: "EXCHANGE_BONUSES",
          label: "Bonus",
          name: "Exchange",
          walletRules: [
            {
              __typename: "WalletRule",
              name: "Free Bets",
              hideIfZero: false,
              withCurrency: true,
              aggregationRules: [
                {
                  __typename: "WalletAggregationRule",
                  field: "amount",
                  sign: "+",
                  wallet: "EXCHANGE_BONUS_CASH",
                },
              ],
            },
            {
              __typename: "WalletRule",
              name: "Exchange Games Bonus",
              hideIfZero: false,
              withCurrency: true,
              aggregationRules: [
                {
                  __typename: "WalletAggregationRule",
                  field: "bonus",
                  sign: "+",
                  wallet: "XG",
                },
              ],
            },
          ],
        },
        {
          __typename: "WalletSectios",
          key: "ARCADE_BONUSES",
          label: "Bonus",
          name: "Arcade",
          walletRules: [
            {
              __typename: "WalletRule",
              name: "Arcade Bonus",
              hideIfZero: false,
              withCurrency: true,
              aggregationRules: [
                {
                  __typename: "WalletAggregationRule",
                  field: "amount",
                  sign: "+",
                  wallet: "ARCADE_BONUS",
                },
              ],
            },
          ],
        },
        {
          __typename: "WalletSectios",
          key: "CASINO_BONUSES",
          label: "Bonus",
          name: "Casino",
          walletRules: [
            {
              __typename: "WalletRule",
              name: "Casino Bonus",
              hideIfZero: false,
              withCurrency: true,
              aggregationRules: [
                {
                  __typename: "WalletAggregationRule",
                  field: "real",
                  sign: "+",
                  wallet: "CASINO_BONUS",
                },
                {
                  __typename: "WalletAggregationRule",
                  field: "bonus",
                  sign: "+",
                  wallet: "CASINO_BONUS",
                },
                {
                  __typename: "WalletAggregationRule",
                  field: "winnings",
                  sign: "+",
                  wallet: "CASINO_BONUS",
                },
              ],
            },
          ],
        },
      ],
    },
  },
];

const USR_PRF_MOCK_WITH_WIZARD_URL = {
  urn: "ppb:tbd:view:myAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv",
  url: "/navigation/myAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv",
  wizardUrl:
    "https://playerprotection.qa.com.betfair/budget-set?id=onboarding&returnURL=https://www.qa.com.betfair/betting/navigation/a-cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv==&prod=90",
  items: {
    edges: USR_PRF_EDGES_MOCK,
  },
};

const USR_PRF_MOCK_WITH_NO_WIZARD_URL = {
  urn: "ppb:tbd:view:myAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv",
  url: "/navigation/myAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv",
  wizardUrl: null,
  items: {
    edges: USR_PRF_EDGES_MOCK,
  },
};

const SUCCESSFUL_WAS_REQUEST = [
  { walletName: "MAIN", amount: "123" },
  { walletName: "XG", amount: "3", bonus: "7" },
  { walletName: "POKER", amount: "1" },
  { walletName: "CASINO_BONUS", bonus: "2" },
  { walletName: "ARCADE_BONUS", amount: "3" },
  { walletName: "SPORTSBOOK_BONUS", amount: "4" },
  { walletName: "FROZEN", amount: "2" },
  { walletName: "SPORTSBOOK_BONUS_CASH", amount: "9" },
  { walletName: "EXCHANGE_BONUS_CASH", amount: "5" },
  { walletName: "BOOST_TOKENS", amount: "5" },
];

describe("User Profile overlay", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getWallets(SUCCESSFUL_WAS_REQUEST));
  });

  describe("When the user opens the User Profile and wizardURL is present", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMyAccountLayout(USR_PRF_MOCK_WITH_WIZARD_URL));
      await mockService.mockHttpRequest(await getIndexHTML(USR_PRF_MOCK_WITH_WIZARD_URL.urn));
      await browser.url(URL);
    });
    it("[PRPI-6285] - He is redirected to wizardURL", async () => {
      expect(await browser.getUrl()).toContain("playerprotection.qa.com.betfair");
    });
  });

  describe("When the user opens the User Profile and wizardURL is null", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMyAccountLayout(USR_PRF_MOCK_WITH_NO_WIZARD_URL));
      await mockService.mockHttpRequest(await getIndexHTML(USR_PRF_MOCK_WITH_NO_WIZARD_URL.urn));
      await browser.url(URL);
    });
    it("[PRPI-6286] - User remains in My Account View", async () => {
      expect(await browser.getUrl()).toContain("/betting/navigation/myAccountView");
    });
  });
});
