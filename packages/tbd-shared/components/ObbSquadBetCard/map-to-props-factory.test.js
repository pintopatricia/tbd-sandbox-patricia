import {
  createObbCardByURNSelector,
  createObbCardPositionSelector,
} from "@ppb/tbd-store/state/layout/cards/obb-card/obb-card-selectors";
import { createGetExperimentSelector } from "@ppb/tbd-store/state/entities/experiments/experiments-selectors";
import { OddsDisplayPreference } from "@ppb/tbd-store";
import { mapQuantifierEnumToSymbol } from "@ppb/tbd-store/helpers/obb-betting";
import {
  OBB_CARD__EVENT_SELECTION,
  OBB_CARD__ON_SQUADBET_MODAL_OPEN,
  OBB_CARD__RESET_SQUADBET_MODAL_STATE,
  UI__SQUAD_BET_PLAYER_PICKER_OPEN,
} from "@ppb/tbd-store/actions/obb";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

import { buildPlayer, getSquadAverageStatByIncidentType, isToRemoveObbStatsLabel } from "../../helpers/obb";

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.mock("@ppb/tbd-store/state/layout/cards/obb-card/obb-card-selectors", () => ({
  createObbCardByURNSelector: jest.fn(),
  createObbCardPositionSelector: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/entities/experiments/experiments-selectors", () => ({
  createGetExperimentSelector: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/betting/obb-betting/ObbBetting.types.ts", () => ({
  quantifier: "AT_LEAST",
}));

jest.mock("@ppb/tbd-shared/helpers/obb", () => ({
  buildPlayer: jest.fn(),
  getSquadAverageStatByIncidentType: jest.fn(),
  isToRemoveObbStatsLabel: jest.fn(() => false),
}));

jest.mock("@ppb/tbd-store/helpers/obb-betting", () => ({
  mapQuantifierEnumToSymbol: jest.fn(),
}));

const isToRemoveObbStatsLabelMock = isToRemoveObbStatsLabel;

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
        ],
      },
    },
    cardgroups: {
      obbcardgroups: {
        "cardgroup-1": {},
      },
    },
  },
  entities: {
    preferences: {
      exchangeOddsDisplay: OddsDisplayPreference.Decimal,
    },
    experiments: {},
  },
};

