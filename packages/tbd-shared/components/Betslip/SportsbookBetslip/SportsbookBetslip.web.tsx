import { FunctionComponent, useEffect, useContext } from "react";

import { RootBetslipContext } from "../RootBetslip/RootBetslipContext";
import ConnectedSportsbookReceipt from "../SportsbookReceipt";
import { SportsbookReceipt } from "../SportsbookReceipt/SportsbookReceipt.web";
import ConnectedSportsbookPlace from "../SportsbookPlace";
import { SportsbookPlace } from "../SportsbookPlace/SportsbookPlace.web";
import ConnectedSportsbookConfirm from "../SportsbookConfirm";
import { SportsbookConfirm } from "../SportsbookConfirm/SportsbookConfirm.web";
import { RefProvider } from "../../RefContext";

import { ComponentProps } from "./props";

export const SportsbookBetslip: FunctionComponent<ComponentProps> = ({ step }) => {
  const { setIsBetConfirmationStep } = useContext(RootBetslipContext);

  useEffect(() => {
    if (step === "CONFIRM_POTENTIAL") {
      setIsBetConfirmationStep(true);
    } else {
      setIsBetConfirmationStep(false);
    }
  }, [step, setIsBetConfirmationStep]);

  return (
    <>
      {step === "PLACE_POTENTIAL" && (
        <RefProvider>
          <ConnectedSportsbookPlace component={SportsbookPlace} />
        </RefProvider>
      )}
      {step === "CONFIRM_POTENTIAL" && <ConnectedSportsbookConfirm component={SportsbookConfirm} />}
      {step === "REPORT" && <ConnectedSportsbookReceipt component={SportsbookReceipt} />}
    </>
  );
};
