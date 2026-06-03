import { buildDepositRedirectPayload } from "./betslip-deposit-redirect-mapper";
import { getEndpoint } from "../../config/endpoints";
import { base64EncodeUrl } from "../../helpers/navigation";

jest.mock("../../config/endpoints", () => ({
  getEndpoint: jest.fn().mockReturnValue("https://www.deposit.com/endpoint"),
}));

jest.mock("../../helpers/navigation", () => ({
  base64EncodeUrl: jest.fn().mockReturnValue("encodedUrl"),
}));

describe("Betslip Deposit Redirect Helper", () => {
  beforeEach(jest.clearAllMocks);

  describe("buildDepositRedirectPayload", () => {
    it("should return an object containing viewUrn and viewUrl", () => {
      const uriComponent = "https://www.betfair.com/betting";
      const payload = buildDepositRedirectPayload(uriComponent);

      expect(payload).toEqual({
        viewUrn: "ppb:tbd:view:myAccountView:encodedUrl",
        viewUrl: "/navigation/a-encodedUrl",
      });
    });

    it("should call getEndpoint", () => {
      buildDepositRedirectPayload("https://www.betfair.com/betting");

      expect(getEndpoint).toHaveBeenCalledWith("DEPOSIT");
    });

    it("should call base64EncodeUrl", () => {
      buildDepositRedirectPayload("https://www.betfair.com/betting");

      expect(base64EncodeUrl).toHaveBeenCalledWith(
        "https://www.deposit.com/endpoint?returnURL=https%3A%2F%2Fwww.betfair.com%2Fbetting",
      );
    });

    describe("when amount is defined", () => {
      it("should call base64EncodeUrl with amount in the query string", () => {
        buildDepositRedirectPayload("https://www.betfair.com/betting", 1337);

        expect(base64EncodeUrl).toHaveBeenCalledWith(
          "https://www.deposit.com/endpoint?returnURL=https%3A%2F%2Fwww.betfair.com%2Fbetting&amount=1337",
        );
      });
    });
  });
});
