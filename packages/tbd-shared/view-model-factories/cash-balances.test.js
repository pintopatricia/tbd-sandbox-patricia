import {
  createPropsForCashBalances,
  generateBonusBalances,
  generateCashBalances,
  generateDetailedView,
  generateSimpleView,
  getWalletBasedOnRules,
} from "./cash-balances";

jest.mock("../helpers/i18n", () => ({
  i18n: ({ key }) => key,
}));

jest.mock("../formatters/currency-formatters", () => ({
  currencyFormatWithDecimalPlaces: jest.fn().mockImplementation((object) => object.value),
}));

const userDetails = {
  localeCodeBcp47: "en",
  currencyCode: "GBP",
};

const wallets = {
  MAIN: { walletName: "MAIN", amount: 17, status: "SUCCESS" },
  SPORTSBOOK_BONUS_CASH: { walletName: "SPORTSBOOK_BONUS_CASH", amount: 10, status: "SUCCESS" },
  XG: { walletName: "XG", amount: 4, bonus: 3, status: "SUCCESS" },
  POKER: { walletName: "POKER", amount: 2, status: "SUCCESS" },
  FROZEN: { walletName: "FROZEN", amount: 0, status: "SUCCESS" },
  CASINO_BONUS: { walletName: "CASINO_BONUS", amount: 0, status: "SUCCESS", real: 4, winnings: 0, bonus: 0 },
  ARCADE_BONUS: { walletName: "ARCADE_BONUS", amount: 0, status: "SUCCESS" },
  BOOST_TOKENS: { walletName: "BOOST_TOKENS", amount: 0, status: "SUCCESS" },
  SPORTSBOOK_BONUS: { walletName: "SPORTSBOOK_BONUS", amount: 0, status: "SUCCESS" },
  EXCHANGE_BONUS_CASH: { walletName: "EXCHANGE_BONUS_CASH", amount: 0, status: "SUCCESS" },
};

