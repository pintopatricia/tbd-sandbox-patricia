import { createCardGroupByURNSelector } from "@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors";
import { FETCH_CARDS, FETCH_CARDS_FROM_LIST } from "@ppb/tbd-store/actions/catalogue";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

jest.mock("@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors", () => ({
  createCardGroupByURNSelector: jest.fn(),
}));

const getPopularSwimlaneCardGroupByURN = jest.fn();

const stateMock = {
  layouts: {
    cardgroups: {
      popularswimlanecardgroups: {
        popularCardGroupUrn: {
          urn: "popularCardGroupUrn",
        },
      },
    },
  },
};

describe("makeMapStateToProps", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    createCardGroupByURNSelector.mockImplementationOnce(() => getPopularSwimlaneCardGroupByURN);
  });

  describe("mapStateToProps", () => {
    describe("when provided a popular swimlane card group URN", () => {
      it("should call getPopularSwimlaneCardGroupByURN with params", () => {
        const mapStateToProps = makeMapStateToProps();
        mapStateToProps(stateMock, { urn: "popularCardGroupUrn" });

        expect(getPopularSwimlaneCardGroupByURN).toHaveBeenCalledWith(
          {
            popularCardGroupUrn: {
              urn: "popularCardGroupUrn",
            },
          },
          "popularCardGroupUrn",
        );
      });

      it("should return the expected props", () => {
        getPopularSwimlaneCardGroupByURN.mockReturnValue({
          items: [{ urn: "urn:1" }, { urn: "urn:2" }],
          title: "fakeTitle",
          type: "fakeType",
          urn: "popularCardGroupUrn",
        });

        const mapStateToProps = makeMapStateToProps();
        const result = mapStateToProps(stateMock, {
          urn: "popularCardGroupUrn",
        });

        expect(result).toEqual({
          items: [{ urn: "urn:1" }, { urn: "urn:2" }],
          title: "fakeTitle",
          cardgroupURN: "popularCardGroupUrn",
        });
      });

      describe("when there are no items", () => {
        it("should return an empty object", () => {
          getPopularSwimlaneCardGroupByURN.mockReturnValue({
            items: [],
            title: "fakeTitle",
            urn: "popularCardGroupUrn",
          });

          const mapStateToProps = makeMapStateToProps();
          const result = mapStateToProps(stateMock, { urn: "popularCardGroupUrn" });

          expect(result).toEqual({});
        });
      });

      describe("when there is no popularSwimlaneCardGroup", () => {
        it("should return an empty object", () => {
          getPopularSwimlaneCardGroupByURN.mockReturnValue(null);

          const mapStateToProps = makeMapStateToProps();
          const result = mapStateToProps(stateMock, { urn: "popularCardGroupUrn" });

          expect(result).toEqual({});
        });
      });
    });
  });

  describe("mapDispatchToProps", () => {
    describe("dispatchFetchCards", () => {
      it("should dispatch fetch cards action", () => {
        const { dispatchFetchCards } = mapDispatchToProps;

        expect(dispatchFetchCards("URN", [])).toEqual({
          type: FETCH_CARDS_FROM_LIST,
          payload: {
            partials: [],
            urn: "URN",
          },
        });
      });
    });

    describe("dispatchFetchCardsAction", () => {
      it("should dispatch fetch cards action with force refresh", () => {
        const { dispatchFetchCardsAction } = mapDispatchToProps;

        expect(dispatchFetchCardsAction("URN")).toEqual({
          type: FETCH_CARDS,
          payload: {
            urns: ["URN"],
            forceRefresh: true,
          },
        });
      });
    });
  });
});
