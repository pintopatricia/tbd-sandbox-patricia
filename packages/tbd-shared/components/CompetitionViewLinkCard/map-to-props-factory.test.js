import { UI__NAVIGATE_TO_COMPETITION_VIEW } from "@ppb/tbd-store/actions/navigation";
import { PUSH } from "@ppb/tbd-store/actions/router";
import { createCompetitionViewLinkCardHydratedByURNSelector } from "@ppb/tbd-store/state/layout/cards/competition-viewlinks/competition-viewlinks-selectors";
import { SportsIconName } from "@ppb/the-wall-icons";
import { getSportIcon } from "@ppb/the-wall-icons/SportIcon/sports-icon-helper";

import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

const getCompetitionViewLinkCardHydratedByURN = jest.fn();

jest.mock("@ppb/tbd-store/state/layout/cards/competition-viewlinks/competition-viewlinks-selectors", () => ({
  createCompetitionViewLinkCardHydratedByURNSelector: jest.fn(() => getCompetitionViewLinkCardHydratedByURN),
}));

jest.mock("@ppb/the-wall-icons/SportIcon/sports-icon-helper", () => ({
  getSportIcon: jest.fn(() => SportsIconName.FOOTBALL),
}));

const STATE = {
  layouts: {
    cards: {
      competitionviewlinks: {},
    },
  },
  entities: {
    competitions: {},
    sports: {},
  },
};

const COMPETITION_VIEW_LINK_CARD_URN = "urn:fake:competitionviewlink:1";

const setupMapStateToProps = ({ state = STATE, urn = COMPETITION_VIEW_LINK_CARD_URN } = {}) =>
  makeMapStateToProps()(state, { urn });

describe("makeMapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  it("should create selector for competition view link card", () => {
    setupMapStateToProps();

    expect(createCompetitionViewLinkCardHydratedByURNSelector).toHaveBeenCalledWith();
    expect(createCompetitionViewLinkCardHydratedByURNSelector).toHaveBeenCalledTimes(1);
  });

  describe("mapStateToProps", () => {
    describe("when card exists in the state", () => {
      describe("and competition exists in the state with logo", () => {
        it("should map view link, competition name and logo to props", () => {
          const mockHydratedCard = {
            competition: { name: "Competition Name", logo: { large: "logo" } },
            card: { viewLink: {} },
          };
          getCompetitionViewLinkCardHydratedByURN.mockReturnValueOnce(mockHydratedCard);

          const props = setupMapStateToProps();

          expect(getCompetitionViewLinkCardHydratedByURN).toHaveBeenCalledWith(STATE, COMPETITION_VIEW_LINK_CARD_URN);
          expect(getSportIcon).not.toHaveBeenCalled();
          expect(props).toEqual({
            viewLink: {},
            name: "Competition Name",
            logo: "logo",
            fallbackIcon: undefined,
          });
        });
      });

      describe("and competition exists in the state with flag", () => {
        it("should map view link, competition name and flag to props", () => {
          const mockHydratedCard = {
            competition: { name: "Competition Name", country: { flag: "country" } },
            card: { viewLink: {} },
          };
          getCompetitionViewLinkCardHydratedByURN.mockReturnValueOnce(mockHydratedCard);

          const props = setupMapStateToProps();

          expect(getCompetitionViewLinkCardHydratedByURN).toHaveBeenCalledWith(STATE, COMPETITION_VIEW_LINK_CARD_URN);
          expect(getSportIcon).not.toHaveBeenCalled();
          expect(props).toEqual({
            viewLink: {},
            name: "Competition Name",
            logo: "country",
            fallbackIcon: undefined,
          });
        });
      });

      describe("and competition exists in the state with sport URN", () => {
        it("should map view link, competition name and fallbackIcon to props", () => {
          const mockHydratedCard = {
            competition: { name: "Competition Name" },
            sport: { sportId: 1, urn: "ppb:eventType:1" },
            card: { viewLink: {} },
          };
          getCompetitionViewLinkCardHydratedByURN.mockReturnValueOnce(mockHydratedCard);

          const props = setupMapStateToProps();

          expect(getCompetitionViewLinkCardHydratedByURN).toHaveBeenCalledWith(STATE, COMPETITION_VIEW_LINK_CARD_URN);
          expect(getSportIcon).toHaveBeenCalledWith(1);
          expect(getSportIcon).toHaveBeenCalledTimes(1);
          expect(props).toEqual({
            viewLink: {},
            name: "Competition Name",
            fallbackIcon: SportsIconName.FOOTBALL,
          });
        });
      });
    });

    describe("when card does not exist in the state", () => {
      it("should return empty object", () => {
        getCompetitionViewLinkCardHydratedByURN.mockReturnValueOnce(undefined);

        const props = setupMapStateToProps();

        expect(getCompetitionViewLinkCardHydratedByURN).toHaveBeenCalledWith(STATE, COMPETITION_VIEW_LINK_CARD_URN);

        expect(getSportIcon).not.toHaveBeenCalled();
        expect(props).toEqual({});
      });
    });
  });
});

describe("mapDispatchToProps", () => {
  describe("dispatchRouterPushAction", () => {
    it("should dispatch router push action", () => {
      const urn = "fakeMyBetsViewUrn";

      const { dispatchRouterPushAction } = mapDispatchToProps;
      const viewLink = {
        viewUrn: urn,
        viewUrl: "http://url",
      };

      expect(dispatchRouterPushAction(viewLink)).toEqual({
        type: PUSH,
        payload: viewLink,
      });
    });
  });

  describe("dispatchNavigateToCompetitionView", () => {
    it("should dispatch navigate to competition view from competition link action", () => {
      const { dispatchNavigateToCompetitionView } = mapDispatchToProps;
      const urn = "fakeMyBetsViewUrn";
      const name = "Competition Name";
      const viewLink = {
        viewUrn: urn,
        viewUrl: "http://url",
      };

      expect(dispatchNavigateToCompetitionView(viewLink.viewUrl, name, urn)).toEqual({
        type: UI__NAVIGATE_TO_COMPETITION_VIEW,
        payload: { href: viewLink.viewUrl, text: name, cardUrn: urn, cardType: "CompetitionViewLinkCard" },
      });
    });
  });
});
