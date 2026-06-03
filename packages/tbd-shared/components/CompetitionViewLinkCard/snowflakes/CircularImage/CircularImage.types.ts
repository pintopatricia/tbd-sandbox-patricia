import { GenericIconProps } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";

export enum CircularImageSize {
  Small = "small",
  Large = "large",
}

export type CircularImageCommonProps = {
  fallbackIcon?: GenericIconProps["name"];
  text?: string;
  size?: CircularImageSize;
};
