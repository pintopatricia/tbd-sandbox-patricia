import { FETCH_CARDS, createGetThrottleSelector } from "@ppb/tbd-store";
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import {
  OPPORTUNITIES_INITIAL_PAGE_SIZE,
  OPPORTUNITIES_PAGE_SIZE,
  makeMapStateToProps,
  mapDispatchToProps,
} from "./map-to-props-factory";

const getPackagedCreatedBetsCardByURN = jest.fn(() => null);

jest.mock("@ppb/tbd-store/state/layout/cards/cards-selectors", () => ({
  createCardByURNSelector: () => getPackagedCreatedBetsCardByURN,
}));

jest.mock("@ppb/tbd-store", () => ({
  createGetThrottleSelector: jest.fn(() => jest.fn(() => undefined)),
}));

jest.mock("@ppb/tbd-store/state/layout/layout-selectors", () => ({
  createViewTypeSelector: jest.fn(() => jest.fn(() => "sport")),
}));

jest.mock("@ppb/tbd-store/state/layout-snapshot", () => ({
  getLayoutMetadata: jest.fn(() => ({ tabName: "Tab name" })),
}));

const STATE_MOCK = {
  entities: { throttles: {} },
  layouts: {
    cards: {
      packagedcreatedbets: {
        urn: "packagedcreatedbets",
        typename: "PackagedCreatedBetsCard",
        favouriteMarketsStateURN: "favouriteMarketsStateURN",
        displayName: { __typename: "DisplayName", name: "Packaged Created Bets" },
        layout: "IN_CARD",
        endCursor: "endCursor",
        hasNextPage: true,
        items: [
          { urn: "urn-1", typename: "TypeName" },
          { urn: "urn-2", typename: "TypeName" },
          { urn: "urn-3", typename: "TypeName" },
        ],
      },
    },
  },
};

const setup = (stateMock = STATE_MOCK) => {
  getPackagedCreatedBetsCardByURN.mockReturnValueOnce(stateMock.layouts.cards.packagedcreatedbets);

  return makeMapStateToProps()(stateMock, { urn: "tbd:card:1" });
};

describe("map-to-props-factory - PackagedCreatedBetsCard", () => {
  beforeEach(jest.clearAllMocks);

  describe("makeMapStateToProps", () => {
    describe("when card or layout are not found in state", () => {
      it("should return empty object", () => {
        const stateMock = {
          ...STATE_MOCK,
          layouts: { cards: { packagedcreatedbets: {} } },
        };

        expect(setup(stateMock)).toEqual({});
      });
    });

    describe("when card and layout are found in state", () => {
      it("should return the correct props", () => {
        const result = setup();

        expect(getPackagedCreatedBetsCardByURN).toHaveBeenCalledWith(
          STATE_MOCK.layouts.cards.packagedcreatedbets,
          "tbd:card:1",
        );

        expect(result).toEqual({
          cardUrn: "tbd:card:1",
          cursor: "endCursor",
          hasMoreItems: true,
          hasNextPage: true,
          items: ["urn-1", "urn-2", "urn-3"],
          layoutType: "IN_CARD",
          favouriteMarketsStateURN: "favouriteMarketsStateURN",
          pageType: "sport",
          tabName: "Tab name",
          title: "Packaged Created Bets",
          refreshEnabled: false,
        });
      });

      describe(`when there are more than ${OPPORTUNITIES_INITIAL_PAGE_SIZE} items and no next page`, () => {
        it("should return hasMoreItems as true", () => {
          const stateMock = {
            ...STATE_MOCK,
            layouts: {
              cards: {
                packagedcreatedbets: {
                  ...STATE_MOCK.layouts.cards.packagedcreatedbets,
                  hasNextPage: false,
                  items: Array(OPPORTUNITIES_INITIAL_PAGE_SIZE + 1).fill({}),
                },
              },
            },
          };

          const result = setup(stateMock);

          expect(getPackagedCreatedBetsCardByURN).toHaveBeenCalledWith(
            stateMock.layouts.cards.packagedcreatedbets,
            "tbd:card:1",
          );

          expect(result.hasMoreItems).toEqual(true);
        });
      });

      describe(`when there are less than ${OPPORTUNITIES_INITIAL_PAGE_SIZE + 1} items but there is a next page`, () => {
        it("should return hasMoreItems as true", () => {
          const stateMock = {
            ...STATE_MOCK,
            layouts: {
              cards: {
                packagedcreatedbets: {
                  ...STATE_MOCK.layouts.cards.packagedcreatedbets,
                  hasNextPage: true,
                  items: Array(OPPORTUNITIES_INITIAL_PAGE_SIZE).fill({}),
                },
              },
            },
          };

          const result = setup(stateMock);

          expect(getPackagedCreatedBetsCardByURN).toHaveBeenCalledWith(
            stateMock.layouts.cards.packagedcreatedbets,
            "tbd:card:1",
          );

          expect(result.hasMoreItems).toEqual(true);
        });
      });

      describe(`when there are less than ${OPPORTUNITIES_INITIAL_PAGE_SIZE + 1} items and no next page`, () => {
        it("should return hasMoreItems as false", () => {
          const stateMock = {
            ...STATE_MOCK,
            layouts: {
              cards: {
                packagedcreatedbets: {
                  ...STATE_MOCK.layouts.cards.packagedcreatedbets,
                  hasNextPage: false,
                  items: Array(OPPORTUNITIES_INITIAL_PAGE_SIZE).fill({}),
                },
              },
            },
          };

          const result = setup(stateMock);

          expect(getPackagedCreatedBetsCardByURN).toHaveBeenCalledWith(
            stateMock.layouts.cards.packagedcreatedbets,
            "tbd:card:1",
          );

          expect(result.hasMoreItems).toEqual(false);
        });
      });

      describe("when the PACKAGED_CREATED_BETS_CARD throttle is active", () => {
        it("should return refreshEnabled as true", () => {
          createGetThrottleSelector.mockReturnValueOnce(() => ({
            isActive: true,
          }));

          const stateMock = {
            ...STATE_MOCK,
            entities: {
              throttles: {
                PACKAGED_CREATED_BETS_CARD: {
                  isActive: true,
                },
              },
            },
          };

          const result = setup(stateMock);

          expect(createCardByURNSelector()).toHaveBeenCalledWith(
            STATE_MOCK.layouts.cards.packagedcreatedbets,
            "tbd:card:1",
          );

          expect(result.refreshEnabled).toEqual(true);
        });
      });
    });
  });

  describe("mapDispatchToProps", () => {
    describe("dispatchFetchCards", () => {
      it("should return FETCH_CARDS action with the correct urn and cursor", () => {
        expect(mapDispatchToProps.dispatchFetchCards("urn-1", "cursor")).toEqual({
          type: FETCH_CARDS,
          payload: {
            cursor: "cursor",
            first: OPPORTUNITIES_PAGE_SIZE,
            forceRefresh: true,
            urns: ["urn-1"],
          },
        });
      });
    });

    describe("dispatchRefreshCards", () => {
      it("should return FETCH_CARDS action with the correct urn", () => {
        expect(mapDispatchToProps.dispatchRefreshCards("urn-1")).toEqual({
          type: FETCH_CARDS,
          payload: {
            urns: ["urn-1"],
            forceRefresh: true,
            forceRefreshComponent: true,
          },
        });
      });
    });
  });
});
