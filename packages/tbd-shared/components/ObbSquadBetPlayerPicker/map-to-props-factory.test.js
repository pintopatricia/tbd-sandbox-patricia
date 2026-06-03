import { createObbSquadBetCardWithModalFieldsByURNSelector } from "@ppb/tbd-store/state/layout/cards/obb-card/obb-card-selectors";
import { OddsDisplayPreference } from "@ppb/tbd-store";
import {
  OBB_CARD__CLEAR_SQUADBET_MODAL_ERROR,
  OBB_CARD__TOGGLE_SQUADBET_MODAL_PARTICIPANT,
  OBB_CARD__EVENT_SELECTION,
  UI__TOGGLE_SQUAD_BET_PLAYER_PICKER_SQUAD_PARTICIPANT,
  UI__CLOSE_PLAYER_PICKER_MODAL,
  UI__SQUAD_BET_PLAYER_PICKER_BET_BUTTON_CLICK,
  UI__SQUAD_BET_PLAYER_PICKER_REMOVE_SQUAD_PARTICIPANT,
} from "@ppb/tbd-store/actions/obb";
import { BETTING__OBB_TOGGLE_MULTIPLE_LEG_ACTION } from "@ppb/tbd-store/actions/betting";
import { mapDispatchToProps, makeMapStateToProps } from "./map-to-props-factory";
import { buildPlayer, getStatsLabels } from "../../helpers/obb";

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.mock("@ppb/tbd-shared/helpers/obb", () => ({
  getStatsLabels: jest.fn(),
  getStatsByIncidentType: jest.fn(),
  formatQuote: jest.fn(() => "2/1"),
  mapQuantifierEnumToSymbol: jest.fn(() => "+"),
  buildPlayer: jest.fn(),
  getSquadAverageStatByIncidentType: jest.fn(() => "3.1"),
}));

jest.mock("@ppb/tbd-shared/helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.mock("@ppb/tbd-store/state/layout/cards/obb-card/obb-card-selectors", () => ({
  createObbSquadBetCardWithModalFieldsByURNSelector: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/entities/obb-legs/obb-legs-selector", () => ({
  createObbLegByIdSelector: jest.fn(() => (state, id) => ({
    id,
    quote: { typename: "ObbQuoteSuccess", price: 1.5 },
    templateParams: {
      value: "10",
      quantifier: "OVER",
    },
  })),
}));

const DEFAULT_STATE = {
  layouts: {
    cards: {
      obbcards: {
        defaultLegs: [
          "5d4d6e2f368d2478",
          "1438b2bb77a2c3d0",
          "7fcb7dcf89d0a2f8",
          "3d3131a72f25f328",
          "a8b075031fa274b4",
          "6216228f36eafec0",
          "d1a8f3ef399b1d00",
          "588c212b3a9917b8",
        ],
      },
    },
  },
  entities: {
    preferences: {
      exchangeOddsDisplay: OddsDisplayPreference.Decimal,
    },
    brandSettings: {
      SPORTSBOOK_BET_BUTTON_ANIMATION: false,
    },
  },
  betting: {
    obbBetting: {
      legs: {
        "5d4d6e2f368d2478": { id: "5d4d6e2f368d2478" },
        "1438b2bb77a2c3d0": { id: "1438b2bb77a2c3d0" },
      },
    },
  },
};

