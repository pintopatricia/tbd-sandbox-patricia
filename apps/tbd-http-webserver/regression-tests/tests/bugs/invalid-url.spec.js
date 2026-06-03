const { getMockingService } = require("@ppb/bff-mocking-server-common");

const { requestAccessControl } = getMockingService();

describe("Invalid URL for decodeURI", () => {
  let result;

  describe(`when a user sends an url that is malformed`, () => {
    beforeAll(async () => {
      result = await requestAccessControl({
        baseHref: `/betting/casino/api/%d4/%27%22teste`,
        language: "pt_BR",
        locale: "pt_BR",
      });
    });

    it("[THISISF-200] should redirect to the homepage", async () => {
      expect(result.status).toEqual(302);
      expect(result.data).toEqual("Found. Redirecting to https://www.betfair.com/");
    });
  });
});
