import { renderHook } from "@testing-library/react";
import { useSelector } from "react-redux";
import { Brand } from "@ppb/tbd-store/config/Brand";
import { useAppBrand } from "./useAppBrand";

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

describe("useAppBrand", () => {
  describe.each([
    ["_", Brand.Betfair],
    ["90", Brand.Betfair],
    ["100", Brand.Skybet],
    ["110", Brand.Skybet],
  ])("when productId state is %s", (productId, appBrand) => {
    it(`should return the brand ${appBrand}`, () => {
      useSelector.mockImplementation((selector) => selector({ entities: { productId } }));

      const {
        result: { current },
      } = renderHook(() => useAppBrand());

      expect(current).toBe(appBrand);
    });
  });
});
