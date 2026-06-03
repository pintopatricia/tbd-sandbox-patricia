import { getEventViewLink, createEventViewLinkCardHydratedByURNSelector } from "./event-view-link-cards-selectors";
import { createCardByURNSelector } from "../cards-selectors";
import { getSportEventByURN } from "../../../entities/sport-events/sport-event-selectors";
import { getCompetitionByURN } from "../../../entities/competitions/competition-selectors";
import { getSportByURN } from "../../../entities/sports/sport-selectors";

const eventViewLinkCardMock = {
  urn: "ppb:fake/betting",
  sportevent: { urn: "ppb:bfrb/betting" },
  fixture: "ppb:footballfixture:29660023",
  viewLink: {
    viewUrl: "fake_eventUrl",
    viewUrn: "fake_urn",
  },
};

const cardUrnMock = eventViewLinkCardMock.urn;

const sportMock = {
  urn: "ppb:tbd:eventType:1",
};

const competitionMock = {
  urn: "ppb:tbd:competition:987",
  sport: sportMock,
};

const sportEventMock = {
  urn: "ppb:tbd:sportevent:567",
  competition: competitionMock.urn,
};

const getEventViewLinkCardByURN = jest.fn(() => eventViewLinkCardMock);
jest.mock("../cards-selectors", () => ({
  createCardByURNSelector: jest.fn(() => getEventViewLinkCardByURN),
}));

jest.mock("../../../entities/sport-events/sport-event-selectors", () => ({
  getSportEventByURN: jest.fn(() => {}),
}));

jest.mock("../../../entities/competitions/competition-selectors", () => ({
  getCompetitionByURN: jest.fn(() => competitionMock),
}));
jest.mock("../../../entities/sports/sport-selectors", () => ({
  getSportByURN: jest.fn(() => sportMock),
}));

const stateMock = {
  layouts: {
    cards: {
      eventviewlinks: {
        "ppb:tbd:eventViewLink:29596042": {
          urn: "ppb:tbd:eventViewLink:29596042",
          sportevent: "ppb:event:29650135",
          fixture: "ppb:fixture:29650135",
        },
        "ppb:tbd:eventViewLink:29596043": {
          urn: "ppb:tbd:eventViewLink:29596043",
          fixture: "ppb:footballfixture:29660023",
          viewLink: {
            viewUrn: "ppb:tbd:view:event:29650136",
          },
        },
      },
    },
  },
  entities: {
    competitions: {
      [competitionMock.urn]: competitionMock,
    },
    sports: {
      [sportMock.urn]: sportMock,
    },
    sportevents: {
      "ppb:event:29650135": {
        urn: "ppb:event:29650135",
        eventId: 29650135,
        competition: "ppb:competition:10932509",
        name: "Crystal Palace v Southampton",
      },
    },
    footballfixtures: {
      "ppb:footballfixture:29660023": {
        urn: "ppb:footballfixture:29660023",
        sportevent: "ppb:event:29660023",
        home: {
          name: "Sheff Wed",
        },
        away: {
          name: "Draw",
        },
        scheduledAt: new Date("2020-02-01T15:00:00.000Z"),
        startedAt: new Date("2019-12-23T12:05:00.000Z"),
        duration: {
          period: "REGULAR",
          status: "PRE_MATCH",
          clock: {
            minute: 24,
            second: 48,
          },
          stoppageMinutes: 0,
        },
      },
    },
  },
};

describe('"event view link" selectors', () => {
  beforeEach(() => jest.clearAllMocks());

  describe("getEventViewLink selector", () => {
    it("should call createEventViewLinkCardByURNSelector", () => {
      getEventViewLink(stateMock, { urn: "ppb:1/betting" });
      expect(createCardByURNSelector).toHaveBeenCalled();
    });

    describe("when receiving event view link URNs for non-existing event", () => {
      let result;

      const viewlinkURN = "ppb:tbd:eventViewLink:29596043";

      beforeEach(() => {
        getSportEventByURN.mockReturnValue(undefined);
        result = getEventViewLink(stateMock, viewlinkURN);
      });

      it("should call getEventViewLinkCardByURN", () => {
        expect(getEventViewLinkCardByURN).toHaveBeenCalledWith(stateMock.layouts.cards.eventviewlinks, viewlinkURN);
      });

      it("should call getSportEventByURN", () => {
        expect(getSportEventByURN).toHaveBeenCalledWith(stateMock.entities.sportevents, { urn: "ppb:bfrb/betting" });
      });

      it("must return an empty array", () => {
        expect(result).toBeUndefined();
      });
    });

    describe("when receiving event view link URNs for an existing event", () => {
      let result;

      const viewLinkURN = "ppb:tbd:eventViewLink:29596043";

      beforeEach(() => {
        getSportEventByURN.mockReturnValue({
          urn: { urn: "ppb:1/fake" },
          name: "fake sport",
          competition: "fake competition",
          eventId: 1023,
        });

        result = getEventViewLink(stateMock, viewLinkURN);
      });

      it("should call getEventViewLinkCardByURN", () => {
        expect(getEventViewLinkCardByURN).toHaveBeenCalledWith(stateMock.layouts.cards.eventviewlinks, viewLinkURN);
      });

      it("should call getSportEventByURN", () => {
        expect(getSportEventByURN).toHaveBeenCalledWith(stateMock.entities.sportevents, { urn: "ppb:bfrb/betting" });
      });

      it("must return the view link card", () => {
        expect(result).toEqual({
          eventId: 1023,
          eventName: "fake sport",
          inplay: false,
          sportEventURN: {
            urn: "ppb:1/fake",
          },
          urn: "ppb:fake/betting",
          viewLink: {
            viewUrl: "fake_eventUrl",
            viewUrn: "fake_urn",
          },
          away: {
            name: "Draw",
          },
          fixtureURN: "ppb:footballfixture:29660023",
          home: {
            name: "Sheff Wed",
          },
          scheduledAt: new Date("2020-02-01T15:00:00.000Z"),
          startedAt: new Date("2019-12-23T12:05:00.000Z"),
        });
      });
    });
  });

  describe("createEventViewLinkCardHydratedByURNSelector", () => {
    describe("when all the card data exists", () => {
      it("should return the hydrated competition view link card", () => {
        getSportEventByURN.mockReturnValueOnce(sportEventMock);

        expect(createEventViewLinkCardHydratedByURNSelector()(stateMock, cardUrnMock)).toEqual({
          sportEvent: sportEventMock,
          competition: competitionMock,
          sport: sportMock,
          card: eventViewLinkCardMock,
        });
      });
    });

    describe("when there's no sport", () => {
      it("should return undefined", () => {
        getSportByURN.mockReturnValueOnce(undefined);

        expect(createEventViewLinkCardHydratedByURNSelector()(stateMock, cardUrnMock)).toEqual(undefined);
      });
    });

    describe("when there's no competition", () => {
      it("should return undefined", () => {
        getCompetitionByURN.mockReturnValueOnce(undefined);

        expect(createEventViewLinkCardHydratedByURNSelector()(stateMock, cardUrnMock)).toEqual(undefined);
      });
    });

    describe("when there's no card with the specified URN", () => {
      it("should return undefined", () => {
        getEventViewLinkCardByURN.mockReturnValueOnce(undefined);
        getCompetitionByURN.mockReturnValueOnce(undefined);
        getSportByURN.mockReturnValueOnce(undefined);

        expect(createEventViewLinkCardHydratedByURNSelector()(stateMock, cardUrnMock)).toEqual(undefined);
      });
    });
  });
});
