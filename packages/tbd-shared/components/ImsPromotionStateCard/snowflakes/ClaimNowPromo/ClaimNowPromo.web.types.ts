import { DisclaimerProps } from "./snowflakes/Disclaimer/Disclaimer.web";

export type ClaimNowPromoI18N = {
  claimNow: string;
  availableFunds: string;
};

export type ClaimNowPromoProps = {
  title: string;
  subHeader: string;
  disclaimer: DisclaimerProps;
  availableFunds: string;
  backgroundImage: string;
  i18n: ClaimNowPromoI18N;
  onClaimNow: () => void;
  steps?: number;
  initialStep?: number;
  bubbleLabel?: string;
  onChange?: (step: number) => void;
};
