import { FunctionComponent, PropsWithChildren, useCallback, useMemo } from "react";
import { BetslipType } from "@ppb/tbd-store/state/constants";
import { ModalBetslipProps, QuickBetslipBet } from "@ppb/tbd-store/state/betslip/Betslip.types";
import { i18n } from "../../../../helpers/i18n";
import ConnectedConfirmationDrawer from "../../ConfirmationDrawer";
import { ConfirmationDrawer } from "../../ConfirmationDrawer/ConfirmationDrawer.web";
import { BetslipDrawer } from "../snowflakes/BetslipDrawer/BetslipDrawer.web";
import ConnectedCollapsedView from "../snowflakes/CollapsedView/index";
import { CollapsedView } from "../snowflakes/CollapsedView/CollapsedView.web";
import { useExperimentVariant } from "../../../../experimentation/hooks/useExperimentVariant";
import ConnectedQuickBetslipView from "../snowflakes/QuickBetslipView/index";
import { QuickBetslipView } from "../snowflakes/QuickBetslipView/QuickBetslipView.web";

const QuickBetslipExperimentAwareView: FunctionComponent<
  PropsWithChildren<{ quickBetslipBet: QuickBetslipBet; onClick: () => void }>
> = ({ quickBetslipBet, onClick, children }) => {
  const quickBetslipExperimentVariant = useExperimentVariant("quick-betslip");

  if (quickBetslipExperimentVariant !== "quick-betslip-variant-a") {
    return children;
  }

  if (quickBetslipBet.status !== "valid") {
    return children;
  }

  const { combinationId } = quickBetslipBet;

  return <ConnectedQuickBetslipView component={QuickBetslipView} combinationId={combinationId} onClick={onClick} />;
};

export const ModalBetslip: FunctionComponent<ModalBetslipProps> = ({
  quickBetslipBet,
  hasMultiples,
  hasConfirmation,
  activeProduct,
  step,
  isClosed,
  isCollapsed,
  activeBetslipType,
  dispatchHeaderToggle,
  dispatchDismissClick,
}) => {
  const handleHeaderToggle = useCallback(() => {
    if (step === "REPORT") {
      dispatchDismissClick();
      return;
    }

    const betslipSubType = hasMultiples ? "SPORTSBOOK_MULTIPLES" : "SPORTSBOOK_SINGLES";

    dispatchHeaderToggle(isCollapsed, betslipSubType);
  }, [step, hasMultiples, dispatchHeaderToggle, isCollapsed, dispatchDismissClick]);

  const title = useMemo(() => {
    if (step === "REPORT") {
      return i18n({ key: "I18N.BETSLIP.RECEIPT_TITLE" });
    }

    if (activeBetslipType === BetslipType.OBB) {
      return i18n({ key: "I18N.OBB_BETSLIP.TITLE" });
    }

    return step === "CONFIRM_POTENTIAL"
      ? i18n({ key: "I18N.BETSLIP.REVIEW_AND_CONFIRM_BET" })
      : i18n({ key: "I18N.BETSLIP.TITLE" });
  }, [step, activeBetslipType]);

  const masterBetslip = useMemo(() => {
    return (
      <>
        {isCollapsed ? (
          <ConnectedCollapsedView component={CollapsedView} hasMultiples={hasMultiples} onClick={handleHeaderToggle} />
        ) : (
          <BetslipDrawer title={title} step={step} activeBetslipType={activeBetslipType} onClose={handleHeaderToggle} />
        )}
        {hasConfirmation && <ConnectedConfirmationDrawer component={ConfirmationDrawer} />}
      </>
    );
  }, [isCollapsed, hasMultiples, handleHeaderToggle, title, step, activeBetslipType, hasConfirmation]);

  if (isClosed || activeProduct !== "SPORTSBOOK") {
    return null;
  }

  if (quickBetslipBet && isCollapsed && step !== "REPORT") {
    return (
      <QuickBetslipExperimentAwareView quickBetslipBet={quickBetslipBet} onClick={handleHeaderToggle}>
        {masterBetslip}
      </QuickBetslipExperimentAwareView>
    );
  }

  return masterBetslip;
};
