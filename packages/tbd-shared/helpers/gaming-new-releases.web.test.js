import { getStoredNewestReleasedGames, initNewReleases, updateSeenGames } from "./gaming-new-releases.web";

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

const newReleases = ["slots-o-cashpots-jpk-abp", "game-name-36", "rich-roulette-abc"];
const newReleasesContainingSeenGame = ["slots-o-cashpots-jpk-abp", "game-name-36", "dynamite-riches-art"];

const mockLocalStorageWithSeenGames = {
  new: [],
  seen: ["bonanza-megapays-arx", "well-of-wilds-mgw-art1", "dynamite-riches-art"],
};

const mockEmptyLocalStorage = {
  new: [],
  seen: [],
};

const mockLocalStorage = {
  new: ["slots-o-cashpots-jpk-abp", "game-name-36"],
  seen: ["bonanza-megapays-arx", "well-of-wilds-mgw-art1", "dynamite-riches-art"],
};

describe("initNewReleases", () => {
  const expectedNewLocalStorageContent = {
    new: newReleases,
    seen: [],
  };

  it("should return the an empty local storage object when we don't have new games", () => {
    const result = initNewReleases([]);

    expect(window.localStorage.getItem).not.toHaveBeenCalled();

    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      "newestReleases_en",
      JSON.stringify(mockEmptyLocalStorage),
    );

    expect(result).toEqual(mockEmptyLocalStorage);
  });

  it("should return the correct value when window.localStorage.getItem returns empty array for seen and new and we have new games", () => {
    window.localStorage.getItem.mockReturnValueOnce(null);

    const result = initNewReleases(newReleases);

    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      "newestReleases_en",
      JSON.stringify(expectedNewLocalStorageContent),
    );

    expect(result).toEqual(expectedNewLocalStorageContent);
  });

  it("should return the correct value when window.localStorage.getItem return values for seen and new and we have new games", () => {
    window.localStorage.getItem.mockReturnValueOnce(JSON.stringify(mockLocalStorage));

    const result = initNewReleases(newReleases);

    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      "newestReleases_en",
      JSON.stringify(expectedNewLocalStorageContent),
    );

    expect(result).toEqual(expectedNewLocalStorageContent);
  });

  it("should return the correct value when window.localStorage.getItem return values for seen and we have new games", () => {
    window.localStorage.getItem.mockReturnValueOnce(JSON.stringify(mockLocalStorageWithSeenGames));

    const result = initNewReleases(newReleases);

    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      "newestReleases_en",
      JSON.stringify(expectedNewLocalStorageContent),
    );

    expect(result).toEqual(expectedNewLocalStorageContent);
  });

  it("should return the correct value when window.localStorage.getItem has a new game in seen category", () => {
    window.localStorage.getItem.mockReturnValueOnce(JSON.stringify(mockLocalStorage));

    const expectedNewLocalStorageContentWithSeenGames = {
      new: ["slots-o-cashpots-jpk-abp", "game-name-36"],
      seen: ["dynamite-riches-art"],
    };
    const result = initNewReleases(newReleasesContainingSeenGame);

    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      "newestReleases_en",
      JSON.stringify(expectedNewLocalStorageContentWithSeenGames),
    );

    expect(result).toEqual(expectedNewLocalStorageContentWithSeenGames);
  });
});

describe("getStoredNewestReleasedGames", () => {
  const mockLocalStorageResponse = {
    new: ["bonanza-megapays-arx"],
    seen: ["slots-o-cashpots-jpk-abp", "game-name-36", "rich-roulette-abc"],
  };

  it("should return the correct value when the function is called", () => {
    window.localStorage.getItem.mockReturnValueOnce(JSON.stringify(mockLocalStorageResponse));

    const result = getStoredNewestReleasedGames();

    expect(result).toEqual([...mockLocalStorageResponse.new, ...mockLocalStorageResponse.seen]);
  });
});

describe("updateSeenGames", () => {
  const expectedNewLocalStorageContent = {
    new: [],
    seen: ["game-name-36", "bonanza-megapays-arx"],
  };
  const mockLocalStorageResponse = {
    new: ["bonanza-megapays-arx"],
    seen: ["game-name-36"],
  };

  it("should return the correct value when the seen games is in the window.localStorage.getItem new category", () => {
    window.localStorage.getItem.mockReturnValueOnce(JSON.stringify(mockLocalStorageResponse));

    updateSeenGames("bonanza-megapays-arx");

    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      "newestReleases_en",
      JSON.stringify(expectedNewLocalStorageContent),
    );
  });
});
