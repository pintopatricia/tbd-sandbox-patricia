const {
  getAppContext,
  getSettingsPageLayout,
  getUpdatedPreference,
  getMyAccountLayout,
  getHomeLayoutWithViewLink,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const NavigationTabsListSO = require("@ppb/tbd-shared/components/NavigationTabsList/NavigationTabsList.so");

const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");
const {
  TooltipSO,
  SwitchOptionSO,
  SwitchSO,
  RadioListSO,
  RadioButtonSO,
  PreferenceCardSO,
} = require("../../../../screen-objects");

const mockService = new MockService();

const navigationTabsListPO = new NavigationTabsListSO();
const preferenceSO = new PreferenceCardSO(navigationTabsListPO.element);

const excPreferenceCardSO = new PreferenceCardSO(preferenceSO.preferencesCard[0]);
const productPreferenceCardSO = new PreferenceCardSO(preferenceSO.preferencesCard[1]);

const toolTipSO = new TooltipSO(excPreferenceCardSO.element);
const switchOptionSO = new SwitchOptionSO(excPreferenceCardSO.element);
const switchSO = new SwitchSO(switchOptionSO.element);

const radioListSO = new RadioListSO(productPreferenceCardSO.element);
const sportsbookRadioButtonSO = new RadioButtonSO(radioListSO.radioButtons[1]);
const exchangeRadioButtonSO = new RadioButtonSO(radioListSO.radioButtons[2]);

const USR_PRF_MOCK = {
  urn: "ppb:tbd:view:myAccountView:aHR0cHM6Ly93d3cucWEuY29tLmJldGZhaXIvYmV0dGluZy9iZXR0aW5nL3NldHRpbmdzOnNldHRpbmdzP3Byb2Q9OTAmd2lkdGg9MzIwcHgmc2hvd0hlYWRlcj0w",
  url: "/navigation/myAccountView:aHR0cHM6Ly93d3cucWEuY29tLmJldGZhaXIvYmV0dGluZy9iZXR0aW5nL3NldHRpbmdzOnNldHRpbmdzP3Byb2Q9OTAmd2lkdGg9MzIwcHgmc2hvd0hlYWRlcj0w",
  items: {
    edges: [
      {
        node: {
          __typename: "LinksCard",
          urn: "ppb:tbd:card:links:myaccount#menuSection",
          section: [
            {
              __typename: "LinksMenuSections",
              title: "Account Details",
              sectionType: "GENERIC",
              items: [
                {
                  __typename: "RegulatoryLinkItem",
                  url: "https://www.betfair.com/betting/betting/settings:settings?prod=90&width=320px&showHeader=0",
                  text: "Settings & Details",
                  target: "_self",
                  alignment: "LEFT",
                },
              ],
            },
          ],
        },
      },
    ],
  },
};
const SETTINGS_PAGE_MOCK = {
  __typename: "SettingsView",
  urn: "ppb:tbd:view:settings:settings",
  url: "settings/settings:settings",
  settings: [
    {
      text: "Personal",
      url: "https://myaccount.betfair.com/myaccountx/personaldetails",
    },
    {
      text: "Notifications",
      url: "https://myaccount.betfair.com/myaccountx/notifications",
    },
  ],

  edges: [
    {
      node: {
        __typename: "NavigationTabsList",
        urn: "ppb:tbd:card:staticNavigationTabsList:Settings",
        tabsTitle: "Settings",
        full: {
          edges: [
            {
              node: {
                __typename: "NavigationTab",
                urn: "ppb:tbd:view:staticNavigationTab:SettingsViewBettingPreferences",
                tabTitle: {
                  translate: {
                    key: "Betting",
                  },
                },
                full: {
                  edges: [
                    {
                      node: {
                        __typename: "PreferenceSingleChoiceCard",
                        urn: "ppb:tbd:card:preference:singleChoice:exchangeDefaultProduct",
                        title: "I18N.PREFERENCES.EXCHANGE_DEFAULT_PRODUCT.TITLE",
                        description: "I18N.PREFERENCES.EXCHANGE_DEFAULT_PRODUCT.DESCRIPTION",
                        preference: {
                          __typename: "PreferenceSingleChoice",
                          urn: "ppb:tbd:preference:singleChoice:exchangeDefaultProduct",
                          preferenceKey: "exchangeDefaultProduct",
                          preferenceValues: [
                            {
                              value: "ems",
                              translationKey: "ems",
                            },
                            {
                              value: "neme",
                              translationKey: "neme",
                            },
                          ],

                          selectedValueIndex: 0,
                        },
                      },
                    },
                    {
                      node: {
                        __typename: "PreferenceSingleChoiceCard",
                        urn: "ppb:tbd:card:preference:singleChoice:defaultProduct",
                        title: "I18N.PREFERENCES.DEFAULT_PRODUCT.TITLE",
                        description: "I18N.PREFERENCES.DEFAULT_PRODUCT.DESCRIPTION",
                        preference: {
                          __typename: "PreferenceSingleChoice",
                          urn: "ppb:tbd:preference:singleChoice:defaultProduct",
                          preferenceKey: "defaultProduct",
                          preferenceValues: [
                            {
                              value: "last_viewed",
                              translationKey: "I18N.PREFERENCES.DEFAULT_PRODUCT.LAST_VIEWED",
                            },
                            {
                              value: "sportsbook",
                              translationKey: "I18N.PREFERENCES.DEFAULT_PRODUCT.SPORTSBOOK",
                            },
                            {
                              value: "exchange",
                              translationKey: "I18N.PREFERENCES.DEFAULT_PRODUCT.EXCHANGE",
                            },
                          ],

                          selectedValueIndex: 1,
                        },
                      },
                    },
                  ],
                },
                partials: {
                  partialEdges: [
                    {
                      node: {
                        __typename: "PreferenceSingleChoiceCard",
                        urn: "ppb:tbd:card:preference:singleChoice:exchangeDefaultProduct",
                      },
                    },
                    {
                      node: {
                        __typename: "PreferenceSingleChoiceCard",
                        urn: "ppb:tbd:card:preference:singleChoice:defaultProduct",
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              node: {
                __typename: "NavigationTab",
                urn: "ppb:tbd:view:staticNavigationTab:SettingsViewBettingPreferences",
                tabTitle: {
                  translate: {
                    key: "Betting",
                  },
                },
              },
            },
          ],
        },
      },
    },
  ],

  pageInfo: null,
};

const EXC_DEFAULT_PRODUCT_NEME_MOCK = {
  urn: "ppb:tbd:preference:exchangeDefaultProduct:ExchangeDefaultProduct",
  data: {
    setPreferences: {
      result: [
        {
          __typename: "ExchangeDefaultProductPreference",
          selectedExchangeDefaultProduct: "NEME",
        },
      ],

      error: [],
    },
  },
};

const EXC_DEFAULT_PRODUCT_EMS_MOCK = {
  urn: "ppb:tbd:preference:exchangeDefaultProduct:ExchangeDefaultProduct",
  data: {
    setPreferences: {
      result: [
        {
          __typename: "ExchangeDefaultProductPreference",
          selectedExchangeDefaultProduct: "EMS",
        },
      ],

      error: [],
    },
  },
};

const DEFAULT_PRODUCT_EXCHANGE_MOCK = {
  urn: "ppb:tbd:preference:defaultProduct:DefaultProduct",
  data: {
    setPreferences: {
      result: [
        {
          __typename: "DefaultProductPreference",
          selectedDefaultProduct: "EXCHANGE",
        },
      ],

      error: [],
    },
  },
};

describe("Settings Page - Exchange Default Product", () => {
  describe("when navigating to settings > betting > content preferences", () => {
    describe("and the EXC_ALLOWED_JURISDICTION throttle is ON", () => {
      describe("and the user is logged in", () => {
        describe("and is NOT exchange eligible", () => {
          describe("and the account creation date is >= 31 December 2026", () => {
            beforeAll(async () => {
              await mockService.mockHttpRequest(
                getAppContext({
                  throttles: { EXC_ALLOWED_JURISDICTION: { isActive: true } },
                  phoenixMigratedUser: false,
                  accountOpenDate: "2026-12-31T00:00:00.000Z",
                }),
              );
              await mockService.mockHttpRequest(getMyAccountLayout(USR_PRF_MOCK));
              await mockService.mockHttpRequest(getSettingsPageLayout(SETTINGS_PAGE_MOCK));

              const HOME_VIEW_LINK = getStartViewLink("bfe://view/settings-settings");
              await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

              await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK, dismissOnboarding: true });
              await browser.waitUntilDisplayed(
                excPreferenceCardSO.element,
                "exchange preference card element not displayed",
              );
            });

            fit("[PRPI-3087] only one preferences card should be displayed", async () => {
              expect(await preferenceSO.preferencesCard.length).toBe(1);
            });

            it("[PRPI-3088] the header should display the content preferences title", async () => {
              expect(await excPreferenceCardSO.title.getText()).toBe("Content Preferences");
            });

            it("[PRPI-3089] the tooltip should be displayed", async () => {
              expect(await toolTipSO.element.isDisplayed()).toBe(true);
            });

            it("[PRPI-3090] the NEME switch should be displayed", async () => {
              expect(await switchOptionSO.element.isDisplayed()).toBe(true);
              expect(await switchOptionSO.switchOptionLabel.getText()).toBe("Try the New Exchange Experience");
            });

            describe("and when toggling the NEME switch ON", () => {
              beforeAll(async () => {
                await mockService.mockHttpRequest(
                  getUpdatedPreference(EXC_DEFAULT_PRODUCT_NEME_MOCK, "SetExchangeDefaultProductPreferenceMutation"),
                );
                await browser.waitUntilDisplayed(switchSO.element);
                await switchSO.switchBall.click();

                await browser.waitUntil(async () => (await preferenceSO.preferencesCard.length) === 2);
                await browser.waitUntilEquals(
                  productPreferenceCardSO.hint,
                  "Decide which content you see first on Betfair.",
                );
              });

              it("[PRPI-3092] the product preference options should be displayed", async () => {
                expect(await radioListSO.itemText[0].getText()).toEqual("Last viewed");
                expect(await radioListSO.itemText[1].getText()).toEqual("Sportsbook");
                expect(await radioListSO.itemText[2].getText()).toEqual("Exchange");
              });

              it("[PRPI-3753] the sportsbook product preference should be selected", async () => {
                expect(await sportsbookRadioButtonSO.checked.isDisplayed()).toBe(true);
                expect(await exchangeRadioButtonSO.unchecked.isDisplayed()).toBe(true);
              });

              describe("and when selecting the exchange product preference", () => {
                beforeAll(async () => {
                  await mockService.mockHttpRequest(
                    getUpdatedPreference(DEFAULT_PRODUCT_EXCHANGE_MOCK, "SetDefaultProductPreferenceMutation"),
                  );
                  await radioListSO.item[2].click();

                  await browser.waitUntilDisplayed(exchangeRadioButtonSO.checked);
                });

                it("[PRPI-3755] the exchange product preference should be selected", async () => {
                  expect(await sportsbookRadioButtonSO.unchecked.isDisplayed()).toBe(true);
                  expect(await exchangeRadioButtonSO.checked.isDisplayed()).toBe(true);
                });

                describe("and when toggling the NEME switch back OFF", () => {
                  beforeAll(async () => {
                    await mockService.mockHttpRequest(
                      getUpdatedPreference(EXC_DEFAULT_PRODUCT_EMS_MOCK, "SetExchangeDefaultProductPreferenceMutation"),
                    );
                    await browser.waitUntilDisplayed(switchSO.element);
                    await switchSO.switchBall.click();
                  });

                  it("[PRPI-3093] the product preferences should no longer be displayed", async () => {
                    await browser.waitUntil(async () => (await preferenceSO.preferencesCard.length) === 1);
                  });
                });
              });
            });
          });

          describe("and the account creation date is < 31 December 2026", () => {
            beforeAll(async () => {
              await mockService.mockHttpRequest(
                getAppContext({
                  throttles: { EXC_ALLOWED_JURISDICTION: { isActive: true } },
                  phoenixMigratedUser: false,
                  accountOpenDate: "2026-12-30T00:00:00.000Z",
                }),
              );
              await mockService.mockHttpRequest(getMyAccountLayout(USR_PRF_MOCK));
              await mockService.mockHttpRequest(getSettingsPageLayout(SETTINGS_PAGE_MOCK));

              const HOME_VIEW_LINK = getStartViewLink("bfe://view/settings-settings");
              await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

              await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK, dismissOnboarding: true });
            });

            it("[PRPI-12642] the content preferences should not be displayed", async () => {
              expect(await productPreferenceCardSO.element.isDisplayed()).toBe(false);
            });
          });
        });
      });
    });

    describe("and the EXC_ALLOWED_JURISDICTION throttle is OFF", () => {
      describe("and the user is logged in", () => {
        describe("and is NOT exchange eligible", () => {
          describe("and the account creation date is >= 31 December 2026", () => {
            beforeAll(async () => {
              await mockService.mockHttpRequest(
                getAppContext({
                  throttles: { EXC_ALLOWED_JURISDICTION: { isActive: false } },
                  phoenixMigratedUser: false,
                  accountOpenDate: "2026-12-31T00:00:00.000Z",
                }),
              );
              await mockService.mockHttpRequest(getMyAccountLayout(USR_PRF_MOCK));
              await mockService.mockHttpRequest(getSettingsPageLayout(SETTINGS_PAGE_MOCK));

              const HOME_VIEW_LINK = getStartViewLink("bfe://view/settings-settings");
              await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

              await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK, dismissOnboarding: true });
            });

            it("[PRPI-12643] the content preferences should not be displayed", async () => {
              expect(await productPreferenceCardSO.element.isDisplayed()).toBe(false);
            });
          });
        });
      });
    });
  });
});
