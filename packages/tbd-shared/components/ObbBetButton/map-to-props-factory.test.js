import { createSportsbookDisplayOddsPreferencesSelector } from "@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors";
import { createObbLegByIdSelector } from "@ppb/tbd-store/state/entities/obb-legs/obb-legs-selector";
import { createGetObbLegInBetslipByIdSelector } from "@ppb/tbd-store/state/betting/obb-betting/obb-betting-selectors";
import { mapQuantifierEnumToSymbol } from "@ppb/tbd-store/helpers/obb-betting";
import { BETTING__OBB_TOGGLE_LEG_ACTION, UI__OBB_BET_BUTTON_CLICK } from "@ppb/tbd-store/actions/betting";

import { buildObbBetButtonSecondaryLabel, formatName, formatQuote } from "../../helpers/obb";
import { i18n } from "../../helpers/i18n";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";
import { createGetExperimentSelector } from "@ppb/tbd-store/state/entities/experiments/experiments-selectors";

jest.mock("@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors", () => ({
  createSportsbookDisplayOddsPreferencesSelector: jest.fn(),
}));
jest.mock("@ppb/tbd-store/state/entities/obb-legs/obb-legs-selector", () => ({
  createObbLegByIdSelector: jest.fn(),
}));
jest.mock("@ppb/tbd-store/state/betting/obb-betting/obb-betting-selectors", () => ({
  createGetObbLegInBetslipByIdSelector: jest.fn(),
}));

jest.mock("@ppb/tbd-store/helpers/obb-betting", () => ({
  mapQuantifierEnumToSymbol: jest.fn(),
}));

jest.mock("../../helpers/obb", () => ({
  formatQuote: jest.fn(),
  buildObbBetButtonSecondaryLabel: jest.fn(),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => ({ key })),
}));

jest.mock("@ppb/tbd-store/state/entities/experiments/experiments-selectors", () => ({
  createGetExperimentSelector: jest.fn(),
}));

const DEFAULT_STATE = {
  entities: {
    brandSettings: {
      SPORTSBOOK_BET_BUTTON_ANIMATION: false,
    },
  },
};

const DEFAULT_CONTAINER_PROPS = {
  cardUrn: "urn:1",
  position: { horizontalPosition: 1, verticalPosition: 1 },
  legId: "leg-1",
  eventName: "Event Name",
};

const getSportsbookDisplayOddsPreferences = jest.fn();
const getObbLegById = jest.fn();
const getObbLegInBetslipById = jest.fn();
const getExperiment = jest.fn();

