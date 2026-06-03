import normalizer from "./rewards-card-normalizer";

const BFF_RESPONSE = {
  __typename: "RewardsCard",
  urn: "ppb:tbd:card:rewards:myaccount#rewards",
  benefitsPackages: {
    rewardsStatus: "OPTED_IN",
    lastMonthTradedMarkets: 23,
    currentMonthTradedMarkets: 11,
    currentMonth: "JULY",
    nextMonth: "AUGUST",
    qualifiedBenefitsPackage: {
      commissionRate: 5,
      requiredMarketBets: 20,
      packageLevel: "BETTER",
      criteriaType: "SUM_EXCH_SBK",
      benefits: [
        {
          hidden: false,
          type: "FREE_ACCA",
          accessLevel: "STANDARD",
          valueLookup: {
            maxAmount: null,
            quantity: {
              type: "CURRENCY",
              value: "2",
            },
            size: null,
          },
        },
        {
          hidden: false,
          type: "FREE_SPINS",
          accessLevel: "STANDARD",
          valueLookup: {
            maxAmount: null,
            quantity: {
              type: "INTEGER",
              value: "5",
            },
            size: null,
          },
        },
        {
          hidden: false,
          type: "CASH_RACE",
          accessLevel: "STANDARD",
          valueLookup: {
            maxAmount: null,
            quantity: null,
            size: null,
          },
        },
        {
          hidden: true,
          type: "BEST_ODDS_SBK",
          accessLevel: "STANDARD",
          valueLookup: {
            maxAmount: null,
            quantity: null,
            size: null,
          },
        },
        {
          hidden: true,
          type: "PROMO_ACCESS",
          accessLevel: "STANDARD",
          valueLookup: {
            maxAmount: null,
            quantity: null,
            size: {
              type: "INTEGER",
              value: 15,
            },
          },
        },
        {
          hidden: false,
          type: "BEAT_THE_DROP",
          accessLevel: "STANDARD",
          valueLookup: {
            maxAmount: {
              type: "CURRENCY",
              value: "32000",
            },
            quantity: {
              type: "INTEGER",
              value: "1",
            },
            size: null,
          },
        },
      ],
      excludedBenefits: [],
    },
    chosenBenefitsPackage: {
      commissionRate: 8,
      requiredMarketBets: 20,
      packageLevel: "BEST",
      criteriaType: "SUM_EXCH_SBK",
      benefits: [
        {
          hidden: false,
          type: "LOSS_REFUND",
          accessLevel: "STANDARD",
          valueLookup: {
            maxAmount: null,
            quantity: {
              type: "CURRENCY",
              value: "5",
            },
            size: null,
          },
        },
        {
          hidden: false,
          type: "FREE_SPINS",
          accessLevel: "STANDARD",
          valueLookup: {
            maxAmount: null,
            quantity: {
              type: "INTEGER",
              value: "10",
            },
            size: null,
          },
        },
        {
          hidden: false,
          type: "CASH_RACE",
          accessLevel: "STANDARD",
          valueLookup: {
            maxAmount: null,
            quantity: null,
            size: null,
          },
        },
        {
          hidden: true,
          type: "BEST_ODDS_SBK",
          accessLevel: "STANDARD",
          valueLookup: {
            maxAmount: null,
            quantity: null,
            size: null,
          },
        },
        {
          hidden: true,
          type: "PROMO_ACCESS",
          accessLevel: "STANDARD",
          valueLookup: {
            maxAmount: null,
            quantity: null,
            size: null,
          },
        },
        {
          hidden: false,
          type: "BEAT_THE_DROP",
          accessLevel: "STANDARD",
          valueLookup: {
            maxAmount: {
              type: "CURRENCY",
              value: "32000",
            },
            quantity: {
              type: "INTEGER",
              value: "2",
            },
            size: {
              type: "INTEGER",
              value: 15,
            },
          },
        },
      ],
      excludedBenefits: [],
    },
    availablePackages: [],
  },
};

