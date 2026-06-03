const {
  UserProfilePO,
  UserProfileHeaderPO,
  SectionElementsPO,
  QuickLinkPO,
  CashBalancesPO,
  CashBalancesSimpleViewPO,
  CashBalancesDetailedViewPO,
} = require("../../../../../page-objects");
const { getWallets } = require("@flutter-global/uki-channels-http-clients/mock-index").WALLET;
const { getMyAccountLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const userProfilePO = new UserProfilePO();
const userProfileHeaderPO = new UserProfileHeaderPO();
const cashBalancesPO = new CashBalancesPO();
const cashBalancesSimpleViewPO = new CashBalancesSimpleViewPO();
const cashBalancesDetailedViewPO = new CashBalancesDetailedViewPO();
const betfairRewardsAndPromotionsLinksSections = new SectionElementsPO(userProfilePO.groupSections[0]);
const accountDetailsLinksSection = new SectionElementsPO(userProfilePO.groupSections[1]);
const myWalletLinksSection = new SectionElementsPO(userProfilePO.groupSections[2]);
const saferGamblingLinksSection = new SectionElementsPO(userProfilePO.groupSections[3]);
const bettingActivityLinksSection = new SectionElementsPO(userProfilePO.groupSections[4]);
const helpAndSupportLinksSection = new SectionElementsPO(userProfilePO.groupSections[5]);

const settingsAndDetailsQuicklink = new QuickLinkPO(accountDetailsLinksSection.links[2]);

const mockService = new MockService();

const WAS_ERROR = "DOWNSTREAM_SERVICE_ERROR";
const WAS_UNKNOWN_ERROR = "";

const BFF_MOCK = {
  urn: "ppb:tbd:view:myAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv",
  url: "navigation/myAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv",
  items: {
    edges: [
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
                {
                  __typename: "RegulatoryLinkItem",
                  url: "https://qa.com.betfair/betting/betting/settings:settings?prod=90&width=320px&showHeader=0",
                  text: "Settings and Details",
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
    ],
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

const EXCHANGE_BONNUS_BIGGER_THAN_SPORTSBOOK_BOOK = [
  { walletName: "MAIN", amount: "321" },
  { walletName: "XG", amount: "3", bonus: "7" },
  { walletName: "POKER", amount: "1" },
  { walletName: "CASINO_BONUS", amount: "2" },
  { walletName: "ARCADE_BONUS", amount: "3" },
  { walletName: "SPORTSBOOK_BONUS", amount: "4" },
  { walletName: "FROZEN", amount: "2" },
  { walletName: "SPORTSBOOK_BONUS_CASH", amount: "5" },
  { walletName: "EXCHANGE_BONUS_CASH", amount: "9" },
  { walletName: "BOOST_TOKENS", amount: "5" },
];

const UNSUCCESSFUL_WAS_REQUEST = [
  { walletName: "MAIN", status: WAS_UNKNOWN_ERROR },
  { walletName: "XG", amount: "3" },
  { walletName: "POKER", status: WAS_UNKNOWN_ERROR },
  { walletName: "CASINO_BONUS", real: "0", winnings: "12.35", bonus: "2" },
  { walletName: "ARCADE_BONUS", amount: "3.12" },
  { walletName: "SPORTSBOOK_BONUS", status: WAS_ERROR },
  { walletName: "FROZEN", amount: "20.1234" },
  { walletName: "SPORTSBOOK_BONUS_CASH", amount: "9" },
  { walletName: "EXCHANGE_BONUS_CASH", status: WAS_ERROR },
  { walletName: "BOOST_TOKENS", amount: "5" },
];

const UNSUCCESSFUL_REQUEST = [
  { walletName: "unknown", status: WAS_UNKNOWN_ERROR },
  { walletName: "unknown", amount: WAS_UNKNOWN_ERROR },
  { walletName: "unknown", status: WAS_UNKNOWN_ERROR },
  { walletName: "unknown", real: "", winnings: "", bonus: "" },
];

const SPORTSBOOK_AND_EXCHANGE_BONUSES_ARE_EQUAL = [
  { walletName: "MAIN", amount: "123" },
  { walletName: "XG", amount: "3", bonus: "7" },
  { walletName: "POKER", amount: "1" },
  { walletName: "CASINO_BONUS", bonus: "2" },
  { walletName: "ARCADE_BONUS", amount: "3" },
  { walletName: "SPORTSBOOK_BONUS", amount: "4" },
  { walletName: "FROZEN", amount: "2" },
  { walletName: "SPORTSBOOK_BONUS_CASH", amount: "11" },
  { walletName: "EXCHANGE_BONUS_CASH", amount: "11" },
  { walletName: "BOOST_TOKENS", amount: "5" },
];

describe("User Profile overlay", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getMyAccountLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getWallets(SUCCESSFUL_WAS_REQUEST));
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));

    await browser.url(routes.getMyAccountViewUrl());

    await browser.waitUntilDisplayed(userProfileHeaderPO.element);
    await browser.waitUntilDisplayed(userProfilePO.element);
  });

  describe("When the user opens the User Profile", () => {
    it("[PRPI-7344] - The header title is 'My Account'", async () => {
      expect(await userProfileHeaderPO.title.getText()).toBe("My Account");
    });

    it("[PRPI-7345] - on the right side the balance label equals with $123.00", async () => {
      expect(await userProfileHeaderPO.balanceLabel.getText()).toBe("$123.00");
    });

    it("[PRPI-7346] - and next to the label the 'X' button is visible", async () => {
      expect(await userProfileHeaderPO.closeButton.isDisplayed()).toBe(true);
    });

    it("[PRPI-7347] - The user should see the user first name and last login information", async () => {
      expect(await userProfilePO.title.getText()).toBe("Welcome, firstName\nLast login 01/01/2023 12:00");
    });

    it("[PRPI-7348] - It should see a button with the label: Deposit", async () => {
      await browser.waitUntilEquals(userProfilePO.quickMenuList[0], "Deposit");

      expect(await userProfilePO.quickMenuRedirectList[0].getAttribute("href")).toContain("/deposit");
    });

    it("[PRPI-7349] - It should see a button with the label: Withdraw", async () => {
      await browser.waitUntilEquals(userProfilePO.quickMenuList[1], "Withdraw");

      expect(await userProfilePO.quickMenuRedirectList[1].getAttribute("href")).toContain("/withdraw");
    });

    it("[PRPI-7350] - And it should see the Simple View balance by default", async () => {
      expect(await cashBalancesPO.cashBalanceSimpleView.isDisplayed()).toBe(true);
    });

    it("[PRPI-7351] - And it shouldn't see the Details View balance", async () => {
      expect(await cashBalancesPO.cashBalanceDetailedView.isDisplayed()).toBe(false);
    });

    it("[PRPI-7352] - And the Show More button", async () => {
      expect(await cashBalancesPO.balanceAmount.isDisplayed()).toBe(true);
      expect(await cashBalancesPO.balanceAmount.getText()).toBe("Show More");
    });

    describe("When the user clicks on the Show More button", () => {
      beforeAll(async () => {
        await cashBalancesPO.balanceAmount.click();
        await browser.waitUntilDisplayed(cashBalancesPO.cashBalanceSimpleView);
      });

      it("[PRPI-7353] - It should see the Simple View balance", async () => {
        expect(await cashBalancesPO.cashBalanceSimpleView.isDisplayed()).toBe(true);
      });

      it("[PRPI-7354] - And also the Detailed View balance", async () => {
        expect(await cashBalancesPO.cashBalanceDetailedView.isDisplayed()).toBe(true);
      });

      it("[PRPI-7355] - And the Show Less button", async () => {
        expect(await cashBalancesPO.balanceAmount.isDisplayed()).toBe(true);
        expect(await cashBalancesPO.balanceAmount.getText()).toBe("Show Less");
      });

      describe("When the user clicks on the Show Less button", () => {
        beforeAll(async () => {
          await cashBalancesPO.balanceAmount.click();
          await browser.waitUntilNotDisplayed(cashBalancesPO.cashBalanceDetailedView);
        });

        it("[PRPI-7356] - The Detailed View balance is hidden", async () => {
          expect(await cashBalancesPO.cashBalanceDetailedView.isDisplayed()).toBe(false);
        });

        it("[PRPI-7357] - And I should see only the Simple View balance", async () => {
          expect(await cashBalancesPO.cashBalanceSimpleView.isDisplayed()).toBe(true);
        });

        it("[PRPI-7358] - And the Show More button", async () => {
          expect(await cashBalancesPO.balanceAmount.isDisplayed()).toBe(true);
          expect(await cashBalancesPO.balanceAmount.getText()).toBe("Show More");
        });
      });

      describe("When the user scrolls to the group links", () => {
        beforeAll(async () => {
          await userProfilePO.element.scrollIntoView();
          await browser.waitUntilInViewport(userProfilePO.element);
        });
        it("[PRPI-7359] - Then it should see 6 groups of links", async () => {
          expect(await userProfilePO.groupSections.length).toBe(6);
        });

        describe("My Betfair Rewards & Promotions group links", () => {
          it("[PRPI-7360] - And the group Link section title should be: My Betfair Rewards & Promotions", async () => {
            await browser.waitUntilDisplayed(betfairRewardsAndPromotionsLinksSections.title);

            expect(await betfairRewardsAndPromotionsLinksSections.title.getText()).toBe(
              "My Betfair Rewards &amp; Promotions",
            );
          });

          it("[PRPI-7361] - And it should be 3 links in this group", async () => {
            expect(await betfairRewardsAndPromotionsLinksSections.links.length).toBe(3);
          });

          it("[PRPI-7362] - Where the first link is My Promotions", async () => {
            expect(await betfairRewardsAndPromotionsLinksSections.links[0].getText()).toBe("My Promotions");
          });
        });

        describe("Account Details group links", () => {
          it("[PRPI-7363] - And the group Link section title should be: Account Details", async () => {
            expect(await accountDetailsLinksSection.title.getText()).toBe("Account Details");
          });

          it("[PRPI-7364] - where the second link is Premium Charges", async () => {
            expect(await accountDetailsLinksSection.links[1].getText()).toBe("Premium Charges");
          });

          it("[PRPI-7365] - where the third link is Settings and Details", async () => {
            expect(await settingsAndDetailsQuicklink.element.getText()).toBe("Settings and Details");
          });
        });

        describe("My Wallet group links", () => {
          it("[PRPI-7366] - And the group Link section title should be: My Wallet", async () => {
            expect(await myWalletLinksSection.title.getText()).toBe("My Wallet");
          });

          it("[PRPI-7367] - and I should see 2 links in this group", async () => {
            expect(await myWalletLinksSection.links.length).toBe(2);
          });

          it("[PRPI-7368] - where the first link is My Card Details", async () => {
            expect(await myWalletLinksSection.links[0].getText()).toBe("My Card Details");
          });
        });

        describe("Safer Gambling group links", () => {
          it("[PRPI-7369] - And the group Link section title should be: Safer Gambling", async () => {
            expect(await saferGamblingLinksSection.title.getText()).toBe("Safer Gambling");
          });

          it("[PRPI-7370] - where the first link is Safer Gambling", async () => {
            expect(await saferGamblingLinksSection.links[0].getText()).toBe("Player Protection Tools");
          });
        });

        describe("Betting Activity group links", () => {
          it("[PRPI-7371] - And the group Link section title should be: Betting Activity", async () => {
            expect(await bettingActivityLinksSection.title.getText()).toBe("Betting Activity");
          });

          it("[PRPI-7372] - where the first link is My Sportsbook Bets", async () => {
            expect(await bettingActivityLinksSection.links[0].getText()).toBe("My Sportsbook Bets");
          });

          it("[PRPI-7373] - where the second link is My Exchange Bets", async () => {
            expect(await bettingActivityLinksSection.links[1].getText()).toBe("My Exchange Bets");
          });

          it("[PRPI-7374] - where the thrid link is Transaction History", async () => {
            expect(await bettingActivityLinksSection.links[2].getText()).toBe("Transaction History");
          });
        });

        describe("Help & Support group links", () => {
          it("[PRPI-7375] - And the group Link section title should be: Help & Support", async () => {
            expect(await helpAndSupportLinksSection.links[0].getText()).toBe("Help &amp; Support");
          });
        });
      });
    });
  });

  describe("User Profile overlay - Simple / Detailed view wallets", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getWallets(SUCCESSFUL_WAS_REQUEST));
      await mockService.mockHttpRequest(getMyAccountLayout(BFF_MOCK));
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));

      await browser.url(routes.getMyAccountViewUrl());

      await browser.waitUntilDisplayed(userProfileHeaderPO.element);
      await browser.waitUntilDisplayed(userProfilePO.element);
      await browser.waitUntilDisplayed(cashBalancesPO.element);
    });

    it("[PRPI-7376] - Only 3 wallets are displayed in the cash balance Simple View", async () => {
      expect(await cashBalancesSimpleViewPO.balanceAmounts.length).toBe(3);
    });

    it("[PRPI-7377] - #1 wallet: Main Wallet $123.00", async () => {
      expect(await cashBalancesSimpleViewPO.balanceTitles[0].getText()).toBe("Main Wallet");
      expect(await cashBalancesSimpleViewPO.balanceAmounts[0].getText()).toBe("$123.00");
    });

    it("[PRPI-7378] - #2 wallet: Sportsbook Free Bets Wallet $9.00", async () => {
      expect(await cashBalancesSimpleViewPO.balanceTitles[1].getText()).toBe("Sportsbook Free Bets");
      expect(await cashBalancesSimpleViewPO.balanceAmounts[1].getText()).toBe("$9.00");
    });

    it("[PRPI-7379] - #3 wallet: Free Bets Wallet $5.00", async () => {
      expect(await cashBalancesSimpleViewPO.balanceTitles[2].getText()).toBe("Free Bets");
      expect(await cashBalancesSimpleViewPO.balanceAmounts[2].getText()).toBe("$5.00");
    });

    describe("And in the cash balance Detailed View", () => {
      beforeAll(async () => {
        await cashBalancesPO.balanceAmount.click();
        await browser.waitUntilDisplayed(cashBalancesPO.cashBalanceDetailedView);
      });

      it("[PRPI-7380] - Only 11 wallets are displayed in the cash balance Detailed View.", async () => {
        expect(await cashBalancesDetailedViewPO.walletAmounts.length).toBe(11);
      });

      it("[PRPI-7381] - There are split in 2 groups", async () => {
        expect(await cashBalancesDetailedViewPO.groupTitles.length).toBe(2);
      });

      it("[PRPI-7382] - where the first group title is: Cash Balance", async () => {
        expect(await cashBalancesDetailedViewPO.groupTitles[0].getText()).toBe("Cash Balance");
      });

      it("[PRPI-7383] - #1 wallet is Cash Total $127.00", async () => {
        expect(await cashBalancesDetailedViewPO.walletTitles[0].getText()).toBe("Cash Total");
        expect(await cashBalancesDetailedViewPO.walletAmounts[0].getText()).toBe("$127.00");
      });

      it("[PRPI-7384] - #2 wallet is Main Wallet $123.00", async () => {
        expect(await cashBalancesDetailedViewPO.walletTitles[1].getText()).toBe("Main Wallet");
        expect(await cashBalancesDetailedViewPO.walletAmounts[1].getText()).toBe("$123.00");
      });

      it("[PRPI-7385] - #3 wallet is Exchange Games Wallet $3.00", async () => {
        expect(await cashBalancesDetailedViewPO.walletTitles[2].getText()).toBe("Exchange Games Wallet");
        expect(await cashBalancesDetailedViewPO.walletAmounts[2].getText()).toBe("$3.00");
      });

      it("[PRPI-7386] - #4 wallet is Poker Wallet $1.00", async () => {
        expect(await cashBalancesDetailedViewPO.walletTitles[3].getText()).toBe("Poker Wallet");
        expect(await cashBalancesDetailedViewPO.walletAmounts[3].getText()).toBe("$1.00");
      });

      it("[PRPI-7387] - The second group of wallets is Bonus Balances (non-withdrawable)", async () => {
        expect(await cashBalancesDetailedViewPO.groupTitles[1].getText()).toBe("Bonus Balances (non-withdrawable)");
      });

      it("[PRPI-7388] - #1 wallet is Sportsbook Free Bets $9.00", async () => {
        expect(await cashBalancesDetailedViewPO.walletTitles[4].getText()).toBe("Sportsbook Free Bets");
        expect(await cashBalancesDetailedViewPO.walletAmounts[4].getText()).toBe("$9.00");
      });

      it("[PRPI-7389] - #2 wallet is Pending winning - awaiting bet settlement $2.00", async () => {
        expect(await cashBalancesDetailedViewPO.walletTitles[5].getText()).toBe(
          "Pending winning - awaiting bet settlement",
        );

        expect(await cashBalancesDetailedViewPO.walletAmounts[5].getText()).toBe("$2.00");
      });

      it("[PRPI-7390] - #3 wallet is Odds Boosts 5", async () => {
        expect(await cashBalancesDetailedViewPO.walletTitles[6].getText()).toBe("Odds Boosts");
        expect(await cashBalancesDetailedViewPO.walletAmounts[6].getText()).toBe("$5.00");
      });

      it("[PRPI-7391] - #4 wallet is Free Bets $5.00", async () => {
        expect(await cashBalancesDetailedViewPO.walletTitles[7].getText()).toBe("Free Bets");
        expect(await cashBalancesDetailedViewPO.walletAmounts[7].getText()).toBe("$5.00");
      });

      it("[PRPI-7392] - #5 wallet is Exchange Games Bonus $2.00", async () => {
        expect(await cashBalancesDetailedViewPO.walletTitles[8].getText()).toBe("Exchange Games Bonus");
        expect(await cashBalancesDetailedViewPO.walletAmounts[8].getText()).toBe("$7.00");
      });

      it("[PRPI-7393] - #6 wallet is Arcade Bonus $3.00", async () => {
        expect(await cashBalancesDetailedViewPO.walletTitles[9].getText()).toBe("Arcade Bonus");
        expect(await cashBalancesDetailedViewPO.walletAmounts[9].getText()).toBe("$3.00");
      });

      it("[PRPI-7394] - #7 wallet is Casino Bonus $2.00", async () => {
        expect(await cashBalancesDetailedViewPO.walletTitles[10].getText()).toBe("Casino Bonus");
        expect(await cashBalancesDetailedViewPO.walletAmounts[10].getText()).toBe("$2.00");
      });
    });

    describe("When Exchange balance is bigger than Sportsbook balance, the order of wallets in Simple View is:", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getMyAccountLayout(BFF_MOCK));
        await mockService.mockHttpRequest(getWallets(EXCHANGE_BONNUS_BIGGER_THAN_SPORTSBOOK_BOOK));
        await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));

        await browser.url(routes.getMyAccountViewUrl());

        await browser.waitUntilDisplayed(userProfileHeaderPO.element);
        await browser.waitUntilDisplayed(cashBalancesSimpleViewPO.element);
      });

      it("[PRPI-7395] - First wallet: Main Wallet $321.00", async () => {
        expect(await cashBalancesSimpleViewPO.balanceTitles[0].getText()).toBe("Main Wallet");
        expect(await cashBalancesSimpleViewPO.balanceAmounts[0].getText()).toBe("$321.00");
      });

      it("[PRPI-7396] - Second wallet: Free Bets Wallet $9.00", async () => {
        expect(await cashBalancesSimpleViewPO.balanceTitles[1].getText()).toBe("Free Bets");
        expect(await cashBalancesSimpleViewPO.balanceAmounts[1].getText()).toBe("$9.00");
      });

      it("[PRPI-7397] - Third wallet: Sportsbook Free Bets Wallet $5.00", async () => {
        expect(await cashBalancesSimpleViewPO.balanceTitles[2].getText()).toBe("Sportsbook Free Bets");
        expect(await cashBalancesSimpleViewPO.balanceAmounts[2].getText()).toBe("$5.00");
      });
    });

    describe("When SPORTSBOOK_BONUS_CASH wallet amount is equal to EXCHANGE_BONUS_CASH wallet amount", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getWallets(SPORTSBOOK_AND_EXCHANGE_BONUSES_ARE_EQUAL));
        await mockService.mockHttpRequest(getMyAccountLayout(BFF_MOCK));
        await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));

        await browser.url(routes.getMyAccountViewUrl());

        await browser.waitUntilDisplayed(userProfileHeaderPO.element);
        await browser.waitUntilDisplayed(cashBalancesPO.element);
      });

      it("[PRPI-7398] - #2 wallet: Sportsbook Free Bets Wallet $11.00", async () => {
        expect(await cashBalancesSimpleViewPO.balanceTitles[1].getText()).toBe("Sportsbook Free Bets");
        expect(await cashBalancesSimpleViewPO.balanceAmounts[1].getText()).toBe("$11.00");
      });

      it("[PRPI-7399] - #3 wallet: Free Bets Wallet $5.00", async () => {
        expect(await cashBalancesSimpleViewPO.balanceTitles[2].getText()).toBe("Free Bets");
        expect(await cashBalancesSimpleViewPO.balanceAmounts[2].getText()).toBe("$11.00");
      });
    });

    describe("When wallet response returns errors for MAIN, POKER, SPORTSBOOK_BONUS wallets", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getWallets(UNSUCCESSFUL_WAS_REQUEST));
        await mockService.mockHttpRequest(getMyAccountLayout(BFF_MOCK));
        await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));

        await browser.url(routes.getMyAccountViewUrl());

        await browser.waitUntilDisplayed(userProfileHeaderPO.element);
        await browser.waitUntilDisplayed(cashBalancesPO.element);
        await cashBalancesPO.balanceAmount.click();
        await browser.waitUntilDisplayed(cashBalancesPO.balanceAmount);
      });

      it("[PRPI-7400] - Then the Cash Total is NA", async () => {
        expect(await cashBalancesDetailedViewPO.walletTitles[0].getText()).toBe("Cash Total");
        expect(await cashBalancesDetailedViewPO.walletAmounts[0].getText()).toBe("NA");
      });

      it("[PRPI-7401] - Then the Main Wallet is NA", async () => {
        expect(await cashBalancesDetailedViewPO.walletTitles[1].getText()).toBe("Main Wallet");
        expect(await cashBalancesDetailedViewPO.walletAmounts[1].getText()).toBe("NA");
      });

      it("[PRPI-7402] - and also Poker Wallet is NA", async () => {
        expect(await cashBalancesDetailedViewPO.walletTitles[3].getText()).toBe("Poker Wallet");
        expect(await cashBalancesDetailedViewPO.walletAmounts[3].getText()).toBe("NA");
      });

      it("[PRPI-7403] - Third wallet: Sportsbook Free Bets Wallet is NA", async () => {
        expect(await cashBalancesDetailedViewPO.walletTitles[7].getText()).toBe("Free Bets");
        expect(await cashBalancesDetailedViewPO.walletAmounts[7].getText()).toBe("NA");
      });

      it("[PRPI-7404] - Exchange Games Bonus wallet is $0.00", async () => {
        expect(await cashBalancesDetailedViewPO.walletTitles[8].getText()).toBe("Exchange Games Bonus");
        expect(await cashBalancesDetailedViewPO.walletAmounts[8].getText()).toBe("$0.00");
      });

      it("[PRPI-7405] - Arcade Bonus wallet is $3.12", async () => {
        expect(await cashBalancesDetailedViewPO.walletTitles[9].getText()).toBe("Arcade Bonus");
        expect(await cashBalancesDetailedViewPO.walletAmounts[9].getText()).toBe("$3.12");
      });

      it("[PRPI-7406] - Casino Bonus wallet is $14.35 (the sum of winnings and bonus)", async () => {
        expect(await cashBalancesDetailedViewPO.walletTitles[10].getText()).toBe("Casino Bonus");
        expect(await cashBalancesDetailedViewPO.walletAmounts[10].getText()).toBe("$14.35");
      });

      it("[PRPI-7407] - Pending winning - awaiting bet settlement wallet is $20.12 (2 decimals are displayed instead of 4)", async () => {
        expect(await cashBalancesDetailedViewPO.walletTitles[5].getText()).toBe(
          "Pending winning - awaiting bet settlement",
        );

        expect(await cashBalancesDetailedViewPO.walletAmounts[5].getText()).toBe("$20.12");
      });
    });
  });

  describe("User Profile overlay - Show/Hide balance feature", () => {
    describe("When showBalance is clicked but the WAS is not working ", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
        await mockService.mockHttpRequest(getMyAccountLayout(BFF_MOCK));
        await mockService.mockHttpRequest(getWallets(UNSUCCESSFUL_REQUEST));

        await browser.url(routes.getMyAccountViewUrl());

        await browser.waitUntilDisplayed(userProfileHeaderPO.element);
        await browser.waitUntilDisplayed(userProfileHeaderPO.balanceLabel);
      });

      it("[PRPI-7408] Then balance label and balance icon are still displayed", async () => {
        expect(await userProfileHeaderPO.balanceLabel.isDisplayed()).toBe(true);
        expect(await userProfileHeaderPO.closeButton.isDisplayed()).toBe(true);
      });

      describe("When the WAS response is successful", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getMyAccountLayout(BFF_MOCK));
          await mockService.mockHttpRequest(getWallets(SUCCESSFUL_WAS_REQUEST));

          await browser.url(routes.getMyAccountViewUrl());

          await browser.waitUntilDisplayed(userProfileHeaderPO.element);
          await browser.waitUntilDisplayed(cashBalancesPO.element);
          await browser.waitUntilDisplayed(userProfileHeaderPO.balanceLabel);
          await browser.waitUntilDisplayed(userProfileHeaderPO.closeButton);
        });

        it("[PRPI-7409] Then balance label and balance icon are also displayed", async () => {
          expect(await userProfileHeaderPO.balanceLabel.isDisplayed()).toBe(true);
          expect(await userProfileHeaderPO.closeButton.isDisplayed()).toBe(true);
        });

        it("[PRPI-7410] And the Icon is not displayed", async () => {
          expect(await cashBalancesPO.iconContainer.isDisplayed()).toBe(false);
        });

        it("[PRPI-7411] And the Simple View is displayed", async () => {
          expect(await cashBalancesPO.cashBalanceSimpleView.isDisplayed()).toBe(true);
        });

        it("[PRPI-7412] And the Main Wallet which has $123.00 balance ", async () => {
          expect(await cashBalancesSimpleViewPO.balanceTitles[0].getText()).toBe("Main Wallet");
          expect(await cashBalancesSimpleViewPO.balanceAmounts[0].getText()).toBe("$123.00");
        });

        it("[PRPI-7413] The bonus wallet is displayed with 'Free bets:\xA0 9.00\u20AC'", async () => {
          expect(await userProfileHeaderPO.freeBetsBalanceLabel.getText()).toBe("Free Bets: $9.00");
        });

        describe("When the user clicks on Show More button", () => {
          beforeAll(async () => {
            await cashBalancesPO.balanceAmount.click();
            await browser.waitUntilDisplayed(cashBalancesPO.cashBalanceDetailedView);
          });

          it("[PRPI-7414] Detailed View is displayed", async () => {
            expect(await cashBalancesPO.cashBalanceDetailedView.isDisplayed()).toBe(true);
          });

          xdescribe("When showBalance preference is off", () => {
            beforeAll(async () => {
              await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn, { showBalances: "false" }));
              await mockService.mockHttpRequest(getWallets(SUCCESSFUL_WAS_REQUEST));

              await browser.url(routes.getMyAccountViewUrl());

              await browser.waitUntilDisplayed(userProfileHeaderPO.element);
              await browser.waitUntilDisplayed(userProfileHeaderPO.closeButton);
              await browser.waitUntilDisplayed(cashBalancesPO.element);
            });

            it("[PRPI-7415] Then only the balance icon is displayed in header (without the balance value)", async () => {
              expect(await userProfileHeaderPO.closeButton.isDisplayed()).toBe(true);
            });

            it("[PRPI-7416] And the balance laybel is not displayed ", async () => {
              expect(await userProfileHeaderPO.balanceLabel.isDisplayed()).toBe(false);
            });

            it("[PRPI-7417] And the icon is displayed", async () => {
              expect(await cashBalancesPO.iconContainer.isDisplayed()).toBe(true);
            });

            it("[PRPI-7418] And the Cash & Bonus Balances Simple View is displayed", async () => {
              expect(await cashBalancesPO.cashBalanceSimpleView.isDisplayed()).toBe(true);
            });

            it("[PRPI-7419] And the Main Wallet with his balance hidden", async () => {
              expect(await cashBalancesSimpleViewPO.balanceTitles[0].getText()).toBe("Main Wallet");
              expect(await cashBalancesSimpleViewPO.hiddenBalances[0].getText()).toBe("Hidden");
            });

            it("[PRPI-7418] And the Cash & Bonus Balances Detailed View is NOT displayed", async () => {
              expect(await cashBalancesPO.cashBalanceDetailedView.isDisplayed()).toBe(false);
            });
          });
        });
      });
    });
  });

  describe("User Profile - Navigation", () => {
    describe("When the user is in my account", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
        await mockService.mockHttpRequest(getMyAccountLayout(BFF_MOCK));

        await browser.url(routes.getMyAccountViewUrl());

        await browser.waitUntilDisplayed(userProfileHeaderPO.element);
        await browser.waitUntilDisplayed(userProfileHeaderPO.balanceLabel);
      });

      describe("[849448] - And the user scrolls to Safer Gambling section", () => {
        beforeAll(async () => {
          await saferGamblingLinksSection.element.scrollIntoView();
          await browser.waitUntilInViewport(saferGamblingLinksSection.element);
        });

        describe("[849448] - And the user clicks the Safer Gambling link", () => {
          beforeAll(async () => {
            await saferGamblingLinksSection.links[0].click();
            await browser.waitUntilDisplayed(userProfileHeaderPO.element);
          });

          it("[PRPI-7420] - it should see the back arrow displayed", async () => {
            expect(await userProfileHeaderPO.backButton.isDisplayed()).toBe(true);
          });

          it("[PRPI-7421] - it should see the close button displayed", async () => {
            expect(await userProfileHeaderPO.closeButton.isDisplayed()).toBe(true);
          });

          describe("[849448] - and when it taps the back arrow", () => {
            beforeAll(async () => {
              await userProfileHeaderPO.backButton.click();
              await browser.waitUntilDisplayed(userProfilePO.element);
            });

            it("[PRPI-7422] - it should see the my account menu", async () => {
              expect(await userProfilePO.element.isDisplayed()).toBe(true);
            });
          });
        });
      });
    });
  });

  describe("User Profile - Log Out", () => {
    it("[PRPI-7423] the log out button should not redirect to the my account view", async () => {
      expect(await userProfilePO.logOutButtonLink.getAttribute("href")).not.toContain(
        "betting/betting/myAccountView:cHBiOnRiZDp2aWV3OmdlbmVyaWM6aG9tZSMjIz9sb2dpblN0YXR1cz1TVUNDRVNT",
      );
    });
  });
});
