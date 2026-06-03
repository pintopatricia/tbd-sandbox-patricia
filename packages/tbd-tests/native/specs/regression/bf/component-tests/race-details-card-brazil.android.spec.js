const RaceDetailsCardSO = require("@ppb/tbd-shared/components/RaceDetailsCard/RaceDetailsCard.native.so");
const { getMockedImage } = require("@ppb/tbd-shared/mocks/image/image.controller");
const {
  getSportsLayout,
  getHomeLayoutWithViewLink,
  getAppContext,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const { DurationSO } = require("../../../../screen-objects");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");
const MockService = require("../../../../mock-essentials/mocking-service");
const { StatusLabelSO } = require("../../../../screen-objects");

const mockService = new MockService();
const mockServerPort = mockService.getMockServerPort();
const mockServerHost = mockService.getMockServerHost();

const raceDetailsCardSO = new RaceDetailsCardSO();
const statusLabelSO = new StatusLabelSO();
const durationSO = new DurationSO(raceDetailsCardSO.element);

const APP_CONTEXT_MOCK = {
  jurisdiction: "BRAZIL",
};

const BFF_VIEW_MOCK = {
  urn: "ppb:tbd:view:sport:7",
  title: "DUMMY TITLE",
  edges: [
    {
      node: {
        __typename: "RaceDetailsCard",
        urn: "ppb:tbd:card:raceDetails:1.171782025/24000991/0",
        numberOfRunners: 9,
        race: {
          __typename: "Race",
          urn: "ppb:race:29901908.1410",
          startTime: "2020-11-13T14:40:00",
          name: "Aintree",
          details: {
            distance: { totalFurlongs: 1, totalMeters: 1, miles: 10, furlongs: 40, yards: 50 },
            going: "GOOD_FIRM",
            status: "GOING_DOWN",
            type: "FLAT",
          },
          runners: [],
          meeting: {
            __typename: "Meeting",
            urn: "ppb:meeting:29901908",
            name: "Wind 13th Jul",
            country: "GB",
            countryFlag: {
              small: `http://${mockServerHost}:${mockServerPort}/mockedImage/image.png`,
            },
            venue: "Aintree",
          },
        },
        showMeetingInfo: true,
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "RaceDetailsCard",
        urn: "ppb:tbd:card:raceDetails:1.171782025/24000991/0",
      },
    },
  ],
};

describe("Layout Entity - RaceDetailsCard", () => {
  describe("When the user is on Brazil's jurisdiction and on a given page and RaceDetailsCard is retrieved", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMockedImage({ path: ".*mockedImage.*" }));
      await mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_MOCK));
      await mockService.mockHttpRequest(getAppContext(APP_CONTEXT_MOCK));

      const url = "horse-racing/s-7";
      const HOME_VIEW_LINK = getStartViewLink(url);
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });

      await browser.waitUntilEquals(statusLabelSO.text, "Going Down");
    });

    it("[PRPI-3637] should show the race starting time and date", async () => {
      expect(await durationSO.date.getText()).toBe("Nov 13");
      expect(await durationSO.time.getText()).toBe("14:40");
    });
  });
});
