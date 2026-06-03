import { SelectableItemsFilterOptions } from "../../../../../state/layout/cardgroups/CardGroup.types";
import normalizeSelectableItemsCardGroupFragmentIntoSelectableItemsCardGroup from "./selectable-items-card-group-normalizer";
import { RaceCountriesFilterOptions } from "../../../../../clients/catalogue/catalogue-response-types";

const BFF_RESPONSE = {
  __typename: "SelectableItemsCardGroup",
  urn: "ppb:tbd:cardgroup:selectableItems:Ytki8REAACYA-5OJ/r/7|31647584.1230",
  isSelectableItemsCardGroupHighlighted: true,
  cardGroupTitle: "Title",
  partials: {
    edges: [
      {
        startTime: "2020-11-12T17:00:00.000Z",
        venue: "Cheltenham",
        promotion: {
          signposting: "EXTRA_PLACES",
        },
        node: {
          __typename: "RaceMarketCard",
          urn: "ppb:tbd:card:racemarket:1.175262306;924.244997857|25",
        },
      },
      {
        startTime: "2020-11-12T17:00:00.000Z",
        venue: "Ruby",
        node: {
          __typename: "RaceMarketCard",
          urn: "ppb:tbd:card:racemarket:1.175262304;924.244997853|25",
        },
      },
      {
        startTime: "2020-11-12T17:00:00.000Z",
        venue: "Newcastle",
        node: {
          __typename: "RaceMarketCard",
          urn: "ppb:tbd:card:racemarket:924.244997858|25",
        },
      },
      {
        node: {
          __typename: "HeadToHeadCard",
          urn: "ppb:tbd:card:headToHead:YIA-BhEAACIAMO7n/e/31740873#31740873",
        },
      },
      {
        node: {
          __typename: "TeamFormCard",
          urn: "ppb:tbd:card:teamForm:YIA-BhEAACIAMO7n/e/31740873#31740873",
        },
      },
    ],
  },
  filter: {
    countries: [RaceCountriesFilterOptions.UkAndIre, RaceCountriesFilterOptions.AllCountries],
    defaultCountry: RaceCountriesFilterOptions.UkAndIre,
  },
};

