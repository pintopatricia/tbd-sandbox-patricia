import { render } from "@testing-library/react";

import { ModalBetslip } from "./ModalBetslip.web";
import { BetslipDrawer } from "../snowflakes/BetslipDrawer/BetslipDrawer.web";
import ConnectedCollapsedView from "../snowflakes/CollapsedView";
import { CollapsedView } from "../snowflakes/CollapsedView/CollapsedView.web";
import ConnectedConfirmationDrawer from "../../ConfirmationDrawer";
import { ConfirmationDrawer } from "../../ConfirmationDrawer/ConfirmationDrawer.web";
import ConnectedQuickBetslipView from "../snowflakes/QuickBetslipView";
import { useExperimentVariant } from "../../../../experimentation/hooks/useExperimentVariant";

jest.mock("../snowflakes/BetslipDrawer/BetslipDrawer.web", () => ({
  BetslipDrawer: jest.fn(() => <betslip-drawer />),
}));

jest.mock("../../../../experimentation/hooks/useExperimentVariant", () => ({
  useExperimentVariant: jest.fn(() => "experiment-variant-mock"),
}));

jest.mock("../snowflakes/CollapsedView", () => jest.fn(() => <connected-collapsed-view />));

jest.mock("../snowflakes/QuickBetslipView", () => jest.fn(() => <connected-quick-betslip-view />));

jest.mock("../snowflakes/CollapsedView/CollapsedView.web", () => ({
  CollapsedView: jest.fn(() => <collapsed-view />),
}));

jest.mock("../../ConfirmationDrawer", () => ({
  __esModule: true,
  default: jest.fn((props) => <connected-confirmation-drawer {...props} />),
}));

jest.mock("../../ConfirmationDrawer/ConfirmationDrawer.web", () => ({
  ConfirmationDrawer: jest.fn(() => <confirmation-drawer />),
}));

jest.mock("../../../../helpers/i18n", () => ({ i18n: jest.fn(({ key }) => key) }));

