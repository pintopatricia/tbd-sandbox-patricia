import type { GenericIconProps } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";

export enum BetButtonStatus {
  Normal = "Normal",
  Selected = "Selected",
}

export enum BetButtonColor {
  Blue = "BLUE",
  Teal = "TEAL",
  DarkBlue = "DARK_BLUE",
  DarkPink = "DARK_PINK",
  Pink = "PINK",
  Grey = "GREY",
  DarkGrey = "DARK_GREY",
}

export enum BetButtonTheme {
  DARK = "DARK",
  ODDS_BOOST = "ODDS_BOOST",
  REGULAR = "REGULAR",
}

export enum BetButtonType {
  Exc = "exc",
  Sbk = "sbk",
}

export enum LabelColors {
  oddsBoost = "oddsBoost",
  sportsbook = "sportsbook",
  sportsbookClosed = "sportsbookClosed",
  exchangeBack = "exchangeBack",
  exchangeLay = "exchangeLay",
}

export enum BetButtonSize {
  Regular = "REGULAR",
  Small = "SMALL",
}

type BetButtonOnClick = () => void;

type BetButtonProps = {
  primaryLabel?: string;
  secondaryLabel?: string;
  status?: BetButtonStatus;
  disabled?: boolean;
  fadeOut?: boolean;
  bgColor: BetButtonColor;
  type: BetButtonType;
  isOddsboostMarketType?: boolean;
  isSecondaryLabelStruckThrough?: boolean;
  handicapLabel?: string;
  icon?: GenericIconProps;
  noAnimation?: boolean;
};

export type BetButtonViewModel = {
  onClick?: BetButtonOnClick;
} & BetButtonProps;

export type BetButtonLabelProps = {
  label?: string;
  type?: BetButtonType;
  labelColor?: LabelColors;
  isOddsboostMarketType?: boolean;
  isSecondaryLabelStruckThrough?: boolean;
  handicap?: string;
  numberOfLines?: number;
};
