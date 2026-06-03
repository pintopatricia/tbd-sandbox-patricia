import { FunctionComponent } from "react";

import { ComponentProps } from "./props";

import ConnectedExchangeInlinePlace from "../ExchangeInlinePlace";
import { ExchangeInlinePlace } from "../ExchangeInlinePlace/ExchangeInlinePlace.native";
import ConnectedExchangeInlineConfirm from "../ExchangeInlineConfirm";
import { ExchangeInlineConfirm } from "../ExchangeInlineConfirm/ExchangeInlineConfirm.native";
import ConnectedExchangeInlineReceipt from "../ExchangeInlineReceipt";
import { ExchangeInlineReceipt } from "../ExchangeInlineReceipt/ExchangeInlineReceipt.native";
import ConnectedExchangeInlineEdit from "../ExchangeInlineEdit";
import { ExchangeInlineEdit } from "../ExchangeInlineEdit/ExchangeInlineEdit.native";
import { KeyboardProvider } from "../Keyboard/KeyboardContext";

const RootInlineBetslip: FunctionComponent<ComponentProps> = ({ step }) => (
  <KeyboardProvider>
    {step === "PLACE_POTENTIAL" && <ConnectedExchangeInlinePlace component={ExchangeInlinePlace} />}
    {step === "EDIT_POTENTIAL" && <ConnectedExchangeInlinePlace component={ExchangeInlinePlace} isEditing />}
    {step === "CONFIRM_POTENTIAL" && <ConnectedExchangeInlineConfirm component={ExchangeInlineConfirm} />}
    {step === "REPORT" && <ConnectedExchangeInlineReceipt component={ExchangeInlineReceipt} />}
    {step === "EDIT_UNMATCHED" && <ConnectedExchangeInlineEdit component={ExchangeInlineEdit} />}
  </KeyboardProvider>
);

export default RootInlineBetslip;
