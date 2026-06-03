import { FunctionComponent, useContext, useMemo } from "react";
import { DesktopBetslipProps, ModalBetslipProps } from "@ppb/tbd-store/state/betslip/Betslip.types";
import { ComponentProps } from "./props";
import { ModalBetslip } from "./ModalBetslip/ModalBetslip.web";
import { ConfigContext } from "../../Config/ConfigContext";
import { DesktopBetslip } from "./snowflakes/DesktopBetslip/DesktopBetslip.web";
import { RootBetslipContextProvider } from "./RootBetslipContext";
import { KeyboardProvider } from "../Keyboard/KeyboardContext";

const RootBetslip: FunctionComponent<ComponentProps> = (props) => {
  const {
    isCollapsed,
    hasMultiples,
    hasConfirmation,
    activeProduct,
    step,
    isClosed,
    activeBetslipType,
    quickBetslipBet,
    dispatchHeaderToggle,
    dispatchDismissClick,
  } = props;

  const { isDesktopLayout } = useContext(ConfigContext);

  const betslipContent = useMemo(() => {
    const modalBetslipProps: ModalBetslipProps = {
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
    };

    const desktopBetslipProps: DesktopBetslipProps = {
      activeBetslipType,
      step,
      hasConfirmation,
      onClose: step === "REPORT" ? dispatchDismissClick : undefined,
    };

    return isDesktopLayout ? <DesktopBetslip {...desktopBetslipProps} /> : <ModalBetslip {...modalBetslipProps} />;
  }, [
    quickBetslipBet,
    activeBetslipType,
    activeProduct,
    dispatchDismissClick,
    dispatchHeaderToggle,
    hasConfirmation,
    hasMultiples,
    isClosed,
    isCollapsed,
    isDesktopLayout,
    step,
  ]);

  return (
    <RootBetslipContextProvider isCollapsed={isCollapsed}>
      <KeyboardProvider>{betslipContent}</KeyboardProvider>
    </RootBetslipContextProvider>
  );
};

export default RootBetslip;
