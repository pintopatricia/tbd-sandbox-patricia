import URN from "../layout/URN";

export type FormatableNumber = {
  value: number;
  decimalPlaces: number;
};

type TranslateProps = {
  key: string;
  interpolationValues?: {
    [key: string]: string | number;
  };
};

type TranslatableText = {
  translated?: string;
  translate?: TranslateProps;
};

export type Receipt = {
  entityURN: URN;
  receiptTitle?: TranslatableText;
  detailTitle?: TranslatableText;
  detailSubtitle?: TranslatableText;
  segmentLeftLabel?: TranslatableText;
  segmentLeftValue?: FormatableNumber;
  segmentRightLabel?: TranslatableText;
  segmentRightValue?: FormatableNumber;
  errorMessage?: TranslatableText;
  errorDetail?: TranslatableText;
  buttonText?: TranslatableText;
} | null;
