import { render, act } from "@testing-library/react-native";

import { KeyboardSeparator } from "@ppb/the-wall-common/types";
import { BetControls as BetslipBetControls } from "@ppb/the-wall-native";

import { RootBetslipContext } from "../RootBetslip/RootBetslipContext";
import { KeyboardContext } from "../Keyboard/KeyboardContext";
import { ObbBetControls } from "./ObbBetControls.native";

jest.mock("@ppb/the-wall-native", () => ({
  BetControls: jest.fn(() => <bet-controls-mock />),
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useId: jest.fn().mockReturnValue("somegeneratedId"),
}));

const RootBetslipProviderMock = ({ children, registerCollapseListener = jest.fn().mockReturnValue(jest.fn()) }) => (
  <RootBetslipContext.Provider value={{ registerCollapseListener }}>{children}</RootBetslipContext.Provider>
);

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

const i18nLabelsMock = {
  odds: "oddsLabel",
  stake: "stake",
  returns: "returns",
};

function renderObbBetControls(
  {
    i18n = i18nLabelsMock,
    shouldFocusStakeField,
    potentialBetId,
    odds,
    stake,
    currencySymbol,
    isPanelDisabled,
    formattedPotentialReturns,
    dispatchStakeValidate,
    dispatchStakeChange,
    dispatchQuotesUpdate,
    separator,
    isStakeValid,
    hintMessage,
    hintType,
    displayReturns,
    hasStakeCaret = false,
  },
  rootContext = {},
  keyboardContext = {},
) {
  return render(
    <RootBetslipProviderMock registerCollapseListener={rootContext.registerCollapseListener}>
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
        <ObbBetControls
          i18n={i18n}
          shouldFocusStakeField={shouldFocusStakeField}
          potentialBetId={potentialBetId}
          odds={odds}
          stake={stake}
          currencySymbol={currencySymbol}
          isPanelDisabled={isPanelDisabled}
          formattedPotentialReturns={formattedPotentialReturns}
          dispatchStakeValidate={dispatchStakeValidate}
          dispatchStakeChange={dispatchStakeChange}
          dispatchQuotesUpdate={dispatchQuotesUpdate}
          separator={separator}
          isStakeValid={isStakeValid}
          hintMessage={hintMessage}
          hintType={hintType}
          displayReturns={displayReturns}
          hasStakeCaret={hasStakeCaret}
        />
      </KeyboardContextProviderMock>
    </RootBetslipProviderMock>,
  );
}

