import normalizeObbCardGroupFragmentIntoObbCardGroup from "./obb-card-group-normalizer";

const BFF_RESPONSE = {
  __typename: "ObbCardGroup",
  urn: "ppb:tbd:obb:cards-group:1",
  event: { openDate: "2024-11-11T19:00:00.000Z" },
  obbCardGroupTitle: {
    __typename: "DisplayNameTitle",
    name: "Bet Different",
  },
  obbCardGroupSections: {
    __typename: "ObbSectionsConnection",
    edges: [
      {
        node: {
          __typename: "ObbSection",
          urn: "ppb:obb:section:xpto/e/b65dbf9d",
          obbSectionTitle: {
            name: "Shots",
            __typename: "DisplayNameTitle",
          },
          icon: null,
          isExpanded: true,
          layouts: {
            __typename: "ObbCardsLayoutConnection",
            edges: [
              {
                node: {
                  __typename: "ObbCardsStackedLayout",
                  urn: "ppb:obb:cardslayout:stacked:xpto/obb_cards_layout$b65dbf9d",
                  title: {
                    name: "Build Ups - choose your match",
                    __typename: "DisplayNameTitle",
                  },
                  cards: {
                    edges: [
                      {
                        node: {
                          __typename: "ObbPvpCard",
                          urn: "ppb:tbd:obb:card:pvp:1",
                        },
                      },
                    ],
                  },
                },
              },
            ],
          },
        },
      },
    ],
  },
  filterTags: [
    {
      label: {
        __typename: "DisplayNameTitle",
        name: "Shots On Target",
      },
      type: "TAG",
      __typename: "FilterTag",
    },
  ],
};

describe("OBB card group normalizer", () => {
  describe("normalizeObbCardGroupFragmentIntoObbCardGroup", () => {
    describe("when receiving valid props", () => {
      it("should correctly transform and return the data object", () => {
        const { data } = normalizeObbCardGroupFragmentIntoObbCardGroup(BFF_RESPONSE);

        expect(data).toStrictEqual({
          urn: "ppb:tbd:obb:cards-group:1",
          typename: "ObbCardGroup",
          title: "Bet Different",
          event: { openDate: "2024-11-11T19:00:00.000Z" },
          bettingWindowOffset: undefined,
          moreInfoDetails: undefined,
          moreInfoLabel: undefined,
          showFilterTags: undefined,
          sections: [
            {
              typename: "ObbSection",
              urn: "ppb:obb:section:xpto/e/b65dbf9d",
              title: "Shots",
              icon: null,
              isExpanded: true,
              layouts: [
                {
                  typename: "ObbCardsStackedLayout",
                  urn: "ppb:obb:cardslayout:stacked:xpto/obb_cards_layout$b65dbf9d",
                  title: "Build Ups - choose your match",
                  maxCardsToDisplay: undefined,
                  isSelected: true,
                  badge: undefined,
                  items: [{ urn: "ppb:tbd:obb:card:pvp:1", typename: "ObbPvpCard", filterTags: undefined }],
                },
              ],
            },
          ],
          filterTags: [
            {
              label: "Shots On Target",
              type: "TAG",
            },
          ],
          sectionExpansionOverrideByFilter: {},
        });
      });
    });

    describe("when receiving moreInfo and moreInfoLabel", () => {
      it("should correctly transform and return the data object", () => {
        const BFF_RESPONSE_WITH_MORE_INFO = {
          ...BFF_RESPONSE,
          moreInfoLabel: {
            __typename: "DisplayNameTitle",
            name: "More Info",
          },
          moreInfo: {
            moreInfoDetails: [
              null,
              {
                type: "heading5",
                text: "Race To X Points",
                spans: null,
              },
              {
                type: "url_link",
                text: "Handicap & Points Doubles",
                spans: [
                  {
                    start: 0,
                    end: 25,
                    style: "undefined",
                    viewLink: {
                      viewUrl: "https://someurl.com",
                      viewUrn: "ppb:tbd:view:external:external",
                      viewDisplayMode: "BLANK_INAPP",
                    },
                    __typename: "RichTextSpan",
                  },
                ],
              },
            ],
          },
        };

        const { data } = normalizeObbCardGroupFragmentIntoObbCardGroup(BFF_RESPONSE_WITH_MORE_INFO);

        expect(data).toStrictEqual({
          urn: "ppb:tbd:obb:cards-group:1",
          typename: "ObbCardGroup",
          title: "Bet Different",
          event: { openDate: "2024-11-11T19:00:00.000Z" },
          bettingWindowOffset: undefined,
          showFilterTags: undefined,
          sections: [
            {
              typename: "ObbSection",
              urn: "ppb:obb:section:xpto/e/b65dbf9d",
              title: "Shots",
              icon: null,
              isExpanded: true,
              layouts: [
                {
                  typename: "ObbCardsStackedLayout",
                  urn: "ppb:obb:cardslayout:stacked:xpto/obb_cards_layout$b65dbf9d",
                  title: "Build Ups - choose your match",
                  maxCardsToDisplay: undefined,
                  isSelected: true,
                  badge: undefined,
                  items: [{ urn: "ppb:tbd:obb:card:pvp:1", typename: "ObbPvpCard", filterTags: undefined }],
                },
              ],
            },
          ],
          moreInfoDetails: [
            null,
            {
              spans: [],
              text: "Race To X Points",
              type: "heading5",
            },
            {
              spans: [
                {
                  end: 25,
                  start: 0,
                  style: "span",
                  viewLink: {
                    viewDisplayMode: "BLANK_INAPP",
                    viewUrn: "ppb:tbd:view:external:external",
                    viewUrl: "https://someurl.com",
                  },
                },
              ],
              text: "Handicap & Points Doubles",
              type: "url_link",
            },
          ],
          moreInfoLabel: "More Info",
          filterTags: [
            {
              label: "Shots On Target",
              type: "TAG",
            },
          ],
          sectionExpansionOverrideByFilter: {},
        });
      });
    });
  });
});
