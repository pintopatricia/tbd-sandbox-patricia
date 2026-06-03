import { renderHook } from "@testing-library/react";
import "jest-dom/extend-expect";

import { ConfigContext, ConfigContextProvider } from "./ConfigContext";

function renderConfigProvider({ children = "children", value } = {}) {
  const { result } = renderHook(() => ConfigContextProvider({ children, value }));

  return result;
}

describe("ConfigContext", () => {
  it("should create context with default values", () => {
    expect(ConfigContext._currentValue).toEqual({
      isDesktopLayout: false,
    });
  });
});

describe("ConfigProvider", () => {
  it("should have expected values", () => {
    const result = renderConfigProvider({
      value: { isDesktopLayout: true },
    });

    expect(result.current.props.value).toEqual({
      isDesktopLayout: true,
    });
  });

  it("should have expected children", () => {
    const result = renderConfigProvider();

    expect(result.current.props.children).toEqual("children");
  });
});
