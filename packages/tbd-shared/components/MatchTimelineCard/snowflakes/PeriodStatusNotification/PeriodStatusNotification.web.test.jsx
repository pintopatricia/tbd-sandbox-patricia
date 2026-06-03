import "jest-dom/extend-expect";
import { render } from "@testing-library/react";
import { HeadToHeadResult } from "@ppb/the-wall-web/components/bricks/HeadToHeadResult/HeadToHeadResult";
import { PeriodStatusNotification } from "./PeriodStatusNotification.web";
import { TEST_ID, TITLE } from "./PeriodStatusNotification.web.selectors";
import styles from "./PeriodStatusNotification.web.css";

function renderHalfNotification() {
  const { container } = render(<PeriodStatusNotification title={"half time"} resultProps={{ resultProps: "props" }} />);
  return container.querySelector(TEST_ID);
}

jest.mock("@ppb/the-wall-web/components/bricks/HeadToHeadResult/HeadToHeadResult", () => ({
  HeadToHeadResult: jest.fn(() => <headToHeadResult-mock />),
  HeadToHeadResultViewMode: {
    MIN: "MIN",
  },
}));

describe("Period Status Notification", () => {
  it("should have component rendered", () => {
    const halfNotification = renderHalfNotification();
    expect(halfNotification).toHaveClass(styles.periodStatusNotificationContainer);
  });
  it("should render head to head result", () => {
    jest.clearAllMocks();
    const rendered = renderHalfNotification();
    expect(rendered.querySelector(TITLE)).toHaveTextContent("half time");
    expect(HeadToHeadResult).toHaveBeenCalledWith({ resultProps: "props" }, undefined);
    expect(HeadToHeadResult.mock.calls.length).toBe(1);
  });
});
