import { renderHook } from "@testing-library/react";
import { useContext } from "react";
import { useExperimentVariant } from "./useExperimentVariant";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn(),
}));

jest.mock("../provider/LoopProvider", () => ({
  LoopContext: "loopContextMock",
}));

describe("useExperimentVariant", () => {
  it("should return assigned experiment variant using Loop context", () => {
    const clientMock = {
      getAssignedExperimentVariant: jest.fn(() => true),
    };

    useContext.mockReturnValue(clientMock);

    const {
      result: { current },
    } = renderHook(() => useExperimentVariant("some-experiment-id"));

    expect(clientMock.getAssignedExperimentVariant).toHaveBeenCalledWith("some-experiment-id");
    expect(clientMock.getAssignedExperimentVariant).toHaveBeenCalledTimes(1);
    expect(current).toEqual(true);
  });
});