const cashSection = {
  sectionName: "Cash",
  sectionNameLabel: "Balance",
  sectionKey: "CASH",
  walletsNamesAndRules: [
    {
      walletName: "Cash Total",
      hideIfZero: false,
      aggregationRules: [
        {
          wallet: "MAIN",
          field: "amount",
          sign: "+",
        },
        {
          wallet: "XG",
          field: "amount",
          sign: "+",
        },
        {
          wallet: "POKER",
          field: "amount",
          sign: "+",
        },
      ],
      withCurrency: true,
      amountInBrackets: false,
    },
    {
      walletName: "Main Wallet",
      hideIfZero: false,
      aggregationRules: [
        {
          wallet: "MAIN",
          field: "amount",
          sign: "+",
        },
      ],
      withCurrency: true,
      amountInBrackets: false,
    },
    {
      walletName: "Exchange Games Wallet",
      hideIfZero: false,
      aggregationRules: [
        {
          wallet: "XG",
          field: "amount",
          sign: "+",
        },
      ],
      withCurrency: true,
      amountInBrackets: false,
    },
    {
      walletName: "Poker Wallet",
      hideIfZero: false,
      aggregationRules: [
        {
          wallet: "POKER",
          field: "amount",
          sign: "+",
        },
      ],
      withCurrency: true,
      amountInBrackets: false,
    },
  ],
};
const sportsbookSection = {
  sectionName: "Sportsbook",
  sectionNameLabel: "Free Bets",
  sectionKey: "SPORTSBOOK_BONUSES",
  walletsNamesAndRules: [
    {
      walletName: "Sportsbook Free Bets",
      hideIfZero: false,
      aggregationRules: [
        {
          wallet: "SPORTSBOOK_BONUS_CASH",
          field: "amount",
          sign: "+",
        },
      ],
      withCurrency: true,
      amountInBrackets: false,
    },
    {
      walletName: "Pending winning - awaiting bet settlement",
      hideIfZero: true,
      aggregationRules: [
        {
          wallet: "FROZEN",
          field: "amount",
          sign: "+",
        },
      ],
      withCurrency: true,
      amountInBrackets: true,
    },
    {
      walletName: "Odds Boosts",
      hideIfZero: false,
      aggregationRules: [
        {
          wallet: "BOOST_TOKENS",
          field: "amount",
          sign: "+",
        },
      ],
      withCurrency: false,
      amountInBrackets: false,
    },
  ],
};
const exchangeGamesSection = {
  sectionName: "Exchange Games",
  sectionKey: "Bonus",
  walletsNamesAndRules: [
    {
      walletName: "Exchange Games Bonus",
      hideIfZero: false,
      aggregationRules: [
        {
          wallet: "XG",
          field: "bonus",
          sign: "+",
        },
      ],
      amountInBrackets: false,
      withCurrency: true,
    },
  ],
};
const exchangeSection = {
  sectionName: "Exchange",
  sectionNameLabel: "Bonus",
  sectionKey: "EXCHANGE_BONUSES",
  walletsNamesAndRules: [
    {
      walletName: "Free Bets",
      hideIfZero: false,
      aggregationRules: [
        {
          wallet: "EXCHANGE_BONUS_CASH",
          field: "amount",
          sign: "+",
        },
      ],
      withCurrency: true,
      amountInBrackets: false,
    },
  ],
};
const arcadeSection = {
  sectionName: "Arcade",
  sectionNameLabel: "Bonus",
  sectionKey: "ARCADE_BONUSES",
  walletsNamesAndRules: [
    {
      walletName: "Arcade Bonus",
      hideIfZero: false,
      aggregationRules: [
        {
          wallet: "ARCADE_BONUS",
          field: "amount",
          sign: "+",
        },
      ],
      withCurrency: true,
      amountInBrackets: false,
    },
  ],
};
const casinoSection = {
  sectionName: "Casino",
  sectionNameLabel: "Bonus",
  sectionKey: "CASINO_BONUSES",
  walletsNamesAndRules: [
    {
      walletName: "Casino Bonus",
      hideIfZero: false,
      aggregationRules: [
        {
          wallet: "CASINO_BONUS",
          field: "real",
          sign: "+",
        },
        {
          wallet: "CASINO_BONUS",
          field: "bonus",
          sign: "+",
        },
        {
          wallet: "CASINO_BONUS",
          field: "winnings",
          sign: "+",
        },
      ],
      withCurrency: true,
      amountInBrackets: false,
    },
  ],
};
const walletsSection = [
  cashSection,
  sportsbookSection,
  exchangeGamesSection,
  exchangeSection,
  arcadeSection,
  casinoSection,
];

