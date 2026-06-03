import { createCardGroupByURNSelector } from "@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors";
import { FETCH_CARDS_FROM_LIST } from "@ppb/tbd-store/actions/catalogue";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

jest.mock("@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors", () => ({
  createCardGroupByURNSelector: jest.fn(),
}));

describe("makeMapStateToProps", () => {
  it("should get the segmented card group by its URN", () => {
    const getSegmentedCardByURN = jest.fn();
    createCardGroupByURNSelector.mockReturnValue(getSegmentedCardByURN);
    const mapStateToProps = makeMapStateToProps();

    mapStateToProps(
      {
        layouts: {
          cardgroups: {
            segmentedcardgroups: {
              "ppb:tbd:segmented:card:group:12345": {
                urn: "ppb:tbd:segmented:card:group:12345",
              },
            },
          },
        },
      },
      { urn: "ppb:tbd:segmented:card:group:12345" },
    );
    expect(getSegmentedCardByURN).toHaveBeenCalledTimes(1);
    expect(getSegmentedCardByURN).toHaveBeenCalledWith(
      {
        "ppb:tbd:segmented:card:group:12345": {
          urn: "ppb:tbd:segmented:card:group:12345",
        },
      },
      "ppb:tbd:segmented:card:group:12345",
    );
  });

  describe("when segmentedcardgroup is undefined", () => {
    it("should return empty object", () => {
      const getSegmentedCardByURN = jest.fn();
      createCardGroupByURNSelector.mockReturnValue(getSegmentedCardByURN);
      getSegmentedCardByURN.mockReturnValue(null);

      const mapStateToProps = makeMapStateToProps();

      const props = mapStateToProps(
        {
          layouts: {
            cardgroups: {
              segmentedcardgroups: {
                "ppb:tbd:segmented:card:group:12345": {
                  urn: "ppb:tbd:segmented:card:group:12345",
                },
              },
            },
          },
        },
        { urn: "ppb:tbd:segmented:card:group:12345" },
      );

      expect(props).toStrictEqual({});
    });
  });

  describe("when segmentedcardgroup is defined", () => {
    it("should return the mapped props", () => {
      const getSegmentedCardByURN = jest.fn();
      createCardGroupByURNSelector.mockReturnValue(getSegmentedCardByURN);
      getSegmentedCardByURN.mockReturnValue({
        urn: "ppb:tbd:segmented:card:group:zone1",
        items: ["ppb:tbd:card:group:curatedGames:zone2"],
      });

      const mapStateToProps = makeMapStateToProps();

      const stateMock = {
        layouts: {
          cardgroups: {
            segmentedcardgroups: {
              "ppb:tbd:segmented:card:group:zone1": {
                urn: "ppb:tbd:segmented:card:group:zone1",
              },
            },
          },
        },
      };

      const props = mapStateToProps(stateMock, { urn: "ppb:tbd:segmented:card:group:zone1" });

      expect(props).toEqual({
        zones: ["ppb:tbd:card:group:curatedGames:zone2"],
        segmentedCardGroupUrn: "ppb:tbd:segmented:card:group:zone1",
      });
    });
  });

  describe("dispatchFetchCards", () => {
    it("should dispatch fetch cards action", () => {
      const { dispatchFetchCards } = mapDispatchToProps;
      expect(dispatchFetchCards("ppb:tbd:urn", ["itemA, itemB"])).toEqual({
        type: FETCH_CARDS_FROM_LIST,
        payload: {
          urn: "ppb:tbd:urn",
          partials: ["itemA, itemB"],
        },
      });
    });
  });
});
