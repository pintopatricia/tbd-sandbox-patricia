import { UI__BETSLIP_ACCORDION_HEADER_CLICK } from "@ppb/tbd-store/actions/betslip";
import {
  getSportsbookBettingImplyRunnerFailures,
  getSportsbookBettingLegs,
} from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { getSportsbookConfirmationLegs } from "@ppb/tbd-store/state/betslip/betslip-card-selectors";

import { i18n } from "../../../../helpers/i18n";
import { hasAnyInvalidSGMCombinationFailure } from "../../connected-sportsbook-betslip-mapper";
import { createIsConfirmStep } from "../../sportsbook-betslip-confirm-mapper";

import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

jest.mock("../../../../helpers/i18n");
jest.mock("../../connected-sportsbook-betslip-mapper");
jest.mock("@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors", () => ({
  getSportsbookBettingLegs: jest.fn().mockReturnValue({}),
  getSportsbookBettingImplyRunnerFailures: jest.fn().mockReturnValue({}),
}));
jest.mock("@ppb/tbd-store/state/betslip/betslip-card-selectors", () => ({
  getSportsbookConfirmationLegs: jest.fn().mockReturnValue({}),
}));
jest.mock("../../sportsbook-betslip-confirm-mapper", () => ({
  createIsConfirmStep: jest.fn().mockReturnValue(jest.fn()),
}));

describe("Bet Legs/Bet Builder Connected Component", () => {
  beforeEach(jest.clearAllMocks);

  describe("makeMapStateToProps", () => {
    describe("when there's no leg ids", () => {
      describe("title", () => {
        it("should be an empty string", () => {
          const props = makeMapStateToProps()({}, {});

          expect(props.title).toEqual("");
        });
      });

      describe("legIds", () => {
        it("should be an empty array", () => {
          const props = makeMapStateToProps()({}, {});

          expect(props.legIds).toEqual([]);
        });
      });
    });

    describe("when there's leg ids", () => {
      describe("title", () => {
        describe("when there is a warning", () => {
          it("should be a translated warning title", () => {
            i18n.mockReturnValueOnce("mocked warning title");
            const props = makeMapStateToProps()({}, { legIds: ["1", "2", "3", "4", "5"], isWarning: true });

            expect(i18n).toHaveBeenCalledWith({
              key: "I18N.BETSLIP.NOT_COMBINABLE",
            });
            expect(i18n).toHaveBeenCalledTimes(1);
            expect(props.title).toEqual("mocked warning title");
          });
        });

        describe("when there is no warning", () => {
          it("should be a translated default title", () => {
            i18n.mockReturnValueOnce("mocked title");
            const props = makeMapStateToProps()({}, { legIds: ["1", "2", "3", "4", "5"] });

            expect(i18n).toHaveBeenCalledWith({
              key: "I18N.BETSLIP.SELECTIONS_COUNT",
              interpolationValues: { numberOfSelections: "5" },
            });
            expect(i18n).toHaveBeenCalledTimes(1);
            expect(props.title).toEqual("mocked title");
          });
        });
      });

      describe("description", () => {
        describe("when there is an invalid sgm combination", () => {
          it("should return a description", () => {
            i18n.mockReturnValueOnce("mocked warning title");
            i18n.mockReturnValueOnce("not combinable description");
            getSportsbookBettingLegs.mockReturnValue({
              1: {
                runners: ["R:1"],
              },
            });
            getSportsbookBettingImplyRunnerFailures.mockReturnValue({
              "R:1": [{ failureCode: "INVALID_SGM_COMBINATION" }],
            });
            hasAnyInvalidSGMCombinationFailure.mockReturnValue(true);
            const props = makeMapStateToProps()({}, { legIds: ["1"] });

            expect(i18n).toHaveBeenCalledWith({
              key: "I18N.BETSLIP.NOT_COMBINABLE_SELECTIONS_DESCRIPTION",
            });
            expect(props.description).toEqual("not combinable description");
          });
        });
      });

      describe("legIds", () => {
        it("should equal the leg ids provided", () => {
          const props = makeMapStateToProps()({}, { legIds: ["1", "2", "3", "4", "5"] });

          expect(props.legIds).toEqual(["1", "2", "3", "4", "5"]);
        });
      });
    });

    describe("when the step is bet confirmation", () => {
      it("should get the legs data from betslipe state", () => {
        const legMock = {
          1: {
            runners: ["R:1"],
          },
        };

        createIsConfirmStep.mockReturnValue(jest.fn(() => true));
        const getSportsbookBettingLegsSpy = getSportsbookBettingLegs.mockReturnValue(legMock);
        const getSportsbookConfirmationLegsSpy = getSportsbookConfirmationLegs.mockReturnValue(legMock);

        makeMapStateToProps()({}, { legIds: ["1"] });

        expect(getSportsbookConfirmationLegsSpy).toHaveBeenCalled();
        expect(getSportsbookConfirmationLegsSpy).toHaveBeenCalledTimes(1);
        expect(getSportsbookBettingLegsSpy).not.toHaveBeenCalled();
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
