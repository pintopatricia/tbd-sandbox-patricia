import { render } from "@testing-library/react-native";

import { BetControls, Alerts } from "@ppb/the-wall-native";
import { AlertType } from "@ppb/the-wall-common/types";
import { PriceBoostMultipleFailure } from "./PriceBoostMultipleFailure.native";
import { ConnectedBetLegs } from "../BetLegs";
import { BetLegs } from "../BetLegs/BetLegs.native";
import { ConnectedSelection } from "../Selection";
import { Selection } from "../Selection/Selection.native";

jest.mock("@ppb/the-wall-native", () => ({
  BetControls: jest.fn(() => <alerts-mock />),
  Alerts: jest.fn(() => <bet-controls-mock />),
}));
jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon />),
}));
jest.mock("../../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));
jest.mock("../BetLegs", () => ({ ConnectedBetLegs: jest.fn(() => <connected-bet-legs-mock />) }));
jest.mock("../BetLegs/BetLegs.native", () => ({ BetLegs: jest.fn(() => <bet-legs-mock />) }));
jest.mock("../Selection", () => ({
  ConnectedSelection: jest.fn(() => <connected-selection-mock />),
}));
jest.mock("../Selection/Selection.native", () => ({ Selection: jest.fn(() => <selection-mock />) }));

function renderPriceBoostMultipleFailure({ id, legIds = [], odds, labels = {}, dispatchRemove = jest.fn() } = {}) {
  return render(
    <PriceBoostMultipleFailure id={id} legIds={legIds} odds={odds} labels={labels} dispatchRemove={dispatchRemove} />,
  );
}

describe("PriceBoostMultipleFailure", () => {
  afterEach(jest.clearAllMocks);

  describe("BetLegs", () => {
    it("should call ConnectedBetLegs with proper values", () => {
      renderPriceBoostMultipleFailure({ legIds: ["LEG:1"] });

      expect(ConnectedBetLegs).toHaveBeenCalledWith(
        {
          component: BetLegs,
          isWarning: true,
          legIds: ["LEG:1"],
          renderLeg: expect.any(Function),
          onRemove: expect.any(Function),
        },
        undefined,
      );
      expect(ConnectedBetLegs).toHaveBeenCalledTimes(1);
    });

    describe("renderLeg", () => {
      it("should render ConnectedSelection", () => {
        renderPriceBoostMultipleFailure();
        render(ConnectedBetLegs.mock.calls[0][0].renderLeg("leg:1"));

        expect(ConnectedSelection).toHaveBeenCalledWith(
          { component: Selection, id: "leg:1", isReadOnly: true },
          undefined,
        );
        expect(ConnectedSelection).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("Alerts", () => {
    it("should call Alerts with correct values", () => {
      renderPriceBoostMultipleFailure();

      expect(Alerts).toHaveBeenCalledTimes(1);
      expect(Alerts).toHaveBeenCalledWith(
        { alerts: [{ type: AlertType.Error, message: "I18N.BETSLIP.PRICE_BOOST_NOT_AVAILABLE" }] },
        undefined,
      );
    });
  });

  describe("BetControls", () => {
    it("should instantiate BetControls with proper values", () => {
      renderPriceBoostMultipleFailure({
        id: "BOOST1",
        odds: "N/A",
        labels: { stake: "Stake", odds: "Odds" },
      });

      expect(BetControls).toHaveBeenCalledTimes(1);
      expect(BetControls).toHaveBeenCalledWith(
        {
          hasAccaInsurance: false,
          isAccaInsuranceSelected: false,
          isPanelDisabled: true,
          isStakeReadonly: true,
          isStakeValid: true,
          hasEachWay: false,
          id: "BOOST1",
          odds: "N/A",
          returnsLabel: "",
          displayReturns: false,
          stakeLabel: "Stake",
          oddsLabel: "Odds",
        },
        undefined,
      );
    });
  });
});
