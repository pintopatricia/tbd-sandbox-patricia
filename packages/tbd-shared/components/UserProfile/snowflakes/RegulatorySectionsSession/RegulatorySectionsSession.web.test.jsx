import { render } from "@testing-library/react";
import "jest-dom/extend-expect";

import { RegulatorySectionsSession } from "./RegulatorySectionsSession.web";
import { TEXT, TIME, TEST_ID } from "./RegulatorySectionsSession.web.selectors";

function renderRegulatorySectionsSession(item) {
  return render(<RegulatorySectionsSession item={item} />);
}

describe("RegulatorySectionsSession", () => {
  it("should show the link with correct text", () => {
    const { container } = renderRegulatorySectionsSession({
      text: "Please click here!",
      time: new Date(2019, 5, 5),
    });
    const text = container.querySelector(TEXT);
    const containerChildCount = container.querySelector(TEST_ID).childElementCount;
    expect(text).toHaveTextContent("Please click here!");
    expect(containerChildCount).toBe(2);
  });

  it("should show the link with the correct time", () => {
    const { container } = renderRegulatorySectionsSession({
      text: "Please click here!",
      time: new Date("Wed Jun 05 2019 14:30:57"),
    });
    const time = container.querySelector(TIME);
    const containerChildCount = container.querySelector(TEST_ID).childElementCount;
    expect(time).toHaveTextContent("05/06/2019 - 14:30");
    expect(containerChildCount).toBe(2);
  });

  describe("when text is falsy", () => {
    it("should not render the text container", () => {
      const { container } = renderRegulatorySectionsSession({
        text: undefined,
        time: new Date("Wed Jun 05 2019 14:30:57"),
      });
      const time = container.querySelector(TIME);
      const containerChildCount = container.querySelector(TEST_ID).childElementCount;
      expect(time).toHaveTextContent("05/06/2019 - 14:30");
      expect(containerChildCount).toBe(1);
    });
  });
});
