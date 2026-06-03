import { render } from "@testing-library/react-native";
import { ObbBetslip } from "./ObbBetslip.native";
import ConnectedObbPlace from "../ObbPlace";
import { ObbPlace } from "../ObbPlace/ObbPlace.native";
import ConnectedObbBetReceipt from "../ObbBetReceipt";
import { ObbBetReceipt } from "../ObbBetReceipt/ObbBetReceipt.native";

jest.mock("../ObbPlace", () => jest.fn(() => <connected-place-mock />));

jest.mock("../ObbPlace/ObbPlace.native", () => ({
  ObbPlace: jest.fn(() => <obb-place-mock />),
}));

jest.mock("../ObbBetReceipt", () => jest.fn(() => <connected-obb-bet-receipt-mock />));
jest.mock("../ObbBetReceipt/ObbBetReceipt.native", () => ({
  ObbBetReceipt: jest.fn(() => <obb-bet-receipt-mock />),
}));

function renderObbBetslip({ step }) {
  return render(<ObbBetslip step={step} />);
}

describe("ObbBetslip", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when in PLACE_POTENTIAL step", () => {
    it("should delegate to ObbPlace", () => {
      renderObbBetslip({
        step: "PLACE_POTENTIAL",
      });

      expect(ConnectedObbPlace).toHaveBeenCalledWith(
        {
          component: ObbPlace,
        },
        undefined,
      );
    });
  });

  describe("when in REPORT step", () => {
    it("should delegate to ConnectedObbBetReceipt", () => {
      renderObbBetslip({ step: "REPORT" });

      expect(ConnectedObbBetReceipt).toHaveBeenCalledWith({ component: ObbBetReceipt }, undefined);
    });
  });
});
