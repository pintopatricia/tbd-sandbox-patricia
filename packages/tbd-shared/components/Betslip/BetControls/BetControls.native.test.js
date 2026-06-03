import * as React from "react";
import { render, act } from "@testing-library/react-native";

import { KeyboardSeparator } from "@ppb/the-wall-common/types";
import { BetControls as BetslipBetControls } from "@ppb/the-wall-native";

import { RootBetslipContext } from "../RootBetslip/RootBetslipContext";
import { KeyboardContext } from "../Keyboard/KeyboardContext";

import { BetControls } from "./BetControls.native";

jest.mock("@ppb/the-wall-native", () => ({
  BetControls: jest.fn(() => <bet-controls-mock />),
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useId: jest.fn(),
}));
const RootBetslipProviderMock = ({
  children,
  registerCollapseListener = jest.fn().mockReturnValue(jest.fn()),
  isBetConfirmationStep,
}) => (
  <RootBetslipContext.Provider value={{ registerCollapseListener, isBetConfirmationStep }}>
    {children}
  </RootBetslipContext.Provider>
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

function renderBetControls(
  {
    combinationId,
    shouldFocusStakeField,
    odds,
    oddsAccessibilityLabel,
    previousOdds,
    oddsMovement,
    stake,
    separator = KeyboardSeparator.Dot,
    eachWaySubtitle,
    isPanelDisabled,
    isEachWaySelected,
    isAccaInsuranceSelected,
    isAccaInsuranceReadonly,
    isPriceBoostSelected,
    isGenerosityWalletSelected,
    isStartingPriceSelected,
    isStakeValid,
    hasEachWay,
    hasGenerosity,
    hasStartingPrice,
    hasAccaInsurance,
    hintType,
    hintMessage,
    accaInsuranceTermsUrl,
    currencySymbol,
    accaInsuranceSubtitle,
    accaInsuranceTermsLabel,
    accaInsuranceTitle,
    bonusAvailabilityLabel,
    formattedOriginalPotentialReturns,
    formattedPotentialReturns,
    returnsLabel,
    displayReturns = true,
    isGenerosityDisabled = false,
    linesLabel,
    dividendBetLabel,
    multiplier,
    labels = {},
    enableSPMobile,
    generosityIconName,
    generosityType,
    dispatchPriceBoostPress,
    dispatchGenerosityPress,
    dispatchStakeChange,
    dispatchStakeValidate,
    dispatchEachWayPress,
    dispatchAccaInsurancePress,
    dispatchStartPricePress,
    generosityAlertMessage,
    dispatchGenerosityWalletRemoveAction,
    hasStakeCaret,
    dispatchGenerosityRemoveAction,
  },
  rootContext = {},
  keyboardContext = {},
) {
  return render(
    <RootBetslipProviderMock
      registerCollapseListener={rootContext.registerCollapseListener}
      isBetConfirmationStep={rootContext.isBetConfirmationStep || false}
    >
      <KeyboardContextProviderMock
        focusedKeyboardControls={
          keyboardContext.focusedKeyboardControls || {
            focusedCombinationId: null,
            focusedInputId: null,
            focusedInputRef: null,
            focusedTargetRef: null,
          }
        }
        setFocusedKeyboardControls={keyboardContext.setFocusedKeyboardControls || jest.fn()}
      >
        <BetControls
          combinationId={combinationId}
          shouldFocusStakeField={shouldFocusStakeField}
          hasAccaInsurance={hasAccaInsurance}
          hasEachWay={hasEachWay}
          hasGenerosity={hasGenerosity}
          hasStartingPrice={hasStartingPrice}
          isPanelDisabled={isPanelDisabled}
          isAccaInsuranceSelected={isAccaInsuranceSelected}
          isAccaInsuranceReadonly={isAccaInsuranceReadonly}
          isEachWaySelected={isEachWaySelected}
          isPriceBoostSelected={isPriceBoostSelected}
          isGenerosityWalletSelected={isGenerosityWalletSelected}
          isStartingPriceSelected={isStartingPriceSelected}
          isStakeValid={isStakeValid}
          accaInsuranceTitle={accaInsuranceTitle}
          accaInsuranceSubtitle={accaInsuranceSubtitle}
          accaInsuranceTermsLabel={accaInsuranceTermsLabel}
          accaInsuranceTermsUrl={accaInsuranceTermsUrl}
          odds={odds}
          oddsAccessibilityLabel={oddsAccessibilityLabel}
          oddsMovement={oddsMovement}
          hintType={hintType}
          hintMessage={hintMessage}
          previousOdds={previousOdds}
          stake={stake}
          separator={separator}
          multiplier={multiplier}
          currencySymbol={currencySymbol}
          bonusAvailabilityLabel={bonusAvailabilityLabel}
          formattedOriginalPotentialReturns={formattedOriginalPotentialReturns}
          formattedPotentialReturns={formattedPotentialReturns}
          returnsLabel={returnsLabel}
          displayReturns={displayReturns}
          isGenerosityDisabled={isGenerosityDisabled}
          linesLabel={linesLabel}
          dividendBetLabel={dividendBetLabel}
          eachWaySubtitle={eachWaySubtitle}
          labels={labels}
          enableSPMobile={enableSPMobile}
          generosityIconName={generosityIconName}
          generosityType={generosityType}
          dispatchStakeChange={dispatchStakeChange}
          dispatchStakeValidate={dispatchStakeValidate}
          dispatchStartPricePress={dispatchStartPricePress}
          dispatchEachWayPress={dispatchEachWayPress}
          dispatchAccaInsurancePress={dispatchAccaInsurancePress}
          dispatchPriceBoostPress={dispatchPriceBoostPress}
          dispatchGenerosityPress={dispatchGenerosityPress}
          generosityAlertMessage={generosityAlertMessage}
          dispatchGenerosityWalletRemoveAction={dispatchGenerosityWalletRemoveAction}
          hasStakeCaret={hasStakeCaret}
          dispatchGenerosityRemoveAction={dispatchGenerosityRemoveAction}
        />
      </KeyboardContextProviderMock>
    </RootBetslipProviderMock>,
  );
}

const BET_CONTROLS_DEFAULT_PROPS = {
  combinationId: "testId",
  odds: "3/4",
  oddsAccessibilityLabel: "Odds: 3/4",
  oddsMovement: "UP",
  oddsMovementDown: "Down Label",
  oddsMovementUp: "Up Label",
  previousOdds: "Previous Odds",
  currencySymbol: "$",
  bonusAvailabilityLabel: "Bonus not available",
  formattedOriginalPotentialReturns: "",
  formattedPotentialReturns: "?",
  returnsLabel: "",
  linesLabel: "X Lines",
  dividendBetLabel: "Dividend Bet",
  labels: {
    odds: "Odds",
    stake: "Stake",
    eachWayTitle: "Each Way Title",
    startingPriceTitle: "Starting Price Title",
    oddsMovementUp: "Movement Up",
    oddsMovementDown: "Movement Down",
    generosityAlertRemoveLabel: "Generosity Wallet Remove Label",
  },
  eachWaySubtitle: "Each Way Subtitle",
  accaInsuranceTitle: "AccaInsurance Title",
  accaInsuranceSubtitle: "AccaInsurance Subtitle",
  accaInsuranceTermsLabel: "AccaInsurance Terms Label",
  hasEachWay: true,
  multiplier: "2x",
  hasAccaInsurance: true,
  accaInsuranceTermsUrl: "AccaInsurance Terms Url",
  isPanelDisabled: false,
  isAccaInsuranceSelected: true,
  isAccaInsuranceReadonly: false,
  isPriceBoostSelected: true,
  isGenerosityWalletSelected: true,
  isStakeValid: true,
  isEachWaySelected: true,
  isStartingPriceSelected: false,
  hasGenerosity: true,
  hasStartingPrice: true,
  hintMessage: "Hint Message",
  hintType: "Hint Type",
  generosityAlertMessage: "Generosity Wallet Message",
  isGenerosityDisabled: false,
  enableSPMobile: true,
  hasStakeCaret: false,
  dispatchGenerosityWalletRemoveAction: jest.fn(),
  generosityIconName: "icon name",
  dispatchGenerosityRemoveAction: jest.fn(),
};

const BETSLIP_BET_CONTROLS_DEFAULT_PROPS = {
  innerRef: expect.anything(),
  accaInsuranceSubtitle: "AccaInsurance Subtitle",
  accaInsuranceTermsLabel: "AccaInsurance Terms Label",
  accaInsuranceTermsUrl: "AccaInsurance Terms Url",
  accaInsuranceTitle: "AccaInsurance Title",
  bonusAvailabilityLabel: "Bonus not available",
  currencySymbol: "$",
  eachWaySubtitle: "Each Way Subtitle",
  eachWayTitle: "Each Way Title",
  startingPriceTitle: "Starting Price Title",
  hasAccaInsurance: true,
  hasEachWay: true,
  hasGenerosity: true,
  hasStartingPrice: true,
  hintMessage: "Hint Message",
  hintType: "Hint Type",
  id: "testId",
  isStartingPriceSelected: false,
  isStartingPriceDisabled: false,
  isAccaInsuranceSelected: true,
  isAccaInsuranceReadonly: false,
  isEachWaySelected: true,
  isEachWayDisabled: false,
  isPriceBoostSelected: true,
  isGenerositySelected: true,
  isAccaInsuranceDisabled: false,
  isPanelDisabled: false,
  isStakeFocused: false,
  isStakeReadonly: false,
  isStakeValid: true,
  formattedOriginalPotentialReturns: "",
  formattedPotentialReturns: "?",
  returnsLabel: "",
  displayReturns: true,
  linesLabel: "X Lines",
  dividendBetLabel: "Dividend Bet",
  multiplier: "2x",
  odds: "3/4",
  oddsLabel: "Odds",
  oddsAccessibilityLabel: "Odds: 3/4",
  oddsMovement: "UP",
  oddsMovementDown: "Movement Down",
  oddsMovementUp: "Movement Up",
  onAccaInsurancePress: expect.any(Function),
  onEachWayPress: expect.any(Function),
  onGenerosityPress: expect.any(Function),
  onStakeBlur: expect.any(Function),
  onStakeChange: expect.any(Function),
  onStakeFocus: expect.any(Function),
  previousOdds: "Previous Odds",
  shouldDisableOnFocusListener: false,
  stake: undefined,
  stakeLabel: "Stake",
  separator: KeyboardSeparator.Dot,
  generosityAlertMessage: "Generosity Wallet Message",
  generosityAlertRemoveLabel: "Generosity Wallet Remove Label",
  isGenerosityDisabled: false,
  hasStakeCaret: false,
  onGenerosityRemovePress: expect.any(Function),
  onStartingPricePress: expect.any(Function),
  generosityIconName: "icon name",
};

describe("BetControls", () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe("RootBetslip listeners", () => {
    it("should register collapse listener upon initialisation", () => {
      const dispatchStakeValidateSpy = jest.fn();
      const registerCollapseListenerSpy = jest.fn().mockReturnValue(jest.fn());

      renderBetControls(
        {
          combinationId: "some id",
          dispatchStakeValidate: dispatchStakeValidateSpy,
        },
        { registerCollapseListener: registerCollapseListenerSpy },
      );

      const [listener] = registerCollapseListenerSpy.mock.calls[0];

      listener();

      expect(dispatchStakeValidateSpy).toHaveBeenCalledTimes(1);
      expect(dispatchStakeValidateSpy).toHaveBeenCalledWith({ id: "some id" });
    });

    it("should unregister upon component unmount", () => {
      const unregisterSpy = jest.fn();
      const registerCollapseListenerSpy = jest.fn().mockReturnValueOnce(unregisterSpy);
      const { unmount } = renderBetControls(
        {
          id: "some id",
        },
        { registerCollapseListener: registerCollapseListenerSpy },
      );

      act(() => unmount());

      expect(unregisterSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("BetControls component", () => {
    it("should instantiate BetControls with proper values", () => {
      renderBetControls(BET_CONTROLS_DEFAULT_PROPS);

      expect(BetslipBetControls).toHaveBeenCalledTimes(1);
      expect(BetslipBetControls).toHaveBeenCalledWith(BETSLIP_BET_CONTROLS_DEFAULT_PROPS, undefined);
    });

    describe("when the panel is disabled due to combinations with failures or placing in progress", () => {
      it("should render BetControls with disabled props", () => {
        renderBetControls(
          {
            combinationId: "MULT:1",
            isPanelDisabled: true,
          },
          {
            isBetConfirmationStep: false,
          },
        );

        expect(BetslipBetControls).toHaveBeenCalledWith(
          expect.objectContaining({
            isPanelDisabled: true,
            isStakeReadonly: true,
          }),
          undefined,
        );
      });
    });

    describe("when is the bet confirmation step", () => {
      it("should instantiate BetControls with proper values for this step", () => {
        renderBetControls(
          BET_CONTROLS_DEFAULT_PROPS,
          {
            isBetConfirmationStep: true,
          },
          {},
        );

        expect(BetslipBetControls).toHaveBeenCalledTimes(1);

        expect(BetslipBetControls).toHaveBeenCalledWith(
          {
            ...BETSLIP_BET_CONTROLS_DEFAULT_PROPS,
            isStakeFocused: false,
            isPanelDisabled: false,
            isPriceBoostSelected: true,
            isGenerositySelected: true,
            isEachWayDisabled: true,
            isAccaInsuranceDisabled: true,
            isStakeReadonly: true,
            isStartingPriceDisabled: true,
          },
          undefined,
        );
      });
    });

    describe("on mount", () => {
      describe("shouldFocusStakeField", () => {
        describe("when shouldFocusStakeField is false", () => {
          it("should not set focused input ID", () => {
            const setFocusedKeyboardControls = jest.fn();
            renderBetControls({ combinationId: "id", shouldFocusStakeField: false }, undefined, {
              focusedKeyboardControls: { focusedInputId: "id", inputRef: null, targetRef: null },
              setFocusedKeyboardControls,
            });

            expect(setFocusedKeyboardControls).not.toHaveBeenCalled();
          });
        });

        describe("when shouldFocusStakeField is true", () => {
          it("should set focusedKeyboardControls with correct parameterss", () => {
            jest.spyOn(React, "useId").mockImplementationOnce(() => "someId");
            const setFocusedKeyboardControls = jest.fn();
            renderBetControls({ combinationId: "id", shouldFocusStakeField: true }, undefined, {
              focusedKeyboardControls: { focusedInputId: "id" },
              setFocusedKeyboardControls,
            });

            expect(setFocusedKeyboardControls).toHaveBeenCalledWith({
              focusedCombinationId: "id",
              focusedInputId: "someId",
              focusedInputRef: expect.anything(),
              focusedTargetRef: expect.anything(),
            });
            expect(setFocusedKeyboardControls).toHaveBeenCalledTimes(1);
          });
        });
      });
    });

    describe("when focusedInputId is equal to input ID", () => {
      it("should call BetControls with focused as true", () => {
        jest.spyOn(React, "useId").mockImplementationOnce(() => "someId");

        const setFocusedKeyboardControls = jest.fn();
        renderBetControls({ combinationId: "id" }, undefined, {
          focusedKeyboardControls: { focusedInputRef: {}, focusedInputId: "someId" },
          setFocusedKeyboardControls,
        });

        const [props] = BetslipBetControls.mock.calls[0];
        expect(props.isStakeFocused).toEqual(true);
      });
    });

    describe("onStakeFocus", () => {
      describe("when `focused` argument is true", () => {
        it("should call setFocusedKeyboardControls with valid controls", () => {
          jest.spyOn(React, "useId").mockImplementationOnce(() => "someid");
          const setFocusedKeyboardControls = jest.fn();
          renderBetControls({ combinationId: "id" }, undefined, { setFocusedKeyboardControls });
          const { onStakeFocus } = BetslipBetControls.mock.calls[0][0];

          act(() => {
            onStakeFocus(true);
          });

          expect(setFocusedKeyboardControls).toHaveBeenNthCalledWith(1, {
            focusedCombinationId: "id",
            focusedInputId: "someid",
            focusedInputRef: expect.anything(),
            focusedTargetRef: expect.anything(),
          });
          expect(setFocusedKeyboardControls).toHaveBeenCalledTimes(1);
        });
      });
      describe("when `focused` argument is false", () => {
        it("should not call setFocusedKeyboardControls", () => {
          const setFocusedKeyboardControls = jest.fn();
          renderBetControls({ combinationId: "id" }, undefined, { setFocusedKeyboardControls });
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
      jest.useFakeTimers();

      const dispatchStakeChangeSpy = jest.fn();

      renderBetControls({
        combinationId: "MULT:1",
        dispatchStakeChange: dispatchStakeChangeSpy,
      });

      BetslipBetControls.mock.calls[0][0].onStakeChange(3);

      // Fast-forward until all requestAnimationFrame callbacks have been executed
      jest.runAllTimers();

      expect(dispatchStakeChangeSpy).toHaveBeenCalledWith({ id: "MULT:1", newValue: 3 });
      expect(dispatchStakeChangeSpy).toHaveBeenCalledTimes(1);

      jest.useRealTimers();
    });
  });

  describe("when a stake is blurred", () => {
    it("should dispatch stake validation", () => {
      const dispatchStakeValidateSpy = jest.fn();

      renderBetControls({
        combinationId: "MULT:1",
        dispatchStakeValidate: dispatchStakeValidateSpy,
      });

      BetslipBetControls.mock.calls[0][0].onStakeBlur();

      expect(dispatchStakeValidateSpy).toHaveBeenCalledWith({ id: "MULT:1" });
      expect(dispatchStakeValidateSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("when each way is changed", () => {
    describe("when the panel is enabled", () => {
      it("should dispatch", () => {
        const dispatchEachWayPressSpy = jest.fn();

        renderBetControls({
          isPanelDisabled: false,
          combinationId: "MULT:1",
          dispatchEachWayPress: dispatchEachWayPressSpy,
        });

        BetslipBetControls.mock.calls[0][0].onEachWayPress(true);

        expect(dispatchEachWayPressSpy).toHaveBeenCalledWith("MULT:1", true);
        expect(dispatchEachWayPressSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe("when the panel is disabled", () => {
      it("should not dispatch", () => {
        const dispatchEachWayPressSpy = jest.fn();

        renderBetControls({
          combinationId: "MULT:1",
          isPanelDisabled: true,
          dispatchEachWayPress: dispatchEachWayPressSpy,
        });

        BetslipBetControls.mock.calls[0][0].onEachWayPress(true);

        expect(dispatchEachWayPressSpy).not.toHaveBeenCalled();
      });
    });
  });

  describe("when starting price is changed", () => {
    describe("when the panel is enabled", () => {
      it("should dispatch", () => {
        const dispatchStartPricePressSpy = jest.fn();

        renderBetControls({
          isPanelDisabled: false,
          combinationId: "MULT:1",
          dispatchStartPricePress: dispatchStartPricePressSpy,
        });

        BetslipBetControls.mock.calls[0][0].onStartingPricePress(true);

        expect(dispatchStartPricePressSpy).toHaveBeenCalledWith("MULT:1", true);
        expect(dispatchStartPricePressSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe("when the panel is disabled", () => {
      it("should not dispatch", () => {
        const dispatchStartPricePressSpy = jest.fn();

        renderBetControls({
          combinationId: "MULT:1",
          isPanelDisabled: true,
          dispatchStartPricePress: dispatchStartPricePressSpy,
        });

        BetslipBetControls.mock.calls[0][0].onStartingPricePress(true);

        expect(dispatchStartPricePressSpy).not.toHaveBeenCalled();
      });
    });
  });

  describe("when acca insurance is changed", () => {
    describe("when the panel is enabled", () => {
      it("should dispatch", () => {
        const dispatchAccaInsurancePressSpy = jest.fn();

        renderBetControls({
          combinationId: "MULT:1",
          dispatchAccaInsurancePress: dispatchAccaInsurancePressSpy,
        });

        BetslipBetControls.mock.calls[0][0].onAccaInsurancePress(true);

        expect(dispatchAccaInsurancePressSpy).toHaveBeenCalledWith("MULT:1", true);
        expect(dispatchAccaInsurancePressSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe("when the panel is disabled", () => {
      it("should not dispatch", () => {
        const dispatchAccaInsurancePressSpy = jest.fn();

        renderBetControls({
          combinationId: "MULT:1",
          isPanelDisabled: true,
          dispatchAccaInsurancePress: dispatchAccaInsurancePressSpy,
        });

        BetslipBetControls.mock.calls[0][0].onAccaInsurancePress(true);

        expect(dispatchAccaInsurancePressSpy).not.toHaveBeenCalled();
      });
    });
  });

  describe("when free bets is changed", () => {
    describe("when the panel is enabled", () => {
      it("should dispatch", () => {
        const dispatchGenerosityPressSpy = jest.fn();

        renderBetControls({
          combinationId: "MULT:1",
          dispatchGenerosityPress: dispatchGenerosityPressSpy,
        });

        BetslipBetControls.mock.calls[0][0].onGenerosityPress();

        expect(dispatchGenerosityPressSpy).toHaveBeenCalledWith("MULT:1", false);
        expect(dispatchGenerosityPressSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe("when the panel is disabled", () => {
      it("should not dispatch", () => {
        const dispatchGenerosityPressSpy = jest.fn();

        renderBetControls({
          combinationId: "MULT:1",
          isPanelDisabled: true,
          dispatchGenerosityPress: dispatchGenerosityPressSpy,
        });

        BetslipBetControls.mock.calls[0][0].onGenerosityPress();

        expect(dispatchGenerosityPressSpy).not.toHaveBeenCalled();
      });
    });
  });

  describe("when free bets are removed", () => {
    it("should dispatch", () => {
      const dispatchStakeChangeSpy = jest.fn();

      renderBetControls({
        combinationId: "combinationId",
        generosityType: "generosityType",
        dispatchGenerosityWalletRemoveAction: dispatchStakeChangeSpy,
        dispatchGenerosityRemoveAction: dispatchStakeChangeSpy,
      });

      BetslipBetControls.mock.calls[0][0].onGenerosityRemovePress(3);

      expect(dispatchStakeChangeSpy).toHaveBeenCalledWith("combinationId", "generosityType");
      expect(dispatchStakeChangeSpy).toHaveBeenCalledTimes(2);
    });
  });
});
