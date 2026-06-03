import { RUNNER_FAILURE_CODES } from "@ppb/betslip-core";
import { AlertType } from "@ppb/the-wall-common/types";
import { createNotificationsViewModelBuilder } from "./bet-builder-failure-mapper";

jest.mock("reselect", () => ({
  createSelector: jest.fn((_deps, selector) => selector),
  createSelectorCreator: jest.fn(() => jest.fn((selector) => selector)),
}));
jest.mock("../../../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

describe("Bet Builder Failure Mapper", () => {
  beforeEach(jest.clearAllMocks);

  describe("createNotificationsViewModelBuilder", () => {
    describe("when the passed runner as argument has failures", () => {
      describe("when there is one INVALID_SGM_COMBINATION_SINGLE_ODDS failure", () => {
        it("should map out one notification", () => {
          const failures = {
            "R:1": [
              {
                failureCode: RUNNER_FAILURE_CODES.INVALID_SGM_COMBINATION_SINGLE_ODDS,
                combinationGroups: [1],
              },
            ],
          };

          expect(createNotificationsViewModelBuilder()(failures, ["R:1"])).toEqual([
            { type: AlertType.Info, message: "I18N.BETSLIP.BET_BUILDER_NOTIFICATION" },
          ]);
        });
      });

      describe("when there is more than one INVALID_SGM_COMBINATION_SINGLE_ODDS failure", () => {
        it("should map out one notification", () => {
          const failures = {
            "R:1": [
              {
                failureCode: RUNNER_FAILURE_CODES.INVALID_SGM_COMBINATION_SINGLE_ODDS,
                combinationGroups: [1],
              },
            ],
            "R:2": [
              {
                failureCode: RUNNER_FAILURE_CODES.INVALID_SGM_COMBINATION_SINGLE_ODDS,
                combinationGroups: [1],
              },
            ],
          };

          expect(createNotificationsViewModelBuilder()(failures, ["R:1", "R:2"])).toEqual([
            { type: AlertType.Info, message: "I18N.BETSLIP.BET_BUILDER_NOTIFICATION" },
          ]);
        });
      });

      describe("when there is a failure without strategy", () => {
        it("should return no notifications", () => {
          const failures = {
            "R:1": [
              {
                failureCode: RUNNER_FAILURE_CODES.INVALID_SGM_COMBINATION,
                combinationGroups: [1],
              },
            ],
          };

          expect(createNotificationsViewModelBuilder()(failures, ["R:1"])).toEqual([]);
        });
      });
    });

    describe("when the passed runner as argument has no failures", () => {
      it("should return no notifications", () => {
        const failures = {
          "R:1": [
            {
              failureCode: RUNNER_FAILURE_CODES.INVALID_SGM_COMBINATION,
              combinationGroups: [1],
            },
          ],
        };

        expect(createNotificationsViewModelBuilder()(failures, ["R:2"])).toEqual([]);
      });
    });
  });
});
