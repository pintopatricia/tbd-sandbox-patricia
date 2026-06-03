const { SwitchOptionPO, TooltipPO, SwitchPO } = require("../../../../../page-objects");
const PreferenceSingleChoiceCardPO = require("@ppb/tbd-shared/components/PreferenceSingleChoiceCard/PreferenceSingleChoiceCard.po");
const {
  getSettingsPageLayout,
  getUpdatedPreference,
  getMyAccountLayout,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const NavigationTabsListPO = require("@ppb/tbd-shared/components/NavigationTabsList/NavigationTabsList.po");

const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const mockService = new MockService(browser);

const navigationTabsListPO = new NavigationTabsListPO();

const excPreferenceSingleChoiceCardSO = new PreferenceSingleChoiceCardPO(navigationTabsListPO.tabItems[0]);
const productPreferenceSingleChoiceCardSO = new PreferenceSingleChoiceCardPO(navigationTabsListPO.tabItems[1]);

const switchOptionPO = new SwitchOptionPO(excPreferenceSingleChoiceCardSO.element);
const switchPO = new SwitchPO(switchOptionPO.element);
const tooltipPO = new TooltipPO(excPreferenceSingleChoiceCardSO.element);

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
                              translationKey: "Last Viewed",
                            },
                            {
                              value: "sportsbook",
                              translationKey: "Sportsbook",
                            },
                            {
                              value: "exchange",
                              translationKey: "Exchange",
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
                await getIndexHTML(USR_PRF_MOCK.urn, {
                  EXC_ALLOWED_JURISDICTION: { isActive: true },
                  phoenixMigratedUser: false,
                  accountOpenDate: "2026-12-31T00:00:00.000Z",
                  loggedIn: "true",
                }),
              );
              await mockService.mockHttpRequest(getMyAccountLayout(USR_PRF_MOCK));
              await mockService.mockHttpRequest(getSettingsPageLayout(SETTINGS_PAGE_MOCK));

              await browser.url(routes.getMyAccountViewUrl());

              await browser.waitUntilDisplayed(excPreferenceSingleChoiceCardSO.element);
            });

            it("[PRPI-6697] the header should display the content preferences title", async () => {
              expect(await excPreferenceSingleChoiceCardSO.headerTitle.getText()).toBe("Content Preferences");
            });

            it("[PRPI-6698] the tooltip should be displayed", async () => {
              expect(await tooltipPO.element.isDisplayed()).toBe(true);
            });

            it("[PRPI-6699] the NEME switch should be displayed and OFF", async () => {
              expect(await switchOptionPO.label.getText()).toBe("Try the New Exchange Experience");
              expect(await switchPO.checkbox.isSelected()).toBe(false);
            });

            it("[PRPI-6701] the product preferences should not be displayed", async () => {
              expect(await productPreferenceSingleChoiceCardSO.element.isDisplayed()).toBe(false);
            });

            describe("and when toggling the NEME switch ON", () => {
              beforeAll(async () => {
                await mockService.mockHttpRequest(
                  getUpdatedPreference(EXC_DEFAULT_PRODUCT_NEME_MOCK, "SetExchangeDefaultProductPreferenceMutation"),
                );

                await switchPO.switch.click();
                const timeout = 1000;
                await browser.waitUntil(() => switchPO.checkbox.isSelected(), {
                  timeout,
                  timeoutMsg: `Switch checkbox didn't update in ${timeout}ms`,
                });

                await browser.waitUntilDisplayed(productPreferenceSingleChoiceCardSO.element);
              });

              it("[PRPI-6702] the product preference hint should be displayed", async () => {
                expect(await productPreferenceSingleChoiceCardSO.optionHint.getText()).toBe(
                  "Decide which content you see first on Betfair.",
                );
              });

              it("[PRPI-6703] the product preference options should be displayed", async () => {
                expect(await productPreferenceSingleChoiceCardSO.listItem[0].getText()).toBe("Last Viewed");
                expect(await productPreferenceSingleChoiceCardSO.listItem[1].getText()).toBe("Sportsbook");
                expect(await productPreferenceSingleChoiceCardSO.listItem[2].getText()).toBe("Exchange");
              });

              it("[PRPI-6704] the sportsbook product preference should be selected", async () => {
                expect(await productPreferenceSingleChoiceCardSO.listItemInputOption[0].isSelected()).toBe(false);
                expect(await productPreferenceSingleChoiceCardSO.listItemInputOption[1].isSelected()).toBe(true);
                expect(await productPreferenceSingleChoiceCardSO.listItemInputOption[2].isSelected()).toBe(false);
              });

              describe("and when selecting the exchange product preference", () => {
                beforeAll(async () => {
                  await mockService.mockHttpRequest(
                    getUpdatedPreference(DEFAULT_PRODUCT_EXCHANGE_MOCK, "SetDefaultProductPreferenceMutation"),
                  );

                  await productPreferenceSingleChoiceCardSO.listItemInputOption[2].click();
                  const timeout = 1000;
                  await browser.waitUntil(
                    () => productPreferenceSingleChoiceCardSO.listItemInputOption[2].isSelected(),
                    {
                      timeout,
                      timeoutMsg: `Product selection didn't update in ${timeout}ms`,
                    },
                  );
                });

                it("[PRPI-6705] the exchange product preference should be selected", async () => {
                  expect(await productPreferenceSingleChoiceCardSO.listItemInputOption[0].isSelected()).toBe(false);
                  expect(await productPreferenceSingleChoiceCardSO.listItemInputOption[1].isSelected()).toBe(false);
                  expect(await productPreferenceSingleChoiceCardSO.listItemInputOption[2].isSelected()).toBe(true);
                });

                describe("and when toggling the NEME switch back OFF", () => {
                  beforeAll(async () => {
                    await mockService.mockHttpRequest(
                      getUpdatedPreference(EXC_DEFAULT_PRODUCT_EMS_MOCK, "SetExchangeDefaultProductPreferenceMutation"),
                    );
                    await switchPO.switch.click();

                    await browser.waitUntil(async () => (await switchPO.checkbox.isSelected()) === false);

                    await browser.waitUntil(
                      async () => (await productPreferenceSingleChoiceCardSO.listItemInputOption.length) === 0,
                    );
                  });

                  it("[PRPI-3093] the product preferences should no longer be displayed", async () => {
                    expect(await productPreferenceSingleChoiceCardSO.element.isDisplayed()).toBe(false);
                  });
                });
              });
            });
          });

          describe("and the account creation date is < 31 December 2026", () => {
            beforeAll(async () => {
              await mockService.mockHttpRequest(
                await getIndexHTML(USR_PRF_MOCK.urn, {
                  EXC_ALLOWED_JURISDICTION: { isActive: true },
                  phoenixMigratedUser: false,
                  accountOpenDate: "2026-12-30T00:00:00.000Z",
                  loggedIn: "true",
                }),
              );
              await mockService.mockHttpRequest(getMyAccountLayout(USR_PRF_MOCK));
              await mockService.mockHttpRequest(getSettingsPageLayout(SETTINGS_PAGE_MOCK));

              await browser.url(routes.getMyAccountViewUrl());
            });

            it("[PRPI-12642] the content preferences should not be displayed", async () => {
              expect(await productPreferenceSingleChoiceCardSO.element.isDisplayed()).toBe(false);
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
                await getIndexHTML(USR_PRF_MOCK.urn, {
                  EXC_ALLOWED_JURISDICTION: { isActive: false },
                  phoenixMigratedUser: false,
                  accountOpenDate: "2026-12-31T00:00:00.000Z",
                  loggedIn: "true",
                }),
              );
              await mockService.mockHttpRequest(getMyAccountLayout(USR_PRF_MOCK));
              await mockService.mockHttpRequest(getSettingsPageLayout(SETTINGS_PAGE_MOCK));

              await browser.url(routes.getMyAccountViewUrl());
            });

            it("[PRPI-12643] the content preferences should not be displayed", async () => {
              expect(await productPreferenceSingleChoiceCardSO.element.isDisplayed()).toBe(false);
            });
          });
        });
      });
    });
  });
});
