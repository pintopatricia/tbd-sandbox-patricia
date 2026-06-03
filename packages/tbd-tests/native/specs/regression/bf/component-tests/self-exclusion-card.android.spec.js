const { getGenericLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { EmptyStateSO, SelfExclusionSO, PrimaryButtonSO, ActionLinkSO } = require("../../../../screen-objects");

const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");

const selfExclusionSO = new SelfExclusionSO();
const emptyStateSO = new EmptyStateSO();
const primaryButtonSO = new PrimaryButtonSO();
const actionLinkSO = new ActionLinkSO();

const mockService = new MockService();

const BFF_MOCK = {
  urn: "ppb:tbd:view:generic:home",
  url: "view/generic:home",
  edges: [
    {
      node: {
        __typename: "SelfExclusionCard",
        urn: "ppb:tbd:card:selfExcluded:sports",
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "SelfExclusionCard",
        urn: "ppb:tbd:card:selfExcluded:sports",
      },
    },
  ],
};

describe("Component - SelfExclusionCard", () => {
  describe("When the user enters a page with Self Exclusion Card", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
      await startApp("home");

      await browser.waitUntilDisplayed(selfExclusionSO.element);
    });

    it("[PRPI-3667] The card should have a title", async () => {
      expect(await emptyStateSO.title.getText()).toContain("You're self excluded");
    });

    it("[PRPI-3668] The card should contain a message", async () => {
      expect(await selfExclusionSO.emptyStateMessage.isDisplayed()).toBe(true);
    });

    it("[PRPI-3669] The message should contain the correct text", async () => {
      expect(await selfExclusionSO.emptyStateMessageText.getText()).toContain(
        "See our Safer Gambling information if you would like to learn more about the tools and support available to you.",
      );
    });

    it("[PRPI-3670] Should contain an image", async () => {
      expect(await selfExclusionSO.image.isDisplayed()).toBe(true);
    });

    it("[PRPI-3671] The card should have a primary button", async () => {
      expect(await selfExclusionSO.saferGambling.isDisplayed()).toBe(true);
    });

    it("[PRPI-3672] The primary button should have the correct text", async () => {
      expect(await primaryButtonSO.label.getText()).toBe("Safer Gambling");
    });

    it("[PRPI-3673] The card should have an action link", async () => {
      expect(await selfExclusionSO.contact.isDisplayed()).toBe(true);
    });

    it("[PRPI-3674] The action link should have the corect text", async () => {
      expect(await actionLinkSO.text.getText()).toContain("Contact Us");
    });
  });
});
