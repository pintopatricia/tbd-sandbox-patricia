const { getRaceLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { RaceDetailsPO, DurationPO, StatusLabelPO } = require("../../../../../page-objects");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const raceDetailsPO = new RaceDetailsPO();
const statusLabelPO = new StatusLabelPO();
const scoreboardDurationPO = new DurationPO();

const mockService = new MockService();

const RACE_ID = "30174778.1630";

const BFF_MOCK = {
  urn: "ppb:tbd:view:race:7|29901.1630",
  race: {
    __typename: "Race",
    urn: "ppb:race:29901.1630",
    startTime: "2020-07-13T16:30:00Z",
    name: "Aintree",
    raceTitle: "Skybet Hurdle",
    details: {
      distance: { totalFurlongs: 1, totalMeters: 1, miles: 10, furlongs: 40, yards: 50 },
      going: "GOOD_FIRM",
      status: "GOING_DOWN",
      type: "FLAT",
    },
    meeting: {
      __typename: "Meeting",
      urn: "ppb:meeting:29901",
      name: "Wind 13th Jul",
      country: "GB",
      countryFlag: {
        small: "http://example.test.com/mockedImage/image.png",
        medium: "http://example.test.com/mockedImage/image.png",
        large: "http://example.test.com/mockedImage/image.png",
      },
      venue: "Aintree",
    },
  },
  edges: [
    {
      node: {
        __typename: "RaceDetailsCard",
        urn: "ppb:tbd:card:raceDetails:1.171782025/24000991/0",
        numberOfRunners: 14,
        raceClass: 2,
        race: {
          __typename: "Race",
          raceTitle: "Skybet Hurdle",
          urn: "ppb:race:29901.1630",
          startTime: "2020-07-13T16:30:00Z",
          name: "Aintree",
          details: {
            distance: { totalFurlongs: 1, totalMeters: 1, miles: 10, furlongs: 40, yards: 50 },
            going: "GOOD_FIRM",
            status: "GOING_DOWN",
            type: "FLAT",
            raceDetailsTitle: "race 22",
          },
          runners: [],
          meeting: {
            __typename: "Meeting",
            urn: "ppb:meeting:29901",
            name: "Wind 13th Jul",
            country: "GB",
            countryFlag: {
              small: "http://example.test.com/mockedImage/image.png",
              medium: "http://example.test.com/mockedImage/image.png",
              large: "http://example.test.com/mockedImage/image.png",
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
  describe("When the user is on International's jurisdiction and on a given page and RaceDetailsCard is retrieved", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn, { jurisdiction: "INTERNATIONAL" }));
      await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
      await mockService.mockHttpRequest(getScaResponse({}));
      await mockService.mockHttpRequest(getRaceLayout(BFF_MOCK));
      await browser.url(routes.getRaceViewUrl("7", RACE_ID));
      await browser.waitUntilDisplayed(raceDetailsPO.element);
    });

    it("[PRPI-6287] The\xA0RaceDetailsCard should be shown with a country flag", async () => {
      expect(await raceDetailsPO.flag.isDisplayed()).toBe(true);
    });
    it("[PRPI-6288] The race start time should be shown:\xA0'17:30'", async () => {
      expect(await raceDetailsPO.raceTime.getText()).toBe("17:30");
    });
    it("[PRPI-6289] The meeting name should be shown 'Aintree'", async () => {
      expect(await raceDetailsPO.meetingName.getText()).toBe("Aintree");
    });
    it("[PRPI-6290] The\xA0race status should be shown:\xA0'GOING DOWN'", async () => {
      expect(await statusLabelPO.text.getText()).toBe("Going Down");
    });
    it("[PRPI-6291] The race name should be shown: 'Aintree'", async () => {
      expect(await raceDetailsPO.raceInfo.getText()).toContain("Aintree");
    });
    it("[PRPI-6292] The number of runners should be shown:\xA0'14\xA0runners'", async () => {
      expect(await raceDetailsPO.raceInfo.getText()).toContain("14");
    });
    it("[PRPI-6293] The track going info\xA0\u200Bshould be shown:\xA0'Good Firm'", async () => {
      expect(await raceDetailsPO.raceInfo.getText()).toContain("Good Firm");
    });
    it("[PRPI-6294] The race class info should be shown if available", async () => {
      expect(await raceDetailsPO.raceInfo.getText()).toContain("Class 2");
    });
  });

  describe("When the user is on Brazil's jurisdiction and on a given page and RaceDetailsCard is retrieved", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn, { jurisdiction: "BRAZIL" }));
      await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
      await mockService.mockHttpRequest(getScaResponse({}));
      await mockService.mockHttpRequest(getRaceLayout(BFF_MOCK));
      await browser.url(routes.getRaceViewUrl("7", RACE_ID));
      await browser.waitUntilDisplayed(scoreboardDurationPO.element);
    });

    it("[PRPI-6295] The Duration component should be shown:\xA0'Jul 13'", async () => {
      expect(await scoreboardDurationPO.date.getText()).toBe("Jul 13");
    });
  });
});