const mockGetObbSquadBetCardByURN = {
  urn: "ppb:obb:card:squadBet:aGvuzRAAAB8AaAld/e/34501806",
  typename: "ObbSquadBetCard",
  title: "🚀 Top shooters",
  outcomesLabel: "How many shots on target between them?",
  statsLabel: "Avg shots on target, combined",
  showModalEntryPoint: true,
  entryPointLabel: "Edit Squad",
  participantInfo: "Average stats per game, this season and competition",
  sportevent: {
    typename: "SportsEvent",
    urn: "ppb:event:34501806",
    name: "Chelsea v Paris St-G",
    eventId: 34501806,
  },
  eventParticipants: [
    {
      urn: "ppb:obb:footballPlayer:21651/e/34501806",
      typename: "ObbFootballPlayer",
      player: {
        id: 21651,
        name: "Marquinhos",
        position: null,
        seasonStats: {
          matchesPlayed: 0,
          averages: {
            goals: 0,
            totalShots: 0,
            shotsOnTarget: 0,
            yellowRedCards: 0,
            redCards: 0,
            yellowCards: 0,
            fouls: 0,
            foulsWon: 0,
            assists: 0,
            passes: 0,
          },
        },
      },
      team: {
        id: 247284,
        name: "Paris St-G",
        color: null,
        jerseys: [
          {
            url: "https://content-s3.betfair.com/jic/uki/bf/PSG_Away_Jersey.svg",
          },
        ],
      },
    },
    {
      urn: "ppb:obb:footballPlayer:47226/e/34501806",
      typename: "ObbFootballPlayer",
      player: {
        id: "47226",
        name: "Christopher Nkunku",
        position: null,
        seasonStats: {
          matchesPlayed: 0,
          averages: {
            goals: 0,
            totalShots: 0,
            shotsOnTarget: 0,
            yellowRedCards: 0,
            redCards: 0,
            yellowCards: 0,
            fouls: 0,
            foulsWon: 0,
            assists: 0,
            passes: 0,
          },
        },
      },
      team: {
        id: "7",
        name: "Chelsea",
        color: null,
        jerseys: [
          {
            url: "https://content-s3.betfair.com/jic/uki/bf/Chelsea_Home_Jersey.svg",
          },
        ],
      },
    },
  ],
  modalParticipants: [
    {
      urn: "ppb:obb:footballPlayer:21651/e/34501806",
      typename: "ObbFootballPlayer",
      player: {
        id: 21651,
        name: "Marquinhos",
        position: null,
        seasonStats: {
          matchesPlayed: 0,
          averages: {
            goals: 0,
            totalShots: 0,
            shotsOnTarget: 0,
            yellowRedCards: 0,
            redCards: 0,
            yellowCards: 0,
            fouls: 0,
            foulsWon: 0,
            assists: 0,
            passes: 0,
          },
        },
      },
      team: {
        id: "247284",
        name: "Paris St-G",
        color: null,
        jerseys: [
          {
            url: "https://content-s3.betfair.com/jic/uki/bf/PSG_Away_Jersey.svg",
          },
        ],
      },
    },
  ],
  incidentType: "SHOTS_ON_TARGET",
  modalLegs: [
    "5d4d6e2f368d2478",
    "1438b2bb77a2c3d0",
    "7fcb7dcf89d0a2f8",
    "3d3131a72f25f328",
    "a8b075031fa274b4",
    "6216228f36eafec0",
    "d1a8f3ef399b1d00",
    "588c212b3a9917b8",
  ],
  modalDefaultOutcomeIndex: 0,
  modalIsLoadingQuotes: false,
  modalError: null,
};

