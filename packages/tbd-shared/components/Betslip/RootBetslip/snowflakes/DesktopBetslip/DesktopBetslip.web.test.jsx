import { render } from "@testing-library/react";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";

import { DesktopBetslip } from "./DesktopBetslip.web";
import ConnectedObbBetslip from "../../../ObbBetslip";
import { ObbBetslip } from "../../../ObbBetslip/ObbBetslip.web";
import ConnectedSportsbookBetslip from "../../../SportsbookBetslip";
import { SportsbookBetslip } from "../../../SportsbookBetslip/SportsbookBetslip.web";

import ConnectedConfirmationDrawer from "../../../ConfirmationDrawer";
import { ConfirmationDrawer } from "../../../ConfirmationDrawer/ConfirmationDrawer.web";

jest.mock("../../../ObbBetslip", () => jest.fn(({ props }) => <connected-obb-betslip {...props} />));

jest.mock("../../../ObbBetslip/ObbBetslip.web", () => ({
  ObbBetslip: jest.fn(() => <obb-betslip />),
}));

jest.mock("../../../SportsbookBetslip", () => jest.fn(({ props }) => <connected-sportsbook-betslip {...props} />));

jest.mock("../../../SportsbookBetslip/SportsbookBetslip.web", () => ({
  SportsbookBetslip: jest.fn(() => <sportsbook-betslip />),
}));

jest.mock("../../../ConfirmationDrawer", () => ({
  __esModule: true,
  default: jest.fn((props) => <connected-confirmation-drawer {...props} />),
}));

jest.mock("../../../ConfirmationDrawer/ConfirmationDrawer.web", () => ({
  ConfirmationDrawer: jest.fn(() => <confirmation-drawer />),
}));

jest.mock("../../../../../helpers/i18n", () => ({ i18n: jest.fn(({ key }) => key) }));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon-mock />),
}));

function renderDesktopBetslip({
  hasConfirmation = false,
  step = "PLACE_POTENTIAL",
  activeBetslipType = "SPORTSBOOK",
  onClose,
} = {}) {
  return render(
    <DesktopBetslip
      hasConfirmation={hasConfirmation}
      step={step}
      activeBetslipType={activeBetslipType}
      onClose={onClose}
    />,
  );
}
describe("Desktop Betslip", () => {
  beforeEach(() => jest.clearAllMocks());
  describe("when activeBetslipType is OBB", () => {
    it("should render BetslipDrawer with betslip obb title", () => {
      renderDesktopBetslip({ activeBetslipType: "OBB" });

      expect(ConnectedObbBetslip).toHaveBeenCalledWith(
        {
          component: ObbBetslip,
        },
        undefined,
      );
      expect(ConnectedObbBetslip).toHaveBeenCalledTimes(1);
    });
  });
  describe("and the activeBetslipType is not OBB", () => {
    it("should render BetslipDrawer with betslip title", () => {
      renderDesktopBetslip({ activeBetslipType: "SPORTSBOOK" });

      expect(ConnectedSportsbookBetslip).toHaveBeenCalledWith(
        {
          component: SportsbookBetslip,
        },
        undefined,
      );
      expect(ConnectedSportsbookBetslip).toHaveBeenCalledTimes(1);
    });
  });
  describe("when there is a pending confirmation", () => {
    it("should render ConnectedConfirmationDrawer", () => {
      renderDesktopBetslip({ hasConfirmation: true });

      expect(ConnectedConfirmationDrawer).toHaveBeenCalledWith(
        {
          component: ConfirmationDrawer,
        },
        undefined,
      );
      expect(ConnectedConfirmationDrawer).toHaveBeenCalledTimes(1);
    });
  });
  describe("when there is not a pending confirmation", () => {
    it("should not render ConnectedConfirmationDrawer", () => {
      renderDesktopBetslip({ hasConfirmation: false });

      expect(ConnectedConfirmationDrawer).not.toHaveBeenCalled();
    });
  });

  describe("when onClose is provided", () => {
    it("should render Close icon", () => {
      renderDesktopBetslip({ onClose: jest.fn() });

      expect(GenericIcon).toHaveBeenCalledTimes(1);
    });
  });
});
