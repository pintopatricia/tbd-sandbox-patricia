import { render } from "@testing-library/react-native";

import { PriceBoostMultiple } from "./PriceBoostMultiple.native";
import ConnectedBetControls from "../BetControls";
import { BetControls } from "../BetControls/BetControls.native";
import { ConnectedBetLegs } from "../BetLegs";
import { BetLegs } from "../BetLegs/BetLegs.native";
import { ConnectedSelection } from "../Selection";
import { Selection } from "../Selection/Selection.native";

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon-mock />),
}));
jest.mock("../BetControls", () => jest.fn(() => <connected-bet-legs-mock />));
jest.mock("../BetControls/BetControls.native", () => ({
  BetControls: jest.fn(() => <bet-legs-mock />),
}));
jest.mock("../BetLegs", () => ({ ConnectedBetLegs: jest.fn(() => <connected-bet-legs-mock />) }));
jest.mock("../BetLegs/BetLegs.native", () => ({ BetLegs: jest.fn(() => <bet-legs-mock />) }));
jest.mock("../Selection", () => ({
  ConnectedSelection: jest.fn(() => <connected-selection-mock />),
}));
jest.mock("../Selection/Selection.native", () => ({ Selection: jest.fn(() => <selection-mock />) }));

function renderPriceBoostMultiple({
  id = "C:2",
  legIds = ["L:1", "L:2"],
  title = "DOUBLE",
  shouldFocusStakeField = false,
  dispatchRemove = jest.fn(),
  betControlsExperimentVariant,
} = {}) {
  return render(
    <PriceBoostMultiple
      id={id}
      legIds={legIds}
      title={title}
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
          legIds: ["L:1", "L:2"],
          hasIcon: true,
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
          title: "DOUBLE",
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
