const { UserProfileHeaderPO } = require("../../../../page-objects");
const { getMyAccountLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const routes = require("../../../../../utils/routes");

const userProfileHeaderPO = new UserProfileHeaderPO();
const mockService = new MockService();
const MODULE_NAME = "budget_widget";

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

xdescribe("Budget Widget", () => {
  describe("When the user opens the event page and is logged in", () => {
    describe("and it has an NDL limit set to 500$", () => {
      describe("and he spent 100$", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(await getIndexHTML(BUDGET_REMAINING.urn, { firstName: "valer" }));
          await mockService.mockFonts(getMockFonts());
          await mockService.mockHttpRequest(getMyAccountLayout(BUDGET_REMAINING));
          await browser.url(routes.getHomeViewUrl());
          await browser.waitUntilDisplayed(userProfileHeaderPO.element);
          await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1212]_should_display_widget_budget_400$_remaining`);
        });
        it("[PRPI-1212]_should_display_widget_budget_400$_remaining", async () => {
          expect(
            await browser.checkScreen(`${MODULE_NAME}_[PRPI-1212]_should_display_widget_budget_400$_remaining`),
          ).toEqual(0);
        });
      });
    });

    describe("and is has an NDL limit set to 600$", () => {
      describe("and he spent 600$", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(
            await getIndexHTML(BUDGET_REMAINING_WITH_ZERO_MONEY_REMAINING.urn, { firstName: "valer" }),
          );
          await mockService.mockFonts(getMockFonts());
          await mockService.mockHttpRequest(getMyAccountLayout(BUDGET_REMAINING_WITH_ZERO_MONEY_REMAINING));
          await browser.url(routes.getHomeViewUrl());
          await browser.waitUntilDisplayed(userProfileHeaderPO.element);
          await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1213]_should_display_widget_budget_0$_remaining`);
        });
        it("[PRPI-1213]_should_display_widget_budget_0$_remaining", async () => {
          expect(
            await browser.checkScreen(`${MODULE_NAME}_[PRPI-1213]_should_display_widget_budget_0$_remaining`),
          ).toEqual(0);
        });
      });
    });

    describe("and is has an NDL limit set to 700$", () => {
      describe("and he spent 0$", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(
            await getIndexHTML(BUDGET_REMAINING_WITH_NO_MONEY_SPENT.urn, { firstName: "valer" }),
          );
          await mockService.mockFonts(getMockFonts());
          await mockService.mockHttpRequest(getMyAccountLayout(BUDGET_REMAINING_WITH_NO_MONEY_SPENT));
          await browser.url(routes.getHomeViewUrl());
          await browser.waitUntilDisplayed(userProfileHeaderPO.element);
          await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1214]_should_display_widget_budget_700$_remaining`);
        });
        it("[PRPI-1214]_should_display_widget_budget_700$_remaining", async () => {
          expect(
            await browser.checkScreen(`${MODULE_NAME}_[PRPI-1214]_should_display_widget_budget_700$_remaining`),
          ).toEqual(0);
        });
      });
    });

    describe("and is has an NDL limit set to 1345.78$", () => {
      describe("and he spent 334.56$$", () => {
        describe("and the Spend Budget is: 1345.78$ - 335$ = 1011.22$ which means 0% progress bar filled", () => {
          describe("and the Remaining Budget is: 1345.78$ - 1011.22$ = 334.56$ which means 100% progress bar empty", () => {
            beforeAll(async () => {
              await mockService.mockHttpRequest(
                await getIndexHTML(BUDGET_REMAINING_WITH_DECIMALS.urn, { firstName: "valer" }),
              );
              await mockService.mockFonts(getMockFonts());
              await mockService.mockHttpRequest(getMyAccountLayout(BUDGET_REMAINING_WITH_DECIMALS));
              await browser.url(routes.getHomeViewUrl());
              await browser.waitUntilDisplayed(userProfileHeaderPO.element);
              await browser.waitUntilImageEquals(
                `${MODULE_NAME}_[PRPI-1215]_should_display_widget_budget_334_56$_remaining`,
              );
            });
            it("[PRPI-1215]_should_display_widget_budget_334_56$_remaining", async () => {
              expect(
                await browser.checkScreen(`${MODULE_NAME}_[PRPI-1215]_should_display_widget_budget_334_56$_remaining`),
              ).toEqual(0);
            });
          });
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
            await mockService.mockFonts(getMockFonts());
            await mockService.mockHttpRequest(getMyAccountLayout(BUDGET_REMAINING_GREATHER_THAN_AMOUNT));
            await browser.url(routes.getHomeViewUrl());
            await browser.waitUntilDisplayed(userProfileHeaderPO.element);
            await browser.waitUntilImageEquals(
              `${MODULE_NAME}_[PRPI-1216]_should_display_widget_budget_empty_progress_bar`,
            );
          });
          it("[PRPI-1216]_should_display_widget_budget_empty_progress_bar", async () => {
            expect(
              await browser.checkScreen(`${MODULE_NAME}_[PRPI-1216]_should_display_widget_budget_empty_progress_bar`),
            ).toEqual(0);
          });
        });
      });
    });
  });
});
