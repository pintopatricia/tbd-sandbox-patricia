import { createObbOnboardingCardsCardGroupByURNSelector } from "@ppb/tbd-store/state/layout/cardgroups/obb-onboarding-cards-cardgroups/obb-onboarding-cards-cardgroups-selectors";
import {
  OBB_ONBOARDING_CARDS__CARD_GROUP_DISPLAYED,
  OBB_ONBOARDING_CARDS__CARD_GROUP_SWIPED,
  OBB_CARD__EVENT_SELECTION,
} from "@ppb/tbd-store/actions/obb";
import { DELETE_VIEW_ITEMS } from "@ppb/tbd-store";
import { FixtureStatus } from "@ppb/tbd-store/state/constants";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

const DEFAULT_STATE = {};

jest.mock(
  "@ppb/tbd-store/state/layout/cardgroups/obb-onboarding-cards-cardgroups/obb-onboarding-cards-cardgroups-selectors",
  () => ({
    createObbOnboardingCardsCardGroupByURNSelector: jest.fn(),
  }),
);

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key, interpolationValues }) =>
    interpolationValues ? `${key}:${JSON.stringify(interpolationValues)}` : key,
  ),
}));

jest.mock("../../helpers/obb", () => ({
  getIncidentDataMapping: jest.fn((id) => (id ? { text: `Incident-${id}` } : null)),
}));

const getObbOnboardingCardsCardGroupByURN = jest.fn();

const buildParticipant = (id, { withJersey = true } = {}) => ({
  typename: "ObbFootballPlayer",
  urn: `participant:urn:${id}`,
  player: { id: `p${id}`, name: `Player ${id}`, shirtNumber: id, position: "Forward" },
  team: {
    id: `t${id}`,
    name: `Team ${id}`,
    color: "#FF0000",
    crest: null,
    jerseys: withJersey ? [{ type: "home", color: "#fff", url: `https://jerseys/${id}.png` }] : null,
  },
});

describe("mapDispatchToProps", () => {
  let dispatch;
  let props;

  beforeEach(() => {
    dispatch = jest.fn();
    props = mapDispatchToProps(dispatch, { urn: "cardGroup:urn:1" });
  });

  it("should dispatch OBB_ONBOARDING_CARDS__CARD_GROUP_DISPLAYED when dispatchOnboardingCardGroupDisplayed is called", () => {
    props.dispatchOnboardingCardGroupDisplayed("Team A vs Team B", 3);

    expect(dispatch).toHaveBeenCalledWith({
      type: OBB_ONBOARDING_CARDS__CARD_GROUP_DISPLAYED,
      payload: {
        eventName: "Team A vs Team B",
        urn: "cardGroup:urn:1",
        numberOfCards: 3,
      },
    });
  });

  it("should dispatch OBB_ONBOARDING_CARDS__CARD_GROUP_SWIPED when dispatchOnboardingCardGroupScrollEvent is called", () => {
    props.dispatchOnboardingCardGroupScrollEvent("Team A vs Team B", "right");

    expect(dispatch).toHaveBeenCalledWith({
      type: OBB_ONBOARDING_CARDS__CARD_GROUP_SWIPED,
      payload: {
        eventName: "Team A vs Team B",
        urn: "cardGroup:urn:1",
        direction: "right",
      },
    });
  });

  it("should dispatch OBB_CARD__EVENT_SELECTION when dispatchObbEventSelection is called", () => {
    const event = { elementText: "next", module: { group: "squad bet", card: "onboarding card" } };

    props.dispatchObbEventSelection(event, "Team A vs Team B");

    expect(dispatch).toHaveBeenCalledWith({
      type: OBB_CARD__EVENT_SELECTION,
      payload: {
        event,
        urn: "cardGroup:urn:1",
        eventName: "Team A vs Team B",
      },
    });
  });

  it("should dispatch DELETE_VIEW_ITEMS when dispatchDeleteObbOnboardingCardsCardGroup is called", () => {
    props.dispatchDeleteObbOnboardingCardsCardGroup();

    expect(dispatch).toHaveBeenCalledWith({
      type: DELETE_VIEW_ITEMS,
      payload: ["cardGroup:urn:1"],
    });
  });
});

