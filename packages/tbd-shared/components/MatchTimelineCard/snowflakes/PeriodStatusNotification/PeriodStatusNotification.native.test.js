import { render } from "@testing-library/react-native";
import { HeadToHeadResult } from "@ppb/the-wall-native/components/HeadToHead/HeadToHeadResult/HeadToHeadResult";
import { PeriodStatusNotification } from "./PeriodStatusNotification.native";
import styles from "./PeriodStatusNotification.native.styles";
import {
  PERIOD_STATUS_NOTIFICATION,
  PERIOD_STATUS_NOTIFICATION_TITLE,
} from "./PeriodStatusNotification.native.selectors";

jest.mock("@ppb/the-wall-native/components/HeadToHead/HeadToHeadResult/HeadToHeadResult", () => ({
  HeadToHeadResult: jest.fn(() => <head-to-head-result-mock />),
}));

jest.mock("@ppb/the-wall-native", () => ({
  Text: jest.requireActual("react-native").Text,
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {},
  typography: {},
  spacings: {},
}));

describe("PeriodStatusNotification", () => {
  const TITLE = "TITLE";
  const FIRST_RESULT_PROP = "FIRST_RESULT_PROP";
  const SECOND_RESULT_PROP = "SECOND_RESULT_PROP";
  const RESULT_PROPS = { FIRST_RESULT_PROP, SECOND_RESULT_PROP };

  function renderPeriodStatusNotification({ title = TITLE, resultProps = RESULT_PROPS }) {
    const { queryByTestId } = render(<PeriodStatusNotification title={title} resultProps={resultProps} />);

    return {
      periodStatusNotification: queryByTestId(PERIOD_STATUS_NOTIFICATION),
      title: queryByTestId(PERIOD_STATUS_NOTIFICATION_TITLE),
    };
  }
  afterEach(jest.clearAllMocks);

  it("should render the periodStatusNotification with the correct styling", () => {
    const { periodStatusNotification } = renderPeriodStatusNotification({});

    expect(periodStatusNotification).not.toBeNull();
    expect(periodStatusNotification).toHaveStyle(styles.periodStatusNotification);
  });

  it("should render the title with the correct styling and content", () => {
    const { title } = renderPeriodStatusNotification({});

    expect(title).toHaveStyle(styles.title);
    expect(title).toHaveTextContent(TITLE);
  });

  it("should call PeriodStatusNotification with the correct props", () => {
    renderPeriodStatusNotification({});

    expect(HeadToHeadResult).toHaveBeenCalledWith(
      {
        ...RESULT_PROPS,
      },
      undefined,
    );
  });
});
