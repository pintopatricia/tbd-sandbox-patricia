import { useContext } from "react";
import { renderHook } from "@testing-library/react";

import { useRefContext } from "./useRefContext";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn(),
}));

jest.mock("../components/RefContext", () => ({
  RefContext: "RefContextMock",
}));

describe("useRefContext", () => {
  it("should call useContext", () => {
    useContext.mockReturnValueOnce("RefContextMock");
    renderHook(() => {
      useRefContext();
    });

    expect(useContext).toHaveBeenCalledWith("RefContextMock");
    expect(useContext).toHaveBeenCalledTimes(1);
  });

  it("should return values from RefContext", () => {
    useContext.mockReturnValueOnce(["the ref", "the ref setter"]);
    let refContext;

    renderHook(() => {
      refContext = useRefContext();
    });

    expect(refContext).toEqual(["the ref", "the ref setter"]);
  });

  it("should throw error when context is not found", () => {
    useContext.mockReturnValueOnce(undefined);

    expect(() => {
      useRefContext();
    }).toThrow("useRefContext must be used within a RefContext");
  });
});
