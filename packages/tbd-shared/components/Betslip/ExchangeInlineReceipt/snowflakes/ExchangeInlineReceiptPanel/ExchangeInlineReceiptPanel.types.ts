import type { ExchangeSide } from "@ppb/tbd-store/state/betting/exchange-bets/ExchangeBet.types";
import type { InlinePanelProps, InlinePanelOnAction } from "../../../InlinePanel/InlinePanel.types";
import {
  ExchangeUnmatchedCardOnCancel,
  ExchangeUnmatchedCardOnEdit,
  ExchangeUnmatchedCardProps,
} from "../ExchangeUnmatchedCard/ExchangeUnmatchedCard.types";
import { PlacedBetCardProps } from "../PlacedBetCard/PlacedBetCard.types";

export type ExchangeInlineReceiptPanelProps = {
  title: NonNullable<InlinePanelProps["title"]>;
  side: ExchangeSide;
  matched?: PlacedBetCardProps;
  unmatched?: ExchangeUnmatchedCardProps;
};

export type ExchangeInlineReceiptPanelCallbacks = {
  onDone: InlinePanelOnAction;
  onCancel: ExchangeUnmatchedCardOnCancel;
  onEdit: ExchangeUnmatchedCardOnEdit;
};

export type ExchangeInlineReceiptPanelViewModel = ExchangeInlineReceiptPanelProps & ExchangeInlineReceiptPanelCallbacks;
