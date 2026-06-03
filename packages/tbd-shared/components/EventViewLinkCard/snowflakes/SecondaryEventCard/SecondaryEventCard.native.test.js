import { render, fireEvent } from "@testing-library/react-native";
import { SecondaryEventCard } from "./SecondaryEventCard.native";
import styles from "./SecondaryEventCard.native.styles";
import {
  SECONDARY_EVENT_CARD,
  SECONDARY_EVENT_CARD_VIEW,
  START_TIME_SELECTOR,
} from "./SecondaryEventCard.native.selectors";

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {},
  heights: {},
  spacings: {},
  typography: {},
}));

jest.mock("@ppb/the-wall-native", () => ({
  Text: jest.requireActual("react-native").Text,
}));

function renderSecondaryEventCard({
  viewLink = { viewUrl: "https://www.bing.com", viewUrn: "urn:example" },
  runnerNameHome = "Celta de Vigo",
  runnerNameAway = "SL Benfica",
  date = "25 Nov",
  inplay,
  startTime = "21:30",
  style = {},
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
      onTap={onTap}
      style={style}
    />,
  );
}

describe("SecondaryEventCard", () => {
  describe("when not providing custom styles", () => {
    let secondaryEventCardInner;

    beforeEach(() => {
      const { getByTestId } = renderSecondaryEventCard({});
      secondaryEventCardInner = getByTestId(SECONDARY_EVENT_CARD_VIEW);
    });

    it("uses the secondary event card styles", () => {
      expect(secondaryEventCardInner).toHaveStyle(styles.secondaryEventCard);
    });
  });

  describe("When providing a custom style", () => {
    let secondaryEventCardInner;
    let style;

    beforeEach(() => {
      style = { backgroundColor: "white", borderRadius: 12 };
      const { getByTestId } = renderSecondaryEventCard({ style });
      secondaryEventCardInner = getByTestId(SECONDARY_EVENT_CARD_VIEW);
    });

    it("should add the styles to the style attribute", () => {
      expect(secondaryEventCardInner).toHaveStyle({ ...styles.secondaryEventCard, ...style });
    });
  });

  describe("when a callback function is provided", () => {
    let secondaryEventCard;
    const onTap = jest.fn();
    const viewLink = { viewUrl: "https://test.com", viewUrn: "test:urn" };
    const urn = "xcd";

    beforeEach(() => {
      const { getByTestId } = renderSecondaryEventCard({ onTap, viewLink, urn });
      secondaryEventCard = getByTestId(SECONDARY_EVENT_CARD);
      fireEvent(secondaryEventCard, "onPress");
    });

    it("should call callback function when the card is pressed", () => {
      expect(onTap).toHaveBeenCalledWith(null, viewLink, urn);
    });
  });

  describe("when a home runner name is provided", () => {
    let homeRunner;

    beforeEach(() => {
      const runnerText = "runner123";
      const { queryByText } = renderSecondaryEventCard({ runnerNameHome: runnerText });
      homeRunner = queryByText(runnerText);
    });

    it("should display the home runner name", () => {
      expect(homeRunner).not.toBeNull();
      expect(homeRunner).toHaveStyle(styles.runnerNameHome);
    });
  });

  describe("when a away runner name is provided", () => {
    let awayRunner;
    beforeEach(() => {
      const runnerText = "runner away";
      const { queryByText } = renderSecondaryEventCard({ runnerNameAway: runnerText });
      awayRunner = queryByText(runnerText);
    });

    it("should display the away runner name", () => {
      expect(awayRunner).not.toBeNull();
      expect(awayRunner).toHaveStyle(styles.runnerNameAway);
    });
  });

  describe("When inplay data is provided", () => {
    let inPlayElement;
    let dateElement;
    beforeEach(() => {
      const inplay = "In-play test";
      const date = "I wont be displayed because inplay is present";
      const { queryByText } = renderSecondaryEventCard({ inplay, date });
      inPlayElement = queryByText(inplay);
      dateElement = queryByText(date);
    });

    it("should display the inplay label", () => {
      expect(inPlayElement).not.toBeNull();
      expect(inPlayElement).toHaveStyle(styles.inplay);
    });

    it("should not show the date", () => {
      expect(dateElement).toBeNull();
    });
  });

  describe("when inplay data is not provided", () => {
    let dateElement;

    beforeEach(() => {
      const date = "some date";
      const { queryByText } = renderSecondaryEventCard({ date });

      dateElement = queryByText(date);
    });

    it("should display the date", () => {
      expect(dateElement).not.toBeNull();
      expect(dateElement).toHaveStyle(styles.date);
    });
  });

  describe("when a start time is provided", () => {
    let startTimeElement;

    beforeEach(() => {
      const startTime = "18:09";
      const { queryByText } = renderSecondaryEventCard({
        startTime,
      });
      startTimeElement = queryByText(`, ${startTime}`);
    });

    it("should display the start time", () => {
      expect(startTimeElement).not.toBeNull();
      expect(startTimeElement).toHaveStyle(styles.startTime);
    });
  });

  describe("When there's no date related information provided for the event", () => {
    let startTimeElement;

    beforeEach(() => {
      const startTime = null;
      const { queryByTestId } = renderSecondaryEventCard({
        startTime,
      });
      startTimeElement = queryByTestId(START_TIME_SELECTOR);
    });

    it('should not render any "time" related info', () => {
      expect(startTimeElement).toBeNull();
    });
  });
});
