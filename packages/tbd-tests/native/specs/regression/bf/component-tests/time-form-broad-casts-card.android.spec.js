const { getRaceLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");
const { swipeDownElementFullscreen } = require("../../../../helpers/gestures");

const {
  TimeFormBroadCastsCardSO,
  GenericScreenSO,
  LiveStreamSO,
  SupportingContentButtonSO,
  PaginationSO,
  TimeformCardSO,
  StarsSO,
} = require("../../../../screen-objects");

const mockService = new MockService();

const genericScreenSO = new GenericScreenSO();

const timeFormComponentSO = new TimeformCardSO();
const timeFormBroadCastsCardSO = new TimeFormBroadCastsCardSO();
const liveStreamSO = new LiveStreamSO();
const paginationSO = new PaginationSO();

const liveVideoButton = new SupportingContentButtonSO(timeFormBroadCastsCardSO.timeformAndBroadcastsButtons[0]);
let timeformButton = new SupportingContentButtonSO(timeFormBroadCastsCardSO.timeformAndBroadcastsButtons[1]);

const firstRunnerRating = timeFormComponentSO.runnersRating[0];
const secondRunnerRating = timeFormComponentSO.runnersRating[1];
const thirdRunnerRating = timeFormComponentSO.runnersRating[2];
const firstRunner = timeFormComponentSO.runners[0];
const secondRunner = timeFormComponentSO.runners[1];
const thirdRunner = timeFormComponentSO.runners[2];

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
  __typename: "RaceView",
  urn: `ppb:tbd:view:race:30174778.1630`,
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

const BFF_MOCK_WITH_ONLY_VIDEO = {
  ...BFF_MOCK,
  edges: [
    {
      node: {
        ...timeFormBroadCastsCard,
        selectedRace: null,
      },
    },
    {
      node: {
        __typename: "GenericViewLinkCard",
        urn: "ppb:tbd:card:genericViewLink:generic:inplay",
      },
    },
  ],

  partialEdges: [
    ...BFF_MOCK.partialEdges,
    {
      node: {
        __typename: "GenericViewLinkCard",
        urn: "ppb:tbd:card:genericViewLink:generic:inplay",
      },
    },
  ],
};

describe("Layout Entity - TimeFormBroadCastsCard", () => {
  describe("When the user is on a given screen and TimeFormBroadCastsCard is retrieved with timeform and live-video info", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getRaceLayout(BFF_MOCK));
      const HOME_VIEW_LINK = getStartViewLink("sport/meeting/r-30174778.1630");
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK, pullToRefresh: true });
      await browser.waitUntilDisplayed(genericScreenSO.element);
      await browser.waitUntilDisplayed(timeFormBroadCastsCardSO.element);
    });

    it("[PRPI-3826] The 'Timeform' label and icon should be visible", async () => {
      expect(await timeformButton.icon.isDisplayed()).toBe(true);
      expect(await timeformButton.title.getText()).toBe("Expert View");
    });
    it("[PRPI-3827] The timeform section should be collapsed", async () => {
      expect(await timeformButton.chevronCollapsed.isDisplayed()).toBe(true);
    });
    it("[PRPI-3828] The timeform section should not be displayed", async () => {
      expect(await timeFormComponentSO.element.isDisplayed()).toBe(false);
    });
    it("[PRPI-3829] The 'Live Video' label and icon should be visible", async () => {
      expect(await liveVideoButton.icon.isDisplayed()).toBe(true);
      expect(await liveVideoButton.title.getText()).toBe("Live Video");
    });
    it("[PRPI-3830] The live-video section should be collapsed", async () => {
      expect(await liveVideoButton.chevronCollapsed.isDisplayed()).toBe(true);
    });
    it("[PRPI-3831] The live-video iframe should not be displayed", async () => {
      expect(await liveStreamSO.element.isDisplayed()).toBe(false);
    });

    describe("When the user taps live-video section", () => {
      beforeAll(async () => {
        await browser.waitUntilDisplayed(liveVideoButton.chevronCollapsed);
        await liveVideoButton.element.click();
        await browser.waitUntilDisplayed(liveVideoButton.chevronExpanded);
      });

      it("[PRPI-3832] The 'Timeform' label and icon should be visible", async () => {
        expect(await timeformButton.icon.isDisplayed()).toBe(true);
        expect(await timeformButton.title.getText()).toBe("Expert View");
      });
      it("[PRPI-3833] The timeform section should be collapsed", async () => {
        expect(await timeformButton.chevronCollapsed.isDisplayed()).toBe(true);
      });
      it("[PRPI-3834] The timeform section should not be displayed", async () => {
        expect(await timeFormComponentSO.element.isDisplayed()).toBe(false);
      });
      it("[PRPI-3835] The 'Live Video' label and icon should be visible", async () => {
        expect(await liveVideoButton.icon.isDisplayed()).toBe(true);
        expect(await liveVideoButton.title.getText()).toBe("Live Video");
      });
      it("[PRPI-3836] The live-video section should be expanded", async () => {
        expect(await liveVideoButton.chevronExpanded.isDisplayed()).toBe(true);
      });
      it("[PRPI-3837] The live-video iframe should be displayed", async () => {
        expect(await liveStreamSO.element.isDisplayed()).toBe(true);
      });
      it("[PRPI-3838] The pagination should not be displayed", async () => {
        expect(await paginationSO.element.isExisting()).toBe(false);
      });
    });

    describe("When the user taps Timeform section", () => {
      beforeAll(async () => {
        await browser.waitUntilDisplayed(timeformButton.chevronCollapsed);
        await timeformButton.element.click();
        await browser.waitUntilDisplayed(timeformButton.chevronExpanded);
      });

      it("[PRPI-3839] The 'Timeform' label and icon should be visible", async () => {
        expect(await timeformButton.icon.isDisplayed()).toBe(true);
        expect(await timeformButton.title.getText()).toBe("Expert View");
      });
      it("[PRPI-3840] The timeform section should be expanded", async () => {
        expect(await timeformButton.chevronExpanded.isDisplayed()).toBe(true);
      });
      it("[PRPI-3841] The 1st runner rating123 should be visible: '1.'", async () => {
        expect(await firstRunnerRating.getText()).toContain("1.");
      });
      it("[PRPI-3842] The 1st runner name should be visible: 'Shakalakaboomboom'", async () => {
        expect(await firstRunnerRating.getText()).toContain("Shakalakaboomboom");
      });
      it("[PRPI-3843] The 1st runner should have 5 stars filled in", async () => {
        expect(await new StarsSO(firstRunner).filledStars.length).toBe(5);
      });
      it("[PRPI-3844] The 2nd runner rating123 should be visible: '2.'", async () => {
        expect(await secondRunnerRating.getText()).toContain("2.");
      });
      it("[PRPI-3845] The 2nd runner name should be visible:' Jon Snow'", async () => {
        expect(await secondRunnerRating.getText()).toContain("Jon Snow");
      });
      it("[PRPI-3846] The 2nd runner should have 3 stars filled in", async () => {
        expect(await new StarsSO(secondRunner).filledStars.length).toBe(3);
      });
      it("[PRPI-3847] The 3rd runner rating123 should be visible: '3.'", async () => {
        expect(await thirdRunnerRating.getText()).toContain("3.");
      });
      it("[PRPI-3848] The 3rd runner name should be visible:' Sydney Novak'", async () => {
        expect(await thirdRunnerRating.getText()).toContain("Sydney Novak");
      });
      it("[PRPI-3849] The 3rd runner should have 1 star filled in", async () => {
        expect(await new StarsSO(thirdRunner).filledStars.length).toBe(1);
      });
      it("[PRPI-3850] The 'TIMEFORM VIEW' label should be visible", async () => {
        expect(await timeFormComponentSO.verdictLabel.isDisplayed()).toBe(true);
      });
      it("[PRPI-3851] The Verdict info should be visible: 'Shakalalaboomboom came good at Kempton 12 days ago and may be...'", async () => {
        expect(await timeFormComponentSO.verdictText.getText()).toContain(
          "Shakalalaboomboom came good at Kempton 12 days ago and may be...",
        );
      });
      it("[PRPI-3852] The 'Live Video' label and icon should be visible", async () => {
        expect(await liveVideoButton.icon.isDisplayed()).toBe(true);
        expect(await liveVideoButton.title.getText()).toBe("Live Video");
      });
      it("[PRPI-3853] The live-video section should be collapsed", async () => {
        expect(await liveVideoButton.chevronCollapsed.isDisplayed()).toBe(true);
      });
      it("[PRPI-3854] The live-video iframe should not be displayed", async () => {
        expect(await liveStreamSO.element.isDisplayed()).toBe(false);
      });
    });
  });

  describe("When the user is on a given screen and TimeFormBroadCastsCard is retrieved with only timeform info", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getRaceLayout(BFF_MOCK_ONLY_RACE));
      timeformButton = new SupportingContentButtonSO(timeFormBroadCastsCardSO.timeformAndBroadcastsButtons[0]);
      await swipeDownElementFullscreen(timeformButton.element);
      await browser.waitUntilEquals(timeformButton.title, "Expert View");
    });

    it("[PRPI-3855] The 'Timeform' label and icon should be visible", async () => {
      expect(await timeformButton.icon.isDisplayed()).toBe(true);
      expect(await timeformButton.title.getText()).toBe("Expert View");
    });
    it("[PRPI-3856] The timeform section should be expanded", async () => {
      expect(await timeformButton.chevronExpanded.isDisplayed()).toBe(true);
    });
    it("[PRPI-3857] The 1st runner rating123 should be visible: '1.'", async () => {
      expect(await firstRunnerRating.getText()).toContain("1.");
    });
    it("[PRPI-3858] The 'Live Video' label and icon should not be visible", async () => {
      expect(await timeFormBroadCastsCardSO.timeformAndBroadcastsButtons.length).toBe(1);
    });
    it("[PRPI-3859] The live-video iframe should not be displayed", async () => {
      expect(await liveStreamSO.element.isDisplayed()).toBe(false);
    });

    describe("When the user taps to close TimeformBroadCastsCard", () => {
      beforeAll(async () => {
        await browser.waitUntilDisplayed(timeformButton.chevronExpanded);
        await timeformButton.element.click();
        await browser.waitUntilDisplayed(timeformButton.chevronCollapsed);
      });

      it("[PRPI-3860] The 'Timeform' label and icon should be visible", async () => {
        expect(await timeformButton.icon.isDisplayed()).toBe(true);
        expect(await timeformButton.title.getText()).toBe("Expert View");
      });
      it("[PRPI-3861] The timeform section should be collapsed", async () => {
        expect(await timeformButton.chevronCollapsed.isDisplayed()).toBe(true);
      });
      it("[PRPI-3862] The timeform section should not be displayed", async () => {
        expect(await timeFormComponentSO.element.isDisplayed()).toBe(false);
      });
    });
  });

  describe("When the user is on a given screen and TimeFormBroadCastsCard is retrieved with only live-video info", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getRaceLayout(BFF_MOCK_WITH_ONLY_VIDEO));
      await swipeDownElementFullscreen(liveVideoButton.element);
      await browser.waitUntilEquals(liveVideoButton.title, "Live Video");
    });

    it("[PRPI-3863] The 'Timeform' label and icon should not be visible", async () => {
      expect(await timeFormBroadCastsCardSO.timeformAndBroadcastsButtons.length).toBe(1);
    });
    it("[PRPI-3864] The 'Live Video' label and icon should be visible", async () => {
      expect(await liveVideoButton.icon.isDisplayed()).toBe(true);
      expect(await liveVideoButton.title.getText()).toBe("Live Video");
    });
    it("[PRPI-3865] The live-video section should be collapsed", async () => {
      expect(await liveVideoButton.chevronCollapsed.isDisplayed()).toBe(true);
    });
    it("[PRPI-3866] The live-video iframe should not be displayed", async () => {
      expect(await liveStreamSO.element.isDisplayed()).toBe(false);
    });
  });
});
