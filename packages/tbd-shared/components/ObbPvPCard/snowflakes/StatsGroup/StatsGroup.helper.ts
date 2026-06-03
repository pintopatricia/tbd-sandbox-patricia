import { ProgressBarProps, ProgressBarVariant } from "@ppb/the-wall-common/types";
import { SingleStatElement } from "./StatsGroup.types";

export const formatColor = (color: string | undefined | null) => {
  if (!color) return undefined;

  if (color.length === 6 && /^[0-9A-Fa-f]{6}$/i.test(color)) {
    return `#${color}`;
  }

  if (color.length === 3 && /^[0-9A-Fa-f]{3}$/i.test(color)) {
    return `#${color}`;
  }

  return color;
};

export function getProgressBarProps(
  element: SingleStatElement | undefined,
  maxValue: number | undefined,
  side: "left" | "right",
  disabled: boolean,
): ProgressBarProps {
  if (!element || element.value == null || !maxValue) {
    return { variant: ProgressBarVariant.EMPTY_STATE };
  }

  const filledAreaValue = (element.value * 100) / maxValue;
  const emptyAreaValue = 100 - filledAreaValue;

  return {
    variant: (() => {
      if (disabled) {
        return side === "left" ? ProgressBarVariant.DISABLED_AWAY : ProgressBarVariant.DISABLED_HOME;
      }
      return side === "left" ? ProgressBarVariant.AWAY_STAT : ProgressBarVariant.HOME_STAT;
    })(),
    home: side === "left" ? emptyAreaValue : filledAreaValue,
    away: side === "left" ? filledAreaValue : emptyAreaValue,
    [side === "left" ? "awayColor" : "homeColor"]: formatColor(element.color),
  };
}
