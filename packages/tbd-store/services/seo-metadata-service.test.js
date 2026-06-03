import { SeoMetadataService } from "@flutter-global/uki-channels-http-clients";
import { getMetadata } from "./seo-metadata-service";

jest.mock("@flutter-global/uki-channels-http-clients", () => ({
  SeoMetadataService: jest.fn().mockReturnValue({
    getMetadata: jest.fn(),
  }),
}));

jest.mock("./client-factory", () => ({
  createClientFactory: jest.fn(() => SeoMetadataService),
}));

function setMetadataMock(mock, reject = false) {
  SeoMetadataService().getMetadata.mockReturnValue(reject ? Promise.reject() : Promise.resolve(mock));
}

describe("SeoMetadataService", () => {
  describe("API", () => {
    it("should expose a getMetadata method", () => {
      expect(getMetadata).toBeDefined();
    });
  });

  describe("Behaviour", () => {
    describe("request the metadata from SMD client", () => {
      const metaElements = ["META_TITLE"];
      const pageIdentifier = {
        host: "www.betfair.com",
        language: "en_GB",
        pageType: "HOMEPAGE",
        product: "REBUILD",
        deviceType: "MOBILE",
      };
      const pageData = {};
      const userData = {
        isLoggedIn: false,
      };

      afterAll(jest.clearAllMocks);

      it("should call SeoMetadataService with the correct input", () => {
        getMetadata(metaElements, pageIdentifier, pageData, userData);

        expect(SeoMetadataService().getMetadata).toHaveBeenCalledWith(metaElements, pageData, pageIdentifier, {
          userData,
        });
      });

      it("should return the metadata", async () => {
        setMetadataMock({ metaTitle: "title" });

        const metadata = await getMetadata(metaElements, pageIdentifier, pageData, userData);

        expect(metadata).toEqual({ metaTitle: "title" });
      });
    });
  });
});
