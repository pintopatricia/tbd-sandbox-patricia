export enum OngoingPromoCardTypes {
  FREE_SPINS = "FREE_SPINS",
  GOLDEN_CHIPS = "GOLDEN_CHIPS",
  CASH = "CASH",
  OPTIN = "OPT_IN",
}

export enum AdditionalMessageType {
  SUCCESS = "SUCCESS",
  WARNING = "WARNING",
}

export type AdditionalMessage = {
  type: AdditionalMessageType;
  text: string;
};

export type OngoingPromoCardI18N = {
  cancel: string;
  refresh: string;
  footerText: string;
  badgeLabel: string;
  pendingWinnings: string;
};

export type OngoingPromoCardProps = {
  type: OngoingPromoCardTypes;
  title: string;
  tcText: string;
  requirements?: string;
  disableRefresh: boolean;
  backgroundImage: string;
  remainingHeader?: string;
  remainingSubheader?: string;
  progressValue: number; // Needs to be a value between 0-100
  footerValue: string;
  pendingWinnings?: string | null;
  additionalMessage?: AdditionalMessage;

  i18N: OngoingPromoCardI18N;
} & OngoingPromoCardCallbacks;

export type OngoingPromoCardOnActionClick = () => void;

export type OngoingPromoCardCallbacks = {
  onCancel: OngoingPromoCardOnActionClick;
  onRefresh: OngoingPromoCardOnActionClick;
};
