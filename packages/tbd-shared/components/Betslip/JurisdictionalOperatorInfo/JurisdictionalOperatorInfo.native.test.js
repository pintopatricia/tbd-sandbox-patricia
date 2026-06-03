import { render } from "@testing-library/react-native";
import { Caption } from "@ppb/the-wall-native";
import { Jurisdiction } from "@ppb/tbd-store/state/constants";
import { withJurisdiction } from "../withJurisdiction/withJurisdiction";
import { JurisdictionalOperatorInfo } from "./JurisdictionalOperatorInfo.native";

const mockOperatorInfoTranslation = { value: "Operator info translation" };

jest.mock("@ppb/the-wall-native", () => ({
  Caption: jest.fn(({ children }) => <caption-mock>{children}</caption-mock>),
}));

jest.mock("../withJurisdiction/withJurisdiction", () => ({
  withJurisdiction: jest.fn((component) => component),
}));

jest.mock("./JurisdictionalOperatorInfo.helper.ts", () => ({
  get operatorInfoTranslation() {
    return mockOperatorInfoTranslation.value;
  },
}));

function renderJurisdictionalOperatorInfo() {
  return render(<JurisdictionalOperatorInfo />);
}

describe("JurisdictionalOperatorInfo", () => {
  describe("when there is translation", () => {
    beforeEach(() => {
      renderJurisdictionalOperatorInfo();
    });

    it("should render the operator regulation translation", () => {
      expect(Caption).toHaveBeenCalled();
      const calls = Caption.mock.calls[0][0];
      expect(calls.children).toContain("Operator info translation");
    });

    it("should restrain OperatorInfo to ITALY, SPAIN and INTERNATIONAL jurisdictions", () => {
      expect(withJurisdiction).toHaveBeenCalledWith(expect.any(Function), {
        jurisdictions: [Jurisdiction.ITALY, Jurisdiction.SPAIN, Jurisdiction.INTERNATIONAL],
      });
    });
  });

  describe("when there is NO translation", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      mockOperatorInfoTranslation.value = "";
      renderJurisdictionalOperatorInfo();
    });

    it("should NOT render the JurisdictionalOperatorInfo", () => {
      expect(Caption).not.toHaveBeenCalled();
    });
  });
});
