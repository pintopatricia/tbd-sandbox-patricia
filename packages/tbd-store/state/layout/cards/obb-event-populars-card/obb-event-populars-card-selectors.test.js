import { createObbEventPopularsCardByURNSelector } from "./obb-event-populars-card-selectors";
import { FixtureStatus } from "../../../constants";
import { fixtureCodec } from "@ppb/tbd-urn-codecs";

jest.mock("@ppb/tbd-urn-codecs");

describe("createObbEventPopularsCardByURNSelector", () => {
  const mockState = {
    layouts: {
      cards: {
        obbeventpopularscards: {
          "urn:card:1": {
            urn: "urn:card:1",
            typename: "ObbEventPopularsCard",
            title: "Popular Bets",
            badgeLabel: "Hot",
            sportEvent: "urn:event:1",
            showPopularEvidence: true,
            showStats: true,
            numberOfVisibleBettingOpportunities: 5,
            popularBettingOpportunities: [
              {
                betCount: 150,
                participants: ["urn:participant:1", "urn:participant:2"],
                legId: "leg1",
              },
            ],
          },
        },
      },
    },
    entities: {
      obbParticipants: {
        "urn:participant:1": { urn: "urn:participant:1", name: "Participant 1" },
        "urn:participant:2": { urn: "urn:participant:2", name: "Participant 2" },
      },
      sportevents: {
        "urn:event:1": {
          urn: "urn:event:1",
          name: "Sport Event 1",
          eventId: "12345",
        },
      },
      footballfixtures: {},
    },
  };

  beforeEach(() => {
    jest.mocked(fixtureCodec).encode.mockReturnValue({ uid: "fixture:urn:12345" });
  });

  it("returns the transformed card when all data is available", () => {
    const selector = createObbEventPopularsCardByURNSelector();
    const result = selector(mockState, "urn:card:1");

    expect(result).toStrictEqual({
      urn: "urn:card:1",
      typename: "ObbEventPopularsCard",
      title: "Popular Bets",
      badgeLabel: "Hot",
      sportEvent: {
        urn: "urn:event:1",
        name: "Sport Event 1",
      },
      fixture: undefined,
      showPopularEvidence: true,
      showStats: true,
      numberOfVisibleBettingOpportunities: 5,
      popularBettingOpportunities: [
        {
          betCount: 150,
          participants: [
            { urn: "urn:participant:1", name: "Participant 1" },
            { urn: "urn:participant:2", name: "Participant 2" },
          ],
          legId: "leg1",
        },
      ],
    });
  });

  it("returns undefined if the card does not exist", () => {
    const selector = createObbEventPopularsCardByURNSelector();
    const result = selector(mockState, "urn:card:nonexistent");

    expect(result).toBeUndefined();
  });

  it("returns undefined if the sport event is missing", () => {
    const state = {
      ...mockState,
      entities: {
        ...mockState.entities,
        sportevents: {},
      },
    };
    const selector = createObbEventPopularsCardByURNSelector();
    const result = selector(state, "urn:card:1");

    expect(result).toBeUndefined();
  });

  it("returns undefined if the sport event has no eventId", () => {
    const state = {
      ...mockState,
      entities: {
        ...mockState.entities,
        sportevents: {
          "urn:event:1": {
            urn: "urn:event:1",
            name: "Sport Event 1",
            eventId: null,
          },
        },
      },
    };
    const selector = createObbEventPopularsCardByURNSelector();
    const result = selector(state, "urn:card:1");

    expect(result).toBeUndefined();
  });

  it("returns fixture when available in footballfixtures", () => {
    const mockFixture = {
      urn: "fixture:urn:12345",
      fixtureStatus: FixtureStatus.PRE_MATCH,
      scheduledAt: new Date("2025-12-23T15:00:00Z"),
    };

    const state = {
      ...mockState,
      entities: {
        ...mockState.entities,
        footballfixtures: {
          "fixture:urn:12345": mockFixture,
        },
      },
    };

    const selector = createObbEventPopularsCardByURNSelector();
    const result = selector(state, "urn:card:1");

    expect(result.fixture).toEqual(mockFixture);
  });

  it("returns undefined fixture when not available in footballfixtures", () => {
    const selector = createObbEventPopularsCardByURNSelector();
    const result = selector(mockState, "urn:card:1");

    expect(result.fixture).toBeUndefined();
  });

  it("returns undefined fixture when fixtureUrn cannot be encoded", () => {
    const state = {
      ...mockState,
      entities: {
        ...mockState.entities,
        sportevents: {
          "urn:event:1": {
            urn: "urn:event:1",
            name: "Sport Event 1",
            eventId: "12345",
          },
        },
        footballfixtures: {
          "fixture:urn:": {
            urn: "fixture:urn:",
            fixtureStatus: FixtureStatus.PRE_MATCH,
          },
        },
      },
    };

    const selector = createObbEventPopularsCardByURNSelector();
    const result = selector(state, "urn:card:1");

    expect(result).toBeDefined();
    expect(result.fixture).toBeUndefined();
  });
});
