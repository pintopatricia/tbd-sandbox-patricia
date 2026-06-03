import normalizer from "./balance-card-normalizer";

const BFF_RESPONSE = {
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
      name: "Cash",
      label: "Balance",
      key: "CASH",
      walletRules: [
        {
          name: "Cash Total",
          hideIfZero: false,
          withCurrency: true,
          aggregationRules: [
            {
              field: "amount",
              wallet: "MAIN",
              sign: "+",
            },
            {
              field: "amount",
              wallet: "XG",
              sign: "+",
            },
            {
              wallet: "POKER",
            },
          ],
        },
        {
          name: "Main Wallet",
          hideIfZero: false,
          withCurrency: true,
          aggregationRules: [
            {
              wallet: "MAIN",
              field: "amount",
              sign: "+",
            },
          ],
        },
        {
          name: "Exchange Games Wallet",
          hideIfZero: false,
          withCurrency: true,
          aggregationRules: [
            {
              field: "amount",
              wallet: "XG",
              sign: "+",
            },
          ],
        },
        {
          name: "Poker Wallet",
          hideIfZero: false,
          withCurrency: true,
          aggregationRules: [
            {
              wallet: "POKER",
              field: undefined,
              sign: undefined,
            },
          ],
        },
      ],
    },
    {
      name: "Sportsbook",
      label: "Free Bets",
      key: "SPORTSBOOK_BONUSES",
      walletRules: [
        {
          name: "Sportsbook Free Bets",
          hideIfZero: false,
          withCurrency: true,
          aggregationRules: [
            {
              wallet: "SPORTSBOOK_BONUS_CASH",
              field: "amount",
              sign: "+",
            },
          ],
        },
        {
          name: "Pending winning - awaiting bet settlement",
          hideIfZero: true,
          withCurrency: true,
          aggregationRules: [
            {
              wallet: "FROZEN",
              field: "amount",
              sign: "+",
            },
          ],
        },
        {
          name: "Odds Boosts",
          hideIfZero: false,
          withCurrency: true,
          aggregationRules: [
            {
              wallet: "BOOST_TOKENS",
              field: "amount",
              sign: "+",
            },
          ],
        },
      ],
    },
    {
      name: "Exchange",
      label: "Bonus",
      key: "EXCHANGE_BONUSES",
      walletRules: [
        {
          name: "Free Bets",
          hideIfZero: false,
          withCurrency: true,
          aggregationRules: [
            {
              wallet: "EXCHANGE_BONUS_CASH",
              field: "amount",
              sign: "+",
            },
          ],
        },
        {
          name: "Exchange Games Bonus",
          hideIfZero: false,
          withCurrency: true,
          aggregationRules: [
            {
              field: "bonus",
              wallet: "XG",
              sign: "+",
            },
          ],
        },
      ],
    },
    {
      name: "Arcade",
      label: "Bonus",
      key: "ARCADE_BONUSES",
      walletRules: [
        {
          name: "Arcade Bonus",
          hideIfZero: false,
          withCurrency: true,
          aggregationRules: [
            {
              wallet: "ARCADE_BONUS",
              field: "amount",
              sign: "+",
            },
          ],
        },
      ],
    },
    {
      name: "Casino",
      label: "Bonus",
      key: "CASINO_BONUSES",
      walletRules: [
        {
          name: "Casino Bonus",
          hideIfZero: false,
          withCurrency: true,
          aggregationRules: [
            {
              field: "real",
              wallet: "CASINO_BONUS",
              sign: "+",
            },
            {
              field: "real",
              wallet: "CASINO_BONUS",
              sign: "+",
            },
            {
              field: "real",
              wallet: "CASINO_BONUS",
              sign: "+",
            },
          ],
        },
      ],
    },
  ],
};

