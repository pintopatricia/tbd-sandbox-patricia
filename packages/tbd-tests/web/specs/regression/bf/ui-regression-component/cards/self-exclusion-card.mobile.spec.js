const { SelfExclusionPO } = require("../../../../../page-objects");
const { getGenericLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const selfExclusionPO = new SelfExclusionPO();

const mockService = new MockService();

const SELF_EXCLUSION_CARD_MOCK = {
  __typename: "SelfExclusionCard",
  urn: "ppb:tbd:card:selfExcluded:sports",
};

const BFF_MOCK = {
  urn: "ppb:tbd:view:selfexcluded:sports",
  edges: [
    {
      node: SELF_EXCLUSION_CARD_MOCK,
    },
  ],
};

describe("Component - SelfExclusionCard", () => {
  describe("When the user enters a page with Self Exclusion Card", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(
        await getIndexHTML(BFF_MOCK.urn, {
          SELF_EXCLUSION: { isActive: true },
          productExclusions: ["SPORTS"],
        }),
      );
      await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
      await mockService.mockHttpRequest(
        getCardResults({
          cards: [SELF_EXCLUSION_CARD_MOCK],
        }),
      );
      await browser.url(routes.getHomeViewUrl());
      await browser.waitUntilDisplayed(selfExclusionPO.element);
    });

    it("[PRPI-3667] The card should have a title", async () => {
      expect(await selfExclusionPO.emptyState.getText()).toContain("You're self excluded");
    });

    it("[PRPI-5683] The card should have a secondary message", async () => {
      expect(await selfExclusionPO.emptyState.getText()).toContain(
        "See our Safer Gambling information if you would like to learn more about the tools and support available to you.",
      );
    });

    it("[PRPI-5684] The card should have a primary button displaying a label", async () => {
      expect(await selfExclusionPO.saferGambling.getText()).toBe("Safer Gambling");
    });

    it("[PRPI-5685] The card should have an action link with text", async () => {
      expect(await selfExclusionPO.contact.getText()).toBe("Contact Us");
    });
  });
});
