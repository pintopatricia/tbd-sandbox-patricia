import { FunctionComponent } from "react";

import ConnectedExchangeInlinePlace from "../ExchangeInlinePlace";
import { ExchangeInlinePlace } from "../ExchangeInlinePlace/ExchangeInlinePlace.web";
import ConnectedExchangeInlineConfirm from "../ExchangeInlineConfirm";
import { ExchangeInlineConfirm } from "../ExchangeInlineConfirm/ExchangeInlineConfirm.web";
import ConnectedExchangeInlineReceipt from "../ExchangeInlineReceipt";
import { ExchangeInlineReceipt } from "../ExchangeInlineReceipt/ExchangeInlineReceipt.web";
import ConnectedExchangeInlineEdit from "../ExchangeInlineEdit";
import { ExchangeInlineEdit } from "../ExchangeInlineEdit/ExchangeInlineEdit.web";
import { KeyboardProvider } from "../Keyboard/KeyboardContext";

import { ComponentProps } from "./props";

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