describe("Balance card normalizer", () => {
  describe("normalizeBalanceCardFragmentIntoBalanceCard", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizer(BFF_RESPONSE);

      expect(data).toEqual({
        typename: "BalanceCard",
        urn: "ppb:tbd:card:balance:myaccount#balanceCard",
        wasWallets: [
          "MAIN",
          "XG",
          "POKER",
          "CASINO_BONUS",
          "ARCADE_BONUS",
          "SPORTSBOOK_BONUS",
          "FROZEN",
          "SPORTSBOOK_BONUS_CASH",
          "SPORTSBOOK_BONUS_WAGERING",
          "EXCHANGE_BONUS_CASH",
          "BOOST_TOKENS",
        ],
        walletSections: [
          {
            walletsNamesAndRules: [
              {
                walletName: "Cash Total",
                hideIfZero: false,
                aggregationRules: [
                  { field: "amount", sign: "+", wallet: "MAIN" },
                  { field: "amount", sign: "+", wallet: "XG" },
                  { field: undefined, sign: undefined, wallet: "POKER" },
                ],
                withCurrency: true,
              },
              {
                walletName: "Main Wallet",
                hideIfZero: false,
                aggregationRules: [{ field: "amount", sign: "+", wallet: "MAIN" }],
                withCurrency: true,
              },
              {
                walletName: "Exchange Games Wallet",
                hideIfZero: false,
                aggregationRules: [{ field: "amount", sign: "+", wallet: "XG" }],
                withCurrency: true,
              },
              {
                walletName: "Poker Wallet",
                hideIfZero: false,
                aggregationRules: [{ field: undefined, sign: undefined, wallet: "POKER" }],
                withCurrency: true,
              },
            ],
            sectionKey: "CASH",
            sectionName: "Cash",
            sectionNameLabel: "Balance",
          },
          {
            walletsNamesAndRules: [
              {
                walletName: "Sportsbook Free Bets",
                hideIfZero: false,
                aggregationRules: [{ field: "amount", sign: "+", wallet: "SPORTSBOOK_BONUS_CASH" }],
                withCurrency: true,
              },
              {
                walletName: "Pending winning - awaiting bet settlement",
                hideIfZero: true,
                aggregationRules: [{ field: "amount", sign: "+", wallet: "FROZEN" }],
                withCurrency: true,
              },
              {
                walletName: "Odds Boosts",
                hideIfZero: false,
                aggregationRules: [{ field: "amount", sign: "+", wallet: "BOOST_TOKENS" }],
                withCurrency: true,
              },
            ],
            sectionKey: "SPORTSBOOK_BONUSES",
            sectionName: "Sportsbook",
            sectionNameLabel: "Free Bets",
          },
          {
            walletsNamesAndRules: [
              {
                walletName: "Free Bets",
                hideIfZero: false,
                aggregationRules: [{ field: "amount", sign: "+", wallet: "EXCHANGE_BONUS_CASH" }],
                withCurrency: true,
              },
              {
                walletName: "Exchange Games Bonus",
                hideIfZero: false,
                aggregationRules: [{ field: "bonus", sign: "+", wallet: "XG" }],
                withCurrency: true,
              },
            ],
            sectionKey: "EXCHANGE_BONUSES",
            sectionName: "Exchange",
            sectionNameLabel: "Bonus",
          },
          {
            walletsNamesAndRules: [
              {
                walletName: "Arcade Bonus",
                hideIfZero: false,
                aggregationRules: [{ field: "amount", sign: "+", wallet: "ARCADE_BONUS" }],
                withCurrency: true,
              },
            ],
            sectionKey: "ARCADE_BONUSES",
            sectionName: "Arcade",
            sectionNameLabel: "Bonus",
          },
          {
            walletsNamesAndRules: [
              {
                walletName: "Casino Bonus",
                hideIfZero: false,
                aggregationRules: [
                  { field: "real", sign: "+", wallet: "CASINO_BONUS" },
                  { field: "real", sign: "+", wallet: "CASINO_BONUS" },
                  { field: "real", sign: "+", wallet: "CASINO_BONUS" },
                ],
                withCurrency: true,
              },
            ],
            sectionKey: "CASINO_BONUSES",
            sectionName: "Casino",
            sectionNameLabel: "Bonus",
          },
        ],
      });
    });
  });
});
