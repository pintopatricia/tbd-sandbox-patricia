import { navigateToPlayerPageResolver } from "./player-page-resolvers";
import { buildNavigationEvent } from "tagging-library";
import { TaggingAction } from "@ppb/tbd-store/middlewares/tagging-resolvers/AnalyticsConstants";
import { formatTextToGA } from "@ppb/tbd-store/middlewares/ga4-tagging-resolvers/helpers";

jest.mock("tagging-library", () => ({
  buildNavigationEvent: jest.fn(),
}));

jest.mock("@ppb/tbd-store/middlewares/ga4-tagging-resolvers/helpers", () => ({
  formatTextToGA: jest.fn(),
}));

describe("navigateToPlayerPageResolver", () => {
  const mockSendEvent = jest.fn();
  const mockPayload = {
    playerName: "John Doe",
    viewLink: { viewUrl: "https://example.com/player/john-doe" },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call buildNavigationEvent with the correct parameters", async () => {
    formatTextToGA.mockReturnValue("formatted-player-name");
    const mockEvent = { eventType: "navigation" };
    buildNavigationEvent.mockReturnValue(mockEvent);

    await navigateToPlayerPageResolver(mockPayload, mockSendEvent);

    expect(formatTextToGA).toHaveBeenCalledWith(mockPayload.playerName);
    expect(buildNavigationEvent).toHaveBeenCalledWith({
      action: TaggingAction.NAVIGATED_TO,
      elementText: "formatted-player-name",
      module: `Event - Player Season Stats - ${mockPayload.playerName}`,
      destinationUrl: mockPayload.viewLink.viewUrl,
      position: "null",
      moduleDisplayOrder: "null",
    });
  });

  it("should call sendEvent with the event returned by buildNavigationEvent", async () => {
    const mockEvent = { eventType: "navigation" };
    buildNavigationEvent.mockReturnValue(mockEvent);

    await navigateToPlayerPageResolver(mockPayload, mockSendEvent);

    expect(mockSendEvent).toHaveBeenCalledWith(mockEvent);
  });
});