const mockStateToProps = {
  eventName: "Chelsea v Paris St-G",
  incidentType: "SHOTS_ON_TARGET",
  urn: "ppb:obb:card:squadBet:aGvuzRAAAB8AaAld/e/34501806",
  eventParticipants: [
    {
      urn: "ppb:obb:footballPlayer:21651/e/34501806",
      typename: "ObbFootballPlayer",
      player: {
        id: 21651,
        name: "Marquinhos",
        position: null,
        seasonStats: {
          matchesPlayed: 0,
          averages: {
            goals: 0,
            totalShots: 0,
            shotsOnTarget: 0,
            yellowRedCards: 0,
            redCards: 0,
            yellowCards: 0,
            fouls: 0,
            foulsWon: 0,
            assists: 0,
            passes: 0,
          },
        },
      },
      team: {
        id: 247284,
        name: "Paris St-G",
        color: null,
        jerseys: [
          {
            url: "https://content-s3.betfair.com/jic/uki/bf/PSG_Away_Jersey.svg",
          },
        ],
      },
      stats: undefined,
    },
    {
      urn: "ppb:obb:footballPlayer:47226/e/34501806",
      typename: "ObbFootballPlayer",
      player: {
        id: "47226",
        name: "Christopher Nkunku",
        position: null,
        seasonStats: {
          matchesPlayed: 0,
          averages: {
            goals: 0,
            totalShots: 0,
            shotsOnTarget: 0,
            yellowRedCards: 0,
            redCards: 0,
            yellowCards: 0,
            fouls: 0,
            foulsWon: 0,
            assists: 0,
            passes: 0,
          },
        },
      },
      team: {
        id: "7",
        name: "Chelsea",
        color: null,
        jerseys: [
          {
            url: "https://content-s3.betfair.com/jic/uki/bf/Chelsea_Home_Jersey.svg",
          },
        ],
      },
      stats: undefined,
    },
  ],
  modalParticipants: [
    {
      status: "loaded",
      firstName: "Marquinhos",
      jersey: "https://content-s3.betfair.com/jic/uki/bf/PSG_Away_Jersey.svg",
    },
  ],
  legsInBetslip: {
    "5d4d6e2f368d2478": { id: "5d4d6e2f368d2478" },
    "1438b2bb77a2c3d0": { id: "1438b2bb77a2c3d0" },
  },
  modalLegs: [
    {
      id: "5d4d6e2f368d2478",
      outcome: "10-",
      quote: "2/1",
      status: "selected",
    },
    {
      id: "1438b2bb77a2c3d0",
      outcome: "10-",
      quote: "2/1",
      status: "selected",
    },
    {
      id: "7fcb7dcf89d0a2f8",
      outcome: "10-",
      quote: "2/1",
      status: "default",
    },
    {
      id: "3d3131a72f25f328",
      outcome: "10-",
      quote: "2/1",
      status: "default",
    },
    {
      id: "a8b075031fa274b4",
      outcome: "10-",
      quote: "2/1",
      status: "default",
    },
    {
      id: "6216228f36eafec0",
      outcome: "10-",
      quote: "2/1",
      status: "default",
    },
    {
      id: "d1a8f3ef399b1d00",
      outcome: "10-",
      quote: "2/1",
      status: "default",
    },
    {
      id: "588c212b3a9917b8",
      outcome: "10-",
      quote: "2/1",
      status: "default",
    },
  ],
  statsLabel: "3.1 Avg shots on target, combined",
  outcomesLabel: "How many shots on target between them?",
  modalDefaultOutcomeIndex: 0,
  title: "Edit Squad - Shots On Target",
  participantInfo: "Average stats per game, this season and competition",
  i18nLabels: {
    addToBetslipLabel: "I18N.BETSLIP.ADD_TO_BETSLIP",
    alertLabel: "I18N.OBB.SQUADBET.MODAL_MIN_PLAYERS",
    defaultEntryPointLabel: "I18N.OBB.SQUADBET.MODAL_ENTRY_POINT",
    defaultParticipantInfoLabel: "I18N.OBB.MODAL_PARTICIPANT_INFO",
  },
  modalIsLoadingQuotes: false,
  errorCode: null,
  position: undefined,
  isAnimatedBetButton: false,
};

const getObbSquadBetCardByURN = jest.fn();

