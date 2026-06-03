import { render } from "@testing-library/react-native";
import { SecondaryEventCard } from "./snowflakes/SecondaryEventCard/SecondaryEventCard.native";
import ConnectedEventViewLinkCard from "./EventViewLinkCard.native";
import styles from "./EventViewLinkCard.native.styles";

const mockNavigate = jest.fn();
jest.mock("@ppb/tbd-router/native", () => ({ navigate: (viewLink) => mockNavigate(viewLink) }));
jest.mock("./snowflakes/SecondaryEventCard/SecondaryEventCard.native", () => ({
  SecondaryEventCard: jest.fn((props) => <secondary-event-card {...props} />),
}));

const secondaryCardPropsMock = {
  urn: "urn",
  viewLink: { viewUrn: "fake_urn", viewUrl: "fake_eventUrl" },
  eventName: "EventName",
  home: { name: "fake_runnerNameHome" },
  away: { name: "fake_runnerNameAway" },
};

const mockPushAction = jest.fn();
const mockClickCard = jest.fn();

function renderConnectedEventViewLink(viewlink, clickCard = () => {}, pushAction = () => {}) {
  return render(
    <ConnectedEventViewLinkCard
      viewlink={viewlink}
      fixtureURN={"fixtureURN"}
      sportEventURN={"sportEventURN"}
      dispatchClickCard={clickCard}
      dispatchPushAction={pushAction}
    />,
  );
}

describe("ConnectedEventViewLinks component", () => {
  afterEach(jest.clearAllMocks);

  describe("when initialized", () => {
    it("should render a SecondaryEventCard card", () => {
      renderConnectedEventViewLink(secondaryCardPropsMock);
      expect(SecondaryEventCard).toHaveBeenCalledWith(
        { ...secondaryCardPropsMock, style: styles.linkCard, onTap: expect.any(Function) },
        undefined,
      );
    });
  });

  describe("when there are no viewlink to render", () => {
    it("should render an empty element", () => {
      renderConnectedEventViewLink(null);
      expect(SecondaryEventCard).not.toHaveBeenCalled();
    });
  });

  describe("when onTap is called", () => {
    it("should dispatch the onTapHandler actions", () => {
      renderConnectedEventViewLink(secondaryCardPropsMock, mockClickCard, mockPushAction);
      expect(SecondaryEventCard).toHaveBeenCalled();

      const { onTap } = SecondaryEventCard.mock.calls[0][0];
      const eventMock = {};
      onTap(eventMock, { viewUrn: "fakeUrn", viewUrl: "fakeUrl" }, "123");

      expect(mockClickCard).toHaveBeenCalledWith("123", "sportEventURN", "fakeUrl", "fixtureURN");
      expect(mockNavigate).toHaveBeenCalledWith({ viewUrl: "fakeUrl", viewUrn: "fakeUrn" });
    });
  });
});