const getObbSquadBetCardByURN = jest.fn();
const getObbCardPositionByLayout = jest.fn();
const getExperiment = jest.fn();

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
  squadParticipants: [
    {
      urn: "ppb:obb:footballPlayer:21651/e/34501806",
      typename: "ObbFootballPlayer",
      player: {
        id: "21651",
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
  defaultLegs: ["5d4d6e2f368d2478"],
  defaultOutcomeIndex: 0,
};

describe("makeMapStateToProps", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when card is not defined", () => {
    it("should return an empty object if no card is found", () => {
      createObbCardByURNSelector.mockReturnValue(getObbSquadBetCardByURN);
      getObbSquadBetCardByURN.mockReturnValueOnce(undefined);

      const mapStateToProps = makeMapStateToProps();
      const stateToProps = mapStateToProps(DEFAULT_STATE, { urn: "urn", layoutUrn: "layoutUrn", itemIndex: 1 });

      expect(stateToProps).toEqual({});
    });
  });

  describe("when card is defined", () => {
    beforeEach(() => {
      createGetExperimentSelector.mockReturnValue(getExperiment);
      getExperiment.mockReturnValue(undefined);
    });

    it("should return correct data", () => {
      createObbCardByURNSelector.mockReturnValue(getObbSquadBetCardByURN);
      getObbSquadBetCardByURN.mockReturnValueOnce(mockGetObbSquadBetCardByURN);

      createObbCardPositionSelector.mockReturnValue(getObbCardPositionByLayout);
      getObbCardPositionByLayout.mockReturnValueOnce({ horizontalPosition: 1, verticalPosition: 1 });
      mapQuantifierEnumToSymbol.mockReturnValue(">=");

      getSquadAverageStatByIncidentType.mockReturnValue("3");

      buildPlayer.mockImplementation(() => ({
        status: "loaded",
        firstName: "Marquinhos",
        jersey: "https://content-s3.betfair.com/jic/uki/bf/PSG_Away_Jersey.svg",
      }));

      getSquadAverageStatByIncidentType.mockImplementation(() => "3.8");

      const newState = {
        ...DEFAULT_STATE,
      };

      const mapStateToProps = makeMapStateToProps();
      const stateToProps = mapStateToProps(newState, {
        urn: "ppb:obb:card:squadBet:aGvuzRAAAB8AaAld/e/34501806",
        layoutUrn: "layoutUrn",
        itemIndex: 1,
      });

      expect(stateToProps).toEqual({
        incidentType: "SHOTS_ON_TARGET",
        urn: "ppb:obb:card:squadBet:aGvuzRAAAB8AaAld/e/34501806",
        squadParticipants: [
          {
            status: "loaded",
            firstName: "Marquinhos",
            jersey: "https://content-s3.betfair.com/jic/uki/bf/PSG_Away_Jersey.svg",
          },
        ],
        defaultLegs: ["5d4d6e2f368d2478"],
        title: "🚀 Top shooters",
        eventName: "Chelsea v Paris St-G",
        outcomesLabel: "How many shots on target between them?",
        statsLabel: "3.8 Avg shots on target, combined",
        defaultOutcomeIndex: 0,
        showModalEntryPoint: true,
        entryPointLabel: "Edit Squad",
        position: { horizontalPosition: 1, verticalPosition: 1 },
        removeObbStatsLabel: false,
        isPlayerCarouselClickable: false,
        withPlusButtonInPlayerCarousel: false,
        showSimplifiedBetButtons: false,
      });
    });

    it("should set removeObbStatsLabel to true when experiment requests removal", () => {
      createObbCardByURNSelector.mockReturnValue(getObbSquadBetCardByURN);
      getObbSquadBetCardByURN.mockReturnValueOnce(mockGetObbSquadBetCardByURN);

      createObbCardPositionSelector.mockReturnValue(getObbCardPositionByLayout);
      getObbCardPositionByLayout.mockReturnValueOnce({ horizontalPosition: 1, verticalPosition: 1 });
      mapQuantifierEnumToSymbol.mockReturnValue(">=");

      getSquadAverageStatByIncidentType.mockImplementation(() => "3.8");

      buildPlayer.mockImplementation(() => ({
        status: "loaded",
        firstName: "Marquinhos",
        jersey: "https://content-s3.betfair.com/jic/uki/bf/PSG_Away_Jersey.svg",
      }));

      isToRemoveObbStatsLabelMock.mockReturnValueOnce(true);

      const mapStateToProps = makeMapStateToProps();
      const stateToProps = mapStateToProps(DEFAULT_STATE, {
        urn: "ppb:obb:card:squadBet:aGvuzRAAAB8AaAld/e/34501806",
        layoutUrn: "layoutUrn",
        itemIndex: 1,
      });

      expect(stateToProps.removeObbStatsLabel).toBe(true);
    });

    describe("Nudge player picker experiment", () => {
      beforeEach(() => {
        createObbCardByURNSelector.mockReturnValue(getObbSquadBetCardByURN);
        getObbSquadBetCardByURN.mockReturnValueOnce(mockGetObbSquadBetCardByURN);

        createObbCardPositionSelector.mockReturnValue(getObbCardPositionByLayout);
        getObbCardPositionByLayout.mockReturnValueOnce({ horizontalPosition: 1, verticalPosition: 1 });

        getSquadAverageStatByIncidentType.mockImplementation(() => "3.8");

        buildPlayer.mockImplementation(() => ({
          status: "loaded",
          firstName: "Marquinhos",
          jersey: "https://content-s3.betfair.com/jic/uki/bf/PSG_Away_Jersey.svg",
        }));
      });

      const setupExperimentTest = () => {
        const mapStateToProps = makeMapStateToProps();

        return mapStateToProps(DEFAULT_STATE, {
          urn: "ppb:obb:card:squadBet:aGvuzRAAAB8AaAld/e/34501806",
          layoutUrn: "layoutUrn",
          itemIndex: 1,
        });
      };

      it("should set both isPlayerCarouselClickable and withPlusButtonInPlayerCarousel to false when experiment is not defined", () => {
        getExperiment.mockReturnValue(undefined);
        const stateToProps = setupExperimentTest();

        expect(stateToProps.isPlayerCarouselClickable).toBe(false);
        expect(stateToProps.withPlusButtonInPlayerCarousel).toBe(false);
      });

      it("should set isPlayerCarouselClickable to false when experiment variant is control", () => {
        getExperiment.mockImplementation((experiments, experimentName) => {
          if (experimentName === "exp-sbg-sport-obp-nudge-player-picker-1") {
            return { variant: "control" };
          }
          return undefined;
        });
        const stateToProps = setupExperimentTest();

        expect(stateToProps.isPlayerCarouselClickable).toBe(false);
      });

      it("should set isPlayerCarouselClickable to true when experiment variant is not control", () => {
        getExperiment.mockImplementation((experiments, experimentName) => {
          if (experimentName === "exp-sbg-sport-obp-nudge-player-picker-1") {
            return { variant: "exp-variant-is-player-carousel-clickable" };
          }
          return undefined;
        });
        const stateToProps = setupExperimentTest();

        expect(stateToProps.isPlayerCarouselClickable).toBe(true);
      });

      it("should set withPlusButtonInPlayerCarousel to false when variant is not exp-variant-with-plus-button", () => {
        getExperiment.mockImplementation((experiments, experimentName) => {
          if (experimentName === "exp-sbg-sport-obp-nudge-player-picker-1") {
            return { variant: "control" };
          }
          return undefined;
        });
        const stateToProps = setupExperimentTest();

        expect(stateToProps.withPlusButtonInPlayerCarousel).toBe(false);
      });

      it("should set withPlusButtonInPlayerCarousel to true when variant is exp-variant-with-plus-button", () => {
        getExperiment.mockImplementation((experiments, experimentName) => {
          if (experimentName === "exp-sbg-sport-obp-nudge-player-picker-1") {
            return { variant: "exp-variant-with-plus-button" };
          }
          return undefined;
        });
        const stateToProps = setupExperimentTest();

        expect(stateToProps.withPlusButtonInPlayerCarousel).toBe(true);
      });

      it("should set withPlusButtonInPlayerCarousel to false when variant is exp-variant-with-plus-button and showModalEntryPoint is false", () => {
        getObbSquadBetCardByURN.mockReset();

        createObbCardByURNSelector.mockReturnValue(getObbSquadBetCardByURN);
        getObbSquadBetCardByURN.mockReturnValueOnce({ ...mockGetObbSquadBetCardByURN, showModalEntryPoint: false });

        getExperiment.mockImplementation((experiments, experimentName) => {
          if (experimentName === "exp-sbg-sport-obp-nudge-player-picker-1") {
            return { variant: "exp-variant-with-plus-button" };
          }
          return undefined;
        });
        const stateToProps = setupExperimentTest();

        expect(stateToProps.withPlusButtonInPlayerCarousel).toBe(false);
      });

      it("should set isPlayerCarouselClickable to false when experiment variant is not control and showModalEntryPoint is false", () => {
        getObbSquadBetCardByURN.mockReset();

        createObbCardByURNSelector.mockReturnValue(getObbSquadBetCardByURN);
        getObbSquadBetCardByURN.mockReturnValueOnce({ ...mockGetObbSquadBetCardByURN, showModalEntryPoint: false });

        getExperiment.mockImplementation((experiments, experimentName) => {
          if (experimentName === "exp-sbg-sport-obp-nudge-player-picker-1") {
            return { variant: "exp-variant-is-player-carousel-clickable" };
          }
          return undefined;
        });
        const stateToProps = setupExperimentTest();

        expect(stateToProps.isPlayerCarouselClickable).toBe(false);
      });
    });

    describe("Bet buttons simplification experiment", () => {
      beforeEach(() => {
        createObbCardByURNSelector.mockReturnValue(getObbSquadBetCardByURN);
        getObbSquadBetCardByURN.mockReturnValueOnce(mockGetObbSquadBetCardByURN);

        createObbCardPositionSelector.mockReturnValue(getObbCardPositionByLayout);
        getObbCardPositionByLayout.mockReturnValueOnce({ horizontalPosition: 1, verticalPosition: 1 });

        getSquadAverageStatByIncidentType.mockImplementation(() => "3.8");

        buildPlayer.mockImplementation(() => ({
          status: "loaded",
          firstName: "Marquinhos",
          jersey: "https://content-s3.betfair.com/jic/uki/bf/PSG_Away_Jersey.svg",
        }));
      });

      const setupExperimentTest = () => {
        const mapStateToProps = makeMapStateToProps();

        return mapStateToProps(DEFAULT_STATE, {
          urn: "ppb:obb:card:squadBet:aGvuzRAAAB8AaAld/e/34501806",
          layoutUrn: "layoutUrn",
          itemIndex: 1,
        });
      };

      it("should set showSimplifiedBetButtons to false when experiment is not defined", () => {
        getExperiment.mockReturnValue(undefined);
        const stateToProps = setupExperimentTest();

        expect(stateToProps.showSimplifiedBetButtons).toBe(false);
      });

      it("should set showSimplifiedBetButtons to false when experiment variant is control", () => {
        getExperiment.mockImplementation((experiments, experimentName) => {
          if (experimentName === "exp-obp-squadbet-bet-buttons-simplification") {
            return { variant: "control" };
          }
          return undefined;
        });
        const stateToProps = setupExperimentTest();

        expect(stateToProps.showSimplifiedBetButtons).toBe(false);
      });

      it("should set showSimplifiedBetButtons to true when experiment variant is not control", () => {
        getExperiment.mockImplementation((experiments, experimentName) => {
          if (experimentName === "exp-obp-squadbet-bet-buttons-simplification") {
            return { variant: "extended-label" };
          }
          return undefined;
        });
        const stateToProps = setupExperimentTest();

        expect(stateToProps.showModalEntryPoint).toBe(true);
      });
    });
  });

  describe("when card has missing data", () => {
    it("should return the defaults", () => {
      getExperiment.mockReturnValue(undefined);

      createObbCardByURNSelector.mockReturnValue(getObbSquadBetCardByURN);
      getObbSquadBetCardByURN.mockReturnValueOnce({ ...mockGetObbSquadBetCardByURN, entryPointLabel: undefined });

      createObbCardPositionSelector.mockReturnValue(getObbCardPositionByLayout);
      getObbCardPositionByLayout.mockReturnValueOnce({ horizontalPosition: 1, verticalPosition: 1 });
      mapQuantifierEnumToSymbol.mockReturnValue(">=");

      getSquadAverageStatByIncidentType.mockReturnValue("3");

      buildPlayer.mockImplementation(() => ({
        status: "loaded",
        firstName: "Marquinhos",
        jersey: "https://content-s3.betfair.com/jic/uki/bf/PSG_Away_Jersey.svg",
      }));

      getSquadAverageStatByIncidentType.mockReturnValueOnce(null);

      const newState = {
        ...DEFAULT_STATE,
      };

      const mapStateToProps = makeMapStateToProps();
      const stateToProps = mapStateToProps(newState, {
        urn: "ppb:obb:card:squadBet:aGvuzRAAAB8AaAld/e/34501806",
        layoutUrn: "layoutUrn",
        itemIndex: 1,
      });

      expect(stateToProps).toEqual({
        incidentType: "SHOTS_ON_TARGET",
        urn: "ppb:obb:card:squadBet:aGvuzRAAAB8AaAld/e/34501806",
        squadParticipants: [
          {
            status: "loaded",
            firstName: "Marquinhos",
            jersey: "https://content-s3.betfair.com/jic/uki/bf/PSG_Away_Jersey.svg",
          },
        ],
        defaultLegs: ["5d4d6e2f368d2478"],
        title: "🚀 Top shooters",
        eventName: "Chelsea v Paris St-G",
        outcomesLabel: "How many shots on target between them?",
        statsLabel: "- Avg shots on target, combined",
        defaultOutcomeIndex: 0,
        showModalEntryPoint: true,
        entryPointLabel: "I18N.OBB.SQUADBET.MODAL_ENTRY_POINT",
        position: { horizontalPosition: 1, verticalPosition: 1 },
        removeObbStatsLabel: false,
        isPlayerCarouselClickable: false,
        withPlusButtonInPlayerCarousel: false,
        showSimplifiedBetButtons: false,
      });
    });
  });
});

