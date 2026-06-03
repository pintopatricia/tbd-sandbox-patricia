const { getAppContext, getGenericLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getWallets } = require("@flutter-global/uki-channels-http-clients/mock-index").WALLET;

const { startApp } = require("../../../../../../helpers/urls");
const MockService = require("../../../../../../mock-essentials/mocking-service");
const {
  AlertSO,
  HeaderSO,
  GenerosityWalletSO,
  PebbleListSO,
  ExtraWalletCardGroupSO,
  ExtraWalletCardSO,
  OptionSO,
  PebbleSO,
  ActionLinkSO,
  CountdownSO,
  InfoLabelSO,
} = require("../../../../../../screen-objects");

const mockService = new MockService(browser);
const headerSO = new HeaderSO();
const generosityWalletSO = new GenerosityWalletSO();
const generosityWalletBonusPageActionLinkSO = new ActionLinkSO(generosityWalletSO.footerContent);
const generosityWalletPebbleListSO = new PebbleListSO(generosityWalletSO.headerContent);
const firstPebbleSO = new PebbleSO(generosityWalletPebbleListSO.pebbleListElements[0]);
const secondPebbleSO = new PebbleSO(generosityWalletPebbleListSO.pebbleListElements[1]);
const thirdPebbleSO = new PebbleSO(generosityWalletPebbleListSO.pebbleListElements[2]);
const fourthPebbleSO = new PebbleSO(generosityWalletPebbleListSO.pebbleListElements[3]);
const extraWalletCardGroupSO = new ExtraWalletCardGroupSO();
const extraWalletCardGroupOptionSO = new OptionSO(extraWalletCardGroupSO.generosityAmount);
const helpAlertSO = new AlertSO(extraWalletCardGroupSO.helpUrlAlert);
const helpActionLinkSO = new ActionLinkSO(helpAlertSO.actionLinkText);
const firstExtraWalletCardSO = new ExtraWalletCardSO(extraWalletCardGroupSO.extraWalletCardItems[0]);
const firstExtraWalletCardOptionSO = new OptionSO(firstExtraWalletCardSO.walletOption);
const firstExtraWalletCardCountdownSO = new CountdownSO(firstExtraWalletCardSO.countdown);
const firstExtraWalletCardInfoLabelSO = new InfoLabelSO(firstExtraWalletCardSO.restrictionBadges[0]);
const secondExtraWalletCardSO = new ExtraWalletCardSO(extraWalletCardGroupSO.extraWalletCardItems[1]);
const secondExtraWalletCardOptionSO = new OptionSO(secondExtraWalletCardSO.walletOption);
const thirdExtraWalletCardSO = new ExtraWalletCardSO(extraWalletCardGroupSO.extraWalletCardItems[2]);
const thirdExtraWalletCardOptionSO = new OptionSO(thirdExtraWalletCardSO.walletOption);
const fifthExtraWalletCardSO = new ExtraWalletCardSO(extraWalletCardGroupSO.extraWalletCardItems[4]);
const fifthExtraWalletCardOptionSO = new OptionSO(fifthExtraWalletCardSO.walletOption);

const hasWebviewContext = async () => {
  const contexts = await driver.getContexts();
  return contexts.some((context) => context.includes("WEBVIEW"));
};

const isBottomSheetHidden = async () => {
  const isVisible = await generosityWalletSO.element.isDisplayed().catch(() => false);
  return !isVisible;
};

const verifyExternalPageOpened = async () => {
  await browser.waitUntil(async () => (await hasWebviewContext()) || (await isBottomSheetHidden()), {
    timeout: 5000,
    timeoutMsg: "External page did not open within timeout",
  });

  return (await hasWebviewContext()) || (await isBottomSheetHidden());
};

const switchToNativeContext = async () => {
  const contexts = await driver.getContexts();
  const nativeContext = contexts.find((context) => context.includes("NATIVE"));

  if (!nativeContext) {
    return;
  }

  const currentContext = await driver.getContext();
  if (currentContext !== nativeContext) {
    await driver.switchContext(nativeContext);
  }
};

const closeExternalPageAndRestoreBottomSheet = async () => {
  await switchToNativeContext();
  await driver.pressKeyCode(4);

  const isBottomSheetVisible = await browser
    .waitUntil(async () => generosityWalletSO.element.isDisplayed().catch(() => false), {
      timeout: 3000,
      interval: 500,
    })
    .catch(() => false);

  if (!isBottomSheetVisible) {
    await browser.waitUntilClickableNative(headerSO.generosityWalletButton);
    await headerSO.generosityWalletButton.click();
    await browser.waitUntilDisplayed(generosityWalletSO.element);
  }
};

