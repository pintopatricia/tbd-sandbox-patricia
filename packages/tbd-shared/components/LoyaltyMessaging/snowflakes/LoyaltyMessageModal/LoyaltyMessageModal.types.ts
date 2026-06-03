import { ActionButtonOnTap } from "@ppb/the-wall-common/types";

export type LoyaltyMessageModalProps = {
  title: string;
  message: string;
  onDismiss: () => void;
  onInit?: () => void;
  tcText?: string;
  tcUrl?: string;
  onTcClick?: ActionButtonOnTap;
  buttonText?: string;
  onTap?: ActionButtonOnTap;
  imageSrc?: string;
  imageAlt?: string;
};
