const { getSettingsPageLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const { RegulatoryHeaderSO } = require("../../../../screen-objects");
const MockService = require("../../../../mock-essentials/mocking-service");

const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");

const mockService = new MockService();
const mockServerPort = mockService.getMockServerPort();
const mockServerHost = mockService.getMockServerHost();
const regulatoryHeaderSO = new RegulatoryHeaderSO();

const STG_MOCK = {
  __typename: "SettingsView",
  urn: "ppb:tbd:view:settings:settings",
  url: "settings/settings:settings",
  regulatoryData: {
    sections: [
      {
        sectionType: "GENERIC",
        __typename: "RegulatorySectionGeneric",
        items: [
          {
            __typename: "RegulatoryImageItem",
            imageURL: `http://${mockServerHost}:${mockServerPort}/mockedImage/image.png`,
            alignment: "LEFT",
            alt: null,
            target: "BLANK",
            link: "https://www.spillemyndigheden.dk",
            viewLink: {
              viewUrn: "ppb:tbd:view:external:external",
              viewUrl: "https://www.spillemyndigheden.dk",
              viewDisplayMode: "BLANK_INAPP",
            },
          },
          {
            __typename: "RegulatoryImageItem",
            imageURL: `http://${mockServerHost}:${mockServerPort}/mockedImage/image.png`,
            alignment: "LEFT",
            alt: null,
            target: "BLANK",
            link: "https://ansvarligtspil.nxt.com.betfair/",
            viewLink: {
              viewUrn: "ppb:tbd:view:external:external",
              viewUrl: "https://ansvarligtspil.nxt.com.betfair/",
              viewDisplayMode: "BLANK_INAPP",
            },
          },
          {
            __typename: "RegulatoryImageItem",
            imageURL: `http://${mockServerHost}:${mockServerPort}/mockedImage/image.png`,
            alignment: "LEFT",
            alt: null,
            target: "BLANK",
            link: "https://www.stopspillet.dk/",
            viewLink: {
              viewUrn: "ppb:tbd:view:external:external",
              viewUrl: "https://www.stopspillet.dk/",
              viewDisplayMode: "BLANK_INAPP",
            },
          },
          {
            __typename: "RegulatoryImageItem",
            imageURL: `http://${mockServerHost}:${mockServerPort}/mockedImage/image.png`,
            alignment: "LEFT",
            alt: null,
            target: "BLANK",
            link: "https://ansvarligtspil.nxt.com.betfair/protecting-minors",
            viewLink: {
              viewUrn: "ppb:tbd:view:external:external",
              viewUrl: "https://ansvarligtspil.nxt.com.betfair/protecting-minors",
              viewDisplayMode: "BLANK_INAPP",
            },
          },
          {
            __typename: "RegulatoryImageItem",
            imageURL: `http://${mockServerHost}:${mockServerPort}/mockedImage/image.png`,
            alignment: "LEFT",
            alt: null,
            target: "BLANK",
            link: "https://www.rofus.nu/",
            viewLink: {
              viewUrn: "ppb:tbd:view:external:external",
              viewUrl: "https://www.rofus.nu/",
              viewDisplayMode: "BLANK_INAPP",
            },
          },
          {
            __typename: "RegulatorySessionItem",
            alignment: "CENTER",
            sessionText: "Session:",
            timeFormat: "HH:mm:ss",
            time: "2020-01-01T16:01:56.244Z",
          },
        ],
      },
    ],
  },
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
                        title: "Odds Display",
                        description: "Choose how you would like your odds to be displayed.",
                        preference: {
                          __typename: "PreferenceSingleChoice",
                          urn: "ppb:tbd:preference:singleChoice:sportsbookOddsDisplay",
                          preferenceKey: "sportsbookOddsDisplay",
                          preferenceValues: [
                            {
                              value: "FRACTIONAL",
                              translationKey: "FRACTIONAL",
                            },
                            {
                              value: "DECIMAL",
                              translationKey: "DECIMAL",
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

describe("When a loggedIn user opens the settings and details screen And RegulatoryData is retrieved", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getSettingsPageLayout(STG_MOCK));
    const url = "settings/settings-settings";
    const HOME_VIEW_LINK = getStartViewLink(url);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
    await browser.waitUntilDisplayed(regulatoryHeaderSO.element);
  });

  it("[PRPI-2513] regulatory header should be displayed", async () => {
    expect(await regulatoryHeaderSO.headerSessionItem.isDisplayed()).toBe(true);
  });
});
