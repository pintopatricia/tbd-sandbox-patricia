import { hasAnyObbSuspendedFailure } from "@ppb/tbd-store/helpers/obb-betting";
import { HintType } from "@ppb/the-wall-common/types";
import { i18n } from "../../../helpers/i18n";
import { buildObbFailureDetails } from "./obb-bet-controls-mapper";

jest.mock("@ppb/tbd-store/helpers/obb-betting");
jest.mock("../../../helpers/i18n", () => ({ i18n: jest.fn().mockReturnValue("Translated Message") }));

describe("Obb Bet Controls Mapper", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("buildObbFailureDetails", () => {
    describe("failure", () => {
      describe("when there is a suspended leg failure", () => {
        it("should return hasFailure as true", () => {
          hasAnyObbSuspendedFailure.mockReturnValue(true);

          const result = buildObbFailureDetails({ legUrn1: "error1" }, ["legUrn1"]);

          expect(result.hasFailure).toEqual(true);
        });

        it("should return a hintType", () => {
          hasAnyObbSuspendedFailure.mockReturnValue(true);

          const result = buildObbFailureDetails({ legUrn1: "error1" }, ["legUrn1"]);

          expect(result.hint.hintType).toEqual(HintType.Warning);
        });

        it("should return a hintMessage", () => {
          hasAnyObbSuspendedFailure.mockReturnValue(true);

          const result = buildObbFailureDetails({ legUrn1: "error1" }, ["legUrn1"]);

          expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.OBB.STATUS.SUSPENDED" });
          expect(result.hint.hintMessage).toEqual("Translated Message");
        });
      });

      describe("when there is a leg failure", () => {
        it("should return hasFailure as true", () => {
          hasAnyObbSuspendedFailure.mockReturnValue(false);

          const result = buildObbFailureDetails({ legUrn1: "error1" }, ["legUrn1"]);

          expect(result.hasFailure).toEqual(true);
        });

        it("should not return a hint", () => {
          hasAnyObbSuspendedFailure.mockReturnValue(false);

          const result = buildObbFailureDetails({ legUrn1: "error1" }, ["legUrn1"]);

          expect(result.hint).toBeNull();
        });
      });

      describe("when there is no failure", () => {
        it("should return hasFailure as false", () => {
          hasAnyObbSuspendedFailure.mockReturnValue(false);

          const result = buildObbFailureDetails({}, ["legUrn1"]);

          expect(result.hint).toBeNull();
        });

        it("should return no hintType", () => {
          hasAnyObbSuspendedFailure.mockReturnValue(false);

          const result = buildObbFailureDetails({}, ["legUrn1"]);

          expect(result.hint).toBeNull();
        });

        it("should return no hintMessage", () => {
          hasAnyObbSuspendedFailure.mockReturnValue(false);

          const result = buildObbFailureDetails({}, ["legUrn1"]);

          expect(i18n).not.toHaveBeenCalled();
          expect(result.hint).toBeNull();
        });
      });
    });
  });
});
