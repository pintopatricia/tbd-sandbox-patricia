const { getGenericLayout, getQueryCardResponseByOperation } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const EmbeddedContentCardSO = require("@ppb/tbd-shared/components/EmbeddedContentCard/EmbeddedContentCard.so");
const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");

const { CardSO } = require("../../../../screen-objects");

const cardSO = new CardSO();
const embeddedContentCardSO = new EmbeddedContentCardSO();

const mockService = new MockService();

const BFF_MOCK = {
  urn: "ppb:tbd:view:generic:home",
  edges: [
    {
      node: {
        __typename: "EmbeddedContentCard",
        urn: "ppb:tbd:card:embeddedContent:ZTvx6BAAACgAmaxF/cv/home",
        contentUrl: "https://dummy.com.betfair/livevideoURL",
        contentTitle: {
          name: "Race to X Points",
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        urn: "ppb:tbd:card:embeddedContent:ZTvx6BAAACgAmaxF/cv/home",
        __typename: "EmbeddedContentCard",
      },
    },
  ],
};

const EMBEDDED_CONTENT_CARD_MOCK = {
  __typename: "EmbeddedContentCard",
  urn: "ppb:tbd:card:embeddedContent:ZTvx6BAAACgAmaxF/cv/home",
  contentUrl: "https://dummy.com.betfair/livevideoURL",
  contentTitle: {
    _typename: "DisplayNameTitle",
    name: "Race to X Points",
  },
};

describe("Layout Entity - EmbeddedContentCard", () => {
  describe("When the user is on a given screen and EmbeddedContentCard is retrieved", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(
        getQueryCardResponseByOperation("EmbeddedContentCard", EMBEDDED_CONTENT_CARD_MOCK),
      );
      await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
      await startApp("home");
      await browser.waitUntilDisplayed(embeddedContentCardSO.element);
    });

    it("[PRPI-3911] The embedded-video should be displayed", async () => {
      expect(await embeddedContentCardSO.embeddedVideo.isDisplayed()).toBe(true);
    });

    it("[PRPI-3912] The title 'Race to X Points' should be displayed", async () => {
      expect(await cardSO.title.getText()).toBe("Race to X Points");
    });

    describe("When the user taps the EmbeddedContentCard section", () => {
      beforeAll(async () => {
        await browser.waitUntilClickableNative(cardSO.header);
        await cardSO.header.click();
        await browser.waitUntilNotDisplayed(cardSO.contentWrapper);
      });

      it("[PRPI-3913] The embedded-video should not be displayed", async () => {
        expect(await embeddedContentCardSO.embeddedVideo.isDisplayed()).toBe(false);
      });

      it("[PRPI-3914] The title 'Race to X Points' should be displayed", async () => {
        expect(await cardSO.title.getText()).toBe("Race to X Points");
      });
    });
  });
});
