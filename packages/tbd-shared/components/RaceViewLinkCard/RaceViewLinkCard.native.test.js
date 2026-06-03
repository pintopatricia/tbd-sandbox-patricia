import { render } from "@testing-library/react-native";
import { navigate } from "@ppb/tbd-router/native";
import { RaceViewLinkCard as RaceViewLinkCardComponent } from "./snowflakes/RaceViewLinkCard/RaceViewLinkCard.native";
import RaceViewLinkCard from "./RaceViewLinkCard.native";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useRef: jest.fn(),
}));
jest.mock("@ppb/tbd-router/native", () => ({ navigate: jest.fn() }));
jest.mock("./snowflakes/RaceViewLinkCard/RaceViewLinkCard.native", () => ({
  RaceViewLinkCard: jest.fn(() => <race-view-link-card-mock />),
}));

const dispatchPushAction = jest.fn();

function renderComponent(venue, countryFlag, viewLink) {
  return render(
    <RaceViewLinkCard
      venue={venue}
      countryFlag={countryFlag}
      viewLink={viewLink}
      dispatchPushAction={dispatchPushAction}
    />,
  );
}

const raceViewLinkMock = {
  venue: "Cheltenham",
  countryFlag: { small: "countryFlagURL" },
  viewLink: {
    viewUrn: "ppb:tbd:view:race:7|30089529.1910",
    viewUrl: "horse-racing/fair-(rsa)-26th-oct/r-7%7C30089529.1910",
  },
  dispatchPushAction,
};

describe("RaceViewLinkCard component", () => {
  beforeEach(jest.clearAllMocks);

  it("should render RaceViewLinkCardComponent", () => {
    const raceViewLinkComponent = renderComponent(
      raceViewLinkMock.venue,
      raceViewLinkMock.countryFlag,
      raceViewLinkMock.viewLink,
    );

    expect(raceViewLinkComponent).toBeDefined();
    expect(RaceViewLinkCardComponent).toHaveBeenCalledTimes(1);
    expect(RaceViewLinkCardComponent).toHaveBeenCalledWith(
      {
        onClick: expect.any(Function),
        title: "Cheltenham",
        countryFlag: {
          small: "countryFlagURL",
        },
      },
      undefined,
    );
  });

  describe("when link is clicked", () => {
    it("should call the onClick callback", () => {
      RaceViewLinkCardComponent.mockClear();

      renderComponent(raceViewLinkMock.venue, raceViewLinkMock.countryFlag, raceViewLinkMock.viewLink);

      const { onClick } = RaceViewLinkCardComponent.mock.calls[0][0];
      onClick();

      expect(dispatchPushAction).toHaveBeenCalledWith(raceViewLinkMock.viewLink);
      expect(navigate).toHaveBeenCalledWith(raceViewLinkMock.viewLink);
    });
  });
});
