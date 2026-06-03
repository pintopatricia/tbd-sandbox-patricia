import { render, act } from "@testing-library/react";
import { KeyboardSeparator } from "@ppb/the-wall-common/types";
import { BetslipBetControls } from "@ppb/the-wall-web";
import "jest-dom/extend-expect";
import { ObbBetControls } from "./ObbBetControls.web";
import { KeyboardContext } from "../Keyboard/KeyboardContext";
import { ConfigContext } from "../../Config/ConfigContext";

jest.mock("@ppb/the-wall-web", () => ({
  BetslipBetControls: jest.fn(() => <betslip-bet-controls />),
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useId: () => "unique-id",
}));

const KeyboardContextProviderMock = ({
  children,
  focusedKeyboardControls = {
    focusedInputId: null,
    focusedInputRef: null,
    focusedTargetRef: null,
  },
  setFocusedKeyboardControls = jest.fn(),
}) => (
  <KeyboardContext.Provider value={{ focusedKeyboardControls, setFocusedKeyboardControls }}>
    {children}
  </KeyboardContext.Provider>
);

const ConfigContextProviderMock = ({ isDesktopLayout, children }) => (
  <ConfigContext.Provider value={{ isDesktopLayout }}>{children}</ConfigContext.Provider>
);

const DEFAULT_PROPS = {
  i18n: {
    odds: "odds",
    stake: "stake",
    startingPriceTitle: "startingPriceTitle",
    returns: "returns",
    oddsMovementUp: "oddsMovementUp",
    oddsMovementDown: "oddsMovementDown",
  },
  shouldFocusStakeField: undefined,
  potentialBetId: "potentialBet:urn:1",
  odds: "3/4",
  stake: 15,
  currencySymbol: "$",
  isPanelDisabled: false,
  formattedPotentialReturns: "15.00$",
  separator: KeyboardSeparator.Dot,
  isStakeValid: true,
  hintMessage: "Hint message",
  hintType: "WARNING",
  displayReturns: true,
  hasStakeCaret: false,
};

function renderObbBetControls(props = {}, keyboardContext = {}) {
  const { isDesktop = false, importDefault = true } = props;

  const initialProps = importDefault ? DEFAULT_PROPS : {};
  const componentProps = { ...initialProps, ...props };

  return render(
    <ConfigContextProviderMock isDesktopLayout={isDesktop}>
      <KeyboardContextProviderMock
        focusedKeyboardControls={
          keyboardContext.focusedKeyboardControls || {
            focusedInputId: null,
            focusedInputRef: null,
            focusedTargetRef: null,
          }
        }
        setFocusedKeyboardControls={keyboardContext.setFocusedKeyboardControls || jest.fn()}
      >
        <ObbBetControls {...componentProps} />
      </KeyboardContextProviderMock>
    </ConfigContextProviderMock>,
  );
}

