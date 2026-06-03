import { FunctionComponent } from "react";
import ConnectedObbPlace from "../ObbPlace";
import { ObbPlace } from "../ObbPlace/ObbPlace.web";
import { ObbBetReceipt } from "../ObbBetReceipt/ObbBetReceipt.web";
import ConnectedObbBetReceipt from "../ObbBetReceipt";
import { ComponentProps } from "./props";
import { RefProvider } from "../../RefContext";

export const ObbBetslip: FunctionComponent<ComponentProps> = ({ step }) => (
  <>
    {step === "PLACE_POTENTIAL" && (
      <RefProvider>
        <ConnectedObbPlace component={ObbPlace} />
      </RefProvider>
    )}
    {step === "REPORT" && <ConnectedObbBetReceipt component={ObbBetReceipt} />}
  </>
);