describe("mapDispatchToProps", () => {
  const dispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should dispatch ObbEventSelectionAction when dispatchTaggingInteractionClick is called", () => {
    const { dispatchTaggingInteractionClick } = mapDispatchToProps(dispatch);

    dispatchTaggingInteractionClick("player", "next", "cardUrn", "eventName");

    expect(dispatch).toHaveBeenCalledWith({
      type: OBB_CARD__EVENT_SELECTION,
      payload: { event: { elementText: "player - next" }, urn: "cardUrn", eventName: "eventName" },
    });
  });

  it("should dispatch OBB_CARD__ON_SQUADBET_MODAL_OPEN when dispatchOnSquadbetModalOpen is called", () => {
    const { dispatchOnSquadbetModalOpen } = mapDispatchToProps(dispatch);

    dispatchOnSquadbetModalOpen("cardUrn");

    expect(dispatch).toHaveBeenCalledWith({
      type: OBB_CARD__ON_SQUADBET_MODAL_OPEN,
      payload: { cardUrn: "cardUrn" },
    });
  });

  it("should dispatch UI__SQUAD_BET_PLAYER_PICKER_OPEN when dispatchPlayerPickerModalOpen is called", () => {
    const { dispatchPlayerPickerModalOpen } = mapDispatchToProps(dispatch);

    dispatchPlayerPickerModalOpen("cardUrn", "jersey");

    expect(dispatch).toHaveBeenCalledWith({
      type: UI__SQUAD_BET_PLAYER_PICKER_OPEN,
      payload: { cardUrn: "cardUrn", element: "jersey" },
    });
  });

  it("should dispatch OBB_CARD__RESET_SQUADBET_MODAL_STATE when dispatchResetSquadbetModal is called", () => {
    const { dispatchResetSquadbetModal } = mapDispatchToProps(dispatch);

    dispatchResetSquadbetModal("cardUrn");

    expect(dispatch).toHaveBeenCalledWith({
      type: OBB_CARD__RESET_SQUADBET_MODAL_STATE,
      payload: { cardUrn: "cardUrn" },
    });
  });
});
