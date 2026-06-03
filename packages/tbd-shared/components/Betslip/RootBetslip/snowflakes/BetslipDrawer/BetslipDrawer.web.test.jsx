import { render } from "@testing-library/react";
import { BetslipType } from "@ppb/tbd-store/state/constants";
// import { Drawer, ReceiptTitle } from "@ppb/the-wall-web";
import { BetslipDrawer } from "./BetslipDrawer.web";

import ConnectedObbBetslip from "../../../ObbBetslip";
import { ObbBetslip } from "../../../ObbBetslip/ObbBetslip.web";
import ConnectedSportsbookBetslip from "../../../SportsbookBetslip";
import { SportsbookBetslip } from "../../../SportsbookBetslip/SportsbookBetslip.web";

jest.mock("../../../ObbBetslip/ObbBetslip.web", () => ({
  ObbBetslip: jest.fn(() => <obb-betslip />),
}));

jest.mock("../../../ObbBetslip", () => ({
  __esModule: true,
  default: jest.fn((props) => <connected-obb-betslip-mock {...props} />),
}));

jest.mock("../../../SportsbookBetslip", () => ({
  __esModule: true,
  default: jest.fn((props) => <connected-sbk-betslip-mock {...props} />),
}));

jest.mock("../../../SportsbookBetslip/SportsbookBetslip.web", () => ({
  SportsbookBetslip: jest.fn(() => <sbk-betslip-mock />),
}));

jest.mock("@ppb/the-wall-web", () => ({
  ReceiptTitle: jest.fn((props) => <receipt-title-mock {...props} />),
}));

jest.mock("@ppb/the-wall-web/components/walls/Drawer/Drawer", () => ({
  Drawer: jest.fn((props) => <drawer-mock {...props} />),
}));

const renderBetslipDrawer = (props = {}) => {
  const defaultProps = {
    title: "Betslip title mock",
    step: "PLACE_POTENTIAL",
    activeBetslipType: BetslipType.SPORTSBOOK,
    onClose: jest.fn(),
  };
  return render(<BetslipDrawer {...defaultProps} {...props} />);
};

describe("BetslipDrawer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("betslip content rendering", () => {
    it("should render SportsbookBetslip when activeBetslipType is SPORTSBOOK", () => {
      renderBetslipDrawer({ activeBetslipType: BetslipType.SPORTSBOOK });

      expect(ConnectedSportsbookBetslip).toHaveBeenCalledWith({ component: SportsbookBetslip }, undefined);
      expect(ConnectedObbBetslip).not.toHaveBeenCalled();
    });

    it("should render ObbBetslip when activeBetslipType is OBB", () => {
      renderBetslipDrawer({ activeBetslipType: BetslipType.OBB });

      expect(ConnectedObbBetslip).toHaveBeenCalledWith({ component: ObbBetslip }, undefined);
      expect(ConnectedSportsbookBetslip).not.toHaveBeenCalled();
    });
  });
});
