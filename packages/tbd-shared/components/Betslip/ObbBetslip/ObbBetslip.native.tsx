import { FunctionComponent } from "react";
import ConnectedObbPlace from "../ObbPlace";
import { ObbPlace } from "../ObbPlace/ObbPlace.native";
import ConnectedObbBetReceipt from "../ObbBetReceipt";
import { ObbBetReceipt } from "../ObbBetReceipt/ObbBetReceipt.native";
import { ComponentProps } from "./props";

export const ObbBetslip: FunctionComponent<ComponentProps> = ({ step }) => (
  <>
    {step === "PLACE_POTENTIAL" && <ConnectedObbPlace component={ObbPlace} />}
    {step === "REPORT" && <ConnectedObbBetReceipt component={ObbBetReceipt} />}
  </>
);
