import { renderHook } from "@testing-library/react-native";
import { useContext } from "react";
import { useStickyCard } from "./useStickyCard.native";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn(),
}));

describe("useStickyCard", () => {
  beforeEach(jest.clearAllMocks);

  describe("when useStickyCard is called", () => {
    describe("when then urn matches the context", () => {
      it("should return isSticky true", () => {
        useContext.mockReturnValue({ currentSticky: "urn" });

        const {
          result: { current: isSticky },
        } = renderHook(() => useStickyCard("urn"));

        expect(isSticky).toBe(true);
      });
    });

    describe("when the urn does not match the context", () => {
      it("should return false", () => {
        useContext.mockReturnValue({ currentSticky: "urn" });

        const {
          result: { current: isSticky },
        } = renderHook(() => useStickyCard("urn2"));

        expect(isSticky).toBe(false);
      });
    });
  });
});
