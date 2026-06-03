import "jest-dom/extend-expect";
import { render } from "@testing-library/react";
import { TEST_ID } from "./EventStatsCard.web.selectors";
import EventStatsCard from "./EventStatsCard.web";

const renderEventStatsCard = (props) => render(<EventStatsCard {...props} />);

describe("Connected EventStatsCard", () => {
  beforeEach(() => {
    Object.defineProperties(window.HTMLElement.prototype, {
      offsetWidth: {
        get() {
          return 400;
        },
      },
    });

    jest.clearAllMocks();
  });

  it("should render", () => {
    const component = renderEventStatsCard({ statsUrl: new URL("http://mock-url"), aspectRatio: 1 });

    expect(component.container.querySelector(TEST_ID)).not.toBeNull();
  });

  describe("when component offsetWidth is 400 and aspect ratio 0.5", () => {
    it("should render an iframe", () => {
      const component = renderEventStatsCard({ statsUrl: new URL("http://mock-url"), aspectRatio: 0.5 });

      expect(component.container.querySelector("iframe")).not.toBeNull();
    });

    it("should set width and height props in the iframe 'src' attr", () => {
      const component = renderEventStatsCard({ statsUrl: new URL("http://mock-url"), aspectRatio: 0.5 });

      expect(component.container.querySelector("iframe").getAttribute("src")).toContain("width");
      expect(component.container.querySelector("iframe").getAttribute("src")).toContain("height");
    });

    it("should set width equal to offsetWidth (400) and height as offsetWidth * aspectRatio (200)", () => {
      const component = renderEventStatsCard({ statsUrl: new URL("http://mock-url"), aspectRatio: 0.5 });

      expect(component.container.querySelector("iframe").getAttribute("src")).toEqual(
        "http://mock-url/?width=400&height=200",
      );
    });
  });
});
