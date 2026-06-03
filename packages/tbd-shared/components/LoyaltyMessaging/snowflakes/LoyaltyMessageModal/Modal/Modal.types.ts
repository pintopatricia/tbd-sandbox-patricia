import { ReactNode } from "react";
import { ActionButtonOnTap } from "@ppb/the-wall-common/types";

export type ModalProps = {
  title: string;
  children: ReactNode;
  onDismiss: () => void;
  dismissOnOutsideTap?: boolean;
  containerId?: string;
  imageSrc?: string;
  imageAlt?: string;
  buttonText?: string;
  onTap?: ActionButtonOnTap;
};
