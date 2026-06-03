import { PebbleCardGroupIcon } from "../../../../../clients/catalogue/catalogue-response-types";

import normalizePebbleCardGroupFragmentIntoPebbleCardGroup from "./pebble-card-group-normalizer";

jest.mock("../../translatable-text/translatable-text-normalizer", () =>
  jest.fn(() => ({ data: { translated: "mocked translation" } })),
);

const BFF_RESPONSE = {
  __typename: "PebbleCardGroup",
  urn: "ppb:tbd:card:pebbleCard:30112978.1735|PLACES",
  favouriteMarketsState: null,
  pebbleCardGroupTitle: { translated: "Places" },
  pebbleCardGroupIcon: PebbleCardGroupIcon.PriceBoost,
  pebbleExpanded: true,
  viewOpenBets: {
    viewUrl: "url",
    viewUrn: "ppb:urn?=1.1",
  },
  partials: {
    edges: [
      {
        name: "3 Places",
        node: {
          __typename: "MarketCard",
          urn: "ppb:tbd:card:market:1.175262306;924.244997857|25",
        },
      },
      {
        name: "3 Places",
        node: {
          __typename: "MarketCard",
          urn: "ppb:tbd:card:market:1.175262304;924.244997853|25",
        },
      },
      {
        name: "Not To Be Placed",
        node: {
          __typename: "MarketCard",
          urn: "ppb:tbd:card:market:924.244997858|25",
        },
      },
    ],
  },
};

const BFF_PARTIAL_RESPONSE = {
  __typename: "PebbleCardGroup",
  urn: "ppb:tbd:card:pebbleCard:30112978.1735|PLACES",
  pebbleCardGroupTitle: { translated: "Places" },
  pebbleExpanded: true,
};