const BFF_HOME_VIEW_MOCK = {
  urn: "ppb:tbd:view:generic:home",
};

const WALLETS = [
  { id: 1, amount: 2.0, badges: [], walletType: "BONUS_CASH", restrictions: null },
  { id: 2, amount: 3.0, badges: [], walletType: "BONUS_CASH", restrictions: null },
  { id: 3, amount: 10.0, badges: [], walletType: "PRICE_BOOST_TOKEN", restrictions: null },
  { id: 5, amount: 10.0, badges: [], walletType: "PRICE_BOOST_TOKEN", restrictions: null },
  {
    id: 4,
    amount: 0,
    lostLegs: 1,
    maxReturn: 10,
    badges: [],
    walletType: "ACCA_INSURANCE_TOKEN",
    restrictions: { single: false, acca: true, sameGameMulti: false },
  },
];

const getExpirationDates = () => {
  const nowDate = new Date(Date.now());

  const firstExpirationDate = new Date(nowDate);
  firstExpirationDate.setSeconds(firstExpirationDate.getSeconds() + 50);

  const secondExpirationDate = new Date(nowDate);
  secondExpirationDate.setMinutes(secondExpirationDate.getMinutes() + 108);

  const thirdExpirationDate = new Date(nowDate);
  thirdExpirationDate.setHours(thirdExpirationDate.getHours() + 3, thirdExpirationDate.getMinutes() + 48);

  const fourthExpirationDate = undefined;

  const fifthExpirationDate = new Date(nowDate);
  fifthExpirationDate.setDate(fifthExpirationDate.getDate() + 4);
  fifthExpirationDate.setMinutes(fifthExpirationDate.getMinutes() + 5);

  return [firstExpirationDate, secondExpirationDate, thirdExpirationDate, fourthExpirationDate, fifthExpirationDate];
};

const getExtraWalletCardGroupBFFMock = (walletsWithExpirationDate) => ({
  cards: [
    {
      __typename: "ExtraWalletCardGroup",
      urn: "ppb:tbd:cardgroup:extraWalletCardGroup:extraWallets",
      amount: 5.0,
      helpUrl: "thisisahelpurl",
      bonusPageUrl: "thisisabonuspageurl",
      full: {
        edges: walletsWithExpirationDate.map(
          ({ id, amount, expirationDate, badges, walletType, restrictions, lostLegs, maxReturn }) => ({
            node: {
              __typename: "ExtraWalletCard",
              urn: `ppb:tbd:card:extraWalletCard:${id}`,
              badges,
              extraWallet: {
                __typename: "ExtraWallet",
                urn: `ppb:extraWallet:${id}`,
                walletId: `${id}`,
                indexedId: `${id}`,
                amount,
                ...(lostLegs !== undefined && { lostLegs }),
                ...(maxReturn !== undefined && { maxReturn }),
                expirationDate,
                walletType,
              },
              ...(restrictions && {
                restrictions: {
                  __typename: "WalletRestrictions",
                  ...restrictions,
                },
              }),
            },
            __typename: "ExtraWalletCardGroupEdge",
          }),
        ),
        __typename: "ExtraWalletCardGroupConnection",
      },
    },
  ],
});

const BFF_FETCH_CARDS_MOCK = getExtraWalletCardGroupBFFMock(WALLETS);

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

