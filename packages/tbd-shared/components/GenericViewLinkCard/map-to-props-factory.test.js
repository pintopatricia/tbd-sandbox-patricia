import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { SportsIconName, OthersIconName } from "@ppb/the-wall-icons";
import { PUSH } from "@ppb/tbd-store/actions/router";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";
import { i18n } from "../../helpers/i18n";

jest.mock("@ppb/tbd-store/state/layout/cards/cards-selectors", () => ({
  createCardByURNSelector: jest.fn(() => jest.fn()),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

const urnMock = "ppb:tbd:card:genericViewLink:generic:cHBiOnRiZDp2aWV3OmdlbmVyaWM6aW5wbGF5";

const stateMockInplay = {
  layouts: {
    cards: {
      genericviewlinks: {
        "ppb:tbd:card:genericViewLink:generic:cHBiOnR": {
          __typename: "GenericViewLinkCard",
          urn: "ppb:tbd:card:genericViewLink:generic:cHBiOnR",
          viewLink: {
            viewUrn: "ppb:tbd:view:generic:inplay",
            viewUrl: "view/generic:inplay",
          },
          badge: "INPLAY",
          title: "Title",
        },
      },
    },
  },
  entities: {
    brandSettings: {
      HIGHLIGHTED_SPORTS_RIBBON: false,
    },
  },
};

const stateMockOddsboost = {
  layouts: {
    cards: {
      genericviewlinks: {
        "ppb:tbd:card:genericViewLink:generic:cHBiOnR": {
          __typename: "GenericViewLinkCard",
          urn: "ppb:tbd:card:genericViewLink:generic:cHBiOnR",
          viewLink: {
            viewUrn: "ppb:tbd:view:generic:inplay",
            viewUrl: "view/generic:inplay",
          },
          badge: "ODDSBOOST",
          title: "Title",
        },
      },
    },
  },
  entities: {
    brandSettings: {
      HIGHLIGHTED_SPORTS_RIBBON: false,
    },
  },
};

const stateMockOddsonthat = {
  layouts: {
    cards: {
      genericviewlinks: {
        "ppb:tbd:card:genericViewLink:generic:cHBiOnR": {
          __typename: "GenericViewLinkCard",
          urn: "ppb:tbd:card:genericViewLink:generic:cHBiOnR",
          viewLink: {
            viewUrn: "ppb:tbd:view:generic:inplay",
            viewUrl: "view/generic:inplay",
          },
          badge: "ODDSONTHAT",
          title: "Title",
        },
      },
    },
  },
  entities: {
    brandSettings: {
      HIGHLIGHTED_SPORTS_RIBBON: false,
    },
  },
};

const stateMockCup = {
  layouts: {
    cards: {
      genericviewlinks: {
        "ppb:tbd:card:genericViewLink:generic:cHBiOnR": {
          __typename: "GenericViewLinkCard",
          urn: "ppb:tbd:card:genericViewLink:generic:cHBiOnR",
          viewLink: {
            viewUrn: "ppb:tbd:view:generic:inplay",
            viewUrl: "view/generic:inplay",
          },
          badge: "CUP",
          title: "Title",
        },
      },
    },
  },
  entities: {
    brandSettings: {
      HIGHLIGHTED_SPORTS_RIBBON: false,
    },
  },
};

describe("map-state-props", () => {
  describe("mapStateToProps", () => {
    beforeEach(jest.clearAllMocks);

    it("should call getGenericViewLinkCardByURN and get the genericViewLink by URN", () => {
      const getGenericViewLinkCardByURN = jest.fn();
      createCardByURNSelector.mockReturnValue(getGenericViewLinkCardByURN);

      const mapStateToProps = makeMapStateToProps();

      mapStateToProps(stateMockInplay, { urn: urnMock });

      expect(getGenericViewLinkCardByURN).toHaveBeenCalledTimes(1);
      expect(getGenericViewLinkCardByURN).toHaveBeenCalledWith(stateMockInplay.layouts.cards.genericviewlinks, urnMock);
    });

    describe("when genericviewlinks are defined", () => {
      it("should return the generic view link props", () => {
        const getGenericViewLinkCardByURN = jest
          .fn()
          .mockReturnValue(
            stateMockInplay.layouts.cards.genericviewlinks["ppb:tbd:card:genericViewLink:generic:cHBiOnR"],
          );
        createCardByURNSelector.mockReturnValue(getGenericViewLinkCardByURN);

        const mapStateToProps = makeMapStateToProps();
        const stateToProps = mapStateToProps(stateMockInplay, { urn: urnMock });

        expect(i18n).toHaveBeenCalledWith({ key: "Title" });
        expect(stateToProps).toEqual({
          urn: urnMock,
          icon: SportsIconName.IN_PLAY,
          inPlay: true,
          title: "Title",
          viewLink: {
            viewUrl: "view/generic:inplay",
            viewUrn: "ppb:tbd:view:generic:inplay",
          },
        });
      });

      describe("when badge is Oddsboost", () => {
        it("should return the generic view link props", () => {
          const getGenericViewLinkCardByURN = jest
            .fn()
            .mockReturnValue(
              stateMockOddsboost.layouts.cards.genericviewlinks["ppb:tbd:card:genericViewLink:generic:cHBiOnR"],
            );
          createCardByURNSelector.mockReturnValue(getGenericViewLinkCardByURN);

          const mapStateToProps = makeMapStateToProps();
          const stateToProps = mapStateToProps(stateMockOddsboost, { urn: urnMock });

          expect(stateToProps).toEqual({
            urn: urnMock,
            icon: SportsIconName.FOOTBALL,
            title: "Title",
            inPlay: false,
            viewLink: {
              viewUrl: "view/generic:inplay",
              viewUrn: "ppb:tbd:view:generic:inplay",
            },
          });
        });
      });

      describe("when badge is Oddsonthat", () => {
        it("should return the generic view link props", () => {
          const getGenericViewLinkCardByURN = jest
            .fn()
            .mockReturnValue(
              stateMockOddsonthat.layouts.cards.genericviewlinks["ppb:tbd:card:genericViewLink:generic:cHBiOnR"],
            );
          createCardByURNSelector.mockReturnValue(getGenericViewLinkCardByURN);

          const mapStateToProps = makeMapStateToProps();
          const stateToProps = mapStateToProps(stateMockOddsonthat, { urn: urnMock });

          expect(stateToProps).toEqual({
            urn: urnMock,
            icon: OthersIconName.ODDS_ON_THAT,
            title: "Title",
            inPlay: false,
            viewLink: {
              viewUrl: "view/generic:inplay",
              viewUrn: "ppb:tbd:view:generic:inplay",
            },
          });
        });
      });

      describe("when badge is Cup", () => {
        it("should return the generic view link props", () => {
          const getGenericViewLinkCardByURN = jest
            .fn()
            .mockReturnValue(
              stateMockCup.layouts.cards.genericviewlinks["ppb:tbd:card:genericViewLink:generic:cHBiOnR"],
            );
          createCardByURNSelector.mockReturnValue(getGenericViewLinkCardByURN);

          const mapStateToProps = makeMapStateToProps();
          const stateToProps = mapStateToProps(stateMockCup, { urn: urnMock });

          expect(stateToProps).toEqual({
            urn: urnMock,
            icon: OthersIconName.OUTRIGHTS,
            title: "Title",
            inPlay: false,
            viewLink: {
              viewUrl: "view/generic:inplay",
              viewUrn: "ppb:tbd:view:generic:inplay",
            },
          });
        });
      });
    });

    describe("when genericViewLinks are not defined", () => {
      it("should return an empty object", () => {
        const getGenericViewLinkCardByURN = jest.fn();
        createCardByURNSelector.mockReturnValue(getGenericViewLinkCardByURN);

        const mapStateToProps = makeMapStateToProps();
        const stateToProps = mapStateToProps(stateMockInplay, { urn: urnMock });

        expect(stateToProps).toEqual({});
      });
    });
  });

  describe("mapDispatchToProps", () => {
    describe("dispatchRouterPushAction", () => {
      it("should return the correct action creator", () => {
        const { dispatchRouterPushAction } = mapDispatchToProps;

        expect(dispatchRouterPushAction({ viewUrl: "/football/generic:1", viewUrn: "ppb:tbd:view:generic:1" })).toEqual(
          {
            payload: { viewUrl: "/football/generic:1", viewUrn: "ppb:tbd:view:generic:1" },
            type: PUSH,
          },
        );
      });
    });

    describe("dispatchNavigationViewFromFavourites", () => {
      it("should return the correct action creator", () => {
        const { dispatchNavigationViewFromFavourites } = mapDispatchToProps;

        expect(dispatchNavigationViewFromFavourites(urnMock, "label", "/football/generic:1")).toEqual({
          payload: {
            cardUrn: "/football/generic:1",
            href: "label",
            label: "ppb:tbd:card:genericViewLink:generic:cHBiOnRiZDp2aWV3OmdlbmVyaWM6aW5wbGF5",
          },
          type: "UI_NAVIGATE_VIEW_FROM_FAVOURITES",
        });
      });
    });
  });
});