describe("makeMapStateToProps", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when card is not defined", () => {
    it("should return an empty object if no card is found", () => {
      createObbSquadBetCardWithModalFieldsByURNSelector.mockReturnValue(getObbSquadBetCardByURN);
      getObbSquadBetCardByURN.mockReturnValueOnce(undefined);

      const mapStateToProps = makeMapStateToProps();
      const stateToProps = mapStateToProps(DEFAULT_STATE, { urn: "urn" });

      expect(stateToProps).toEqual({});
    });
  });

  describe("when card is defined", () => {
    it("should return correct data", () => {
      createObbSquadBetCardWithModalFieldsByURNSelector.mockReturnValue(getObbSquadBetCardByURN);
      getObbSquadBetCardByURN.mockReturnValueOnce(mockGetObbSquadBetCardByURN);
      getStatsLabels.mockReturnValueOnce("Shots On Target");

      buildPlayer.mockImplementation(() => ({
        status: "loaded",
        firstName: "Marquinhos",
        jersey: "https://content-s3.betfair.com/jic/uki/bf/PSG_Away_Jersey.svg",
      }));

      const mapStateToProps = makeMapStateToProps();
      const stateToProps = mapStateToProps(DEFAULT_STATE, { urn: "ppb:obb:card:squadBet:aGvuzRAAAB8AaAld/e/34501806" });

      expect(stateToProps).toEqual({
        ...mockStateToProps,
        isPlayerSelected: expect.any(Function),
        isPlayerDisabled: expect.any(Function),
        hasReachedSquadLimit: false,
      });
    });

    it("should render default participantInfo and entryPointLabel when not provided", () => {
      createObbSquadBetCardWithModalFieldsByURNSelector.mockReturnValue(getObbSquadBetCardByURN);
      getObbSquadBetCardByURN.mockReturnValueOnce({
        ...mockGetObbSquadBetCardByURN,
        participantInfo: undefined,
        entryPointLabel: undefined,
      });
      getStatsLabels.mockReturnValueOnce("Shots On Target");

      const mapStateToProps = makeMapStateToProps();
      const stateToProps = mapStateToProps(DEFAULT_STATE, {
        urn: "ppb:obb:card:squadBet:aGvuzRAAAB8AaAld/e/34501806",
        position: undefined,
      });

      expect(stateToProps).toEqual({
        ...mockStateToProps,
        isPlayerSelected: expect.any(Function),
        isPlayerDisabled: expect.any(Function),
        hasReachedSquadLimit: false,
        title: "I18N.OBB.SQUADBET.MODAL_ENTRY_POINT - Shots On Target",
        participantInfo: "I18N.OBB.MODAL_PARTICIPANT_INFO",
      });
    });

    it("should evaluate isPlayerSelected and isPlayerDisabled correctly", () => {
      createObbSquadBetCardWithModalFieldsByURNSelector.mockReturnValue(getObbSquadBetCardByURN);
      getObbSquadBetCardByURN.mockReturnValueOnce(mockGetObbSquadBetCardByURN);

      const mapStateToProps = makeMapStateToProps();
      const stateToProps = mapStateToProps(DEFAULT_STATE, {
        urn: "ppb:obb:card:squadBet:aGvuzRAAAB8AaAld/e/34501806",
      });

      const selectedPlayer = {
        player: {
          id: 21651,
        },
      };

      const unselectedPlayer = {
        player: {
          id: 99999,
        },
      };

      expect(stateToProps.isPlayerSelected(selectedPlayer)).toBe(true);
      expect(stateToProps.isPlayerSelected(unselectedPlayer)).toBe(false);

      const matchingIncidentTypes = {
        SHOTS_ON_TARGET: { id: "SHOTS_ON_TARGET" },
      };

      const nonMatchingIncidentTypes = {
        GOALS: { id: "GOALS" },
      };

      expect(stateToProps.isPlayerDisabled(matchingIncidentTypes)).toBe(false);
      expect(stateToProps.isPlayerDisabled(nonMatchingIncidentTypes)).toBe(true);
      expect(stateToProps.isPlayerDisabled(undefined)).toBe(true);
    });
  });
});

