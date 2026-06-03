import { buildInterfaceEvent } from "tagging-library";
import { getStore } from "@ppb/tbd-store/create-store";
import { createViewTypeSelector } from "@ppb/tbd-store/state/layout/layout-selectors";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { createIsEventSubscribedByEventIdSelector } from "@ppb/tbd-store/state/entities/notifications/notifications-selectors";
import { formatTime } from "../../../../helpers/dates";
import { getRaceTrackingData } from "./NotificationsSubscription.graphql";
import { pnInteractionRaceTrackingResolver } from "./notifications-subscription-resolvers";

jest.mock("tagging-library", () => ({
  buildInterfaceEvent: jest.fn(() => "INTERFACE_EVENT"),
}));

jest.mock("@ppb/tbd-store/create-store", () => ({
  getStore: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/layout/layout-selectors", () => ({
  createViewTypeSelector: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  createGetCountryLocalCurrencyCodeSelector: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/entities/notifications/notifications-selectors", () => ({
  createIsEventSubscribedByEventIdSelector: jest.fn(),
}));

jest.mock("../../../../helpers/dates", () => ({
  formatTime: jest.fn(() => "15:00"),
}));

jest.mock("./NotificationsSubscription.graphql", () => ({
  getRaceTrackingData: jest.fn(),
}));

const RACE_URN = "ppb:race:12345.1500";

const TRACKING_DATA = {
  raceId: "12345.1500",
  name: "1m4f Maiden Stakes",
  startTime: "2026-04-23T15:00:00Z",
  meeting: {
    venue: "Newmarket",
    sport: { name: "Horse Racing" },
  },
};

const setUp = ({
  trackingData = TRACKING_DATA,
  pageType = "RACE",
  localeCode = "en-GB",
  timezone = "UTC",
  wasSubscribed = false,
}: {
  trackingData?: typeof TRACKING_DATA | null;
  pageType?: string;
  localeCode?: string;
  timezone?: string;
  wasSubscribed?: boolean;
} = {}) => {
  (getRaceTrackingData as jest.Mock).mockResolvedValue(trackingData);
  (createViewTypeSelector as jest.Mock).mockReturnValue(() => pageType);
  (createGetCountryLocalCurrencyCodeSelector as jest.Mock).mockReturnValue(() => ({ localeCode, timezone }));
  (createIsEventSubscribedByEventIdSelector as jest.Mock).mockReturnValue(() => wasSubscribed);
  (getStore as jest.Mock).mockReturnValue({
    getState: () => ({ entities: { notifications: { foo: "bar" } } }),
  });
};

describe("pnInteractionRaceTrackingResolver", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (formatTime as jest.Mock).mockReturnValue("15:00");
  });

  it("does nothing when no race data is found", async () => {
    setUp({ trackingData: null });
    const sendEvent = jest.fn();

    await pnInteractionRaceTrackingResolver({ raceUrn: RACE_URN }, sendEvent);

    expect(buildInterfaceEvent).not.toHaveBeenCalled();
    expect(sendEvent).not.toHaveBeenCalled();
  });

  it("uses the OFF label when the race was already subscribed", async () => {
    setUp({ wasSubscribed: true });
    const sendEvent = jest.fn();

    await pnInteractionRaceTrackingResolver({ raceUrn: RACE_URN }, sendEvent);

    expect(buildInterfaceEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "clicked",
        elementText: "notification off",
      }),
    );
  });

  it("uses the ON label when the race was not subscribed", async () => {
    setUp({ wasSubscribed: false });
    const sendEvent = jest.fn();

    await pnInteractionRaceTrackingResolver({ raceUrn: RACE_URN }, sendEvent);

    expect(buildInterfaceEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "clicked",
        elementText: "notification on",
      }),
    );
  });

  it("formats the start time using the user's locale and timezone", async () => {
    setUp({ localeCode: "en-IE", timezone: "Europe/Dublin" });
    const sendEvent = jest.fn();

    await pnInteractionRaceTrackingResolver({ raceUrn: RACE_URN }, sendEvent);

    expect(formatTime).toHaveBeenCalledWith(TRACKING_DATA.startTime, "en-IE", "Europe/Dublin");
  });

  it("builds a lowercase module string from sport, venue, race name, and start time", async () => {
    setUp({ pageType: "race-meeting" });
    const sendEvent = jest.fn();

    await pnInteractionRaceTrackingResolver({ raceUrn: RACE_URN }, sendEvent);

    expect(buildInterfaceEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        module: "race-meeting - notifications - horse racing - newmarket - 1m4f maiden stakes 15:00",
      }),
    );
  });

  it("dispatches the built interface event via sendEvent", async () => {
    setUp();
    const sendEvent = jest.fn();

    await pnInteractionRaceTrackingResolver({ raceUrn: RACE_URN }, sendEvent);

    expect(sendEvent).toHaveBeenCalledWith("INTERFACE_EVENT");
  });

  it("checks subscription status against the race id, not the urn", async () => {
    const isSubscribed = jest.fn(() => false);
    (createIsEventSubscribedByEventIdSelector as jest.Mock).mockReturnValue(isSubscribed);
    setUp();
    (createIsEventSubscribedByEventIdSelector as jest.Mock).mockReturnValue(isSubscribed);

    await pnInteractionRaceTrackingResolver({ raceUrn: RACE_URN }, jest.fn());

    expect(isSubscribed).toHaveBeenCalledWith({ foo: "bar" }, TRACKING_DATA.raceId);
  });
});
