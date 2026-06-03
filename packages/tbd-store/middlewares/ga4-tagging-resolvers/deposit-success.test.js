import { buildDepositSuccessEvent } from "tagging-library";
import { getDepositSuccessEvent } from "./deposit-success";
import { getDepositSuccessEventObject } from "./helpers";

jest.mock("tagging-library", () => ({
  buildDepositSuccessEvent: jest.fn().mockReturnValue("deposit success event"),
}));

jest.mock("./helpers", () => ({
  getDepositSuccessEventObject: jest.fn().mockReturnValue({
    paymentTransactionId: "123456",
    value: 10,
    paymentTransactionMethod: "type",
    numOfPaymentTransactions: "null",
    accountBalance: "null",
    depositLimit: "null",
    currency: "eur",
  }),
}));

describe("deposit", () => {
  describe("getDepositSuccessEvent", () => {
    it("should call buildDepositSuccessEvent with the correct payload", () => {
      const data = { payload: { currency: "eur", deposited: 10, transactionId: "123456", methodType: "type" } };
      const result = getDepositSuccessEvent({
        payload: { data },
      });

      expect(getDepositSuccessEventObject).toHaveBeenCalledWith(data);
      expect(buildDepositSuccessEvent).toHaveBeenCalledWith({
        paymentTransactionId: "123456",
        value: 10,
        paymentTransactionMethod: "type",
        numOfPaymentTransactions: "null",
        accountBalance: "null",
        depositLimit: "null",
        currency: "eur",
      });
      expect(result).toBe("deposit success event");
    });
  });
});
