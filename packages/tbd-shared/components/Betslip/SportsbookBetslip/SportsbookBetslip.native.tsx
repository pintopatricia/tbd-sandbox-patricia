import { FunctionComponent, useEffect, useContext, useRef } from "react";
import { useHaptics } from "@ppb/the-wall-native/hooks/useHaptics";

import { RootBetslipContext } from "../RootBetslip/RootBetslipContext";
import ConnectedSportsbookReceipt from "../SportsbookReceipt";
import { SportsbookReceipt } from "../SportsbookReceipt/SportsbookReceipt.native";
import ConnectedSportsbookPlace from "../SportsbookPlace";
import { SportsbookPlace } from "../SportsbookPlace/SportsbookPlace.native";
import ConnectedSportsbookConfirm from "../SportsbookConfirm";
import { SportsbookConfirm } from "../SportsbookConfirm/SportsbookConfirm.native";

import { ComponentProps } from "./props";

export const SportsbookBetslip: FunctionComponent<ComponentProps> = ({ step, placeStatus }) => {
  const { setIsBetConfirmationStep } = useContext(RootBetslipContext);
  const { trigger: triggerHapticFeedback } = useHaptics();
  const previousStepRef = useRef(step);
  const previousPlaceStatusRef = useRef(placeStatus);

  useEffect(() => {
    if (step === "CONFIRM_POTENTIAL") {
      setIsBetConfirmationStep(true);
    } else {
      setIsBetConfirmationStep(false);
    }
  }, [step, setIsBetConfirmationStep]);

  // Trigger haptic feedback on bet placement success
  useEffect(() => {
    const previousStep = previousStepRef.current;
    if (previousStep !== "REPORT" && step === "REPORT") {
      triggerHapticFeedback("success");
    }
    previousStepRef.current = step;
  }, [step, triggerHapticFeedback]);

  // Trigger haptic feedback on bet placement error
  useEffect(() => {
    const previousPlaceStatus = previousPlaceStatusRef.current;
    if (previousPlaceStatus === "INPROGRESS" && placeStatus === "FAILURE") {
      triggerHapticFeedback("error");
    }
    previousPlaceStatusRef.current = placeStatus;
  }, [placeStatus, triggerHapticFeedback]);

  return (
    <>
      {step === "PLACE_POTENTIAL" && <ConnectedSportsbookPlace component={SportsbookPlace} />}
      {step === "CONFIRM_POTENTIAL" && <ConnectedSportsbookConfirm component={SportsbookConfirm} />}
      {step === "REPORT" && <ConnectedSportsbookReceipt component={SportsbookReceipt} />}
    </>
  );
};
