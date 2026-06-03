import {
  OBB_CARD__EVENT_SELECTION,
  OBB_CARD__ON_SQUADVSSQUAD_MODAL_OPEN,
  UI__SQUAD_VS_SQUAD_TOGGLE_PLAYERS_TOOLTIP,
  UI__SQUAD_VS_SQUAD_PLAYER_PICKER_OPEN,
} from "@ppb/tbd-store/actions/obb";
import { buildMicroPlayerVm, getSquadAverageStatByIncidentType, isToRemoveObbStatsLabel } from "../../helpers/obb";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

const getObbSquadVsSquadCardByURNMock = jest.fn();
const getObbCardPositionByLayoutMock = jest.fn();

jest.mock("@ppb/tbd-store/state/layout/cards/obb-card/obb-card-selectors", () => ({
  createObbCardByURNSelector: jest.fn(() => getObbSquadVsSquadCardByURNMock),
  createObbCardPositionSelector: jest.fn(() => getObbCardPositionByLayoutMock),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.mock("../../helpers/obb", () => ({
  buildPlayer: jest.fn(),
  buildMicroPlayerVm: jest.fn(),
  getSquadAverageStatByIncidentType: jest.fn(),
  getContextualStatsText: jest.fn((statsLabel) => statsLabel ?? "I18N.OBB.SQUAD_VS_SQUAD.DEFAULT_STATS.LABEL"),
  isToRemoveObbStatsLabel: jest.fn(() => false),
  getIncidentDataMapping: jest.fn(),
}));

const buildMicroPlayerVmMock = buildMicroPlayerVm;
const getSquadAverageStatByIncidentTypeMock = getSquadAverageStatByIncidentType;
const isToRemoveObbStatsLabelMock = isToRemoveObbStatsLabel;

const cardSelectorMock = {
  title: "Card Title",
  sportevent: {
    name: "EventName",
  },
  typename: "ObbSquadVsSquadCard",
  showModalEntryPoint: true,
  firstSquadParticipants: [{ urn: "participant:1" }, { urn: "participant:2" }],
  secondSquadParticipants: [{ urn: "participant:3" }, { urn: "participant:4" }],
  incidentType: "GOALS",
  statsLabel: "StatsLabel",
  outcomesLabel: "OutcomesLabel",
  defaultLegs: ["leg:1", "leg:2"],
};

describe("makeMapStateToProps", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when card is not defined", () => {
    it("should return an empty object", () => {
      getObbSquadVsSquadCardByURNMock.mockReturnValueOnce(undefined);

      const mapStateToProps = makeMapStateToProps();

      const stateToProps = mapStateToProps(
        { entities: { experiments: {} } },
        { urn: "urn", layoutUrn: "layoutUrn", cardGroupUrn: "cardGroupUrn", itemIndex: 0 },
      );

      expect(stateToProps).toEqual({});
    });
  });

  describe("when card type is not valid", () => {
    it("should return an empty object", () => {
      getObbSquadVsSquadCardByURNMock.mockReturnValueOnce({ typename: "InvalidType" });

      const mapStateToProps = makeMapStateToProps();

      const stateToProps = mapStateToProps(
        { entities: { experiments: {} } },
        { urn: "urn", layoutUrn: "layoutUrn", cardGroupUrn: "cardGroupUrn", itemIndex: 0 },
      );

      expect(stateToProps).toEqual({});
    });
  });

  describe("when the card is valid", () => {
    it("should return the card props", () => {
      getObbSquadVsSquadCardByURNMock.mockReturnValueOnce(cardSelectorMock);
      buildMicroPlayerVmMock.mockReturnValueOnce({
        jerseys: ["jersey1", "jersey2"],
        players: [
          {
            firstName: "Player1",
            lastName: "LastName1",
          },
          {
            firstName: "Player2",
            lastName: "LastName2",
          },
        ],
      });
      buildMicroPlayerVmMock.mockReturnValueOnce({
        jerseys: ["jersey1", "jersey2"],
        players: [
          {
            firstName: "Player3",
            lastName: "LastName3",
          },
          {
            firstName: "Player4",
            lastName: "LastName4",
          },
        ],
      });

      getSquadAverageStatByIncidentTypeMock.mockReturnValueOnce("5.6");
      getSquadAverageStatByIncidentTypeMock.mockReturnValueOnce("7.8");

      getObbCardPositionByLayoutMock.mockReturnValueOnce({ horizontalPosition: 1, verticalPosition: 1 });

      const mapStateToProps = makeMapStateToProps();

      const stateToProps = mapStateToProps(
        { entities: { experiments: {} } },
        { urn: "urn", layoutUrn: "layoutUrn", cardGroupUrn: "cardGroupUrn", itemIndex: 0 },
      );

      expect(stateToProps).toEqual({
        contextualStatsText: "StatsLabel",
        defaultLegs: ["leg:1", "leg:2"],
        eventName: "EventName",
        firstSquadJerseys: ["jersey1", "jersey2"],
        firstSquadParticipantsNames: [
          {
            firstName: "Player1",
            lastName: "LastName1",
          },
          {
            firstName: "Player2",
            lastName: "LastName2",
          },
        ],
        firstSquadStatValue: "5.6",
        outcomeLabel: "OutcomesLabel",
        position: {
          horizontalPosition: 1,
          verticalPosition: 1,
        },
        removeObbStatsLabel: false,
        secondSquadJerseys: ["jersey1", "jersey2"],
        secondSquadParticipantsNames: [
          {
            firstName: "Player3",
            lastName: "LastName3",
          },
          {
            firstName: "Player4",
            lastName: "LastName4",
          },
        ],
        secondSquadStatValue: "7.8",
        showModalEntryPoint: true,
        title: "Card Title",
        urn: "urn",
      });
    });

    it("should set removeObbStatsLabel to true when experiment requests removal", () => {
      isToRemoveObbStatsLabelMock.mockReturnValueOnce(true);
      getObbSquadVsSquadCardByURNMock.mockReturnValueOnce(cardSelectorMock);
      buildMicroPlayerVmMock.mockReturnValueOnce({
        jerseys: ["jersey1", "jersey2"],
        players: [
          {
            firstName: "Player1",
            lastName: "LastName1",
          },
          {
            firstName: "Player2",
            lastName: "LastName2",
          },
        ],
      });
      buildMicroPlayerVmMock.mockReturnValueOnce({
        jerseys: ["jersey1", "jersey2"],
        players: [
          {
            firstName: "Player3",
            lastName: "LastName3",
          },
          {
            firstName: "Player4",
            lastName: "LastName4",
          },
        ],
      });

      getSquadAverageStatByIncidentTypeMock.mockReturnValueOnce("5.6");
      getSquadAverageStatByIncidentTypeMock.mockReturnValueOnce("7.8");

      getObbCardPositionByLayoutMock.mockReturnValueOnce({ horizontalPosition: 1, verticalPosition: 1 });

      const mapStateToProps = makeMapStateToProps();

      const stateToProps = mapStateToProps(
        { entities: { experiments: {} } },
        { urn: "urn", layoutUrn: "layoutUrn", cardGroupUrn: "cardGroupUrn", itemIndex: 0 },
      );
      expect(stateToProps.removeObbStatsLabel).toBe(true);
    });
  });

  describe("when the optional fields don't have value", () => {
    it("should return the default values", () => {
      getObbSquadVsSquadCardByURNMock.mockReturnValueOnce({
        ...cardSelectorMock,
        outcomesLabel: null,
      });

      buildMicroPlayerVmMock.mockReturnValueOnce({
        jerseys: ["jersey1", "jersey2"],
        players: [
          {
            firstName: "Player1",
            lastName: "LastName1",
          },
          {
            firstName: "Player2",
            lastName: "LastName2",
          },
        ],
      });
      buildMicroPlayerVmMock.mockReturnValueOnce({
        jerseys: ["jersey1", "jersey2"],
        players: [
          {
            firstName: "Player3",
            lastName: "LastName3",
          },
          {
            firstName: "Player4",
            lastName: "LastName4",
          },
        ],
      });

      getSquadAverageStatByIncidentTypeMock.mockReturnValueOnce(null);
      getSquadAverageStatByIncidentTypeMock.mockReturnValueOnce(null);

      getObbCardPositionByLayoutMock.mockReturnValueOnce({ horizontalPosition: 1, verticalPosition: 1 });

      const mapStateToProps = makeMapStateToProps();

      const stateToProps = mapStateToProps(
        { entities: { experiments: {} } },
        { urn: "urn", layoutUrn: "layoutUrn", cardGroupUrn: "cardGroupUrn", itemIndex: 0 },
      );

      expect(stateToProps).toEqual({
        contextualStatsText: "StatsLabel",
        defaultLegs: ["leg:1", "leg:2"],
        eventName: "EventName",
        firstSquadJerseys: ["jersey1", "jersey2"],
        firstSquadParticipantsNames: [
          {
            firstName: "Player1",
            lastName: "LastName1",
          },
          {
            firstName: "Player2",
            lastName: "LastName2",
          },
        ],
        firstSquadStatValue: "-",
        outcomeLabel: "I18N.OBB.SQUAD_VS_SQUAD.DEFAULT_OUTCOMES.LABEL",
        position: {
          horizontalPosition: 1,
          verticalPosition: 1,
        },
        removeObbStatsLabel: false,
        secondSquadJerseys: ["jersey1", "jersey2"],
        secondSquadParticipantsNames: [
          {
            firstName: "Player3",
            lastName: "LastName3",
          },
          {
            firstName: "Player4",
            lastName: "LastName4",
          },
        ],
        secondSquadStatValue: "-",
        showModalEntryPoint: true,
        title: "Card Title",
        urn: "urn",
      });
    });
  });
});