function renderModalBetslip({
  hasMultiples = false,
  hasConfirmation = false,
  activeProduct = "SPORTSBOOK",
  step = "PLACE_POTENTIAL",
  isClosed = false,
  isCollapsed = false,
  activeBetslipType = "SPORTSBOOK",
  quickBetslipBet = null,
  dispatchHeaderToggle,
  dispatchDismissClick,
} = {}) {
  return render(
    <ModalBetslip
      hasMultiples={hasMultiples}
      hasConfirmation={hasConfirmation}
      activeProduct={activeProduct}
      step={step}
      isClosed={isClosed}
      isCollapsed={isCollapsed}
      activeBetslipType={activeBetslipType}
      quickBetslipBet={quickBetslipBet}
      dispatchHeaderToggle={dispatchHeaderToggle}
      dispatchDismissClick={dispatchDismissClick}
    />,
  );
}
beforeEach(() => jest.clearAllMocks());
describe("Modal Betslip", () => {
  describe("when is closed", () => {
    it("should not render betslip drawer component", () => {
      renderModalBetslip({ isClosed: true });

      expect(BetslipDrawer).not.toHaveBeenCalled();
    });
    it("should not render collapsed view component", () => {
      renderModalBetslip({ isClosed: true });

      expect(CollapsedView).not.toHaveBeenCalled();
    });
  });

  describe("activeProduct", () => {
    describe("is NONE", () => {
      it("should not render betslip drawer component", () => {
        renderModalBetslip({ activeProduct: "NONE" });

        expect(BetslipDrawer).not.toHaveBeenCalled();
      });
      it("should not render collapsed view component", () => {
        renderModalBetslip({ activeProduct: "NONE" });

        expect(CollapsedView).not.toHaveBeenCalled();
      });
    });

    describe("is EXCHANGE", () => {
      it("should not render betslip drawer component", () => {
        renderModalBetslip({ activeProduct: "EXCHANGE" });

        expect(BetslipDrawer).not.toHaveBeenCalled();
      });
      it("should not render collapsed view component", () => {
        renderModalBetslip({ activeProduct: "EXCHANGE" });

        expect(CollapsedView).not.toHaveBeenCalled();
      });
    });
    describe("is SPORTSBOOK", () => {
      describe("when there is a pending confirmation", () => {
        it("should render ConnectedConfirmationDrawer", () => {
          renderModalBetslip({ activeProduct: "SPORTSBOOK", hasConfirmation: true });

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
          renderModalBetslip({ activeProduct: "SPORTSBOOK", hasConfirmation: false });

          expect(ConnectedConfirmationDrawer).not.toHaveBeenCalled();
        });
      });

      describe("isCollapsed is true", () => {
        it("should render CollapsedView component", () => {
          renderModalBetslip({ isCollapsed: true });

          expect(ConnectedCollapsedView).toHaveBeenCalledWith(
            {
              component: expect.any(Function),
              hasMultiples: false,
              onClick: expect.any(Function),
            },
            undefined,
          );

          expect(ConnectedCollapsedView).toHaveBeenCalledTimes(1);
        });

        describe("and quickBetslipBet is provided", () => {
          describe("and quick-betslip experiment variant is quick-betslip-variant-a", () => {
            it("should render ConnectedQuickBetslipView component", () => {
              useExperimentVariant.mockImplementation((experimentName) => {
                if (experimentName === "quick-betslip") {
                  return "quick-betslip-variant-a";
                }
                return "experiment-variant-mock";
              });

              const quickBetslipBet = { status: "valid", combinationId: "COMB:1" };
              renderModalBetslip({ isCollapsed: true, quickBetslipBet });

              expect(ConnectedQuickBetslipView).toHaveBeenCalledWith(
                {
                  component: expect.any(Function),
                  combinationId: "COMB:1",
                  onClick: expect.any(Function),
                },
                undefined,
              );
              expect(ConnectedQuickBetslipView).toHaveBeenCalledTimes(1);
            });
          });

          it("should call useExperimentVariant with quick-betslip", () => {
            const quickBetslipBet = { status: "valid", combinationId: "COMB:1" };
            renderModalBetslip({ isCollapsed: true, quickBetslipBet });

            expect(useExperimentVariant).toHaveBeenCalledWith("quick-betslip");
          });

          describe("and quick-betslip experiment variant is not quick-betslip-variant-a", () => {
            it("should render CollapsedView instead of ConnectedQuickBetslipView", () => {
              useExperimentVariant.mockImplementation((experimentName) => {
                if (experimentName === "quick-betslip") {
                  return "control";
                }
                return "experiment-variant-mock";
              });

              const quickBetslipBet = { status: "valid", combinationId: "COMB:1" };
              renderModalBetslip({ isCollapsed: true, quickBetslipBet });

              expect(ConnectedQuickBetslipView).not.toHaveBeenCalled();
              expect(ConnectedCollapsedView).toHaveBeenCalledTimes(1);
            });
          });

          describe("and quickBetslipBet has fallback status", () => {
            it("should render CollapsedView instead of ConnectedQuickBetslipView for invalid_combination", () => {
              useExperimentVariant.mockImplementation((experimentName) => {
                if (experimentName === "quick-betslip") {
                  return "quick-betslip-variant-a";
                }
                return "experiment-variant-mock";
              });

              const quickBetslipBet = { status: "fallback", reason: "invalid_combination" };
              renderModalBetslip({ isCollapsed: true, quickBetslipBet });

              expect(ConnectedQuickBetslipView).not.toHaveBeenCalled();
              expect(ConnectedCollapsedView).toHaveBeenCalledTimes(1);
            });

            it("should render CollapsedView instead of ConnectedQuickBetslipView for non_football", () => {
              useExperimentVariant.mockImplementation((experimentName) => {
                if (experimentName === "quick-betslip") {
                  return "quick-betslip-variant-a";
                }
                return "experiment-variant-mock";
              });

              const quickBetslipBet = { status: "fallback", reason: "non_football" };
              renderModalBetslip({ isCollapsed: true, quickBetslipBet });

              expect(ConnectedQuickBetslipView).not.toHaveBeenCalled();
              expect(ConnectedCollapsedView).toHaveBeenCalledTimes(1);
            });
          });
        });
      });

      describe("isCollapsed is false", () => {
        describe("and quickBetslipBet is provided", () => {
          it("should not render ConnectedQuickBetslipView when step is not REPORT", () => {
            const quickBetslipBet = { status: "valid", combinationId: "COMB:1" };
            renderModalBetslip({ isCollapsed: false, quickBetslipBet });

            expect(ConnectedQuickBetslipView).not.toHaveBeenCalled();
          });

          it("should not render ConnectedQuickBetslipView when step is REPORT", () => {
            const quickBetslipBet = { status: "valid", combinationId: "COMB:1" };
            renderModalBetslip({ isCollapsed: false, quickBetslipBet, step: "REPORT" });

            expect(ConnectedQuickBetslipView).not.toHaveBeenCalled();
          });
        });

        describe("and the activeBetslipType is OBB", () => {
          it("should render BetslipDrawer with betslip obb title", () => {
            renderModalBetslip({ activeBetslipType: "OBB", isCollapsed: false });

            expect(BetslipDrawer).toHaveBeenCalledWith(
              {
                title: "I18N.OBB_BETSLIP.TITLE",
                step: "PLACE_POTENTIAL",
                activeBetslipType: "OBB",
                onClose: expect.any(Function),
              },
              undefined,
            );
            expect(BetslipDrawer).toHaveBeenCalledTimes(1);
          });
        });

        describe("and the activeBetslipType is not OBB", () => {
          it("should render BetslipDrawer with betslip title", () => {
            renderModalBetslip({ activeBetslipType: "SPORTSBOOK", isCollapsed: false });

            expect(BetslipDrawer).toHaveBeenCalledWith(
              {
                title: "I18N.BETSLIP.TITLE",
                step: "PLACE_POTENTIAL",
                activeBetslipType: "SPORTSBOOK",
                onClose: expect.any(Function),
              },
              undefined,
            );
            expect(BetslipDrawer).toHaveBeenCalledTimes(1);
          });
        });
      });
    });

    describe("ModalBetslip toggle", () => {
      describe("when step is REPORT", () => {
        it("should call dispatchDismissClick", () => {
          const dispatchHeaderToggleSpy = jest.fn();
          const dispatchDismissClickSpy = jest.fn();

          renderModalBetslip({
            step: "REPORT",
            dispatchHeaderToggle: dispatchHeaderToggleSpy,
            dispatchDismissClick: dispatchDismissClickSpy,
          });

          const { onClose } = BetslipDrawer.mock.calls[0][0];
          onClose();

          expect(dispatchDismissClickSpy).toHaveBeenCalledTimes(1);
          expect(dispatchHeaderToggleSpy).not.toHaveBeenCalled();
        });
      });

      describe("when step is not REPORT", () => {
        it("should call dispatchHeaderToggle", () => {
          const dispatchHeaderToggleSpy = jest.fn();
          const dispatchDismissClickSpy = jest.fn();

          renderModalBetslip({
            step: "PLACE_POTENTIAL",
            dispatchHeaderToggle: dispatchHeaderToggleSpy,
            dispatchDismissClick: dispatchDismissClickSpy,
          });

          const { onClose } = BetslipDrawer.mock.calls[0][0];
          onClose();

          expect(dispatchHeaderToggleSpy).toHaveBeenCalledWith(false, expect.any(String));
          expect(dispatchHeaderToggleSpy).toHaveBeenCalledTimes(1);
          expect(dispatchDismissClickSpy).not.toHaveBeenCalled();
        });
      });
    });
  });
});
