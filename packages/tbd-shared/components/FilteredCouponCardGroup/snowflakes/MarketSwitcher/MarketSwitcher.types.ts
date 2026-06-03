import { RefObject } from "react";

type onMarketSwitcherTap = (value: string, tapTriggerRef?: RefObject<HTMLDivElement | null>) => void;

export type MarketSwitcherProps = {
  onTap: onMarketSwitcherTap;
  label: string;
  value: string;
  title?: string;
};
