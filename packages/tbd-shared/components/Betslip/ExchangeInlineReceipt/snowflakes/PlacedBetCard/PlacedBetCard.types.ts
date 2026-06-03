import type { ReactNode } from "react";

export type PlacedBetCardLabels = {
  price: string;
  stake: string;
  profit: string;
  liability?: string;
  name?: string;
};

export type PlacedBetCardProps = {
  children?: ReactNode;
  type: "MATCHED" | "UNMATCHED";
  price: string;
  stake: string;
  profit: string;
  liability?: string;
  bonus: string;
  hasFreeBets: boolean;
  labels: PlacedBetCardLabels;
  titlePrefix?: string;
};

export type PlacedBetCardViewModel = PlacedBetCardProps;