describe("ObbBetControls", () => {
  afterEach(jest.clearAllMocks);

  describe("ObbBetControls component", () => {
    it("should instantiate OBbBetControls with proper values", () => {
      renderObbBetControls({
        potentialBetId: "potentialBetId",
        odds: "3/4",
        separator: KeyboardSeparator.Dot,
        currencySymbol: "$",
        stakeLabel: "Stake",
        formattedPotentialReturns: "",
        returnsLabel: "",
        isPanelDisabled: false,
        isStakeFocused: false,
        isStakeReadonly: false,
        isStakeValid: true,
        hintMessage: "hintMessage",
        hintType: "WARNING",
        displayReturns: true,
        hasStakeCaret: true,
      });
      expect(BetslipBetControls).toHaveBeenCalledTimes(1);
      expect(BetslipBetControls).toHaveBeenCalledWith(
        {
          innerRef: expect.anything(),
          id: "potentialBetId",
          odds: "3/4",
          oddsLabel: "oddsLabel",
          stake: undefined,
          separator: KeyboardSeparator.Dot,
          currencySymbol: "$",
          stakeLabel: "stake",
          formattedPotentialReturns: "",
          returnsLabel: "returns",
          isPanelDisabled: false,
          isStakeFocused: false,
          isStakeReadonly: false,
          isStakeValid: true,
          onStakeBlur: expect.any(Function),
          onStakeChange: expect.any(Function),
          onStakeFocus: expect.any(Function),
          hasEachWay: false,
          isAccaInsuranceSelected: false,
          hasAccaInsurance: false,
          hintMessage: "hintMessage",
          hintType: "WARNING",
          displayReturns: true,
          hasStakeCaret: true,
        },
        undefined,
      );
    });

    describe("when the panel is disabled", () => {
      it("should render BetControls with disabled props", () => {
        renderObbBetControls({
          potentialBetId: "potentialBetId:1",
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
            const setFocusedKeyboardControls = jest.fn();
            renderObbBetControls({ potentialBetId: "potentialBetId", shouldFocusStakeField: false }, undefined, {
              focusedCombinationId: "potentialBetId",
              focusedInputId: "somegeneratedId",
              setFocusedKeyboardControls,
            });

            expect(setFocusedKeyboardControls).not.toHaveBeenCalled();
          });
        });

        describe("when shouldFocusStakeField is true", () => {
          it("should set focused input ID", () => {
            const setFocusedKeyboardControls = jest.fn();

            renderObbBetControls({ potentialBetId: "potentialBetId", shouldFocusStakeField: true }, undefined, {
              setFocusedKeyboardControls,
            });

            expect(setFocusedKeyboardControls).toHaveBeenCalledWith({
              focusedCombinationId: "potentialBetId",
              focusedInputId: "somegeneratedId",
              focusedInputRef: expect.any(Object),
              focusedTargetRef: expect.any(Object),
            });
          });
        });
      });
    });

    describe("when focusedInputId is equal to input ID", () => {
      it("should call ObbBetControls with focused as true", () => {
        renderObbBetControls({ potentialBetUrn: "potentialBetUrn" }, undefined, {
          focusedKeyboardControls: { focusedInputId: "somegeneratedId", focusedInputRef: { current: {} } },
        });

        const [props] = BetslipBetControls.mock.calls[0];
        expect(props.isStakeFocused).toEqual(true);
      });
    });
    describe("onStakeFocus", () => {
      describe("when `focused` argument is true", () => {
        it("should call setFocusedKeyboardControls and dispatchQuotesUpdate", () => {
          const setFocusedKeyboardControls = jest.fn();
          const dispatchQuotesUpdateSpy = jest.fn();

          renderObbBetControls(
            {
              potentialBetId: "potentialBetId",
              dispatchQuotesUpdate: dispatchQuotesUpdateSpy,
            },
            undefined,
            {
              focusedKeyboardControls: { focusedInputId: null },
              setFocusedKeyboardControls,
            },
          );
          const { onStakeFocus } = BetslipBetControls.mock.calls[0][0];

          act(() => {
            onStakeFocus(true);
          });

          expect(setFocusedKeyboardControls).toHaveBeenCalledWith({
            focusedCombinationId: "potentialBetId",
            focusedInputId: "somegeneratedId",
            focusedInputRef: expect.any(Object),
            focusedTargetRef: expect.any(Object),
          });
          expect(setFocusedKeyboardControls).toHaveBeenCalledTimes(1);

          expect(dispatchQuotesUpdateSpy).toHaveBeenCalledTimes(1);
        });
      });
      describe("when `focused` argument is false", () => {
        it("should not call setFocusedKeyboardControls", () => {
          const setFocusedKeyboardControls = jest.fn();
          renderObbBetControls({ potentialBetId: "potentialBetId" }, undefined, {
            setFocusedKeyboardControls,
          });
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
    it("should dispatch `dispatchStakeChange`", () => {
      const dispatchStakeChangeSpy = jest.fn();

      renderObbBetControls({
        potentialBetId: "potentialBetId:1",
        dispatchStakeChange: dispatchStakeChangeSpy,
      });

      BetslipBetControls.mock.calls[0][0].onStakeChange(3);

      expect(dispatchStakeChangeSpy).toHaveBeenCalledWith({ potentialBetId: "potentialBetId:1", newValue: 3 });
      expect(dispatchStakeChangeSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("when a stake is blurred", () => {
    it("should dispatch stake validation", () => {
      const dispatchStakeValidateSpy = jest.fn();
      const setFocusedKeyboardControls = jest.fn();
      renderObbBetControls(
        {
          potentialBetId: "potentialBetId:1",
          dispatchStakeValidate: dispatchStakeValidateSpy,
        },
        undefined,
        { setFocusedKeyboardControls },
      );

      act(() => {
        BetslipBetControls.mock.calls[0][0].onStakeBlur();
      });

      expect(dispatchStakeValidateSpy).toHaveBeenCalledWith({ potentialBetId: "potentialBetId:1" });
      expect(dispatchStakeValidateSpy).toHaveBeenCalledTimes(1);
      expect(setFocusedKeyboardControls).toHaveBeenCalledWith({
        focusedCombinationId: null,
        focusedInputId: null,
        focusedInputRef: null,
        focusedTargetRef: null,
      });
    });

    it("should not dispatch stake validation in function not set", () => {
      const dispatchStakeValidateSpy = jest.fn();

      renderObbBetControls({
        potentialBetId: "potentialBetId:1",
        dispatchStakeValidate: dispatchStakeValidateSpy,
      });

      BetslipBetControls.mock.calls[0][0].onStakeBlur();

      expect(dispatchStakeValidateSpy).toHaveBeenCalledWith({ potentialBetId: "potentialBetId:1" });
      expect(dispatchStakeValidateSpy).toHaveBeenCalledTimes(1);
    });
  });
});
