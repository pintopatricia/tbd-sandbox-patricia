import { ListOption, ListOptions } from "@ppb/the-wall-common/types/Drawer/FilterDrawer/FilterDrawer.types";

export type CouponFilterDrawerOnClose = () => void;

export type CouponFilterDrawerOnApply = (selectedOptions: string[], labels: (string | undefined)[]) => void;

export type CouponFilterDrawerCallbacks = {
  onApply: CouponFilterDrawerOnApply;
  onClose: CouponFilterDrawerOnClose;
};

export type CouponFilterDrawerProps = {
  title: string;
  ctaText?: string;
  listOptions: ListOptions;
  listDefaultOption?: ListOption;
  isSingleSelection: boolean;
};

export type CouponFilterDrawerViewModel = CouponFilterDrawerProps & CouponFilterDrawerCallbacks;
