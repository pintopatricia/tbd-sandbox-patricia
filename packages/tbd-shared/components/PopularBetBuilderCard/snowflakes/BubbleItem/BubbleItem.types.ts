import { ReactNode } from "react";

export type BubbleItemCommonProps = {
  titleIcon?: string;
  title: { bold: string; regular?: string };
  description?: string;
  subDescription?: string;
  children?: ReactNode;
  isLast?: boolean;
};
