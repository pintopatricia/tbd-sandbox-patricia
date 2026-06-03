const { getGenericLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getWallets } = require("@flutter-global/uki-channels-http-clients/mock-index").WALLET;

const {
  HeaderPO,
  AlertPO,
  GenerosityWalletPO,
  PebbleListPO,
  PebblePO,
  ExtraWalletCardGroupPO,
  ExtraWalletCardPO,
  ActionLinkPO,
  OptionPO,
  CountdownPO,
  InfoLabelPO,
} = require("../../../../../../page-objects");
const routes = require("../../../../../../../utils/routes");
const MockService = require("../../../../../../mock-essentials/mocking-service");
const { getIndexHTML } = require("../../../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../../../mock-essentials/controllers/fonts/fonts-controller");
const { WALLET_UPDATE_TIMEOUT } = require("../../../../../../../web/config/intervals.conf");

const mockService = new MockService(browser);

const headerPO = new HeaderPO();
const generosityWalletPO = new GenerosityWalletPO();
const generosityWalletPebbleListPO = new PebbleListPO(generosityWalletPO.headerContent);
const firstPebblePO = new PebblePO(generosityWalletPebbleListPO.pebbles[0]);
const secondPebblePO = new PebblePO(generosityWalletPebbleListPO.pebbles[1]);
const thirdPebblePO = new PebblePO(generosityWalletPebbleListPO.pebbles[2]);
const fourthPebblePO = new PebblePO(generosityWalletPebbleListPO.pebbles[3]);
const extraWalletCardGroupPO = new ExtraWalletCardGroupPO();
const helpAlertPO = new AlertPO(extraWalletCardGroupPO.helpUrlAlert);
const helpActionLinkPO = new ActionLinkPO(helpAlertPO.dismissLabel);
const extraWalletCardGroupOptionPO = new OptionPO(extraWalletCardGroupPO.optionTitle);
const firstExtraWalletCardPO = new ExtraWalletCardPO(extraWalletCardGroupPO.extraWalletCardItems[0]);
const firstExtraWalletCardOptionPO = new OptionPO(firstExtraWalletCardPO.walletOption);
const firstExtraWalletCardCountdownPO = new CountdownPO(firstExtraWalletCardPO.countdown);
const firstExtraWalletCardInfoLabelPO = new InfoLabelPO(firstExtraWalletCardPO.restrictionBadges[0]);
const secondExtraWalletCardPO = new ExtraWalletCardPO(extraWalletCardGroupPO.extraWalletCardItems[1]);
const secondExtraWalletCardOptionPO = new OptionPO(secondExtraWalletCardPO.walletOption);
const thirdExtraWalletCardPO = new ExtraWalletCardPO(extraWalletCardGroupPO.extraWalletCardItems[2]);
const thirdExtraWalletCardOptionPO = new OptionPO(thirdExtraWalletCardPO.walletOption);
const fifthExtraWalletCardPO = new ExtraWalletCardPO(extraWalletCardGroupPO.extraWalletCardItems[4]);
const fifthExtraWalletCardOptionPO = new OptionPO(fifthExtraWalletCardPO.walletOption);

const BFF_HOME_VIEW_MOCK = {
  urn: "ppb:tbd:view:generic:home",
};

const BFF_FETCH_CARDS_MOCK_ONE_TOKEN_TYPE = {
  cards: [
    {
      __typename: "ExtraWalletCardGroup",
      urn: "ppb:tbd:cardgroup:extraWalletCardGroup:extraWallets",
      amount: 5.0,
      bonusPageUrl: "thisisabonuspageurl",
      full: {
        edges: [
          {
            node: {
              __typename: "ExtraWalletCard",
              urn: "ppb:tbd:card:extraWalletCard:3",
              badges: [],
              extraWallet: {
                __typename: "ExtraWallet",
                urn: "ppb:extraWallet:3",
                walletId: "3",
                indexedId: "3",
                amount: 10.0,
                expirationDate: "2019-06-26T12:50:00.000Z",
                walletType: "PRICE_BOOST_TOKEN",
              },
            },
            __typename: "ExtraWalletCardGroupEdge",
          },
          {
            node: {
              __typename: "ExtraWalletCard",
              urn: "ppb:tbd:card:extraWalletCard:5",
              badges: [],
              extraWallet: {
                __typename: "ExtraWallet",
                urn: "ppb:extraWallet:5",
                walletId: "5",
                indexedId: "5",
                amount: 20.0,
                walletType: "PRICE_BOOST_TOKEN",
              },
            },
            __typename: "ExtraWalletCardGroupEdge",
          },
        ],

        __typename: "ExtraWalletCardGroupConnection",
      },
    },
  ],
};

