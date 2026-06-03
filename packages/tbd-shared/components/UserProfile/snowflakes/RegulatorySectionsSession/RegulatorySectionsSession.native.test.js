import { render } from "@testing-library/react-native";
import { formatDate, formatHours } from "@ppb/the-wall-native/helpers/time-helper";
import { RegulatorySectionsSession } from "./RegulatorySectionsSession.native";
import { FOOTER_SESSION, FOOTER_SESSION_TEXT, FOOTER_SESSION_TIME } from "./RegulatorySectionsSession.native.selectors";

jest.mock("@ppb/the-wall-native/helpers/time-helper", () => ({
  formatDate: jest.fn(() => "20/06/2019"),
  formatHours: jest.fn(() => "14:30"),
}));

jest.mock("@ppb/the-wall-native", () => ({
  Text: jest.requireActual("react-native").Text,
}));

function renderComponent(props) {
  const { queryByTestId } = render(<RegulatorySectionsSession {...props} />);
  const container = queryByTestId(FOOTER_SESSION);
  const textLabel = queryByTestId(FOOTER_SESSION_TEXT);
  const timeLabel = queryByTestId(FOOTER_SESSION_TIME);

  return { container, textLabel, timeLabel };
}

const PROPS = {
  item: {
    text: "Logged in since:",
    time: new Date("Jun 20 2019 14:30:57"),
  },
};

describe("RegulatorySectionsSession", () => {
  it("should render", () => {
    const { container } = renderComponent(PROPS);
    expect(container).toBeDefined();
  });

  it("should call formatDate and formatHours with proper values", () => {
    renderComponent(PROPS);
    const time = new Date("Jun 20 2019 14:30:57");

    expect(formatDate).toHaveBeenCalledWith(time);
    expect(formatHours).toHaveBeenCalledWith(time);
  });

  it("should render the plain label with the correct text", () => {
    const { textLabel } = renderComponent(PROPS);
    expect(textLabel).toHaveTextContent("Logged in since:");
  });

  it("should render the plain label with the correct time", () => {
    const { timeLabel } = renderComponent(PROPS);
    expect(timeLabel).toHaveTextContent("20/06/2019 - 14:30");
  });

  describe("when text is falsy", () => {
    const falsyProps = {
      item: {
        text: undefined,
        time: new Date("Jun 20 2019 14:30:57"),
      },
    };
    it("should not render the text container", () => {
      const { container, timeLabel, textLabel } = renderComponent(falsyProps);

      const containerChildCount = container.children.length;

      expect(containerChildCount).toBe(1);
      expect(timeLabel).toBeDefined();
      expect(textLabel).toBeNull();
    });
  });
});
