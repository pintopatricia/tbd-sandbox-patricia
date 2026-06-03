import {
  BETTING__SBK_DEPOSIT_SUCCESSFUL,
  BETTING__EXC_PLACE_DEPOSIT_SUCCESSFUL,
  BETTING__EXC_EDIT_DEPOSIT_SUCCESSFUL,
} from "@ppb/tbd-store/actions/betting";

import { makeMapStateToProps, makeMapDispatchToProps } from "./map-to-props-factory";

jest.mock("../../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.mock("@ppb/tbd-store/state/entities/user-wallets/user-wallets-selectors", () => ({
  getUserWallets: jest.fn(() => () => {}),
}));

beforeEach(jest.clearAllMocks);

describe("makeMapStateToProps", () => {
  const setup = ({ betslipState = {} } = {}) => {
    const appState = {
      betslip: {
        ...betslipState,
      },
    };
    return makeMapStateToProps()(appState);
  };

  describe("isDepositRedirect", () => {
    it("should return isDepositRedirect value", () => {
      const { isDepositRedirect } = setup({ betslipState: { isDepositRedirect: true } });

      expect(isDepositRedirect).toEqual(true);
    });
  });

  describe("labels", () => {
    it("should return labels", () => {
      const { labels } = setup();

      expect(labels.depositSuccessful).toEqual("I18N.DEPOSIT.DEPOSIT_SUCCESSFUL");
      expect(labels.placingBet).toEqual("I18N.BETSLIP.PLACING_BET");
    });
  });
});

describe("mapDispatchToProps", () => {
  const dispatchSpy = jest.fn();

  describe("dispatchSbkDepositSuccessful", () => {
    it("should dispatch sbk deposit successful action", () => {
      const { dispatchSbkDepositSuccessful } = makeMapDispatchToProps(dispatchSpy);

      dispatchSbkDepositSuccessful();

      expect(dispatchSpy).toHaveBeenCalledWith({
        type: BETTING__SBK_DEPOSIT_SUCCESSFUL,
      });
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("dispatchExcDepositSuccessful", () => {
    describe("when origin is PLACE_POTENTIAL", () => {
      it("should dispatch exc place deposit successful action", () => {
        const { dispatchExcDepositSuccessful } = makeMapDispatchToProps(dispatchSpy);

        dispatchExcDepositSuccessful("PLACE_POTENTIAL", "runner");

        expect(dispatchSpy).toHaveBeenCalledWith({
          type: BETTING__EXC_PLACE_DEPOSIT_SUCCESSFUL,
          payload: { runner: "runner" },
        });
        expect(dispatchSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe("when origin is CONFIRM_POTENTIAL", () => {
      it("should dispatch exc place deposit successful action", () => {
        const { dispatchExcDepositSuccessful } = makeMapDispatchToProps(dispatchSpy);

        dispatchExcDepositSuccessful("CONFIRM_POTENTIAL", "runner");

        expect(dispatchSpy).toHaveBeenCalledWith({
          type: BETTING__EXC_PLACE_DEPOSIT_SUCCESSFUL,
          payload: { runner: "runner" },
        });
        expect(dispatchSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe("when origin is EDIT_UNMATCHED", () => {
      it("should dispatch exc edit deposit successful action", () => {
        const { dispatchExcDepositSuccessful } = makeMapDispatchToProps(dispatchSpy);

        dispatchExcDepositSuccessful("EDIT_UNMATCHED", "runner", "market", "betId");

        expect(dispatchSpy).toHaveBeenCalledWith({
          type: BETTING__EXC_EDIT_DEPOSIT_SUCCESSFUL,
          payload: { runner: "runner", market: "market", betId: "betId" },
        });
        expect(dispatchSpy).toHaveBeenCalledTimes(1);
      });
    });
  });
});
