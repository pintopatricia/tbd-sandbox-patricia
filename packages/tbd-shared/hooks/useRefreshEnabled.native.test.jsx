import { act, renderHook } from "@testing-library/react-native";
import { RefreshEnabledProvider, useRefreshEnabled } from "./useRefreshEnabled.native";

describe("useRefreshEnabled", () => {
  beforeEach(jest.clearAllMocks);

  it("should expose a RefreshEnabledContextAPI context", () => {
    const { result } = renderHook(() => useRefreshEnabled(true));

    expect(result.current).toEqual({
      refreshEnabled: true,
      setRefreshEnabled: expect.any(Function),
    });
  });

  it("should use update refreshEnabled value", () => {
    const wrapper = ({ children }) => <RefreshEnabledProvider>{children}</RefreshEnabledProvider>;
    const { result } = renderHook(() => useRefreshEnabled(true), { wrapper });

    act(() => {
      result.current.setRefreshEnabled(false);
    });

    expect(result.current.refreshEnabled).toBe(false);
  });
});
