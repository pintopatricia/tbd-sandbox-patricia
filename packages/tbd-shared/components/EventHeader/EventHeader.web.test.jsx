import "jest-dom/extend-expect";
import { render } from "@testing-library/react";
import { EventHeader as EventHeaderComponent } from "@ppb/the-wall-web";
import { IconsList } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";

import EventHeader from "./EventHeader.web";

jest.mock("@ppb/the-wall-web", () => ({
  EventHeader: jest.fn(() => <event-header-mock />),
}));

jest.mock("../../hooks/useDebounce", () => jest.fn().mockImplementation(() => "inPlay"));

const PROPS = {
  title: "title",
  subtitle: "subtitle",
  inPlay: "inPlay",
  tertiaryTitle: "tertiaryTitle",
  isSticky: false,
  showBorder: true,
  viewMode: "DEFAULT",
  homeRunnerName: "home runner",
  awayRunnerName: "away runner",
  date: "yesterday",
  time: "03:90",
  iconsList: [IconsList.NINETY_MINUTE_PAYOUT],
  showHorizontalDuration: false,
};

function renderEventHeader(props = PROPS) {
  return render(<EventHeader {...props}></EventHeader>);
}

describe("EventHeader", () => {
  beforeEach(jest.clearAllMocks);

  it("should render event header component with the correct props", () => {
    renderEventHeader();

    expect(EventHeaderComponent).toHaveBeenCalledWith(
      {
        awayRunnerName: "away runner",
        date: "yesterday",
        homeRunnerName: "home runner",
        inPlay: "inPlay",
        isSticky: false,
        showBorder: true,
        subtitle: "subtitle",
        tertiaryTitle: "tertiaryTitle",
        time: "03:90",
        title: "title",
        viewMode: "DEFAULT",
        iconsList: [IconsList.NINETY_MINUTE_PAYOUT],
        showHorizontalDuration: false,
      },
      undefined,
    );
  });
});
