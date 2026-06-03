import { renderHook } from "@testing-library/react";
import { useExperimentVariant } from "../../../../../experimentation/hooks/useExperimentVariant";
import { useTabsExperimentVariant } from "./useTabsExperimentVariant";

jest.mock("../../../../../experimentation/hooks/useExperimentVariant", () => ({
  useExperimentVariant: jest.fn(),
}));

describe("useTabsExperimentVariant", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call useExperimentVariant with the correct experiment id", () => {
    useExperimentVariant.mockReturnValue(null);

    renderHook(() => useTabsExperimentVariant());

    expect(useExperimentVariant).toHaveBeenCalledWith("exp-tabbed-betslip-view");
    expect(useExperimentVariant).toHaveBeenCalledTimes(1);
  });

  it("should return null when the experiment variant is null", () => {
    useExperimentVariant.mockReturnValue(null);

    const { result } = renderHook(() => useTabsExperimentVariant());

    expect(result.current).toBeNull();
  });

  it("should return 'with-all' when the experiment variant is 'variant-betslip-tabs-view-with-all'", () => {
    useExperimentVariant.mockReturnValue("variant-betslip-tabs-view-with-all");

    const { result } = renderHook(() => useTabsExperimentVariant());

    expect(result.current).toBe("with-all");
  });

  it("should return 'without-all' when the experiment variant is 'variant-betslip-tabs-view-without-all'", () => {
    useExperimentVariant.mockReturnValue("variant-betslip-tabs-view-without-all");

    const { result } = renderHook(() => useTabsExperimentVariant());

    expect(result.current).toBe("without-all");
  });
});
