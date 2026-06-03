// Screen Objects
const NavigationTabsListSO = require("@ppb/tbd-shared/components/NavigationTabsList/NavigationTabsList.so");
const { SwitchOptionSO, SwitchSO, PreferenceCardSO } = require("../../../../screen-objects");

// Mock controllers
const {
  getAppContext,
  getSettingsPageLayout,
  getUpdatedPreference,
  getMyAccountLayout,
  getHomeLayoutWithViewLink,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");

// Utils
const mockService = new MockService();

// Screen Objects instances
const navigationTabsListPO = new NavigationTabsListSO();
const preferenceSO = new PreferenceCardSO(navigationTabsListPO.element);

const firstPreferenceCardSO = new PreferenceCardSO(preferenceSO.preferencesCard[0]);
const switchOptionSO = new SwitchOptionSO(firstPreferenceCardSO.element);
const switchSO = new SwitchSO(switchOptionSO.element);

// Services mock
const USER_PREFERENCES_MOCK = {
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
                        urn: "ppb:tbd:card:preference:singleChoice:confirmCashout",
                        title: "I18N.PREFERENCES.CONFIRM_CASHOUT.TITLE",
                        description: "I18N.PREFERENCES.CONFIRM_CASHOUT.DESCRIPTION",
                        preference: {
                          __typename: "PreferenceSingleChoice",
                          urn: "ppb:tbd:preference:singleChoice:confirmCashout",
                          preferenceKey: "confirmCashout",
                          preferenceValues: [
                            {
                              value: "ON",
                              translationKey: "I18N.PREFERENCES.CONFIRM_CASHOUT.ON",
                            },
                            {
                              value: "OFF",
                              translationKey: "I18N.PREFERENCES.CONFIRM_CASHOUT.OFF",
                            },
                          ],

                          selectedValueIndex: 1,
                        },
                      },
                    },
                    {
                      node: {
                        __typename: "PreferenceSingleChoiceCard",
                        urn: "ppb:tbd:card:preference:singleChoice:sportsbookOddsDisplay",
                        title: "I18N.PREFERENCES.SPORTSBOOK_ODDS_DISPLAY.TITLE",
                        description: "I18N.PREFERENCES.SPORTSBOOK_ODDS_DISPLAY.DESCRIPTION",
                        preference: {
                          __typename: "PreferenceSingleChoice",
                          urn: "ppb:tbd:preference:singleChoice:sportsbookOddsDisplay",
                          preferenceKey: "sportsbookOddsDisplay",
                          preferenceValues: [
                            {
                              value: "FRACTIONAL",
                              translationKey: "I18N.PREFERENCES.SPORTSBOOK_ODDS_DISPLAY.FRACTIONAL",
                            },
                            {
                              value: "DECIMAL",
                              translationKey: "I18N.PREFERENCES.SPORTSBOOK_ODDS_DISPLAY.DECIMAL",
                            },
                          ],

                          selectedValueIndex: 1,
                        },
                      },
                    },
                    {
                      node: {
                        __typename: "PreferenceSingleChoiceCard",
                        urn: "ppb:tbd:card:preference:singleChoice:oddsMovement",
                        title: "I18N.PREFERENCES.ODDS_MOVEMENT.TITLE",
                        description: "I18N.PREFERENCES.ODDS_MOVEMENT.DESCRIPTION",
                        preference: {
                          __typename: "PreferenceSingleChoice",
                          urn: "ppb:tbd:preference:singleChoice:oddsMovement",
                          preferenceKey: "oddsMovement",
                          preferenceValues: [
                            {
                              value: "ON",
                              translationKey: "I18N.PREFERENCES.ODDS_MOVEMENT.ON",
                            },
                            {
                              value: "OFF",
                              translationKey: "I18N.PREFERENCES.ODDS_MOVEMENT.OFF",
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
                        urn: "ppb:tbd:card:preference:singleChoice:confirmCashout",
                      },
                    },
                    {
                      node: {
                        __typename: "PreferenceSingleChoiceCard",
                        urn: "ppb:tbd:card:preference:singleChoice:sportsbookOddsDisplay",
                      },
                    },
                    {
                      node: {
                        __typename: "PreferenceSingleChoiceCard",
                        urn: "ppb:tbd:card:preference:singleChoice:oddsMovement",
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

const SET_CONFIRM_CASHOUT_PREFERENCE_MOCK = {
  urn: "ppb:tbd:preference:confirmCashout:ConfirmCashout",
  data: {
    setPreferences: {
      result: [
        {
          __typename: "ConfirmCashoutPreference",
          shouldConfirmCashout: true,
        },
      ],

      error: [],
    },
  },
};

const setup = async ({
  jurisdiction = "INTERNATIONAL",
  isThrottleActive = true,
  shouldTerminateAppBeforeStart = true,
} = {}) => {
  await mockService.mockHttpRequest(
    getAppContext({
      loggedIn: true,
      jurisdiction,
      ...(jurisdiction === "BRAZIL" ? { currencyCode: "BRL", countryCode: "BR" } : {}),
      throttles: {
        CONFIRM_CASHOUT_PREFERENCE: { isActive: isThrottleActive },
      },
    }),
  );
  await mockService.mockHttpRequest(getMyAccountLayout(USER_PREFERENCES_MOCK));
  await mockService.mockHttpRequest(getSettingsPageLayout(SETTINGS_PAGE_MOCK));

  const HOME_VIEW_LINK = getStartViewLink("bfe://view/settings-settings");
  await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

  await startApp("home", {
    isViewLinkStartPage: !!HOME_VIEW_LINK,
    shouldTerminateAppBeforeStart,
  });

  await browser.waitUntilDisplayed(navigationTabsListPO.element, "navigation tabs list element not displayed");
};

describe("Settings Page - Confirm Cashout Preference", () => {
  describe("when a logged-in user opens the 'Settings' page in 'Betting' section", () => {
    describe("when the 'CONFIRM_CASHOUT_PREFERENCE' throttle is ON", () => {
      describe("when the user is in 'Brazil' jurisdiction", () => {
        beforeAll(async () => {
          await setup({ jurisdiction: "BRAZIL", shouldTerminateAppBeforeStart: false });
        });

        it("[PRPI-11600] should not display the 'Show Cash Out confirmation' preference", async () => {
          expect(await firstPreferenceCardSO.title.getText()).not.toBe("Show Cash Out confirmation");
        });
      });

      describe("when the user is in any other jurisdiction", () => {
        beforeAll(async () => {
          await setup();
        });

        it("[PRPI-11601] the 'Show Cash Out confirmation' preference should be displayed", async () => {
          expect(await firstPreferenceCardSO.title.getText()).toBe("Show Cash Out confirmation");
        });

        it("[PRPI-11602] the preference should be displayed as a switch layout", async () => {
          expect(await switchOptionSO.switchOptionLabel.getText()).toBe("Show confirmation during Cash Out process.");
        });

        it("[PRPI-11603] the preference should be toggled off", async () => {
          expect(await switchSO.switch.getAttribute("selected")).toBe("false");
        });

        describe("when the user toggles on the preference", () => {
          beforeAll(async () => {
            await mockService.mockHttpRequest(
              getUpdatedPreference(SET_CONFIRM_CASHOUT_PREFERENCE_MOCK, "SetConfirmCashoutPreferenceMutation"),
            );

            await browser.waitUntilDisplayed(switchSO.element);
            await switchSO.switchBall.click();

            const timeout = 1000;
            await browser.waitUntil(async () => (await switchSO.switch.getAttribute("selected")) === "true", {
              timeout,
              timeoutMsg: `Switch checkbox didn't update in ${timeout}ms`,
            });
          });

          it("[PRPI-11604] the preference should be toggled on", async () => {
            expect(await switchSO.switch.getAttribute("selected")).toBe("true");
          });
        });
      });
    });

    describe("when the 'CONFIRM_CASHOUT_PREFERENCE' throttle is OFF", () => {
      beforeAll(async () => {
        await setup({ isThrottleActive: false });
      });

      it("[PRPI-11600] should not display the 'Show Cash Out confirmation' preference", async () => {
        expect(await firstPreferenceCardSO.title.getText()).not.toBe("Show Cash Out confirmation");
      });
    });
  });
});
