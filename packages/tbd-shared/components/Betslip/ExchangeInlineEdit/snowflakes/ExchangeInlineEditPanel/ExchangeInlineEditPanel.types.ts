import type {
  ActionButtonOnTap,
  AlertsProps,
  CollapseProps,
  NudgesNumberInputFieldOnBlur,
  NudgesNumberInputFieldOnChange,
  NudgesNumberInputFieldOnFocus,
  NudgesNumberInputFieldOnNudge,
  NudgesNumberInputFieldProps,
  PebbleListProps,
  PNLAndWhatIfProps,
  PrimaryButtonProps,
  QuickStakesFormat,
  QuickStakesOnTouch,
  SecondaryButtonProps,
} from "@ppb/the-wall-common/types";

// TODO Export this correctly in PebbleListTypes.ts instead of PebbleList.web.types
import { PebbleListOnClick } from "@ppb/the-wall-common/types/Pebbles/PebbleList.web.types";

export type ExchangeInlineEditPanelProps = {
  profitLabel?: PrimaryButtonProps["secondaryLabel"];
  profitValue?: PNLAndWhatIfProps["pnl"];
  profitRawValue?: PNLAndWhatIfProps["rawPnl"];
  labels: {
    cancel: SecondaryButtonProps["label"];
    price: NonNullable<NudgesNumberInputFieldProps["label"]>;
    size: NonNullable<NudgesNumberInputFieldProps["label"]>;
    persistence: string;
  };
  placeLabel: PrimaryButtonProps["label"];
  loadingLabel: NonNullable<PrimaryButtonProps["loadingLabel"]>;
  price?: number;
  size?: number;
  currencySymbol: NonNullable<NudgesNumberInputFieldProps["currencySymbol"]>;
  hasPlaceError?: PrimaryButtonProps["stopAnimation"];
  betDelay?: PrimaryButtonProps["delay"];
  isUpdateDisabled: boolean;
  isPriceDisabled: boolean;
  isSizeDisabled: boolean;
  isPersistenceMenuOpen: CollapseProps["isOpen"];
  persistenceOptions: PebbleListProps["items"];
  /** The selected ID is an ID present on one of `persistenceOptions` prop */
  persistenceSelectedId: PebbleListProps["defaultSelectedPebble"];
  quickStakes: QuickStakesFormat[];
  notifications?: AlertsProps["alerts"];
  focusedInputId: string | null;
  priceInputId: string;
  sizeInputId: string;
};

type ExchangeInlineEditPanelCallbacks = {
  onPriceNudgeDown: NudgesNumberInputFieldOnNudge;
  onPriceNudgeUp: NudgesNumberInputFieldOnNudge;
  onSizeNudgeDown: NudgesNumberInputFieldOnNudge;
  onSizeNudgeUp: NudgesNumberInputFieldOnNudge;
  onPriceChange: NudgesNumberInputFieldOnChange;
  onPriceBlur: NudgesNumberInputFieldOnBlur;
  onPriceFocus: NudgesNumberInputFieldOnFocus;
  onSizeChange: NudgesNumberInputFieldOnChange;
  onSizeBlur: NudgesNumberInputFieldOnBlur;
  onCancel: ActionButtonOnTap;
  onUpdate: ActionButtonOnTap;
  onPersistenceToggle: NonNullable<CollapseProps["onTitleClick"]>;
  onPersistenceChange: PebbleListOnClick;
  onQuickStakeAdd: QuickStakesOnTouch;
  onSizeFocus?: NudgesNumberInputFieldOnFocus;
  onPriceMouseDown?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onSizeMouseDown?: (e: React.MouseEvent<HTMLDivElement>) => void;
};

export type ExchangeInlineEditPanelViewModel = ExchangeInlineEditPanelProps & ExchangeInlineEditPanelCallbacks;
