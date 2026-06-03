import { Overlay, ReceiptTitle } from "@ppb/the-wall-native";
import { render } from "@testing-library/react-native";
import { BetslipType } from "@ppb/tbd-store/state/constants";
import { SystemIconName } from "@ppb/the-wall-icons";

import ConnectedObbBetslip from "../../../ObbBetslip";
import { ObbBetslip } from "../../../ObbBetslip/ObbBetslip.native";
import ConnectedSportsbookBetslip from "../../../SportsbookBetslip";
import { SportsbookBetslip } from "../../../SportsbookBetslip/SportsbookBetslip.native";

import { BetslipDrawer } from "./BetslipDrawer.native";

jest.mock("../../../../Header/hooks/useHeaderSize.native", () => ({
  useHeaderSize: jest.fn(() => 1337),
}));

jest.mock("../../../ObbBetslip/ObbBetslip.native", () => ({
  ObbBetslip: jest.fn(() => <obb-betslip />),
}));

jest.mock("../../../ObbBetslip", () => ({
  __esModule: true,
  default: jest.fn((props) => <connected-obb-betslip-mock {...props} />),
}));

jest.mock("../../../SportsbookBetslip", () => ({
  __esModule: true,
  default: jest.fn(() => <connected-sbk-betslip-mock />),
}));

jest.mock("../../../SportsbookBetslip/SportsbookBetslip.native", () => ({
  SportsbookBetslip: jest.fn(() => <sbk-betslip-mock />),
}));

jest.mock("@ppb/the-wall-native", () => ({
  Overlay: jest.fn((props) => <overlay-mock {...props} />),
  ReceiptTitle: jest.fn((props) => <receipt-title-mock {...props} />),
}));

function renderBetslipDrawer({
  title = "Betslip title mock",
  activeBetslipType = "SPORTSBOOK",
  step = "PLACE_POTENTIAL",
  onClose = jest.fn(),
} = {}) {
  return render(<BetslipDrawer title={title} step={step} activeBetslipType={activeBetslipType} onClose={onClose} />);
}

beforeEach(() => jest.clearAllMocks());

describe("BetslipDrawer", () => {
  describe("initialisation", () => {
    it("should render Overlay", () => {
      renderBetslipDrawer();

      expect(Overlay).toHaveBeenCalledWith(
        expect.objectContaining({
          onOutsideTap: expect.any(Function),
        }),
        undefined,
      );
    });

    describe("when not REPORT step", () => {
      it("should render ReceiptTitle with chevron icon", () => {
        renderBetslipDrawer({ step: "PLACE_POTENTIAL" });

        expect(ReceiptTitle).toHaveBeenCalledWith(
          {
            title: "Betslip title mock",
            icon: SystemIconName.CHEVRON_DOWN,
            onButtonPress: expect.any(Function),
          },
          undefined,
        );
      });
    });

    describe("when REPORT step", () => {
      it("should render ReceiptTitle with close icon", () => {
        renderBetslipDrawer({ step: "REPORT" });

        expect(ReceiptTitle).toHaveBeenCalledWith(
          {
            title: "Betslip title mock",
            icon: SystemIconName.CLOSE,
            onButtonPress: expect.any(Function),
          },
          undefined,
        );
      });
    });
  });

  describe("when is not OBB", () => {
    it("should render SportsbookBetslip", () => {
      renderBetslipDrawer({ step: "REPORT" });

      expect(ConnectedSportsbookBetslip).toHaveBeenCalledWith(
        {
          component: SportsbookBetslip,
        },
        undefined,
      );
      expect(ConnectedObbBetslip).not.toHaveBeenCalled();
    });
  });

  describe("when is OBB", () => {
    it("should render ObbBetslip", () => {
      renderBetslipDrawer({ step: "REPORT", activeBetslipType: BetslipType.OBB });

      expect(ConnectedObbBetslip).toHaveBeenCalledWith(
        {
          component: ObbBetslip,
        },
        undefined,
      );
      expect(ConnectedSportsbookBetslip).not.toHaveBeenCalled();
    });
  });
});