describe("mapDispatchToProps", () => {
  const dispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should dispatch ObbSquadvsSquadOnModalOpenAction when dispatchOnSquadVsSquadModalOpen is called", () => {
    const { dispatchOnSquadVsSquadModalOpen } = mapDispatchToProps(dispatch);

    dispatchOnSquadVsSquadModalOpen("cardUrn");

    expect(dispatch).toHaveBeenCalledWith({
      type: OBB_CARD__ON_SQUADVSSQUAD_MODAL_OPEN,
      payload: { cardUrn: "cardUrn" },
    });
  });

  it("should dispatch ObbSquadVsSquadPlayerPickerOpenAction when dispatchPlayerPickerModalOpen is called", () => {
    const { dispatchPlayerPickerModalOpen } = mapDispatchToProps(dispatch);

    dispatchPlayerPickerModalOpen("cardUrn");

    expect(dispatch).toHaveBeenCalledWith({
      type: UI__SQUAD_VS_SQUAD_PLAYER_PICKER_OPEN,
      payload: { cardUrn: "cardUrn" },
    });
  });

  it("should dispatch ObbEventSelectionAction when dispatchTaggingInteractionClick is called", () => {
    const { dispatchTaggingInteractionClick } = mapDispatchToProps(dispatch);

    dispatchTaggingInteractionClick("1", "cardUrn", "eventName");

    expect(dispatch).toHaveBeenCalledWith({
      type: OBB_CARD__EVENT_SELECTION,
      payload: {
        event: {
          elementText: "edit squad 1",
          module: {
            card: "mash ups",
          },
        },
        urn: "cardUrn",
        eventName: "eventName",
      },
    });
  });

  it("should dispatch ObbSquadVsSquadTogglePlayersTooltipAction when dispatchTogglePlayersTooltip is called", () => {
    const { dispatchTogglePlayersTooltip } = mapDispatchToProps(dispatch);

    dispatchTogglePlayersTooltip("cardUrn", "actionType");

    expect(dispatch).toHaveBeenCalledWith({
      type: UI__SQUAD_VS_SQUAD_TOGGLE_PLAYERS_TOOLTIP,
      payload: { cardUrn: "cardUrn", actionType: "actionType" },
    });
  });
});
