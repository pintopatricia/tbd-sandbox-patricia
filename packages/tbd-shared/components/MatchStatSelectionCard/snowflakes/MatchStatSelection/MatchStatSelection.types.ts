import { Icons } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";

import type { JSX } from "react";

export type MatchStatSelectionProps = {
  title: JSX.Element[];
  subtitle: string;
  stats: string | null;
  isMarketClosed?: boolean;
  children: React.ReactNode;
  icon?: Icons;
};
