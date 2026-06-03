import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";

import { makeMapStateToProps } from "./map-to-props-factory";

jest.mock("@ppb/tbd-store/state/layout/cards/cards-selectors");
jest.mock("../../view-model-factories/match-timeline", () => ({
  createPropsForMatchTimelineDetailsVm: jest.fn(() => jest.fn(() => "view-model-props")),
}));

jest.mock("../../helpers/i18n", () => ({ i18n: jest.fn(({ key }) => key) }));

global.Date.now = jest.fn(() => new Date("2020-01-11T15:15:00Z"));

describe("Connected Match Timeline Card", () => {
  describe("mapStateToProps", () => {
    const getMatchTimelineCardByURN = jest.fn();

    const stateMock = {
      layouts: {
        cards: {
          matchtimelines: {
            "urn:tbd:card:1": {
              urn: "urn:tbd:card:1",
              fixture: "ppb:footballfixture:29601422",
              typename: "MatchTimelineCard",
              title: "Title",
            },
            "urn:tbd:card:2": {
              urn: "urn:tbd:card:2",
              fixture: "ppb:footballfixture:2",
              typename: "MatchTimelineCard",
            },
          },
        },
      },
      entities: {
        footballfixtures: {
          "ppb:footballfixture:29601422": {
            urn: "ppb:footballfixture:29601422",
            scheduledAt: new Date("2020-01-11T15:15:00Z"),
            home: {
              name: "Crystal Palace",
              color: "#1B458F",
              crest: {
                vector: "http://sca.qa.internal/Assets/Team%20Logo/English%20Premier%20League/Crystal Palace.svg",
              },
              squad: {
                manager: "Crystal Manager",
                players: [
                  {
                    id: 1,
                    name: "Player 1",
                    startingType: "LINEUP",
                    shirtNumber: 2,
                    position: "DEFENDER",
                  },
                ],
              },
            },
            away: {
              name: "Arsenal",
              color: "#DA291C",
              crest: {
                vector: "http://sca.qa.internal/Assets/Team%20Logo/English%20Premier%20League/Arsenal.svg",
              },
              squad: {
                manager: "Arsenal Manager",
                players: [
                  {
                    id: 2,
                    name: "Player 2",
                    startingType: "LINEUP",
                    shirtNumber: 3,
                    position: "DEFENDER",
                  },
                ],
              },
            },
            duration: {
              period: "REGULAR",
              status: "PRE_MATCH",
              clock: {
                minute: 24,
                second: 48,
              },
              stoppageMinutes: 0,
            },
            score: {
              home: 2,
              away: 1,
            },
            firstLegScore: {
              home: 0,
              away: 1,
            },
            head2head: {
              home: [],
              away: [],
            },
            incidents: [],
          },
          "ppb:footballfixture:2": {
            home: {
              name: "Home",
            },
            away: {
              name: "Away",
            },
            head2head: {
              home: [],
              away: [],
            },
            incidents: [0, 1],
          },
        },
      },
    };

    function setupMapStateToProps(cardMock) {
      getMatchTimelineCardByURN.mockImplementation(() => cardMock);
      createCardByURNSelector.mockImplementation(() => getMatchTimelineCardByURN);

      return makeMapStateToProps()(stateMock, { urn: "urn:tbd:card:1" });
    }

    describe("when there is a card for provided URN", () => {
      it("should getMatchTimelineCardByURN from state", () => {
        setupMapStateToProps(stateMock.layouts.cards.matchtimelines["urn:tbd:card:1"]);
        expect(getMatchTimelineCardByURN).toHaveBeenCalledWith(
          stateMock.layouts.cards.matchtimelines,
          "urn:tbd:card:1",
        );
      });

      it("should return the correct vm", () => {
        const result = setupMapStateToProps(stateMock.layouts.cards.matchtimelines["urn:tbd:card:1"]);
        expect(result).toEqual({
          buttonText: "I18N.MATCH_TIMELINE.NEW_EVENT",
          fixtureURN: "ppb:footballfixture:29601422",
          incidentsLength: 0,
          matchTimelineDetailsProps: "view-model-props",
          typename: undefined,
        });
      });
    });

    describe("when there is no card for provided URN", () => {
      it("should getMatchTimelineCardByURN from state", () => {
        setupMapStateToProps(stateMock.layouts.cards.matchtimelines["urn:tbd:card:1"]);

        expect(getMatchTimelineCardByURN).toHaveBeenCalledWith(
          stateMock.layouts.cards.matchtimelines,
          "urn:tbd:card:1",
        );
      });

      it("should return if an empty object no card provided", () => {
        const card = setupMapStateToProps(null, stateMock.entities.footballfixtures["ppb:footballfixture:29601422"]);

        expect(card).toEqual({});
      });
    });

    describe("when matchTimelines data is empty", () => {
      it("should return an empty object", () => {
        const card = setupMapStateToProps(stateMock.layouts.cards.matchtimelines["urn:tbd:card:3"]);
        expect(card).toEqual({});
      });
    });
  });
});
