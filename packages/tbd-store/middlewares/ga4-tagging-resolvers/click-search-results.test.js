import { buildClickSearchResultsEvent } from "tagging-library";
import { getSearchLinkClickEvent } from "./click-search-results";

jest.mock("tagging-library", () => ({
  buildClickSearchResultsEvent: jest.fn().mockReturnValue("click search results event"),
}));

jest.mock("./helpers", () => ({
  getModuleData: jest.fn((...value) => value.filter(Boolean).join(" - ")),
  getCurrentUrlOrViewType: jest.fn(() => "url or view"),
}));

describe("click search results", () => {
  describe("getSearchLinkClickEvent", () => {
    it("should call buildClickSearchResultsEvent with the correct payload", () => {
      const result = getSearchLinkClickEvent({
        payload: { text: "text", order: 2, name: "name", numberOfResults: 4, url: "destinationUrl" },
      });

      expect(buildClickSearchResultsEvent).toHaveBeenCalledWith({
        searchTerm: "text",
        searchCount: "4",
        elementText: "name",
        module: "search results - url or view",
        searchIndex: "2",
        eventContext: "destinationUrl",
      });
      expect(result).toBe("click search results event");
    });
  });
});
