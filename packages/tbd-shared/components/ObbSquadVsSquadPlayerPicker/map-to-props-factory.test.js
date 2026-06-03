import { createObbSquadVsSquadCardWithModalFieldsByURNSelector } from "@ppb/tbd-store/state/layout/cards/obb-card/obb-card-selectors";
import { OddsDisplayPreference } from "@ppb/tbd-store";
import {
  OBB_CARD__CLEAR_SQUADVSSQUAD_MODAL_ERROR,
  OBB_CARD__TOGGLE_SQUADVSSQUAD_MODAL_PARTICIPANT,
  OBB_CARD__SAVE_SQUADVSQUAD_MODAL_ACTION,
  UI__TOGGLE_SQUAD_BET_PLAYER_PICKER_SQUAD_PARTICIPANT,
  OBB_CARD__EVENT_SELECTION,
  UI__CLOSE_PLAYER_PICKER_MODAL,
} from "@ppb/tbd-store/actions/obb";
import { BETTING__OBB_TOGGLE_LEG_ACTION, UI__OBB_BET_BUTTON_CLICK } from "@ppb/tbd-store/actions/betting";
import { mapDispatchToProps, makeMapStateToProps } from "./map-to-props-factory";
import {
  buildMicroPlayerVm,
  formatQuote,
  getIncidentDataMapping,
  getSquadAverageStatByIncidentType,
  getStatsLabels,
} from "../../helpers/obb";

jest.mock("@ppb/tbd-store/state/layout/cards/obb-card/obb-card-selectors", () => ({
  createObbSquadVsSquadCardWithModalFieldsByURNSelector: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/entities/experiments/experiments-selectors", () => ({
  createGetExperimentSelector: jest.fn(),
}));

jest.mock("@ppb/tbd-shared/helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.mock("../../helpers/obb", () => ({
  buildPlayer: jest.fn(),
  buildMicroPlayerVm: jest.fn(),
  getContextualStatsText: jest.fn((cardStatsLabel) => cardStatsLabel),
  formatQuote: jest.fn(),
  getSquadAverageStatByIncidentType: jest.fn(),
  getStatsByIncidentType: jest.fn(),
  getIncidentDataMapping: jest.fn(),
  getStatsLabels: jest.fn(),
  errorMap: {
    ERROR: { level: "ERROR", hasDescription: false, dismissible: false },
  },
}));

const DEFAULT_STATE = {
  entities: {
    preferences: {
      exchangeOddsDisplay: OddsDisplayPreference.Decimal,
    },
    obbLegs: {
      "5d4d6e2f368d2478": { id: "5d4d6e2f368d2478" },
      "1438b2bb77a2c3d0": { id: "1438b2bb77a2c3d0" },
    },
    experiments: {},
  },
};

