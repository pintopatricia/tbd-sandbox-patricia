import { render } from "@testing-library/react-native";

import { useExperimentVariant } from "../../../experimentation/hooks/useExperimentVariant";
import ConnectedConfirmationDrawer from "../ConfirmationDrawer";
import { ConfirmationDrawer } from "../ConfirmationDrawer/ConfirmationDrawer.native";
import { RootBetslip } from "./RootBetslip.native";
import { RootBetslipContextProvider } from "./RootBetslipContext";
import { BetslipDrawer } from "./snowflakes/BetslipDrawer/BetslipDrawer.native";
import { CollapsedView } from "./snowflakes/CollapsedView/CollapsedView.native";
import ConnectedCollapsedView from "./snowflakes/CollapsedView/index";
import ConnectedQuickBetslipView from "./snowflakes/QuickBetslipView/index";

jest.mock("@ppb/tbd-router/native", () => ({
  navigateDeposit: jest.fn(),
}));

jest.mock("@flutter-global/react-native-cet-framework", () => ({
  useLogin: jest.fn(() => jest.fn()),
}));

jest.mock("@ppb/the-wall-native", () => ({
  Styled: jest.fn((props) => <styled-title {...props} />),
}));

jest.mock("./snowflakes/BetslipDrawer/BetslipDrawer.native", () => ({
  BetslipDrawer: jest.fn(() => <betslip-drawer />),
}));

jest.mock("./snowflakes/CollapsedView/CollapsedView.native", () => ({
  CollapsedView: jest.fn(() => <collapsed-view />),
}));

jest.mock("./RootBetslipContext", () => ({
  ...jest.requireActual("./RootBetslipContext"),
  RootBetslipContextProvider: jest.fn(({ children }) => (
    <root-betslip-context-provider-mock>{children}</root-betslip-context-provider-mock>
  )),
}));

jest.mock("../ConfirmationDrawer", () => ({
  __esModule: true,
  default: jest.fn((props) => <connected-confirmation-drawer {...props} />),
}));

jest.mock("../ConfirmationDrawer/ConfirmationDrawer.native", () => ({
  ConfirmationDrawer: jest.fn(() => <confirmation-drawer />),
}));

jest.mock("../../../helpers/i18n", () => ({ i18n: jest.fn(({ key }) => key) }));

jest.mock("../Keyboard/KeyboardContext", () => ({
  KeyboardProvider: jest.fn(({ children, props }) => (
    <keyboard-provider-mock {...props}>{children}</keyboard-provider-mock>
  )),
}));

jest.mock("./snowflakes/CollapsedView/index", () => jest.fn(() => <connected-collapsed-view />));

jest.mock("./snowflakes/QuickBetslipView/index", () => jest.fn(() => <connected-quick-betslip-view />));

jest.mock("../../../experimentation/hooks/useExperimentVariant", () => ({
  useExperimentVariant: jest.fn(() => "experiment-variant-mock"),
}));

function renderRootBetslip({
  quickBetslipBet,
  hasMultiples = false,
  hasConfirmation = false,
  isClosed = false,
  isCollapsed = false,
  activeProduct = "SPORTSBOOK",
  activeBetslipType = "SPORTSBOOK",
  step = "PLACE_POTENTIAL",
  dispatchHeaderToggle,
  dispatchDismissClick,
} = {}) {
  return render(
    <RootBetslip
      quickBetslipBet={quickBetslipBet}
      hasMultiples={hasMultiples}
      hasConfirmation={hasConfirmation}
      isClosed={isClosed}
      isCollapsed={isCollapsed}
      activeProduct={activeProduct}
      step={step}
      activeBetslipType={activeBetslipType}
      dispatchHeaderToggle={dispatchHeaderToggle}
      dispatchDismissClick={dispatchDismissClick}
    />,
  );
}

beforeEach(() => jest.clearAllMocks());

