import { buildFirstDepositSuccessEvent } from "tagging-library";
import { getFirstDepositSuccessEvent } from "./first-deposit-success";
import { getDepositSuccessEventObject } from "./helpers";

jest.mock("tagging-library", () => ({
  buildFirstDepositSuccessEvent: jest.fn().mockReturnValue("first deposit success event"),
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

describe("first-deposit-success", () => {
  describe("getFirstDepositSuccessEvent", () => {
    it("should call buildFirstDepositSuccessEvent with the correct payload", () => {
      const data = { payload: { currency: "eur", deposited: 10, transactionId: "123456", methodType: "type" } };
      const result = getFirstDepositSuccessEvent({
        payload: { data },
      });

      expect(getDepositSuccessEventObject).toHaveBeenCalledWith(data);
      expect(buildFirstDepositSuccessEvent).toHaveBeenCalledWith({
        paymentTransactionId: "123456",
        value: 10,
        paymentTransactionMethod: "type",
        numOfPaymentTransactions: "null",
        accountBalance: "null",
        depositLimit: "null",
        currency: "eur",
      });
      expect(result).toBe("first deposit success event");
    });
  });
});
