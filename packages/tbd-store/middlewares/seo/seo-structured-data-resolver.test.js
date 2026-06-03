import { dataBuildersByCardType } from "./seo-structured-data-builders";
import { resolveSeoStructuredData, resolveFAQStructuredData } from "./seo-structured-data-resolver";
import { getLayoutSnapshot } from "../../state/layout-snapshot";

jest.mock("../../state/layout-snapshot", () => ({
  getLayoutSnapshot: jest.fn(),
}));

jest.mock("./seo-structured-data-builders", () => ({
  dataBuildersByCardType: {
    EventMarketCard: jest.fn(() => "event-market-card-mocked-data"),
  },
  getFAQDataByContentSummaryCard: jest.fn(() => "faq-data-mocked-data"),
}));

const mockState = {
  router: { currentUrn: "urn:foo" },
};

describe("Seo Structured Data Resolver", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("resolveSeoStructuredData", () => {
    it("should return an empty array if no cards are found", () => {
      getLayoutSnapshot.mockReturnValue({
        "urn:foo": {
          typename: "UnsupportedCard",
        },
      });

      const result = resolveSeoStructuredData(mockState);

      expect(getLayoutSnapshot).toHaveBeenCalledWith("urn:foo");
      expect(result).toEqual([]);
    });

    it("should return the metadata if cards are found", () => {
      getLayoutSnapshot.mockReturnValue({
        "urn:foo": {
          typename: "EventMarketCard",
        },
      });

      const result = resolveSeoStructuredData(mockState);

      expect(getLayoutSnapshot).toHaveBeenCalledWith("urn:foo");
      expect(dataBuildersByCardType.EventMarketCard).toHaveBeenCalledWith("urn:foo", mockState);
      expect(result).toEqual(["event-market-card-mocked-data"]);
    });
  });

  describe("resolveFAQStructuredData", () => {
    it("should return undefined when no ContentSummaryCard is found", () => {
      getLayoutSnapshot.mockReturnValue({
        "urn:foo": {
          typename: "EventMarketCard",
        },
      });

      const result = resolveFAQStructuredData(mockState);

      expect(getLayoutSnapshot).toHaveBeenCalledWith("urn:foo");
      expect(result).toBeUndefined();
    });

    it("should return FAQ data when ContentSummaryCard is found", () => {
      getLayoutSnapshot.mockReturnValue({
        "urn:foo": {
          typename: "ContentSummaryCard",
        },
      });

      const result = resolveFAQStructuredData(mockState);

      expect(getLayoutSnapshot).toHaveBeenCalledWith("urn:foo");
      expect(result).toEqual("faq-data-mocked-data");
    });
  });
});
