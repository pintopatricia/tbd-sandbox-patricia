const { UserProfileHeaderPO, BudgetPO, BudgetStatsPO } = require("../../../../../page-objects");
const { getMyAccountLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const userProfileHeaderPO = new UserProfileHeaderPO();
const budgetPO = new BudgetPO();
const budgetStatsPO = new BudgetStatsPO();

const mockService = new MockService();

const BUDGET_REMAINING = {
  __typename: "MyAccountView",
  urn: "ppb:tbd:view:myAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv",
  url: "/navigation/myAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv",
  items: {
    edges: [
      {
        node: {
          __typename: "BudgetLimitsCard",
          urn: "ppb:tbd:card:budgetLimitsCard:myaccount#budgetLimitsCard",
          limits: [
            {
              amount: 500,
              category: "NDL",
              remain: 400,
              reset: "02/03/2021, 00:00",
              nextBreachable: true,
            },
          ],
        },
      },
    ],
  },
};

const BUDGET_REMAINING_WITH_ZERO_MONEY_REMAINING = {
  __typename: "MyAccountView",
  urn: "ppb:tbd:view:myAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv",
  url: "/navigation/myAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv",
  items: {
    edges: [
      {
        node: {
          __typename: "BudgetLimitsCard",
          urn: "ppb:tbd:card:budgetLimitsCard:myaccount#budgetLimitsCard",
          limits: [
            {
              amount: 600,
              category: "NDL",
              remain: 0,
              reset: "02/03/2021, 00:00",
              nextBreachable: true,
            },
          ],
        },
      },
    ],
  },
};

const BUDGET_REMAINING_WITH_NO_MONEY_SPENT = {
  __typename: "MyAccountView",
  urn: "ppb:tbd:view:myAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv",
  url: "/navigation/myAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv",
  items: {
    edges: [
      {
        node: {
          __typename: "BudgetLimitsCard",
          urn: "ppb:tbd:card:budgetLimitsCard:myaccount#budgetLimitsCard",
          limits: [
            {
              amount: 700,
              category: "NDL",
              remain: 700,
              reset: "02/03/2021, 00:00",
              nextBreachable: true,
            },
          ],
        },
      },
    ],
  },
};

const BUDGET_REMAINING_WITH_DECIMALS = {
  __typename: "MyAccountView",
  urn: "ppb:tbd:view:myAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv",
  url: "/navigation/myAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv",
  items: {
    edges: [
      {
        node: {
          __typename: "BudgetLimitsCard",
          urn: "ppb:tbd:card:budgetLimitsCard:myaccount#budgetLimitsCard",
          limits: [
            {
              amount: 1345.78,
              category: "NDL",
              remain: 334.56,
              reset: "02/03/2021, 00:00",
              nextBreachable: true,
            },
          ],
        },
      },
    ],
  },
};

const BUDGET_REMAINING_GREATHER_THAN_AMOUNT = {
  __typename: "MyAccountView",
  urn: "ppb:tbd:view:myAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv",
  url: "/navigation/myAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv",
  items: {
    edges: [
      {
        node: {
          __typename: "BudgetLimitsCard",
          urn: "ppb:tbd:card:budgetLimitsCard:myaccount#budgetLimitsCard",
          limits: [
            {
              amount: 500,
              category: "NDL",
              remain: 800,
              reset: "02/03/2021, 00:00",
              nextBreachable: true,
            },
          ],
        },
      },
    ],
  },
};

describe("Budget Widget", () => {
  describe("[910040] When the user opens the User Profile page and is logged in", () => {
    describe("and it has an NDL limit set to 500$", () => {
      describe("and he spent 100$", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(await getIndexHTML(BUDGET_REMAINING.urn, { firstName: "valer" }));
          await mockService.mockHttpRequest(getMyAccountLayout(BUDGET_REMAINING));
          await browser.url(routes.getHomeViewUrl());
          await browser.waitUntilDisplayed(userProfileHeaderPO.element);
          await browser.waitUntilDisplayed(budgetPO.element);
          await browser.waitUntilDisplayed(budgetStatsPO.element);
        });

        it("[PRPI-6654] the Spend Budget Status is displayed", async () => {
          expect(await budgetStatsPO.spendBudget.isDisplayed()).toBe(true);
        });

        it("[PRPI-6655] and the Spend Budget Status value is: $400.00 remaining", async () => {
          expect(await budgetStatsPO.spendBudget.getText()).toBe("$400.00 remaining");
        });

        it("[PRPI-6656] and the Spend Budget is: 500$ - 400$ = 100$ which means 20% progress bar filled", async () => {
          expect(await budgetStatsPO.spentBudgetProgressBar.getAttribute("style")).toBe(
            "width: 20%; background-color: transparent;",
          );
        });

        it("[PRPI-6657] and the Remaining Budget is: 500$ - 100$ = 400$ which means 80% progress bar empty", async () => {
          expect(await budgetStatsPO.remainingBudgetProgressBar.getAttribute("style")).toBe(
            "width: 80%; background-color: rgb(65, 65, 67);",
          );
        });

        it("[PRPI-6658] and the Reset Messagge is displayed", async () => {
          expect(await budgetPO.resetMessage.isDisplayed()).toBe(true);
        });

        it("[PRPI-6659] and the Reset Time is 02/03/2021, 00:00", async () => {
          expect(await budgetPO.resetMessage.getText()).toBe("Resets: 02.03.2021, 00:00");
        });

        it("[PRPI-6660] and the Budget Link is displayed", async () => {
          expect(await budgetPO.budgetLink.isDisplayed()).toBe(true);
        });

        it("[PRPI-6661] and the Go to My Spend Budget link redirect to Spend Budget Page", async () => {
          expect(await budgetPO.budgetLinkRedirect.getAttribute("href")).toContain("myspendbudget.betfair.com");
        });
      });
    });

    describe("and is has an NDL limit set to 600$", () => {
      describe("and he spent 600$", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(
            await getIndexHTML(BUDGET_REMAINING_WITH_ZERO_MONEY_REMAINING.urn, { firstName: "valer" }),
          );
          await mockService.mockHttpRequest(getMyAccountLayout(BUDGET_REMAINING_WITH_ZERO_MONEY_REMAINING));
          await browser.url(routes.getHomeViewUrl());
          await browser.waitUntilDisplayed(userProfileHeaderPO.element);
          await browser.waitUntilDisplayed(budgetPO.element);
          await browser.waitUntilDisplayed(budgetStatsPO.element);
        });

        it("[PRPI-6662] the Spend Budget Status is displayed", async () => {
          expect(await budgetStatsPO.spendBudget.isDisplayed()).toBe(true);
        });

        it("[PRPI-6663] and the Spend Budget Status value is: $0.00 remaining", async () => {
          expect(await budgetStatsPO.spendBudget.getText()).toBe("$0.00 remaining");
        });

        it("[PRPI-6664] and the Spend Budget is: 600$ - 0$ = 600$ which means 100% progress bar filled", async () => {
          expect(await budgetStatsPO.spentBudgetProgressBar.getAttribute("style")).toBe(
            "width: 100%; background-color: transparent;",
          );
        });

        it("[PRPI-6665] and the Remaining Budget is: 600$ - 600$ = 0$ which means 0% progress bar empty", async () => {
          expect(await budgetStatsPO.remainingBudgetProgressBar.getAttribute("style")).toBe(
            "width: 0%; background-color: rgb(65, 65, 67);",
          );
        });
      });
    });

    describe("and is has an NDL limit set to 700$", () => {
      describe("and he spent 0$", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(
            await getIndexHTML(BUDGET_REMAINING_WITH_NO_MONEY_SPENT.urn, { firstName: "valer" }),
          );
          await mockService.mockHttpRequest(getMyAccountLayout(BUDGET_REMAINING_WITH_NO_MONEY_SPENT));
          await browser.url(routes.getHomeViewUrl());
          await browser.waitUntilDisplayed(userProfileHeaderPO.element);
          await browser.waitUntilDisplayed(budgetPO.element);
          await browser.waitUntilDisplayed(budgetStatsPO.element);
        });

        it("[PRPI-6666] the Spend Budget Status is displayed", async () => {
          expect(await budgetStatsPO.spendBudget.isDisplayed()).toBe(true);
        });

        it("[PRPI-6667] and the Spend Budget Status value is: $700.00 remaining", async () => {
          expect(await budgetStatsPO.spendBudget.getText()).toBe("$700.00 remaining");
        });

        it("[PRPI-6668] and the Spend Budget is: 700$ - 700$ = 0$ which means 0% progress bar filled", async () => {
          expect(await budgetStatsPO.spentBudgetProgressBar.getAttribute("style")).toBe(
            "width: 0%; background-color: transparent;",
          );
        });

        it("[PRPI-6669] and the Remaining Budget is: 700$ - 0$ = 700$ which means 100% progress bar empty", async () => {
          expect(await budgetStatsPO.remainingBudgetProgressBar.getAttribute("style")).toBe(
            "width: 100%; background-color: rgb(65, 65, 67);",
          );
        });
      });
    });

    describe("and is has an NDL limit set to 1345.78$", () => {
      describe("and he spent 334.56$", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(
            await getIndexHTML(BUDGET_REMAINING_WITH_DECIMALS.urn, { firstName: "valer" }),
          );
          await mockService.mockHttpRequest(getMyAccountLayout(BUDGET_REMAINING_WITH_DECIMALS));
          await browser.url(routes.getHomeViewUrl());
          await browser.waitUntilDisplayed(userProfileHeaderPO.element);
          await browser.waitUntilDisplayed(budgetPO.element);
          await browser.waitUntilDisplayed(budgetStatsPO.element);
        });

        it("[PRPI-6670] the Spend Budget Status is: displayed", async () => {
          expect(await budgetStatsPO.spendBudget.isDisplayed()).toBe(true);
        });

        it("[PRPI-6671] and the Spend Budget Status value is: $334.56 remaining", async () => {
          expect(await budgetStatsPO.spendBudget.getText()).toBe("$334.56 remaining");
        });

        it("[PRPI-6672] and the Spend Budget is: 1345.78$ - 334.56$ = 1011.22$ which means 0% progress bar filled", async () => {
          expect(await budgetStatsPO.spentBudgetProgressBar.getAttribute("style")).toBe(
            "width: 75.1401%; background-color: transparent;",
          );
        });

        it("[PRPI-6673] and the Remaining Budget is: 1345.78$ - 1011.22$ = 334.56$ which means 100% progress bar empty", async () => {
          expect(await budgetStatsPO.remainingBudgetProgressBar.getAttribute("style")).toBe(
            "width: 24.8599%; background-color: rgb(65, 65, 67);",
          );
        });
      });
    });

    describe("and is has an NDL limit set to 500$", () => {
      describe("and he doesn't spent money", () => {
        describe("and withdraw 300$", () => {
          beforeAll(async () => {
            await mockService.mockHttpRequest(
              await getIndexHTML(BUDGET_REMAINING_GREATHER_THAN_AMOUNT.urn, { firstName: "valer" }),
            );
            await mockService.mockHttpRequest(getMyAccountLayout(BUDGET_REMAINING_GREATHER_THAN_AMOUNT));
            await browser.url(routes.getHomeViewUrl());
            await browser.waitUntilDisplayed(userProfileHeaderPO.element);
            await browser.waitUntilDisplayed(budgetPO.element);
            await browser.waitUntilDisplayed(budgetStatsPO.element);
          });

          it("[PRPI-6674] the Spend Budget Status is displayed", async () => {
            expect(await budgetStatsPO.spendBudget.isDisplayed()).toBe(true);
          });

          it("[PRPI-6675] and the Spend Budget Status value is: $800.00 remaining", async () => {
            expect(await budgetStatsPO.spendBudget.getText()).toBe("$800.00 remaining");
          });

          it("[PRPI-6676] and the Spend Budget is: 0$ which means 0% progress bar filled", async () => {
            expect(await budgetStatsPO.spentBudgetProgressBar.getAttribute("style")).toBe(
              "width: 0%; background-color: transparent;",
            );
          });

          it("[PRPI-6677] and the Remaining Budget is: 500$ + 300$ = 800$ which means 100% progress bar empty", async () => {
            expect(await budgetStatsPO.remainingBudgetProgressBar.getAttribute("style")).toBe(
              "width: 100%; background-color: rgb(65, 65, 67);",
            );
          });
        });
      });
    });
  });
});
