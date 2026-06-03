import {
  createLinksSelector,
  createMyAccountInterfaceStateSelector,
  createQuickLinksSelector,
  createWalletNamesSelector,
  createWalletSectionsSelector,
  getMyAccountInterfaceOpenState,
  createRewardsCardBySelector,
  createAccountBannersCardBySelector,
} from "./my-account-selectors";
import { createFindCardbyURNSelector } from "../cards-selectors";
import { getUserFirstName, getUserJurisdiction } from "../../../entities/user-details/user-details-selectors";

jest.mock("../cards-selectors", () => {
  const mockSelector = jest.fn(() => ({}));

  return {
    createFindCardbyURNSelector: jest.fn(() => mockSelector),
  };
});

jest.mock("../../../entities/user-details/user-details-selectors", () => ({
  getUserFirstName: jest.fn(),
  getUserJurisdiction: jest.fn(),
}));

const stateMock = {
  layouts: {
    cards: {
      myaccount: {
        isOpen: true,
      },
    },
  },
  entities: {
    userdetails: {
      countryCode: "IE",
      currencyCode: "EUR",
      localeCode: "en",
      firstName: "Sebastian",
      jurisdiction: {
        jurisdiction: "INTERNATIONAL",
      },
    },
  },
};

const stateMock2 = {
  layouts: {
    cards: {
      myaccount: {
        isOpen: false,
      },
    },
  },
  entities: {
    userdetails: {
      countryCode: "IE",
      currencyCode: "EUR",
      localeCode: "en",
      firstName: "Sebastian",
      jurisdiction: {
        jurisdiction: "INTERNATIONAL",
      },
    },
  },
};

describe("when the createQuickLinksSelector selector is called", () => {
  it("should return expected data", () => {
    const urn = "ppb:tbd:card:quickLinks:myAccount";
    const expected = [
      {
        icon: "deposit",
        label: "Deposit",
        target: "_self",
        url: "https://myfunds.prd.internal/deposit?prod=90&showHeader=0&returnURL=https%3A%2F%2Fmyaccount.prd.internal%2Faccount%2Fnavigation%3Fprod%3D90",
      },
    ];
    const state = {
      layouts: {
        cards: {
          quicklinks: {
            [urn]: {
              typename: "QuickLinksCard",
              links: expected,
            },
          },
        },
      },
    };

    createFindCardbyURNSelector().mockReturnValue(state.layouts.cards.quicklinks[urn]);

    const actual = createQuickLinksSelector(urn)(state);

    expect(actual).toStrictEqual(expected);
  });
});

describe("when the createLinksSelector selector is called", () => {
  it("should return expected data", () => {
    const urn = "ppb:tbd:card:links:myaccount#menuSection";
    const expected = [
      {
        title: "My Betfair Rewards & Promotions",
        sectionType: "GENERIC",
        items: [
          {
            alignment: "LEFT",
            target: "_top",
            text: "My Promotions",
            url: "https://promos.prd.internal/sport?prod=90&returnURL=https%3A%2F%2Fwww%2Eprd.internal%2Fsport",
          },
        ],
      },
    ];
    const state = {
      layouts: {
        cards: {
          links: { [urn]: { typename: "LinksCard", sections: expected } },
        },
      },
    };

    createFindCardbyURNSelector().mockReturnValue(state.layouts.cards.links[urn]);

    const actual = createLinksSelector(urn)(state);

    expect(actual).toStrictEqual(expected);
  });
});

describe("when the createWalletNamesSelector selector is called", () => {
  it("should return expected data", () => {
    const urn = "ppb:tbd:card:balance:myaccount#balanceCard";
    const expected = [
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
    ];
    const state = {
      layouts: {
        cards: {
          balance: { [urn]: { typename: "BalanceCard", wasWallets: expected } },
        },
      },
    };

    createFindCardbyURNSelector().mockReturnValue(state.layouts.cards.balance[urn]);

    const actual = createWalletNamesSelector(urn)(state);

    expect(actual).toStrictEqual(expected);
  });
});

describe("when the createWalletSectionsSelector selector is called", () => {
  it("should return expected data", () => {
    const urn = "ppb:tbd:card:balance:myaccount#balanceCard";
    const expected = [
      {
        walletsNamesAndRules: [
          {
            walletName: "Cash Total",
            hideIfZero: false,
            aggregationRules: [
              {
                field: "amount",
                sign: "+",
                wallet: "MAIN",
              },
              {
                field: "amount",
                sign: "+",
                wallet: "XG",
              },
              {
                field: "amount",
                sign: "+",
                wallet: "POKER",
              },
            ],
            withCurrency: true,
          },
          {
            walletName: "Main Wallet",
            hideIfZero: false,
            aggregationRules: [
              {
                field: "amount",
                sign: "+",
                wallet: "MAIN",
              },
            ],
            withCurrency: true,
          },
          {
            walletName: "Exchange Games Wallet",
            hideIfZero: false,
            aggregationRules: [
              {
                field: "amount",
                sign: "+",
                wallet: "XG",
              },
            ],
            withCurrency: true,
          },
          {
            walletName: "Poker Wallet",
            hideIfZero: false,
            aggregationRules: [
              {
                field: "amount",
                sign: "+",
                wallet: "POKER",
              },
            ],
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
            aggregationRules: [
              {
                field: "amount",
                sign: "+",
                wallet: "SPORTSBOOK_BONUS_CASH",
              },
            ],
            withCurrency: true,
          },
          {
            walletName: "Pending winning - awaiting bet settlement",
            hideIfZero: true,
            aggregationRules: [
              {
                field: "amount",
                sign: "+",
                wallet: "FROZEN",
              },
            ],
            withCurrency: true,
          },
          {
            walletName: "Odds Boosts",
            hideIfZero: false,
            aggregationRules: [
              {
                field: "amount",
                sign: "+",
                wallet: "BOOST_TOKENS",
              },
            ],
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
            aggregationRules: [
              {
                field: "amount",
                sign: "+",
                wallet: "EXCHANGE_BONUS_CASH",
              },
            ],
            withCurrency: true,
          },
          {
            walletName: "Exchange Games Bonus",
            hideIfZero: false,
            aggregationRules: [
              {
                field: "bonus",
                sign: "+",
                wallet: "XG",
              },
            ],
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
            aggregationRules: [
              {
                field: "amount",
                sign: "+",
                wallet: "ARCADE_BONUS",
              },
            ],
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
              {
                field: "real",
                sign: "+",
                wallet: "CASINO_BONUS",
              },
              {
                field: "bonus",
                sign: "+",
                wallet: "CASINO_BONUS",
              },
              {
                field: "winnings",
                sign: "+",
                wallet: "CASINO_BONUS",
              },
            ],
            withCurrency: true,
          },
        ],
        sectionKey: "CASINO_BONUSES",
        sectionName: "Casino",
        sectionNameLabel: "Bonus",
      },
    ];
    const state = {
      layouts: {
        cards: {
          balance: { [urn]: { typename: "BalanceCard", walletSections: expected } },
        },
      },
    };

    createFindCardbyURNSelector().mockReturnValue(state.layouts.cards.balance[urn]);

    const actual = createWalletSectionsSelector(urn)(state);

    expect(actual).toStrictEqual(expected);
  });
});

