import { render } from "@testing-library/react";
import "jest-dom/extend-expect";

import { BetslipBetControls, BetslipNotifications } from "@ppb/the-wall-web";
import { AlertType } from "@ppb/the-wall-common/types";
import { PriceBoostMultipleFailure } from "./PriceBoostMultipleFailure.web";
import { ConnectedBetLegs } from "../BetLegs";
import { BetLegs } from "../BetLegs/BetLegs.web";
import { ConnectedSelection } from "../Selection";
import { Selection } from "../Selection/Selection.web";

jest.mock("@ppb/the-wall-web", () => ({
  BetslipBetControls: jest.fn().mockReturnValue(<bet-controls-mock />),
  BetslipNotifications: jest.fn().mockReturnValue(<notifications-mock />),
}));
jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn().mockReturnValue(<generic-icon />),
}));
jest.mock("../../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));
jest.mock("../BetLegs", () => ({ ConnectedBetLegs: jest.fn().mockReturnValue(<connected-bet-legs-mock />) }));
jest.mock("../BetLegs/BetLegs.web", () => ({ BetLegs: jest.fn().mockReturnValue(<bet-legs-mock />) }));
jest.mock("../Selection", () => ({
  ConnectedSelection: jest.fn().mockReturnValue(<connected-selection-mock />),
}));
jest.mock("../Selection/Selection.web", () => ({ Selection: jest.fn().mockReturnValue(<selection-mock />) }));

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

  describe("BetslipNotification", () => {
    it("should call BetslipNotifications with correct values", () => {
      renderPriceBoostMultipleFailure();

      expect(BetslipNotifications).toHaveBeenCalledTimes(1);
      expect(BetslipNotifications).toHaveBeenCalledWith(
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

      expect(BetslipBetControls).toHaveBeenCalledTimes(1);
      expect(BetslipBetControls).toHaveBeenCalledWith(
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
