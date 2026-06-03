import { createObbEventPopularsCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/obb-event-populars-card/obb-event-populars-card-selectors";
import { FixtureStatus } from "@ppb/tbd-store/state/constants";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";
import { buildPopularBettingOpportunitiesVm } from "./ObbEventPopularsCard.helpers";

const DEFAULT_STATE = {
  layouts: {
    cards: {
      obbeventpopularscards: {
        "eventPopularsCard:urn:1": {},
      },
    },
  },
  entities: {
    preferences: {},
    experiments: {},
  },
};

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.mock("@ppb/tbd-store/state/layout/cards/obb-event-populars-card/obb-event-populars-card-selectors", () => ({
  createObbEventPopularsCardByURNSelector: jest.fn(),
}));

jest.mock("./ObbEventPopularsCard.helpers", () => ({
  buildPopularBettingOpportunitiesVm: jest.fn(),
}));

const getObbEventPopularsCardByURN = jest.fn();

const createMockCard = () => ({
  typename: "ObbEventPopularsCard",
  urn: "eventPopularsCard:urn:1",
  title: "Popular Bets",
  badgeLabel: "Hot",
  sportEvent: {
    urn: "event:urn:1",
    name: "Team A v Team B",
  },
  showPopularEvidence: true,
  showStats: true,
  numberOfVisibleBettingOpportunities: 5,
  popularBettingOpportunities: [
    {
      betCount: 150,
      participants: [
        { urn: "participant:1", name: "Player 1" },
        { urn: "participant:2", name: "Player 2" },
      ],
      legId: "leg:1",
    },
  ],
});

describe("makeMapStateToProps", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when the card is not defined", () => {
    it("should return an empty object", () => {
      createObbEventPopularsCardByURNSelector.mockReturnValue(getObbEventPopularsCardByURN);
      getObbEventPopularsCardByURN.mockReturnValueOnce(undefined);

      const mapStateToProps = makeMapStateToProps();
      const stateToProps = mapStateToProps(DEFAULT_STATE, { urn: "urn" });

      expect(stateToProps).toEqual({});
    });
  });

  describe("when the card has no betting opportunities", () => {
    it("should return an empty object", () => {
      createObbEventPopularsCardByURNSelector.mockReturnValue(getObbEventPopularsCardByURN);
      getObbEventPopularsCardByURN.mockReturnValueOnce({
        typename: "ObbEventPopularsCard",
        urn: "eventPopularsCard:urn:1",
        title: "Popular Bets",
        badgeLabel: "Hot",
        sportEvent: {
          urn: "event:urn:1",
          name: "Team A v Team B",
        },
        showPopularEvidence: true,
        showStats: true,
        numberOfVisibleBettingOpportunities: 5,
        popularBettingOpportunities: [],
      });

      const mapStateToProps = makeMapStateToProps();
      const stateToProps = mapStateToProps(DEFAULT_STATE, { urn: "eventPopularsCard:urn:1" });

      expect(stateToProps).toEqual({});
    });
  });

  describe("when the card is defined with betting opportunities", () => {
    it("should map state to props correctly", () => {
      createObbEventPopularsCardByURNSelector.mockReturnValue(getObbEventPopularsCardByURN);
      getObbEventPopularsCardByURN.mockReturnValueOnce({
        typename: "ObbEventPopularsCard",
        urn: "eventPopularsCard:urn:1",
        title: "Popular Bets",
        badgeLabel: "Hot",
        sportEvent: {
          urn: "event:urn:1",
          name: "Team A v Team B",
        },
        showPopularEvidence: true,
        showStats: true,
        numberOfVisibleBettingOpportunities: 5,
        popularBettingOpportunities: [
          {
            betCount: 150,
            participants: [
              { urn: "participant:1", name: "Player 1" },
              { urn: "participant:2", name: "Player 2" },
            ],
            legId: "leg:1",
          },
          {
            betCount: 95,
            participants: [
              { urn: "participant:3", name: "Player 3" },
              { urn: "participant:4", name: "Player 4" },
            ],
            legId: "leg:2",
          },
        ],
      });

      buildPopularBettingOpportunitiesVm.mockReturnValueOnce([
        {
          title: "Leg 1 title",
          subtitle: "Leg 1 subtitle",
          stats: "Leg 1 stats",
          legId: "leg:1",
          timesBackedLabel: "I18N.POPULAR.TIMES_BACKED",
        },
        {
          title: "Leg 2 title",
          subtitle: "Leg 2 subtitle",
          stats: "Leg 2 stats",
          legId: "leg:2",
          timesBackedLabel: "I18N.POPULAR.TIMES_BACKED",
        },
      ]);

      const mapStateToProps = makeMapStateToProps();
      const stateToProps = mapStateToProps(DEFAULT_STATE, { urn: "eventPopularsCard:urn:1" });

      expect(stateToProps).toEqual({
        title: "Popular Bets",
        badgeText: "Hot",
        showPopularEvidence: true,
        showStats: true,
        eventName: "Team A v Team B",
        hasEventStarted: false,
        initialNumberOfVisibleBettingOpportunities: 5,
        popularBettingOpportunities: [
          {
            title: "Leg 1 title",
            subtitle: "Leg 1 subtitle",
            stats: "Leg 1 stats",
            legId: "leg:1",
            timesBackedLabel: "I18N.POPULAR.TIMES_BACKED",
          },
          {
            title: "Leg 2 title",
            subtitle: "Leg 2 subtitle",
            stats: "Leg 2 stats",
            legId: "leg:2",
            timesBackedLabel: "I18N.POPULAR.TIMES_BACKED",
          },
        ],
      });
    });

    it("should map state to props correctly when badgeLabel is undefined", () => {
      createObbEventPopularsCardByURNSelector.mockReturnValue(getObbEventPopularsCardByURN);
      getObbEventPopularsCardByURN.mockReturnValueOnce({
        typename: "ObbEventPopularsCard",
        urn: "eventPopularsCard:urn:1",
        title: "Popular Bets",
        badgeLabel: undefined,
        sportEvent: {
          urn: "event:urn:1",
          name: "Team A v Team B",
        },
        showPopularEvidence: false,
        showStats: false,
        numberOfVisibleBettingOpportunities: 3,
        popularBettingOpportunities: [
          {
            betCount: 100,
            participants: [
              { urn: "participant:1", name: "Player 1" },
              { urn: "participant:2", name: "Player 2" },
            ],
            legId: "leg:1",
          },
        ],
      });

      buildPopularBettingOpportunitiesVm.mockReturnValueOnce([
        {
          title: "Leg 1 title",
          subtitle: "Leg 1 subtitle",
          stats: "Leg 1 stats",
          legId: "leg:1",
          timesBackedLabel: "I18N.POPULAR.TIMES_BACKED",
        },
      ]);

      const mapStateToProps = makeMapStateToProps();
      const stateToProps = mapStateToProps(DEFAULT_STATE, { urn: "eventPopularsCard:urn:1" });

      expect(stateToProps).toEqual({
        title: "Popular Bets",
        badgeText: undefined,
        showPopularEvidence: false,
        showStats: false,
        eventName: "Team A v Team B",
        hasEventStarted: false,
        initialNumberOfVisibleBettingOpportunities: 3,
        popularBettingOpportunities: [
          {
            title: "Leg 1 title",
            subtitle: "Leg 1 subtitle",
            stats: "Leg 1 stats",
            legId: "leg:1",
            timesBackedLabel: "I18N.POPULAR.TIMES_BACKED",
          },
        ],
      });
    });
  });

  describe("when the fixture status is pre match", () => {
    it("should set hasEventStarted to false", () => {
      createObbEventPopularsCardByURNSelector.mockReturnValue(getObbEventPopularsCardByURN);
      getObbEventPopularsCardByURN.mockReturnValueOnce({
        ...createMockCard(),
        fixture: {
          fixtureStatus: FixtureStatus.PRE_MATCH,
          scheduledAt: new Date(Date.now() + 10000),
        },
      });

      const mapStateToProps = makeMapStateToProps();
      const stateToProps = mapStateToProps(DEFAULT_STATE, { urn: "eventPopularsCard:urn:1" });

      expect(stateToProps.hasEventStarted).toBe(false);
    });
  });

  describe("when fixture status is in play", () => {
    it("should set hasEventStarted to true", () => {
      createObbEventPopularsCardByURNSelector.mockReturnValue(getObbEventPopularsCardByURN);
      getObbEventPopularsCardByURN.mockReturnValueOnce({
        ...createMockCard(),
        fixture: {
          fixtureStatus: FixtureStatus.IN_PLAY,
          scheduledAt: new Date(Date.now() - 10000),
        },
      });

      const mapStateToProps = makeMapStateToProps();
      const stateToProps = mapStateToProps(DEFAULT_STATE, { urn: "eventPopularsCard:urn:1" });

      expect(stateToProps.hasEventStarted).toBe(true);
    });
  });

  describe("when scheduled time has passed", () => {
    it("should set hasEventStarted to true", () => {
      createObbEventPopularsCardByURNSelector.mockReturnValue(getObbEventPopularsCardByURN);
      getObbEventPopularsCardByURN.mockReturnValueOnce({
        ...createMockCard(),
        fixture: {
          scheduledAt: new Date(Date.now() - 5000),
        },
      });

      const mapStateToProps = makeMapStateToProps();
      const stateToProps = mapStateToProps(DEFAULT_STATE, { urn: "eventPopularsCard:urn:1" });

      expect(stateToProps.hasEventStarted).toBe(true);
    });
  });

  describe("when scheduled time is in the future", () => {
    it("should set hasEventStarted to false", () => {
      createObbEventPopularsCardByURNSelector.mockReturnValue(getObbEventPopularsCardByURN);
      getObbEventPopularsCardByURN.mockReturnValueOnce({
        ...createMockCard(),
        fixture: {
          scheduledAt: new Date(Date.now() + 5000),
        },
      });

      const mapStateToProps = makeMapStateToProps();
      const stateToProps = mapStateToProps(DEFAULT_STATE, { urn: "eventPopularsCard:urn:1" });

      expect(stateToProps.hasEventStarted).toBe(false);
    });
  });

  describe("when fixture is undefined", () => {
    it("should set hasEventStarted to false", () => {
      createObbEventPopularsCardByURNSelector.mockReturnValue(getObbEventPopularsCardByURN);
      getObbEventPopularsCardByURN.mockReturnValueOnce(createMockCard({ fixture: undefined }));

      const mapStateToProps = makeMapStateToProps();
      const stateToProps = mapStateToProps(DEFAULT_STATE, { urn: "eventPopularsCard:urn:1" });

      expect(stateToProps.hasEventStarted).toBe(false);
    });
  });

  describe("when fixture status is IN_PLAY but scheduled time is in the future", () => {
    it("should set hasEventStarted to true", () => {
      createObbEventPopularsCardByURNSelector.mockReturnValue(getObbEventPopularsCardByURN);
      getObbEventPopularsCardByURN.mockReturnValueOnce({
        ...createMockCard(),
        fixture: {
          fixtureStatus: FixtureStatus.IN_PLAY,
          scheduledAt: new Date(Date.now() + 10000),
        },
      });

      const mapStateToProps = makeMapStateToProps();
      const stateToProps = mapStateToProps(DEFAULT_STATE, { urn: "eventPopularsCard:urn:1" });

      expect(stateToProps.hasEventStarted).toBe(true);
    });
  });
});

describe("mapDispatchToProps", () => {
  const dispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should dispatch DELETE_VIEW_ITEMS when dispatchDeleteObbEventPopularsCard is called", () => {
    const { dispatchDeleteObbEventPopularsCard } = mapDispatchToProps(dispatch, { urn: "eventPopularsCard:urn:1" });

    dispatchDeleteObbEventPopularsCard();

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({
      type: "DELETE_VIEW_ITEMS",
      payload: ["eventPopularsCard:urn:1"],
    });
  });

  it("should dispatch OBB_EVENT_POPULARS_CARD__SHOW_MORE_CLICKED when dispatchObbEventPopularsCardToggleShowMore is called", () => {
    const { dispatchObbEventPopularsCardToggleShowMore } = mapDispatchToProps(dispatch, {
      cardUrn: "cardUrn",
      eventName: "napoli v chelsea",
      showMore: true,
    });

    dispatchObbEventPopularsCardToggleShowMore("cardUrn", "napoli v chelsea", true);

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({
      type: "OBB_EVENT_POPULARS_CARD/SHOW_MORE_CLICKED",
      payload: {
        cardUrn: "cardUrn",
        eventName: "napoli v chelsea",
        showMore: true,
      },
    });
  });
});
