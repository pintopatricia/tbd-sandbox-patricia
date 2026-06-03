const {
  UserProfileHeaderPO,
  UserProfilePO,
  SectionElementsPO,
  QuickLinkPO,
  CashBalancesPO,
} = require("../../../../page-objects");
const { getWallets } = require("@flutter-global/uki-channels-http-clients/mock-index").WALLET;
const { getMyAccountLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const userProfileHeaderPO = new UserProfileHeaderPO();
const userProfilePO = new UserProfilePO();
const cashBalancesPO = new CashBalancesPO();
const accountDetailsLinksSection = new SectionElementsPO(userProfilePO.groupSections[1]);
const settingsAndDetailsQuicklink = new QuickLinkPO(accountDetailsLinksSection.links[1]);

const mockService = new MockService();
const MODULE_NAME = "user_profile";

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

const USR_PRF_MOCK = {
  urn: `ppb:tbd:view:myAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv`,
  url: `/navigation/myAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv`,
  items: {
    edges: [
      {
        node: {
          __typename: "LinksCard",
          urn: "ppb:tbd:card:links:myaccount#menuSection",
          section: [
            {
              __typename: "LinksMenuSections",
              title: "Promotions",
              sectionType: "GENERIC",
              items: [
                {
                  __typename: "RegulatoryLinkItem",
                  url: "https://promos.betfair.com.betfair/sport",
                  text: "My Promotions",
                },
                {
                  __typename: "RegulatoryLinkItem",
                  url: "https://promos.betfair.com.betfair/refer-and-earn",
                  text: "Refer Earn",
                },
                {
                  __typename: "RegulatoryLinkItem",
                  url: "https://promos.betfair.com.betfair/mybonuses",
                  text: "Active Bonuses",
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
                  url: "https://www.betfair.com.betfair/betting/betting/settings:settings",
                  text: "My Details",
                },
                {
                  __typename: "RegulatoryLinkItem",
                  url: "https://www.betfair.com.betfair/premium-charges",
                  text: "Premium Charges",
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
                  url: "https://myfunds.betfair.com.betfair/manage/cards",
                  text: "My Card Details",
                },
                {
                  __typename: "RegulatoryLinkItem",
                  url: "https://myaccount.betfair.com.betfair/payments/transfer",
                  text: "Transfer Funds",
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
                  url: "https://myaccount.betfair.com.betfair/playerprotection",
                  text: "Player Protection Tools",
                },
                {
                  __typename: "RegulatoryLinkItem",
                  url: "https://responsiblegambling.betfair.com.betfair/",
                  text: "Responsible Gambling Information",
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
                  url: "https://myactivity.betfair.com.betfair/#/sportsbook",
                  text: "My Sportsbook Bets",
                },
                {
                  __typename: "RegulatoryLinkItem",
                  url: "https://myactivity.betfair.com.betfair/#/exchange",
                  text: "My Exchange Bets",
                },
                {
                  __typename: "RegulatoryLinkItem",
                  url: "https://myactivity.betfair.com.betfair/#/transactions",
                  text: "Transaction History",
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
                  url: "https://support.betfair.com.betfair/app/home/",
                  text: "Help Support",
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
              },
              target: "_self",
              icon: "deposit",
            },
            {
              label: "Withdraw",
              viewLink: {
                viewUrn: "ppb:tbd:view:external:external",
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
                  hideIfZero: false,
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

const USR_PRF_MOCK_LONG_LABEL = {
  urn: `ppb:tbd:view:myAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv`,
  url: `/navigation/myAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv`,
  items: {
    edges: [
      {
        node: {
          __typename: "LinksCard",
          urn: "ppb:tbd:card:links:myaccount#menuSection",
          section: [
            {
              __typename: "LinksMenuSections",
              title: "Aktionen",
              sectionType: "GENERIC",
              items: [
                {
                  __typename: "RegulatoryLinkItem",
                  url: "https://promos.betfair.com.betfair/sport",
                  text: "Meine Aktionen",
                },
                {
                  __typename: "RegulatoryLinkItem",
                  url: "https://promos.betfair.com.betfair/refer-and-earn",
                  text: "Freunde werben",
                },
                {
                  __typename: "RegulatoryLinkItem",
                  url: "https://promos.betfair.com.betfair/mybonuses",
                  text: "Aktionsverlauf",
                },
              ],
            },
            {
              __typename: "LinksMenuSections",
              title: "Aktionsverlauf",
              sectionType: "GENERIC",
              items: [
                {
                  __typename: "RegulatoryLinkItem",
                  url: "https://www.betfair.com.betfair/betting/betting/settings:settings",
                  text: "Einstellungen Details",
                },
              ],
            },
            {
              __typename: "LinksMenuSections",
              title: "Mein Hauptkontot",
              sectionType: "GENERIC",
              items: [
                {
                  __typename: "RegulatoryLinkItem",
                  url: "https://myfunds.betfair.com.betfair/manage/cards",
                  text: "Meine Kartendetails",
                },
                {
                  __typename: "RegulatoryLinkItem",
                  url: "https://myaccount.betfair.com.betfair/payments/transfer",
                  text: "Überweisung",
                },
              ],
            },
            {
              __typename: "LinksMenuSections",
              title: "Sicheres Glückspiel",
              sectionType: "GENERIC",
              items: [
                {
                  __typename: "RegulatoryLinkItem",
                  url: "https://myaccount.betfair.com.betfair/playerprotection",
                  text: "Tools zum Spielerschutz",
                },
                {
                  __typename: "RegulatoryLinkItem",
                  url: "https://responsiblegambling.betfair.com.betfair/",
                  text: "Informationen zum verantwortungsvollen Spielen",
                },
              ],
            },
            {
              __typename: "LinksMenuSections",
              title: "Wettaktivität",
              sectionType: "GENERIC",
              items: [
                {
                  __typename: "RegulatoryLinkItem",
                  url: "https://myactivity.betfair.com.betfair/#/sportsbook",
                  text: "Sportwetten",
                },
                {
                  __typename: "RegulatoryLinkItem",
                  url: "https://myactivity.betfair.com.betfair/#/exchange",
                  text: "Exchange-Wetten",
                },
                {
                  __typename: "RegulatoryLinkItem",
                  url: "https://myactivity.betfair.com.betfair/#/transactions",
                  text: "Transaktionsverlauf",
                },
              ],
            },
            {
              __typename: "LinksMenuSections",
              title: "Hilfe und Unterstützung",
              sectionType: "GENERIC",
              items: [
                {
                  __typename: "RegulatoryLinkItem",
                  url: "https://support.betfair.com.betfair/app/home/",
                  text: "Hilfe und Unterstützung",
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
              label: "Вывести средстваства",
              viewLink: {
                viewUrn: "ppb:tbd:view:external:external",
              },
              target: "_self",
              icon: "deposit",
            },
            {
              label: "средстваства Вывести",
              viewLink: {
                viewUrn: "ppb:tbd:view:external:external",
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
              label: "Guthaben",
              name: "Cash",
              walletRules: [
                {
                  __typename: "WalletRule",
                  name: "Cash gesamt",
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
                  name: "Hauptwettkonto",
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
                  name: "Exchange Games-Konto",
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
                  name: "Poker-Konto",
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
              label: "Gratiswetten",
              name: "Sportsbook",
              walletRules: [
                {
                  __typename: "WalletRule",
                  name: "Hauptwettkonto",
                  hideIfZero: false,
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
                  name: "Ausstehende Gewinne - warten auf Abwicklung",
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
                  name: "Quoten-Boosts",
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
                  name: "Gratiswetten",
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
                  name: "Bonus für Exchange Games",
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

const USR_PRF_MOCK_LONG_LABEL_2 = {
  urn: `ppb:tbd:view:myAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv`,
  url: `/navigation/myAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv`,
  items: {
    edges: [
      {
        node: {
          __typename: "LinksCard",
          urn: "ppb:tbd:card:links:myaccount#menuSection",
          section: [
            {
              __typename: "LinksMenuSections",
              title: "Aktionen",
              sectionType: "GENERIC",
              items: [
                {
                  __typename: "RegulatoryLinkItem",
                  url: "https://promos.betfair.com.betfair/sport",
                  text: "Meine Aktionen",
                },
                {
                  __typename: "RegulatoryLinkItem",
                  url: "https://promos.betfair.com.betfair/refer-and-earn",
                  text: "Freunde werben",
                },
                {
                  __typename: "RegulatoryLinkItem",
                  url: "https://promos.betfair.com.betfair/mybonuses",
                  text: "Aktionsverlauf",
                },
              ],
            },
            {
              __typename: "LinksMenuSections",
              title: "Aktionsverlauf",
              sectionType: "GENERIC",
              items: [
                {
                  __typename: "RegulatoryLinkItem",
                  url: "https://www.betfair.com.betfair/betting/betting/settings:settings",
                  text: "Einstellungen Details",
                },
              ],
            },
            {
              __typename: "LinksMenuSections",
              title: "Mein Hauptkontot",
              sectionType: "GENERIC",
              items: [
                {
                  __typename: "RegulatoryLinkItem",
                  url: "https://myfunds.betfair.com.betfair/manage/cards",
                  text: "Meine Kartendetails",
                },
                {
                  __typename: "RegulatoryLinkItem",
                  url: "https://myaccount.betfair.com.betfair/payments/transfer",
                  text: "Überweisung",
                },
              ],
            },
            {
              __typename: "LinksMenuSections",
              title: "Sicheres Glückspiel",
              sectionType: "GENERIC",
              items: [
                {
                  __typename: "RegulatoryLinkItem",
                  url: "https://myaccount.betfair.com.betfair/playerprotection",
                  text: "Tools zum Spielerschutz",
                },
                {
                  __typename: "RegulatoryLinkItem",
                  url: "https://responsiblegambling.betfair.com.betfair/",
                  text: "Informationen zum verantwortungsvollen Spielen",
                },
              ],
            },
            {
              __typename: "LinksMenuSections",
              title: "Wettaktivität",
              sectionType: "GENERIC",
              items: [
                {
                  __typename: "RegulatoryLinkItem",
                  url: "https://myactivity.betfair.com.betfair/#/sportsbook",
                  text: "Sportwetten",
                },
                {
                  __typename: "RegulatoryLinkItem",
                  url: "https://myactivity.betfair.com.betfair/#/exchange",
                  text: "Exchange-Wetten",
                },
                {
                  __typename: "RegulatoryLinkItem",
                  url: "https://myactivity.betfair.com.betfair/#/transactions",
                  text: "Transaktionsverlauf",
                },
              ],
            },
            {
              __typename: "LinksMenuSections",
              title: "Hilfe und Unterstützung",
              sectionType: "GENERIC",
              items: [
                {
                  __typename: "RegulatoryLinkItem",
                  url: "https://support.betfair.com.betfair/app/home/",
                  text: "Hilfe und Unterstützung",
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
              label: "Вывести средстваства",
              viewLink: {
                viewUrn: "ppb:tbd:view:external:external",
              },
              target: "_self",
              icon: "deposit",
            },
            {
              label: "средстваства Вывести",
              viewLink: {
                viewUrn: "ppb:tbd:view:external:external",
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
              label: "Guthaben",
              name: "Cash",
              walletRules: [
                {
                  __typename: "WalletRule",
                  name: "Cash gesamt",
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
                  name: "Hauptwettkonto",
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
                  name: "Exchange Games-Konto",
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
                  name: "Poker-Konto",
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
              label: "Gratiswetten",
              name: "Sportsbook",
              walletRules: [
                {
                  __typename: "WalletRule",
                  name: "Tools zum Spielerschutz",
                  hideIfZero: false,
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
                  name: "Ausstehende Gewinne - warten auf Abwicklung",
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
                  name: "Quoten-Boosts",
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
                  name: "Gratiswetten",
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
                  name: "Bonus für Exchange Games",
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

describe("When the user opens the User Profile", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(USR_PRF_MOCK.urn));
    await mockService.mockHttpRequest(getMyAccountLayout(USR_PRF_MOCK));
    await mockService.mockHttpRequest(getWallets(SUCCESSFUL_WAS_REQUEST));
    await mockService.mockFonts(getMockFonts());
    await browser.url(routes.getHomeViewUrl());
    await browser.waitUntilDisplayed(userProfileHeaderPO.element);
    await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-4655]_should_display_user_profile_page`);
  });

  it("[PRPI-4655]_should_display_user_profile_page", async () => {
    expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-4655]_should_display_user_profile_page`)).toEqual(0);
  });

  describe("When the user clicks on the Show More button", () => {
    beforeAll(async () => {
      await cashBalancesPO.balanceAmount.click();
      await browser.waitUntilDisplayed(cashBalancesPO.cashBalanceSimpleView);
      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-4656]_should_display_the_detailed_view_balance`);
    });

    it("[PRPI-4656]_should_display_the_detailed_view_balance", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-4656]_should_display_the_detailed_view_balance`)).toEqual(
        0,
      );
    });
  });
});

describe("When the user opens the User Profile - long label buttons", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(USR_PRF_MOCK_LONG_LABEL.urn));
    await mockService.mockHttpRequest(getMyAccountLayout(USR_PRF_MOCK_LONG_LABEL));
    await mockService.mockHttpRequest(getWallets(SUCCESSFUL_WAS_REQUEST));
    await mockService.mockFonts(getMockFonts());
    await browser.url(routes.getHomeViewUrl());
    await browser.waitUntilDisplayed(userProfileHeaderPO.element);
    await browser.waitUntilImageEquals(
      `${MODULE_NAME}_[PRPI-4657]_should_display_user_profile_page_long_label_buttons`,
    );
  });

  it("[PRPI-4657]_should_display_user_profile_page_long_label_buttons", async () => {
    expect(
      await browser.checkScreen(`${MODULE_NAME}_[PRPI-4657]_should_display_user_profile_page_long_label_buttons`),
    ).toEqual(0);
  });

  describe("When the user clicks on the Show More button - long label buttons", () => {
    beforeAll(async () => {
      await cashBalancesPO.balanceAmount.click();
      await browser.waitUntilDisplayed(cashBalancesPO.cashBalanceSimpleView);
      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-4658]_should_display_the_detailed_view_balance_long_label_buttons`,
      );
    });

    it("[PRPI-4658]_should_display_the_detailed_view_balance_long_label_buttons", async () => {
      expect(
        await browser.checkScreen(
          `${MODULE_NAME}_[PRPI-4658]_should_display_the_detailed_view_balance_long_label_buttons`,
        ),
      ).toEqual(0);
    });
  });
});

describe("When the user opens the User Profile - long label buttons second scenario", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(USR_PRF_MOCK_LONG_LABEL_2.urn));
    await mockService.mockHttpRequest(getMyAccountLayout(USR_PRF_MOCK_LONG_LABEL_2));
    await mockService.mockHttpRequest(getWallets(SUCCESSFUL_WAS_REQUEST));
    await mockService.mockFonts(getMockFonts());
    await browser.url(routes.getHomeViewUrl());
    await browser.waitUntilDisplayed(userProfileHeaderPO.element);
    await browser.waitUntilImageEquals(
      `${MODULE_NAME}_[PRPI-4657]_should_display_user_profile_page_long_label_buttons_second`,
    );
  });

  it("[PRPI-4659]_should_display_user_profile_page_long_label_buttons_second`", async () => {
    expect(
      await browser.checkScreen(
        `${MODULE_NAME}_[PRPI-4657]_should_display_user_profile_page_long_label_buttons_second`,
      ),
    ).toEqual(0);
  });

  describe("When the user clicks on the Show More button - long label buttons second", () => {
    beforeAll(async () => {
      await cashBalancesPO.balanceAmount.click();
      await browser.waitUntilDisplayed(cashBalancesPO.cashBalanceSimpleView);
      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-4660]_should_display_the_detailed_view_balance_long_label_buttons_second`,
      );
    });

    it("[PRPI-4660]_should_display_the_detailed_view_balance_long_label_buttons_second", async () => {
      expect(
        await browser.checkScreen(
          `${MODULE_NAME}_[PRPI-4660]_should_display_the_detailed_view_balance_long_label_buttons_second`,
        ),
      ).toEqual(0);
    });
  });
});

describe("When the user opens the User Profile - with exchange onboarding new icon on settings scenario", () => {
  describe("and when the EXC_ONBOARDING_JOURNEY throttle is active and exchangeDefaultProduct is set to neme", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(
        await getIndexHTML(BFF_MOCK.urn, {
          loggedIn: "true",
          exchangeDefaultProduct: "neme",
          EXC_ONBOARDING_JOURNEY: { isActive: true },
        }),
      );

      await mockService.mockHttpRequest(getMyAccountLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getWallets(SUCCESSFUL_WAS_REQUEST));
      await mockService.mockFonts(getMockFonts());
      await browser.url(routes.getMyAccountViewUrl());

      await browser.waitUntilDisplayed(settingsAndDetailsQuicklink.element);
      await settingsAndDetailsQuicklink.element.scrollIntoView({ block: "center" });
      await browser.waitUntilInViewport(settingsAndDetailsQuicklink.element);

      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-4661]_should_display_user_profile_page_with_new_icon_settings`,
      );
    });

    it("[PRPI-4661]_should_display_user_profile_page_with_new_icon_settings", async () => {
      expect(
        await browser.checkScreen(`${MODULE_NAME}_[PRPI-4661]_should_display_user_profile_page_with_new_icon_settings`),
      ).toEqual(0);
    });
  });
});
