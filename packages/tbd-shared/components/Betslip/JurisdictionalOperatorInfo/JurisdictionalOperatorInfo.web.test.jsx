import { render } from "@testing-library/react";
import { Caption } from "@ppb/the-wall-web";
import { Jurisdiction } from "@ppb/tbd-store/state/constants";
import { withJurisdiction } from "../withJurisdiction/withJurisdiction";
import { JurisdictionalOperatorInfo } from "./JurisdictionalOperatorInfo.web";

const mockOperatorInfoTranslation = { value: "Operator info translation" };

jest.mock("@ppb/the-wall-web", () => ({
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
    it("should render the operator regulation translation", () => {
      const { getByText } = renderJurisdictionalOperatorInfo();

      expect(Caption).toHaveBeenCalled();
      expect(getByText("Operator info translation")).toBeTruthy();
    });

    it("should restrain OperatorInfo to ITALY, SPAIN and INTERNATIONAL jurisdictions", () => {
      renderJurisdictionalOperatorInfo();

      expect(withJurisdiction).toHaveBeenCalledWith(expect.any(Function), {
        jurisdictions: [Jurisdiction.ITALY, Jurisdiction.SPAIN, Jurisdiction.INTERNATIONAL],
      });
    });
  });

  describe("when there is NO translation", () => {
    beforeEach(jest.clearAllMocks);

    it("should NOT render the JurisdictionalOperatorInfo", () => {
      mockOperatorInfoTranslation.value = "";

      const { queryByText } = renderJurisdictionalOperatorInfo();

      expect(Caption).not.toHaveBeenCalled();
      expect(queryByText("Operator info translation")).toBeFalsy();
    });
  });
});