describe("Rewards card normalizer", () => {
  describe("normalizeRewardsCardFragmentIntoRewardsCard", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizer(BFF_RESPONSE);

      expect(data).toEqual({
        typename: "RewardsCard",
        urn: "ppb:tbd:card:rewards:myaccount#rewards",
        benefitsPackages: {
          rewardsStatus: "OPTED_IN",
          lastMonthTradedMarkets: 23,
          currentMonthTradedMarkets: 11,
          currentMonth: "JULY",
          nextMonth: "AUGUST",
          qualifiedBenefitsPackage: {
            commissionRate: 5,
            requiredMarketBets: 20,
            packageLevel: "BETTER",
            criteriaType: "SUM_EXCH_SBK",
            benefits: [
              {
                hidden: false,
                type: "FREE_ACCA",
                accessLevel: "STANDARD",
                valueLookup: {
                  maxAmount: null,
                  quantity: {
                    type: "CURRENCY",
                    value: "2",
                  },
                  size: null,
                },
              },
              {
                hidden: false,
                type: "FREE_SPINS",
                accessLevel: "STANDARD",
                valueLookup: {
                  maxAmount: null,
                  quantity: {
                    type: "INTEGER",
                    value: "5",
                  },
                  size: null,
                },
              },
              {
                hidden: false,
                type: "CASH_RACE",
                accessLevel: "STANDARD",
                valueLookup: {
                  maxAmount: null,
                  quantity: null,
                  size: null,
                },
              },
              {
                hidden: true,
                type: "BEST_ODDS_SBK",
                accessLevel: "STANDARD",
                valueLookup: {
                  maxAmount: null,
                  quantity: null,
                  size: null,
                },
              },
              {
                hidden: true,
                type: "PROMO_ACCESS",
                accessLevel: "STANDARD",
                valueLookup: {
                  maxAmount: null,
                  quantity: null,
                  size: null,
                },
              },
              {
                hidden: false,
                type: "BEAT_THE_DROP",
                accessLevel: "STANDARD",
                valueLookup: {
                  maxAmount: {
                    type: "CURRENCY",
                    value: "32000",
                  },
                  quantity: {
                    type: "INTEGER",
                    value: "1",
                  },
                  size: null,
                },
              },
            ],
            excludedBenefits: [],
          },
          chosenBenefitsPackage: {
            commissionRate: 8,
            requiredMarketBets: 20,
            packageLevel: "BEST",
            criteriaType: "SUM_EXCH_SBK",
            benefits: [
              {
                hidden: false,
                accessLevel: "STANDARD",
                type: "LOSS_REFUND",
                valueLookup: {
                  maxAmount: null,
                  quantity: {
                    type: "CURRENCY",
                    value: "5",
                  },
                  size: null,
                },
              },
              {
                hidden: false,
                type: "FREE_SPINS",
                accessLevel: "STANDARD",
                valueLookup: {
                  maxAmount: null,
                  quantity: {
                    type: "INTEGER",
                    value: "10",
                  },
                  size: null,
                },
              },
              {
                hidden: false,
                type: "CASH_RACE",
                accessLevel: "STANDARD",
                valueLookup: {
                  maxAmount: null,
                  quantity: null,
                  size: null,
                },
              },
              {
                hidden: true,
                type: "BEST_ODDS_SBK",
                accessLevel: "STANDARD",
                valueLookup: {
                  maxAmount: null,
                  quantity: null,
                  size: null,
                },
              },
              {
                hidden: true,
                type: "PROMO_ACCESS",
                accessLevel: "STANDARD",
                valueLookup: {
                  maxAmount: null,
                  quantity: null,
                  size: null,
                },
              },
              {
                hidden: false,
                type: "BEAT_THE_DROP",
                accessLevel: "STANDARD",
                valueLookup: {
                  maxAmount: {
                    type: "CURRENCY",
                    value: "32000",
                  },
                  quantity: {
                    type: "INTEGER",
                    value: "2",
                  },
                  size: null,
                },
              },
            ],
            excludedBenefits: [],
          },
          availablePackages: [],
        },
      });
    });
  });
});
