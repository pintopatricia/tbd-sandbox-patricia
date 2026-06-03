import { act, renderHook } from "@testing-library/react";

import useMonterosaPreferenceSync from "./useMonterosaPreferenceSync";
import { MonterosaOddsDisplayFormat } from "../types/types";

type HookProps = {
  experienceKey: string;
  oddsDisplayFormat?: MonterosaOddsDisplayFormat;
};

describe("useMonterosaPreferenceSync", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("gates sending until experience is ready", () => {
    const onSendPreference = jest.fn();
    const initialProps: HookProps = {
      experienceKey: "host|project|event-1",
      oddsDisplayFormat: undefined,
    };
    const { result, rerender } = renderHook(
      ({ experienceKey, oddsDisplayFormat }: HookProps) =>
        useMonterosaPreferenceSync({
          experienceKey,
          oddsDisplayFormat,
          onSendPreference,
        }),
      {
        initialProps,
      },
    );

    const rerenderProps: HookProps = {
      experienceKey: "host|project|event-1",
      oddsDisplayFormat: "FRACTIONAL",
    };

    rerender(rerenderProps);

    expect(onSendPreference).not.toHaveBeenCalled();

    act(() => {
      result.current.handleExperienceReady();
    });

    expect(onSendPreference).toHaveBeenCalledWith("FRACTIONAL");
    expect(onSendPreference).toHaveBeenCalledTimes(1);
  });

  it("deduplicates repeated odds values", () => {
    const onSendPreference = jest.fn();
    const { result, rerender } = renderHook(
      ({ experienceKey, oddsDisplayFormat }: HookProps) =>
        useMonterosaPreferenceSync({
          experienceKey,
          oddsDisplayFormat,
          onSendPreference,
        }),
      {
        initialProps: {
          experienceKey: "host|project|event-1",
          oddsDisplayFormat: "FRACTIONAL",
        },
      },
    );

    act(() => {
      result.current.handleExperienceReady();
    });

    expect(onSendPreference).toHaveBeenCalledTimes(1);
    expect(onSendPreference).toHaveBeenCalledWith("FRACTIONAL");

    rerender({
      experienceKey: "host|project|event-1",
      oddsDisplayFormat: "FRACTIONAL",
    });

    expect(onSendPreference).toHaveBeenCalledTimes(1);
  });

  it("resets dedup state when experience key changes", () => {
    const onSendPreference = jest.fn();
    const { result, rerender } = renderHook(
      ({ experienceKey, oddsDisplayFormat }: HookProps) =>
        useMonterosaPreferenceSync({
          experienceKey,
          oddsDisplayFormat,
          onSendPreference,
        }),
      {
        initialProps: {
          experienceKey: "host|project|event-1",
          oddsDisplayFormat: "FRACTIONAL",
        },
      },
    );

    act(() => {
      result.current.handleExperienceReady();
    });

    rerender({
      experienceKey: "host|project|event-2",
      oddsDisplayFormat: "FRACTIONAL",
    });

    act(() => {
      result.current.handleExperienceReady();
    });

    expect(onSendPreference).toHaveBeenNthCalledWith(1, "FRACTIONAL");
    expect(onSendPreference).toHaveBeenNthCalledWith(2, "FRACTIONAL");
    expect(onSendPreference).toHaveBeenCalledTimes(2);
  });
});