describe("RootBetslip", () => {
  describe("initialisation", () => {
    it("should call RootBetslipContextProvider with isCollapsed state", () => {
      renderRootBetslip({ isCollapsed: true });

      expect(RootBetslipContextProvider).toHaveBeenCalledWith(
        expect.objectContaining({
          isCollapsed: true,
        }),
        undefined,
      );
      expect(RootBetslipContextProvider).toHaveBeenCalledTimes(1);
    });
  });

  describe("when it is closed", () => {
    it("should not render BetlipDrawer", () => {
      renderRootBetslip({ isClosed: true });

      expect(BetslipDrawer).not.toHaveBeenCalled();
    });

    it("should not render CollapsedView", () => {
      renderRootBetslip({ isClosed: true });

      expect(CollapsedView).not.toHaveBeenCalled();
    });
  });

  describe("when activeProduct", () => {
    describe("is None", () => {
      it("should not render BetlipDrawer", () => {
        renderRootBetslip({ activeProduct: "NONE" });

        expect(BetslipDrawer).not.toHaveBeenCalled();
      });

      it("should not render CollapsedView", () => {
        renderRootBetslip({ activeProduct: "NONE" });

        expect(CollapsedView).not.toHaveBeenCalled();
      });
    });

    describe("is Exchange", () => {
      it("should not render BetlipDrawer", () => {
        renderRootBetslip({ activeProduct: "EXCHANGE" });

        expect(BetslipDrawer).not.toHaveBeenCalled();
      });

      it("should not render CollapsedView", () => {
        renderRootBetslip({ activeProduct: "EXCHANGE" });

        expect(CollapsedView).not.toHaveBeenCalled();
      });
    });

    describe("is Sportsbook", () => {
      describe("when there is a confirmation pending", () => {
        it("should call ConnectedConfirmationDrawer", () => {
          renderRootBetslip({
            activeProduct: "SPORTSBOOK",
            hasConfirmation: true,
          });

          expect(ConnectedConfirmationDrawer).toHaveBeenCalledWith(
            {
              component: ConfirmationDrawer,
            },
            undefined,
          );
          expect(ConnectedConfirmationDrawer).toHaveBeenCalledTimes(1);
        });
      });

      describe("when there is no confirmation pending", () => {
        it("should not call ConnectedConfirmationDrawer", () => {
          renderRootBetslip({
            activeProduct: "SPORTSBOOK",
            hasConfirmation: false,
          });

          expect(ConnectedConfirmationDrawer).not.toHaveBeenCalled();
        });
      });

      describe("and isCollapsed is true", () => {
        describe("and quickBetslipBet is not provided", () => {
          it("should render CollapsedView", () => {
            renderRootBetslip({ activeProduct: "SPORTSBOOK", isCollapsed: true });

            expect(ConnectedCollapsedView).toHaveBeenCalledWith(
              {
                component: expect.any(Function),
                onClick: expect.any(Function),
              },
              undefined,
            );

            expect(ConnectedCollapsedView).toHaveBeenCalledTimes(1);
          });
        });

        describe("and quickBetslipBet is provided", () => {
          describe("and quick-betslip experiment variant is quick-betslip-variant-a", () => {
            beforeEach(() => {
              useExperimentVariant.mockImplementation((experimentName) => {
                if (experimentName === "quick-betslip") {
                  return "quick-betslip-variant-a";
                }
                return "experiment-variant-mock";
              });
            });

            it("should render QuickBetslipView", () => {
              renderRootBetslip({
                activeProduct: "SPORTSBOOK",
                isCollapsed: true,
                quickBetslipBet: { status: "valid", combinationId: "COMB:1" },
              });

              expect(useExperimentVariant).toHaveBeenCalledWith("quick-betslip");

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

            it("should not render CollapsedView neither BetslipDrawer", () => {
              renderRootBetslip({
                activeProduct: "SPORTSBOOK",
                isCollapsed: true,
                quickBetslipBet: { status: "valid", combinationId: "COMB:1" },
              });

              expect(ConnectedCollapsedView).not.toHaveBeenCalled();
              expect(BetslipDrawer).not.toHaveBeenCalled();
            });
          });

          describe("and quick-betslip experiment variant is not quick-betslip-variant-a", () => {
            beforeEach(() => {
              useExperimentVariant.mockImplementation((experimentName) => {
                if (experimentName === "quick-betslip") {
                  return "control";
                }
                return "experiment-variant-mock";
              });
            });

            it("should not render QuickBetslipView", () => {
              renderRootBetslip({
                activeProduct: "SPORTSBOOK",
                isCollapsed: true,
                quickBetslipBet: { status: "valid", combinationId: "COMB:1" },
              });

              expect(useExperimentVariant).toHaveBeenCalledWith("quick-betslip");
              expect(ConnectedQuickBetslipView).not.toHaveBeenCalled();
            });

            it("should render CollapsedView as fallback", () => {
              renderRootBetslip({
                activeProduct: "SPORTSBOOK",
                isCollapsed: true,
                quickBetslipBet: { status: "valid", combinationId: "COMB:1" },
              });

              expect(ConnectedCollapsedView).toHaveBeenCalledWith(
                expect.objectContaining({
                  component: expect.any(Function),
                  onClick: expect.any(Function),
                }),
                undefined,
              );
            });
          });

          describe("and quickBetslipBet has fallback status", () => {
            beforeEach(() => {
              useExperimentVariant.mockImplementation((experimentName) => {
                if (experimentName === "quick-betslip") {
                  return "quick-betslip-variant-a";
                }
                return "experiment-variant-mock";
              });
            });

            it("should render CollapsedView for invalid_combination fallback", () => {
              renderRootBetslip({
                activeProduct: "SPORTSBOOK",
                isCollapsed: true,
                quickBetslipBet: { status: "fallback", reason: "invalid_combination" },
              });

              expect(ConnectedQuickBetslipView).not.toHaveBeenCalled();
              expect(ConnectedCollapsedView).toHaveBeenCalledTimes(1);
            });

            it("should render CollapsedView for non_football fallback", () => {
              renderRootBetslip({
                activeProduct: "SPORTSBOOK",
                isCollapsed: true,
                quickBetslipBet: { status: "fallback", reason: "non_football" },
              });

              expect(ConnectedQuickBetslipView).not.toHaveBeenCalled();
              expect(ConnectedCollapsedView).toHaveBeenCalledTimes(1);
            });
          });
        });
      });

      describe("and isCollapsed is false", () => {
        describe("and the activeBetslipType is OBB", () => {
          it("should render BetslipDrawer with OBB Betslip title", () => {
            renderRootBetslip({ activeProduct: "SPORTSBOOK", isCollapsed: false, activeBetslipType: "OBB" });

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
          it("should render BetslipDrawer with Betslip title", () => {
            renderRootBetslip({ activeProduct: "SPORTSBOOK", isCollapsed: false });

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
  });

  describe("RootBetslip toggle", () => {
    describe("when step is REPORT", () => {
      it("should call dispatchDismissClick", () => {
        const dispatchHeaderToggleSpy = jest.fn();
        const dispatchDismissClickSpy = jest.fn();
        renderRootBetslip({
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

    describe("any other step", () => {
      it("should call dispatchHeaderToggle", () => {
        const dispatchHeaderToggleSpy = jest.fn();
        const dispatchDismissClickSpy = jest.fn();
        renderRootBetslip({
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
