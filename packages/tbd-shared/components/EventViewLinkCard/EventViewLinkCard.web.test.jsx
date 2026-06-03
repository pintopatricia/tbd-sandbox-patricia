import { render } from "@testing-library/react";
import { SecondaryEventCard } from "./snowflakes/SecondaryEventCard/SecondaryEventCard.web";
import ConnectedEventViewLinkCard from "./EventViewLinkCard.web";

jest.mock("./snowflakes/SecondaryEventCard/SecondaryEventCard.web", () => ({
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
const mockTapCard = jest.fn();

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
        { ...secondaryCardPropsMock, onTap: expect.any(Function) },
        undefined,
      );
    });
  });

  describe("when onTap is called", () => {
    it("should dispatch the onTapHandler actions", () => {
      renderConnectedEventViewLink(secondaryCardPropsMock, mockTapCard, mockPushAction);
      expect(SecondaryEventCard).toHaveBeenCalled();

      const { onTap } = SecondaryEventCard.mock.calls[0][0];
      const eventMock = { preventDefault: jest.fn() };
      onTap(eventMock, { viewUrn: "fakeUrn", viewUrl: "fakeUrl" }, "123");

      expect(eventMock.preventDefault).toHaveBeenCalled();
      expect(mockTapCard).toHaveBeenCalledWith("123", "sportEventURN", "fakeUrl", "fixtureURN");
      expect(mockPushAction).toHaveBeenCalledWith({ viewUrl: "fakeUrl", viewUrn: "fakeUrn" });
    });
  });
});
