import { createObbCreatedBetsCardByURNSelector } from "./obb-created-bets-card-selectors";

describe("createObbCreatedBetsCardByURNSelector", () => {
  const mockState = {
    layouts: {
      cards: {
        obbcreatedbetscards: {
          "urn:card:1": {
            urn: "urn:card:1",
            typename: "ObbCreatedBetsCard",
            fixture: "urn:fixture:1",
            sportEvent: "urn:event:1",
            eventViewLink: "/event/1",
            footerViewLink: "/footer/1",
            bettingOpportunities: [
              {
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
      footballfixtures: {
        "urn:fixture:1": {
          urn: "urn:fixture:1",
          duration: { status: "ONGOING" },
          scheduledAt: "2023-10-01T12:00:00Z",
        },
      },
      sportevents: {
        "urn:event:1": {
          urn: "urn:event:1",
          name: "Sport Event 1",
        },
      },
    },
  };

  it("returns the transformed card when all data is available", () => {
    const selector = createObbCreatedBetsCardByURNSelector();
    const result = selector(mockState, "urn:card:1");

    expect(result).toEqual({
      urn: "urn:card:1",
      typename: "ObbCreatedBetsCard",
      fixture: {
        urn: "urn:fixture:1",
        status: "ONGOING",
        scheduledAt: "2023-10-01T12:00:00Z",
      },
      sportEvent: {
        urn: "urn:event:1",
        name: "Sport Event 1",
      },
      eventViewLink: "/event/1",
      footerViewLink: "/footer/1",
      bettingOpportunities: [
        {
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
    const selector = createObbCreatedBetsCardByURNSelector();
    const result = selector(mockState, "urn:card:nonexistent");

    expect(result).toBeUndefined();
  });

  it("returns undefined if the fixture is missing", () => {
    const state = {
      ...mockState,
      entities: {
        ...mockState.entities,
        footballfixtures: {},
      },
    };
    const selector = createObbCreatedBetsCardByURNSelector();
    const result = selector(state, "urn:card:1");

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
    const selector = createObbCreatedBetsCardByURNSelector();
    const result = selector(state, "urn:card:1");

    expect(result).toBeUndefined();
  });
});
