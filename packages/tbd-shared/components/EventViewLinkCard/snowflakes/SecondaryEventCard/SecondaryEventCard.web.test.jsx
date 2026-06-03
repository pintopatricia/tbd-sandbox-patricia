import { render, fireEvent } from "@testing-library/react";
import "jest-dom/extend-expect";

import { SecondaryEventCard } from "./SecondaryEventCard.web";
import styles from "./SecondaryEventCard.web.css";
import { TEST_ID, RUNNER_HOME, RUNNER_AWAY, DATE, INPLAY_LABEL, START_TIME } from "./SecondaryEventCard.web.selectors";

const viewLinkMock = {
  viewUrl: "https://www.bing.com",
  viewUrn: "ppb:tbd:view:external",
};

function renderSecondaryEventCard({
  viewLink = viewLinkMock,
  runnerNameHome = "Celta de Vigo",
  runnerNameAway = "SL Benfica",
  date = "25 Nov",
  inplay,
  startTime = "21:30",
  className = "",
  onTap = () => {},
  urn = "",
}) {
  return render(
    <SecondaryEventCard
      urn={urn}
      viewLink={viewLink}
      runnerNameHome={runnerNameHome}
      runnerNameAway={runnerNameAway}
      date={date}
      inplay={inplay}
      startTime={startTime}
      className={className}
      onTap={onTap}
    />,
  );
}

describe("SecondaryEventCard", () => {
  it("should have the 'secondaryEventCard' class", () => {
    const { container } = renderSecondaryEventCard({});
    const secondaryEventCard = container.querySelector(TEST_ID);

    expect(secondaryEventCard).toHaveClass(styles.secondaryEventCard);
  });

  it("should have the provided link", () => {
    const { container } = renderSecondaryEventCard({});
    const secondaryEventCard = container.querySelector(TEST_ID);
    const cardHrefAttribute = secondaryEventCard.getAttribute("href");

    expect(cardHrefAttribute).toBe("https://www.bing.com");
  });

  it("should display the home runner name", () => {
    const { container } = renderSecondaryEventCard({});
    const runnerNameHome = container.querySelector(RUNNER_HOME);

    expect(runnerNameHome).toHaveTextContent("Celta de Vigo");
  });

  it("should display the away runner name", () => {
    const { container } = renderSecondaryEventCard({});
    const runnerNameAway = container.querySelector(RUNNER_AWAY);

    expect(runnerNameAway).toHaveTextContent("SL Benfica");
    expect(runnerNameAway).toHaveClass(styles.runnerNameAway);
  });

  describe("and inplay data is provided", () => {
    it("should display the inplay label", () => {
      const { container } = renderSecondaryEventCard({ inplay: "In-play" });
      const inplayLabel = container.querySelector(INPLAY_LABEL);
      const date = container.querySelector(DATE);

      expect(date).toBe(null);
      expect(inplayLabel).toHaveTextContent("In-play");
      expect(inplayLabel).toHaveClass(styles.inplay);
    });
  });

  describe("and inplay data is not provided", () => {
    it("should display the date", () => {
      const { container } = renderSecondaryEventCard({});
      const inplayLabel = container.querySelector(INPLAY_LABEL);
      const date = container.querySelector(DATE);

      expect(inplayLabel).toBe(null);
      expect(date).toHaveTextContent("25 Nov");
    });
  });

  it("should display the start time", () => {
    const { container } = renderSecondaryEventCard({});
    const startTime = container.querySelector(START_TIME);

    expect(startTime).toHaveTextContent(", 21:30");
  });

  describe("When providing a custom class name", () => {
    it('should add the custom class name to the root "anchor" element', () => {
      const className = "randomClass";
      const { container } = renderSecondaryEventCard({ className });
      const secondaryEventCard = container.querySelector(TEST_ID);

      expect(secondaryEventCard).toHaveClass(className);
    });
  });

  describe("When there's no date for the event", () => {
    it('should not render any "time" related info', () => {
      const { container } = renderSecondaryEventCard({ startTime: null });
      const startTime = container.querySelector(START_TIME);

      expect(startTime).toBe(null);
    });
  });

  describe("and onTap callback provided", () => {
    it("should call onTap handler on click event", () => {
      const onTapMock = jest.fn().mockImplementation((ev) => ev.preventDefault());
      const { container } = renderSecondaryEventCard({ onTap: onTapMock, urn: "123" });
      const secondaryEventCard = container.querySelector(TEST_ID);
      fireEvent.click(secondaryEventCard);

      expect(onTapMock).toHaveBeenCalledTimes(1);
      expect(onTapMock).toHaveBeenCalledWith(expect.anything(), viewLinkMock, "123");
    });
  });
});
