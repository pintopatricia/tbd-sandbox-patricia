import { getStore } from "@ppb/tbd-store/create-store";
import { resolveAndDispatchSeo } from "@ppb/tbd-store/middlewares/seo/seo-metadata-resolver";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { convertToSMDCompliantDateTime } from "@ppb/tbd-store/helpers/dates";
import { getApolloClient } from "../../../apollo-client/client";
import { buildRaceMeetingViewSeoInput, resolveRaceMeetingViewSeo } from "./race-meeting-view-seo-resolver";

jest.mock("../../../apollo-client/client", () => ({
  getApolloClient: jest.fn(),
}));

jest.mock("@ppb/tbd-store/create-store", () => ({
  getStore: jest.fn(),
}));

jest.mock("@ppb/tbd-store/middlewares/seo/seo-metadata-resolver", () => ({
  resolveAndDispatchSeo: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  getUserDetails: jest.fn(),
}));

jest.mock("@ppb/tbd-store/helpers/dates", () => ({
  convertToSMDCompliantDateTime: jest.fn((date) => `smd:${date}`),
}));

const VIEW_URN = "ppb:tbd:view:raceMeeting:7|12345.1500";

const FRAGMENT_DATA = {
  meeting: {
    urn: "ppb:meeting:12345",
    venue: "Newmarket",
    sport: { sportId: 7 },
  },
  items: {
    selectedRace: {
      race: {
        urn: "ppb:race:12345.1500",
        name: "1m4f Maiden Stakes",
        startTime: "2026-04-27T15:30:00.000Z",
      },
    },
  },
};

describe("buildRaceMeetingViewSeoInput", () => {
  let cache;
  let apolloClient;

  beforeEach(() => {
    jest.clearAllMocks();

    cache = {
      identify: jest.fn(),
      readFragment: jest.fn(),
    };
    apolloClient = { cache };
  });

  describe("when the cache cannot identify the view", () => {
    it("returns null and does not read any fragment", () => {
      cache.identify.mockReturnValue(undefined);

      const result = buildRaceMeetingViewSeoInput(apolloClient, VIEW_URN, "Europe/London");

      expect(result).toBeNull();
      expect(cache.readFragment).not.toHaveBeenCalled();
    });
  });

  describe("when the fragment is not in the cache", () => {
    it("returns null", () => {
      cache.identify.mockReturnValue(`RaceMeetingView:${VIEW_URN}`);
      cache.readFragment.mockReturnValue(null);

      const result = buildRaceMeetingViewSeoInput(apolloClient, VIEW_URN, "Europe/London");

      expect(result).toBeNull();
    });
  });

  describe("when the fragment is in the cache", () => {
    beforeEach(() => {
      cache.identify.mockReturnValue(`RaceMeetingView:${VIEW_URN}`);
      cache.readFragment.mockReturnValue(FRAGMENT_DATA);
    });

    it("returns a SeoInput built from the cached fragment", () => {
      const result = buildRaceMeetingViewSeoInput(apolloClient, VIEW_URN, "Europe/London");

      expect(convertToSMDCompliantDateTime).toHaveBeenCalledWith("2026-04-27T15:30:00.000Z", "Europe/London");
      expect(result).toEqual({
        pageIdentifier: {
          pageType: "RACE",
          eventTypeId: 7,
        },
        pageData: {
          race: {
            raceName: "1m4f Maiden Stakes",
            venueName: "Newmarket",
            raceTime: "smd:2026-04-27T15:30:00.000Z",
          },
        },
        metaElements: ["META_TITLE", "META_DESCRIPTION"],
      });
    });
  });
});

describe("resolveRaceMeetingViewSeo", () => {
  let cache;
  let apolloClient;

  beforeEach(() => {
    jest.clearAllMocks();

    cache = {
      identify: jest.fn(),
      readFragment: jest.fn(),
    };
    apolloClient = { cache };

    getApolloClient.mockReturnValue(apolloClient);
    getStore.mockReturnValue({ getState: () => ({}) });
    getUserDetails.mockReturnValue({ timezone: "Europe/London" });
  });

  it("does not call resolveAndDispatchSeo when no input can be built", async () => {
    cache.identify.mockReturnValue(undefined);

    await resolveRaceMeetingViewSeo(VIEW_URN);

    expect(resolveAndDispatchSeo).not.toHaveBeenCalled();
  });

  it("calls resolveAndDispatchSeo with the built input", async () => {
    cache.identify.mockReturnValue(`RaceMeetingView:${VIEW_URN}`);
    cache.readFragment.mockReturnValue(FRAGMENT_DATA);

    await resolveRaceMeetingViewSeo(VIEW_URN);

    expect(resolveAndDispatchSeo).toHaveBeenCalledWith({
      pageIdentifier: {
        pageType: "RACE",
        eventTypeId: 7,
      },
      pageData: {
        race: {
          raceName: "1m4f Maiden Stakes",
          venueName: "Newmarket",
          raceTime: "smd:2026-04-27T15:30:00.000Z",
        },
      },
      metaElements: ["META_TITLE", "META_DESCRIPTION"],
    });
  });
});
