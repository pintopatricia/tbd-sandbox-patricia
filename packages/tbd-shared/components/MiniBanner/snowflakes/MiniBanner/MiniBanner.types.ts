import type { SyntheticEvent } from "react";

export type MiniBannerWebProps = {
  brandTitle?: string;
  title?: string;
  subText?: string;
  onMiniBannerTap?: (event: SyntheticEvent) => void;
};

export type MiniBannerNativeProps = {
  brandTitle?: string;
  title?: string;
  subText?: string;
  onMiniBannerTap?: () => void;
};
