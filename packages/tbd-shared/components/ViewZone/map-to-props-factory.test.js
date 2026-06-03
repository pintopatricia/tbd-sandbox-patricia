import { createViewZoneByURNSelector } from "@ppb/tbd-store/state/layout/viewzones/viewzone-selectors";
import { makeMapStateToProps } from "./map-to-props-factory";

jest.mock("@ppb/tbd-store/state/layout/viewzones/viewzone-selectors", () => ({
  createViewZoneByURNSelector: jest.fn(),
}));

describe("mapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  it("should get the viewZone by its URN", () => {
    const getViewZoneByURN = jest.fn();
    createViewZoneByURNSelector.mockReturnValue(getViewZoneByURN);
    const mapStateToProps = makeMapStateToProps();

    mapStateToProps(
      {
        layouts: {
          viewzones: {
            "ppb:tbd:view:zone:multifunctionalModule:zone": {
              urn: "ppb:tbd:view:zone:multifunctionalModule:zone",
              title: "Casino",
              type: "VIEW_ZONE",
              items: [
                { urn: "ppb:tbd:card:group:recentlyPlayedGames:zone1", typaname: "CardGroup" },
                { urn: "ppb:tbd:card:group:segmentedcardgroup:zone2", typaname: "CardGroup" },
              ],
            },
          },
        },
      },
      { urn: "ppb:tbd:view:zone:multifunctionalModule:zone" },
    );
    expect(getViewZoneByURN).toHaveBeenCalledTimes(1);
    expect(getViewZoneByURN).toHaveBeenCalledWith(
      {
        "ppb:tbd:view:zone:multifunctionalModule:zone": {
          urn: "ppb:tbd:view:zone:multifunctionalModule:zone",
          title: "Casino",
          type: "VIEW_ZONE",
          items: [
            { urn: "ppb:tbd:card:group:recentlyPlayedGames:zone1", typaname: "CardGroup" },
            { urn: "ppb:tbd:card:group:segmentedcardgroup:zone2", typaname: "CardGroup" },
          ],
        },
      },
      "ppb:tbd:view:zone:multifunctionalModule:zone",
    );
  });

  describe("when viewzone is defined", () => {
    it("should return the mapped props", () => {
      const getViewZoneByURN = jest.fn();
      createViewZoneByURNSelector.mockReturnValue(getViewZoneByURN);
      getViewZoneByURN.mockReturnValue({
        urn: "ppb:tbd:view:zone:multifunctionalModule:zone",
        title: "Casino",
        type: "VIEW_ZONE",
        items: [
          { urn: "ppb:tbd:card:group:recentlyPlayedGames:zone1", typename: "SwimlaneCardGroup" },
          { urn: "ppb:tbd:card:group:segmentedcardgroup:zone2", typename: "SwimlaneCardGroup" },
        ],
      });
      const mapStateToProps = makeMapStateToProps();

      const stateMock = {
        layouts: {
          viewzones: {
            "ppb:tbd:view:zone:multifunctionalModule:zone": {
              urn: "ppb:tbd:view:zone:multifunctionalModule:zone",
              title: "Casino",
              type: "VIEW_ZONE",
              items: [
                { urn: "ppb:tbd:card:group:recentlyPlayedGames:zone1", typename: "SwimlaneCardGroup" },
                { urn: "ppb:tbd:card:group:segmentedcardgroup:zone2", typename: "SwimlaneCardGroup" },
              ],
            },
          },
        },
      };
      const props = mapStateToProps(stateMock, { urn: "ppb:tbd:view:zone:multifunctionalModule:zone" });

      expect(props).toEqual({
        title: "Casino",
        items: [
          { urn: "ppb:tbd:card:group:recentlyPlayedGames:zone1", typename: "SwimlaneCardGroup" },
          { urn: "ppb:tbd:card:group:segmentedcardgroup:zone2", typename: "SwimlaneCardGroup" },
        ],
      });
    });
  });

  describe("when viewzone is undefined", () => {
    it("should return empty object", () => {
      const getViewZoneByURN = jest.fn();
      createViewZoneByURNSelector.mockReturnValue(getViewZoneByURN);
      getViewZoneByURN.mockReturnValue(null);
      const mapStateToProps = makeMapStateToProps();

      const props = mapStateToProps(
        {
          layouts: {
            viewzones: {
              "ppb:tbd:view:zone:multifunctionalModule:zone": {
                urn: "ppb:tbd:view:zone:multifunctionalModule:zone",
                title: "Casino",
                type: "VIEW_ZONE",
                items: [
                  { urn: "ppb:tbd:card:group:recentlyPlayedGames:zone1", typename: "SwimlaneCardGroup" },
                  { urn: "ppb:tbd:card:group:segmentedcardgroup:zone2", typename: "SwimlaneCardGroup" },
                ],
              },
            },
          },
        },
        { urn: "ppb:tbd:view:zone:multifunctionalModule:zone" },
      );

      expect(props).toEqual({});
    });
  });
});
