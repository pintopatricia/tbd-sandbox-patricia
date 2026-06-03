import mapper from "./etx-error-mapper";

describe("EtxErrorMapper", () => {
  function setupReportError({
    reportStatus = "SUCCESS",
    instructionStatus = "SUCCESS",
    instructionErrorCode,
    executionErrorCode,
  }) {
    return mapper({
      status: reportStatus,
      errorCode: executionErrorCode,
      instructionReports: [
        {
          status: "SUCCESS",
        },
        {
          status: instructionStatus,
          errorCode: instructionErrorCode,
        },
      ],
    });
  }

  describe("when it is a successful report with successful intruction reports", () => {
    it("should return null", () => {
      expect(setupReportError({})).toBe(null);
    });
  });

  describe("when it is a not successful report", () => {
    describe("and can't find an error in instructions", () => {
      it("should return default error", () => {
        expect(
          setupReportError({
            reportStatus: "FAILURE",
            instructionStatus: "SUCCESS",
          }),
        ).toBe("UNABLE_PLACE_BET");
      });
    });

    describe("and can find an error in instructions", () => {
      describe("and it is a known error", () => {
        describe("and it is specific", () => {
          it("should return instruction error", () => {
            expect(
              setupReportError({
                reportStatus: "FAILURE",
                instructionStatus: "FAILURE",
                instructionErrorCode: "INSUFFICIENT_FUNDS",
              }),
            ).toBe("INSUFFICIENT_FUNDS");
          });
        });

        describe("and it is not specific", () => {
          it("should return execution error", () => {
            expect(
              setupReportError({
                reportStatus: "FAILURE",
                instructionStatus: "FAILURE",
                instructionErrorCode: "ERROR_IN_ORDER",
                executionErrorCode: "INSUFFICIENT_FUNDS",
              }),
            ).toBe("INSUFFICIENT_FUNDS");
          });
        });
      });

      describe("and it is an unknown error", () => {
        it("should return UNABLE_PLACE_BET error", () => {
          expect(
            setupReportError({
              reportStatus: "FAILURE",
              instructionStatus: "FAILURE",
              instructionErrorCode: "UNKNOWN",
            }),
          ).toBe("UNABLE_PLACE_BET");
        });
      });
    });
  });
});
