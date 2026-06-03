const {
  TimeformCardPO,
  LiveStreamPO,
  SupportingContentButtonPO,
  StarsPO,
  PaginationPO,
} = require("../../../../../page-objects");
const { getRaceLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const TimeFormBroadCastsCardPO = require("@ppb/tbd-shared/components/TimeFormBroadCastsCard/TimeFormBroadCastsCard.web.po");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const liveStreamPO = new LiveStreamPO();
const timeFormBroadCastsCardPO = new TimeFormBroadCastsCardPO();
const timeFormComponentPO = new TimeformCardPO();

const liveVideoButton = new SupportingContentButtonPO(timeFormBroadCastsCardPO.timeformAndBroadcastsButtons[0]);
let timeformButton = new SupportingContentButtonPO(timeFormBroadCastsCardPO.timeformAndBroadcastsButtons[1]);

const paginationPO = new PaginationPO();

const firstRunner = timeFormComponentPO.runners[0];
const secondRunner = timeFormComponentPO.runners[1];
const thirdRunner = timeFormComponentPO.runners[2];

const firstRunnerStarsFilled = new StarsPO(firstRunner).filledStars;
const secondRunnerStarsFilled = new StarsPO(secondRunner).filledStars;
const thirdRunnerStarsFilled = new StarsPO(thirdRunner).filledStars;

const mockService = new MockService();

const RACE_ID = "30174778.1630";

const timeFormBroadCastsCard = {
  __typename: "TimeFormBroadCastsCard",
  urn: "ppb:tbd:card:timeFormBroadCasts:30280765.1830",
  selectedRace: {
    __typename: "Race",
    urn: "ppb:race:29901908.1410",
    verdict: "Shakalalaboomboom came good at Kempton 12 days ago and may be...",
    details: {},
    runners: [
      {
        __typename: "RaceRunner",
        urn: "ppb:tbd:racerunner:29901908.1410/111",
        raceURN: "ppb:race:29901908.1410",
        selectionId: 111,
        rating123: 1,
        ratingStars: 5,
        horse: {
          name: "Shakalakaboomboom",
        },
      },
      {
        __typename: "RaceRunner",
        urn: "ppb:tbd:racerunner:29901908.1410/222",
        raceURN: "ppb:race:29901908.1410",
        selectionId: 222,
        rating123: 0,
        ratingStars: 1,
        horse: {
          name: "Dummy Horse",
        },
      },
      {
        __typename: "RaceRunner",
        urn: "ppb:tbd:racerunner:29901908.1410/333",
        raceURN: "ppb:race:29901908.1410",
        selectionId: 333,
        rating123: 2,
        ratingStars: 3,
        horse: {
          name: "Jon Snow",
        },
      },
      {
        __typename: "RaceRunner",
        urn: "ppb:tbd:racerunner:29901908.1410/444",
        raceURN: "ppb:race:29901908.1410",
        selectionId: 444,
        rating123: 3,
        ratingStars: 1,
        horse: {
          name: "Sydney Novak",
        },
      },
    ],

    meeting: {
      __typename: "Meeting",
    },
  },
  raceBroadCasts: {
    dataVizUrl: null,
    liveVideoUrl: "https://dummy.com.betfair/livevideoURL",
  },
};

const BFF_MOCK = {
  urn: "ppb:tbd:view:race:7|30174778.1630",
  race: {
    urn: "ppb:race:30174778.1630",
    meeting: {
      urn: "30174778",
    },
  },
  edges: [
    {
      node: {
        ...timeFormBroadCastsCard,
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "TimeFormBroadCastsCard",
        urn: "ppb:tbd:card:timeFormBroadCasts:30280765.1830",
      },
    },
  ],
};

const BFF_MOCK_ONLY_RACE = {
  ...BFF_MOCK,
  edges: [
    {
      node: {
        ...timeFormBroadCastsCard,
        raceBroadCasts: null,
      },
    },
  ],
};

const BFF_MOCK_ONLY_BROAD_CAST = {
  ...BFF_MOCK,
  edges: [
    {
      node: {
        ...timeFormBroadCastsCard,
        selectedRace: null,
      },
    },
  ],
};

describe("Layout Entity - TimeFormBroadCastsCard", () => {
  describe("TimeFormBroadCastsCard is retrieved with timeform and live-video info", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      await mockService.mockHttpRequest(getRaceLayout(BFF_MOCK));
      await browser.url(routes.getRaceViewUrl("7", RACE_ID));
      await browser.waitUntilDisplayed(timeFormBroadCastsCardPO.element);
    });

    it("[PRPI-8398] The 'Timeform' label and icon should be visible", async () => {
      expect(await timeformButton.icon.isDisplayed()).toBe(true);
      expect(await timeformButton.title.getText()).toBe("Expert View");
    });
    it("[PRPI-8399] The timeform section should be collapsed", async () => {
      expect(await liveVideoButton.expandIcon.isDisplayed()).toBe(true);
    });
    it("[PRPI-8400] The timeform section should not be displayed", async () => {
      expect(await timeFormComponentPO.element.isDisplayed()).toBe(false);
    });
    it("[PRPI-8401] The 'Live Video' label\xA0and icon should be visible", async () => {
      expect(await liveVideoButton.icon.isDisplayed()).toBe(true);
      expect(await liveVideoButton.title.getText()).toBe("Live Video");
    });
    it("[PRPI-8402] The live-video section should be collapsed", async () => {
      expect(await liveVideoButton.expandIcon.isDisplayed()).toBe(true);
    });
    it("[PRPI-8403] The live-video\xA0iframe should not be displayed", async () => {
      expect(await liveStreamPO.element.isDisplayed()).toBe(false);
    });

    describe("When the user taps live-video section", () => {
      beforeAll(async () => {
        await liveVideoButton.element.waitForClickable();
        await liveVideoButton.element.click();
        await browser.waitUntilDisplayed(liveStreamPO.element);
      });

      it("[PRPI-8404] The 'Timeform' label and icon should be visible", async () => {
        expect(await timeformButton.icon.isDisplayed()).toBe(true);
        expect(await timeformButton.title.getText()).toBe("Expert View");
      });
      it("[PRPI-8405] The timeform section should be collapsed", async () => {
        expect(await timeformButton.expandIcon.isDisplayed()).toBe(true);
      });
      it("[PRPI-8406] The timeform section should not be displayed", async () => {
        expect(await timeFormComponentPO.element.isDisplayed()).toBe(false);
      });
      it("[PRPI-8407] The 'Live Video' label\xA0and icon should be visible", async () => {
        expect(await liveVideoButton.icon.isDisplayed()).toBe(true);
        expect(await liveVideoButton.title.getText()).toBe("Live Video");
      });
      it("[PRPI-8408] The live-video section should be expanded", async () => {
        expect(await liveVideoButton.expandIcon.isDisplayed()).toBe(true);
      });
      it("[PRPI-8409] The live-video\xA0iframe should be displayed", async () => {
        expect(await liveStreamPO.element.isDisplayed()).toBe(true);
      });
      it("[PRPI-8410] The pagination should not be displayed", async () => {
        expect(await paginationPO.element.isExisting()).toBe(false);
      });
    });

    describe("When the user taps Timeform section", () => {
      beforeAll(async () => {
        await timeformButton.element.waitForClickable();
        await timeformButton.element.click();
        await browser.waitUntilDisplayed(timeFormComponentPO.element);
      });

      it("[PRPI-8411] The 'Timeform' label and icon should be visible", async () => {
        expect(await timeformButton.icon.isDisplayed()).toBe(true);
        expect(await timeformButton.title.getText()).toBe("Expert View");
      });
      it("[PRPI-8412] The timeform section should be expanded", async () => {
        expect(await timeformButton.expandIcon.isDisplayed()).toBe(true);
      });
      it("[PRPI-8413] The 1st runner rating123 should be visible: '1.'", async () => {
        expect(await firstRunner.getText()).toContain("1.");
      });
      it("[PRPI-8414] The 1st runner name should be visible: 'Shakalakaboomboom'", async () => {
        expect(await firstRunner.getText()).toContain("Shakalakaboomboom");
      });
      it("[PRPI-8415] The 1st runner should have 5 stars filled in", async () => {
        expect(await firstRunnerStarsFilled.length).toBe(5);
      });
      it("[PRPI-8416] The 2nd runner rating123 should be visible: '2.'", async () => {
        expect(await secondRunner.getText()).toContain("2.");
      });
      it("[PRPI-8417] The 2nd runner name should be visible: 'Jon Snow'", async () => {
        expect(await secondRunner.getText()).toContain("Jon Snow");
      });
      it("[PRPI-8418] The 2nd runner should have 3 stars filled in", async () => {
        expect(await secondRunnerStarsFilled.length).toBe(3);
      });
      it("[PRPI-8419] The 3rd runner rating123 should be visible: '3.'", async () => {
        expect(await thirdRunner.getText()).toContain("3.");
      });
      it("[PRPI-8420] The 3rd runner name should be visible: 'Sydney Novak'", async () => {
        expect(await thirdRunner.getText()).toContain("Sydney Novak");
      });
      it("[PRPI-8421] The 3rd runner should have 1 star filled in", async () => {
        expect(await thirdRunnerStarsFilled.length).toBe(1);
      });
      it("[PRPI-8422] The 'TIMEFORM VIEW' label should be visible", async () => {
        expect(await timeFormComponentPO.verdictLabel.isDisplayedInViewport()).toBe(true);
      });
      it("[PRPI-8423] The Verdict info should be visible", async () => {
        expect(await timeFormComponentPO.verdictText.getText()).toContain(
          "Shakalalaboomboom came good at Kempton 12 days ago and may be...",
        );
      });
      it("[PRPI-8424] The 'Live Video' label and icon should be visible", async () => {
        expect(await liveVideoButton.icon.isDisplayed()).toBe(true);
        expect(await liveVideoButton.title.getText()).toBe("Live Video");
      });
      it("[PRPI-8425] The live-video section should be collapsed", async () => {
        expect(await liveVideoButton.expandIcon.isDisplayed()).toBe(true);
      });
      it("[PRPI-8426] The live-video iframe should not be displayed", async () => {
        expect(await liveStreamPO.element.isDisplayed()).toBe(false);
      });
    });
  });

  describe("When the user is on a given page and TimeFormBroadCastsCard is retrieved with only timeform info", () => {
    beforeAll(async () => {
      timeformButton = new SupportingContentButtonPO(timeFormBroadCastsCardPO.timeformAndBroadcastsButtons[0]);

      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK_ONLY_RACE.urn));
      await mockService.mockHttpRequest(getRaceLayout(BFF_MOCK_ONLY_RACE));
      await browser.url(routes.getRaceViewUrl("7", RACE_ID));
      await browser.waitUntilDisplayed(timeFormBroadCastsCardPO.element);
      await timeformButton.element.waitForClickable();
      await timeformButton.element.click();
      await browser.waitUntilDisplayed(timeFormComponentPO.element);
    });

    it("[PRPI-8427] The 'Timeform' label and icon should be visible", async () => {
      expect(await timeformButton.icon.isDisplayed()).toBe(true);
      expect(await timeformButton.title.getText()).toBe("Expert View");
    });
    it("[PRPI-8428] The timeform section should be expanded", async () => {
      expect(await timeformButton.expandIcon.isDisplayed()).toBe(true);
    });
    it("[PRPI-8429] The 1st runner rating123 should be visible: '1.'", async () => {
      expect(await firstRunner.getText()).toContain("1.");
    });
    it("[PRPI-8430] The 'Live Video' label and icon should not be visible", async () => {
      expect(await timeFormBroadCastsCardPO.timeformAndBroadcastsButtons.length).toBe(1);
    });
    it("[PRPI-8431] The live-video iframe should not be displayed", async () => {
      expect(await liveStreamPO.element.isDisplayed()).toBe(false);
    });

    describe("When the user taps to close TimeformBroadCastsCard", () => {
      beforeAll(async () => {
        await timeformButton.element.waitForClickable();
        await timeformButton.element.click();
        await browser.waitUntilNotDisplayed(timeFormComponentPO.element);
      });

      it("[PRPI-8432] The 'Timeform' label and icon should be visible", async () => {
        expect(await liveVideoButton.icon.isDisplayed()).toBe(true);
        expect(await liveVideoButton.title.getText()).toBe("Expert View");
      });
      it("[PRPI-8433] The timeform section should be collapsed", async () => {
        expect(await liveVideoButton.expandIcon.isDisplayed()).toBe(true);
      });
      it("[PRPI-8434] The timeform section should not be displayed", async () => {
        expect(await timeFormComponentPO.element.isDisplayed()).toBe(false);
      });
    });
  });

  describe("When the user is on a given page and TimeFormBroadCastsCard is retrieved with only live-video info", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK_ONLY_BROAD_CAST.urn));
      await mockService.mockHttpRequest(getRaceLayout(BFF_MOCK_ONLY_BROAD_CAST));
      await browser.url(routes.getRaceViewUrl("7", RACE_ID));
      await browser.waitUntilDisplayed(timeFormBroadCastsCardPO.element);
    });

    it("[PRPI-8435] The 'Timeform' label and icon should not be visible", async () => {
      expect(await timeFormBroadCastsCardPO.timeformAndBroadcastsButtons.length).toBe(1);
    });
    it("[PRPI-8436] The 'Live Video' label and icon should be visible", async () => {
      expect(await liveVideoButton.icon.isDisplayed()).toBe(true);
      expect(await liveVideoButton.title.getText()).toBe("Live Video");
    });
    it("[PRPI-8437] The live-video section should be collapsed", async () => {
      expect(await liveVideoButton.expandIcon.isDisplayed()).toBe(true);
    });
    it("[PRPI-8438] The live-video iframe should not be displayed", async () => {
      expect(await liveStreamPO.element.isDisplayed()).toBe(false);
    });
  });
});
