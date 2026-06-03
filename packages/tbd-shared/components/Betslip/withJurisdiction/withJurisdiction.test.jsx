import { getUserJurisdiction } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { withJurisdiction } from "./withJurisdiction";

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  createGetCountryLocalCurrencyCodeSelector: jest.fn(() => jest.fn()),
  getUserJurisdiction: jest.fn(),
}));

jest.mock("react-redux");

describe("withJurisdiction", () => {
  beforeEach(jest.clearAllMocks);

  describe("when the current jurisdiction matches the passed jurisdictions", () => {
    it("should return the wrapped component", () => {
      getUserJurisdiction.mockReturnValue("TEST");

      const WrappedComponent = jest.fn(() => <wrapped-component-mock />);
      const componentConstructor = withJurisdiction(WrappedComponent, { jurisdictions: ["TEST", "TEST2"] });
      const component = componentConstructor();

      expect(component).not.toBeNull();
    });
  });

  describe("when the current jurisdiction does not match the passed jurisdictions", () => {
    it("should return null", () => {
      getUserJurisdiction.mockReturnValue("TEST3");

      const WrappedComponent = jest.fn(() => <wrapped-component-mock />);
      const componentConstructor = withJurisdiction(WrappedComponent, { jurisdictions: ["TEST", "TEST2"] });
      const component = componentConstructor();

      expect(component).toBeNull();
    });
  });

  describe("when there is no current jurisdiction", () => {
    it("should return null", () => {
      getUserJurisdiction.mockReturnValue(undefined);

      const WrappedComponent = jest.fn(() => <wrapped-component-mock />);
      const componentConstructor = withJurisdiction(WrappedComponent, { jurisdictions: ["TEST", "TEST2"] });
      const component = componentConstructor();

      expect(component).toBeNull();
    });
  });
});