const BFF_FETCH_CARDS_MOCK = {
  cards: [
    {
      __typename: "ExtraWalletCardGroup",
      urn: "ppb:tbd:cardgroup:extraWalletCardGroup:extraWallets",
      amount: 5.0,
      helpUrl: "thisisahelpurl",
      bonusPageUrl: "thisisabonuspageurl",
      full: {
        edges: [
          {
            node: {
              __typename: "ExtraWalletCard",
              urn: "ppb:tbd:card:extraWalletCard:1",
              badges: [],
              extraWallet: {
                __typename: "ExtraWallet",
                urn: "ppb:extraWallet:1",
                walletId: "1",
                indexedId: "1",
                amount: 2.0,
                expirationDate: "2019-06-26T09:50:00.000Z",
                walletType: "BONUS_CASH",
              },
            },
            __typename: "ExtraWalletCardGroupEdge",
          },
          {
            node: {
              __typename: "ExtraWalletCard",
              urn: "ppb:tbd:card:extraWalletCard:2",
              badges: [],
              extraWallet: {
                __typename: "ExtraWallet",
                urn: "ppb:extraWallet:2",
                walletId: "2",
                indexedId: "2",
                amount: 3.0,
                expirationDate: "2019-06-26T10:50:00.000Z",
                walletType: "BONUS_CASH",
              },
            },
            __typename: "ExtraWalletCardGroupEdge",
          },
          {
            node: {
              __typename: "ExtraWalletCard",
              urn: "ppb:tbd:card:extraWalletCard:3",
              badges: [],
              extraWallet: {
                __typename: "ExtraWallet",
                urn: "ppb:extraWallet:3",
                walletId: "3",
                indexedId: "3",
                amount: 10.0,
                expirationDate: "2019-06-26T12:50:00.000Z",
                walletType: "PRICE_BOOST_TOKEN",
              },
            },
            __typename: "ExtraWalletCardGroupEdge",
          },
          {
            node: {
              __typename: "ExtraWalletCard",
              urn: "ppb:tbd:card:extraWalletCard:5",
              badges: [],
              extraWallet: {
                __typename: "ExtraWallet",
                urn: "ppb:extraWallet:5",
                walletId: "5",
                indexedId: "5",
                amount: 10.0,
                walletType: "PRICE_BOOST_TOKEN",
              },
            },
            __typename: "ExtraWalletCardGroupEdge",
          },
          {
            node: {
              __typename: "ExtraWalletCard",
              urn: "ppb:tbd:card:extraWalletCard:4",
              badges: [],
              extraWallet: {
                __typename: "ExtraWallet",
                urn: "ppb:extraWallet:4",
                walletId: "4",
                indexedId: "4",
                amount: 0,
                lostLegs: 1,
                maxReturn: 10,
                expirationDate: "2019-06-30T10:50:00.000Z",
                walletType: "ACCA_INSURANCE_TOKEN",
              },
              restrictions: { __typename: "WalletRestrictions", single: false, acca: true, sameGameMulti: false },
            },
            __typename: "ExtraWalletCardGroupEdge",
          },
        ],

        __typename: "ExtraWalletCardGroupConnection",
      },
    },
  ],
};

