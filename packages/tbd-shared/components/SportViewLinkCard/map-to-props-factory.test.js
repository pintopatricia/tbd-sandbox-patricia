import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { getSportByURN } from "@ppb/tbd-store/state/entities/sports/sport-selectors";
import { PUSH } from "@ppb/tbd-store/actions/router";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

jest.mock("@ppb/tbd-store/state/layout/cards/cards-selectors", () => ({
  createCardByURNSelector: jest.fn(() => jest.fn()),
}));

const sportMock = {
  sportId: 1,
  name: "Football",
};

jest.mock("@ppb/tbd-store/state/entities/sports/sport-selectors", () => ({
  getSportByURN: jest.fn(() => sportMock),
}));

const urnMock = "ppb:tbd:card:sportViewLink:1";
const stateMock = {
  entities: {
    sports: {
      "ppb:eventType:1": {
        name: "Football",
        sportId: 1,
        urn: "ppb:eventType:1",
        __typename: "Sport",
      },
    },
    brandSettings: {
      HIGHLIGHTED_SPORTS_RIBBON: false,
    },
  },
  layouts: {
    cards: {
      sportviewlinks: {
        "ppb:tbd:card:sportViewLink:1": {
          sport: "ppb:eventType:1",
          typename: "SportViewLinkCard",
          urn: "ppb:tbd:card:sportViewLink:1",
          viewLink: {
            viewUrl: "football/sport:1",
            viewUrn: "ppb:tbd:view:sport:1",
          },
        },
      },
    },
  },
};

describe("map-to-props", () => {
  describe("mapStateToProps", () => {
    beforeEach(jest.clearAllMocks);

    it("should call getSportViewLinkCardByURN and get the sportsViewLink by URN", () => {
      const getSportViewLinkCardByURN = jest.fn();
      createCardByURNSelector.mockReturnValue(getSportViewLinkCardByURN);

      const mapStateToProps = makeMapStateToProps();

      mapStateToProps(stateMock, { urn: urnMock });

      expect(getSportViewLinkCardByURN).toHaveBeenCalledTimes(1);
      expect(getSportViewLinkCardByURN).toHaveBeenCalledWith(stateMock.layouts.cards.sportviewlinks, urnMock);
    });

    it("should call getSportByURN", () => {
      const getSportViewLinkCardByURN = () => ({ sport: "ppb:eventType:1" });
      createCardByURNSelector.mockReturnValue(getSportViewLinkCardByURN);
      const mapStateToProps = makeMapStateToProps();
      mapStateToProps(stateMock, { urn: urnMock });

      expect(getSportByURN).toHaveBeenCalledWith(stateMock.entities.sports, "ppb:eventType:1");
    });

    describe("when sportsViewLinks are defined", () => {
      describe("and the shortName is not provided", () => {
        it("should return sportsViewLinks props and the sportName as the name", () => {
          const getSportViewLinkCardByURN = jest
            .fn()
            .mockReturnValue(stateMock.layouts.cards.sportviewlinks["ppb:tbd:card:sportViewLink:1"]);
          createCardByURNSelector.mockReturnValue(getSportViewLinkCardByURN);

          const mapStateToProps = makeMapStateToProps();
          const stateToProps = mapStateToProps(stateMock, { urn: urnMock });

          expect(stateToProps).toEqual({
            urn: urnMock,
            sportId: 1,
            sportName: "Football",
            sportViewLink: { viewUrl: "football/sport:1", viewUrn: "ppb:tbd:view:sport:1" },
            isSportsRibbonHighlighted: false,
          });
        });
      });

      describe("and the shortName is provided", () => {
        it("should return sportsViewLinks props and the sportName as the shortName", () => {
          const getSportViewLinkCardByURN = jest
            .fn()
            .mockReturnValue(stateMock.layouts.cards.sportviewlinks["ppb:tbd:card:sportViewLink:1"]);
          createCardByURNSelector.mockReturnValue(getSportViewLinkCardByURN);
          getSportByURN.mockReturnValue({ ...sportMock, shortName: "Ftbll" });

          const mapStateToProps = makeMapStateToProps();
          const stateToProps = mapStateToProps(stateMock, { urn: urnMock });

          expect(stateToProps).toEqual({
            urn: urnMock,
            sportId: 1,
            sportName: "Ftbll",
            sportViewLink: { viewUrl: "football/sport:1", viewUrn: "ppb:tbd:view:sport:1" },
            isSportsRibbonHighlighted: false,
          });
        });
      });
    });

    describe("when sportsViewLinks are not defined", () => {
      it("should return an empty object", () => {
        const getSportViewLinkCardByURN = jest.fn();
        createCardByURNSelector.mockReturnValue(getSportViewLinkCardByURN);

        const mapStateToProps = makeMapStateToProps();
        const stateToProps = mapStateToProps(stateMock, { urn: urnMock });

        expect(stateToProps).toEqual({});
      });
    });
  });

  describe("mapDispatchToProps", () => {
    describe("dispatchRouterPushAction", () => {
      it("should return the correct action creator", () => {
        const { dispatchRouterPushAction } = mapDispatchToProps;

        expect(dispatchRouterPushAction({ viewUrl: "/football/sport:1", viewUrn: "ppb:tbd:view:sport:1" })).toEqual({
          payload: { viewUrl: "/football/sport:1", viewUrn: "ppb:tbd:view:sport:1" },
          type: PUSH,
        });
      });
    });

    describe("dispatchNavigationViewFromFavourites", () => {
      it("should return the correct action creator", () => {
        const { dispatchNavigationViewFromFavourites } = mapDispatchToProps;
        expect(dispatchNavigationViewFromFavourites(urnMock, "label", "/football/sport:1")).toEqual({
          payload: { label: "label", cardUrn: urnMock, href: "/football/sport:1" },
          type: "UI_NAVIGATE_VIEW_FROM_FAVOURITES",
        });
      });
    });
  });
});