describe("ObbBetControls", () => {
  afterEach(jest.clearAllMocks);

  it("should instantiate BetControls with proper values", () => {
    renderObbBetControls();
    expect(BetslipBetControls).toHaveBeenCalledTimes(2);
    expect(BetslipBetControls).toHaveBeenCalledWith(
      {
        innerRef: expect.anything(),
        currencySymbol: "$",
        formattedPotentialReturns: "15.00$",
        hasAccaInsurance: false,
        hasEachWay: false,
        id: "potentialBet:urn:1",
        isAccaInsuranceSelected: false,
        isPanelDisabled: false,
        isStakeFocused: false,
        isStakeReadonly: false,
        isStakeValid: true,
        odds: "3/4",
        oddsLabel: "odds",
        onStakeBlur: expect.any(Function),
        onStakeChange: expect.any(Function),
        onStakeFocus: expect.any(Function),
        oddsMovement: undefined,
        oddsMovementDown: "oddsMovementDown",
        oddsMovementUp: "oddsMovementUp",
        returnsLabel: "returns",
        separator: ".",
        stake: 15,
        stakeLabel: "stake",
        hintMessage: "Hint message",
        hintType: "WARNING",
        displayReturns: true,
        hasStakeCaret: false,
      },
      undefined,
    );
  });

  describe("when the panel is disabled", () => {
    it("should render BetControls with disabled props", () => {
      renderObbBetControls({
        isPanelDisabled: true,
      });

      expect(BetslipBetControls).toHaveBeenCalledWith(
        expect.objectContaining({
          isPanelDisabled: true,
          isStakeReadonly: true,
        }),
        undefined,
      );
    });
  });

  describe("on mount", () => {
    describe("shouldFocusStakeField", () => {
      describe("when shouldFocusStakeField is false", () => {
        it("should not set focused input ID", () => {
          const setFocusedInputId = jest.fn();
          renderObbBetControls(
            { potentialBetId: "id", shouldFocusStakeField: false },
            { focusedInputId: "id", setFocusedInputId },
          );

          expect(setFocusedInputId).not.toHaveBeenCalled();
        });
      });

      describe("when shouldFocusStakeField is true", () => {
        it("should set focused input ID", () => {
          const setFocusedKeyboardControls = jest.fn();
          renderObbBetControls(
            { potentialBetId: "id", shouldFocusStakeField: true },
            {
              focusedKeyboardControls: { focusedInputId: "unique-id" },
              setFocusedKeyboardControls,
            },
          );

          expect(setFocusedKeyboardControls).toHaveBeenCalledWith(
            expect.objectContaining({
              focusedInputId: "unique-id",
            }),
          );
        });
      });
    });
  });

  describe("when focusedInputId is equal to input ID", () => {
    it("should call BetControls with focused as true", () => {
      renderObbBetControls(
        { potentialBetId: "id" },
        {
          focusedKeyboardControls: { focusedInputId: "unique-id" },
        },
      );

      const [props] = BetslipBetControls.mock.calls[0];
      expect(props.isStakeFocused).toEqual(true);
    });
  });

  describe("onStakeFocus", () => {
    describe("when `focused` argument is true", () => {
      it("should call dispatchObbQuotesUpdate", () => {
        const dispatchQuotesUpdateSpy = jest.fn();
        renderObbBetControls({ dispatchQuotesUpdate: dispatchQuotesUpdateSpy });
        const { onStakeFocus } = BetslipBetControls.mock.calls[0][0];

        act(() => {
          onStakeFocus(true);
        });

        expect(dispatchQuotesUpdateSpy).toHaveBeenCalledTimes(1);
      });

      describe("when shouldFocusStakeField is true", () => {
        it("should synchronously call setFocusedKeyboardControls", () => {
          const setFocusedKeyboardControls = jest.fn();
          const dispatchQuotesUpdateSpy = jest.fn();
          renderObbBetControls(
            { potentialBetId: "id", shouldFocusStakeField: true, dispatchQuotesUpdate: dispatchQuotesUpdateSpy },
            { setFocusedKeyboardControls },
          );
          const { onStakeFocus } = BetslipBetControls.mock.calls[0][0];

          act(() => {
            onStakeFocus(true);
          });

          expect(setFocusedKeyboardControls).toHaveBeenNthCalledWith(3, {
            focusedCombinationId: "id",
            focusedInputId: "unique-id",
            focusedInputRef: expect.anything(),
            focusedTargetRef: expect.anything(),
          });
        });
      });

      describe("when shouldFocusStakeField is false", () => {
        it("should call setFocusedKeyboardControls after timeout", () => {
          jest.useFakeTimers();
          const setFocusedKeyboardControls = jest.fn();
          const dispatchQuotesUpdateSpy = jest.fn();
          renderObbBetControls(
            {
              potentialBetId: "id",
              shouldFocusStakeField: false,
              dispatchQuotesUpdate: dispatchQuotesUpdateSpy,
            },
            { setFocusedKeyboardControls },
          );
          const { onStakeFocus } = BetslipBetControls.mock.calls[0][0];

          act(() => {
            onStakeFocus(true);
            jest.advanceTimersByTime(50);
          });

          expect(setFocusedKeyboardControls).toHaveBeenNthCalledWith(1, {
            focusedCombinationId: "id",
            focusedInputId: "unique-id",
            focusedInputRef: expect.anything(),
            focusedTargetRef: expect.anything(),
          });
        });
      });
    });

    describe("when `focused` argument is false", () => {
      describe("and the user is in desktop view", () => {
        describe("and the stake field got the highlight focus", () => {
          it("should remove the highlight focus", () => {
            const setFocusedKeyboardControls = jest.fn();
            renderObbBetControls(
              { potentialBetId: "id", isDesktop: true },
              {
                focusedKeyboardControls: {
                  focusedCombinationId: "id",
                  focusedInputId: "unique-id",
                  focusedInputRef: { current: null },
                  focusedTargetRef: { current: null },
                },
                setFocusedKeyboardControls,
              },
            );

            const { onStakeFocus } = BetslipBetControls.mock.calls[0][0];

            act(() => {
              onStakeFocus(false);
            });

            const updateFunction = setFocusedKeyboardControls.mock.calls[0][0];

            const newState = updateFunction({
              focusedInputId: "unique-id",
              focusedInputRef: null,
              focusedTargetRef: null,
            });

            expect(newState).toEqual({
              focusedInputId: null,
              focusedInputRef: null,
              focusedTargetRef: null,
            });

            expect(setFocusedKeyboardControls).toHaveBeenCalledTimes(1);
          });
        });

        describe("and the stake field doesn't have the highlight focus", () => {
          it("shouldn't apply the highlight focus to other stake field", () => {
            const setFocusedKeyboardControls = jest.fn();
            renderObbBetControls(
              { potentialBetId: "id", isDesktop: true },
              {
                focusedKeyboardControls: {
                  focusedInputId: "another-id",
                },
                setFocusedKeyboardControls,
              },
            );
            const { onStakeFocus } = BetslipBetControls.mock.calls[0][0];

            act(() => {
              onStakeFocus(false);
            });

            expect(setFocusedKeyboardControls).not.toHaveBeenCalled();
          });
        });
      });

      describe("when the user ins't in desktop view", () => {
        it("should not remove the highlight focus", () => {
          const setFocusedKeyboardControls = jest.fn();
          renderObbBetControls({ potentialBetId: "id" }, { setFocusedKeyboardControls });
          const { onStakeFocus } = BetslipBetControls.mock.calls[0][0];

          act(() => {
            onStakeFocus(false);
          });

          expect(setFocusedKeyboardControls).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe("when a stake is changed", () => {
    it("should dispatch", () => {
      const dispatchStakeChangeSpy = jest.fn();

      renderObbBetControls({
        dispatchStakeChange: dispatchStakeChangeSpy,
      });

      BetslipBetControls.mock.calls[0][0].onStakeChange(3);

      expect(dispatchStakeChangeSpy).toHaveBeenCalledWith({ potentialBetId: "potentialBet:urn:1", newValue: 3 });
      expect(dispatchStakeChangeSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("on stake blur", () => {
    it("should dispatch stake validation after 50ms", () => {
      jest.useFakeTimers();
      const dispatchStakeValidateSpy = jest.fn();

      renderObbBetControls({
        dispatchStakeValidate: dispatchStakeValidateSpy,
      });

      const { onStakeBlur } = BetslipBetControls.mock.calls[0][0];

      act(() => {
        onStakeBlur();
      });

      expect(dispatchStakeValidateSpy).toHaveBeenCalledTimes(0);

      jest.advanceTimersByTime(50);

      expect(dispatchStakeValidateSpy).toHaveBeenCalledWith({ potentialBetId: "potentialBet:urn:1" });
      expect(dispatchStakeValidateSpy).toHaveBeenCalledTimes(1);
    });
  });
});
