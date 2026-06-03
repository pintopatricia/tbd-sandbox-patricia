import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { FETCH_CARDS } from "@ppb/tbd-store";
import { OPPORTUNITIES_PAGE_SIZE, makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

jest.mock("@ppb/tbd-store/state/layout/cards/cards-selectors", () => {
  const getCardSpy = jest.fn(() => null);
  return {
    createCardByURNSelector: () => getCardSpy,
  };
});

jest.mock("@ppb/tbd-store/state/layout/layout-selectors", () => ({
  createViewTypeSelector: jest.fn(() => jest.fn(() => "sport")),
}));

jest.mock("@ppb/tbd-store/state/layout-snapshot", () => ({
  getLayoutMetadata: jest.fn(() => ({ tabName: "Tab name" })),
}));

const CARD_MOCK = {
  urn: "priceboostmultislist",
  typename: "PriceBoostMultisListCard",
  displayName: { __typename: "DisplayName", name: "Price Boost Multiple" },
  showWasPrice: true,
  blurb: { title: "blurb title", description: "blurb description", isCollapsed: true },
  endCursor: "endCursor",
  hasNextPage: true,
  items: [
    { urn: "urn-1", typename: "TypeName" },
    { urn: "urn-2", typename: "TypeName" },
    { urn: "urn-3", typename: "TypeName" },
  ],
};

const STATE_MOCK = {
  layouts: { cards: { priceboostmultislistcards: CARD_MOCK } },
};

function setup(cardMock = CARD_MOCK) {
  createCardByURNSelector().mockReturnValue(cardMock);

  return makeMapStateToProps();
}

describe("map-to-props-factory", () => {
  describe("makeMapStateToProps", () => {
    beforeEach(jest.clearAllMocks);

    describe("when card or layout are not found in state", () => {
      it("should return empty object", () => {
        const mapStateToProps = setup(null);
        const result = mapStateToProps(STATE_MOCK, { urn: "tbd:card:1" });

        expect(result).toEqual({});
      });
    });

    describe("when card and layout are found in state", () => {
      it("should return card title", () => {
        const mapStateToProps = setup();

        const result = mapStateToProps(STATE_MOCK, { urn: "tbd:card:1" });

        expect(createCardByURNSelector()).toHaveBeenCalledWith(
          STATE_MOCK.layouts.cards.priceboostmultislistcards,
          "tbd:card:1",
        );

        expect(result.title).toEqual("Price Boost Multiple");
      });

      it("should return cardUrn", () => {
        const mapStateToProps = setup();

        const result = mapStateToProps(STATE_MOCK, { urn: "tbd:card:1" });

        expect(createCardByURNSelector()).toHaveBeenCalledWith(
          STATE_MOCK.layouts.cards.priceboostmultislistcards,
          "tbd:card:1",
        );

        expect(result.cardUrn).toEqual("tbd:card:1");
      });

      it("should return correct showWasPrice", () => {
        const mapStateToProps = setup();

        const result = mapStateToProps(STATE_MOCK, { urn: "tbd:card:1" });

        expect(createCardByURNSelector()).toHaveBeenCalledWith(
          STATE_MOCK.layouts.cards.priceboostmultislistcards,
          "tbd:card:1",
        );

        expect(result.showWasPrice).toEqual(true);
      });

      it("should return correct blurb", () => {
        const mapStateToProps = setup();

        const result = mapStateToProps(STATE_MOCK, { urn: "tbd:card:1" });

        expect(createCardByURNSelector()).toHaveBeenCalledWith(
          STATE_MOCK.layouts.cards.priceboostmultislistcards,
          "tbd:card:1",
        );

        expect(result.blurb).toEqual({ title: "blurb title", description: "blurb description", isCollapsed: true });
      });

      it("should return all items", () => {
        const mapStateToProps = setup();

        const result = mapStateToProps(STATE_MOCK, { urn: "tbd:card:1" });

        expect(createCardByURNSelector()).toHaveBeenCalledWith(
          STATE_MOCK.layouts.cards.priceboostmultislistcards,
          "tbd:card:1",
        );

        expect(result.items).toEqual(["urn-1", "urn-2", "urn-3"]);
      });

      it("should return hasNextPage", () => {
        const mapStateToProps = setup();

        const result = mapStateToProps(STATE_MOCK, { urn: "tbd:card:1" });

        expect(createCardByURNSelector()).toHaveBeenCalledWith(
          STATE_MOCK.layouts.cards.priceboostmultislistcards,
          "tbd:card:1",
        );

        expect(result.hasNextPage).toEqual(true);
      });

      it("should return cursor", () => {
        const mapStateToProps = setup();

        const result = mapStateToProps(STATE_MOCK, { urn: "tbd:card:1" });

        expect(createCardByURNSelector()).toHaveBeenCalledWith(
          STATE_MOCK.layouts.cards.priceboostmultislistcards,
          "tbd:card:1",
        );

        expect(result.cursor).toEqual("endCursor");
      });

      it("should return pageType", () => {
        const mapStateToProps = setup();

        const result = mapStateToProps(STATE_MOCK, { urn: "tbd:card:1" });

        expect(createCardByURNSelector()).toHaveBeenCalledWith(
          STATE_MOCK.layouts.cards.priceboostmultislistcards,
          "tbd:card:1",
        );

        expect(result.pageType).toEqual("sport");
      });

      it("should return tab name", () => {
        const mapStateToProps = setup();

        const result = mapStateToProps(STATE_MOCK, { urn: "tbd:card:1" });

        expect(createCardByURNSelector()).toHaveBeenCalledWith(
          STATE_MOCK.layouts.cards.priceboostmultislistcards,
          "tbd:card:1",
        );

        expect(result.tabName).toEqual("Tab name");
      });

      describe(`when there are more than ${OPPORTUNITIES_PAGE_SIZE} items and no next page`, () => {
        it("should return hasMoreItems as true", () => {
          const mapStateToProps = setup({
            ...CARD_MOCK,
            hasNextPage: false,
            items: Array(OPPORTUNITIES_PAGE_SIZE + 1).fill({}),
          });

          const result = mapStateToProps(STATE_MOCK, { urn: "tbd:card:1" });

          expect(createCardByURNSelector()).toHaveBeenCalledWith(
            STATE_MOCK.layouts.cards.priceboostmultislistcards,
            "tbd:card:1",
          );

          expect(result.hasMoreItems).toEqual(true);
        });
      });

      describe(`when there are less than ${OPPORTUNITIES_PAGE_SIZE + 1} items but there is a next page`, () => {
        it("should return hasMoreItems as true", () => {
          const mapStateToProps = setup({
            ...CARD_MOCK,
            hasNextPage: true,
            items: Array(OPPORTUNITIES_PAGE_SIZE).fill({}),
          });

          const result = mapStateToProps(STATE_MOCK, { urn: "tbd:card:1" });

          expect(createCardByURNSelector()).toHaveBeenCalledWith(
            STATE_MOCK.layouts.cards.priceboostmultislistcards,
            "tbd:card:1",
          );

          expect(result.hasMoreItems).toEqual(true);
        });
      });

      describe(`when there are less than ${OPPORTUNITIES_PAGE_SIZE + 1} items and no next page`, () => {
        it("should return hasMoreItems as false", () => {
          const mapStateToProps = setup({
            ...CARD_MOCK,
            hasNextPage: false,
            items: Array(OPPORTUNITIES_PAGE_SIZE).fill({}),
          });

          const result = mapStateToProps(STATE_MOCK, { urn: "tbd:card:1" });

          expect(createCardByURNSelector()).toHaveBeenCalledWith(
            STATE_MOCK.layouts.cards.priceboostmultislistcards,
            "tbd:card:1",
          );

          expect(result.hasMoreItems).toEqual(false);
        });
      });
    });
  });

  describe("mapDispatchToProps", () => {
    beforeEach(jest.clearAllMocks);

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
  });
});
