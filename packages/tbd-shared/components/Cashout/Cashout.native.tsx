import type { JSX } from "react";
import { FunctionComponent, useCallback, useEffect, useMemo, useRef } from "react";
import { PNLAndWhatIfSize } from "@ppb/the-wall-common/types/PNLAndWhatIf.types";
import { PNLAndWhatIf, PrimaryButton, Text } from "@ppb/the-wall-native";
import { useHaptics } from "@ppb/the-wall-native/hooks/useHaptics";
import { CashoutStep } from "@ppb/tbd-store/state/constants";
import actionLinkStyles from "@ppb/the-wall-native/components/ActionLink/ActionLink.styles";
import { Linking } from "react-native";
import { ComponentProps } from "./props";
import { i18n } from "../../helpers/i18n";

const RESET_BUTTON_STATE_TIMEOUT = 5000;

const Cashout: FunctionComponent<ComponentProps> = ({
  rawSecondaryValue,
  cashoutURN,
  isVisible,
  isDisabled,
  isConfirmStepActive,
  showWhyIsThisLink,
  suspendedSupportUrl,
  state,
  step,
  dispatchCashoutTap,
  dispatchCashoutTransaction,
  dispatchUndoConfirm,
  stopAnimation,
  betDelay,
  detailLabel,
  formattedSecondaryValueLabel,
  buttonLabel,
  loadingLabel,
}): JSX.Element => {
  const { trigger: triggerHapticFeedback } = useHaptics();
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const previousStepRef = useRef(step);
  const onTakeCashoutCallback = useCallback(() => {
    dispatchCashoutTap(cashoutURN, isConfirmStepActive);

    if (step === CashoutStep.CONFIRM || !isConfirmStepActive) {
      dispatchCashoutTransaction(cashoutURN);
    }
  }, [dispatchCashoutTap, dispatchCashoutTransaction, step, isConfirmStepActive, cashoutURN]);
  const onWhyIsThisClick = useCallback(
    () => suspendedSupportUrl && suspendedSupportUrl !== "" && Linking.openURL(suspendedSupportUrl),
    [suspendedSupportUrl],
  );

  useEffect(() => {
    clearTimeout(timeoutRef.current);

    if (step === CashoutStep.CONFIRM) {
      timeoutRef.current = setTimeout(() => dispatchUndoConfirm(cashoutURN), RESET_BUTTON_STATE_TIMEOUT);
    }

    return () => clearTimeout(timeoutRef.current);
  }, [cashoutURN, dispatchUndoConfirm, step]);

  // Trigger haptic feedback on cashout success/failure
  useEffect(() => {
    const previousStep = previousStepRef.current;
    if (previousStep === CashoutStep.CASHING_OUT && step === CashoutStep.RECEIPT) {
      triggerHapticFeedback("success");
    } else if (previousStep === CashoutStep.CASHING_OUT && step === CashoutStep.DISPLAY) {
      triggerHapticFeedback("error");
    }
    previousStepRef.current = step;
  }, [step, triggerHapticFeedback]);

  return useMemo(
    () => (
      <>
        {isVisible && (
          <PrimaryButton
            state={state}
            label={buttonLabel}
            secondaryLabel={detailLabel}
            onTap={onTakeCashoutCallback}
            disabled={isDisabled}
            loadingLabel={loadingLabel}
            stopAnimation={stopAnimation}
            delay={betDelay}
            variant={"transactional"}
          >
            {showWhyIsThisLink && (
              <Text
                onPress={onWhyIsThisClick}
                style={[actionLinkStyles.actionLink, actionLinkStyles.textSmall, actionLinkStyles.default]}
              >
                {i18n({ key: "I18N.CASH_OUT_SUSPENSION_MESSAGING_PT_2" })}
              </Text>
            )}
            {!!formattedSecondaryValueLabel && (
              <PNLAndWhatIf
                pnl={formattedSecondaryValueLabel}
                rawPnl={rawSecondaryValue}
                size={PNLAndWhatIfSize.MEDIUM}
                disabled={state === "default" && isDisabled}
                agnostic={state === "default"}
              />
            )}
          </PrimaryButton>
        )}
      </>
    ),
    [
      betDelay,
      isDisabled,
      isVisible,
      buttonLabel,
      loadingLabel,
      onTakeCashoutCallback,
      detailLabel,
      formattedSecondaryValueLabel,
      rawSecondaryValue,
      state,
      stopAnimation,
      showWhyIsThisLink,
      onWhyIsThisClick,
    ],
  );
};

export default Cashout;
