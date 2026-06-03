import { createCardGroupByURNSelector } from "@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors";
import { PUSH } from "@ppb/tbd-store/actions/router";
import { FETCH_CARDS_FROM_LIST } from "@ppb/tbd-store/actions/catalogue";
import { UI__CARDGROUP_VIEW_ALL_LINK_TAP } from "@ppb/tbd-store/actions/navigation";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

jest.mock("@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors", () => ({
  createCardGroupByURNSelector: jest.fn(),
}));

const getRacingSwimlaneCardGroupByURN = jest.fn();

const stateMock = {
  layouts: {
    cardgroups: {
      racingswimlanecardgroups: {
        racingCardGroupUrn: {
          urn: "racingCardGroupUrn",
        },
      },
    },
  },
};

describe("makeMapStateToProps", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    createCardGroupByURNSelector.mockImplementationOnce(() => getRacingSwimlaneCardGroupByURN);
  });

  describe("mapStateToProps", () => {
    describe("when provided a racing swimlane card group URN", () => {
      it("should call getRacingSwimlaneCardGroupByURN with params", () => {
        const mapStateToProps = makeMapStateToProps();
        mapStateToProps(stateMock, { urn: "racingCardGroupUrn" });

        expect(getRacingSwimlaneCardGroupByURN).toHaveBeenCalledWith(
          {
            racingCardGroupUrn: {
              urn: "racingCardGroupUrn",
            },
          },
          "racingCardGroupUrn",
        );
      });

      it("should return the expected props", () => {
        getRacingSwimlaneCardGroupByURN.mockReturnValue({
          items: [{ urn: "urn:1" }, { urn: "urn:2" }],
          title: "fakeTitle",
          type: "fakeType",
          urn: "racingCardGroupUrn",
        });

        const mapStateToProps = makeMapStateToProps();
        const result = mapStateToProps(stateMock, {
          urn: "racingCardGroupUrn",
        });

        expect(result).toEqual({
          items: [{ urn: "urn:1" }, { urn: "urn:2" }],
          title: "fakeTitle",
          cardgroupURN: "racingCardGroupUrn",
        });
      });

      describe("when a title is provided", () => {
        it("should return the title", () => {
          getRacingSwimlaneCardGroupByURN.mockReturnValue({
            items: [{ urn: "urn:1" }, { urn: "urn:2" }],
            title: "fakeTitle",
            type: "fakeType",
            urn: "racingCardGroupUrn",
          });

          const mapStateToProps = makeMapStateToProps();
          const result = mapStateToProps(stateMock, { urn: "racingCardGroupUrn", isTitleHidden: false });

          expect(result).toEqual({
            items: [{ urn: "urn:1" }, { urn: "urn:2" }],
            title: "fakeTitle",
            cardgroupURN: "racingCardGroupUrn",
          });
        });
      });

      describe("when there is no racingSwimlaneCardGroup", () => {
        it("should return an empty object", () => {
          getRacingSwimlaneCardGroupByURN.mockReturnValue(null);

          const mapStateToProps = makeMapStateToProps();
          const result = mapStateToProps(stateMock, { urn: "racingCardGroupUrn" });

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

    describe("dispatchPushAction", () => {
      it("should dispatch push action", () => {
        const { dispatchPushAction } = mapDispatchToProps;

        expect(dispatchPushAction({})).toEqual({
          type: PUSH,
          payload: {},
        });
      });
    });

    describe("dispatchViewAllTap", () => {
      it("should dispatch ViewAll tap action", () => {
        const { dispatchViewAllTap } = mapDispatchToProps;

        expect(dispatchViewAllTap({ title: "title", viewAllLink: undefined, cardgroupURN: "URN" })).toEqual({
          type: UI__CARDGROUP_VIEW_ALL_LINK_TAP,
          payload: {
            cardgroupURN: "URN",
            title: "title",
            viewAllLink: undefined,
          },
        });
      });
    });
  });
});
