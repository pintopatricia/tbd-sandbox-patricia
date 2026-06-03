import {
  createGetIsCombinationOpportunityType,
  createGetPopularCombination,
} from "@ppb/tbd-store/state/betslip/betslip-popular-bets-selectors";
import {
  createGetFailureLegIdsByCombinationGroupIdSelector,
  getBettingResolvers,
  getSportsbookBettingLegs,
  getSportsbookBettingCombinations,
} from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import {
  getSportsbookConfirmationCombinations,
  getSportsbookConfirmationLegs,
} from "@ppb/tbd-store/state/betslip/betslip-card-selectors";

import { i18n } from "../../../../helpers/i18n";
import { combinationToBetBuilder } from "../../connected-sportsbook-betslip-mapper";
import { createIsConfirmStep } from "../../sportsbook-betslip-confirm-mapper";

import { makeMapStateToProps } from "./map-to-props-factory";

const getExperiment = jest.fn();

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors");
jest.mock("@ppb/tbd-store/state/betslip/betslip-popular-bets-selectors", () => ({
  createGetIsCombinationOpportunityType: jest.fn(),
  createGetPopularCombination: jest.fn(),
}));

const getFailedLegIdsByCombinationGroupMock = jest.fn().mockReturnValue(["FAILED_LEG:1"]);
jest.mock("@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors", () => ({
  createGetFailureLegIdsByCombinationGroupIdSelector: jest.fn(),
  getBettingResolvers: jest.fn(),
  getSportsbookBettingCombinations: jest.fn(),
  getSportsbookBettingLegs: jest.fn(),
  getSportsbookBettingState: jest.fn(),
}));

jest.mock("@ppb/tbd-store/helpers/sportsbook-betting", () => ({
  isStakeValid: jest.fn().mockReturnValue(false),
}));

jest.mock("@ppb/tbd-store/state/betslip/betslip-card-selectors");

const betBuilderBuildMock = jest.fn().mockReturnValue({ bb: "betBuilderMock" });
jest.mock("../../connected-sportsbook-betslip-mapper", () => ({
  combinationToBetBuilder: jest.fn().mockReturnValue({ bb: "betBuilderMock" }),
}));

jest.mock("../../sportsbook-betslip-confirm-mapper", () => ({
  createIsConfirmStep: jest.fn().mockReturnValue(jest.fn()),
}));

jest.mock("@ppb/tbd-store/state/entities/experiments/experiments-selectors", () => ({
  createGetExperimentSelector: jest.fn(() => getExperiment),
}));

