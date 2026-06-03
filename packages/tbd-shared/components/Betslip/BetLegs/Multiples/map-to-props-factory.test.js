import { UI__BETSLIP_ACCORDION_HEADER_CLICK } from "@ppb/tbd-store/actions/betslip";
import { createGetSelectionIdsSelector } from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";

import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";
import { i18n } from "../../../../helpers/i18n";
import {
  createGetConfirmationSelectionIdsSelector,
  createIsConfirmStep,
} from "../../sportsbook-betslip-confirm-mapper";

const betLegsMock = ["leg1", "leg2", "leg3", "ONE_LINE_BET"];

jest.mock("@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors", () => ({
  createGetSelectionIdsSelector: jest.fn(() => jest.fn(() => betLegsMock)),
}));

jest.mock("../../../../helpers/i18n", () => ({
  i18n: jest.fn(({ key, interpolationValues }) => (interpolationValues ? { key, interpolationValues } : key)),
}));

jest.mock("../../sportsbook-betslip-confirm-mapper", () => ({
  createGetConfirmationSelectionIdsSelector: jest.fn(() => jest.fn(() => [betLegsMock[0], betLegsMock[2]])),
  createIsConfirmStep: jest.fn(() => jest.fn(() => false)),
}));

const legsMock = {
  leg1: {
    id: "leg1",
  },
  leg2: {
    id: "leg2",
  },
  leg3: {
    id: "leg3",
  },
};

describe("Bet Legs/Multiples Connected Component", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("makeMapStateToProps", () => {
    function setup({
      legIds = undefined,
      legs = {},
      createGetSelectionIdsSelectorSpy = jest.fn(() => betLegsMock),
      createGetConfirmationSelectionIdsSelectorSpy = jest.fn(),
      createIsConfirmStepSpy = jest.fn(() => false),
    } = {}) {
      createGetSelectionIdsSelector.mockReturnValue(createGetSelectionIdsSelectorSpy);
      createGetConfirmationSelectionIdsSelector.mockReturnValue(createGetConfirmationSelectionIdsSelectorSpy);
      createIsConfirmStep.mockReturnValue(createIsConfirmStepSpy);

      return makeMapStateToProps()(
        {
          betting: {
            sportsbookBetting: {
              legs,
            },
          },
          betslip: {
            sportsbookConfirmation: {
              legs,
            },
          },
        },
        { legIds },
      );
    }

    it("should return translated title", () => {
      i18n.mockReturnValue("some title");

      const { title } = setup();

      expect(i18n).toHaveBeenCalledWith({
        key: "I18N.BETSLIP.SELECTIONS_COUNT",
        interpolationValues: {
          numberOfSelections: "3",
        },
      });
      expect(i18n).toHaveBeenCalledTimes(1);
      expect(title).toBe("some title");
    });

    describe("when step is not confirm potential", () => {
      describe("and legIds is not given", () => {
        it("should return legIds from betting state", () => {
          const getSelectionIdsSpy = jest.fn(() => betLegsMock);
          const { legIds } = setup({ legs: legsMock, createGetSelectionIdsSelectorSpy: getSelectionIdsSpy });

          expect(getSelectionIdsSpy).toHaveBeenCalledTimes(1);
          expect(getSelectionIdsSpy).toHaveBeenCalledWith(legsMock);
          expect(legIds).toEqual(betLegsMock.slice(0, 3));
        });
      });

      describe("and legIds are given", () => {
        it("should return legIds from given from container prop", () => {
          const getSelectionIdsSpy = jest.fn(() => betLegsMock);
          const { legIds } = setup(
            { legs: legsMock, createGetSelectionIdsSelectorSpy: getSelectionIdsSpy },
            { legIds: ["leg:4", "leg:5"] },
          );

          expect(getSelectionIdsSpy).toHaveBeenCalledTimes(1);
          expect(getSelectionIdsSpy).toHaveBeenCalledWith(legsMock);
          expect(legIds).toEqual(betLegsMock.slice(0, 3));
        });
      });
    });

    describe("when step is confirm potential", () => {
      it("should return legIds from betslip confirmation state", () => {
        const stateMock = {
          betting: {
            sportsbookBetting: {
              legs: {
                leg1: legsMock.leg1,
                leg3: legsMock.leg3,
              },
            },
          },
          betslip: {
            sportsbookConfirmation: {
              legs: {
                leg1: legsMock.leg1,
                leg3: legsMock.leg3,
              },
            },
          },
        };
        const getSelectionIdsSpy = jest.fn();
        const getConfirmSelectionIdsSpy = jest.fn(() => [betLegsMock[0], betLegsMock[2]]);
        const isConfirmStepSpy = jest.fn(() => true);
        const { legIds } = setup({
          legs: {
            leg1: legsMock.leg1,
            leg3: legsMock.leg3,
          },
          createGetSelectionIdsSelectorSpy: getSelectionIdsSpy,
          createGetConfirmationSelectionIdsSelectorSpy: getConfirmSelectionIdsSpy,
          createIsConfirmStepSpy: isConfirmStepSpy,
        });

        expect(getConfirmSelectionIdsSpy).toHaveBeenNthCalledWith(1, stateMock);
        expect(getSelectionIdsSpy).not.toHaveBeenCalled();
        expect(legIds).toEqual([betLegsMock[0], betLegsMock[2]]);
      });
    });
  });

  describe("mapDispatchToProps", () => {
    describe("dispatchCollapseToggle", () => {
      it("should dispatch UI__BETSLIP_ACCORDION_HEADER_CLICK with isExpanded state", () => {
        const dispatchSpy = jest.fn();
        const { dispatchCollapseToggle } = mapDispatchToProps(dispatchSpy);

        dispatchCollapseToggle(true);

        expect(dispatchSpy).toHaveBeenCalledWith({
          type: UI__BETSLIP_ACCORDION_HEADER_CLICK,
          payload: {
            isExpanded: true,
          },
        });
        expect(dispatchSpy).toHaveBeenCalledTimes(1);
      });
    });
  });
});
