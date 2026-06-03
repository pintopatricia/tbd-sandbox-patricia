import type {
  ActionButtonOnTap,
  AlertsProps,
  FreeBetsOnChangeCallback,
  FreeBetsProps,
  NudgesNumberInputFieldOnBlur,
  NudgesNumberInputFieldOnChange,
  NudgesNumberInputFieldOnNudge,
  NudgesNumberInputFieldProps,
  PNLAndWhatIfProps,
  PrimaryButtonProps,
  QuickStakesOnTouch,
  QuickStakesProps,
} from "@ppb/the-wall-common/types";

type ExchangeInlinePlacePanelOnFreeBetsChange = FreeBetsOnChangeCallback;
type ExchangeInlinePlacePanelOnNudgeDown = NudgesNumberInputFieldOnNudge;
type ExchangeInlinePlacePanelOnNudgeUp = NudgesNumberInputFieldOnNudge;
type ExchangeInlinePlacePanelOnPlaceClick = ActionButtonOnTap;
type ExchangeInlinePlacePanelOnPriceChange = NudgesNumberInputFieldOnChange;
type ExchangeInlinePlacePanelOnPriceBlur = NudgesNumberInputFieldOnBlur;
type ExchangeInlinePlacePanelOnPriceFocus = () => void;
export type ExchangeInlinePlacePanelOnQuickStakeTouch = QuickStakesOnTouch;
type ExchangeInlinePlacePanelOnSizeChange = NudgesNumberInputFieldOnChange;
type ExchangeInlinePlacePanelOnSizeFocus = () => void;
type ExchangeInlinePlacePanelOnSizeBlur = NudgesNumberInputFieldOnBlur;
type ExchangeInlinePlacePanelOnPriceMouseDown = (e: React.MouseEvent<HTMLDivElement>) => void;
type ExchangeInlinePlacePanelOnSizeMouseDown = (e: React.MouseEvent<HTMLDivElement>) => void;

type ExchangeInlinePlacePanelCallbacks = {
  onFreeBetsChange: ExchangeInlinePlacePanelOnFreeBetsChange;
  onPriceNudgeDown: ExchangeInlinePlacePanelOnNudgeDown;
  onPriceNudgeUp: ExchangeInlinePlacePanelOnNudgeUp;
  onSizeNudgeDown: ExchangeInlinePlacePanelOnNudgeDown;
  onSizeNudgeUp: ExchangeInlinePlacePanelOnNudgeUp;
  onPlaceClick: ExchangeInlinePlacePanelOnPlaceClick;
  onPriceChange: ExchangeInlinePlacePanelOnPriceChange;
  onPriceBlur: ExchangeInlinePlacePanelOnPriceBlur;
  onPriceFocus: ExchangeInlinePlacePanelOnPriceFocus;
  onQuickStakeTouch: ExchangeInlinePlacePanelOnQuickStakeTouch;
  onSizeChange: ExchangeInlinePlacePanelOnSizeChange;
  onSizeFocus: ExchangeInlinePlacePanelOnSizeFocus;
  onSizeBlur: ExchangeInlinePlacePanelOnSizeBlur;
  onPriceMouseDown?: ExchangeInlinePlacePanelOnPriceMouseDown;
  onSizeMouseDown?: ExchangeInlinePlacePanelOnSizeMouseDown;
};

export type ExchangeInlinePlacePanelProps = {
  currencySymbol: NonNullable<NudgesNumberInputFieldProps["currencySymbol"]>;
  hasFreeBets: boolean;
  hasPlaceError?: PrimaryButtonProps["stopAnimation"];
  isFreeBetsSelected: boolean;
  isPlaceButtonDisabled: boolean;
  loadingLabel: NonNullable<PrimaryButtonProps["loadingLabel"]>;
  disabled: boolean;
  placeBtnLabel: PrimaryButtonProps["label"];
  pricePlaceholder: NonNullable<NudgesNumberInputFieldProps["label"]>;
  quickStakes: NonNullable<QuickStakesProps["quickStakes"]>;
  sizePlaceholder: NonNullable<NudgesNumberInputFieldProps["label"]>;
  betDelay?: PrimaryButtonProps["delay"];
  freeBetsLabel?: FreeBetsProps["label"];
  notifications?: AlertsProps["alerts"];
  price?: number;
  profitLabel?: PrimaryButtonProps["secondaryLabel"];
  profitValue?: PNLAndWhatIfProps["pnl"];
  profitRawValue?: PNLAndWhatIfProps["rawPnl"];
  size?: number;
  priceInputId: string;
  sizeInputId: string;
  focusedInputId: string | null;
};

export type ExchangeInlinePlacePanelViewModel = ExchangeInlinePlacePanelProps & ExchangeInlinePlacePanelCallbacks;
