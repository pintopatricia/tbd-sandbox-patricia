const { getGenericLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { BottomBarPO } = require("../../../../../page-objects");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");
const { setCookie } = require("../../../../../helpers/cookie.util");

const bottomBarPO = new BottomBarPO();
const mockService = new MockService();

const BFF_MOCK = {
  urn: "ppb:tbd:view:generic:home",
  bottomBar: {
    tiles: [
      {
        tileType: "HOME",
        viewLink: {
          viewUrn: "ppb:tbd:view:generic:home",
          viewUrl: "",
        },
      },
      {
        tileType: "BROWSE",
        viewLink: {
          viewUrn: "ppb:tbd:view:browse:sports",
          viewUrl: "browse/b-sports",
        },
      },
      {
        tileType: "MY_BETS",
        viewLink: {
          viewUrn: "ppb:tbd:view:myBets:open",
          viewUrl: "mybets/mybets-open",
        },
      },
      {
        tileType: "GAMING",
        viewLink: {
          viewUrn: "ppb:tbd:view:gaming:1",
          viewUrl: "casino/gm-1",
        },
      },
    ],

    hasProductSwitcher: true,
  },
  edges: [],
  partialEdges: [],
};

const createMocks = async ({ cookies = [], initialState = {} } = {}) => {
  const url = routes.getHomeViewUrl();

  await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
  await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn, initialState));
  await browser.url(url);

  await browser.deleteCookies(["phoenixEnabled"]);
  await browser.execute(() => localStorage.setItem("wasExchangeOnboardingShown", "true"));

  if (cookies.length) {
    await Promise.all(cookies.map(async (cookie) => setCookie(cookie.name, cookie.value)));
  }

  // Set cookie and reload (same as SSOID)
  await browser.refresh();

  await browser.waitUntilDisplayed(bottomBarPO.element, "Bottom bar was not displayed");
};

const handleProductSwitcherClick = async () => {
  await bottomBarPO.productSwitcherTile.waitForClickable();
  await bottomBarPO.productSwitcherTile.click();
};

