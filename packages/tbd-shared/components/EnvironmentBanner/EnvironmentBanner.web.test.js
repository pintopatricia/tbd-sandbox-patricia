import { render } from "@testing-library/react";
import "jest-dom/extend-expect";

import { EnvironmentBanner } from "./EnvironmentBanner.web";
import { getCookie } from "../../helpers/cookies.web";

jest.mock("../../helpers/cookies.web", () => ({
  getCookie: jest.fn(),
}));

const originalEnvironment = window.__TBD_ENVIRONMENT__;

describe("EnvironmentBanner", () => {
  beforeEach(() => {
    window.__TBD_ENVIRONMENT__ = originalEnvironment;
    jest.clearAllMocks();
  });

  describe("drk indicator", () => {
    describe("without drk cookie", () => {
      it("should render empty fragment", () => {
        getCookie.mockReturnValue(null);
        const { container } = render(<EnvironmentBanner />);
        expect(container.innerHTML).toHaveLength(0);
      });
    });

    describe("with drk cookie", () => {
      describe("and not in drk environment", () => {
        it("should render empty fragment", () => {
          window.__TBD_ENVIRONMENT__ = { ENV: "prd" };
          getCookie.mockReturnValue("some-value");
          const { container } = render(<EnvironmentBanner />);
          expect(container.innerHTML).toHaveLength(0);
        });
      });

      describe("and in drk environment", () => {
        it("should render banner", () => {
          window.__TBD_ENVIRONMENT__ = { ENV: "drk" };
          getCookie.mockReturnValue("some-value");
          const { container } = render(<EnvironmentBanner />);
          expect(container.textContent).toBe("drk");
        });
      });
    });
  });

  describe("prd datacenter indicators", () => {
    describe("when in prd environment", () => {
      beforeEach(() => {
        window.__TBD_ENVIRONMENT__ = { ENV: "prd" };
      });

      it("should render ie1 when datacenter cookie is ie1", () => {
        getCookie.mockReturnValue("ie1");
        const { container } = render(<EnvironmentBanner />);
        expect(container.textContent).toBe("ie1");
      });

      it("should render ie2 when datacenter cookie is ie2", () => {
        getCookie.mockReturnValue("ie2");
        const { container } = render(<EnvironmentBanner />);
        expect(container.textContent).toBe("ie2");
      });

      it("should render empty fragment when datacenter cookie is missing or different", () => {
        getCookie.mockReturnValue(null);
        const { container } = render(<EnvironmentBanner />);
        expect(container.innerHTML).toHaveLength(0);
      });
    });
  });

  describe("tokens preview indicator", () => {
    it("should render when in tokens preview environment", () => {
      window.__TBD_ENVIRONMENT__ = { ENV: "tokens preview (999.999.999)" };

      const { container } = render(<EnvironmentBanner />);
      expect(container.textContent).toBe("tokens preview (999.999.999)");
    });
  });
});