describe("makeMapStateToProps", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    createObbOnboardingCardsCardGroupByURNSelector.mockReturnValue(getObbOnboardingCardsCardGroupByURN);
  });

  describe("when the card group is not defined", () => {
    it("should return an empty object", () => {
      getObbOnboardingCardsCardGroupByURN.mockReturnValueOnce(undefined);

      const stateToProps = makeMapStateToProps()(DEFAULT_STATE, { urn: "urn" });

      expect(stateToProps).toEqual({});
    });
  });

  describe("when the card group is defined", () => {
    it("should map a SquadVsSquad onboarding card by partitioning participants per squad", () => {
      const participantA1 = buildParticipant(1);
      const participantA2 = buildParticipant(2);
      const participantB1 = buildParticipant(3);

      getObbOnboardingCardsCardGroupByURN.mockReturnValueOnce({
        typename: "ObbOnboardingCardsCardGroup",
        title: "Onboarding Title",
        badgeLabel: "New",
        event: {
          urn: "event:urn:1",
          name: "Team A vs Team B",
          eventId: "12345",
          openDate: "2099-04-20T15:00:00Z",
        },
        onboardingCards: [
          {
            participants: [participantA1, participantA2, participantB1],
            legs: [
              {
                id: "leg-1",
                templateId: "squadVsSquad",
                templateParams: {
                  squadAParticipantIds: [{ urn: participantA1.urn }, { urn: participantA2.urn }],
                  squadBParticipantIds: [{ urn: participantB1.urn }],
                  outcomeIds: ["GOALS"],
                  timePeriodId: "full-time",
                  quantifier: "MORE",
                },
              },
            ],
          },
        ],
      });

      const stateToProps = makeMapStateToProps()(DEFAULT_STATE, { urn: "urn" });

      expect(stateToProps).toEqual({
        urn: "urn",
        title: "Onboarding Title",
        badgeLabel: "New",
        event: {
          urn: "event:urn:1",
          name: "Team A vs Team B",
          eventId: "12345",
          openDate: "2099-04-20T15:00:00Z",
        },
        clearCardGroupView: false,
        onboardingCards: [
          {
            type: "SquadVsSquad",
            legIds: ["leg-1"],
            outcomeLabel: 'I18N.OBB.SQUAD_VS_SQUAD.DEFAULT_OUTCOMES.LABEL:{"outcome":"incident-goals"}',
            jerseySize: "small",
            squadAParticipants: [
              { urn: participantA1.urn, name: "Player 1", jersey: "https://jerseys/1.png" },
              { urn: participantA2.urn, name: "Player 2", jersey: "https://jerseys/2.png" },
            ],
            squadBParticipants: [{ urn: participantB1.urn, name: "Player 3", jersey: "https://jerseys/3.png" }],
          },
        ],
      });
    });

    it("should set jerseySize to large when each squad has a single participant", () => {
      const participantA = buildParticipant(1);
      const participantB = buildParticipant(2);

      getObbOnboardingCardsCardGroupByURN.mockReturnValueOnce({
        typename: "ObbOnboardingCardsCardGroup",
        event: { urn: "event:urn:1", name: "evt", eventId: "1", openDate: "2099-04-20T15:00:00Z" },
        onboardingCards: [
          {
            participants: [participantA, participantB],
            legs: [
              {
                id: "leg-large",
                templateId: "squadVsSquad",
                templateParams: {
                  squadAParticipantIds: [{ urn: participantA.urn }],
                  squadBParticipantIds: [{ urn: participantB.urn }],
                  outcomeIds: ["GOALS"],
                  timePeriodId: "full-time",
                  quantifier: "MORE",
                },
              },
            ],
          },
        ],
      });

      const stateToProps = makeMapStateToProps()(DEFAULT_STATE, { urn: "urn" });

      expect(stateToProps.onboardingCards[0]).toMatchObject({
        type: "SquadVsSquad",
        legIds: ["leg-large"],
        jerseySize: "large",
      });
    });

    it("should map a SquadBet onboarding card with combined participants", () => {
      const participant1 = buildParticipant(1, { withJersey: false });
      const participant2 = buildParticipant(2);

      getObbOnboardingCardsCardGroupByURN.mockReturnValueOnce({
        typename: "ObbOnboardingCardsCardGroup",
        title: "Onboarding Title",
        event: {
          urn: "event:urn:1",
          name: "Team A vs Team B",
          eventId: "12345",
          openDate: "2099-04-20T15:00:00Z",
        },
        onboardingCards: [
          {
            participants: [participant1, participant2],
            legs: [
              {
                id: "leg-2",
                templateId: "participantsCombined",
                templateParams: {
                  participantIds: [{ urn: participant1.urn }, { urn: participant2.urn }],
                  outcomeIds: ["SHOTS"],
                  value: 1,
                  timePeriodId: "full-time",
                  quantifier: "MORE",
                },
              },
            ],
          },
        ],
      });

      const stateToProps = makeMapStateToProps()(DEFAULT_STATE, { urn: "urn" });

      expect(stateToProps.onboardingCards).toEqual([
        {
          type: "SquadBet",
          legIds: ["leg-2"],
          outcomeLabel: 'I18N.OBB.ONBOARDINGCARDS.SQUADBET.TITLE:{"outcome":"incident-shots"}',
          participants: [
            { urn: participant1.urn, name: "Player 1", jersey: undefined },
            { urn: participant2.urn, name: "Player 2", jersey: "https://jerseys/2.png" },
          ],
        },
      ]);
    });

    it("should map a SquadBet card from a PvP leg using outcomeId", () => {
      const participant1 = buildParticipant(1);
      const participant2 = buildParticipant(2);

      getObbOnboardingCardsCardGroupByURN.mockReturnValueOnce({
        typename: "ObbOnboardingCardsCardGroup",
        event: { urn: "event:urn:1", name: "evt", eventId: "1", openDate: "2099-04-20T15:00:00Z" },
        onboardingCards: [
          {
            participants: [participant1, participant2],
            legs: [
              {
                id: "leg-3",
                templateId: "playerVsPlayer",
                templateParams: {
                  participantIdA: participant1.urn,
                  participantIdB: participant2.urn,
                  outcomeId: "ASSISTS",
                  timePeriodId: "full-time",
                },
              },
            ],
          },
        ],
      });

      const stateToProps = makeMapStateToProps()(DEFAULT_STATE, { urn: "urn" });

      expect(stateToProps.onboardingCards).toEqual([
        {
          type: "SquadBet",
          legIds: ["leg-3"],
          outcomeLabel: 'I18N.OBB.ONBOARDINGCARDS.SQUADBET.TITLE:{"outcome":"incident-assists"}',
          participants: [
            { urn: participant1.urn, name: "Player 1", jersey: "https://jerseys/1.png" },
            { urn: participant2.urn, name: "Player 2", jersey: "https://jerseys/2.png" },
          ],
        },
      ]);
    });

    it("should handle missing optional fields and empty onboarding cards", () => {
      getObbOnboardingCardsCardGroupByURN.mockReturnValueOnce({
        typename: "ObbOnboardingCardsCardGroup",
        title: "Title",
        event: {
          urn: "event:urn:1",
          name: "Team A vs Team B",
          eventId: "12345",
          openDate: "2099-04-20T15:00:00Z",
        },
        onboardingCards: [],
      });

      const stateToProps = makeMapStateToProps()(DEFAULT_STATE, { urn: "urn" });

      expect(stateToProps).toEqual({
        urn: "urn",
        title: "Title",
        badgeLabel: undefined,
        event: {
          urn: "event:urn:1",
          name: "Team A vs Team B",
          eventId: "12345",
          openDate: "2099-04-20T15:00:00Z",
        },
        clearCardGroupView: true,
        onboardingCards: [],
      });
    });

    it("should drop cards whose outcome cannot be resolved", () => {
      const participant = buildParticipant(1);

      getObbOnboardingCardsCardGroupByURN.mockReturnValueOnce({
        typename: "ObbOnboardingCardsCardGroup",
        title: "Title",
        event: { urn: "event:urn:1", name: "evt", eventId: "1", openDate: "2099-04-20T15:00:00Z" },
        onboardingCards: [
          {
            participants: [participant],
            legs: [
              {
                id: "leg-missing-outcome",
                templateId: "participantsCombined",
                templateParams: {
                  participantIds: [{ urn: participant.urn }],
                  timePeriodId: "full-time",
                  quantifier: "MORE",
                },
              },
            ],
          },
        ],
      });

      const stateToProps = makeMapStateToProps()(DEFAULT_STATE, { urn: "urn" });

      expect(stateToProps.onboardingCards).toEqual([]);
    });

    it("should drop cards whose outcome incident is unknown", () => {
      const participant = buildParticipant(1);

      getObbOnboardingCardsCardGroupByURN.mockReturnValueOnce({
        typename: "ObbOnboardingCardsCardGroup",
        title: "Title",
        event: { urn: "event:urn:1", name: "evt", eventId: "1", openDate: "2099-04-20T15:00:00Z" },
        onboardingCards: [
          {
            participants: [participant],
            legs: [
              {
                id: "leg-unknown-outcome",
                templateId: "participantsCombined",
                templateParams: {
                  participantIds: [{ urn: participant.urn }],
                  outcomeIds: [""],
                  timePeriodId: "full-time",
                  quantifier: "MORE",
                },
              },
            ],
          },
        ],
      });

      const stateToProps = makeMapStateToProps()(DEFAULT_STATE, { urn: "urn" });

      expect(stateToProps.onboardingCards).toEqual([]);
    });

    it("should expose clearCardGroupView=true when the football fixture is in play", () => {
      getObbOnboardingCardsCardGroupByURN.mockReturnValueOnce({
        typename: "ObbOnboardingCardsCardGroup",
        event: { urn: "event:urn:1", name: "evt", eventId: "42", openDate: "2099-04-20T15:00:00Z" },
        onboardingCards: [],
        fixture: { fixtureStatus: FixtureStatus.IN_PLAY },
      });

      const stateToProps = makeMapStateToProps()(DEFAULT_STATE, { urn: "urn" });

      expect(stateToProps.clearCardGroupView).toBe(true);
    });

    it("should expose clearCardGroupView=true when the event open date is in the past", () => {
      getObbOnboardingCardsCardGroupByURN.mockReturnValueOnce({
        typename: "ObbOnboardingCardsCardGroup",
        event: { urn: "event:urn:1", name: "evt", eventId: "42", openDate: "2000-01-01T00:00:00Z" },
        onboardingCards: [],
        fixture: undefined,
      });

      const stateToProps = makeMapStateToProps()(DEFAULT_STATE, { urn: "urn" });

      expect(stateToProps.clearCardGroupView).toBe(true);
    });

    it("should expose clearCardGroupView=false when the fixture is pre-match, the event is in the future, and there are cards", () => {
      const participant = buildParticipant(1);

      getObbOnboardingCardsCardGroupByURN.mockReturnValueOnce({
        typename: "ObbOnboardingCardsCardGroup",
        event: { urn: "event:urn:1", name: "evt", eventId: "42", openDate: "2099-04-20T15:00:00Z" },
        onboardingCards: [
          {
            participants: [participant],
            legs: [
              {
                id: "leg-prematch",
                templateId: "participantsCombined",
                templateParams: {
                  participantIds: [{ urn: participant.urn }],
                  outcomeIds: ["GOALS"],
                  timePeriodId: "full-time",
                  quantifier: "MORE",
                },
              },
            ],
          },
        ],
        fixture: { fixtureStatus: FixtureStatus.PRE_MATCH },
      });

      const stateToProps = makeMapStateToProps()(DEFAULT_STATE, { urn: "urn" });

      expect(stateToProps.clearCardGroupView).toBe(false);
    });

    it("should expose clearCardGroupView=true when the fixture scheduledAt is in the past despite a future open date", () => {
      getObbOnboardingCardsCardGroupByURN.mockReturnValueOnce({
        typename: "ObbOnboardingCardsCardGroup",
        event: { urn: "event:urn:1", name: "evt", eventId: "42", openDate: "2099-04-20T15:00:00Z" },
        onboardingCards: [],
        fixture: {
          fixtureStatus: FixtureStatus.PRE_MATCH,
          scheduledAt: new Date("2000-01-01T00:00:00Z"),
        },
      });

      const stateToProps = makeMapStateToProps()(DEFAULT_STATE, { urn: "urn" });

      expect(stateToProps.clearCardGroupView).toBe(true);
    });

    it("should expose clearCardGroupView=false when the event open date is malformed, no fixture signal is set, and there are cards", () => {
      const participant = buildParticipant(1);

      getObbOnboardingCardsCardGroupByURN.mockReturnValueOnce({
        typename: "ObbOnboardingCardsCardGroup",
        event: { urn: "event:urn:1", name: "evt", eventId: "42", openDate: "not-a-real-date" },
        onboardingCards: [
          {
            participants: [participant],
            legs: [
              {
                id: "leg-malformed-date",
                templateId: "participantsCombined",
                templateParams: {
                  participantIds: [{ urn: participant.urn }],
                  outcomeIds: ["GOALS"],
                  timePeriodId: "full-time",
                  quantifier: "MORE",
                },
              },
            ],
          },
        ],
        fixture: undefined,
      });

      const stateToProps = makeMapStateToProps()(DEFAULT_STATE, { urn: "urn" });

      expect(stateToProps.clearCardGroupView).toBe(false);
    });
  });
});
