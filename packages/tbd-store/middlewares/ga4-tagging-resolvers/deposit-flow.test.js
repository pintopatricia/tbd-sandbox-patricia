import { buildDepositFlowEvent } from "tagging-library";
import { getDepositFlowEvent } from "./deposit-flow";

jest.mock("tagging-library", () => ({
  buildDepositFlowEvent: jest.fn().mockReturnValue("deposit flow event"),
}));

describe("deposit", () => {
  describe("getDepositFlowEvent", () => {
    it("should call buildDepositFlowEvent with the correct payload", () => {
      const result = getDepositFlowEvent({
        payload: {
          data: { payload: { currency: "eur", deposited: 10, methodType: "type" } },
          referrerLocation: "previous-url.com",
          message: "message",
        },
      });

      expect(buildDepositFlowEvent).toHaveBeenCalledWith({
        action: "message",
        elementText: "null",
        value: 10,
        paymentTransactionMethod: "type",
        referrerModule: "betslip",
        referrerLocation: "previous-url.com",
        currency: "eur",
      });
      expect(result).toBe("deposit flow event");
    });
  });
});
