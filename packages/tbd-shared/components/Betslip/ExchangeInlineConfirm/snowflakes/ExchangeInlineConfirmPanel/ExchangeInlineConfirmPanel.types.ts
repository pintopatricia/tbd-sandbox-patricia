import type { ExchangeSide } from "@ppb/tbd-store/state/betting/exchange-bets/ExchangeBet.types";
import type {
  ActionButtonOnTap,
  AlertProps,
  FixedNumberInputFieldProps,
  FreeBetsProps,
  PNLAndWhatIfProps,
  PrimaryButtonProps,
  SecondaryButtonProps,
} from "@ppb/the-wall-common/types";
import type { InlinePanelProps, InlinePanelOnAction } from "../../../InlinePanel/InlinePanel.types";
import { CurrencyNumberInputFieldProps } from "@ppb/the-wall-common/types/InputsAndControls/CurrencyNumberInputField.types";

export type ExchangeInlineConfirmPanelProps = {
  labels: {
    edit: SecondaryButtonProps["label"];
    price: NonNullable<FixedNumberInputFieldProps["label"]>;
    size: NonNullable<CurrencyNumberInputFieldProps["label"]>;
  };
  title: NonNullable<InlinePanelProps["title"]>;
  titlePrefix?: InlinePanelProps["titlePrefix"];
  freeBets?: FreeBetsProps["label"];
  side: ExchangeSide;
  price: number;
  size: number;
  currencySymbol: NonNullable<CurrencyNumberInputFieldProps["currencySymbol"]>;
  profitLabel: NonNullable<PrimaryButtonProps["secondaryLabel"]>;
  profitValue: NonNullable<PNLAndWhatIfProps["pnl"]>;
  profitRawValue: NonNullable<PNLAndWhatIfProps["rawPnl"]>;
  loading: NonNullable<PrimaryButtonProps["loadingLabel"]>;
  confirm: PrimaryButtonProps["label"];
  error?: AlertProps;
  betDelay?: PrimaryButtonProps["delay"];
  isFreeBetsSelected: boolean;
};

export type ExchangeInlineConfirmPanelCallbacks = {
  onCancel: InlinePanelOnAction;
  onConfirm: ActionButtonOnTap;
  onEdit: ActionButtonOnTap;
};

export type ExchangeInlineConfirmPanelViewModel = ExchangeInlineConfirmPanelProps & ExchangeInlineConfirmPanelCallbacks;
