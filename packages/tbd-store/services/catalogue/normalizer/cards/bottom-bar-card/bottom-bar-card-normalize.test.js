import normalizeBottomBarFragmentIntoBottomBar from "./bottom-bar-card-normalizer";

const BFF_RESPONSE = {
  hasProductSwitcher: true,
  tiles: [
    {
      tileType: "HOME",
      viewLink: {
        viewUrn: "ppb:tbd:view:generic:home",
        viewUrl: "",
      },
    },
    {
      tileType: "BROWSE",
      viewLink: {
        viewUrn: "ppb:tbd:view:browse:sports",
        viewUrl: "browse/browse:sports",
      },
    },
  ],
};

describe("Bottom bar normalizer", () => {
  describe("normalizeBottomBarFragmentIntoBottomBar", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizeBottomBarFragmentIntoBottomBar(BFF_RESPONSE);

      expect(data).toEqual({
        hasProductSwitcher: true,
        tiles: [
          {
            tileType: "HOME",
            viewLink: {
              viewUrn: "ppb:tbd:view:generic:home",
              viewUrl: "",
            },
          },
          {
            tileType: "BROWSE",
            viewLink: {
              viewUrn: "ppb:tbd:view:browse:sports",
              viewUrl: "browse/browse:sports",
            },
          },
        ],
      });
    });

    it("should correctly transform and return the data object 1 viewLink is empty", () => {
      BFF_RESPONSE.tiles[1].viewLink = null;
      BFF_RESPONSE.hasProductSwitcher = false;

      const { data } = normalizeBottomBarFragmentIntoBottomBar(BFF_RESPONSE);

      expect(data).toEqual({
        hasProductSwitcher: false,
        tiles: [
          {
            tileType: "HOME",
            viewLink: {
              viewUrn: "ppb:tbd:view:generic:home",
              viewUrl: "",
            },
          },
        ],
      });
    });
  });
});
