const PreferenceSingleChoiceCardPO = require("@ppb/tbd-shared/components/PreferenceSingleChoiceCard/PreferenceSingleChoiceCard.po");
const {
  getSettingsPageLayout,
  getUpdatedPreference,
  getMyAccountLayout,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const mockService = new MockService(browser);
const preferenceSingleChoiceCardPO = new PreferenceSingleChoiceCardPO();
const MODULE_NAME = "settings";
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
const STG_MOCK = {
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
                        urn: "ppb:tbd:preference:singleChoice:sportsbookOddsDisplay",
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

                          selectedValueIndex: 0,
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
                        urn: "ppb:tbd:preference:singleChoice:sportsbookOddsDisplay",
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
const SET_PREFS = {
  data: {
    setPreferences: {
      result: [],
      error: [
        {
          message: "error",
        },
      ],
    },
  },
};
describe("When the user opens the Settings Page", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getMyAccountLayout(USR_PRF_MOCK));
    await mockService.mockHttpRequest(await getIndexHTML(USR_PRF_MOCK.urn));
    await mockService.mockHttpRequest(getSettingsPageLayout(STG_MOCK));
    await mockService.mockHttpRequest(getUpdatedPreference(SET_PREFS));
    await mockService.mockFonts(getMockFonts());
    await browser.url(routes.getMyAccountViewUrl());
    await preferenceSingleChoiceCardPO.listItem[1].waitForClickable();
    await preferenceSingleChoiceCardPO.listItem[1].click();
    await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1547]_should_display_warning_message_and_page_overlay`);
  });
  it("[PRPI-1547]_should_display_warning_message_and_page_overlay", async () => {
    expect(
      await browser.checkScreen(`${MODULE_NAME}_[PRPI-1547]_should_display_warning_message_and_page_overlay`),
    ).toEqual(0);
  });
});