describe("mapDispatchToProps", () => {
  const dispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should dispatch OBB_CARD__TOGGLE_SQUADBET_MODAL_PARTICIPANT when dispatchToggleObbSquadBetModalParticipant is called", () => {
    const { dispatchToggleObbSquadBetModalParticipant } = mapDispatchToProps(dispatch);

    dispatchToggleObbSquadBetModalParticipant("cardUrn", "participantUrn");

    expect(dispatch).toHaveBeenCalledWith({
      type: OBB_CARD__TOGGLE_SQUADBET_MODAL_PARTICIPANT,
      payload: { cardUrn: "cardUrn", participantUrn: "participantUrn" },
    });
  });

  it("should dispatch OBB_CARD__CLEAR_SQUADBET_MODAL_ERROR when dispatchClearSquadBetModalError is called", () => {
    const { dispatchClearSquadBetModalError } = mapDispatchToProps(dispatch);

    dispatchClearSquadBetModalError("cardUrn");

    expect(dispatch).toHaveBeenCalledWith({
      type: OBB_CARD__CLEAR_SQUADBET_MODAL_ERROR,
      payload: { cardUrn: "cardUrn" },
    });
  });

  it("should dispatch ObbToggleSquadBetPlayerPickerSquadParticipantAction when dispatchToggleObbSquadBetModalParticipantAnalytics is called", () => {
    const { dispatchToggleObbSquadBetModalParticipantAnalytics } = mapDispatchToProps(dispatch);
    dispatchToggleObbSquadBetModalParticipantAnalytics(
      "cardUrn",
      "eventName",
      "incidentType",
      "participantUrn",
      "playerName",
    );
    expect(dispatch).toHaveBeenCalledWith({
      type: UI__TOGGLE_SQUAD_BET_PLAYER_PICKER_SQUAD_PARTICIPANT,
      payload: {
        cardUrn: "cardUrn",
        eventName: "eventName",
        incidentType: "incidentType",
        participantUrn: "participantUrn",
        playerName: "playerName",
      },
    });
  });

  it("should dispatch ObbSquadBetPlayerPickerBetButtonSwimlaneArrowClickAction when dispatchTaggingInteractionClick is called", () => {
    const { dispatchTaggingInteractionClick } = mapDispatchToProps(dispatch);
    dispatchTaggingInteractionClick("bet button", "arrow", "urn", "eventName");
    expect(dispatch).toHaveBeenCalledWith({
      type: OBB_CARD__EVENT_SELECTION,
      payload: {
        event: {
          elementText: "bet button - arrow",
          module: {
            card: "player picker",
          },
        },
        eventName: "eventName",
        urn: "urn",
      },
    });
  });

  describe("when dispatchAddToBetslip is called", () => {
    it("should dispatch BettingObbToggleMultipleLegAction when has selectedLegs", () => {
      const { dispatchAddToBetslip } = mapDispatchToProps(dispatch);
      dispatchAddToBetslip(["leg:id:1"], "cardUrn", "eventName");
      expect(dispatch).toHaveBeenCalledWith({
        type: BETTING__OBB_TOGGLE_MULTIPLE_LEG_ACTION,
        payload: {
          legIds: ["leg:id:1"],
          cardUrn: "cardUrn",
          eventName: "eventName",
        },
      });
    });

    it("should not dispatch BettingObbToggleMultipleLegAction when has no selectedLegs", () => {
      const { dispatchAddToBetslip } = mapDispatchToProps(dispatch);
      dispatchAddToBetslip([], "cardUrn", "eventName");
      expect(dispatch).not.toHaveBeenCalledWith({
        type: BETTING__OBB_TOGGLE_MULTIPLE_LEG_ACTION,
        payload: expect.any,
      });
    });
  });

  it("should dispatch dispatchPlayerPickerClose when dispatchPlayerPickerModalClose is called", () => {
    const { dispatchPlayerPickerClose } = mapDispatchToProps(dispatch);

    dispatchPlayerPickerClose("cardUrn", "eventName", "incidentType");

    expect(dispatch).toHaveBeenCalledWith({
      type: UI__CLOSE_PLAYER_PICKER_MODAL,
      payload: {
        cardUrn: "cardUrn",
        eventName: "eventName",
        incidentType: "incidentType",
      },
    });
  });

  it("should dispatch UI__SQUAD_BET_PLAYER_PICKER_BET_BUTTON_CLICK when dispatchSquadBetBetButtonClickAnalytics is called", () => {
    const { dispatchSquadBetBetButtonClickAnalytics } = mapDispatchToProps(dispatch);

    dispatchSquadBetBetButtonClickAnalytics("eventName", "incidentType", "buttonStatus", "buttonLabel");

    expect(dispatch).toHaveBeenCalledWith({
      type: UI__SQUAD_BET_PLAYER_PICKER_BET_BUTTON_CLICK,
      payload: {
        eventName: "eventName",
        incidentType: "incidentType",
        buttonStatus: "buttonStatus",
        buttonLabel: "buttonLabel",
      },
    });
  });

  it("should dispatch UI__SQUAD_BET_PLAYER_PICKER_REMOVE_SQUAD_PARTICIPANT when dispatchToggleObbSquadBetModalRemoveParticipantAnalytics is called", () => {
    const { dispatchToggleObbSquadBetModalRemoveParticipantAnalytics } = mapDispatchToProps(dispatch);

    dispatchToggleObbSquadBetModalRemoveParticipantAnalytics("eventName", "urn", "incidentType");

    expect(dispatch).toHaveBeenCalledWith({
      type: UI__SQUAD_BET_PLAYER_PICKER_REMOVE_SQUAD_PARTICIPANT,
      payload: {
        eventName: "eventName",
        incidentType: "incidentType",
        cardUrn: "urn",
        moduleName: "player picker",
      },
    });
  });
});
