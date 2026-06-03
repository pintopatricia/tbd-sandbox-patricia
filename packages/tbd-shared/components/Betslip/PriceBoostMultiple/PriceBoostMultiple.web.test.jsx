import { render } from "@testing-library/react";
import "jest-dom/extend-expect";

import { PriceBoostMultiple } from "./PriceBoostMultiple.web";
import ConnectedBetControls from "../BetControls";
import { BetControls } from "../BetControls/BetControls.web";
import { ConnectedBetLegs } from "../BetLegs";
import { BetLegs } from "../BetLegs/BetLegs.web";
import { ConnectedSelection } from "../Selection";
import { Selection } from "../Selection/Selection.web";

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn().mockReturnValue(<generic-icon />),
}));
jest.mock("../BetControls", () => jest.fn().mockReturnValue(<connected-bet-legs-mock />));
jest.mock("../BetControls/BetControls.web", () => ({
  BetControls: jest.fn().mockReturnValue(<bet-legs-mock />),
}));
jest.mock("../BetLegs", () => ({ ConnectedBetLegs: jest.fn().mockReturnValue(<connected-bet-legs-mock />) }));
jest.mock("../BetLegs/BetLegs.web", () => ({ BetLegs: jest.fn().mockReturnValue(<bet-legs-mock />) }));
jest.mock("../Selection", () => ({
  ConnectedSelection: jest.fn().mockReturnValue(<connected-selection-mock />),
}));
jest.mock("../Selection/Selection.web", () => ({ Selection: jest.fn().mockReturnValue(<selection-mock />) }));

function renderPriceBoostMultiple({
  id = "C:2",
  legIds = ["L:1", "L:2"],
  betType = "DOUBLE",
  shouldFocusStakeField = false,
  dispatchRemove = jest.fn(),
  betControlsExperimentVariant,
} = {}) {
  return render(
    <PriceBoostMultiple
      id={id}
      legIds={legIds}
      betType={betType}
      dispatchRemove={dispatchRemove}
      shouldFocusStakeField={shouldFocusStakeField}
      betControlsExperimentVariant={betControlsExperimentVariant}
    />,
  );
}

describe("PriceBoostMultiple", () => {
  afterEach(jest.clearAllMocks);

  describe("BetLegs", () => {
    it("should call ConnectedBetLegs with proper values", () => {
      renderPriceBoostMultiple();

      expect(ConnectedBetLegs).toHaveBeenCalledWith(
        {
          component: BetLegs,
          renderLeg: expect.any(Function),
          hasIcon: true,
          legIds: ["L:1", "L:2"],
          onRemove: expect.any(Function),
        },
        undefined,
      );
      expect(ConnectedBetLegs).toHaveBeenCalledTimes(1);
    });

    describe("renderLeg", () => {
      it("should render ConnectedSelection", () => {
        renderPriceBoostMultiple();
        render(ConnectedBetLegs.mock.calls[0][0].renderLeg("leg:1"));

        expect(ConnectedSelection).toHaveBeenCalledWith(
          { component: Selection, id: "leg:1", isReadOnly: true },
          undefined,
        );
        expect(ConnectedSelection).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("BetControls", () => {
    it("should instantiate BetControls with proper values", () => {
      renderPriceBoostMultiple({ isStakeValid: true });

      expect(ConnectedBetControls).toHaveBeenCalledTimes(1);
      expect(ConnectedBetControls).toHaveBeenCalledWith(
        {
          component: BetControls,
          combinationId: "C:2",
          shouldFocusStakeField: false,
        },
        undefined,
      );
    });
  });
  describe("betControlsExperimentVariant", () => {
    it("should render BetControls before BetLegs when betControlsExperimentVariant is 'betslip-bet-controls-on-top'", () => {
      renderPriceBoostMultiple({ betControlsExperimentVariant: "betslip-bet-controls-on-top" });

      const betLegsCallOrder = ConnectedBetLegs.mock.invocationCallOrder[0];
      const betControlsCallOrder = ConnectedBetControls.mock.invocationCallOrder[0];

      expect(betControlsCallOrder).toBeLessThan(betLegsCallOrder);
    });

    it("should render BetControls after BetLegs when betControlsExperimentVariant is not 'betslip-bet-controls-on-top'", () => {
      renderPriceBoostMultiple({ betControlsExperimentVariant: "control" });

      const betControlsCallOrder = ConnectedBetControls.mock.invocationCallOrder[0];
      const betLegsCallOrder = ConnectedBetLegs.mock.invocationCallOrder[0];

      expect(betControlsCallOrder).toBeGreaterThan(betLegsCallOrder);
    });
  });
});