describe("Sportsbook Generosity Wallet - Header Bottom Sheet", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      getAppContext({
        throttles: {
          FREE_BETS_WALLET: {
            isActive: true,
          },
        },
        userdetails: {
          timezone: "Europe/London",
          localeCodeBcp47: "en-US",
        },
      }),
    );

    await mockService.mockHttpRequest(getGenericLayout(BFF_HOME_VIEW_MOCK));
    await mockService.mockHttpRequest(getCardResults(BFF_FETCH_CARDS_MOCK));
    await startApp("home");
    await browser.waitUntilClickableNative(headerSO.balance);
  });

  describe("When the user has only one type of token with no help URL", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(
        getWallets([
          { amount: "5.00", walletName: "MAIN" },
          { amount: "2.00", walletName: "BOOST_TOKENS" },
        ]),
      );

      await mockService.mockHttpRequest(getCardResults(BFF_FETCH_CARDS_MOCK_ONE_TOKEN_TYPE));

      await browser.waitUntilClickableNative(headerSO.generosityWalletButton);
      await headerSO.generosityWalletButton.click();
      await browser.waitUntilDisplayed(generosityWalletSO.element);
    });

    it("[PRPI-4738] should display the generosity wallet bottom sheet", async () => {
      expect(await generosityWalletSO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-4739] should display the generosity wallet bottom sheet title as 'Your Bonuses'", async () => {
      expect(await generosityWalletSO.headerTitle.getText()).toBe("Your Bonuses");
    });

    it("[PRPI-4740] should not display the generosity wallet pebble list", async () => {
      expect(await generosityWalletPebbleListSO.element.isDisplayed()).toBe(false);
    });

    it("[PRPI-4741] should not display the help alert message", async () => {
      expect(await helpAlertSO.element.isDisplayed()).toBe(false);
    });

    it("[PRPI-4742] should display the summary message", async () => {
      expect(await extraWalletCardGroupOptionSO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-4743] should display 2 wallets", async () => {
      expect(await extraWalletCardGroupSO.extraWalletCardItems.length).toBe(2);
    });

    it("[PRPI-4744] should display the first wallet with 10% Bet Boost", async () => {
      expect(await firstExtraWalletCardOptionSO.title.getText()).toBe("10% Bet Boost");
    });

    it("[PRPI-4745] should display the second wallet with 20% Bet Boost", async () => {
      expect(await secondExtraWalletCardOptionSO.title.getText()).toBe("20% Bet Boost");
    });

    it("[PRPI-4746] should display the bonus URL with the label 'My Bonus Page' on the footer", async () => {
      expect(await generosityWalletSO.footerContent.isDisplayed()).toBe(true);
      expect(await generosityWalletBonusPageActionLinkSO.text.getText()).toBe("My Bonus Page");
    });

    describe("And the user clicks outside the bottom sheet", () => {
      beforeAll(async () => {
        const { width, height } = await driver.getWindowRect();
        await driver.touchAction([{ action: "tap", x: width / 2, y: height * 0.1 }]);
        await browser.waitUntilNotDisplayed(generosityWalletSO.element);
      });

      it("[PRPI-4747] should close the generosity wallet", async () => {
        expect(await generosityWalletSO.element.isDisplayed()).toBe(false);
      });
    });
  });

  describe("When the user has Free Bets wallets, Acca Insurance and Boost tokens and clicks on header", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(
        getWallets([
          { amount: "5.00", walletName: "MAIN" },
          { amount: "5.00", walletName: "SPORTSBOOK_BONUS" },
          { amount: "2.00", walletName: "BOOST_TOKENS" },
          { amount: "1.00", walletName: "ACCA_INSURANCE_TOKENS" },
        ]),
      );

      const expirationDates = getExpirationDates();
      const walletsWithExpirationDate = WALLETS.map((wallet, index) => ({
        ...wallet,
        expirationDate: expirationDates[index],
      }));
      await mockService.mockHttpRequest(getCardResults(getExtraWalletCardGroupBFFMock(walletsWithExpirationDate)));

      await browser.waitUntilClickableNative(headerSO.generosityWalletButton);
      await headerSO.generosityWalletButton.click();

      await browser.waitUntilDisplayed(generosityWalletSO.element, "Bottom sheet not displayed");
    });

    it("[PRPI-4748] should display the generosity wallet bottom sheet", async () => {
      expect(await generosityWalletSO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-4749] should display the generosity wallet bottom sheet title as 'Your Bonuses'", async () => {
      expect(await generosityWalletSO.headerTitle.getText()).toBe("Your Bonuses");
    });

    it("[PRPI-4750] should display the generosity wallet pebble list", async () => {
      expect(await generosityWalletPebbleListSO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-4751] should display the pebbles in the following order: All, Free Bets, Second Chance and Bet Boost", async () => {
      expect(await firstPebbleSO.title.getText()).toEqual("All");
      expect(await secondPebbleSO.title.getText()).toBe("Free Bets");
      expect(await thirdPebbleSO.title.getText()).toBe("Bet Boost");
      expect(await fourthPebbleSO.title.getText()).toBe("Second Chance");
    });

    it("[PRPI-4752] should display the All pebble as selected and all the others unselected", async () => {
      expect(await firstPebbleSO.element.getAttribute("selected")).toBe("true");
      expect(await secondPebbleSO.element.getAttribute("selected")).toBe("false");
      expect(await thirdPebbleSO.element.getAttribute("selected")).toBe("false");
      expect(await fourthPebbleSO.element.getAttribute("selected")).toBe("false");
    });

    it("[PRPI-4753] should display the help alert message as 'Bonuses are applied in the Betslip'", async () => {
      expect(await helpAlertSO.message.getText()).toBe("Bonuses are applied in the Betslip");
    });

    it("[PRPI-4754] should display the help dismiss label as 'Help'", async () => {
      expect(await helpActionLinkSO.element.getText()).toBe("Help");
    });

    it("[PRPI-4755] should not display the summary message", async () => {
      expect(await extraWalletCardGroupOptionSO.element.isDisplayed()).toBe(false);
    });

    it("[PRPI-4756] should display 5 wallets", async () => {
      expect(await extraWalletCardGroupSO.extraWalletCardItems.length).toBe(5);
    });

    it("[PRPI-4757] should display the first wallet with $2.00 Free Bet", async () => {
      expect(await firstExtraWalletCardOptionSO.title.getText()).toBe("$2.00 Free Bet");
    });

    it("[PRPI-4758] should display the third wallet with 10% Bet Boost", async () => {
      expect(await thirdExtraWalletCardOptionSO.title.getText()).toBe("10% Bet Boost");
    });

    it("[PRPI-4759] should display the fifth wallet with Second Chance", async () => {
      expect(await fifthExtraWalletCardOptionSO.title.getText()).toBe("Second Chance");
    });

    it("[PRPI-4760] should display the bonus URL with the label 'My Bonus Page' on the footer", async () => {
      expect(await generosityWalletSO.footerContent.isDisplayed()).toBe(true);
      expect(await generosityWalletBonusPageActionLinkSO.text.getText()).toBe("My Bonus Page");
    });

    describe("And then clicks on Free Bets pebble", () => {
      beforeAll(async () => {
        await browser.waitUntilClickableNative(secondPebbleSO.element);
        await secondPebbleSO.element.click();

        await browser.waitUntil(async () => (await secondPebbleSO.element.getAttribute("selected")) === "true");
        await browser.waitUntil(async () => (await extraWalletCardGroupSO.extraWalletCardItems.length) === 2);
      });

      it("[PRPI-4761] should show the Free Bets pebble as selected", async () => {
        expect(await secondPebbleSO.element.getAttribute("selected")).toBe("true");
        expect(await extraWalletCardGroupSO.extraWalletCardItems.length).toBe(2);
      });

      it("[PRPI-4762] should not display the alert message", async () => {
        expect(await helpAlertSO.element.isDisplayed()).toBe(false);
      });

      it("[PRPI-4763] should display the summary message as 'You have $5.00 in Free Bets'", async () => {
        expect(await extraWalletCardGroupOptionSO.title.getText()).toBe("You have $5.00 in Free Bets");
      });

      it("[PRPI-4764] should display 2 free bet wallets", async () => {
        expect(await extraWalletCardGroupSO.extraWalletCardItems.length).toBe(2);
      });

      it("[PRPI-4765] should display the first wallet with $2.00 Free Bet and the correct expiration date", async () => {
        expect(await firstExtraWalletCardOptionSO.title.getText()).toBe("$2.00 Free Bet");
        expect(await firstExtraWalletCardCountdownSO.element.getText()).toBe("1 min left");
      });

      it("[PRPI-4766] should display the bonus URL with the label 'My Bonus Page' on the footer", async () => {
        expect(await generosityWalletSO.footerContent.isDisplayed()).toBe(true);
        expect(await generosityWalletBonusPageActionLinkSO.text.getText()).toBe("My Bonus Page");
      });
    });

    describe("And then clicks on Bet Boost pebble", () => {
      beforeAll(async () => {
        await browser.waitUntilClickableNative(thirdPebbleSO.element);
        await thirdPebbleSO.element.click();

        await browser.waitUntil(async () => (await thirdPebbleSO.element.getAttribute("selected")) === "true");
        await browser.waitUntil(async () => (await extraWalletCardGroupSO.extraWalletCardItems.length) === 2);
        await browser.waitUntilNotDisplayed(helpAlertSO.element);
      });

      it("[PRPI-4773] should show the Bet Boost pebble as selected", async () => {
        expect(await thirdPebbleSO.element.getAttribute("selected")).toBe("true");
        expect(await extraWalletCardGroupSO.extraWalletCardItems.length).toBe(2);
      });

      it("[PRPI-4774] should not display the alert message", async () => {
        expect(await helpAlertSO.element.isDisplayed()).toBe(false);
      });

      it("[PRPI-4775] should display the summary message as 'You have 2 Bet Boost available'", async () => {
        expect(await extraWalletCardGroupOptionSO.title.getText()).toBe("You have 2 Bet Boost available");
      });

      it("[PRPI-4776] should display 2 Bet Boost wallets", async () => {
        expect(await extraWalletCardGroupSO.extraWalletCardItems.length).toBe(2);
      });

      it("[PRPI-4777] should display the first wallet with '10% Bet Boost' and the correct expiration date", async () => {
        expect(await firstExtraWalletCardOptionSO.title.getText()).toBe("10% Bet Boost");
        expect(await firstExtraWalletCardCountdownSO.element.getText()).toBe("3 hours left");
      });

      it("[PRPI-4778] should display the bonus URL with the label 'My Bonus Page' on the footer", async () => {
        expect(await generosityWalletSO.footerContent.isDisplayed()).toBe(true);
        expect(await generosityWalletBonusPageActionLinkSO.text.getText()).toBe("My Bonus Page");
      });
    });

    describe("And then clicks on Second Chance pebble", () => {
      beforeAll(async () => {
        await browser.waitUntilClickableNative(fourthPebbleSO.element);
        await fourthPebbleSO.element.click();

        await browser.waitUntil(async () => (await fourthPebbleSO.element.getAttribute("selected")) === "true");
        await browser.waitUntil(async () => (await extraWalletCardGroupSO.extraWalletCardItems.length) === 1);
        await browser.waitUntilNotDisplayed(helpAlertSO.element);
      });

      it("[PRPI-4767] should show the Second Chance pebble as selected", async () => {
        expect(await fourthPebbleSO.element.getAttribute("selected")).toBe("true");
        expect(await extraWalletCardGroupSO.extraWalletCardItems.length).toBe(1);
      });

      it("[PRPI-4768] should not display the alert message", async () => {
        expect(await helpAlertSO.element.isDisplayed()).toBe(false);
      });

      it("[PRPI-4769] should display the summary message as 'You have 1 Second Chance available'", async () => {
        expect(await extraWalletCardGroupOptionSO.title.getText()).toBe("You have 1 Second Chance available");
      });

      it("[PRPI-4770] should display 1 Second Chance wallet", async () => {
        expect(await extraWalletCardGroupSO.extraWalletCardItems.length).toBe(1);
      });

      it("[PRPI-4771] should display the first wallet with 'Second Chance', the correct subtitle, expiration date and badge", async () => {
        expect(await firstExtraWalletCardOptionSO.title.getText()).toBe("Second Chance");
        expect(await firstExtraWalletCardOptionSO.subtitle.getText()).toBe(
          "If 1 leg lets you down, get up to $10.00 in Free Bets",
        );
        expect(await firstExtraWalletCardCountdownSO.element.getText()).toBe("4 days left");
        expect(await firstExtraWalletCardInfoLabelSO.label.getText()).toBe("Acca");
      });

      it("[PRPI-4772] should display the bonus URL with the label 'My Bonus Page' on the footer", async () => {
        expect(await generosityWalletSO.footerContent.isDisplayed()).toBe(true);
        expect(await generosityWalletBonusPageActionLinkSO.text.getText()).toBe("My Bonus Page");
      });
    });

    describe("And the user clicks on bonus URL", () => {
      beforeAll(async () => {
        await browser.waitUntilClickableNative(generosityWalletSO.footerContent);
        await generosityWalletSO.footerContent.click();
      });

      it("[PRPI-4779] should open a page with bonus information", async () => {
        const pageOpened = await verifyExternalPageOpened();
        expect(pageOpened).toBe(true);
      });

      afterAll(async () => {
        await closeExternalPageAndRestoreBottomSheet();
      });
    });

    describe("And the user switches to the 'All' pebble and clicks on help URL", () => {
      beforeAll(async () => {
        await switchToNativeContext();

        await browser.waitUntilClickableNative(firstPebbleSO.element);
        await firstPebbleSO.element.click();

        await browser.waitUntilDisplayed(helpActionLinkSO.element);
        await browser.waitUntilClickableNative(helpActionLinkSO.element);
        await helpActionLinkSO.element.click();
      });

      it("[PRPI-4780] should open a page with support information", async () => {
        const pageOpened = await verifyExternalPageOpened();
        expect(pageOpened).toBe(true);
      });

      // afterAll(async () => {
      //   await closeExternalPageAndRestoreBottomSheet();
      // });
    });
  });
});
