const { getAppContext, getGenericLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { PrimaryButtonSO, ExchangeOnboardingBottomSheetSO } = require("../../../../screen-objects");
const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");
const { getPackageName } = require("../../../../config/helpers/app-version-management");

const { PLATFORM, BRAND, BUILD_TYPE } = process.env;
const packageName = getPackageName(PLATFORM, BRAND, BUILD_TYPE);

const mockService = new MockService();

const exchangeOnboardingBottomSheetSO = new ExchangeOnboardingBottomSheetSO();
const exploreButtonSO = new PrimaryButtonSO(exchangeOnboardingBottomSheetSO.content);

const BFF_MOCK = {
  urn: "ppb:tbd:view:generic:home",
  edges: [],
  partialEdges: [],
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
};

const setup = async ({ selectedDefaultProduct = "EXCHANGE" } = {}) => {
  await mockService.mockHttpRequest(
    getAppContext({
      throttles: {
        PRODUCT_SWITCHER_NATIVE: { isActive: true },
        EXC_ALLOWED_JURISDICTION: { isActive: true },
      },
      loggedIn: true,
      phoenixMigratedUser: true,
      selectedDefaultProduct,
    }),
  );

  await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
  await startApp("home", { shouldTerminateAppBeforeStart: true });
};

describe("Exchange - Onboarding Bottom Sheet", () => {
  describe("when a logged in user is EXC eligible, and the EXC_ALLOWED_JURISDICTION throttle is ON", () => {
    describe("and when accessing exchange", () => {
      beforeAll(async () => {
        await setup();
        await browser.waitUntilDisplayed(
          exchangeOnboardingBottomSheetSO.element,
          "Onboarding bottom sheet is not visible",
        );
      });

      it("[PRPI-9548] the onboarding bottom sheet should display a title", async () => {
        expect(await exchangeOnboardingBottomSheetSO.headerTitle.getText()).toBe("The Exchange has evolved");
      });

      it("[PRPI-9549] the onboarding bottom sheet should display the dismiss and explore buttons", async () => {
        expect(await exchangeOnboardingBottomSheetSO.headerButton.isDisplayed()).toBe(true);
        expect(await exploreButtonSO.label.getText()).toBe("Explore now");
      });

      it("[PRPI-9550] the onboarding bottom sheet should display an image", async () => {
        expect(await exchangeOnboardingBottomSheetSO.image.isDisplayed()).toBe(true);
      });

      it("[PRPI-9551] the onboarding bottom sheet should display a description", async () => {
        expect(await exchangeOnboardingBottomSheetSO.description.getText()).toBe(
          "Faster. Simpler. Switch seamlessly between Sportsbook and Exchange in one app. You can set your default anytime in Settings & Details.",
        );
      });

      describe("and when restarting the app", () => {
        beforeAll(async () => {
          await startApp("home", { shouldTerminateAppBeforeStart: true });
        });

        it("[PRPI-9805] the onboarding bottom sheet should still be displayed", async () => {
          await browser.waitUntilDisplayed(
            exchangeOnboardingBottomSheetSO.element,
            "Onboarding bottom sheet is not visible after restart",
          );
        });

        describe("and when clicking on the dismiss button", () => {
          beforeAll(async () => {
            await browser.waitUntilClickableNative(exchangeOnboardingBottomSheetSO.headerButton);
            await exchangeOnboardingBottomSheetSO.headerButton.click();
          });

          it("[PRPI-9806] the onboarding bottom sheet should no longer be displayed", async () => {
            await browser.waitUntilNotDisplayed(
              exchangeOnboardingBottomSheetSO.element,
              "Onboarding bottom sheet is still displayed",
            );
          });

          describe("and when restarting the app again", () => {
            beforeAll(async () => {
              await startApp("home", { shouldTerminateAppBeforeStart: true });
            });

            it("[PRPI-9807] the onboarding bottom sheet should not be displayed", async () => {
              await browser.waitUntilNotDisplayed(
                exchangeOnboardingBottomSheetSO.element,
                "Onboarding bottom sheet is still displayed",
              );
            });
          });
        });
      });
    });

    describe("and when accessing sportsbook", () => {
      beforeAll(async () => {
        await driver.execute("mobile: clearApp", { appId: packageName });
        await setup({ selectedDefaultProduct: "SPORTSBOOK" });
      });

      it("[PRPI-9555] the onboarding bottom sheet should be displayed", async () => {
        await browser.waitUntilDisplayed(
          exchangeOnboardingBottomSheetSO.element,
          "Onboarding bottom sheet is not visible",
        );
      });

      describe("and when clicking on the explore button", () => {
        beforeAll(async () => {
          await browser.waitUntilClickableNative(exploreButtonSO.label);
          await exploreButtonSO.label.click();
        });

        it("[PRPI-9556] the onboarding bottom sheet should no longer be displayed", async () => {
          await browser.waitUntilNotDisplayed(
            exchangeOnboardingBottomSheetSO.element,
            "Onboarding bottom sheet is still displayed",
          );
        });

        describe("and when restarting the app", () => {
          beforeAll(async () => {
            await startApp("home", { shouldTerminateAppBeforeStart: true });
          });

          it("[PRPI-9808] the onboarding bottom sheet should not be displayed", async () => {
            await browser.waitUntilNotDisplayed(
              exchangeOnboardingBottomSheetSO.element,
              "Onboarding bottom sheet is still displayed",
            );
          });
        });
      });
    });
  });
});
