import { render } from "@testing-library/react-native";
import { EventHeader } from "@ppb/the-wall-native";
import EventHeaderCard from "./EventHeaderCard.native";

jest.mock("@ppb/the-wall-native", () => ({
  EventHeader: jest.fn(() => <event-header-mock />),
}));

const PROPS = {
  title: "title",
  subtitle: "subtitle",
  tertiaryTitle: "tertiaryTitle",
  date: "yesterday",
  time: "03:90",
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
        },
        undefined,
      );
    });
  });
});
