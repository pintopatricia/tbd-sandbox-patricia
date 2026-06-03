import { render, waitFor } from "@testing-library/react";
import "jest-dom/extend-expect";
import { ObbSquadBetAnimationWrapper } from "./ObbSquadBetAnimationWrapper.web";

describe("ObbSquadBetAnimationWrapper.web", () => {
  describe("Basic rendering", () => {
    it("should render children correctly", () => {
      const { getByText } = render(
        <ObbSquadBetAnimationWrapper>
          <div>Test Content</div>
        </ObbSquadBetAnimationWrapper>,
      );
      expect(getByText("Test Content")).toBeInTheDocument();
    });
  });

  describe("Props handling", () => {
    it("should accept trigger prop", () => {
      const { getByText } = render(
        <ObbSquadBetAnimationWrapper trigger={1}>
          <div>Test Content</div>
        </ObbSquadBetAnimationWrapper>,
      );
      expect(getByText("Test Content")).toBeInTheDocument();
    });

    it("should accept custom animation duration", () => {
      const { getByText } = render(
        <ObbSquadBetAnimationWrapper animationDuration={1000}>
          <div>Test Content</div>
        </ObbSquadBetAnimationWrapper>,
      );
      expect(getByText("Test Content")).toBeInTheDocument();
    });

    it("should handle trigger changes", async () => {
      const { getByText, rerender } = render(
        <ObbSquadBetAnimationWrapper trigger={1}>
          <div>Test Content</div>
        </ObbSquadBetAnimationWrapper>,
      );

      rerender(
        <ObbSquadBetAnimationWrapper trigger={2}>
          <div>Updated Content</div>
        </ObbSquadBetAnimationWrapper>,
      );

      await waitFor(() => {
        expect(getByText("Updated Content")).toBeInTheDocument();
      });
    });
  });
});