describe("Sportsbook Generosity Wallet - Header Bottom Sheet", () => {
  beforeAll(async () => {
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(
      await getIndexHTML(BFF_HOME_VIEW_MOCK.urn, {
        FREE_BETS_WALLET: { isActive: true },
        date: "2019-06-26T09:00:00.000Z",
      }),
    );
    await mockService.mockHttpRequest(getGenericLayout(BFF_HOME_VIEW_MOCK));
    await browser.url(routes.getHomeViewUrl());
  });

  describe("When the user has only one type of token with no help URL", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(
        getWallets([
          { amount: "5.00", walletName: "MAIN" },
          { amount: "2.00", walletName: "BOOST_TOKENS" },
        ]),
      );
      await browser.tickFakeClock(WALLET_UPDATE_TIMEOUT);
      await mockService.mockHttpRequest(getCardResults(BFF_FETCH_CARDS_MOCK_ONE_TOKEN_TYPE));

      await headerPO.generosityWalletButton.waitForClickable();
      await headerPO.generosityWalletButton.click();

      await browser.waitUntilDisplayed(generosityWalletPO.element, "Bottom sheet not displayed");
    });

    it("[PRPI-4738] should display the generosity wallet bottom sheet", async () => {
      expect(await generosityWalletPO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-4739] should display the generosity wallet bottom sheet title as 'Your Bonuses'", async () => {
      expect(await generosityWalletPO.headerTitle.getText()).toBe("Your Bonuses");
    });

    it("[PRPI-4740] should not display the generosity wallet pebble list", async () => {
      expect(await generosityWalletPebbleListPO.element.isDisplayed()).toBe(false);
    });

    it("[PRPI-4741] should not display the help alert message", async () => {
      expect(await helpAlertPO.element.isDisplayed()).toBe(false);
    });

    it("[PRPI-4742] should display the summary message", async () => {
      expect(await extraWalletCardGroupOptionPO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-4743] should display 2 wallets", async () => {
      expect(await extraWalletCardGroupPO.extraWalletCardItems.length).toBe(2);
    });

    it("[PRPI-4744] should display the first wallet with 10% Bet Boost", async () => {
      expect(await firstExtraWalletCardOptionPO.title.getText()).toBe("10% Bet Boost");
    });

    it("[PRPI-4745] should display the second wallet with 20% Bet Boost", async () => {
      expect(await secondExtraWalletCardOptionPO.title.getText()).toBe("20% Bet Boost");
    });

    it("[PRPI-4746] should display the bonus URL with the label 'My Bonus Page' on the footer", async () => {
      expect(await generosityWalletPO.footerContent.getText()).toBe("My Bonus Page");
    });

    describe("And the user clicks outside the bottom sheet", () => {
      beforeAll(async () => {
        await browser.execute(() => {
          const element = document.elementFromPoint(0, 0);
          if (element) element.click();
        });
        await browser.waitUntilNotDisplayed(generosityWalletPO.element);
      });

      it("[PRPI-4747] should close the generosity wallet", async () => {
        expect(await generosityWalletPO.element.isDisplayed()).toBe(false);
      });
    });
  });

  describe("When the user has Free Bets wallets, Acca Insurance and Boost tokens and clicks on header", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(
        getWallets([
          { amount: "5.00", walletName: "MAIN" },
          { amount: "5.00", walletName: "SPORTSBOOK_BONUS" },
          { amount: "1.00", walletName: "ACCA_INSURANCE_TOKENS" },
          { amount: "2.00", walletName: "BOOST_TOKENS" },
        ]),
      );
      await browser.tickFakeClock(WALLET_UPDATE_TIMEOUT);
      await mockService.mockHttpRequest(getCardResults(BFF_FETCH_CARDS_MOCK));

      await headerPO.generosityWalletButton.waitForClickable();
      await headerPO.generosityWalletButton.click();

      await browser.waitUntilDisplayed(generosityWalletPO.element, "Sportsbook betslip not displayed");
    });

    it("[PRPI-4748] should display the generosity wallet bottom sheet", async () => {
      expect(await generosityWalletPO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-4749] should display the generosity wallet bottom sheet title as 'Your Bonuses'", async () => {
      expect(await generosityWalletPO.headerTitle.getText()).toBe("Your Bonuses");
    });

    it("[PRPI-4750] should display the generosity wallet pebble list", async () => {
      expect(await generosityWalletPebbleListPO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-4751] should display the pebbles in the following order: All, Free Bets, Bet Boost and Second Chance", async () => {
      expect(await firstPebblePO.element.getText()).toBe("5\nAll");
      expect(await secondPebblePO.element.getText()).toBe("2\nFree Bets");
      expect(await thirdPebblePO.element.getText()).toBe("2\nBet Boost");
      expect(await fourthPebblePO.element.getText()).toBe("1\nSecond Chance");
    });

    it("[PRPI-4752] should display the All pebble as selected and all the others unselected", async () => {
      expect(await browser.containsClass(firstPebblePO.element, PebblePO.states.active)).toEqual(true);
      expect(await browser.containsClass(secondPebblePO.element, PebblePO.states.active)).toBe(false);
      expect(await browser.containsClass(thirdPebblePO.element, PebblePO.states.active)).toBe(false);
      expect(await browser.containsClass(fourthPebblePO.element, PebblePO.states.active)).toBe(false);
    });

    it("[PRPI-4753] should display the help alert message as 'Bonuses are applied in the Betslip'", async () => {
      expect(await helpAlertPO.message.getText()).toBe("Bonuses are applied in the Betslip");
    });

    it("[PRPI-4754] should display the help dismiss label as 'Help'", async () => {
      expect(await helpActionLinkPO.element.getText()).toBe("Help");
    });

    it("[PRPI-4755] should not display the summary message", async () => {
      expect(await extraWalletCardGroupOptionPO.element.isDisplayed()).toBe(false);
    });

    it("[PRPI-4756] should display 5 wallets", async () => {
      expect(await extraWalletCardGroupPO.extraWalletCardItems.length).toBe(5);
    });

    it("[PRPI-4757] should display the first wallet with $2.00 Free Bet", async () => {
      expect(await firstExtraWalletCardOptionPO.title.getText()).toBe("$2.00 Free Bet");
    });

    it("[PRPI-4758] should display the third wallet with 10% Bet Boost", async () => {
      expect(await thirdExtraWalletCardOptionPO.title.getText()).toBe("10% Bet Boost");
    });

    it("[PRPI-4759] should display the fifth wallet with Second Chance", async () => {
      expect(await fifthExtraWalletCardOptionPO.title.getText()).toBe("Second Chance");
    });

    it("[PRPI-4760] should display the bonus URL with the label 'My Bonus Page' on the footer", async () => {
      expect(await generosityWalletPO.footerContent.getText()).toBe("My Bonus Page");
    });

    describe("And then clicks on Free Bets pebble", () => {
      beforeAll(async () => {
        await secondPebblePO.element.waitForClickable();
        await secondPebblePO.element.click();
        await browser.waitUntilContainsClass(secondPebblePO.element, PebblePO.states.active);
      });

      it("[PRPI-4761] should show the Free Bets pebble as selected", async () => {
        expect(await browser.containsClass(secondPebblePO.element, PebblePO.states.active)).toBe(true);
      });

      it("[PRPI-4762] should not display the alert message", async () => {
        expect(await helpAlertPO.element.isDisplayed()).toBe(false);
      });

      it("[PRPI-4763] should display the summary message as 'You have $5.00 in Free Bets'", async () => {
        expect(await extraWalletCardGroupOptionPO.title.getText()).toBe("You have $5.00 in Free Bets");
      });

      it("[PRPI-4764] should display 2 free bet wallets", async () => {
        expect(await extraWalletCardGroupPO.extraWalletCardItems.length).toBe(2);
      });

      it("[PRPI-4765] should display the first wallet with $2.00 Free Bet and the correct expiration date", async () => {
        expect(await firstExtraWalletCardOptionPO.title.getText()).toBe("$2.00 Free Bet");
        expect(await firstExtraWalletCardCountdownPO.element.getText()).toBe("48 min left");
      });

      it("[PRPI-4766] should display the bonus URL with the label 'My Bonus Page' on the footer", async () => {
        expect(await generosityWalletPO.footerContent.getText()).toBe("My Bonus Page");
      });
    });

    describe("And then clicks on Bet Boost pebble", () => {
      beforeAll(async () => {
        await thirdPebblePO.element.waitForClickable();
        await thirdPebblePO.element.click();
        await browser.waitUntilContainsClass(thirdPebblePO.element, PebblePO.states.active);
      });

      it("[PRPI-4773] should show the Bet Boost pebble as selected", async () => {
        expect(await browser.containsClass(thirdPebblePO.element, PebblePO.states.active)).toBe(true);
      });

      it("[PRPI-4774] should not display the alert message", async () => {
        expect(await helpAlertPO.element.isDisplayed()).toBe(false);
      });

      it("[PRPI-4775] should display the summary message as 'You have 2 Bet Boost available'", async () => {
        expect(await extraWalletCardGroupOptionPO.title.getText()).toBe("You have 2 Bet Boost available");
      });

      it("[PRPI-4776] should display 2 Bet Boost wallets", async () => {
        expect(await extraWalletCardGroupPO.extraWalletCardItems.length).toBe(2);
      });

      it("[PRPI-4777] should display the first wallet with '10% Bet Boost' and the correct expiration date", async () => {
        expect(await firstExtraWalletCardOptionPO.title.getText()).toBe("10% Bet Boost");
        expect(await firstExtraWalletCardCountdownPO.element.getText()).toBe("3 hours left");
      });

      it("[PRPI-4778] should display the bonus URL with the label 'My Bonus Page' on the footer", async () => {
        expect(await generosityWalletPO.footerContent.getText()).toBe("My Bonus Page");
      });
    });

    describe("And then clicks on Second Chance pebble", () => {
      beforeAll(async () => {
        await fourthPebblePO.element.waitForClickable();
        await fourthPebblePO.element.click();
        await browser.waitUntilContainsClass(fourthPebblePO.element, PebblePO.states.active);
      });

      it("[PRPI-4767] should show the Second Chance pebble as selected", async () => {
        expect(await browser.containsClass(fourthPebblePO.element, PebblePO.states.active)).toBe(true);
      });

      it("[PRPI-4768] should not display the alert message", async () => {
        expect(await helpAlertPO.element.isDisplayed()).toBe(false);
      });

      it("[PRPI-4769] should display the summary message as 'You have 1 Second Chance available'", async () => {
        expect(await extraWalletCardGroupOptionPO.title.getText()).toBe("You have 1 Second Chance available");
      });

      it("[PRPI-4770] should display 1 Second Chance wallet", async () => {
        expect(await extraWalletCardGroupPO.extraWalletCardItems.length).toBe(1);
      });

      it("[PRPI-4771] should display the first wallet with 'Second Chance', the correct subtitle, expiration date and badge", async () => {
        expect(await firstExtraWalletCardOptionPO.title.getText()).toBe("Second Chance");
        expect(await firstExtraWalletCardOptionPO.subtitle.getText()).toBe(
          "If 1 leg lets you down, get up to $10.00 in Free Bets",
        );
        expect(await firstExtraWalletCardCountdownPO.element.getText()).toBe("4 days 1 hour left");
        expect(await firstExtraWalletCardInfoLabelPO.label.getText()).toBe("Acca");
      });

      it("[PRPI-4772] should display the bonus URL with the label 'My Bonus Page' on the footer", async () => {
        expect(await generosityWalletPO.footerContent.getText()).toBe("My Bonus Page");
      });
    });

    describe("And the user clicks on bonus URL", () => {
      beforeAll(async () => {
        await generosityWalletPO.footerContent.waitForClickable();
        await generosityWalletPO.footerContent.click();

        const newTabHandles = await browser.getWindowHandles();
        await browser.switchToWindow(newTabHandles[1]);
        await browser.waitUntilBrowserUrlContains("thisisabonuspageurl");
      });

      it("[PRPI-4779] should open a page with bonus information", async () => {
        expect(await browser.getUrl()).toContain("thisisabonuspageurl");
      });
    });

    describe("And the user switches to the 'All' pebble and clicks on help URL", () => {
      beforeAll(async () => {
        const newTabHandles = await browser.getWindowHandles();
        await browser.switchToWindow(newTabHandles[0]);

        await firstPebblePO.element.waitForClickable();
        await firstPebblePO.element.click();
        await browser.waitUntilContainsClass(firstPebblePO.element, PebblePO.states.active);

        await helpActionLinkPO.element.waitForClickable();
        await helpActionLinkPO.element.click();

        const updatedTabHandles = await browser.getWindowHandles();
        await browser.switchToWindow(updatedTabHandles[2]);

        await browser.waitUntilBrowserUrlContains("thisisahelpurl");
      });

      it("[PRPI-4780] should open a page with support information", async () => {
        expect(await browser.getUrl()).toContain("thisisahelpurl");
      });
    });
  });
});