describe("makeMapStateToProps", () => {
  beforeEach(jest.resetAllMocks);

  beforeEach(() => {
    i18n.mockImplementation(({ key }) => key);
  });

  beforeEach(() => {
    createGetExperimentSelector.mockReturnValue(getExperiment);
    getExperiment.mockReturnValue(undefined);
  });

  describe("when leg is not found", () => {
    it("should return an empty object", () => {
      createSportsbookDisplayOddsPreferencesSelector.mockReturnValue(getSportsbookDisplayOddsPreferences);
      getSportsbookDisplayOddsPreferences.mockReturnValueOnce("DECIMAL");

      createObbLegByIdSelector.mockReturnValue(getObbLegById);
      getObbLegById.mockReturnValueOnce(undefined);

      const mapStateToProps = makeMapStateToProps(DEFAULT_STATE);
      const result = mapStateToProps(DEFAULT_STATE, DEFAULT_CONTAINER_PROPS);

      expect(result).toEqual({});
    });
  });

  describe("when leg has no templateParams", () => {
    it("should return an empty object", () => {
      createSportsbookDisplayOddsPreferencesSelector.mockReturnValue(getSportsbookDisplayOddsPreferences);
      getSportsbookDisplayOddsPreferences.mockReturnValueOnce("DECIMAL");

      createObbLegByIdSelector.mockReturnValue(getObbLegById);
      getObbLegById.mockReturnValueOnce({ id: "leg-1", templateParams: undefined });

      const mapStateToProps = makeMapStateToProps(DEFAULT_STATE);
      const result = mapStateToProps(DEFAULT_STATE, DEFAULT_CONTAINER_PROPS);

      expect(result).toEqual({});
    });
  });

  describe("when leg is found", () => {
    it("should return the props", () => {
      createSportsbookDisplayOddsPreferencesSelector.mockReturnValue(getSportsbookDisplayOddsPreferences);
      getSportsbookDisplayOddsPreferences.mockReturnValueOnce("DECIMAL");

      createObbLegByIdSelector.mockReturnValue(getObbLegById);
      getObbLegById.mockReturnValueOnce({
        templateId: "playerVsPlayer",
        templateParams: { participantIdA: { player: { name: "Player A" } } },
      });

      buildObbBetButtonSecondaryLabel.mockReturnValueOnce("Player A");

      createGetObbLegInBetslipByIdSelector.mockReturnValue(getObbLegInBetslipById);
      getObbLegInBetslipById.mockReturnValueOnce(true);

      formatQuote.mockReturnValueOnce({ odds: "1.00" });

      const mapStateToProps = makeMapStateToProps(DEFAULT_STATE);
      const result = mapStateToProps(DEFAULT_STATE, DEFAULT_CONTAINER_PROPS);

      expect(result).toEqual({
        animated: false,
        cardUrn: "urn:1",
        eventName: "Event Name",
        legId: "leg-1",
        secondaryLabel: "Player A",
        position: {
          horizontalPosition: 1,
          verticalPosition: 1,
        },
        quote: {
          odds: "1.00",
        },
        status: "selected",
        accessibilityHints: {
          default: "I18N.ACCESSIBILITY.ADD_TO_BETSLIP_HINT",
          selected: "I18N.ACCESSIBILITY.REMOVE_FROM_BETSLIP_HINT",
        },
        accessibilityLabel: "Player A, I18N.ACCESSIBILITY.BET_BUTTON_DEFAULT",
      });
    });
  });

  describe("when showSecondaryLabel is false", () => {
    it("should return undefined secondaryLabel", () => {
      createSportsbookDisplayOddsPreferencesSelector.mockReturnValue(getSportsbookDisplayOddsPreferences);
      getSportsbookDisplayOddsPreferences.mockReturnValueOnce("DECIMAL");

      createObbLegByIdSelector.mockReturnValue(getObbLegById);
      getObbLegById.mockReturnValueOnce({
        templateId: "playerVsPlayer",
        templateParams: { participantIdA: { player: { name: "Player A" } } },
      });

      createGetObbLegInBetslipByIdSelector.mockReturnValue(getObbLegInBetslipById);
      getObbLegInBetslipById.mockReturnValueOnce(false);

      formatQuote.mockReturnValueOnce({ odds: "1.00" });

      const mapStateToProps = makeMapStateToProps(DEFAULT_STATE);
      const result = mapStateToProps(DEFAULT_STATE, { ...DEFAULT_CONTAINER_PROPS, showSecondaryLabel: false });

      expect(result.secondaryLabel).toBeUndefined();
    });
  });

  describe("animated prop from brand settings", () => {
    it("should return animated: true when SPORTSBOOK_BET_BUTTON_ANIMATION is true", () => {
      const stateWithAnimationTrue = {
        entities: {
          brandSettings: {
            SPORTSBOOK_BET_BUTTON_ANIMATION: true,
          },
        },
      };

      createSportsbookDisplayOddsPreferencesSelector.mockReturnValue(getSportsbookDisplayOddsPreferences);
      getSportsbookDisplayOddsPreferences.mockReturnValueOnce("DECIMAL");

      createObbLegByIdSelector.mockReturnValue(getObbLegById);
      getObbLegById.mockReturnValueOnce({
        templateId: "playerVsPlayer",
        templateParams: { participantIdA: { player: { name: "Player A" } } },
      });

      createGetObbLegInBetslipByIdSelector.mockReturnValue(getObbLegInBetslipById);
      getObbLegInBetslipById.mockReturnValueOnce(false);

      formatQuote.mockReturnValueOnce({ odds: "1.00" });

      const mapStateToProps = makeMapStateToProps(stateWithAnimationTrue);
      const result = mapStateToProps(stateWithAnimationTrue, DEFAULT_CONTAINER_PROPS);

      expect(result.animated).toBe(true);
    });

    it("should return animated: true when SPORTSBOOK_BET_BUTTON_ANIMATION is undefined (default)", () => {
      const stateWithNoAnimationSetting = {
        entities: {
          brandSettings: {},
        },
      };

      createSportsbookDisplayOddsPreferencesSelector.mockReturnValue(getSportsbookDisplayOddsPreferences);
      getSportsbookDisplayOddsPreferences.mockReturnValueOnce("DECIMAL");

      createObbLegByIdSelector.mockReturnValue(getObbLegById);
      getObbLegById.mockReturnValueOnce({
        templateId: "playerVsPlayer",
        templateParams: { participantIdA: { player: { name: "Player A" } } },
      });

      createGetObbLegInBetslipByIdSelector.mockReturnValue(getObbLegInBetslipById);
      getObbLegInBetslipById.mockReturnValueOnce(false);

      formatQuote.mockReturnValueOnce({ odds: "1.00" });

      const mapStateToProps = makeMapStateToProps(stateWithNoAnimationSetting);
      const result = mapStateToProps(stateWithNoAnimationSetting, DEFAULT_CONTAINER_PROPS);

      expect(result.animated).toBe(true);
    });
  });

  describe("status prop", () => {
    it("should use provided status prop instead of checking betslip", () => {
      createSportsbookDisplayOddsPreferencesSelector.mockReturnValue(getSportsbookDisplayOddsPreferences);
      getSportsbookDisplayOddsPreferences.mockReturnValueOnce("DECIMAL");

      createObbLegByIdSelector.mockReturnValue(getObbLegById);
      getObbLegById.mockReturnValueOnce({
        templateId: "playerVsPlayer",
        templateParams: { participantIdA: { player: { name: "Player A" } } },
      });

      createGetObbLegInBetslipByIdSelector.mockReturnValue(getObbLegInBetslipById);
      getObbLegInBetslipById.mockReturnValueOnce(true);

      formatQuote.mockReturnValueOnce({ odds: "1.00" });

      const mapStateToProps = makeMapStateToProps(DEFAULT_STATE);
      const result = mapStateToProps(DEFAULT_STATE, { ...DEFAULT_CONTAINER_PROPS, status: "disabled" });

      expect(result.status).toBe("disabled");
    });
  });

  describe("betslip status logic", () => {
    it("should return 'selected' status when leg is in betslip and no status prop provided", () => {
      createSportsbookDisplayOddsPreferencesSelector.mockReturnValue(getSportsbookDisplayOddsPreferences);
      getSportsbookDisplayOddsPreferences.mockReturnValueOnce("DECIMAL");

      createObbLegByIdSelector.mockReturnValue(getObbLegById);
      getObbLegById.mockReturnValueOnce({
        templateId: "playerVsPlayer",
        templateParams: { participantIdA: { player: { name: "Player A" } } },
      });

      createGetObbLegInBetslipByIdSelector.mockReturnValue(getObbLegInBetslipById);
      getObbLegInBetslipById.mockReturnValueOnce(true);

      formatQuote.mockReturnValueOnce({ odds: "1.00" });

      const mapStateToProps = makeMapStateToProps(DEFAULT_STATE);
      const result = mapStateToProps(DEFAULT_STATE, DEFAULT_CONTAINER_PROPS);

      expect(result.status).toBe("selected");
    });

    it("should return 'default' status when leg is not in betslip and no status prop provided", () => {
      createSportsbookDisplayOddsPreferencesSelector.mockReturnValue(getSportsbookDisplayOddsPreferences);
      getSportsbookDisplayOddsPreferences.mockReturnValueOnce("DECIMAL");

      createObbLegByIdSelector.mockReturnValue(getObbLegById);
      getObbLegById.mockReturnValueOnce({
        templateId: "playerVsPlayer",
        templateParams: { participantIdA: { player: { name: "Player A" } } },
      });

      createGetObbLegInBetslipByIdSelector.mockReturnValue(getObbLegInBetslipById);
      getObbLegInBetslipById.mockReturnValueOnce(false);

      formatQuote.mockReturnValueOnce({ odds: "1.00" });

      const mapStateToProps = makeMapStateToProps(DEFAULT_STATE);
      const result = mapStateToProps(DEFAULT_STATE, DEFAULT_CONTAINER_PROPS);

      expect(result.status).toBe("default");
    });
  });
});

describe("mapDispatchToProps", () => {
  const dispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should dispatch BETTING__OBB_TOGGLE_LEG_ACTION and UI__OBB_BET_BUTTON_CLICK when dispatchAddLegToBetslip is called", () => {
    const { dispatchAddLegToBetslip } = mapDispatchToProps(dispatch);

    dispatchAddLegToBetslip(
      "leg-1",
      "cardUrn",
      "eventName",
      { horizontalPosition: 1, verticalPosition: 1 },
      { moduleName: "popular card" },
    );

    expect(dispatch).toHaveBeenNthCalledWith(1, {
      type: BETTING__OBB_TOGGLE_LEG_ACTION,
      payload: {
        legId: "leg-1",
        cardUrn: "cardUrn",
        eventName: "eventName",
        position: { horizontalPosition: 1, verticalPosition: 1 },
        metadataOverride: { moduleName: "popular card" },
      },
    });

    expect(dispatch).toHaveBeenNthCalledWith(2, {
      type: UI__OBB_BET_BUTTON_CLICK,
    });
  });
});