describe("cash balances view model factory", () => {
  describe("createPropsForCashBalances", () => {
    it("should return the correct view model", () => {
      const getPropsForCashBalances = createPropsForCashBalances();
      const { currencyCode, localeCodeBcp47 } = userDetails;
      expect(getPropsForCashBalances(currencyCode, localeCodeBcp47, wallets, walletsSection)).toEqual({
        detailedViewBalance: [
          {
            title: "I18N.CASH.BALANCE",
            groups: [
              {
                amount: 23,
                title: "Cash Total",
              },
              {
                amount: 17,
                title: "Main Wallet",
              },
              {
                amount: 4,
                title: "Exchange Games Wallet",
              },
              {
                amount: 2,
                title: "Poker Wallet",
              },
            ],
          },
          {
            title: "I18N.BONUS.BALANCES.NON.WITHDRAWABLE",
            groups: [
              {
                amount: 10,
                title: "Sportsbook Free Bets",
              },
              {
                amount: "0",
                title: "Odds Boosts",
              },
              {
                amount: 3,
                title: "Exchange Games Bonus",
              },
              {
                amount: 0,
                title: "Free Bets",
              },
              {
                amount: 0,
                title: "Arcade Bonus",
              },
              {
                amount: 4,
                title: "Casino Bonus",
              },
            ],
          },
        ],
        simpleViewBalances: [
          {
            amount: 17,
            subTitle: "",
            title: "Main Wallet",
          },
          {
            amount: 10,
            subTitle: "",
            title: "Sportsbook Free Bets",
          },
          {
            amount: 4,
            subTitle: "",
            title: "Exchange Games Wallet",
          },
        ],
      });
    });

    it("should return the correct view model when the section is empty", () => {
      const getPropsForCashBalances = createPropsForCashBalances();
      const { currencyCode, localeCodeBcp47 } = userDetails;
      expect(getPropsForCashBalances(currencyCode, localeCodeBcp47, wallets, [])).toEqual({
        simpleViewBalances: [],
        detailedViewBalance: [],
      });
    });

    it("should return the correct view model when the wallets information is empty", () => {
      const getPropsForCashBalances = createPropsForCashBalances();
      const { currencyCode, localeCodeBcp47 } = userDetails;
      expect(getPropsForCashBalances(currencyCode, localeCodeBcp47, {}, walletsSection)).toEqual({
        detailedViewBalance: [
          {
            title: "I18N.CASH.BALANCE",
            groups: [
              {
                amount: "NA",
                title: "Cash Total",
              },
              {
                amount: "NA",
                title: "Main Wallet",
              },
              {
                amount: "NA",
                title: "Exchange Games Wallet",
              },
              {
                amount: "NA",
                title: "Poker Wallet",
              },
            ],
          },
          {
            title: "I18N.BONUS.BALANCES.NON.WITHDRAWABLE",
            groups: [
              {
                amount: "NA",
                title: "Sportsbook Free Bets",
              },
              {
                amount: "NA",
                title: "Odds Boosts",
              },
              {
                amount: "NA",
                title: "Exchange Games Bonus",
              },
              {
                amount: "NA",
                title: "Free Bets",
              },
              {
                amount: "NA",
                title: "Arcade Bonus",
              },
              {
                amount: "NA",
                title: "Casino Bonus",
              },
            ],
          },
        ],
        simpleViewBalances: [],
      });
    });
  });

  describe("generateSimpleView", () => {
    it("should return correct values with main wallet first followed by next two biggest wallets orderd by amount", () => {
      const { currencyCode, localeCodeBcp47 } = userDetails;
      expect(generateSimpleView(currencyCode, localeCodeBcp47, wallets, walletsSection)).toEqual([
        {
          amount: 17,
          subTitle: "",
          title: "Main Wallet",
        },
        {
          amount: 10,
          subTitle: "",
          title: "Sportsbook Free Bets",
        },
        {
          amount: 4,
          subTitle: "",
          title: "Exchange Games Wallet",
        },
      ]);
    });

    it("should return the correct order based when sportbook has a bigger value than exchange", () => {
      const { currencyCode, localeCodeBcp47 } = userDetails;
      const mockedWallets = {
        MAIN: { walletName: "MAIN", amount: 17, status: "SUCCESS" },
        SPORTSBOOK_BONUS_CASH: { walletName: "SPORTSBOOK_BONUS_CASH", amount: 10, status: "SUCCESS" },
        XG: { walletName: "XG", amount: 4, bonus: 3, status: "SUCCESS" },
        POKER: { walletName: "POKER", amount: 2, status: "SUCCESS" },
        EXCHANGE_BONUS_CASH: { walletName: "EXCHANGE_BONUS_CASH", amount: 0, status: "SUCCESS" },
      };
      expect(generateSimpleView(currencyCode, localeCodeBcp47, mockedWallets, walletsSection)).toEqual([
        {
          amount: 17,
          subTitle: "",
          title: "Main Wallet",
        },
        {
          amount: 10,
          subTitle: "",
          title: "Sportsbook Free Bets",
        },
        {
          amount: 4,
          subTitle: "",
          title: "Exchange Games Wallet",
        },
      ]);
    });

    describe("when sportbook has the same value as the third wallet", () => {
      it("should return the order MAIN, SPORTSBOOK, THIRD WALLET", () => {
        const { currencyCode, localeCodeBcp47 } = userDetails;
        const mockedWallets = {
          MAIN: { walletName: "MAIN", amount: 17, status: "SUCCESS" },
          SPORTSBOOK_BONUS_CASH: { walletName: "SPORTSBOOK_BONUS_CASH", amount: 10, status: "SUCCESS" },
          XG: { walletName: "XG", amount: 4, bonus: 3, status: "SUCCESS" },
          POKER: { walletName: "POKER", amount: 2, status: "SUCCESS" },
          EXCHANGE_BONUS_CASH: { walletName: "EXCHANGE_BONUS_CASH", amount: 10, status: "SUCCESS" },
        };

        expect(generateSimpleView(currencyCode, localeCodeBcp47, mockedWallets, walletsSection)).toEqual([
          {
            ...{
              amount: 17,
              subTitle: "",
              title: "Main Wallet",
            },
            amount: 17,
          },
          {
            ...{
              amount: 10,
              subTitle: "",
              title: "Sportsbook Free Bets",
            },
            amount: 10,
          },
          { title: "Free Bets", subTitle: "", amount: 10 },
        ]);
      });
    });

    it("should return the correct order based when sportbook has a smaller value than exchange", () => {
      const { currencyCode, localeCodeBcp47 } = userDetails;
      const mockedWallets = {
        MAIN: { walletName: "MAIN", amount: 17, status: "SUCCESS" },
        SPORTSBOOK_BONUS_CASH: { walletName: "SPORTSBOOK_BONUS_CASH", amount: 10, status: "SUCCESS" },
        XG: { walletName: "XG", amount: 4, bonus: 3, status: "SUCCESS" },
        POKER: { walletName: "POKER", amount: 2, status: "SUCCESS" },
        EXCHANGE_BONUS_CASH: { walletName: "EXCHANGE_BONUS_CASH", amount: 20, status: "SUCCESS" },
      };

      expect(generateSimpleView(currencyCode, localeCodeBcp47, mockedWallets, walletsSection)).toEqual([
        {
          amount: 17,
          subTitle: "",
          title: "Main Wallet",
        },
        { amount: 20, subTitle: "", title: "Free Bets" },
        { amount: 10, subTitle: "", title: "Sportsbook Free Bets" },
      ]);
    });

    it("should return the correct order when sportsbook is not returned with success", () => {
      const { currencyCode, localeCodeBcp47 } = userDetails;
      const mockedWallets = {
        MAIN: { walletName: "MAIN", amount: 17, status: "SUCCESS" },
        SPORTSBOOK_BONUS_CASH: { walletName: "SPORTSBOOK_BONUS_CASH", amount: 10, status: "SOME_RANDOM_STATUS" },
        XG: { walletName: "XG", amount: 4, bonus: 3, status: "SUCCESS" },
        POKER: { walletName: "POKER", amount: 2, status: "SUCCESS" },
        EXCHANGE_BONUS_CASH: { walletName: "EXCHANGE_BONUS_CASH", amount: 20, status: "SUCCESS" },
      };

      expect(generateSimpleView(currencyCode, localeCodeBcp47, mockedWallets, walletsSection)).toEqual([
        {
          amount: 17,
          subTitle: "",
          title: "Main Wallet",
        },
        { title: "Free Bets", subTitle: "", amount: 20 },
        {
          amount: 4,
          subTitle: "",
          title: "Exchange Games Wallet",
        },
      ]);
    });

    it("should return the correct order when exchange is not returned with success", () => {
      const { currencyCode, localeCodeBcp47 } = userDetails;
      const mockedWallets = {
        MAIN: { walletName: "MAIN", amount: 17, status: "SUCCESS" },
        SPORTSBOOK_BONUS_CASH: { walletName: "SPORTSBOOK_BONUS_CASH", amount: 10, status: "SUCCESS" },
        XG: { walletName: "XG", amount: 4, bonus: 3, status: "SUCCESS" },
        POKER: { walletName: "POKER", amount: 2, status: "SUCCESS" },
        EXCHANGE_BONUS_CASH: { walletName: "EXCHANGE_BONUS_CASH", amount: 20, status: "SOME_RANDOM_STATUS" },
      };
      expect(generateSimpleView(currencyCode, localeCodeBcp47, mockedWallets, walletsSection)).toEqual([
        {
          amount: 17,
          subTitle: "",
          title: "Main Wallet",
        },
        {
          amount: 10,
          subTitle: "",
          title: "Sportsbook Free Bets",
        },
        {
          amount: 4,
          subTitle: "",
          title: "Exchange Games Wallet",
        },
      ]);
    });

    it("should return empty array if the wallets are not found in the store", () => {
      const { currencyCode, localeCodeBcp47 } = userDetails;
      const mockedWallets = {};
      expect(generateSimpleView(currencyCode, localeCodeBcp47, mockedWallets, walletsSection)).toEqual([]);
    });
  });

  describe("generateDetailedView", () => {
    it("should return the correct values", () => {
      const { currencyCode, localeCodeBcp47 } = userDetails;
      const walletSection = [cashSection, arcadeSection];

      expect(generateDetailedView(currencyCode, localeCodeBcp47, wallets, walletSection)).toEqual([
        {
          title: "I18N.CASH.BALANCE",
          groups: [
            {
              amount: 23,
              title: "Cash Total",
            },
            {
              amount: 17,
              title: "Main Wallet",
            },
            {
              amount: 4,
              title: "Exchange Games Wallet",
            },
            {
              amount: 2,
              title: "Poker Wallet",
            },
          ],
        },
        {
          title: "I18N.BONUS.BALANCES.NON.WITHDRAWABLE",
          groups: [
            {
              amount: 0,
              title: "Arcade Bonus",
            },
          ],
        },
      ]);
    });
  });

  describe("generateBonusBalances", () => {
    it("should return the correct values", () => {
      const { currencyCode, localeCodeBcp47 } = userDetails;
      const bonusBalances = [arcadeSection];

      expect(generateBonusBalances(wallets, bonusBalances, currencyCode, localeCodeBcp47)).toEqual({
        title: "I18N.BONUS.BALANCES.NON.WITHDRAWABLE",
        groups: [
          {
            amount: 0,
            title: "Arcade Bonus",
          },
        ],
      });
    });

    it("should return multiple entries based on the amount of bonus sections", () => {
      const { currencyCode, localeCodeBcp47 } = userDetails;
      const bonusBalances = [arcadeSection, casinoSection, exchangeSection];

      expect(generateBonusBalances(wallets, bonusBalances, currencyCode, localeCodeBcp47)).toEqual({
        title: "I18N.BONUS.BALANCES.NON.WITHDRAWABLE",
        groups: [
          {
            amount: 0,
            title: "Arcade Bonus",
          },
          {
            amount: 4,
            title: "Casino Bonus",
          },
          {
            amount: 0,
            title: "Free Bets",
          },
        ],
      });
    });

    it("should not return entries with zero amount when wallet hideIfZero is true", () => {
      const { countryCode, currencyCode, localeCode } = userDetails;
      const walletSection = {
        sectionName: "Sportsbook",
        sectionNameLabel: "Free Bets",
        sectionKey: "SPORTSBOOK_BONUSES",
        walletsNamesAndRules: [
          {
            walletName: "Main Wallet",
            hideIfZero: false,
            aggregationRules: [
              {
                wallet: "MAIN",
                field: "amount",
                sign: "+",
              },
            ],
            withCurrency: true,
            amountInBrackets: false,
          },
          {
            walletName: "Pending winning - awaiting bet settlement",
            hideIfZero: true,
            aggregationRules: [
              {
                wallet: "FROZEN",
                field: "amount",
                sign: "+",
              },
            ],
            withCurrency: true,
            amountInBrackets: true,
          },
        ],
      };
      const mockedWallets = {
        MAIN: { walletName: "MAIN", amount: 17, status: "SUCCESS" },
        FROZEN: { walletName: "FROZEN", amount: 0, status: "SUCCESS" },
      };
      expect(generateBonusBalances(mockedWallets, [walletSection], countryCode, currencyCode, localeCode)).toEqual({
        title: "I18N.BONUS.BALANCES.NON.WITHDRAWABLE",
        groups: [
          {
            amount: 17,
            title: "Main Wallet",
          },
        ],
      });
    });
  });

  describe("generateCashBalances", () => {
    it("should return the correct values", () => {
      const { currencyCode, localeCodeBcp47 } = userDetails;
      const cashBalanceSection = cashSection.walletsNamesAndRules;

      expect(generateCashBalances(wallets, cashBalanceSection, currencyCode, localeCodeBcp47)).toEqual({
        title: "I18N.CASH.BALANCE",
        groups: [
          {
            amount: 23,
            title: "Cash Total",
          },
          {
            amount: 17,
            title: "Main Wallet",
          },
          {
            amount: 4,
            title: "Exchange Games Wallet",
          },
          {
            amount: 2,
            title: "Poker Wallet",
          },
        ],
      });
    });
  });

  describe("getWalletBasedOnRules", () => {
    it("should return the correct value for the wallet", () => {
      const { currencyCode, localeCodeBcp47 } = userDetails;
      const walletRule = {
        walletName: "Cash Total",
        hideIfZero: false,
        aggregationRules: [
          {
            wallet: "MAIN",
            field: "amount",
            sign: "+",
          },
          {
            wallet: "XG",
            field: "amount",
            sign: "+",
          },
          {
            wallet: "POKER",
            field: "amount",
            sign: "+",
          },
        ],
        withCurrency: true,
        amountInBrackets: false,
      };
      expect(getWalletBasedOnRules(walletRule, wallets, currencyCode, localeCodeBcp47)).toEqual({
        formattedAmount: 23,
        walletName: "Cash Total",
        amount: 23,
        walletKey: "POKER",
        withCurrency: true,
      });
    });

    it("should return the NA value for the wallet if wallet store is empty", () => {
      const { currencyCode, localeCodeBcp47 } = userDetails;
      const walletRule = {
        walletName: "Cash Total",
        hideIfZero: false,
        aggregationRules: [
          {
            wallet: "MAIN",
            field: "amount",
            sign: "+",
          },
          {
            wallet: "XG",
            field: "amount",
            sign: "+",
          },
          {
            wallet: "POKER",
            field: "amount",
            sign: "+",
          },
        ],
        withCurrency: true,
        amountInBrackets: false,
      };
      const walletStore = {};
      expect(getWalletBasedOnRules(walletRule, walletStore, currencyCode, localeCodeBcp47)).toEqual({
        formattedAmount: "NA",
        walletName: "Cash Total",
        amount: 0,
        walletKey: "POKER",
        withCurrency: true,
      });
    });

    it("should return the NA value for the wallet if one of the wallets from aggregation rule is not in the store", () => {
      const { currencyCode, localeCodeBcp47 } = userDetails;
      const walletRule = {
        walletName: "Cash Total",
        hideIfZero: false,
        aggregationRules: [
          {
            wallet: "MAIN",
            field: "amount",
            sign: "+",
          },
          {
            wallet: "XG",
            field: "amount",
            sign: "+",
          },
          {
            wallet: "POKER",
            field: "amount",
            sign: "+",
          },
        ],
        withCurrency: true,
        amountInBrackets: false,
      };
      const walletStore = {
        MAIN: { walletName: "MAIN", amount: 17, status: "SUCCESS" },
        XG: { walletName: "XG", amount: 4, bonus: 3, status: "SUCCESS" },
        RANDOM_WALLET: { walletName: "RANDOM_WALLET", amount: 2, status: "SUCCESS" },
      };
      expect(getWalletBasedOnRules(walletRule, walletStore, currencyCode, localeCodeBcp47)).toEqual({
        formattedAmount: "NA",
        walletName: "Cash Total",
        amount: 21,
        walletKey: "POKER",
        withCurrency: true,
      });
    });

    it("should return the NA value for the wallet if one of the wallets from aggregation rule is in the store but the wallet status is not success", () => {
      const { currencyCode, localeCodeBcp47 } = userDetails;
      const walletRule = {
        walletName: "Cash Total",
        hideIfZero: false,
        aggregationRules: [
          {
            wallet: "MAIN",
            field: "amount",
            sign: "+",
          },
          {
            wallet: "XG",
            field: "amount",
            sign: "+",
          },
          {
            wallet: "POKER",
            field: "amount",
            sign: "+",
          },
        ],
        withCurrency: true,
        amountInBrackets: false,
      };
      const walletStore = {
        MAIN: { walletName: "MAIN", amount: 17, status: "SUCCESS" },
        XG: { walletName: "XG", amount: 4, bonus: 3, status: "SUCCESS" },
        POKER: { walletName: "POKER", amount: 2, status: "DOWNSTREAM_ERROR" },
      };
      expect(getWalletBasedOnRules(walletRule, walletStore, currencyCode, localeCodeBcp47)).toEqual({
        formattedAmount: "NA",
        walletName: "Cash Total",
        amount: 23,
        walletKey: "POKER",
        withCurrency: true,
      });
    });
  });
});
