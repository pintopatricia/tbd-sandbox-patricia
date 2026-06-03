import { updateSearchHistory, getSportsSearchHistory, updateGamingSearchHistory } from "./search-history-helper.web";

jest.mock("i18next", () => ({
  language: "en",
}));

global.window = Object.create(window);
Object.defineProperty(window, "localStorage", {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
  },
});

const newSearchTerm = "test1";
const mockLocalStorage = ["test1"];
const mockFullLocalStorage = ["test2", "test1", "test3", "test4", "test5"];
const newSearchTerm6 = "test6";

describe("updateSearchHistory", () => {
  it("should not call localStorage when the new term has less than 3 characters", () => {
    updateGamingSearchHistory("");
    expect(window.localStorage.getItem).not.toHaveBeenCalled();
  });

  it("should call localStorage when the new term has more than 3 characters", () => {
    updateGamingSearchHistory(newSearchTerm);
    expect(window.localStorage.setItem).toHaveBeenCalledWith("recentSearches_en", JSON.stringify(mockLocalStorage));
  });

  it("should move the new search term on first position in localStorage if the term already exists", () => {
    window.localStorage.getItem.mockReturnValueOnce(JSON.stringify(mockFullLocalStorage));
    const expectedNewLocalStorage = ["test1", "test2", "test3", "test4", "test5"];
    updateGamingSearchHistory(newSearchTerm);
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      "recentSearches_en",
      JSON.stringify(expectedNewLocalStorage),
    );
  });

  it("should eliminate the last term if the localStorage already has 5 values and a new search term is send", () => {
    window.localStorage.getItem.mockReturnValueOnce(JSON.stringify(mockFullLocalStorage));
    const expectedNewLocalStorage = ["test6", "test2", "test1", "test3", "test4"];
    updateGamingSearchHistory(newSearchTerm6);
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      "recentSearches_en",
      JSON.stringify(expectedNewLocalStorage),
    );
  });
});

describe("sportsSearchHistory", () => {
  it("should call localStorage with the correct key for sports search history", () => {
    updateSearchHistory(newSearchTerm, "sportsSearchHistory");
    expect(window.localStorage.setItem).toHaveBeenCalledWith("sportsSearchHistory", JSON.stringify(mockLocalStorage));

    getSportsSearchHistory();
    expect(window.localStorage.getItem).toHaveBeenCalledWith("sportsSearchHistory");
  });
});
