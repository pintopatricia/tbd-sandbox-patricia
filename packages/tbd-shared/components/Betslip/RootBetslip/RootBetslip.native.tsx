import { FunctionComponent, PropsWithChildren, useCallback, useMemo } from "react";
import { Keyboard } from "react-native";

import { BetslipType } from "@ppb/tbd-store/state/constants";

import { i18n } from "../../../helpers/i18n";
import ConnectedConfirmationDrawer from "../ConfirmationDrawer";
import { ConfirmationDrawer } from "../ConfirmationDrawer/ConfirmationDrawer.native";
import { KeyboardProvider } from "../Keyboard/KeyboardContext";
import { RootBetslipContextProvider } from "./RootBetslipContext";
import { ComponentProps } from "./props";
import { BetslipDrawer } from "./snowflakes/BetslipDrawer/BetslipDrawer.native";
import ConnectedCollapsedView from "./snowflakes/CollapsedView/index";
import { CollapsedView } from "./snowflakes/CollapsedView/CollapsedView.native";
import { useExperimentVariant } from "../../../experimentation/hooks/useExperimentVariant";
import ConnectedQuickBetslipView from "./snowflakes/QuickBetslipView/index";
import { QuickBetslipView } from "./snowflakes/QuickBetslipView/QuickBetslipView.native";
import { QuickBetslipBet } from "@ppb/tbd-store/state/betslip/Betslip.types";

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

export const RootBetslip: FunctionComponent<ComponentProps> = ({
  quickBetslipBet,
  hasMultiples,
  hasConfirmation,
  isClosed,
  activeProduct,
  step,
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
    Keyboard.dismiss();
    dispatchHeaderToggle(isCollapsed, betslipSubType);
  }, [step, isCollapsed, hasMultiples, dispatchHeaderToggle, dispatchDismissClick]);

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
    if (isCollapsed) {
      return <ConnectedCollapsedView component={CollapsedView} onClick={handleHeaderToggle} />;
    }

    return (
      <BetslipDrawer title={title} step={step} activeBetslipType={activeBetslipType} onClose={handleHeaderToggle} />
    );
  }, [isCollapsed, title, step, activeBetslipType, handleHeaderToggle]);

  const keyboardProviderContent = useMemo(() => {
    if (quickBetslipBet && isCollapsed && step !== "REPORT") {
      return (
        <QuickBetslipExperimentAwareView quickBetslipBet={quickBetslipBet} onClick={handleHeaderToggle}>
          {masterBetslip}
        </QuickBetslipExperimentAwareView>
      );
    }

    return masterBetslip;
  }, [quickBetslipBet, isCollapsed, step, handleHeaderToggle, masterBetslip]);

  if (isClosed || activeProduct !== "SPORTSBOOK") {
    return null;
  }

  return (
    <RootBetslipContextProvider isCollapsed={isCollapsed}>
      <KeyboardProvider>{keyboardProviderContent}</KeyboardProvider>
      {hasConfirmation && <ConnectedConfirmationDrawer component={ConfirmationDrawer} />}
    </RootBetslipContextProvider>
  );
};