const mockEventParticipants = [
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
          goals: 0.29,
          totalShots: 2.29,
          shotsOnTarget: 0.86,
          yellowRedCards: 0,
          redCards: 0,
          yellowCards: 0,
          fouls: 0.71,
          foulsWon: 0.57,
          assists: 0,
          passes: 11.29,
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
          goals: 0.43,
          totalShots: 1.14,
          shotsOnTarget: 0.57,
          yellowRedCards: 0,
          redCards: 0,
          yellowCards: 0.14,
          fouls: 1,
          foulsWon: 1.71,
          assists: 0,
          passes: 62.29,
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
  {
    urn: "ppb:obb:footballPlayer:12345/e/34501806",
    typename: "ObbFootballPlayer",
    player: {
      id: 12345,
      name: "Thiago Silva",
      position: null,
      seasonStats: {
        matchesPlayed: 0,
        averages: {
          goals: 0.14,
          totalShots: 0.29,
          shotsOnTarget: 0.14,
          yellowRedCards: 0,
          redCards: 0,
          yellowCards: 0,
          fouls: 0.71,
          foulsWon: 0.86,
          assists: 0.14,
          passes: 17.71,
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
  {
    urn: "ppb:obb:footballPlayer:67890/e/34501806",
    typename: "ObbFootballPlayer",
    player: {
      id: 67890,
      name: "Kylian Mbappé",
      position: null,
      seasonStats: {
        matchesPlayed: 0,
        averages: {
          goals: 0.14,
          totalShots: 0.86,
          shotsOnTarget: 0.57,
          yellowRedCards: 0,
          redCards: 0,
          yellowCards: 0,
          fouls: 0.43,
          foulsWon: 0.43,
          assists: 0,
          passes: 22.29,
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
];

const mockGetObbSquadVsSquadCardByURN = {
  urn: "ppb:obb:card:squadVsSquad:aGvuzRAAAB8AaAld/e/34501806",
  typename: "ObbSquadVsSquadCard",
  title: "🎖️ Squad To Have More Shots On Target",
  outcomesLabel: "Which squad will have more shots on target?",
  statsLabel: "Average shots on target, combined",
  showModalEntryPoint: "true",
  participantInfo: "Average stats per game, this season",
  incidentType: "GOALS",
  modalError: null,
  modalIsLoadingQuotes: false,
  filterTags: [
    {
      label: "All",
      type: "All",
    },
    {
      label: "Goals",
      type: "Goals",
    },
  ],
  sportevent: {
    typename: "SportsEvent",
    urn: "ppb:event:34501806",
    name: "Chelsea v Paris St-G",
    eventId: 34501806,
  },
  eventParticipants: mockEventParticipants,
  firstSquadParticipants: [mockEventParticipants[0], mockEventParticipants[1]],
  firstSquadModalParticipants: [mockEventParticipants[0], mockEventParticipants[1]],
  secondSquadParticipants: [mockEventParticipants[2], mockEventParticipants[3]],
  secondSquadModalParticipants: [mockEventParticipants[2], mockEventParticipants[3]],
  modalLegs: ["5d4d6e2f368d2478", "1438b2bb77a2c3d0"],
};

const mockStateToProps = {
  urn: "ppb:obb:card:squadVsSquad:aGvuzRAAAB8AaAld/e/34501806",
  title: "I18N.OBB.SQUAD_VS_SQUAD.MODAL_ENTRY_POINT - Goals",
  participantInfo: "Average stats per game, this season",
  eventParticipants: mockEventParticipants.map((participant) => ({ ...participant, stats: undefined })),
  firstSquadJerseys: [
    "https://content-s3.betfair.com/jic/uki/bf/PSG_Away_Jersey.svg",
    "https://content-s3.betfair.com/jic/uki/bf/Chelsea_Home_Jersey.svg",
  ],
  secondSquadJerseys: [
    "https://content-s3.betfair.com/jic/uki/bf/PSG_Away_Jersey.svg",
    "https://content-s3.betfair.com/jic/uki/bf/Chelsea_Home_Jersey.svg",
  ],
  firstSquadModalParticipantsNames: [
    { firstName: "Marquinhos", lastName: "" },
    { firstName: "Christopher", lastName: "Nkunku" },
  ],
  secondSquadModalParticipantsNames: [
    { firstName: "Thiago", lastName: "Silva" },
    { firstName: "Kylian", lastName: "Mbappé" },
  ],
  firstSquadStatValue: "5.6",
  secondSquadStatValue: "7.8",
  firstSquadOdds: "2.5",
  secondSquadOdds: "1.79",
  statsLabel: "Average shots on target, combined",
  selectedSquadId: "1",
  i18nLabels: {
    alertLabel: "I18N.OBB.SQUAD_VS_SQUAD.MODAL_MIN_PLAYERS",
    defaultEntryPointLabel: "I18N.OBB.SQUAD_VS_SQUAD.MODAL_ENTRY_POINT",
    defaultParticipantInfoLabel: "I18N.OBB.MODAL_PARTICIPANT_INFO",
    firstSquad: "I18N.OBB.SQUAD_VS_SQUAD.BET_BUTTON.LABEL 1",
    oddsLabel: "I18N.OBB.ODDS",
    saveChangesLabel: "I18N.OBB.SQUAD_VS_SQUAD.MODAL_PRIMARY_BUTTON.LABEL",
    secondSquad: "I18N.OBB.SQUAD_VS_SQUAD.BET_BUTTON.LABEL 2",
  },
  hasReachedFirstSquadLimit: false,
  hasReachedSecondSquadLimit: false,
  errorCode: null,
  isSaveChangesDisabled: true,
  eventName: "Chelsea v Paris St-G",
  incidentTypeLabel: "Goals",
  outcomeLabel: "Which squad will have more shots on target?",
  modalLegs: ["5d4d6e2f368d2478", "1438b2bb77a2c3d0"],
  isObbSquadVsSquadPlayerPickerConsistencyVariantActive: false,
  onDismiss: jest.fn(),
  handleSquadChange: jest.fn(),
  isPlayerSelectedInSelectedSquad: jest.fn(),
  isPlayerSelected: jest.fn(),
  isPlayerDisabled: jest.fn(),
};

const getObbSquadVsSquadCardByURN = jest.fn();

const getSquadAverageStatByIncidentTypeMock = getSquadAverageStatByIncidentType;
const formatQuoteMock = formatQuote;
const buildMicroPlayerVmMock = buildMicroPlayerVm;

describe("makeMapStateToProps", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const { createGetExperimentSelector } = require("@ppb/tbd-store/state/entities/experiments/experiments-selectors");
    const getExperimentMock = jest.fn().mockReturnValue(undefined);
    createGetExperimentSelector.mockReturnValue(getExperimentMock);
  });

  describe("when card is not defined", () => {
    it("should return an empty object if no card is found", () => {
      createObbSquadVsSquadCardWithModalFieldsByURNSelector.mockReturnValue(getObbSquadVsSquadCardByURN);
      getObbSquadVsSquadCardByURN.mockReturnValueOnce(undefined);

      const mapStateToProps = makeMapStateToProps();
      const stateToProps = mapStateToProps(DEFAULT_STATE, { urn: "urn" });

      expect(stateToProps).toEqual({});
    });
  });

  describe("when card is defined", () => {
    it("should return correct data", () => {
      createObbSquadVsSquadCardWithModalFieldsByURNSelector.mockReturnValue(getObbSquadVsSquadCardByURN);
      getObbSquadVsSquadCardByURN.mockReturnValueOnce(mockGetObbSquadVsSquadCardByURN);

      getSquadAverageStatByIncidentTypeMock.mockReturnValueOnce("5.6");
      getSquadAverageStatByIncidentTypeMock.mockReturnValueOnce("7.8");
      formatQuoteMock.mockReturnValueOnce({ odds: "2.5" });
      formatQuoteMock.mockReturnValueOnce({ odds: "1.79" });
      getStatsLabels.mockReturnValueOnce("Goals");
      getIncidentDataMapping.mockReturnValueOnce({ text: "Goals", icon: "icon-goals" });

      buildMicroPlayerVmMock.mockReturnValueOnce({
        jerseys: [
          "https://content-s3.betfair.com/jic/uki/bf/PSG_Away_Jersey.svg",
          "https://content-s3.betfair.com/jic/uki/bf/Chelsea_Home_Jersey.svg",
        ],
        players: [
          {
            firstName: "Marquinhos",
            lastName: "",
          },
          {
            firstName: "Christopher",
            lastName: "Nkunku",
          },
        ],
      });
      buildMicroPlayerVmMock.mockReturnValueOnce({
        jerseys: [
          "https://content-s3.betfair.com/jic/uki/bf/PSG_Away_Jersey.svg",
          "https://content-s3.betfair.com/jic/uki/bf/Chelsea_Home_Jersey.svg",
        ],
        players: [
          {
            firstName: "Thiago",
            lastName: "Silva",
          },
          {
            firstName: "Kylian",
            lastName: "Mbappé",
          },
        ],
      });

      const mapStateToProps = makeMapStateToProps();
      const stateToProps = mapStateToProps(DEFAULT_STATE, {
        urn: "ppb:obb:card:squadVsSquad:aGvuzRAAAB8AaAld/e/34501806",
        selectedSquadId: "1",
        onDismiss: jest.fn(),
        handleSquadChange: jest.fn(),
      });

      expect(stateToProps).toEqual({
        ...mockStateToProps,
        isPlayerSelected: expect.any(Function),
        isPlayerDisabled: expect.any(Function),
        onDismiss: expect.any(Function),
        handleSquadChange: expect.any(Function),
        isPlayerSelectedInSelectedSquad: expect.any(Function),
      });
    });

    it("should render default participantInfo and entryPointLabel when not provided", () => {
      createObbSquadVsSquadCardWithModalFieldsByURNSelector.mockReturnValue(getObbSquadVsSquadCardByURN);
      getObbSquadVsSquadCardByURN.mockReturnValueOnce({
        ...mockGetObbSquadVsSquadCardByURN,
        participantInfo: undefined,
        entryPointLabel: undefined,
      });

      getSquadAverageStatByIncidentTypeMock.mockReturnValueOnce("5.6");
      getSquadAverageStatByIncidentTypeMock.mockReturnValueOnce("7.8");
      formatQuoteMock.mockReturnValueOnce({ odds: "2.5" });
      formatQuoteMock.mockReturnValueOnce({ odds: "1.79" });
      getStatsLabels.mockReturnValueOnce("Goals");
      getIncidentDataMapping.mockReturnValueOnce({ text: "Goals", icon: "icon-goals" });

      buildMicroPlayerVmMock
        .mockReturnValueOnce({
          jerseys: [
            "https://content-s3.betfair.com/jic/uki/bf/PSG_Away_Jersey.svg",
            "https://content-s3.betfair.com/jic/uki/bf/Chelsea_Home_Jersey.svg",
          ],
          players: [
            {
              firstName: "Marquinhos",
              lastName: "",
            },
            {
              firstName: "Christopher",
              lastName: "Nkunku",
            },
          ],
        })
        .mockReturnValueOnce({
          jerseys: [
            "https://content-s3.betfair.com/jic/uki/bf/PSG_Away_Jersey.svg",
            "https://content-s3.betfair.com/jic/uki/bf/Chelsea_Home_Jersey.svg",
          ],
          players: [
            {
              firstName: "Thiago",
              lastName: "Silva",
            },
            {
              firstName: "Kylian",
              lastName: "Mbappé",
            },
          ],
        });

      const mapStateToProps = makeMapStateToProps();
      const stateToProps = mapStateToProps(DEFAULT_STATE, {
        urn: "ppb:obb:card:squadVsSquad:aGvuzRAAAB8AaAld/e/34501806",
        selectedSquadId: "1",
        onDismiss: jest.fn(),
        handleSquadChange: jest.fn(),
      });

      expect(stateToProps).toEqual({
        ...mockStateToProps,
        participantInfo: "I18N.OBB.MODAL_PARTICIPANT_INFO",
        isPlayerSelected: expect.any(Function),
        isPlayerDisabled: expect.any(Function),
        onDismiss: expect.any(Function),
        handleSquadChange: expect.any(Function),
        isPlayerSelectedInSelectedSquad: expect.any(Function),
      });
    });

    it("should evaluate isPlayerSelected, isPlayerDisabled and isPlayerSelectedInSelectedSquad correctly", () => {
      createObbSquadVsSquadCardWithModalFieldsByURNSelector.mockReturnValue(getObbSquadVsSquadCardByURN);
      getObbSquadVsSquadCardByURN.mockReturnValueOnce(mockGetObbSquadVsSquadCardByURN);

      formatQuoteMock.mockReturnValueOnce({ odds: "2.5" });
      formatQuoteMock.mockReturnValueOnce({ odds: "1.79" });

      buildMicroPlayerVmMock
        .mockReturnValueOnce({
          jerseys: [
            "https://content-s3.betfair.com/jic/uki/bf/PSG_Away_Jersey.svg",
            "https://content-s3.betfair.com/jic/uki/bf/Chelsea_Home_Jersey.svg",
          ],
          players: [
            {
              firstName: "Marquinhos",
              lastName: "",
            },
            {
              firstName: "Christopher",
              lastName: "Nkunku",
            },
          ],
        })
        .mockReturnValueOnce({
          jerseys: [
            "https://content-s3.betfair.com/jic/uki/bf/PSG_Away_Jersey.svg",
            "https://content-s3.betfair.com/jic/uki/bf/Chelsea_Home_Jersey.svg",
          ],
          players: [
            {
              firstName: "Thiago",
              lastName: "Silva",
            },
            {
              firstName: "Kylian",
              lastName: "Mbappé",
            },
          ],
        });

      const mapStateToProps = makeMapStateToProps();
      const stateToProps = mapStateToProps(DEFAULT_STATE, {
        urn: "ppb:obb:card:squadVsSquad:aGvuzRAAAB8AaAld/e/34501806",
        selectedSquadId: "1",
        onDismiss: jest.fn(),
        handleSquadChange: jest.fn(),
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
        GOALS: { id: "GOALS" },
      };

      const nonMatchingIncidentTypes = {
        SHOTS_ON_TARGET: { id: "SHOTS_ON_TARGET" },
      };

      expect(stateToProps.isPlayerDisabled(matchingIncidentTypes)).toBe(false);
      expect(stateToProps.isPlayerDisabled(nonMatchingIncidentTypes)).toBe(true);
      expect(stateToProps.isPlayerDisabled(undefined)).toBe(true);
      expect(stateToProps.isPlayerSelectedInSelectedSquad(selectedPlayer)).toBe(true);
      expect(stateToProps.isPlayerSelectedInSelectedSquad(unselectedPlayer)).toBe(false);
    });

    it("should set odds to '-' when getLegQuote returns undefined", () => {
      createObbSquadVsSquadCardWithModalFieldsByURNSelector.mockReturnValue(getObbSquadVsSquadCardByURN);
      getObbSquadVsSquadCardByURN.mockReturnValueOnce(mockGetObbSquadVsSquadCardByURN);

      buildMicroPlayerVmMock
        .mockReturnValueOnce({
          jerseys: [
            "https://content-s3.betfair.com/jic/uki/bf/PSG_Away_Jersey.svg",
            "https://content-s3.betfair.com/jic/uki/bf/Chelsea_Home_Jersey.svg",
          ],
          players: [
            {
              firstName: "Marquinhos",
              lastName: "",
            },
            {
              firstName: "Christopher",
              lastName: "Nkunku",
            },
          ],
        })
        .mockReturnValueOnce({
          jerseys: [
            "https://content-s3.betfair.com/jic/uki/bf/PSG_Away_Jersey.svg",
            "https://content-s3.betfair.com/jic/uki/bf/Chelsea_Home_Jersey.svg",
          ],
          players: [
            {
              firstName: "Thiago",
              lastName: "Silva",
            },
            {
              firstName: "Kylian",
              lastName: "Mbappé",
            },
          ],
        });

      formatQuoteMock.mockReturnValueOnce(undefined).mockReturnValueOnce(undefined);

      const mapStateToProps = makeMapStateToProps();
      const stateToProps = mapStateToProps(DEFAULT_STATE, {
        urn: "ppb:obb:card:squadVsSquad:aGvuzRAAAB8AaAld/e/34501806",
        selectedSquadId: "1",
        onDismiss: jest.fn(),
        handleSquadChange: jest.fn(),
      });

      expect(stateToProps.firstSquadOdds).toBe("-");
      expect(stateToProps.secondSquadOdds).toBe("-");
    });

    it("should set squad stat value to '-' when getSquadAverageStatByIncidentType returns null", () => {
      createObbSquadVsSquadCardWithModalFieldsByURNSelector.mockReturnValue(getObbSquadVsSquadCardByURN);
      getObbSquadVsSquadCardByURN.mockReturnValueOnce(mockGetObbSquadVsSquadCardByURN);

      getSquadAverageStatByIncidentTypeMock.mockReturnValueOnce(null);
      getSquadAverageStatByIncidentTypeMock.mockReturnValueOnce(null);

      buildMicroPlayerVmMock
        .mockReturnValueOnce({
          jerseys: [],
          players: [],
        })
        .mockReturnValueOnce({
          jerseys: [],
          players: [],
        });

      formatQuoteMock.mockReturnValueOnce(undefined).mockReturnValueOnce(undefined);

      const mapStateToProps = makeMapStateToProps();
      const stateToProps = mapStateToProps(DEFAULT_STATE, {
        urn: "ppb:obb:card:squadVsSquad:aGvuzRAAAB8AaAld/e/34501806",
        selectedSquadId: "1",
        onDismiss: jest.fn(),
        handleSquadChange: jest.fn(),
      });

      expect(stateToProps.firstSquadOdds).toBe("-");
      expect(stateToProps.secondSquadOdds).toBe("-");
      expect(stateToProps.firstSquadStatValue).toBe("-");
      expect(stateToProps.secondSquadStatValue).toBe("-");
    });

    it("should evaluate isPlayerSelected and isPlayerSelectedInSelectedSquad accordingly if the player is not found", () => {
      createObbSquadVsSquadCardWithModalFieldsByURNSelector.mockReturnValue(getObbSquadVsSquadCardByURN);
      getObbSquadVsSquadCardByURN.mockReturnValueOnce({
        ...mockGetObbSquadVsSquadCardByURN,
        firstSquadModalParticipants: [
          {
            player: {
              id: undefined,
            },
          },
        ],
      });

      buildMicroPlayerVmMock
        .mockReturnValueOnce({
          jerseys: [
            "https://content-s3.betfair.com/jic/uki/bf/PSG_Away_Jersey.svg",
            "https://content-s3.betfair.com/jic/uki/bf/Chelsea_Home_Jersey.svg",
          ],
          players: [
            {
              firstName: "Marquinhos",
              lastName: "",
            },
            {
              firstName: "Christopher",
              lastName: "Nkunku",
            },
          ],
        })
        .mockReturnValueOnce({
          jerseys: [
            "https://content-s3.betfair.com/jic/uki/bf/PSG_Away_Jersey.svg",
            "https://content-s3.betfair.com/jic/uki/bf/Chelsea_Home_Jersey.svg",
          ],
          players: [
            {
              firstName: "Thiago",
              lastName: "Silva",
            },
            {
              firstName: "Kylian",
              lastName: "Mbappé",
            },
          ],
        });

      const mapStateToProps = makeMapStateToProps();
      const stateToProps = mapStateToProps(DEFAULT_STATE, {
        urn: "ppb:obb:card:squadVsSquad:aGvuzRAAAB8AaAld/e/34501806",
        selectedSquadId: "1",
        onDismiss: jest.fn(),
        handleSquadChange: jest.fn(),
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

      expect(stateToProps.isPlayerSelected(selectedPlayer)).toBe(false);
      expect(stateToProps.isPlayerSelected(unselectedPlayer)).toBe(false);
      expect(stateToProps.isPlayerSelectedInSelectedSquad(selectedPlayer)).toBe(false);
      expect(stateToProps.isPlayerSelectedInSelectedSquad(unselectedPlayer)).toBe(false);
    });

    it("should return isSaveChangesDisabled if there's a modalError", () => {
      createObbSquadVsSquadCardWithModalFieldsByURNSelector.mockReturnValue(getObbSquadVsSquadCardByURN);
      getObbSquadVsSquadCardByURN.mockReturnValueOnce({
        ...mockGetObbSquadVsSquadCardByURN,
        modalError: "ERROR",
      });

      getSquadAverageStatByIncidentTypeMock.mockReturnValueOnce("5.6");
      getSquadAverageStatByIncidentTypeMock.mockReturnValueOnce("7.8");
      formatQuoteMock.mockReturnValueOnce({ odds: "2.5" });
      formatQuoteMock.mockReturnValueOnce({ odds: "1.79" });
      getStatsLabels.mockReturnValueOnce("Goals");
      getIncidentDataMapping.mockReturnValueOnce({ text: "Goals", icon: "icon-goals" });

      buildMicroPlayerVmMock.mockReturnValueOnce({
        jerseys: [
          "https://content-s3.betfair.com/jic/uki/bf/PSG_Away_Jersey.svg",
          "https://content-s3.betfair.com/jic/uki/bf/Chelsea_Home_Jersey.svg",
        ],
        players: [
          {
            firstName: "Marquinhos",
            lastName: "",
          },
          {
            firstName: "Christopher",
            lastName: "Nkunku",
          },
        ],
      });
      buildMicroPlayerVmMock.mockReturnValueOnce({
        jerseys: [
          "https://content-s3.betfair.com/jic/uki/bf/PSG_Away_Jersey.svg",
          "https://content-s3.betfair.com/jic/uki/bf/Chelsea_Home_Jersey.svg",
        ],
        players: [
          {
            firstName: "Thiago",
            lastName: "Silva",
          },
          {
            firstName: "Kylian",
            lastName: "Mbappé",
          },
        ],
      });

      const mapStateToProps = makeMapStateToProps();
      const stateToProps = mapStateToProps(DEFAULT_STATE, {
        urn: "ppb:obb:card:squadVsSquad:aGvuzRAAAB8AaAld/e/34501806",
        selectedSquadId: "1",
        onDismiss: jest.fn(),
        handleSquadChange: jest.fn(),
      });

      expect(stateToProps).toEqual({
        ...mockStateToProps,
        errorCode: "ERROR",
        isSaveChangesDisabled: true,
        isPlayerSelected: expect.any(Function),
        isPlayerDisabled: expect.any(Function),
        onDismiss: expect.any(Function),
        handleSquadChange: expect.any(Function),
        isPlayerSelectedInSelectedSquad: expect.any(Function),
      });
    });

    it("should return isSaveChangesDisabled if there's not a squadChange", () => {
      createObbSquadVsSquadCardWithModalFieldsByURNSelector.mockReturnValue(getObbSquadVsSquadCardByURN);
      getObbSquadVsSquadCardByURN.mockReturnValueOnce({
        ...mockGetObbSquadVsSquadCardByURN,
        firstSquadModalParticipants: [mockEventParticipants[0], mockEventParticipants[1]],
      });

      getSquadAverageStatByIncidentTypeMock.mockReturnValueOnce("5.6");
      getSquadAverageStatByIncidentTypeMock.mockReturnValueOnce("7.8");
      formatQuoteMock.mockReturnValueOnce({ odds: "2.5" });
      formatQuoteMock.mockReturnValueOnce({ odds: "1.79" });
      getStatsLabels.mockReturnValueOnce("Goals");
      getIncidentDataMapping.mockReturnValueOnce({ text: "Goals", icon: "icon-goals" });

      buildMicroPlayerVmMock.mockReturnValueOnce({
        jerseys: [
          "https://content-s3.betfair.com/jic/uki/bf/PSG_Away_Jersey.svg",
          "https://content-s3.betfair.com/jic/uki/bf/Chelsea_Home_Jersey.svg",
        ],
        players: [
          {
            firstName: "Marquinhos",
            lastName: "",
          },
          {
            firstName: "Christopher",
            lastName: "Nkunku",
          },
        ],
      });
      buildMicroPlayerVmMock.mockReturnValueOnce({
        jerseys: [
          "https://content-s3.betfair.com/jic/uki/bf/PSG_Away_Jersey.svg",
          "https://content-s3.betfair.com/jic/uki/bf/Chelsea_Home_Jersey.svg",
        ],
        players: [
          {
            firstName: "Thiago",
            lastName: "Silva",
          },
          {
            firstName: "Kylian",
            lastName: "Mbappé",
          },
        ],
      });

      const mapStateToProps = makeMapStateToProps();
      const stateToProps = mapStateToProps(DEFAULT_STATE, {
        urn: "ppb:obb:card:squadVsSquad:aGvuzRAAAB8AaAld/e/34501806",
        selectedSquadId: "1",
        onDismiss: jest.fn(),
        handleSquadChange: jest.fn(),
      });

      expect(stateToProps).toEqual({
        ...mockStateToProps,
        isSaveChangesDisabled: true,
        isPlayerSelected: expect.any(Function),
        isPlayerDisabled: expect.any(Function),
        onDismiss: expect.any(Function),
        handleSquadChange: expect.any(Function),
        isPlayerSelectedInSelectedSquad: expect.any(Function),
      });
    });

    it("should return isSaveChangesDisabled as false if there's a squadChange", () => {
      createObbSquadVsSquadCardWithModalFieldsByURNSelector.mockReturnValue(getObbSquadVsSquadCardByURN);
      getObbSquadVsSquadCardByURN.mockReturnValueOnce({
        ...mockGetObbSquadVsSquadCardByURN,
        firstSquadModalParticipants: [mockEventParticipants[0], mockEventParticipants[2]],
      });

      getSquadAverageStatByIncidentTypeMock.mockReturnValueOnce("5.6");
      getSquadAverageStatByIncidentTypeMock.mockReturnValueOnce("7.8");
      formatQuoteMock.mockReturnValueOnce({ odds: "2.5" });
      formatQuoteMock.mockReturnValueOnce({ odds: "1.79" });
      getStatsLabels.mockReturnValueOnce("Goals");
      getIncidentDataMapping.mockReturnValueOnce({ text: "Goals", icon: "icon-goals" });

      buildMicroPlayerVmMock.mockReturnValueOnce({
        jerseys: [
          "https://content-s3.betfair.com/jic/uki/bf/PSG_Away_Jersey.svg",
          "https://content-s3.betfair.com/jic/uki/bf/Chelsea_Home_Jersey.svg",
        ],
        players: [
          {
            firstName: "Marquinhos",
            lastName: "",
          },
          {
            firstName: "Christopher",
            lastName: "Nkunku",
          },
        ],
      });
      buildMicroPlayerVmMock.mockReturnValueOnce({
        jerseys: [
          "https://content-s3.betfair.com/jic/uki/bf/PSG_Away_Jersey.svg",
          "https://content-s3.betfair.com/jic/uki/bf/Chelsea_Home_Jersey.svg",
        ],
        players: [
          {
            firstName: "Thiago",
            lastName: "Silva",
          },
          {
            firstName: "Kylian",
            lastName: "Mbappé",
          },
        ],
      });

      const mapStateToProps = makeMapStateToProps();
      const stateToProps = mapStateToProps(DEFAULT_STATE, {
        urn: "ppb:obb:card:squadVsSquad:aGvuzRAAAB8AaAld/e/34501806",
        selectedSquadId: "1",
        onDismiss: jest.fn(),
        handleSquadChange: jest.fn(),
      });

      expect(stateToProps).toEqual({
        ...mockStateToProps,
        isSaveChangesDisabled: false,
        isPlayerSelected: expect.any(Function),
        isPlayerDisabled: expect.any(Function),
        onDismiss: expect.any(Function),
        handleSquadChange: expect.any(Function),
        isPlayerSelectedInSelectedSquad: expect.any(Function),
      });
    });

    it("should return isSaveChangesDisabled if both quotes are missing", () => {
      createObbSquadVsSquadCardWithModalFieldsByURNSelector.mockReturnValue(getObbSquadVsSquadCardByURN);
      getObbSquadVsSquadCardByURN.mockReturnValueOnce({
        ...mockGetObbSquadVsSquadCardByURN,
        firstSquadModalParticipants: [mockEventParticipants[0], mockEventParticipants[2]],
      });

      getSquadAverageStatByIncidentTypeMock.mockReturnValueOnce("5.6");
      getSquadAverageStatByIncidentTypeMock.mockReturnValueOnce("7.8");
      formatQuoteMock.mockReturnValueOnce({ odds: null });
      formatQuoteMock.mockReturnValueOnce({ odds: null });
      getStatsLabels.mockReturnValueOnce("Goals");
      getIncidentDataMapping.mockReturnValueOnce({ text: "Goals", icon: "icon-goals" });

      buildMicroPlayerVmMock.mockReturnValueOnce({
        jerseys: [
          "https://content-s3.betfair.com/jic/uki/bf/PSG_Away_Jersey.svg",
          "https://content-s3.betfair.com/jic/uki/bf/Chelsea_Home_Jersey.svg",
        ],
        players: [
          {
            firstName: "Marquinhos",
            lastName: "",
          },
          {
            firstName: "Christopher",
            lastName: "Nkunku",
          },
        ],
      });
      buildMicroPlayerVmMock.mockReturnValueOnce({
        jerseys: [
          "https://content-s3.betfair.com/jic/uki/bf/PSG_Away_Jersey.svg",
          "https://content-s3.betfair.com/jic/uki/bf/Chelsea_Home_Jersey.svg",
        ],
        players: [
          {
            firstName: "Thiago",
            lastName: "Silva",
          },
          {
            firstName: "Kylian",
            lastName: "Mbappé",
          },
        ],
      });

      const mapStateToProps = makeMapStateToProps();
      const stateToProps = mapStateToProps(DEFAULT_STATE, {
        urn: "ppb:obb:card:squadVsSquad:aGvuzRAAAB8AaAld/e/34501806",
        selectedSquadId: "1",
        onDismiss: jest.fn(),
        handleSquadChange: jest.fn(),
      });

      expect(stateToProps).toEqual({
        ...mockStateToProps,
        isSaveChangesDisabled: true,
        firstSquadOdds: "-",
        secondSquadOdds: "-",
        isPlayerSelected: expect.any(Function),
        isPlayerDisabled: expect.any(Function),
        onDismiss: expect.any(Function),
        handleSquadChange: expect.any(Function),
        isPlayerSelectedInSelectedSquad: expect.any(Function),
      });
    });
  });

  it("should calculate maxPlayersForSelectedSquad correctly when totalAvailablePlayers >= 20", () => {
    const totalAvailablePlayers = 25;

    const mockParticipants = Array.from({ length: totalAvailablePlayers }, (_, i) => ({
      urn: `player:${i}`,
      firstName: `Player${i}`,
      lastName: `Test`,
      status: "loaded",
      jersey: `jersey-${i}`,
    }));

    const firstSquadModalParticipants = mockParticipants.slice(0, 10);
    const secondSquadModalParticipants = mockParticipants.slice(10, 15);

    createObbSquadVsSquadCardWithModalFieldsByURNSelector.mockReturnValue(getObbSquadVsSquadCardByURN);
    getObbSquadVsSquadCardByURN.mockReturnValueOnce({
      ...mockGetObbSquadVsSquadCardByURN,
      typename: "ObbSquadVsSquadCard",
      eventParticipants: mockParticipants,
      firstSquadParticipants: firstSquadModalParticipants,
      secondSquadParticipants: secondSquadModalParticipants,
      firstSquadModalParticipants,
      secondSquadModalParticipants,
      incidentType: "GOALS",
      modalIsLoadingQuotes: false,
      modalLegs: [],
      modalError: null,
    });

    buildMicroPlayerVmMock
      .mockReturnValueOnce({
        jerseys: [],
        players: [],
      })
      .mockReturnValueOnce({
        jerseys: [],
        players: [],
      });

    const mapStateToProps = makeMapStateToProps();

    const stateToProps = mapStateToProps(DEFAULT_STATE, {
      urn: "ppb:obb:card:squadVsSquad:test",
      selectedSquadId: "1",
      onDismiss: jest.fn(),
      handleSquadChange: jest.fn(),
    });

    // With 25 total players and otherSquadCount = 5:
    // maxPlayersForSelectedSquad = 20 - 5 = 15
    // firstSquadCount = 10, so still below limit
    expect(stateToProps.hasReachedFirstSquadLimit).toBe(false);
    expect(stateToProps.hasReachedSecondSquadLimit).toBe(false);

    buildMicroPlayerVmMock
      .mockReturnValueOnce({
        jerseys: [],
        players: [],
      })
      .mockReturnValueOnce({
        jerseys: [],
        players: [],
      });

    // Now simulate first squad already full (>= 15)
    getObbSquadVsSquadCardByURN.mockReturnValueOnce({
      ...mockGetObbSquadVsSquadCardByURN,
      typename: "ObbSquadVsSquadCard",
      eventParticipants: mockParticipants,
      firstSquadParticipants: firstSquadModalParticipants,
      secondSquadParticipants: secondSquadModalParticipants,
      firstSquadModalParticipants: mockParticipants.slice(0, 15),
      secondSquadModalParticipants,
      incidentType: "GOALS",
      modalIsLoadingQuotes: false,
      modalLegs: [],
      modalError: null,
    });

    const stateToPropsFull = mapStateToProps(DEFAULT_STATE, {
      urn: "ppb:obb:card:squadVsSquad:test",
      selectedSquadId: "1",
      onDismiss: jest.fn(),
      handleSquadChange: jest.fn(),
    });

    expect(stateToPropsFull.hasReachedFirstSquadLimit).toBe(true);
    expect(stateToPropsFull.hasReachedSecondSquadLimit).toBe(true);
  });
});

describe("mapDispatchToProps", () => {
  const dispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should dispatch ObbClearSquadVsSquadModalErrorAction when dispatchClearSquadBetModalError is called", () => {
    const { dispatchClearSquadBetModalError } = mapDispatchToProps(dispatch);

    dispatchClearSquadBetModalError("cardUrn");

    expect(dispatch).toHaveBeenCalledWith({
      type: OBB_CARD__CLEAR_SQUADVSSQUAD_MODAL_ERROR,
      payload: { cardUrn: "cardUrn" },
    });
  });

  it("should dispatch ObbToggleSquadVsSquadModalParticipantAction when dispatchToggleObbSquadVsSquadModalParticipant is called", () => {
    const { dispatchToggleObbSquadVsSquadModalParticipant } = mapDispatchToProps(dispatch);

    dispatchToggleObbSquadVsSquadModalParticipant("cardUrn", "urn", "1");

    expect(dispatch).toHaveBeenCalledWith({
      type: OBB_CARD__TOGGLE_SQUADVSSQUAD_MODAL_PARTICIPANT,
      payload: {
        cardUrn: "cardUrn",
        participantUrn: "urn",
        selectedSquadId: "1",
      },
    });
  });

  it("should dispatch ObbToggleSquadVsSquadModalParticipantAction when dispatchSquadVsSquadSaveModalChanges is called", () => {
    const { dispatchSquadVsSquadSaveModalChanges } = mapDispatchToProps(dispatch);

    dispatchSquadVsSquadSaveModalChanges("cardUrn", []);

    expect(dispatch).toHaveBeenCalledWith({
      type: OBB_CARD__SAVE_SQUADVSQUAD_MODAL_ACTION,
      payload: {
        cardUrn: "cardUrn",
      },
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
      "1",
    );

    expect(dispatch).toHaveBeenCalledWith({
      type: UI__TOGGLE_SQUAD_BET_PLAYER_PICKER_SQUAD_PARTICIPANT,
      payload: {
        cardUrn: "cardUrn",
        eventName: "eventName",
        incidentType: "incidentType",
        participantUrn: "participantUrn",
        playerName: "playerName",
        selectedSquadId: "1",
      },
    });
  });

  it("should dispatch ObbEventSelectionAction when dispatchTaggingInteractionClick is called", () => {
    const { dispatchTaggingInteractionClick } = mapDispatchToProps(dispatch);

    dispatchTaggingInteractionClick("element", "urn", "eventName", "incidentType");

    expect(dispatch).toHaveBeenCalledWith({
      type: OBB_CARD__EVENT_SELECTION,
      payload: {
        event: {
          elementText: "element",
          module: {
            card: "player picker",
            group: "incidentType",
          },
        },
        urn: "urn",
        eventName: "eventName",
      },
    });
  });

  it("should dispatch BettingObbToggleLegAction and ObbBetButtonClickAction when dispatchAddLegToBetslip is called", () => {
    const { dispatchAddLegToBetslip } = mapDispatchToProps(dispatch);

    dispatchAddLegToBetslip("legId", "cardUrn", "eventName");

    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenNthCalledWith(1, {
      type: BETTING__OBB_TOGGLE_LEG_ACTION,
      payload: {
        legId: "legId",
        cardUrn: "cardUrn",
        eventName: "eventName",
      },
    });
    expect(dispatch).toHaveBeenNthCalledWith(2, {
      type: UI__OBB_BET_BUTTON_CLICK,
    });
  });

  it("should dispatch ObbClosePlayerPickerModalAction when dispatchPlayerPickerClose is called", () => {
    const { dispatchPlayerPickerClose } = mapDispatchToProps(dispatch);

    dispatchPlayerPickerClose("cardUrn", "eventName", "incidentType");

    expect(dispatch).toHaveBeenCalledWith({
      type: UI__CLOSE_PLAYER_PICKER_MODAL,
      payload: {
        incidentType: "incidentType",
        cardUrn: "cardUrn",
        eventName: "eventName",
      },
    });
  });
});
