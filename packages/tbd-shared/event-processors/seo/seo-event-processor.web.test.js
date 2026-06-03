import subscribeEvent from "../../event-broker/event-subscriber";
import { resolveRaceMeetingViewSeo } from "./resolvers/race-meeting-view-seo-resolver";
import register from "./seo-event-processor.web";

jest.mock("../../event-broker/event-subscriber", () => jest.fn());

jest.mock("./resolvers/race-meeting-view-seo-resolver", () => ({
  resolveRaceMeetingViewSeo: jest.fn(),
}));

describe("seo-event-processor.web", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should subscribe to @@UI/RACE_MEETING_VIEW_LOADED event", () => {
    register();

    expect(subscribeEvent).toHaveBeenCalledWith("@@UI/RACE_MEETING_VIEW_LOADED", expect.any(Function));
  });

  it("invokes resolveRaceMeetingViewSeo with the event urn", async () => {
    resolveRaceMeetingViewSeo.mockResolvedValue(undefined);

    register();

    const callback = subscribeEvent.mock.calls.find((call) => call[0] === "@@UI/RACE_MEETING_VIEW_LOADED")[1];
    await callback({ urn: "ppb:tbd:view:raceMeeting:7|12345.1500" });

    expect(resolveRaceMeetingViewSeo).toHaveBeenCalledWith("ppb:tbd:view:raceMeeting:7|12345.1500");
  });
});
