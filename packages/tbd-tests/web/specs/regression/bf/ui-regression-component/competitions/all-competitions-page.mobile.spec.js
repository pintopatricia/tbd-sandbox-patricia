const { AllCompetitionsPagePO } = require("../../../../../page-objects");
const { getGenericLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const allCompetitionsPagePO = new AllCompetitionsPagePO();
const mockService = new MockService();

const BFF_MOCK = {
  urn: "ppb:tbd:view:allCompetitions:1",
  title: "All Competitions",
  pageInfo: null,
  edges: [
    {
      node: {
        __typename: "QuickLinksCard",
        urn: "ppb:tbd:card:quickLinks:competitions:xxx",
        links: [
          {
            label: "Liga NOS",
            viewLink: {
              viewUrn: "ppb:tbd:view:competition:1234",
              viewUrl: routes.getCompetitionViewUrl("1234"),
            },
          },
          {
            label: "La Liga",
            viewLink: {
              viewUrn: "ppb:tbd:view:competition:1235",
              viewUrl: routes.getCompetitionViewUrl("1235"),
            },
          },
          {
            label: "Bundesliga",
            viewLink: {
              viewUrn: "ppb:tbd:view:competition:3234",
              viewUrl: routes.getCompetitionViewUrl("3234"),
            },
          },
        ],
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "QuickLinksCard",
        urn: "ppb:tbd:card:quickLinks:competitions:xxx",
      },
    },
  ],
};

describe("[646817] Given I am on All Competitions page And I have 3 competitions", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
    await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
    await browser.url(routes.getAllCompetitionsViewUrl(1));

    await browser.waitUntilEquals(allCompetitionsPagePO.links[2], "Bundesliga");
  });

  it("[PRPI-5686] Then I should see that page title is 'All Competitions'", async () => {
    expect(await allCompetitionsPagePO.title.getText()).toBe("All Competitions");
  });

  it("[PRPI-5687] And I should see\xA03 competition links", async () => {
    expect(await allCompetitionsPagePO.links.length).toBe(3);
  });

  it("[PRPI-5688] And I should see the first competition is 'Liga NOS'", async () => {
    expect(await allCompetitionsPagePO.links[0].getText()).toBe("Liga NOS");
  });

  it("[PRPI-5689] And I should see the second competition is 'La Liga'", async () => {
    expect(await allCompetitionsPagePO.links[1].getText()).toBe("La Liga");
  });

  it("[PRPI-5690] And I should see the competition is 'Bundesliga'", async () => {
    expect(await allCompetitionsPagePO.links[2].getText()).toBe("Bundesliga");
  });
});
