const { RewardsPO, ScrollableSwimlanePO, UserProfileHeaderPO } = require("../../../../../page-objects");
const { getWallets } = require("@flutter-global/uki-channels-http-clients/mock-index").WALLET;
const { getMyAccountLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const userProfileHeaderPO = new UserProfileHeaderPO();
const rewardsPO = new RewardsPO();
const mockService = new MockService();
const scrollableRewards = new ScrollableSwimlanePO(rewardsPO.scrollableRewardsSwimlane);
const firstRewardCard = new RewardsPO(scrollableRewards.scrollItems[0]);
const secondRewardCard = new RewardsPO(scrollableRewards.scrollItems[1]);
const thirdRewardCard = new RewardsPO(scrollableRewards.scrollItems[2]);

const OPTED_IN_REWARDS_PLAN_EXCH_ONLY = {
  __typename: "MyAccountView",
  urn: "ppb:tbd:view:myAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv",
  url: "navigation/myAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv",
  items: {
    edges: [
      {
        node: {
          __typename: "RewardsCard",
          benefitsPackages: {
            rewardsStatus: "OPTED_IN",
            lastMonthTradedMarkets: 1,
            currentMonthTradedMarkets: 18,
            currentMonth: "JULY",
            nextMonth: "August",
            qualifiedBenefitsPackage: {
              packageLevel: "BETTER",
              requiredMarketBets: 20,
              criteriaType: "EXCH_MARKETS",
            },
            chosenBenefitsPackage: {
              packageLevel: "BETTER",
              requiredMarketBets: 20,
              criteriaType: "EXCH_MARKETS",
            },
          },
        },
      },
    ],
  },
};

const OPTED_IN_REWARDS_PLUS_PLAN_EXCH_ONLY = {
  __typename: "MyAccountView",
  urn: "ppb:tbd:view:myAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv",
  url: "navigation/myAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv",
  items: {
    edges: [
      {
        node: {
          __typename: "RewardsCard",
          benefitsPackages: {
            rewardsStatus: "OPTED_IN",
            lastMonthTradedMarkets: 1,
            currentMonthTradedMarkets: 18,
            currentMonth: "SEPTEMBER",
            nextMonth: "OCTOBER",
            qualifiedBenefitsPackage: {
              packageLevel: "BEST",
              requiredMarketBets: 20,
              criteriaType: "EXCH_MARKETS",
            },
            chosenBenefitsPackage: {
              packageLevel: "BEST",
              requiredMarketBets: 20,
              criteriaType: "EXCH_MARKETS",
            },
          },
        },
      },
    ],
  },
};

const OPTED_IN_REWARDS_PLUS_PLAN_COMPLETED_REQUIRED_BETS_FOR_TWO_MONTHS_EXCH_DUAL = {
  __typename: "MyAccountView",
  urn: "ppb:tbd:view:myAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv",
  url: "navigation/myAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv",
  items: {
    edges: [
      {
        node: {
          __typename: "RewardsCard",
          benefitsPackages: {
            rewardsStatus: "OPTED_IN",
            lastMonthTradedMarkets: 20,
            currentMonthTradedMarkets: 20,
            currentMonth: "SEPTEMBER",
            nextMonth: "OCTOBER",
            qualifiedBenefitsPackage: {
              packageLevel: "BEST",
              requiredMarketBets: 20,
              criteriaType: "EXCH_MARKETS",
            },
            chosenBenefitsPackage: {
              packageLevel: "BEST",
              requiredMarketBets: 20,
              criteriaType: "SUM_EXCH_SBK",
            },
          },
        },
      },
    ],
  },
};

const OPTED_IN_BASIC_PLAN = {
  __typename: "MyAccountView",
  urn: "ppb:tbd:view:myAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv",
  url: "navigation/myAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv",
  items: {
    edges: [
      {
        node: {
          __typename: "RewardsCard",
          benefitsPackages: {
            rewardsStatus: "OPTED_IN",
            lastMonthTradedMarkets: 1,
            currentMonthTradedMarkets: 18,
            currentMonth: "JULY",
            nextMonth: "AUGUST",
            chosenBenefitsPackage: {
              packageLevel: "GOOD",
              requiredMarketBets: 0,
              criteriaType: "NONE",
            },
          },
        },
      },
    ],
  },
};

const NOT_OPTED_IN_BESPOKE = {
  __typename: "MyAccountView",
  urn: "ppb:tbd:view:myAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv",
  url: "navigation/myAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv",
  items: {
    edges: [
      {
        node: {
          __typename: "RewardsCard",
          benefitsPackages: {
            rewardsStatus: "BESPOKE",
            lastMonthTradedMarkets: 1,
            currentMonthTradedMarkets: 18,
            currentMonth: "JULY",
            nextMonth: "AUGUST",
            qualifiedBenefitsPackage: {
              packageLevel: "BETTER",
              requiredMarketBets: 20,
            },
            chosenBenefitsPackage: {
              packageLevel: "BEST",
              requiredMarketBets: 20,
            },
            availablePackages: [
              {
                packageLevel: "BEST",
                requiredMarketBets: 20,
              },
            ],
          },
        },
      },
    ],
  },
};

const NOT_OPTED_IN_INELIGIBLE = {
  __typename: "MyAccountView",
  urn: "ppb:tbd:view:myAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv",
  url: "navigation/myAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv",
  items: {
    edges: [
      {
        node: {
          __typename: "RewardsCard",
          benefitsPackages: {
            rewardsStatus: "INELIGIBLE",
            lastMonthTradedMarkets: 1,
            currentMonthTradedMarkets: 18,
            currentMonth: "JULY",
            nextMonth: "AUGUST",
            qualifiedBenefitsPackage: {
              packageLevel: "BETTER",
              requiredMarketBets: 20,
            },
            chosenBenefitsPackage: {
              packageLevel: "BEST",
              requiredMarketBets: 20,
            },
            availablePackages: [
              {
                packageLevel: "BEST",
                requiredMarketBets: 20,
              },
            ],
          },
        },
      },
    ],
  },
};

const NOT_OPTED_IN_NO_PLAN_SELECTED = {
  __typename: "MyAccountView",
  urn: "ppb:tbd:view:myAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv",
  url: "navigation/myAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv",
  items: {
    edges: [
      {
        node: {
          __typename: "RewardsCard",
          benefitsPackages: {
            rewardsStatus: "NOT_OPTED_IN",
            lastMonthTradedMarkets: 1,
            currentMonthTradedMarkets: 18,
            currentMonth: "JULY",
            nextMonth: "AUGUST",
            availablePackages: [
              {
                packageLevel: "BETTER",
                requiredMarketBets: 20,
                commissionRate: 8,
                excludedBenefits: [
                  { type: "FREE_SPINS", accessLevel: "STANDARD" },
                  { type: "CASINO_BONUS", accessLevel: "STANDARD" },
                ],

                benefits: [
                  {
                    hidden: false,
                    accessLevel: "STANDARD",
                    type: "FREE_ACCA",
                    valueLookup: {
                      quantity: {
                        type: "CURRENCY",
                        value: "10",
                      },
                    },
                  },
                  {
                    hidden: false,
                    accessLevel: "STANDARD",
                    type: "FREE_SPINS",
                    valueLookup: {
                      quantity: {
                        type: "INTEGER",
                        value: "25",
                      },
                    },
                  },
                  {
                    hidden: false,
                    accessLevel: "STANDARD",
                    type: "CASINO_BONUS",
                    valueLookup: {
                      quantity: {
                        type: "CURRENCY",
                        value: "50.0",
                      },
                    },
                  },
                ],
              },
              {
                packageLevel: "GOOD",
                requiredMarketBets: 20,
                commissionRate: 10,
                benefits: [
                  {
                    hidden: false,
                    accessLevel: "NONE",
                    type: "FREE_ACCA",
                    valueLookup: {
                      quantity: {
                        type: "CURRENCY",
                        value: "10",
                      },
                    },
                  },
                ],
              },
              {
                packageLevel: "BEST",
                commissionRate: 1,
                requiredMarketBets: 20,
                excludedBenefits: [],
                benefits: [
                  {
                    hidden: false,
                    accessLevel: "STANDARD",
                    type: "FREE_ACCA",
                    valueLookup: {
                      quantity: {
                        type: "CURRENCY",
                        value: "10",
                      },
                    },
                  },
                  {
                    hidden: false,
                    accessLevel: "STANDARD",
                    type: "FREE_SPINS",
                    valueLookup: {
                      quantity: {
                        type: "INTEGER",
                        value: "25",
                      },
                    },
                  },
                  {
                    hidden: false,
                    accessLevel: "STANDARD",
                    type: "CASINO_BONUS",
                    valueLookup: {
                      quantity: {
                        type: "CURRENCY",
                        value: "50.0",
                      },
                    },
                  },
                ],
              },
            ],
          },
        },
      },
    ],
  },
};

const OPTED_IN_REWARDS_PLAN_DUAL = {
  __typename: "MyAccountView",
  urn: "ppb:tbd:view:myAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv",
  url: "navigation/myAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv",
  items: {
    edges: [
      {
        node: {
          __typename: "RewardsCard",
          benefitsPackages: {
            rewardsStatus: "OPTED_IN",
            lastMonthTradedMarkets: 1,
            currentMonthTradedMarkets: 18,
            currentMonth: "JULY",
            nextMonth: "August",
            qualifiedBenefitsPackage: {
              packageLevel: "BETTER",
              requiredMarketBets: 20,
              criteriaType: "SUM_EXCH_SBK",
            },
            chosenBenefitsPackage: {
              packageLevel: "BETTER",
              requiredMarketBets: 20,
              criteriaType: "SUM_EXCH_SBK",
            },
          },
        },
      },
    ],
  },
};

const OPTED_IN_REWARDS_PLUS_PLAN_DUAL = {
  __typename: "MyAccountView",
  urn: "ppb:tbd:view:myAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv",
  url: "navigation/myAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv",
  items: {
    edges: [
      {
        node: {
          __typename: "RewardsCard",
          benefitsPackages: {
            rewardsStatus: "OPTED_IN",
            lastMonthTradedMarkets: 1,
            currentMonthTradedMarkets: 18,
            currentMonth: "SEPTEMBER",
            nextMonth: "OCTOBER",
            qualifiedBenefitsPackage: {
              packageLevel: "BEST",
              requiredMarketBets: 20,
              criteriaType: "SUM_EXCH_SBK",
            },
            chosenBenefitsPackage: {
              packageLevel: "BEST",
              requiredMarketBets: 20,
              criteriaType: "SUM_EXCH_SBK",
            },
          },
        },
      },
    ],
  },
};

const OPTED_IN_QUALIFIED_EXCH_CHOSEN_DUAL = {
  __typename: "MyAccountView",
  urn: "ppb:tbd:view:myAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv",
  url: "navigation/myAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv",
  items: {
    edges: [
      {
        node: {
          __typename: "RewardsCard",
          benefitsPackages: {
            rewardsStatus: "OPTED_IN",
            lastMonthTradedMarkets: 1,
            currentMonthTradedMarkets: 18,
            currentMonth: "SEPTEMBER",
            nextMonth: "OCTOBER",
            qualifiedBenefitsPackage: {
              packageLevel: "BEST",
              requiredMarketBets: 20,
              criteriaType: "EXCH_MARKETS",
            },
            chosenBenefitsPackage: {
              packageLevel: "BEST",
              requiredMarketBets: 20,
              criteriaType: "SUM_EXCH_SBK",
            },
          },
        },
      },
    ],
  },
};

const OPTED_IN_QUALIFIED_DUAL_CHOSEN_EXCH = {
  __typename: "MyAccountView",
  urn: "ppb:tbd:view:myAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv",
  url: "navigation/myAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv",
  items: {
    edges: [
      {
        node: {
          __typename: "RewardsCard",
          benefitsPackages: {
            rewardsStatus: "OPTED_IN",
            lastMonthTradedMarkets: 1,
            currentMonthTradedMarkets: 18,
            currentMonth: "SEPTEMBER",
            nextMonth: "OCTOBER",
            qualifiedBenefitsPackage: {
              packageLevel: "BEST",
              requiredMarketBets: 20,
              criteriaType: "SUM_EXCH_SBK",
            },
            chosenBenefitsPackage: {
              packageLevel: "BEST",
              requiredMarketBets: 20,
              criteriaType: "EXCH_MARKETS",
            },
          },
        },
      },
    ],
  },
};

describe("Rewards", () => {
  describe("[744726] When the user opens the event page and is logged in", () => {
    describe("and is OPTED_IN to the Exchange Only Rewards plan", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(
          await getIndexHTML(OPTED_IN_REWARDS_PLAN_EXCH_ONLY.urn, { firstName: "valer" }),
        );
        await mockService.mockHttpRequest(getMyAccountLayout(OPTED_IN_REWARDS_PLAN_EXCH_ONLY));
        await mockService.mockHttpRequest(getWallets([{ amount: "5.00", walletName: "MAIN" }]));
        await browser.url(routes.getHomeViewUrl());
        await browser.waitUntilDisplayed(userProfileHeaderPO.element);
        await browser.waitUntilDisplayed(rewardsPO.element);
      });

      it("[PRPI-6455] Exchange Only Rewards chosen plan should be displayed", async () => {
        expect(await rewardsPO.chosenPlanContainerTitle.getText()).toBe("Rewards");
      });

      it("[PRPI-6456] and the next month progress section is displayed", async () => {
        expect(await rewardsPO.nextMonthSection.isDisplayed()).toBe(true);
      });

      it("[PRPI-6457] and the next month is correct", async () => {
        expect(await rewardsPO.nextMonthSectionMonth.getText()).toBe("august");
      });

      it("[PRPI-6458] and the progress line bar is displayed", async () => {
        expect(await rewardsPO.nextMonthSectionProgressBarBetsNumber.isDisplayed()).toBe(true);
      });

      it("[PRPI-6459] and the bet counter bar displays current/required bets", async () => {
        expect(await rewardsPO.nextMonthSectionCounter.getText()).toBe("18/20");
      });

      it("[PRPI-6460] and Exchange Only progress message is displayed", async () => {
        expect(await rewardsPO.nextMonthSectionProgressMessage.getText()).toBe(
          "You need to have bets settled on 2 more Exchange markets to qualify for your benefits next month.",
        );
      });

      it("[PRPI-6461] and the current month rewards result section is displayed", async () => {
        expect(await rewardsPO.currentMonthResultSection.isDisplayed()).toBe(true);
      });

      it("[PRPI-6462] and the current month is correct", async () => {
        expect(await rewardsPO.currentMonthSectionMonth.getText()).toBe("july");
      });

      it("[PRPI-6463] and the current month Exchange Only Rewards result message is displayed", async () => {
        expect(await rewardsPO.currentMonthSectionProgressMessage.getText()).toBe(
          "Sorry, you didn't qualify for this month's rewards as you only had settled bets in 1 Exchange markets.",
        );
      });
    });

    describe("and is OPTED_IN to the Dual Usage Rewards plan", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(await getIndexHTML(OPTED_IN_REWARDS_PLAN_DUAL.urn, { firstName: "valer" }));
        await mockService.mockHttpRequest(getMyAccountLayout(OPTED_IN_REWARDS_PLAN_DUAL));
        await browser.url(routes.getHomeViewUrl());
        await browser.waitUntilDisplayed(userProfileHeaderPO.element);
        await browser.waitUntilDisplayed(rewardsPO.element);
      });

      it("[PRPI-6464] Dual Usage Rewards chosen plan title should be displayed", async () => {
        expect(await rewardsPO.chosenPlanContainerTitle.getText()).toBe("Rewards");
      });

      it("[PRPI-6465] and the Dual Usage next month progress section is displayed", async () => {
        expect(await rewardsPO.nextMonthSection.isDisplayed()).toBe(true);
      });

      it("[PRPI-6466] and the next month is correct", async () => {
        expect(await rewardsPO.nextMonthSectionMonth.getText()).toBe("august");
      });

      it("[PRPI-6467] and the progress line bar is displayed", async () => {
        expect(await rewardsPO.nextMonthSectionProgressBarBetsNumber.isDisplayed()).toBe(true);
      });

      it("[PRPI-6468] and the bet counter bar displays current/required bets", async () => {
        expect(await rewardsPO.nextMonthSectionCounter.getText()).toBe("18/20");
      });

      it("[PRPI-6469] and Dual Usage progress message is displayed", async () => {
        expect(await rewardsPO.nextMonthSectionProgressMessage.getText()).toBe(
          "You need to have 2 more qualifying bets to receive your benefits next month.",
        );
      });

      it("[PRPI-6470] and the current month rewards result section is displayed", async () => {
        expect(await rewardsPO.currentMonthResultSection.isDisplayed()).toBe(true);
      });

      it("[PRPI-6471] and the current month is correct", async () => {
        expect(await rewardsPO.currentMonthSectionMonth.getText()).toBe("july");
      });

      it("[PRPI-6472] and the current month Dual Usage Rewards result message is displayed", async () => {
        expect(await rewardsPO.currentMonthSectionProgressMessage.getText()).toBe(
          "Sorry, you didn't qualify for this month's rewards as you only had 1 qualifying bets.",
        );
      });
    });

    describe("and is OPTED_IN to the Exchange Only Rewards+ plan", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(
          await getIndexHTML(OPTED_IN_REWARDS_PLUS_PLAN_EXCH_ONLY.urn, { firstName: "valer" }),
        );
        await mockService.mockHttpRequest(getMyAccountLayout(OPTED_IN_REWARDS_PLUS_PLAN_EXCH_ONLY));
        await browser.url(routes.getHomeViewUrl());
        await browser.waitUntilDisplayed(userProfileHeaderPO.element);
        await browser.waitUntilDisplayed(rewardsPO.chosenPlanContainerTitle);
      });

      it("[PRPI-6473] Exchange Only Rewards+ plan title should be displayed", async () => {
        expect(await rewardsPO.chosenPlanContainerTitle.getText()).toBe("Rewards+");
      });
    });

    describe("and is OPTED_IN to the Dual Usage Rewards+ plan", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(
          await getIndexHTML(OPTED_IN_REWARDS_PLUS_PLAN_DUAL.urn, { firstName: "valer" }),
        );
        await mockService.mockHttpRequest(getMyAccountLayout(OPTED_IN_REWARDS_PLUS_PLAN_DUAL));
        await browser.url(routes.getHomeViewUrl());
        await browser.waitUntilDisplayed(userProfileHeaderPO.element);
        await browser.waitUntilDisplayed(rewardsPO.chosenPlanContainerTitle);
      });

      it("[PRPI-6474] Dual Usage Rewards+ plan title should be displayed", async () => {
        expect(await rewardsPO.chosenPlanContainerTitle.getText()).toBe("Rewards+");
      });
    });

    describe("and is OPTED_IN while the Qualified package was Exchange Only and the chosen is a Dual Usage package", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(
          await getIndexHTML(OPTED_IN_QUALIFIED_EXCH_CHOSEN_DUAL.urn, { firstName: "valer" }),
        );
        await mockService.mockHttpRequest(getMyAccountLayout(OPTED_IN_QUALIFIED_EXCH_CHOSEN_DUAL));
        await browser.url(routes.getHomeViewUrl());
        await browser.waitUntilDisplayed(userProfileHeaderPO.element);
        await browser.waitUntilDisplayed(rewardsPO.element);
      });

      it("[PRPI-6475] and the chosen plan title is displayed", async () => {
        expect(await rewardsPO.chosenPlanContainerTitle.getText()).toBe("Rewards+");
      });

      it("[PRPI-6476] and the chosen plan progress message is correct", async () => {
        expect(await rewardsPO.nextMonthSectionProgressMessage.getText()).toBe(
          "You need to have 2 more qualifying bets to receive your benefits next month.",
        );
      });

      it("[PRPI-6477] and the qualified plan message is correct", async () => {
        expect(await rewardsPO.currentMonthSectionProgressMessage.getText()).toBe(
          "Sorry, you didn't qualify for this month's rewards as you only had settled bets in 1 Exchange markets.",
        );
      });
    });

    describe("and is OPTED_IN while the Qualified package was Dual Usage and the chosen is an Exchange Only package", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(
          await getIndexHTML(OPTED_IN_QUALIFIED_DUAL_CHOSEN_EXCH.urn, { firstName: "valer" }),
        );
        await mockService.mockHttpRequest(getMyAccountLayout(OPTED_IN_QUALIFIED_DUAL_CHOSEN_EXCH));
        await browser.url(routes.getHomeViewUrl());
        await browser.waitUntilDisplayed(userProfileHeaderPO.element);
        await browser.waitUntilDisplayed(rewardsPO.element);
      });

      it("[PRPI-6478] and the chosen plan title is displayed", async () => {
        expect(await rewardsPO.chosenPlanContainerTitle.getText()).toBe("Rewards+");
      });

      it("[PRPI-6479] and the chosen plan progress message is correct", async () => {
        expect(await rewardsPO.nextMonthSectionProgressMessage.getText()).toBe(
          "You need to have bets settled on 2 more Exchange markets to qualify for your benefits next month.",
        );
      });

      it("[PRPI-6480] and the qualified plan message is correct", async () => {
        expect(await rewardsPO.currentMonthSectionProgressMessage.getText()).toBe(
          "Sorry, you didn't qualify for this month's rewards as you only had 1 qualifying bets.",
        );
      });
    });

    describe("and has completed required (current and last month) bets on a rewards plan", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(
          await getIndexHTML(OPTED_IN_REWARDS_PLUS_PLAN_COMPLETED_REQUIRED_BETS_FOR_TWO_MONTHS_EXCH_DUAL.urn, {
            firstName: "valer",
          }),
        );
        await mockService.mockHttpRequest(
          getMyAccountLayout(OPTED_IN_REWARDS_PLUS_PLAN_COMPLETED_REQUIRED_BETS_FOR_TWO_MONTHS_EXCH_DUAL),
        );
        await browser.url(routes.getHomeViewUrl());
        await browser.waitUntilDisplayed(userProfileHeaderPO.element);
        await browser.waitUntilDisplayed(rewardsPO.element);
      });

      it("[PRPI-6481] and the success message for next month is displayed", async () => {
        expect(await rewardsPO.nextMonthSectionProgressMessage.getText()).toBe(
          "You have qualified for next month's rewards.",
        );
      });

      it("[PRPI-6482] and the next month is correct ", async () => {
        expect(await rewardsPO.nextMonthSectionMonth.getText()).toBe("october");
      });

      it("[PRPI-6483] and the bet counter bar displays the complete current/required bets", async () => {
        expect(await rewardsPO.nextMonthSectionCounter.getText()).toBe("20/20");
      });

      it("[PRPI-6484] and the success message for current month is displayed", async () => {
        expect(await rewardsPO.currentMonthSectionProgressMessage.getText()).toBe(
          "You qualified for all your Rewards+ package. Click link to access promotions where you can redeem your rewards.",
        );
      });

      it("[PRPI-6485] and the correct current month is displayed", async () => {
        expect(await rewardsPO.currentMonthSectionMonth.getText()).toBe("september");
      });
    });

    describe("and is opted in to Basic Rewards plan", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(await getIndexHTML(OPTED_IN_BASIC_PLAN.urn, { firstName: "valer" }));
        await mockService.mockHttpRequest(getMyAccountLayout(OPTED_IN_BASIC_PLAN));
        await browser.url(routes.getHomeViewUrl());
        await browser.waitUntilDisplayed(userProfileHeaderPO.element);
        await browser.waitUntilDisplayed(rewardsPO.element);
      });

      it("[PRPI-6486] Basic Rewards should be displayed", async () => {
        expect(await rewardsPO.basicPlanTitle.getText()).toBe("Basic Plan");
      });
    });

    describe("and is BESPOKE from a rewards perspective", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(await getIndexHTML(NOT_OPTED_IN_BESPOKE.urn, { firstName: "valer" }));
        await mockService.mockHttpRequest(getMyAccountLayout(NOT_OPTED_IN_BESPOKE));
        await browser.url(routes.getHomeViewUrl());
        await browser.waitUntilDisplayed(userProfileHeaderPO.element);
        await browser.waitUntilNotInDOM(rewardsPO.element);
      });

      it("[PRPI-6487] no Rewards plan should be displayed", async () => {
        expect(await rewardsPO.element.isExisting()).toBe(false);
      });
    });

    describe("and is INELIGIBLE from a rewards perspective", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(await getIndexHTML(NOT_OPTED_IN_INELIGIBLE.urn, { firstName: "valer" }));
        await mockService.mockHttpRequest(getMyAccountLayout(NOT_OPTED_IN_INELIGIBLE));
        await browser.url(routes.getHomeViewUrl());
        await browser.waitUntilDisplayed(userProfileHeaderPO.element);
        await browser.waitUntilNotInDOM(rewardsPO.element);
      });

      it("[PRPI-6488] no Rewards plan should be displayed", async () => {
        expect(await rewardsPO.element.isExisting()).toBe(false);
      });
    });

    describe("and has NO PLAN SELECTED from a rewards perspective", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(
          await getIndexHTML(NOT_OPTED_IN_NO_PLAN_SELECTED.urn, { firstName: "valer" }),
        );
        await mockService.mockHttpRequest(getMyAccountLayout(NOT_OPTED_IN_NO_PLAN_SELECTED));
        await browser.url(routes.getHomeViewUrl());
        await browser.waitUntilDisplayed(userProfileHeaderPO.element);
        await browser.waitUntilDisplayed(firstRewardCard.element);
        await browser.waitUntilDisplayed(firstRewardCard.scrollableRewardCardTitle);
      });

      it("[PRPI-6489] all three plans should be available", async () => {
        expect(await scrollableRewards.scrollItems.length).toBe(3);
      });

      it("[PRPI-6490] and the first one is Rewards+ plan", async () => {
        expect(await firstRewardCard.scrollableRewardCardTitle.getText()).toBe("Rewards+");
      });

      it("[PRPI-6491] and it displays the correct benefits, considering exclusions", async () => {
        expect(await firstRewardCard.rewardBenefitList.length).toBe(4);
        expect(await firstRewardCard.rewardBenefitList[0].getText()).toBe("$10 Free Acca Every Month");
        expect(await firstRewardCard.rewardBenefitList[1].getText()).toBe("25 Free Spins Every Month");
        expect(await firstRewardCard.rewardBenefitList[2].getText()).toBe("$50 Gaming Bonus");
        expect(await firstRewardCard.rewardBenefitList[3].getText()).toBe("1% Commission");
      });

      describe("and when the user scrolls left", () => {
        beforeAll(async () => {
          await secondRewardCard.element.scrollIntoView();
        });

        it("[PRPI-6492] the second one is Rewards plan", async () => {
          expect(await secondRewardCard.scrollableRewardCardTitle.getText()).toBe("Rewards");
        });

        it("[PRPI-6493] and it displays the correct benefits, considering exclusions", async () => {
          expect(await secondRewardCard.rewardBenefitList.length).toBe(2);
          expect(await secondRewardCard.rewardBenefitList[0].getText()).toBe("$10 Free Acca Every Month");
          expect(await secondRewardCard.rewardBenefitList[1].getText()).toBe("8% Commission");
        });

        describe("and when the user scrolls left", () => {
          beforeAll(async () => {
            await thirdRewardCard.element.scrollIntoView();
          });

          it("[PRPI-6494] the third one is Basic plan", async () => {
            expect(await thirdRewardCard.scrollableRewardCardTitle.getText()).toBe("Basic Plan");
          });

          it("[PRPI-6495] and it displays the correct benefits, considering exclusions", async () => {
            expect(await thirdRewardCard.rewardBenefitList.length).toBe(2);
            expect(await thirdRewardCard.rewardBenefitList[0].getText()).toBe("$10 No Free Acca Every Month");
            expect(await thirdRewardCard.rewardBenefitList[1].getText()).toBe("10% Commission");
          });
        });
      });
    });
  });
});
