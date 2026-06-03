import { withInlineBetslipAgnostic } from "./withInlineBetslipAgnostic";
import useInlineBetslip from "./useInlineBetslip";

jest.mock("./useInlineBetslip", () => ({
  __esModule: true,
  default: jest.fn(() => "some result"),
}));

describe("withInlineBetslipAgnostic", () => {
  beforeEach(jest.clearAllMocks);

  it("should augment provided component with renderBetslip method", () => {
    const wrappedComponent = jest.fn(() => <wrapped-component-mock />);
    const renderBetslipSpy = jest.fn();
    useInlineBetslip.mockReturnValue(renderBetslipSpy);

    const componentConstructor = withInlineBetslipAgnostic(wrappedComponent, "some component");

    expect(componentConstructor).toEqual(expect.any(Function));

    const propsMock = {
      some: "prop",
    };
    const component = componentConstructor(propsMock);

    expect(component.type).toBe(wrappedComponent);
    expect(component.props).toEqual({
      renderBetslip: renderBetslipSpy,
      some: "prop",
    });
  });
});
