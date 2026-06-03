import { ActionButtonOnTap, ActionLinkOnClick, AlertProps } from "@ppb/the-wall-common/types";
import { PlacedBetCardLabels, PlacedBetCardProps } from "../PlacedBetCard/PlacedBetCard.types";

export type ExchangeUnmatchedCardOnCancel = ActionLinkOnClick | null;
export type ExchangeUnmatchedCardOnEdit = ActionButtonOnTap | null;

type ExchangeUnmatchedCardLabels = PlacedBetCardLabels & {
  cancel: string;
  confirm: string;
};

export type ExchangeUnmatchedCardProps = Pick<
  PlacedBetCardProps,
  "type" | "price" | "stake" | "profit" | "liability" | "bonus" | "hasFreeBets"
> & {
  notifications: AlertProps[];
  labels: ExchangeUnmatchedCardLabels;
  titlePrefix?: string;
};

type ExchangeUnmatchedCardCallbacks = {
  onCancel?: ExchangeUnmatchedCardOnCancel;
  onEdit?: ExchangeUnmatchedCardOnEdit;
};

export type ExchangeUnmatchedCardViewModel = ExchangeUnmatchedCardProps & ExchangeUnmatchedCardCallbacks;
