import normalizeMyBetsViewFragmentIntoMyBetsView from "./my-bets-view-normalizer";

const BFF_RESPONSE = {
  __typename: "MyBetsView",
  urn: "ppb:tbd:view:myBets:open",
  url: "mybets/myBets-open",
  filters: {
    orderType: { items: ["OPEN", "SETTLED"], defaultIndex: 0 },
    productType: { items: ["EXCHANGE", "SPORTSBOOK"], defaultIndex: 1 },
    marketIds: ["1.1"],
    totalDaysRange: 2,
    hasHeritageBets: true,
    isHeritageView: true,
  },
  transactionHistoryLink: {
    viewUrn: "ppb:tbd:view:external:external",
    viewUrl: "brand.com/transactions/",
    __typename: "ViewLink",
  },
  hasEmptyStateImage: true,
  items: {
    edges: [
      { node: { __typename: "BetCardGroup", urn: "ppb:tbd:card:bet:group:1107046171", otherData: "otherData" } },
      { node: { __typename: "RegulatoryCard", urn: "ppb:tbd:card:regulatory:footer", otherData: "otherData" } },
    ],
    pageInfo: { endCursor: "MQ==", hasNextPage: false },
  },
  bottomBar: {
    tiles: [],
  },
  regulatoryData: {
    sections: [],
  },
  headerItems: {
    edges: [
      {
        node: { __typename: "GenericSwitcherCard", urn: "ppb:tbd:card:genericswitcher:mybets", otherData: "otherData" },
      },
    ],
    pageInfo: null,
  },
};

describe("MyBets view normalizer", () => {
  describe("normalizeMyBetsViewFragmentIntoMyBetsView", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizeMyBetsViewFragmentIntoMyBetsView(BFF_RESPONSE);

      expect(data).toEqual({
        filters: {
          orderType: {
            defaultIndex: 0,
            items: ["open", "settled"],
          },
          productType: {
            defaultIndex: 1,
            items: ["exc", "sbk"],
          },
          marketIds: ["1.1"],
          matchedStatus: undefined,
          totalDaysRange: 2,
          hasHeritageBets: true,
          isHeritageView: true,
        },
        transactionHistoryLink: {
          viewUrn: "ppb:tbd:view:external:external",
          viewUrl: "brand.com/transactions/",
          __typename: "ViewLink",
        },
        hasEmptyStateImage: true,
        items: [
          {
            typename: "BetCardGroup",
            urn: "ppb:tbd:card:bet:group:1107046171",
          },
          {
            typename: "RegulatoryCard",
            urn: "ppb:tbd:card:regulatory:footer",
          },
        ],
        pageInfo: {
          endCursor: "MQ==",
          hasNextPage: false,
        },
        typename: "MyBetsView",
        url: "mybets/myBets-open",
        urn: "ppb:tbd:view:myBets:open",
        headerItems: [
          {
            typename: "GenericSwitcherCard",
            urn: "ppb:tbd:card:genericswitcher:mybets",
          },
        ],
      });
    });

    describe("when matchedStatus filters are available on fragment", () => {
      it("should correctly transform and return the data object", () => {
        const { data } = normalizeMyBetsViewFragmentIntoMyBetsView({
          ...BFF_RESPONSE,
          filters: {
            ...BFF_RESPONSE.filters,
            matchedStatus: {
              items: [
                {
                  filterURN: "ppb:tbd:view:myBets:open?=matchedStatus=unmatched",
                  filter: "UNMATCHED",
                  numberOfBets: 5,
                },
                {
                  filterURN: "ppb:tbd:view:myBets:open?=matchedStatus=matched",
                  filter: "MATCHED",
                  numberOfBets: 10,
                },
              ],
              defaultIndex: 1,
            },
          },
        });

        expect(data).toEqual({
          filters: {
            orderType: {
              defaultIndex: 0,
              items: ["open", "settled"],
            },
            productType: {
              defaultIndex: 1,
              items: ["exc", "sbk"],
            },
            marketIds: ["1.1"],
            matchedStatus: {
              defaultIndex: 1,
              items: [
                {
                  filterURN: "ppb:tbd:view:myBets:open?=matchedStatus=unmatched",
                  filter: "unmatched",
                  numberOfBets: 5,
                },
                {
                  filterURN: "ppb:tbd:view:myBets:open?=matchedStatus=matched",
                  filter: "matched",
                  numberOfBets: 10,
                },
              ],
            },
            totalDaysRange: 2,
            hasHeritageBets: true,
            isHeritageView: true,
          },
          transactionHistoryLink: {
            viewUrn: "ppb:tbd:view:external:external",
            viewUrl: "brand.com/transactions/",
            __typename: "ViewLink",
          },
          hasEmptyStateImage: true,
          items: [
            {
              typename: "BetCardGroup",
              urn: "ppb:tbd:card:bet:group:1107046171",
            },
            {
              typename: "RegulatoryCard",
              urn: "ppb:tbd:card:regulatory:footer",
            },
          ],
          pageInfo: {
            endCursor: "MQ==",
            hasNextPage: false,
          },
          typename: "MyBetsView",
          url: "mybets/myBets-open",
          urn: "ppb:tbd:view:myBets:open",
          headerItems: [
            {
              typename: "GenericSwitcherCard",
              urn: "ppb:tbd:card:genericswitcher:mybets",
            },
          ],
        });
      });
    });
  });
});
