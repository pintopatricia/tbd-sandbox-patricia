import type { JSX } from "react";
import { FunctionComponent, useCallback, useEffect, useMemo, useRef } from "react";
import { PNLAndWhatIfSize } from "@ppb/the-wall-common/types/PNLAndWhatIf.types";
import { PNLAndWhatIf, PrimaryButton } from "@ppb/the-wall-web";
import { CashoutStep } from "@ppb/tbd-store/state/constants";
import actionLinkStyles from "@ppb/the-wall-web/components/bricks/ActionLink/ActionLink.module.css";
import classNames from "classnames";
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
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const onTakeCashoutCallback = useCallback(() => {
    dispatchCashoutTap(cashoutURN, isConfirmStepActive);

    if (step === CashoutStep.CONFIRM || !isConfirmStepActive) {
      dispatchCashoutTransaction(cashoutURN);
    }
  }, [dispatchCashoutTap, dispatchCashoutTransaction, step, isConfirmStepActive, cashoutURN]);

  useEffect(() => {
    clearTimeout(timeoutRef.current);

    if (step === CashoutStep.CONFIRM) {
      timeoutRef.current = setTimeout(() => dispatchUndoConfirm(cashoutURN), RESET_BUTTON_STATE_TIMEOUT);
    }

    return () => clearTimeout(timeoutRef.current);
  }, [cashoutURN, dispatchUndoConfirm, step]);

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
              <a
                href={suspendedSupportUrl}
                target="_blank"
                rel="noreferrer"
                className={classNames(
                  actionLinkStyles.actionLink,
                  actionLinkStyles.textSmall,
                  actionLinkStyles.default,
                )}
              >
                {i18n({ key: "I18N.CASH_OUT_SUSPENSION_MESSAGING_PT_2" })}
              </a>
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
      suspendedSupportUrl,
    ],
  );
};

export default Cashout;
