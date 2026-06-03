import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import EmptyBetsip from "./EmptyBetslip.web";

jest.mock("../../../helpers/i18n", () => ({ i18n: jest.fn(({ key }) => key) }));

function renderSinglesCard() {
  return render(<EmptyBetsip />);
}

describe("Emptybetslip", () => {
  describe("when only one combination", () => {
    it("should call ConnectedSingle per id", () => {
      const emptyBetslip = renderSinglesCard();

      expect(emptyBetslip.getByText("I18N.BETSLIP.EMPTY.TITLE")).not.toBeNull();
      expect(emptyBetslip.getByText("I18N.BETSLIP.EMPTY.BODY")).not.toBeNull();
    });
  });
});
