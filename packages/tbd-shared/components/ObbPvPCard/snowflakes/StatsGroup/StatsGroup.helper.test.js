import { ProgressBarVariant } from "@ppb/the-wall-common/types";
import { formatColor, getProgressBarProps } from "./StatsGroup.helper";

describe("formatColor", () => {
  it("should return undefined when color is undefined or null", () => {
    expect(formatColor(undefined)).toBeUndefined();
    expect(formatColor(null)).toBeUndefined();
  });

  it("should add # prefix to valid 6-digit hex colors without it", () => {
    expect(formatColor("FFFFFF")).toBe("#FFFFFF");
    expect(formatColor("123abc")).toBe("#123abc");
    expect(formatColor("000000")).toBe("#000000");
  });

  it("should add # prefix to valid 3-digit hex colors without it", () => {
    expect(formatColor("FFF")).toBe("#FFF");
    expect(formatColor("123")).toBe("#123");
    expect(formatColor("000")).toBe("#000");
  });

  it("should return valid color formats as-is", () => {
    expect(formatColor("#FF0000")).toBe("#FF0000");
    expect(formatColor("#fff")).toBe("#fff");
    expect(formatColor("red")).toBe("red");
    expect(formatColor("rgb(255, 0, 0)")).toBe("rgb(255, 0, 0)");
  });
});

describe("getProgressBarProps", () => {
  it("should return EMPTY_STATE variant when element is undefined", () => {
    expect(getProgressBarProps(undefined, 100, "left", false)).toEqual({
      variant: ProgressBarVariant.EMPTY_STATE,
    });
  });

  it("should return EMPTY_STATE variant when `element` is `undefined`", () => {
    expect(getProgressBarProps(undefined, 100, "left", false)).toEqual({
      variant: ProgressBarVariant.EMPTY_STATE,
    });
  });

  it("should return EMPTY_STATE variant when `element.value` is `undefined`", () => {
    expect(getProgressBarProps({ value: undefined, color: "#000" }, 100, "left", false)).toEqual({
      variant: ProgressBarVariant.EMPTY_STATE,
    });
  });

  it("should return EMPTY_STATE variant when `maxValue` is `undefined`", () => {
    expect(getProgressBarProps({ value: 50, color: "#000" }, undefined, "left", false)).toEqual({
      variant: ProgressBarVariant.EMPTY_STATE,
    });
  });

  it("should calculate progress bar values correctly for left side", () => {
    const result = getProgressBarProps({ value: 20, color: "#000" }, 100, "left", false);
    expect(result).toEqual({
      variant: ProgressBarVariant.AWAY_STAT,
      home: 80,
      away: 20,
      awayColor: "#000",
    });
  });

  it("should calculate progress bar values correctly for right side", () => {
    const result = getProgressBarProps({ value: 20, color: "#000" }, 100, "right", false);
    expect(result).toEqual({
      variant: ProgressBarVariant.HOME_STAT,
      home: 20,
      away: 80,
      homeColor: "#000",
    });
  });

  it("should return disabled variants when disabled is true", () => {
    const leftDisabled = getProgressBarProps({ value: 20, color: "#000" }, 100, "left", true);
    expect(leftDisabled).toEqual({
      variant: ProgressBarVariant.DISABLED_AWAY,
      awayColor: "#000",
      home: 80,
      away: 20,
    });

    const rightDisabled = getProgressBarProps({ value: 20, color: "#000" }, 100, "right", true);
    expect(rightDisabled).toEqual({
      variant: ProgressBarVariant.DISABLED_HOME,
      homeColor: "#000",
      home: 20,
      away: 80,
    });
  });
});