describe("createMyAccountInterfaceStateSelector selector", () => {
  beforeAll(() => {
    getUserFirstName.mockReturnValue("Sebastian");
    getUserJurisdiction.mockReturnValue("INTERNATIONAL");
  });

  describe("when state does not change", () => {
    it("should not recompute the selector", () => {
      const getMyAccountInterfaceState = createMyAccountInterfaceStateSelector();
      getMyAccountInterfaceState(stateMock);
      getMyAccountInterfaceState(stateMock);

      expect(getMyAccountInterfaceState.recomputations()).toEqual(1);
    });
  });

  describe("when state changes", () => {
    it("should recompute the selector", () => {
      const getMyAccountInterfaceState = createMyAccountInterfaceStateSelector();
      getMyAccountInterfaceState(stateMock);
      getMyAccountInterfaceState(stateMock2);
      getMyAccountInterfaceState(stateMock2);

      expect(getMyAccountInterfaceState.recomputations()).toEqual(2);
    });

    describe("when query has matches", () => {
      it("should highlight searched query in results", () => {
        const getMyAccountInterfaceState = createMyAccountInterfaceStateSelector();
        const myAccountState = getMyAccountInterfaceState(stateMock);
        expect(myAccountState).toEqual({
          firstName: "Sebastian",
          isOpen: true,
          jurisdiction: "INTERNATIONAL",
        });
      });
    });
  });
});

describe("getMyAccountInterfaceOpenState selector", () => {
  it("should return open state value", () => {
    expect(getMyAccountInterfaceOpenState(stateMock)).toBe(true);
  });
});

describe("when the createRewardsCardBySelector selector is called", () => {
  it("should return expected data", () => {
    const getRewardsCardByURN = createRewardsCardBySelector();
    const urn = "ppb:tbd:card:rewards:myaccount#rewards";
    let expected;
    let mockedState;

    mockedState = {
      layouts: {
        cards: {
          rewards: {
            [urn]: {
              benefitsPackages: ["mockedBenefits"],
              typename: "RewardsCard",
            },
          },
        },
      },
    };
    createFindCardbyURNSelector().mockReturnValue(mockedState.layouts.cards.rewards[urn]);

    expected = { benefitsPackages: ["mockedBenefits"], typename: "RewardsCard" };
    expect(getRewardsCardByURN(mockedState.layouts.cards, urn)).toStrictEqual(expected);

    mockedState = {
      layouts: {
        cards: {
          accountBanners: {
            [urn]: {
              bannerDetails: ["mockedBenefits"],
              typename: "MockedCard",
            },
          },
        },
      },
    };
    createFindCardbyURNSelector().mockReturnValue(mockedState.layouts.cards.accountBanners[urn]);

    expected = undefined;
    expect(getRewardsCardByURN(mockedState.layouts.cards, urn)).toStrictEqual(expected);
  });
});

describe("when the createAccountBannersCardBySelector selector is called", () => {
  it("should return expected data", () => {
    const getAccountBannersByURN = createAccountBannersCardBySelector();
    const urn = "ppb:tbd:card:accountBanners:myaccount#accountBanners";

    let mockedState;
    let expected;

    mockedState = {
      layouts: {
        cards: {
          accountBanners: {
            [urn]: {
              bannerDetails: ["mockedDetails"],
              typename: "AccountBannersCard",
            },
          },
        },
      },
    };
    createFindCardbyURNSelector().mockReturnValue(mockedState.layouts.cards.accountBanners[urn]);

    expected = { bannerDetails: ["mockedDetails"], typename: "AccountBannersCard" };
    expect(getAccountBannersByURN(mockedState.layouts.cards, urn)).toStrictEqual(expected);

    mockedState = {
      layouts: {
        cards: {
          accountBanners: {
            [urn]: {
              bannerDetails: ["mockedDetails"],
              typename: "MockedCard",
            },
          },
        },
      },
    };
    createFindCardbyURNSelector().mockReturnValue(mockedState.layouts.cards.accountBanners[urn]);

    expected = undefined;
    expect(getAccountBannersByURN(mockedState.layouts.cards, urn)).toStrictEqual(expected);
  });
});
