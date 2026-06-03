import "jest-dom/extend-expect";
import { render } from "@testing-library/react";
import { EventHeader } from "@ppb/the-wall-web";
import EventHeaderCard from "./EventHeaderCard.web";

jest.mock("@ppb/the-wall-web", () => ({
  EventHeader: jest.fn(() => <event-header-mock />),
}));

const PROPS = {
  title: "title",
  subtitle: "subtitle",
  tertiaryTitle: "tertiaryTitle",
  date: "yesterday",
  time: "03:90",
  dateTime: "2023-04-11T19:00:00.000Z",
};

function renderEventHeader(props = PROPS) {
  return render(<EventHeaderCard {...props}></EventHeaderCard>);
}

describe("EventHeaderCard", () => {
  beforeEach(jest.clearAllMocks);

  describe("when title isn't available", () => {
    beforeEach(jest.clearAllMocks);

    it("should not render the event header component", () => {
      renderEventHeader({});

      expect(EventHeader).not.toHaveBeenCalled();
    });
  });

  describe("when title is available", () => {
    beforeEach(jest.clearAllMocks);

    it("should render event header component with the correct props", () => {
      renderEventHeader();

      expect(EventHeader).toHaveBeenCalledWith(
        {
          title: "title",
          subtitle: "subtitle",
          tertiaryTitle: "tertiaryTitle",
          date: "yesterday",
          time: "03:90",
          viewMode: "COUPON",
          dateTime: "2023-04-11T19:00:00.000Z",
        },
        undefined,
      );
    });
  });
});