describe("Exchange - X-Sell Button - Product Switcher", () => {
  describe("when the EXC_ALLOWED_JURISDICTION throttle is ON", () => {
    describe("and the user is logged in", () => {
      describe("and is exchange eligible", () => {
        describe("and the exchangeDefaultProduct preference is NEME", () => {
          beforeAll(async () => {
            await createMocks({
              initialState: {
                canUsePhoenixExchange: true,
                PRODUCT_SWITCHER: { isActive: true },
                ENABLE_PREDICTS: { isActive: false },
                EXC_ALLOWED_JURISDICTION: { isActive: true },
                products: ["sportsbook", "games"],
                exchangeDefaultProduct: "neme",
                loggedIn: "true",
              },
            });
          });

          it("[PRPI-8366] the exchange x-sell button should display the new label", async () => {
            expect(await bottomBarPO.productSwitcherTileLabel.isDisplayed()).toBe(true);
          });

          describe("and when clicking on the exchange x-sell button", () => {
            beforeAll(async () => {
              await mockService.mockHttpRequest(
                await getIndexHTML(BFF_MOCK.urn, {
                  canUsePhoenixExchange: true,
                  PRODUCT_SWITCHER: { isActive: true },
                  ENABLE_PREDICTS: { isActive: false },
                  EXC_ALLOWED_JURISDICTION: { isActive: true },
                  products: ["exchange", "games"],
                  exchangeDefaultProduct: "neme",
                  loggedIn: "true",
                }),
              );
              await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
              await handleProductSwitcherClick();
              await browser.waitUntilDisplayed(bottomBarPO.element);
            });

            it("[PRPI-8661] the user should be redirected to NEME", async () => {
              const url = await browser.getUrl();

              expect(url.endsWith("betting/")).toBe(true);
              expect(await bottomBarPO.tiles[4].getText()).toBe("Sportsbook");
            });
          });
        });

        describe("and the exchangeDefaultProduct preference is EMS", () => {
          beforeAll(async () => {
            await createMocks({
              initialState: {
                canUsePhoenixExchange: true,
                PRODUCT_SWITCHER: { isActive: true },
                EXC_ALLOWED_JURISDICTION: { isActive: true },
                products: ["sportsbook", "games"],
                exchangeDefaultProduct: "ems",
                loggedIn: "true",
              },
            });
          });

          it("[PRPI-8367] the exchange x-sell button should not display the new label", async () => {
            expect(await bottomBarPO.productSwitcherTileLabel.isDisplayed()).toBe(false);
          });

          describe("and when clicking on the exchange x-sell button", () => {
            beforeAll(async () => {
              await handleProductSwitcherClick();
              await browser.waitUntilBrowserUrlContains("exchange");
            });

            it("[PRPI-8662] the user should be redirected to EMS", async () => {
              expect(await browser.getUrl()).toContain("/exchange/");
            });
          });
        });

        describe("and the exchangeDefaultProduct preference is not set", () => {
          beforeAll(async () => {
            await createMocks({
              initialState: {
                canUsePhoenixExchange: true,
                PRODUCT_SWITCHER: { isActive: true },
                EXC_ALLOWED_JURISDICTION: { isActive: true },
                products: ["sportsbook", "games"],
                exchangeDefaultProduct: "unassigned",
                loggedIn: "true",
              },
            });
          });

          it("[PRPI-8368] the exchange x-sell button should not display the new label", async () => {
            expect(await bottomBarPO.productSwitcherTileLabel.isDisplayed()).toBe(false);
          });

          describe("and when clicking on the exchange x-sell button", () => {
            beforeAll(async () => {
              await handleProductSwitcherClick();
              await browser.waitUntilBrowserUrlContains("exchange");
            });

            it("[PRPI-8663] the user should be redirected to EMS", async () => {
              expect(await browser.getUrl()).toContain("/exchange/");
            });
          });
        });
      });

      describe("and is NOT exchange eligible", () => {
        describe("and the account creation date is >= 31 December 2026", () => {
          beforeAll(async () => {
            await createMocks({
              initialState: {
                PRODUCT_SWITCHER: { isActive: true },
                EXC_ALLOWED_JURISDICTION: { isActive: true },
                products: ["sportsbook", "games"],
                exchangeDefaultProduct: "neme",
                loggedIn: "true",
                accountOpenDate: "2026-12-31T00:00:00.000Z",
                canUsePhoenixExchange: true,
              },
            });
          });

          it("[PRPI-12638] the exchange x-sell button should display the new label", async () => {
            expect(await bottomBarPO.productSwitcherTileLabel.isDisplayed()).toBe(true);
          });

          describe("and when clicking on the exchange x-sell button", () => {
            beforeAll(async () => {
              await mockService.mockHttpRequest(
                await getIndexHTML(BFF_MOCK.urn, {
                  canUsePhoenixExchange: true,
                  PRODUCT_SWITCHER: { isActive: true },
                  ENABLE_PREDICTS: { isActive: false },
                  EXC_ALLOWED_JURISDICTION: { isActive: true },
                  products: ["exchange", "games"],
                  exchangeDefaultProduct: "neme",
                  loggedIn: "true",
                }),
              );
              await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
              await handleProductSwitcherClick();
              await browser.waitUntilDisplayed(bottomBarPO.element);
            });

            it("[PRPI-12639] the user should be redirected to NEME", async () => {
              const url = await browser.getUrl();

              expect(url.endsWith("betting/")).toBe(true);
              expect(await bottomBarPO.tiles[4].getText()).toBe("Sportsbook");
            });
          });
        });

        describe("and the account creation date is < 31 December 2026", () => {
          beforeAll(async () => {
            await createMocks({
              initialState: {
                canUsePhoenixExchange: true,
                PRODUCT_SWITCHER: { isActive: true },
                EXC_ALLOWED_JURISDICTION: { isActive: true },
                products: ["sportsbook", "games"],
                loggedIn: "true",
                accountOpenDate: "2026-12-30T00:00:00.000Z",
              },
            });
          });

          it("[PRPI-12640] the exchange x-sell button should not display the new label", async () => {
            expect(await bottomBarPO.productSwitcherTileLabel.isDisplayed()).toBe(false);
          });

          describe("and when clicking on the exchange x-sell button", () => {
            beforeAll(async () => {
              await handleProductSwitcherClick();
              await browser.waitUntilBrowserUrlContains("exchange");
            });

            it("[PRPI-8664] the user should be redirected to EMS", async () => {
              expect(await browser.getUrl()).toContain("/exchange/");
            });
          });
        });
      });
    });

    describe("and the user is logged out", () => {
      describe("and the phoenixEnabled cookie is set to true", () => {
        beforeAll(async () => {
          await createMocks({
            initialState: {
              PRODUCT_SWITCHER: { isActive: true },
              EXC_ALLOWED_JURISDICTION: { isActive: true },
              products: ["sportsbook", "games"],
              loggedIn: "false",
            },
            cookies: [{ name: "phoenixEnabled", value: "true" }],
          });
        });

        it("[PRPI-8665] the exchange x-sell button should display the new label", async () => {
          expect(await bottomBarPO.productSwitcherTileLabel.isDisplayed()).toBe(true);
        });

        describe("and when clicking on the exchange x-sell button", () => {
          beforeAll(async () => {
            await mockService.mockHttpRequest(
              await getIndexHTML(BFF_MOCK.urn, {
                PRODUCT_SWITCHER: { isActive: true },
                ENABLE_PREDICTS: { isActive: false },
                EXC_ALLOWED_JURISDICTION: { isActive: true },
                products: ["exchange", "games"],
                loggedIn: "false",
              }),
            );
            await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
            await handleProductSwitcherClick();
            await browser.waitUntilDisplayed(bottomBarPO.element);
          });

          it("[PRPI-8666] the user should be redirected to NEME", async () => {
            const url = await browser.getUrl();

            expect(url.endsWith("betting/")).toBe(true);
            expect(await bottomBarPO.tiles[4].getText()).toBe("Sportsbook");
          });
        });
      });

      describe("and the phoenixEnabled cookie is set to false", () => {
        beforeAll(async () => {
          await createMocks({
            initialState: {
              PRODUCT_SWITCHER: { isActive: true },
              EXC_ALLOWED_JURISDICTION: { isActive: true },
              products: ["sportsbook", "games"],
              loggedIn: "false",
            },
            cookies: [{ name: "phoenixEnabled", value: "false" }],
          });
        });

        it("[PRPI-8667] the exchange x-sell button should not display the new label", async () => {
          expect(await bottomBarPO.productSwitcherTileLabel.isDisplayed()).toBe(false);
        });

        describe("and when clicking on the exchange x-sell button", () => {
          beforeAll(async () => {
            await handleProductSwitcherClick();
            await browser.waitUntilBrowserUrlContains("exchange");
          });

          it("[PRPI-8668] the user should be redirected to EMS", async () => {
            expect(await browser.getUrl()).toContain("/exchange/");
          });
        });
      });

      describe("and the phoenixEnabled cookie is not set", () => {
        beforeAll(async () => {
          await createMocks({
            initialState: {
              PRODUCT_SWITCHER: { isActive: true },
              EXC_ALLOWED_JURISDICTION: { isActive: true },
              products: ["sportsbook", "games"],
              loggedIn: "false",
            },
          });
        });

        it("[PRPI-8371] the exchange x-sell button should not display the new label", async () => {
          expect(await bottomBarPO.productSwitcherTileLabel.isDisplayed()).toBe(false);
        });

        describe("and when clicking on the exchange x-sell button", () => {
          beforeAll(async () => {
            await handleProductSwitcherClick();
            await browser.waitUntilBrowserUrlContains("exchange");
          });

          it("[PRPI-8669] the user should be redirected to EMS", async () => {
            expect(await browser.getUrl()).toContain("/exchange/");
          });
        });
      });
    });
  });

  describe("when the EXC_ALLOWED_JURISDICTION throttle is OFF", () => {
    describe("and the user is logged in", () => {
      describe("and is exchange eligible", () => {
        beforeAll(async () => {
          await createMocks({
            initialState: {
              canUsePhoenixExchange: true,
              PRODUCT_SWITCHER: { isActive: true },
              EXC_ALLOWED_JURISDICTION: { isActive: false },
              products: ["sportsbook", "games"],
              exchangeDefaultProduct: "neme",
              loggedIn: "true",
            },
          });
        });

        it("[PRPI-8369] the exchange x-sell button should not display the new label", async () => {
          expect(await bottomBarPO.productSwitcherTileLabel.isDisplayed()).toBe(false);
        });
      });

      describe("and is NOT exchange eligible, but the account creation date is >= 31 December 2026", () => {
        beforeAll(async () => {
          await createMocks({
            initialState: {
              canUsePhoenixExchange: true,
              PRODUCT_SWITCHER: { isActive: true },
              EXC_ALLOWED_JURISDICTION: { isActive: false },
              products: ["sportsbook", "games"],
              exchangeDefaultProduct: "neme",
              loggedIn: "true",
              accountOpenDate: "2026-12-31T00:00:00.000Z",
            },
          });
        });

        it("[PRPI-12641] the exchange x-sell button should not display the new label", async () => {
          expect(await bottomBarPO.productSwitcherTileLabel.isDisplayed()).toBe(false);
        });
      });
    });

    describe("and the user is logged out", () => {
      beforeAll(async () => {
        await createMocks({
          initialState: {
            PRODUCT_SWITCHER: { isActive: true },
            EXC_ALLOWED_JURISDICTION: { isActive: false },
            products: ["sportsbook", "games"],
            loggedIn: "false",
          },
          cookies: [{ name: "phoenixEnabled", value: "true" }],
        });
      });

      it("[PRPI-8372] the exchange x-sell button should not display the new label", async () => {
        expect(await bottomBarPO.productSwitcherTileLabel.isDisplayed()).toBe(false);
      });

      describe("and when clicking on the exchange x-sell button", () => {
        beforeAll(async () => {
          await handleProductSwitcherClick();
          await browser.waitUntilBrowserUrlContains("exchange");
        });

        it("[PRPI-8670] the user should be redirected to EMS", async () => {
          expect(await browser.getUrl()).toContain("/exchange/");
        });
      });
    });
  });
});
