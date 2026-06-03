import { FootballMatchStatus } from "@ppb/tbd-store";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(() => "See all bets"),
}));

jest.mock("@ppb/tbd-store/state/layout-snapshot", () => ({
  getLayoutMetadata: jest.fn(() => ({ verticalPosition: 3 })),
}));

jest.mock("./ObbCreatedBetsCard.helpers", () => ({
  buildBettingOpportunitiesVm: jest.fn((opportunities) =>
    opportunities.map((opp) => ({
      legId: opp.legId,
      legTemplateId: "opp-leg-template-id-mock",
      playerNames: "Player One & Player Two",
      outcomeDescription: "Score 5+ Goals",
      statsLabel: "5.6 goals on average",
      incidentType: "GOALS",
      quote: { odds: "1.2" },
    })),
  ),
}));

const mockBettingOpportunity = {
  legId: "mockLegId",
  participants: ["participant-1", "participant-2"],
};

const mockCardUrn = "urn:ppb:card:obb-created-bets:123";
const mockFixtureUrn = "urn:fixture:123";
const mockEventUrn = "urn:event:123";

const mockObbLeg = {
  id: "mockLegId",
  templateId: "participantsCombined",
  templateParams: {
    outcomeIds: ["GOALS"],
    value: 5,
    quantifier: "GREATER_THAN_OR_EQUAL_TO",
  },
  quote: {
    __typename: "ObbQuoteSuccess",
    price: {
      decimal: 2.5,
      fractional: {
        numerator: 3,
        denominator: 2,
      },
    },
  },
};

const mockState = {
  layouts: {
    cards: {
      obbcreatedbetscards: {
        [mockCardUrn]: {
          urn: mockCardUrn,
          typename: "ObbCreatedBetsCard",
          fixture: mockFixtureUrn,
          sportEvent: mockEventUrn,
          footerViewLink: {
            viewUrn: "urn:view:footer",
            viewUrl: "/footer",
          },
          eventViewLink: {
            viewUrn: "urn:view:event",
            viewUrl: "/event",
          },
          bettingOpportunities: [mockBettingOpportunity],
        },
      },
    },
  },
  entities: {
    obbLegs: {
      mockLegId: mockObbLeg,
    },
    obbParticipants: {
      "participant-1": {
        id: "participant-1",
        player: { name: "Player One" },
      },
      "participant-2": {
        id: "participant-2",
        player: { name: "Player Two" },
      },
    },
    footballfixtures: {
      [mockFixtureUrn]: {
        urn: mockFixtureUrn,
        duration: {
          status: FootballMatchStatus.PRE_MATCH,
        },
        scheduledAt: null,
      },
    },
    sportevents: {
      [mockEventUrn]: {
        urn: mockEventUrn,
        name: "Team A vs Team B",
      },
    },
  },
};

describe("makeMapStateToProps", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return the correct props when the card exists and fixture is in pre-match", () => {
    const mapStateToProps = makeMapStateToProps();
    const props = mapStateToProps(mockState, { urn: mockCardUrn, fullWidth: false, cardIndex: 1 });

    expect(props).toEqual({
      fixtureUrn: "urn:fixture:123",
      eventUrn: "urn:event:123",
      eventName: "Team A vs Team B",
      isEventInPlay: false,
      eventViewLink: {
        viewUrn: "urn:view:event",
        viewUrl: "/event",
      },
      footerViewLink: {
        viewUrn: "urn:view:footer",
        viewUrl: "/footer",
      },
      footerLabel: "See all bets",
      position: {
        horizontalPosition: 2,
        verticalPosition: 3,
      },
      bettingOpportunities: [
        {
          legId: "mockLegId",
          legTemplateId: "opp-leg-template-id-mock",
          playerNames: "Player One & Player Two",
          outcomeDescription: "Score 5+ Goals",
          statsLabel: "5.6 goals on average",
          incidentType: "GOALS",
          quote: { odds: "1.2" },
        },
      ],
    });
  });

  it("should return empty object when the card does not exist", () => {
    const mapStateToProps = makeMapStateToProps();
    const props = mapStateToProps(mockState, { urn: "urn:ppb:card:nonexistent", fullWidth: false });

    expect(props).toEqual({});
  });

  it("should return empty object when betting opportunities are empty", () => {
    const stateWithNoOpportunities = {
      ...mockState,
      layouts: {
        cards: {
          obbcreatedbetscards: {
            [mockCardUrn]: {
              ...mockState.layouts.cards.obbcreatedbetscards[mockCardUrn],
              bettingOpportunities: [],
            },
          },
        },
      },
    };

    const mapStateToProps = makeMapStateToProps();
    const props = mapStateToProps(stateWithNoOpportunities, { urn: mockCardUrn, fullWidth: false });

    expect(props).toEqual({});
  });

  it("should set isEventInPlay to true when fixture status is not PRE_MATCH", () => {
    const inPlayState = {
      ...mockState,
      entities: {
        ...mockState.entities,
        footballfixtures: {
          [mockFixtureUrn]: {
            ...mockState.entities.footballfixtures[mockFixtureUrn],
            duration: {
              status: FootballMatchStatus.INPLAY_FIRST_HALF,
            },
          },
        },
      },
    };

    const mapStateToProps = makeMapStateToProps();
    const props = mapStateToProps(inPlayState, { urn: mockCardUrn, fullWidth: false });

    expect(props.isEventInPlay).toBe(true);
  });

  it("should set isEventInPlay to true when scheduled time has passed", () => {
    const pastTime = new Date(Date.now() - 10000); // 10 seconds ago
    const stateWithPastScheduledTime = {
      ...mockState,
      entities: {
        ...mockState.entities,
        footballfixtures: {
          [mockFixtureUrn]: {
            ...mockState.entities.footballfixtures[mockFixtureUrn],
            scheduledAt: pastTime,
          },
        },
      },
    };

    const mapStateToProps = makeMapStateToProps();
    const props = mapStateToProps(stateWithPastScheduledTime, { urn: mockCardUrn, fullWidth: false });

    expect(props.isEventInPlay).toBe(true);
  });
});

describe("mapDispatchToProps", () => {
  const dispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should dispatch UI/OBB_INPLAY_BET_CLICK when dispatchInactiveObbBetButtonClick is called", () => {
    const { dispatchInactiveObbBetButtonClick } = mapDispatchToProps(dispatch);

    dispatchInactiveObbBetButtonClick("some-template-leg-id");

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({
      type: "UI/OBB_INPLAY_BET_CLICK",
      payload: {
        legTemplateId: "some-template-leg-id",
      },
    });
  });

  it("should dispatch Router/push action when dispatchPushAction is called", () => {
    const { dispatchPushAction } = mapDispatchToProps(dispatch);
    const mockViewLink = {
      viewUrn: "urn:view:test",
      viewUrl: "/test",
    };

    dispatchPushAction(mockViewLink);

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({
      type: "Router/push",
      payload: mockViewLink,
    });
  });

  it("should dispatch UI__OBB_CREATED_BETS_LINK_CLICKED when dispatchLinkClick is called", () => {
    const { dispatchLinkClick } = mapDispatchToProps(dispatch);
    const mockViewLink = {
      viewUrn: "urn:view:test",
      viewUrl: "/test",
    };

    dispatchLinkClick(mockViewLink, "urn", "label", "eventName", 4);

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({
      type: "UI__OBB_CREATED_BETS_LINK_CLICKED",
      payload: {
        urn: "urn",
        label: "label",
        viewUrl: mockViewLink.viewUrl,
        cardIndex: 4,
        event: "eventName",
      },
    });
  });
});
