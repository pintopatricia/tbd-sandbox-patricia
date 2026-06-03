import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { ErrorBoundary } from "./ErrorBoundary";

describe("ErrorBoundary", () => {
  describe("when no error occurs", () => {
    it("should return children component", () => {
      const { getByText } = render(
        <ErrorBoundary>
          <div>Everything is fine</div>
        </ErrorBoundary>,
      );

      expect(getByText("Everything is fine")).toBeInTheDocument();
    });
  });
  describe("when an error occurs", () => {
    const ThrowError = () => {
      throw new Error("Test Error");
    };
    describe("and no fallback props is provided", () => {
      it("should return an empty fragment", async () => {
        const { container } = render(
          <ErrorBoundary>
            <ThrowError />
            <div>Everything is NOT fine</div>
          </ErrorBoundary>,
        );

        expect(container.firstChild).toBeNull();
      });
    });
    describe("and a fallback props is provided", () => {
      const FallbackComponent = ({ error }) => <div>Fallback UI: {error.message}</div>;

      it("should return the fallback UI", () => {
        const { getByText } = render(
          <ErrorBoundary Fallback={FallbackComponent}>
            <ThrowError />
            <div>Everything is fine</div>
          </ErrorBoundary>,
        );

        expect(getByText("Fallback UI: Test Error")).toBeInTheDocument();
      });
    });
  });
});