describe("PebbleCardGroup normalizer", () => {
  beforeEach(jest.clearAllMocks);

  describe("normalizePebbleCardGroupFragmentIntoPebbleCardGroup", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizePebbleCardGroupFragmentIntoPebbleCardGroup(BFF_RESPONSE);

      expect(data).toEqual({
        items: [
          {
            name: "3 Places",
            typename: "MarketCard",
            urn: "ppb:tbd:card:market:1.175262306;924.244997857|25",
          },
          {
            name: "3 Places",
            typename: "MarketCard",
            urn: "ppb:tbd:card:market:1.175262304;924.244997853|25",
          },
          {
            name: "Not To Be Placed",
            typename: "MarketCard",
            urn: "ppb:tbd:card:market:924.244997858|25",
          },
        ],
        title: { translated: "mocked translation" },
        icon: PebbleCardGroupIcon.PriceBoost,
        pebbleExpanded: true,
        viewOpenBets: {
          viewUrl: "url",
          viewUrn: "ppb:urn?=1.1",
        },
        typename: "PebbleCardGroup",
        urn: "ppb:tbd:card:pebbleCard:30112978.1735|PLACES",
      });
    });

    it("should correctly transform and return the data object when no title is received", () => {
      const BFF_RESPONSE_NO_TITLE = {
        ...BFF_RESPONSE,
        pebbleCardGroupTitle: null,
      };

      const { data } = normalizePebbleCardGroupFragmentIntoPebbleCardGroup(BFF_RESPONSE_NO_TITLE);

      expect(data).toEqual({
        items: [
          {
            name: "3 Places",
            typename: "MarketCard",
            urn: "ppb:tbd:card:market:1.175262306;924.244997857|25",
          },
          {
            name: "3 Places",
            typename: "MarketCard",
            urn: "ppb:tbd:card:market:1.175262304;924.244997853|25",
          },
          {
            name: "Not To Be Placed",
            typename: "MarketCard",
            urn: "ppb:tbd:card:market:924.244997858|25",
          },
        ],
        title: undefined,
        icon: PebbleCardGroupIcon.PriceBoost,
        pebbleExpanded: true,
        viewOpenBets: {
          viewUrl: "url",
          viewUrn: "ppb:urn?=1.1",
        },
        typename: "PebbleCardGroup",
        urn: "ppb:tbd:card:pebbleCard:30112978.1735|PLACES",
      });
    });

    it("should correctly transform and return the data object when no items received", () => {
      const BFF_RESPONSE_NO_ITEMS = {
        ...BFF_RESPONSE,
        partials: {
          ...BFF_RESPONSE.partials,
          edges: [],
        },
      };
      const { data } = normalizePebbleCardGroupFragmentIntoPebbleCardGroup(BFF_RESPONSE_NO_ITEMS);

      expect(data).toEqual({
        items: [],
        title: { translated: "mocked translation" },
        icon: PebbleCardGroupIcon.PriceBoost,
        pebbleExpanded: true,
        viewOpenBets: {
          viewUrl: "url",
          viewUrn: "ppb:urn?=1.1",
        },
        typename: "PebbleCardGroup",
        urn: "ppb:tbd:card:pebbleCard:30112978.1735|PLACES",
      });
    });

    it("should correctly transform and return the data object when no pebbleExpanded is received", () => {
      const BFF_RESPONSE_NO_PEBBLE_STATE = {
        ...BFF_RESPONSE,
        pebbleExpanded: null,
      };

      const { data } = normalizePebbleCardGroupFragmentIntoPebbleCardGroup(BFF_RESPONSE_NO_PEBBLE_STATE);

      expect(data).toEqual({
        items: [
          {
            name: "3 Places",
            typename: "MarketCard",
            urn: "ppb:tbd:card:market:1.175262306;924.244997857|25",
          },
          {
            name: "3 Places",
            typename: "MarketCard",
            urn: "ppb:tbd:card:market:1.175262304;924.244997853|25",
          },
          {
            name: "Not To Be Placed",
            typename: "MarketCard",
            urn: "ppb:tbd:card:market:924.244997858|25",
          },
        ],
        title: { translated: "mocked translation" },
        icon: PebbleCardGroupIcon.PriceBoost,
        viewOpenBets: {
          viewUrl: "url",
          viewUrn: "ppb:urn?=1.1",
        },
        pebbleExpanded: null,
        typename: "PebbleCardGroup",
        urn: "ppb:tbd:card:pebbleCard:30112978.1735|PLACES",
      });
    });

    it("should correctly transform and return the data object when no viewOpenBets is received", () => {
      const BFF_RESPONSE_NO_OPEN_BETS = {
        ...BFF_RESPONSE,
        viewOpenBets: null,
      };

      const { data } = normalizePebbleCardGroupFragmentIntoPebbleCardGroup(BFF_RESPONSE_NO_OPEN_BETS);

      expect(data).toEqual({
        items: [
          {
            name: "3 Places",
            typename: "MarketCard",
            urn: "ppb:tbd:card:market:1.175262306;924.244997857|25",
          },
          {
            name: "3 Places",
            typename: "MarketCard",
            urn: "ppb:tbd:card:market:1.175262304;924.244997853|25",
          },
          {
            name: "Not To Be Placed",
            typename: "MarketCard",
            urn: "ppb:tbd:card:market:924.244997858|25",
          },
        ],
        title: { translated: "mocked translation" },
        icon: PebbleCardGroupIcon.PriceBoost,
        pebbleExpanded: true,
        typename: "PebbleCardGroup",
        urn: "ppb:tbd:card:pebbleCard:30112978.1735|PLACES",
      });
    });

    describe("when is a partial PebbleCardGroup", () => {
      it("should correctly transform and return the data object with title and pebbleExpanded", () => {
        const { data } = normalizePebbleCardGroupFragmentIntoPebbleCardGroup(BFF_PARTIAL_RESPONSE);

        expect(data).toEqual({
          title: { translated: "mocked translation" },
          pebbleExpanded: true,
          typename: "PebbleCardGroup",
          urn: "ppb:tbd:card:pebbleCard:30112978.1735|PLACES",
        });
      });
    });

    it("should set icon as undefined when no pebbleCardGroupIcon is received", () => {
      const response = {
        ...BFF_RESPONSE,
        pebbleCardGroupIcon: null,
      };

      const { data } = normalizePebbleCardGroupFragmentIntoPebbleCardGroup(response);

      expect(data.icon).toBeUndefined();
    });

    it("should normalize outerTitle when provided", () => {
      const response = {
        ...BFF_RESPONSE,
        outerTitle: { translated: "Outer" },
      };

      const { data } = normalizePebbleCardGroupFragmentIntoPebbleCardGroup(response);

      expect(data.outerTitle).toEqual({ translated: "mocked translation" });
    });

    it("should map viewAll label using DisplayNameTitle.name", () => {
      const response = {
        ...BFF_RESPONSE,
        viewAll: {
          title: { __typename: "DisplayNameTitle", name: "Title name" },
          viewLink: "viewLink mock",
        },
      };

      const { data } = normalizePebbleCardGroupFragmentIntoPebbleCardGroup(response);

      expect(data.viewAll).toEqual({ label: "Title name", viewLink: "viewLink mock" });
    });

    it("should map viewAll label using translationKey when no DisplayNameTitle is provided", () => {
      const response = {
        ...BFF_RESPONSE,
        viewAll: {
          title: { __typename: "DisplayNameTranslationKey", translationKey: "Title translationKey" },
          viewLink: "viewLink mock",
        },
      };

      const { data } = normalizePebbleCardGroupFragmentIntoPebbleCardGroup(response);

      expect(data.viewAll).toEqual({ label: "Title translationKey", viewLink: "viewLink mock" });
    });

    it("should return selectedItemUrn when provided", () => {
      const response = {
        ...BFF_RESPONSE,
        selectedItemUrn: "ppb:urn:selected",
      };

      const { data } = normalizePebbleCardGroupFragmentIntoPebbleCardGroup(response);

      expect(data.selectedItemUrn).toEqual("ppb:urn:selected");
    });

    it("should derive favouriteMarketsStateURN from favouriteMarketsState", () => {
      const response = {
        ...BFF_RESPONSE,
        favouriteMarketsState: { urn: "ppb:urn:fav-state" },
      };

      const { data } = normalizePebbleCardGroupFragmentIntoPebbleCardGroup(response);

      expect(data.favouriteMarketsStateURN).toEqual("ppb:urn:fav-state");
    });

    it("should skip falsy edges and edges missing urn", () => {
      const response = {
        ...BFF_RESPONSE,
        partials: {
          edges: [
            null,
            { name: "Bad", node: { __typename: "MarketCard" } },
            { name: "Good", node: { __typename: "MarketCard", urn: "ppb:tbd:card:market:GOOD|25" } },
          ],
        },
      };

      const { data } = normalizePebbleCardGroupFragmentIntoPebbleCardGroup(response);

      expect(data.items).toEqual([{ name: "Good", typename: "MarketCard", urn: "ppb:tbd:card:market:GOOD|25" }]);
    });
  });
});
