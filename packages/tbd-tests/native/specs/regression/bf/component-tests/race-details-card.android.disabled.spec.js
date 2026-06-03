const RaceDetailsSO = require("@ppb/tbd-shared/components/RaceDetailsCard/RaceDetailsCard.native.so");
const { getMockedImage } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getSportsLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { StatusLabelSO } = require("../../../../screen-objects");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");
const MockService = require("../../../../mock-essentials/mocking-service");

const mockService = new MockService();
const mockServerPort = mockService.getMockServerPort();
const mockServerHost = mockService.getMockServerHost();

const raceDetailsSO = new RaceDetailsSO();
const statusLabelSO = new StatusLabelSO();

const BFF_VIEW_MOCK = {
  urn: `ppb:tbd:view:sport:7`,
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
  describe("When the user is on a given screen and RaceDetailsCard is retrieved", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMockedImage({ path: ".*mockedImage.*" }));
      await mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_MOCK));
      const url = "horse-racing/s-7";
      const HOME_VIEW_LINK = getStartViewLink(url);
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
      await browser.waitUntilEquals(statusLabelSO.text, "Going Down");
    });

    it("[PRPI-2436] The racedetailscard should be shown with race status title: 'Going Down'", async () => {
      expect(await statusLabelSO.text.getText()).toBe("Going Down");
    });

    it("[PRPI-2437] The race name should be shown: 'Aintree'", async () => {
      expect(await raceDetailsSO.raceInfo.getText()).toContain("Aintree");
    });

    it("[PRPI-2438] The number of runners should be shown: '9 Runners'", async () => {
      expect(await raceDetailsSO.raceInfo.getText()).toContain("9");
    });

    it("[PRPI-2439] The track going should be shown: 'Good Firm'", async () => {
      expect(await raceDetailsSO.raceInfo.getText()).toContain("Good Firm");
    });
  });
});
