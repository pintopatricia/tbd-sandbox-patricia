import { GamingGlobalSearch } from "@flutter-global/uki-channels-http-clients";
import GamingGlobalSearchClient from "./gaming-global-search";

jest.mock("@flutter-global/uki-channels-http-clients", () => ({
  GamingGlobalSearch: jest.fn().mockReturnValue({
    searchResults: jest.fn(),
  }),
}));

jest.mock("./client-factory", () => ({
  createClientFactory: jest.fn(() => GamingGlobalSearch),
}));

function setup(mock, query, locale, jurisdiction) {
  const gamingGlobalSearch = GamingGlobalSearch(query, locale, jurisdiction);
  gamingGlobalSearch.searchResults.mockReturnValue(Promise.resolve(mock));
  return gamingGlobalSearch;
}

const mockedData = {
  results: 40,
  content: [
    {
      id: "XyuVRRAAACMA4m1m",
      uid: "live-age-of-the-gods-roulette-cptl",
      data: {
        name: [
          {
            type: "heading1",
            text: "Casino PT Live Age of the Gods Bonus Roulette",
          },
        ],
        display_name: [
          {
            type: "heading2",
            text: "Live Age of the Gods Bonus Roulette",
          },
        ],
        internal_code: "live-age-of-the-gods-roulette-cptl",
        main_product: {
          uid: "casino",
        },
        rgs_code_mobile: "aogrol",
        feeds_code_desktop: "103533",
        feeds_code_mobile: "103533_103572",
        provider: {
          data: {
            name: [
              {
                type: "heading1",
                text: "Playtech - Live",
              },
            ],
          },
        },
        logo: [
          {
            image: {
              url: "https://gmimages.cdnppb.net/betfair-com/6560f7c0-563d-464c-9fa0-e850b661b3b6_DESIGNS-65813_BF-Live_Casino_AOTG_Bonus_Roulette_logo.png?auto=compress&q=60&rect=0,0,900,900&w=900&h=900",
              medium: {
                url: "https://gmimages.cdnppb.net/betfair-com/6560f7c0-563d-464c-9fa0-e850b661b3b6_DESIGNS-65813_BF-Live_Casino_AOTG_Bonus_Roulette_logo.png?auto=compress&q=60&rect=0,0,900,900&w=450&h=450",
              },
              small: {
                url: "https://gmimages.cdnppb.net/betfair-com/6560f7c0-563d-464c-9fa0-e850b661b3b6_DESIGNS-65813_BF-Live_Casino_AOTG_Bonus_Roulette_logo.png?auto=compress&q=60&rect=0,0,900,900&w=225&h=225",
              },
            },
          },
        ],
        background: [
          {
            image: {
              url: "https://gmimages.cdnppb.net/betfair-com/6b5fef7f-77d2-4005-9789-7364f6c35b4f_DESIGNS-65813_BF-Live_Casino_AOTG_Bonus_Roulette_bg.jpg?auto=compress&q=60&rect=0,0,900,900&w=900&h=900",
              medium: {
                url: "https://gmimages.cdnppb.net/betfair-com/6b5fef7f-77d2-4005-9789-7364f6c35b4f_DESIGNS-65813_BF-Live_Casino_AOTG_Bonus_Roulette_bg.jpg?auto=compress&q=60&rect=0,0,900,900&w=450&h=450",
              },
              small: {
                url: "https://gmimages.cdnppb.net/betfair-com/6b5fef7f-77d2-4005-9789-7364f6c35b4f_DESIGNS-65813_BF-Live_Casino_AOTG_Bonus_Roulette_bg.jpg?auto=compress&q=60&rect=0,0,900,900&w=225&h=225",
              },
            },
          },
        ],
        flattened: [
          {
            image: {
              url: "https://gmimages.cdnppb.net/betfair-com/5549b3b6-b147-4abb-b5e8-e4a1a5597ff8_DESIGNS-65813_BF-Live_Casino_AOTG_Bonus_Roulette_flat.jpg?auto=compress&q=60&rect=0,0,900,900&w=900&h=900",
              medium: {
                url: "https://gmimages.cdnppb.net/betfair-com/5549b3b6-b147-4abb-b5e8-e4a1a5597ff8_DESIGNS-65813_BF-Live_Casino_AOTG_Bonus_Roulette_flat.jpg?auto=compress&q=60&rect=0,0,900,900&w=450&h=450",
              },
              small: {
                url: "https://gmimages.cdnppb.net/betfair-com/5549b3b6-b147-4abb-b5e8-e4a1a5597ff8_DESIGNS-65813_BF-Live_Casino_AOTG_Bonus_Roulette_flat.jpg?auto=compress&q=60&rect=0,0,900,900&w=225&h=225",
              },
            },
          },
        ],
        background_color: "1E1E1E - betfair",
        label: "Jackpot",
        jackpot_logo: "Progressive jackpot",
        copyright_text: null,
        rtp: "94.74% - 95.73%",
      },
      infoPage: {
        url: "https://xcasino.betfair.com/game/live-age-of-the-gods-roulette-cptl",
        isExternalUrl: false,
      },
    },
  ],
};

describe("GamingGlobalSearch service", () => {
  describe("searchResults", () => {
    it("should return search results when service returns it", async () => {
      await setup(mockedData, "roulette", "en_GB", "INTERNATIONAL");
      const searchResult = await GamingGlobalSearchClient.getGamingSearchResults("roulette", "en_GB", "INTERNATIONAL");
      expect(searchResult).toEqual({
        didYouMean: null,
        items: [
          {
            urn: "ppb:tbd:card:gaming:game:uid/live-age-of-the-gods-roulette-cptl",
            name: "Live Age of the Gods Bonus Roulette",
            type: "GAME_SEARCH_RESULT_ITEM",
          },
        ],
        query: "roulette",
        startIndex: 0,
        pageSize: 0,
      });
    });

    it("should call searchResults with jurisdiction param", async () => {
      const gamingGlobalSearch = await setup(mockedData, "roulette", "en_GB", "SPAIN");
      await GamingGlobalSearchClient.getGamingSearchResults("roulette", "en_GB", "SPAIN");
      expect(gamingGlobalSearch.searchResults).toHaveBeenCalledWith("roulette", "en_GB", "SPAIN");
    });

    it("should not return search result when service doesn't return it", async () => {
      await setup({
        results: 40,
        content: [],
      });
      const searchResult = await GamingGlobalSearchClient.getGamingSearchResults("roulette");
      expect(searchResult).toEqual({
        pageSize: 0,
        startIndex: 0,
        didYouMean: null,
        items: [],
        query: "roulette",
      });
    });
  });
});
