import { FETCH_CARDS_FROM_LIST } from "@ppb/tbd-store/actions/catalogue";
import { UI__TOGGLE_EXPANDABLE_CARDGROUP } from "@ppb/tbd-store/actions/interface";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

const getExpandableCardGroupByURN = jest.fn();

jest.mock("@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors", () => ({
  createCardGroupByURNSelector: jest.fn(() => getExpandableCardGroupByURN),
}));

const stateMock = {
  layouts: {
    cardgroups: {
      expandablecardgroups: {
        expandableCardGroupUrn: {
          urn: "expandableCardGroupUrn",
        },
      },
    },
  },
};

describe("mapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  describe("getExpandableCardGroupByURN", () => {
    it("should call getExpandableCardGroupByURN with the correct arguments", () => {
      const mapStateToProps = makeMapStateToProps();
      getExpandableCardGroupByURN.mockReturnValue({ items: [{ urn: "1.1" }, { urn: "924.1" }] });
      mapStateToProps(stateMock, { urn: "expandableCardGroupUrn" });

      expect(getExpandableCardGroupByURN).toHaveBeenCalledWith(
        stateMock.layouts.cardgroups.expandablecardgroups,
        "expandableCardGroupUrn",
      );
    });
  });

  describe("when the urn doesn't exist", () => {
    it("should return an empty object", () => {
      const mapStateToProps = makeMapStateToProps();
      getExpandableCardGroupByURN.mockReturnValue(undefined);
      const result = mapStateToProps(stateMock, "nonexistentURN");

      expect(result).toEqual({});
    });
  });

  describe("when there is an expandablecardgroup", () => {
    it("should return it from store", () => {
      const mapStateToProps = makeMapStateToProps();
      getExpandableCardGroupByURN.mockReturnValue({
        urn: "expandableCardGroupUrn",
        isExpandable: true,
        isExpanded: true,
        title: "title",
        items: [{ urn: "1.1" }, { urn: "924.1" }],
      });
      const result = mapStateToProps(stateMock, { urn: "expandableCardGroupUrn" });

      expect(result).toEqual({
        urn: "expandableCardGroupUrn",
        title: "title",
        isExpandable: true,
        isExpanded: true,
        items: [{ urn: "1.1" }, { urn: "924.1" }],
      });
    });
  });

  describe("and when there are no items", () => {
    it("should set items as an emtpy array", () => {
      getExpandableCardGroupByURN.mockReturnValue({
        urn: "expandableCardGroupUrn",
        isExpandable: true,
        isExpanded: true,
        title: "title",
        items: [],
      });
      const mapStateToProps = makeMapStateToProps();
      const result = mapStateToProps(stateMock, { urn: "expandableCardGroupUrn" });

      expect(result).toEqual({
        urn: "expandableCardGroupUrn",
        title: "title",
        isExpandable: true,
        isExpanded: true,
        items: [],
      });
    });
  });
});

describe("mapDispatchToProps", () => {
  beforeEach(jest.clearAllMocks);

  describe("FetchCardsFromListAction", () => {
    it("should dispatch fetch cards from list action", () => {
      const { dispatchFetchCards } = mapDispatchToProps;

      const urn = "urn:fake";

      expect(dispatchFetchCards(urn, [])).toEqual({
        payload: { urn: "urn:fake", partials: [] },
        type: FETCH_CARDS_FROM_LIST,
      });
    });
  });

  describe("ToggleExpandableCardGroupAction", () => {
    it("should dispatch toggle expandable cardgroup action", () => {
      const { dispatchExpandableCardGroupToggle } = mapDispatchToProps;

      const isExpanded = true;
      const urn = "urn:fake";
      const title = "jockey OddsBoost";

      expect(dispatchExpandableCardGroupToggle(isExpanded, urn, title)).toEqual({
        payload: {
          urn: "urn:fake",
          isExpanded: true,
          title: "jockey OddsBoost",
        },
        type: UI__TOGGLE_EXPANDABLE_CARDGROUP,
      });
    });
  });
});