jest.mock("../../../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.spyOn(global.console, "error").mockImplementation(() => jest.fn());

const state = {
  entities: { preferences: "preferences", experiments: {} },
  betting: {
    sportsbookBetting: {
      runners: "runnersMapBettingStateMock",
    },
  },
  betslip: {
    sportsbookOddsMovement: { "c:bb:id": { movement: "UP" } },
  },
};

function setup({
  appState = state,
  id = "c:bb:id",
  getFailedLegIdsByCombinationGroup = jest.fn(),
  getMetadata = jest.fn(),
  betBuilderBuild = jest.fn(),
  isConfirmStep = jest.fn(),
} = {}) {
  createGetFailureLegIdsByCombinationGroupIdSelector.mockReturnValue(getFailedLegIdsByCombinationGroup);
  getBettingResolvers.mockReturnValue({ getMetadata });
  getUserDetails.mockReturnValue("userDetailsMock");
  getSportsbookBettingCombinations.mockReturnValue({ "c:bb:id": { id: "c:bb:id" } });
  combinationToBetBuilder.mockReturnValue(betBuilderBuild);
  createGetIsCombinationOpportunityType.mockReturnValue(() => true);
  createGetPopularCombination.mockReturnValue(() => ({
    bettingOpportunityType: "POPULAR",
  }));
  createIsConfirmStep.mockReturnValue(isConfirmStep);

  return makeMapStateToProps()(appState, { id });
}

describe("makeMapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  it("should return expected props", () => {
    const getSportsbookBettingLegsSpy = getSportsbookBettingLegs.mockReturnValue("legsMapMock");
    const getBettingRunnersMetadataMock = jest.fn().mockReturnValueOnce("runnersMetadataMock");
    const isConfirmStepMock = jest.fn().mockReturnValueOnce(false);

    const props = setup({
      getFailedLegIdsByCombinationGroup: getFailedLegIdsByCombinationGroupMock,
      getMetadata: getBettingRunnersMetadataMock,
      betBuilderBuild: betBuilderBuildMock,
      isConfirmStep: isConfirmStepMock,
    });
    expect(getBettingRunnersMetadataMock).toHaveBeenNthCalledWith(1, state);
    expect(getFailedLegIdsByCombinationGroupMock).toHaveBeenCalled();
    expect(getFailedLegIdsByCombinationGroupMock).toHaveBeenCalledTimes(1);
    expect(isConfirmStepMock).toHaveBeenCalledTimes(1);
    expect(isConfirmStepMock).toHaveBeenCalledWith(state);
    expect(getSportsbookBettingLegsSpy).toHaveBeenCalledWith(state);
    expect(getSportsbookBettingLegsSpy).toHaveBeenCalledTimes(1);
    expect(getUserDetails).toHaveBeenCalledWith(state);
    expect(getUserDetails).toHaveBeenCalledTimes(1);
    expect(combinationToBetBuilder).toHaveBeenCalledWith(
      "legsMapMock",
      "runnersMetadataMock",
      "userDetailsMock",
      "runnersMapBettingStateMock",
    );
    expect(combinationToBetBuilder).toHaveBeenCalledTimes(1);
    expect(betBuilderBuildMock).toHaveBeenNthCalledWith(1, { id: "c:bb:id" });
    expect(i18n).toHaveBeenNthCalledWith(1, { key: "I18N.BETSLIP.ODDS" });
    expect(i18n).toHaveBeenNthCalledWith(2, { key: "I18N.BETSLIP.STAKE" });
    expect(i18n).toHaveBeenNthCalledWith(3, { key: "I18N.BETSLIP.POPULAR" });
    expect(i18n).toHaveBeenNthCalledWith(4, { key: "I18N.BETSLIP.RAB" });
    expect(i18n).toHaveBeenCalledTimes(4);
    expect(props).toEqual({
      failedLegIds: ["FAILED_LEG:1"],
      bb: "betBuilderMock",
      notifications: [],
      isPopular: true,
      isPackagedCreatedBets: true,
      i18n: {
        odds: "I18N.BETSLIP.ODDS",
        stake: "I18N.BETSLIP.STAKE",
        popular: "I18N.BETSLIP.POPULAR",
        createdBets: "I18N.BETSLIP.RAB",
      },
    });
  });

  describe("when is bet confirmation step", () => {
    const sportsbookBettingCombinations = {
      "BETTING:COMBINATION:1": {
        legs: ["BETTING:COMBINATION:1"],
      },
    };
    const betslipCombinations = {
      "BETSLIP:COMBINATION:1": {
        legs: ["BETSLIP:COMBINATION:1"],
      },
    };
    const combinationId = "BETSLIP:COMBINATION:1";
    let getSportsbookConfirmationCombinationsSpy;
    let getSportsbookBettingCombinationsSpy;
    let getSportsbookBettingLegsSpy;
    let getSportsbookConfirmationLegsSpy;

    beforeAll(() => {
      getSportsbookConfirmationCombinationsSpy =
        getSportsbookConfirmationCombinations.mockReturnValue(betslipCombinations);
      getSportsbookBettingCombinationsSpy =
        getSportsbookBettingCombinations.mockReturnValue(sportsbookBettingCombinations);
      getSportsbookBettingLegsSpy = getSportsbookBettingLegs.mockReturnValue("legsMapMock");
      getSportsbookConfirmationLegsSpy = getSportsbookConfirmationLegs.mockReturnValue("legsMapMock");
    });

    it("should get the legs ids from betslip state", () => {
      const { legIds } = setup({
        id: combinationId,
        sportsbookBettingCombinations,
        betslipCombinations,
        betBuilderBuild: betBuilderBuildMock,
        isConfirmStep: jest.fn().mockReturnValueOnce(true),
      });

      expect(legIds).toEqual([combinationId]);
      expect(getSportsbookConfirmationCombinationsSpy).toHaveBeenCalled();
      expect(getSportsbookBettingCombinationsSpy).not.toHaveBeenCalled();
      expect(getSportsbookConfirmationLegsSpy).toHaveBeenCalled();
      expect(getSportsbookBettingLegsSpy).not.toHaveBeenCalled();
    });

    describe("when the legs from betslip are empty", () => {
      it("should return an empty object", () => {
        getSportsbookConfirmationLegs.mockReturnValueOnce({});
        const result = setup({
          id: combinationId,
          sportsbookBettingCombinations,
          betslipCombinations,
          betBuilderBuild: betBuilderBuildMock,
          isConfirmStep: jest.fn().mockReturnValueOnce(true),
        });

        expect(result).toEqual({});
      });
    });

    describe("when the combinations from betslip are empty", () => {
      it("should return an empty object", () => {
        getSportsbookConfirmationCombinations.mockReturnValueOnce({});
        const result = setup({
          id: combinationId,
          sportsbookBettingCombinations,
          betslipCombinations,
          betBuilderBuild: betBuilderBuildMock,
          isConfirmStep: jest.fn().mockReturnValueOnce(true),
        });

        expect(result).toEqual({});
      });
    });

    describe("when there are failed combinations", () => {
      it("should not return the failed legs ids", () => {
        const { failedLegIds } = setup({
          id: combinationId,
          getFailedLegIdsByCombinationGroup: getFailedLegIdsByCombinationGroupMock,
          betBuilderBuild: betBuilderBuildMock,
          isConfirmStep: jest.fn().mockReturnValueOnce(true),
        });

        expect(failedLegIds).toEqual([]);
      });
    });
  });
});
