const { getGenericLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockedImage } = require("@ppb/tbd-shared/mocks/image/image.controller");

const { RunnerInfoSO } = require("../../../../screen-objects");
const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");

const runnerInfoSO = new RunnerInfoSO();

const mockService = new MockService();
const mockServerPort = mockService.getMockServerPort();
const mockServerHost = mockService.getMockServerHost();

const BFF_VIEW_WITH_RECENT_RACES_MOCK = {
  __typename: "GenericView",
  urn: "ppb:tbd:view:generic:home",
  url: "view/generic:home",
  edges: [
    {
      node: {
        __typename: "RunnerInfoCard",
        urn: "ppb:tbd:card:runnerInfo:1.178518448/16257108/0",
        title: "RunnerInfoCard",
        raceRunner: {
          __typename: "RaceRunner",
          urn: "ppb:tbd:racerunner:1.178518448/16257108/0",
          raceURN: "ppb:race:1.178518448/16257108",
          rating123: 1,
          ratingStars: 5,
          selectionId: 16257108,
          form: "1-15026",
          rating: 104,
          comments:
            "25/1, creditable fourth of 10 in handicap at this CD 8 days ago on first run after a breathing op. Still low mileage so he must enter calculations off same mark",
          horse: {
            name: "Shakalakaboomboom",
            sireName: "NEW APPROACH (IRE)",
            damName: "HORATIA (IRE)",
            damSireName: "MACHIAVELLIAN (USA)",
            age: 5,
            color: "BAY",
            sex: "GELDING",
            bred: "IRE",
          },
          details: {
            jockeyName: "John Velazquez",
            trainerName: "Michael Apple",
            saddleCloth: 4,
            weight: { kilograms: 1, pounds: 1, stones: "8-6" },
            equipmentDescription: "Visor and tongue strap",
            silk: `http://${mockServerHost}:${mockServerPort}/mockedImage/image.png`,
            draw: 4,
          },
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "RunnerInfoCard",
        urn: "ppb:tbd:card:runnerInfo:1.178518448/16257108/0",
      },
    },
  ],
};

describe("RunnerInfoCard", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getGenericLayout(BFF_VIEW_WITH_RECENT_RACES_MOCK));
    await mockService.mockHttpRequest(getMockedImage({ path: ".*mockedImage.*" }));
    await startApp("home");

    await browser.waitUntilDisplayed(runnerInfoSO.element);
  });

  describe("When the user is on a race screen and a RunnerInfoCard is retrieved", () => {
    it("[PRPI-2520] The HR silk should be visible", async () => {
      expect(await runnerInfoSO.silk.isDisplayed()).toBe(true);
    });

    it("[PRPI-2521] The HR runner cloth number and name should be visible '4. Shakalakaboomboom'", async () => {
      expect(await runnerInfoSO.runnerName.getText()).toEqual("4. Shakalakaboomboom");
    });

    it("[PRPI-2522] The 'Jockey' label and jockey name 'John Velazquez' should be visible", async () => {
      expect(await runnerInfoSO.jockeyLabel.getText()).toEqual("Jockey");
      expect(await runnerInfoSO.jockeyName.getText()).toEqual("John Velazquez");
    });

    it("[PRPI-2523] The 'Trainer' label and the trainer name 'Michael Apple' should be visible", async () => {
      expect(await runnerInfoSO.trainerLabel.getText()).toEqual("Trainer");
      expect(await runnerInfoSO.trainerName.getText()).toEqual("Michael Apple");
    });
  });
});
