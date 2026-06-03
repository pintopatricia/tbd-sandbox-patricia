import { render, act } from "@testing-library/react";
import "jest-dom/extend-expect";

import { KeyboardSeparator } from "@ppb/the-wall-common/types";
import { BetslipBetControls } from "@ppb/the-wall-web";

import { RootBetslipContext } from "../RootBetslip/RootBetslipContext";
import { KeyboardContext } from "../Keyboard/KeyboardContext";
import { ConfigContext } from "../../Config/ConfigContext";

import { BetControls } from "./BetControls.web";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useId: () => "unique-id",
}));
jest.mock("@ppb/the-wall-web", () => ({
  BetslipBetControls: jest.fn(() => <betslip-bet-controls />),
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

const ConfigContextProviderMock = ({ isDesktopLayout, children }) => (
  <ConfigContext.Provider value={{ isDesktopLayout }}>{children}</ConfigContext.Provider>
);

function renderBetControls(
  {
    combinationId,
    shouldFocusStakeField,
    odds,
    previousOdds,
    oddsMovement,
    stake,
    separator = KeyboardSeparator.Dot,
    eachWaySubtitle,
    isDesktop = false,
    isPanelDisabled,
    isEachWaySelected,
    isStartingPriceSelected = false,
    isAccaInsuranceSelected,
    isPriceBoostSelected,
    isGenerosityWalletSelected,
    isStakeValid,
    hasEachWay,
    hasGenerosity,
    hasAccaInsurance,
    hasStartingPrice,
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
    returnsLabel = "Returns",
    displayReturns = true,
    linesLabel,
    dividendBetLabel,
    multiplier,
    labels = {},
    generosityAlertMessage,
    isGenerosityDisabled = false,
    hasStakeCaret,
    generosityIconName,
    generosityType,
    dispatchPriceBoostPress,
    dispatchGenerosityPress,
    dispatchStakeChange,
    dispatchStakeValidate,
    dispatchEachWayPress,
    dispatchAccaInsurancePress,
    dispatchStartPricePress,
    dispatchGenerosityWalletRemoveAction,
    dispatchGenerosityRemoveAction,
  },
  keyboardContext = {},
  rootContext = {},
) {
  return render(
    <ConfigContextProviderMock isDesktopLayout={isDesktop}>
      <RootBetslipProviderMock
        registerCollapseListener={rootContext.registerCollapseListener}
        isBetConfirmationStep={rootContext.isBetConfirmationStep || false}
      >
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
          <BetControls
            combinationId={combinationId}
            shouldFocusStakeField={shouldFocusStakeField}
            hasAccaInsurance={hasAccaInsurance}
            hasEachWay={hasEachWay}
            hasGenerosity={hasGenerosity}
            hasStartingPrice={hasStartingPrice}
            isPanelDisabled={isPanelDisabled}
            isAccaInsuranceSelected={isAccaInsuranceSelected}
            isEachWaySelected={isEachWaySelected}
            isPriceBoostSelected={isPriceBoostSelected}
            isGenerosityWalletSelected={isGenerosityWalletSelected}
            isStakeValid={isStakeValid}
            isStartingPriceSelected={isStartingPriceSelected}
            accaInsuranceTitle={accaInsuranceTitle}
            accaInsuranceSubtitle={accaInsuranceSubtitle}
            accaInsuranceTermsLabel={accaInsuranceTermsLabel}
            accaInsuranceTermsUrl={accaInsuranceTermsUrl}
            odds={odds}
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
            linesLabel={linesLabel}
            dividendBetLabel={dividendBetLabel}
            eachWaySubtitle={eachWaySubtitle}
            hasStakeCaret={hasStakeCaret}
            labels={labels}
            generosityAlertMessage={generosityAlertMessage}
            isGenerosityDisabled={isGenerosityDisabled}
            generosityIconName={generosityIconName}
            generosityType={generosityType}
            dispatchStakeChange={dispatchStakeChange}
            dispatchStakeValidate={dispatchStakeValidate}
            dispatchEachWayPress={dispatchEachWayPress}
            dispatchAccaInsurancePress={dispatchAccaInsurancePress}
            dispatchPriceBoostPress={dispatchPriceBoostPress}
            dispatchGenerosityPress={dispatchGenerosityPress}
            dispatchStartPricePress={dispatchStartPricePress}
            dispatchGenerosityWalletRemoveAction={dispatchGenerosityWalletRemoveAction}
            dispatchGenerosityRemoveAction={dispatchGenerosityRemoveAction}
          />
        </KeyboardContextProviderMock>
      </RootBetslipProviderMock>
    </ConfigContextProviderMock>,
  );
}

const BET_CONTROLS_DEFAULT_PROPS = {
  combinationId: "testId",
  isPanelDisabled: false,
  odds: "3/4",
  oddsMovement: "UP",
  oddsMovementDown: "Down Label",
  oddsMovementUp: "Up Label",
  previousOdds: "Previous Odds",
  currencySymbol: "$",
  bonusAvailabilityLabel: "Bonus not available",
  formattedOriginalPotentialReturns: "",
  formattedPotentialReturns: "?",
  returnsLabel: "Returns",
  linesLabel: "X Lines",
  dividendBetLabel: "Dividend Bet",
  labels: {
    odds: "Odds",
    stake: "Stake",
    eachWayTitle: "Each Way Title",
    oddsMovementUp: "Movement Up",
    oddsMovementDown: "Movement Down",
    generosityAlertRemoveLabel: "Generosity Alert Remove Label",
  },
  eachWaySubtitle: "Each Way Subtitle",
  accaInsuranceTitle: "AccaInsurance Title",
  accaInsuranceSubtitle: "AccaInsurance Subtitle",
  accaInsuranceTermsLabel: "AccaInsurance Terms Label",
  hasEachWay: true,
  isEachWaySelected: true,
  multiplier: "2x",
  hasAccaInsurance: true,
  accaInsuranceTermsUrl: "AccaInsurance Terms Url",
  isAccaInsuranceSelected: true,
  isPriceBoostSelected: true,
  isGenerosityWalletSelected: true,
  isStakeValid: true,
  hasGenerosity: true,
  hasStakeCaret: true,
  hasStartingPrice: true,
  hintMessage: "Hint Message",
  hintType: "Hint Type",
  generosityAlertMessage: "Generosity Alert Message",
  generosityAlertRemoveLabel: "Generosity Alert Remove Label",
  isGenerosityDisabled: false,
  displayReturns: true,
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
  startingPriceTitle: undefined,
  hasAccaInsurance: true,
  hasEachWay: true,
  hasGenerosity: true,
  hasStartingPrice: true,
  hintMessage: "Hint Message",
  hintType: "Hint Type",
  id: "testId",
  isStartingPriceSelected: false,
  isAccaInsuranceSelected: true,
  isEachWaySelected: true,
  isPanelDisabled: false,
  isPriceBoostSelected: true,
  isGenerositySelected: true,
  isStartingPriceDisabled: false,
  isEachWayDisabled: false,
  isAccaInsuranceDisabled: false,
  isStakeFocused: false,
  isStakeReadonly: false,
  isStakeValid: true,
  formattedOriginalPotentialReturns: "",
  formattedPotentialReturns: "?",
  returnsLabel: "Returns",
  linesLabel: "X Lines",
  dividendBetLabel: "Dividend Bet",
  multiplier: "2x",
  odds: "3/4",
  oddsLabel: "Odds",
  oddsMovement: "UP",
  oddsMovementDown: "Movement Down",
  oddsMovementUp: "Movement Up",
  onAccaInsurancePress: expect.any(Function),
  onEachWayPress: expect.any(Function),
  onGenerosityPress: expect.any(Function),
  onStartingPricePress: expect.any(Function),
  onStakeBlur: expect.any(Function),
  onStakeChange: expect.any(Function),
  onStakeFocus: expect.any(Function),
  previousOdds: "Previous Odds",
  stake: undefined,
  stakeLabel: "Stake",
  separator: KeyboardSeparator.Dot,
  generosityAlertMessage: "Generosity Alert Message",
  generosityAlertRemoveLabel: "Generosity Alert Remove Label",
  isGenerosityDisabled: false,
  hasStakeCaret: true,
  displayReturns: true,
  onGenerosityRemovePress: expect.any(Function),
  generosityIconName: "icon name",
};

describe("BetControls", () => {
  afterEach(jest.clearAllMocks);

  describe("BetControls", () => {
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
          undefined,
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

    describe("when the panel is disabled due to order from keyboard context", () => {
      it("should render BetControls with disabled props", () => {
        renderBetControls(
          {
            combinationId: "MULT:1",
            isPanelDisabled: false,
          },
          {},
          {
            isBetConfirmationStep: true,
          },
        );

        expect(BetslipBetControls).toHaveBeenCalledWith(
          expect.objectContaining({
            isPanelDisabled: false,
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
          {},
          {
            isBetConfirmationStep: true,
          },
        );

        expect(BetslipBetControls).toHaveBeenCalledTimes(1);

        expect(BetslipBetControls).toHaveBeenCalledWith(
          {
            ...BETSLIP_BET_CONTROLS_DEFAULT_PROPS,
            isStakeFocused: false,
            isPanelDisabled: false,
            isPriceBoostSelected: true,
            isGenerositySelected: true,
            isGenerosityDisabled: false,
            isStartingPriceDisabled: true,
            isEachWayDisabled: true,
            isAccaInsuranceDisabled: true,
            isStakeReadonly: true,
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
            renderBetControls(
              { combinationId: "id", shouldFocusStakeField: false },
              {
                setFocusedKeyboardControls,
              },
            );

            expect(setFocusedKeyboardControls).not.toHaveBeenCalled();
          });
        });

        describe("when shouldFocusStakeField is true", () => {
          it("should set focused input ID", () => {
            const setFocusedKeyboardControls = jest.fn();
            renderBetControls(
              { combinationId: "id", shouldFocusStakeField: true },
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
            expect(setFocusedKeyboardControls).toHaveBeenCalledTimes(1);
          });
        });
      });
    });

    describe("isStakeFocused", () => {
      describe("when focusedInputId is equal to input ID", () => {
        it("should call BetControls with focused as true", () => {
          const setFocusedKeyboardControls = jest.fn();
          renderBetControls(
            { combinationId: "id", uniqueInputId: "unique-id" },
            {
              focusedKeyboardControls: { focusedInputId: "unique-id" },
              setFocusedKeyboardControls,
            },
          );

          const [props] = BetslipBetControls.mock.calls[0];

          expect(props.isStakeFocused).toEqual(true);
        });
      });

      describe("when focusedInputId is different to input ID", () => {
        it("should call BetControls with focused as false", () => {
          const setFocusedKeyboardControls = jest.fn();
          renderBetControls(
            { combinationId: "id" },
            {
              focusedKeyboardControls: { focusedInputId: "other-id" },
              setFocusedKeyboardControls,
            },
          );

          const [props] = BetslipBetControls.mock.calls[0];

          expect(props.isStakeFocused).toEqual(false);
        });
      });
    });

    describe("onStakeFocus", () => {
      describe("when `focused` argument is true", () => {
        describe("when shouldFocusStakeField is true", () => {
          it("should synchronously call setFocusedKeyboardControls", () => {
            const setFocusedKeyboardControls = jest.fn();
            renderBetControls({ combinationId: "id", shouldFocusStakeField: true }, { setFocusedKeyboardControls });
            const { onStakeFocus } = BetslipBetControls.mock.calls[0][0];

            act(() => {
              onStakeFocus(true);
            });

            expect(setFocusedKeyboardControls).toHaveBeenNthCalledWith(2, {
              focusedCombinationId: "id",
              focusedInputId: "unique-id",
              focusedInputRef: expect.anything(),
              focusedTargetRef: expect.anything(),
            });
          });
        });

        describe("when shouldFocusStakeField is false", () => {
          it("should call setFocusedInputId after timeout", () => {
            jest.useFakeTimers();
            const setFocusedKeyboardControls = jest.fn();
            renderBetControls({ combinationId: "id", shouldFocusStakeField: false }, { setFocusedKeyboardControls });
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
              renderBetControls(
                { combinationId: "id", isDesktop: true },
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
                focusedInputId: "id",
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
              renderBetControls(
                { combinationId: "id", isDesktop: true },
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
            renderBetControls({ combinationId: "id" }, { setFocusedKeyboardControls });
            const { onStakeFocus } = BetslipBetControls.mock.calls[0][0];

            act(() => {
              onStakeFocus(false);
            });

            expect(setFocusedKeyboardControls).not.toHaveBeenCalled();
          });
        });
      });
    });
  });

  describe("when a stake is changed", () => {
    it("should dispatch", () => {
      const dispatchStakeChangeSpy = jest.fn();

      renderBetControls({
        combinationId: "MULT:1",
        dispatchStakeChange: dispatchStakeChangeSpy,
      });

      BetslipBetControls.mock.calls[0][0].onStakeChange(3);

      expect(dispatchStakeChangeSpy).toHaveBeenCalledWith({ id: "MULT:1", newValue: 3 });
      expect(dispatchStakeChangeSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("when a stake is blurred", () => {
    it("should dispatch stake validation after 50ms", () => {
      jest.useFakeTimers();
      const dispatchStakeValidateSpy = jest.fn();

      renderBetControls({
        combinationId: "MULT:1",
        dispatchStakeValidate: dispatchStakeValidateSpy,
      });

      const { onStakeBlur } = BetslipBetControls.mock.calls[0][0];

      act(() => {
        onStakeBlur();
      });

      expect(dispatchStakeValidateSpy).toHaveBeenCalledTimes(0);

      jest.advanceTimersByTime(50);

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
        const dispatchStartingPricePressSpy = jest.fn();

        renderBetControls({
          isPanelDisabled: false,
          combinationId: "MULT:1",
          dispatchStartPricePress: dispatchStartingPricePressSpy,
        });

        BetslipBetControls.mock.calls[0][0].onStartingPricePress(true);

        expect(dispatchStartingPricePressSpy).toHaveBeenCalledWith("MULT:1", true);
        expect(dispatchStartingPricePressSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe("when the panel is disabled", () => {
      it("should not dispatch", () => {
        const dispatchStartingPricePressSpy = jest.fn();

        renderBetControls({
          isPanelDisabled: true,
          combinationId: "MULT:1",
          dispatchStartPricePress: dispatchStartingPricePressSpy,
        });

        BetslipBetControls.mock.calls[0][0].onStartingPricePress(true);

        expect(dispatchStartingPricePressSpy).not.toHaveBeenCalled();
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
