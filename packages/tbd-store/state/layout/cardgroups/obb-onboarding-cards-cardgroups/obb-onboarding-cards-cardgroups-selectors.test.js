import { createObbOnboardingCardsCardGroupByURNSelector } from "./obb-onboarding-cards-cardgroups-selectors";
import { FixtureStatus } from "../../../constants";
import { fixtureCodec } from "@ppb/tbd-urn-codecs";

jest.mock("@ppb/tbd-urn-codecs");

const baseCardGroup = {
  typename: "ObbOnboardingCardsCardGroup",
  urn: "urn:cardgroup:1",
  title: "Onboarding",
  badgeLabel: "New",
  event: {
    urn: "urn:event:1",
    name: "Team A vs Team B",
    eventId: "12345",
    openDate: "2099-04-20T15:00:00Z",
  },
  onboardingCards: [],
};

const baseState = {
  layouts: {
    cardgroups: {
      obbonboardingcardsgroups: {
        "urn:cardgroup:1": baseCardGroup,
      },
    },
  },
  entities: {
    footballfixtures: {},
  },
};

describe("createObbOnboardingCardsCardGroupByURNSelector", () => {
  beforeEach(() => {
    jest.mocked(fixtureCodec).encode.mockReturnValue({ uid: "fixture:urn:12345" });
  });

  it("returns undefined when the card group does not exist", () => {
    const selector = createObbOnboardingCardsCardGroupByURNSelector();

    expect(selector(baseState, "urn:cardgroup:unknown")).toBeUndefined();
  });

  it("returns the card group with undefined fixture when there is no matching football fixture", () => {
    const selector = createObbOnboardingCardsCardGroupByURNSelector();

    expect(selector(baseState, "urn:cardgroup:1")).toEqual({
      ...baseCardGroup,
      fixture: undefined,
    });
  });

  it("returns the card group together with the matching football fixture", () => {
    const fixture = {
      urn: "fixture:urn:12345",
      fixtureStatus: FixtureStatus.IN_PLAY,
      scheduledAt: new Date("2099-04-20T15:00:00Z"),
    };
    const state = {
      ...baseState,
      entities: {
        ...baseState.entities,
        footballfixtures: { "fixture:urn:12345": fixture },
      },
    };

    const selector = createObbOnboardingCardsCardGroupByURNSelector();

    expect(selector(state, "urn:cardgroup:1")).toEqual({
      ...baseCardGroup,
      fixture,
    });
  });

  it("returns undefined fixture when the fixture URN cannot be encoded", () => {
    jest.mocked(fixtureCodec).encode.mockReturnValue({ uid: "" });

    const selector = createObbOnboardingCardsCardGroupByURNSelector();

    expect(selector(baseState, "urn:cardgroup:1")).toEqual({
      ...baseCardGroup,
      fixture: undefined,
    });
  });
});