describe("SelectableItemsCardGroup normalizer", () => {
  describe("normalizeSelectableItemsCardGroupFragmentIntoSelectableItemsCardGroup", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizeSelectableItemsCardGroupFragmentIntoSelectableItemsCardGroup(BFF_RESPONSE);

      expect(data).toEqual({
        items: [
          {
            startTime: "2020-11-12T17:00:00.000Z",
            venue: "Cheltenham",
            typename: "RaceMarketCard",
            urn: "ppb:tbd:card:racemarket:1.175262306;924.244997857|25",
            marketPromo: "EXTRA_PLACES",
          },
          {
            startTime: "2020-11-12T17:00:00.000Z",
            venue: "Ruby",
            typename: "RaceMarketCard",
            urn: "ppb:tbd:card:racemarket:1.175262304;924.244997853|25",
          },
          {
            startTime: "2020-11-12T17:00:00.000Z",
            venue: "Newcastle",
            typename: "RaceMarketCard",
            urn: "ppb:tbd:card:racemarket:924.244997858|25",
          },
          {
            typename: "HeadToHeadCard",
            urn: "ppb:tbd:card:headToHead:YIA-BhEAACIAMO7n/e/31740873#31740873",
          },
          {
            typename: "TeamFormCard",
            urn: "ppb:tbd:card:teamForm:YIA-BhEAACIAMO7n/e/31740873#31740873",
          },
        ],
        title: "Title",
        isHighlighted: true,
        typename: "SelectableItemsCardGroup",
        urn: "ppb:tbd:cardgroup:selectableItems:Ytki8REAACYA-5OJ/r/7|31647584.1230",
        filter: {
          countries: [SelectableItemsFilterOptions.UK_AND_IRE, SelectableItemsFilterOptions.ALL_COUNTRIES],
          defaultCountry: SelectableItemsFilterOptions.UK_AND_IRE,
        },
      });
    });

    it("should correctly transform and return the data object when no title is received", () => {
      const BFF_RESPONSE_NO_TITLE = {
        ...BFF_RESPONSE,
        cardGroupTitle: null,
      };

      const { data } = normalizeSelectableItemsCardGroupFragmentIntoSelectableItemsCardGroup(BFF_RESPONSE_NO_TITLE);

      expect(data).toEqual({
        items: [
          {
            startTime: "2020-11-12T17:00:00.000Z",
            venue: "Cheltenham",
            typename: "RaceMarketCard",
            urn: "ppb:tbd:card:racemarket:1.175262306;924.244997857|25",
            marketPromo: "EXTRA_PLACES",
          },
          {
            startTime: "2020-11-12T17:00:00.000Z",
            venue: "Ruby",
            typename: "RaceMarketCard",
            urn: "ppb:tbd:card:racemarket:1.175262304;924.244997853|25",
          },
          {
            startTime: "2020-11-12T17:00:00.000Z",
            venue: "Newcastle",
            typename: "RaceMarketCard",
            urn: "ppb:tbd:card:racemarket:924.244997858|25",
          },
          {
            typename: "HeadToHeadCard",
            urn: "ppb:tbd:card:headToHead:YIA-BhEAACIAMO7n/e/31740873#31740873",
          },
          {
            typename: "TeamFormCard",
            urn: "ppb:tbd:card:teamForm:YIA-BhEAACIAMO7n/e/31740873#31740873",
          },
        ],
        title: undefined,
        isHighlighted: true,
        typename: "SelectableItemsCardGroup",
        urn: "ppb:tbd:cardgroup:selectableItems:Ytki8REAACYA-5OJ/r/7|31647584.1230",
        filter: {
          countries: [SelectableItemsFilterOptions.UK_AND_IRE, SelectableItemsFilterOptions.ALL_COUNTRIES],
          defaultCountry: SelectableItemsFilterOptions.UK_AND_IRE,
        },
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
      const { data } = normalizeSelectableItemsCardGroupFragmentIntoSelectableItemsCardGroup(BFF_RESPONSE_NO_ITEMS);

      expect(data).toEqual({
        items: [],
        title: "Title",
        isHighlighted: true,
        typename: "SelectableItemsCardGroup",
        urn: "ppb:tbd:cardgroup:selectableItems:Ytki8REAACYA-5OJ/r/7|31647584.1230",
        filter: {
          countries: [SelectableItemsFilterOptions.UK_AND_IRE, SelectableItemsFilterOptions.ALL_COUNTRIES],
          defaultCountry: SelectableItemsFilterOptions.UK_AND_IRE,
        },
      });
    });

    it("should correctly transform and return the data object when the title is not defined", () => {
      const BFF_RESPONSE_NO_TITLE = {
        ...BFF_RESPONSE,
        cardGroupTitle: null,
      };
      const { data } = normalizeSelectableItemsCardGroupFragmentIntoSelectableItemsCardGroup(BFF_RESPONSE_NO_TITLE);

      expect(data).toEqual({
        isHighlighted: true,
        title: undefined,
        items: [
          {
            startTime: "2020-11-12T17:00:00.000Z",
            venue: "Cheltenham",
            typename: "RaceMarketCard",
            urn: "ppb:tbd:card:racemarket:1.175262306;924.244997857|25",
            marketPromo: "EXTRA_PLACES",
          },
          {
            startTime: "2020-11-12T17:00:00.000Z",
            venue: "Ruby",
            typename: "RaceMarketCard",
            urn: "ppb:tbd:card:racemarket:1.175262304;924.244997853|25",
          },
          {
            startTime: "2020-11-12T17:00:00.000Z",
            venue: "Newcastle",
            typename: "RaceMarketCard",
            urn: "ppb:tbd:card:racemarket:924.244997858|25",
          },
          {
            typename: "HeadToHeadCard",
            urn: "ppb:tbd:card:headToHead:YIA-BhEAACIAMO7n/e/31740873#31740873",
          },
          {
            typename: "TeamFormCard",
            urn: "ppb:tbd:card:teamForm:YIA-BhEAACIAMO7n/e/31740873#31740873",
          },
        ],
        typename: "SelectableItemsCardGroup",
        urn: "ppb:tbd:cardgroup:selectableItems:Ytki8REAACYA-5OJ/r/7|31647584.1230",
        filter: {
          countries: [SelectableItemsFilterOptions.UK_AND_IRE, SelectableItemsFilterOptions.ALL_COUNTRIES],
          defaultCountry: SelectableItemsFilterOptions.UK_AND_IRE,
        },
      });
    });

    it("should correctly transform and return the data object when an item doesn't have an urn", () => {
      const BFF_RESPONSE_NO_ITEMS = {
        ...BFF_RESPONSE,
        partials: {
          ...BFF_RESPONSE.partials,
          edges: [
            {
              startTime: "2020-11-12T17:00:00.000Z",
              venue: "Cheltenham",
              node: {
                __typename: "RaceMarketCard",
                urn: "ppb:tbd:card:racemarket:1.175262306;924.244997857|25",
              },
            },
            {
              startTime: "2020-11-12T17:00:00.000Z",
              venue: "Ruby",
              node: {},
            },
          ],
        },
      };
      const { data } = normalizeSelectableItemsCardGroupFragmentIntoSelectableItemsCardGroup(BFF_RESPONSE_NO_ITEMS);

      expect(data).toEqual({
        items: [
          {
            startTime: "2020-11-12T17:00:00.000Z",
            venue: "Cheltenham",
            typename: "RaceMarketCard",
            urn: "ppb:tbd:card:racemarket:1.175262306;924.244997857|25",
          },
        ],
        title: "Title",
        isHighlighted: true,
        typename: "SelectableItemsCardGroup",
        urn: "ppb:tbd:cardgroup:selectableItems:Ytki8REAACYA-5OJ/r/7|31647584.1230",
        filter: {
          countries: [SelectableItemsFilterOptions.UK_AND_IRE, SelectableItemsFilterOptions.ALL_COUNTRIES],
          defaultCountry: SelectableItemsFilterOptions.UK_AND_IRE,
        },
      });
    });

    it("should correctly transform and return the data object when an item is a VirtualCardGroupItemEdge", () => {
      const BFF_RESPONSE_VIRTUAL = {
        ...BFF_RESPONSE,
        partials: {
          ...BFF_RESPONSE.partials,
          edges: [
            {
              startTime: "2020-11-12T17:00:00.000Z",
              isClosed: true,
              isDisabled: true,
              __typename: "VirtualCardGroupItemEdge",
              node: {
                __typename: "VirtualCardGroup",
                urn: "ppb:tbd:card:virtual:1.175262306;924.244997857|25",
              },
            },
          ],
        },
      };
      const { data } = normalizeSelectableItemsCardGroupFragmentIntoSelectableItemsCardGroup(BFF_RESPONSE_VIRTUAL);

      expect(data).toEqual({
        items: [
          {
            startTime: "2020-11-12T17:00:00.000Z",
            typename: "VirtualCardGroup",
            isClosed: true,
            isDisabled: true,
            urn: "ppb:tbd:card:virtual:1.175262306;924.244997857|25",
          },
        ],
        title: "Title",
        isHighlighted: true,
        typename: "SelectableItemsCardGroup",
        urn: "ppb:tbd:cardgroup:selectableItems:Ytki8REAACYA-5OJ/r/7|31647584.1230",
        filter: {
          countries: [SelectableItemsFilterOptions.UK_AND_IRE, SelectableItemsFilterOptions.ALL_COUNTRIES],
          defaultCountry: SelectableItemsFilterOptions.UK_AND_IRE,
        },
      });
    });

    it("should correctly transform and return the data object when an filter is empty", () => {
      const BFF_RESPONSE_NO_ITEMS = {
        ...BFF_RESPONSE,
        filter: undefined,
      };
      const { data } = normalizeSelectableItemsCardGroupFragmentIntoSelectableItemsCardGroup(BFF_RESPONSE_NO_ITEMS);

      expect(data).toEqual({
        items: [
          {
            startTime: "2020-11-12T17:00:00.000Z",
            venue: "Cheltenham",
            typename: "RaceMarketCard",
            urn: "ppb:tbd:card:racemarket:1.175262306;924.244997857|25",
            marketPromo: "EXTRA_PLACES",
          },
          {
            startTime: "2020-11-12T17:00:00.000Z",
            venue: "Ruby",
            typename: "RaceMarketCard",
            urn: "ppb:tbd:card:racemarket:1.175262304;924.244997853|25",
          },
          {
            startTime: "2020-11-12T17:00:00.000Z",
            venue: "Newcastle",
            typename: "RaceMarketCard",
            urn: "ppb:tbd:card:racemarket:924.244997858|25",
          },
          {
            typename: "HeadToHeadCard",
            urn: "ppb:tbd:card:headToHead:YIA-BhEAACIAMO7n/e/31740873#31740873",
          },
          {
            typename: "TeamFormCard",
            urn: "ppb:tbd:card:teamForm:YIA-BhEAACIAMO7n/e/31740873#31740873",
          },
        ],
        title: "Title",
        isHighlighted: true,
        typename: "SelectableItemsCardGroup",
        urn: "ppb:tbd:cardgroup:selectableItems:Ytki8REAACYA-5OJ/r/7|31647584.1230",
        filter: undefined,
      });
    });

    it("should correctly transform and return the data object when an filter is defined but countries undefined", () => {
      const BFF_RESPONSE_NO_ITEMS = {
        ...BFF_RESPONSE,
        filter: {
          countries: undefined,
          defaultCountry: RaceCountriesFilterOptions.AllCountries,
        },
      };
      const { data } = normalizeSelectableItemsCardGroupFragmentIntoSelectableItemsCardGroup(BFF_RESPONSE_NO_ITEMS);

      expect(data).toEqual({
        items: [
          {
            startTime: "2020-11-12T17:00:00.000Z",
            venue: "Cheltenham",
            typename: "RaceMarketCard",
            urn: "ppb:tbd:card:racemarket:1.175262306;924.244997857|25",
            marketPromo: "EXTRA_PLACES",
          },
          {
            startTime: "2020-11-12T17:00:00.000Z",
            venue: "Ruby",
            typename: "RaceMarketCard",
            urn: "ppb:tbd:card:racemarket:1.175262304;924.244997853|25",
          },
          {
            startTime: "2020-11-12T17:00:00.000Z",
            venue: "Newcastle",
            typename: "RaceMarketCard",
            urn: "ppb:tbd:card:racemarket:924.244997858|25",
          },
          {
            typename: "HeadToHeadCard",
            urn: "ppb:tbd:card:headToHead:YIA-BhEAACIAMO7n/e/31740873#31740873",
          },
          {
            typename: "TeamFormCard",
            urn: "ppb:tbd:card:teamForm:YIA-BhEAACIAMO7n/e/31740873#31740873",
          },
        ],
        title: "Title",
        isHighlighted: true,
        typename: "SelectableItemsCardGroup",
        urn: "ppb:tbd:cardgroup:selectableItems:Ytki8REAACYA-5OJ/r/7|31647584.1230",
        filter: undefined,
      });
    });

    it("should correctly transform and return the data object when an filter is defined but default isn't", () => {
      const BFF_RESPONSE_NO_ITEMS = {
        ...BFF_RESPONSE,
        filter: {
          countries: [RaceCountriesFilterOptions.UkAndIre, RaceCountriesFilterOptions.AllCountries],
        },
      };
      const { data } = normalizeSelectableItemsCardGroupFragmentIntoSelectableItemsCardGroup(BFF_RESPONSE_NO_ITEMS);

      expect(data).toEqual({
        items: [
          {
            startTime: "2020-11-12T17:00:00.000Z",
            venue: "Cheltenham",
            typename: "RaceMarketCard",
            urn: "ppb:tbd:card:racemarket:1.175262306;924.244997857|25",
            marketPromo: "EXTRA_PLACES",
          },
          {
            startTime: "2020-11-12T17:00:00.000Z",
            venue: "Ruby",
            typename: "RaceMarketCard",
            urn: "ppb:tbd:card:racemarket:1.175262304;924.244997853|25",
          },
          {
            startTime: "2020-11-12T17:00:00.000Z",
            venue: "Newcastle",
            typename: "RaceMarketCard",
            urn: "ppb:tbd:card:racemarket:924.244997858|25",
          },
          {
            typename: "HeadToHeadCard",
            urn: "ppb:tbd:card:headToHead:YIA-BhEAACIAMO7n/e/31740873#31740873",
          },
          {
            typename: "TeamFormCard",
            urn: "ppb:tbd:card:teamForm:YIA-BhEAACIAMO7n/e/31740873#31740873",
          },
        ],
        title: "Title",
        isHighlighted: true,
        typename: "SelectableItemsCardGroup",
        urn: "ppb:tbd:cardgroup:selectableItems:Ytki8REAACYA-5OJ/r/7|31647584.1230",
        filter: {
          countries: [SelectableItemsFilterOptions.UK_AND_IRE, SelectableItemsFilterOptions.ALL_COUNTRIES],
          defaultCountry: SelectableItemsFilterOptions.UK_AND_IRE,
        },
      });
    });
  });
});
