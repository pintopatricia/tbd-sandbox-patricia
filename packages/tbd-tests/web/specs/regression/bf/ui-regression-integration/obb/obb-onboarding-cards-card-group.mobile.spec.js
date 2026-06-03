const { ObbOnboardingCardsCardGroupPO, ScrollableSwimlanePO, EventPagePO } = require("../../../../../page-objects");

const { getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");

const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const obbOnboardingCardsCardGroupPO = new ObbOnboardingCardsCardGroupPO();
const scrollableSwimlanePO = new ScrollableSwimlanePO();
const eventPagePO = new EventPagePO();

const mockService = new MockService();

const EVENT_ID = "33755137";
const EVENT_OPEN_DATE = new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString();

const getAllTexts = async (lazyGroup) => {
  const length = await lazyGroup.length;
  return Promise.all(Array.from({ length }, (_, i) => lazyGroup[i].getText()));
};

const SCA_PRE_MATCH_MOCK = {
  fixture: [
    {
      eventId: 33755137,
      score: {},
      duration: {
        period: "REGULAR",
        status: "PRE_MATCH",
        clock: {
          minute: 0,
          second: 1,
        },
      },
    },
  ],
};

const buildParticipant = (id, name) => ({
  __typename: "ObbFootballPlayer",
  urn: `ppb:obb:footballPlayer:${id}/e/${EVENT_ID}`,
  player: {
    id,
    name,
    position: null,
    shirtNumber: null,
  },
  team: {
    id: "13",
    name: "Man Utd",
    color: "DA291C",
    crest: { small: "", medium: "" },
    jerseys: [{ type: "HOME", color: "DA291C", url: "https://example.com/jersey-home.png" }],
  },
});

const buildLegSuccess = ({ participants, decimal, numerator, denominator, value }) => ({
  __typename: "ObbLeg",
  templateId: "participantsCombined",
  templateParams: {
    __typename: "ObbSquadBetParams",
    participantIds: participants.map((p) => ({
      __typename: "ObbFootballPlayer",
      urn: p.urn,
    })),
    outcomeIds: ["GOALS"],
    value,
    timePeriodId: "MATCH",
    quantifier: "AT_LEAST",
  },
  quote: {
    __typename: "ObbQuoteSuccess",
    price: {
      __typename: "ObbOdds",
      decimal,
      fractional: { __typename: "FractionalOdds", numerator, denominator },
    },
  },
  event: {
    __typename: "SportsEvent",
    urn: `ppb:event:${EVENT_ID}`,
    name: "Man Utd v Newcastle",
    eventId: 33755137,
  },
});

const buildLegError = ({ participants, value }) => ({
  __typename: "ObbLeg",
  templateId: "participantsCombined",
  templateParams: {
    __typename: "ObbSquadBetParams",
    participantIds: participants.map((p) => ({
      __typename: "ObbFootballPlayer",
      urn: p.urn,
    })),
    outcomeIds: ["GOALS"],
    value,
    timePeriodId: "MATCH",
    quantifier: "AT_LEAST",
  },
  quote: {
    __typename: "ObbQuoteError",
    errorCode: "NO_PRICE",
    errorDetails: null,
  },
  event: {
    __typename: "SportsEvent",
    urn: `ppb:event:${EVENT_ID}`,
    name: "Man Utd v Newcastle",
    eventId: 33755137,
  },
});

const buildSquadVsSquadLeg = ({ squadA, squadB, decimal, numerator, denominator }) => ({
  __typename: "ObbLeg",
  templateId: "headToHead",
  templateParams: {
    __typename: "ObbSquadVsSquadParams",
    squadAParticipantIds: squadA.map((p) => ({
      __typename: "ObbFootballPlayer",
      urn: p.urn,
    })),
    squadBParticipantIds: squadB.map((p) => ({
      __typename: "ObbFootballPlayer",
      urn: p.urn,
    })),
    outcomeIds: ["GOALS"],
    timePeriodId: "MATCH",
    quantifier: "AT_LEAST",
  },
  quote: {
    __typename: "ObbQuoteSuccess",
    price: {
      __typename: "ObbOdds",
      decimal,
      fractional: { __typename: "FractionalOdds", numerator, denominator },
    },
  },
  event: {
    __typename: "SportsEvent",
    urn: `ppb:event:${EVENT_ID}`,
    name: "Man Utd v Newcastle",
    eventId: 33755137,
  },
});

const buildSquadVsSquadCard = ({ squadA, squadB, legs }) => ({
  participants: [...squadA, ...squadB],
  legs,
});

const buildSquadBetCard = ({ participants, legs }) => ({
  participants,
  legs,
});

const FIRST_CARD_PARTICIPANTS = [buildParticipant("6860", "Luke Shaw"), buildParticipant("19488", "Casemiro")];
const SECOND_CARD_PARTICIPANTS = [buildParticipant("53087", "P. Foden"), buildParticipant("60419", "G. Martinelli")];

const SQUAD_A_PARTICIPANTS = [buildParticipant("70001", "G. Martinelli"), buildParticipant("70002", "M. Odegaard")];
const SQUAD_B_PARTICIPANTS = [buildParticipant("70003", "P. Foden"), buildParticipant("70004", "E. Haaland")];

const buildOnboardingCardsGroup = (overrides = {}) => ({
  __typename: "ObbOnboardingCardsCardGroup",
  urn: `ppb:obb:card:onboardingCards:abc123/e/${EVENT_ID}`,
  obbOnboardingCardsCardGroupTitle: {
    __typename: "DisplayNameTitle",
    name: "Onboarding Picks",
  },
  obbOnboardingCardsCardGroupBadgeLabel: {
    __typename: "DisplayNameTitle",
    name: "New",
  },
  event: {
    __typename: "SportsEvent",
    urn: `ppb:event:${EVENT_ID}`,
    name: "Man Utd v Newcastle",
    eventId: 33755137,
    openDate: EVENT_OPEN_DATE,
  },
  onboardingCards: [
    {
      participants: FIRST_CARD_PARTICIPANTS,
      legs: [
        buildLegSuccess({
          participants: FIRST_CARD_PARTICIPANTS,
          decimal: 1.25,
          numerator: 1,
          denominator: 4,
          value: 2,
        }),
        buildLegSuccess({
          participants: FIRST_CARD_PARTICIPANTS,
          decimal: 2.5,
          numerator: 3,
          denominator: 2,
          value: 3,
        }),
      ],
    },
    {
      participants: SECOND_CARD_PARTICIPANTS,
      legs: [
        buildLegSuccess({
          participants: SECOND_CARD_PARTICIPANTS,
          decimal: 1.75,
          numerator: 3,
          denominator: 4,
          value: 2,
        }),
        buildLegSuccess({
          participants: SECOND_CARD_PARTICIPANTS,
          decimal: 2.1,
          numerator: 11,
          denominator: 10,
          value: 3,
        }),
      ],
    },
  ],

  ...overrides,
});

const buildBffResponse = (cardsGroup) => ({
  data: {
    View: {
      __typename: "EventView",
      urn: `ppb:tbd:view:event:${EVENT_ID}`,
      url: `football/uefa-nations-league/man-utd-v-newcastle/e-${EVENT_ID}`,
      sportevent: {
        __typename: "SportsEvent",
        urn: `ppb:event:${EVENT_ID}`,
        eventId: 33755137,
        name: "Man Utd v Newcastle",
        openDate: EVENT_OPEN_DATE,
        competition: {
          __typename: "Competition",
          urn: "ppb:competition:11984200",
          name: "UEFA Nations League",
          competitionId: 11984200,
          sport: {
            __typename: "Sport",
            urn: "ppb:eventType:1",
            name: "Football",
            shortName: null,
            sportId: 1,
          },
          logo: {},
          country: { urn: "", code: "", flag: { vector: "" } },
        },
      },
      leftSidebar: { __typename: "LeftSidebar", items: { edges: [] }, pageInfo: null },
      items: {
        pageInfo: { nextPageCursor: "" },
        edges: [{ node: cardsGroup }],
      },
      partialItems: {
        pageInfo: null,
        edges: [
          {
            node: {
              __typename: "ObbOnboardingCardsCardGroup",
              urn: cardsGroup.urn,
            },
          },
        ],
      },
      bottomBar: {
        __typename: "BottomBar",
        tiles: [
          { tileType: "HOME", viewLink: { viewUrn: "ppb:tbd:view:generic:home", viewUrl: "" } },
          { tileType: "BROWSE", viewLink: { viewUrn: "ppb:tbd:view:browse:sports", viewUrl: "browse/b-sports" } },
          { tileType: "MY_BETS", viewLink: { viewUrn: "ppb:tbd:view:myBets:open", viewUrl: "mybets/mybets-open" } },
          { tileType: "GAMING", viewLink: { viewUrn: "ppb:tbd:view:gaming:1", viewUrl: "casino/gm-1" } },
        ],

        hasProductSwitcher: false,
      },
    },
  },
});

const responseToTemplate = (json) => ({
  urn: json.data.View.urn,
  url: json.data.View.url,
  sportevent: json.data.View.sportevent,
  edges: json.data.View.items.edges,
  partialEdges: json.data.View.partialItems.edges,
});

const setupViewWith = async (cardsGroup, { expectCardGroup = true } = {}) => {
  const bffResponse = buildBffResponse(cardsGroup);
  const bffMock = responseToTemplate(bffResponse);

  await mockService.mockHttpRequest(await getIndexHTML(bffMock.urn));
  const eventLayout = getEventLayout(bffMock);
  await mockService.mockHttpRequest(getScaResponse(SCA_PRE_MATCH_MOCK));
  await mockService.mockHttpRequest(eventLayout);

  await browser.url(routes.getEventViewUrl(EVENT_ID));

  if (expectCardGroup) {
    await browser.waitUntilDisplayed(obbOnboardingCardsCardGroupPO.element);
    await browser.waitUntilEquals(scrollableSwimlanePO.title, "Onboarding Picks");
  } else {
    await browser.waitUntilDisplayed(eventPagePO.element);
  }
};

describe("OBB - Onboarding Cards Group", () => {
  describe("When the OBB Onboarding Cards Group is displayed (Squad Builder, Pre-Play)", () => {
    const cardsGroup = buildOnboardingCardsGroup();

    beforeAll(async () => {
      await setupViewWith(cardsGroup);
    });

    it("[PRPI-11359] should display the title", async () => {
      expect(await scrollableSwimlanePO.title.getText()).toBe("Onboarding Picks");
    });

    it("[PRPI-11360] should display the badge", async () => {
      expect(await obbOnboardingCardsCardGroupPO.badge.getText()).toBe("New");
    });

    it("[PRPI-11361] should render exactly two onboarding cards", async () => {
      expect(await obbOnboardingCardsCardGroupPO.cards.length).toBe(cardsGroup.onboardingCards.length);
    });

    describe("First card", () => {
      it("[PRPI-11362] should display fractional odds in order for each leg", async () => {
        const firstCard = obbOnboardingCardsCardGroupPO.cardAt(0);
        const texts = await getAllTexts(firstCard.legOdds);
        expect(texts).toEqual(["1.25", "2.5"]);
      });

      it("[PRPI-11363] should display participant names in order", async () => {
        const firstCard = obbOnboardingCardsCardGroupPO.cardAt(0);
        expect(await firstCard.playerNames.getText()).toBe("Luke Shaw, Casemiro");
      });
    });

    describe("Second card", () => {
      it("[PRPI-11364] should display fractional odds in order for each leg", async () => {
        const secondCard = obbOnboardingCardsCardGroupPO.cardAt(1);
        const texts = await getAllTexts(secondCard.legOdds);
        expect(texts).toEqual(["1.75", "2.1"]);
      });

      it("[PRPI-11365] should display participant names in order", async () => {
        const secondCard = obbOnboardingCardsCardGroupPO.cardAt(1);
        expect(await secondCard.playerNames.getText()).toBe("P. Foden, G. Martinelli");
      });
    });
  });

  describe("When a leg has ObbQuoteError", () => {
    const cardsGroup = buildOnboardingCardsGroup();
    cardsGroup.onboardingCards[1].legs[0] = buildLegError({
      participants: SECOND_CARD_PARTICIPANTS,
      value: 2,
    });

    beforeAll(async () => {
      await setupViewWith(cardsGroup);
    });

    it("[PRPI-11366] should render '-' for the failing leg and the valid odds for the rest", async () => {
      const secondCard = obbOnboardingCardsCardGroupPO.cardAt(1);
      const texts = await getAllTexts(secondCard.legOdds);
      expect(texts).toEqual(["-", "2.1"]);
    });
  });

  describe("When the group contains a SquadVsSquad card", () => {
    const squadVsSquadCard = buildSquadVsSquadCard({
      squadA: SQUAD_A_PARTICIPANTS,
      squadB: SQUAD_B_PARTICIPANTS,
      legs: [
        buildSquadVsSquadLeg({
          squadA: SQUAD_A_PARTICIPANTS,
          squadB: SQUAD_B_PARTICIPANTS,
          decimal: 1.5,
          numerator: 1,
          denominator: 2,
        }),
        buildSquadVsSquadLeg({
          squadA: SQUAD_A_PARTICIPANTS,
          squadB: SQUAD_B_PARTICIPANTS,
          decimal: 2.0,
          numerator: 2,
          denominator: 1,
        }),
      ],
    });
    const cardsGroup = buildOnboardingCardsGroup({ onboardingCards: [squadVsSquadCard] });

    beforeAll(async () => {
      await setupViewWith(cardsGroup);
    });

    it("[PRPI-12504]should render exactly one SquadVsSquad card with the expected fractional odds", async () => {
      expect(await obbOnboardingCardsCardGroupPO.cards.length).toBe(1);

      const card = obbOnboardingCardsCardGroupPO.cardAt(0);
      const texts = await getAllTexts(card.legOdds);
      expect(texts).toEqual(["-", "-"]);
    });
  });

  describe("When the group contains mixed SquadBet and SquadVsSquad cards", () => {
    const squadBetCard = buildSquadBetCard({
      participants: FIRST_CARD_PARTICIPANTS,
      legs: [
        buildLegSuccess({
          participants: FIRST_CARD_PARTICIPANTS,
          decimal: 1.25,
          numerator: 1,
          denominator: 4,
          value: 2,
        }),
        buildLegSuccess({
          participants: FIRST_CARD_PARTICIPANTS,
          decimal: 2.5,
          numerator: 3,
          denominator: 2,
          value: 3,
        }),
      ],
    });
    const squadVsSquadCard = buildSquadVsSquadCard({
      squadA: SQUAD_A_PARTICIPANTS,
      squadB: SQUAD_B_PARTICIPANTS,
      legs: [
        buildSquadVsSquadLeg({
          squadA: SQUAD_A_PARTICIPANTS,
          squadB: SQUAD_B_PARTICIPANTS,
          decimal: 1.75,
          numerator: 3,
          denominator: 4,
        }),
        buildSquadVsSquadLeg({
          squadA: SQUAD_A_PARTICIPANTS,
          squadB: SQUAD_B_PARTICIPANTS,
          decimal: 2.1,
          numerator: 11,
          denominator: 10,
        }),
      ],
    });
    const cardsGroup = buildOnboardingCardsGroup({ onboardingCards: [squadBetCard, squadVsSquadCard] });

    beforeAll(async () => {
      await setupViewWith(cardsGroup);
    });

    it("[PRPI-12505]should render both cards in the carousel", async () => {
      expect(await obbOnboardingCardsCardGroupPO.cards.length).toBe(2);
    });

    it("[PRPI-12506]should display the SquadBet card's odds on the first position", async () => {
      const firstCard = obbOnboardingCardsCardGroupPO.cardAt(0);
      const texts = await getAllTexts(firstCard.legOdds);
      expect(texts).toEqual(["1.25", "2.5"]);
    });

    it("[PRPI-12507]should display the SquadVsSquad card's odds on the second position", async () => {
      const secondCard = obbOnboardingCardsCardGroupPO.cardAt(1);
      const texts = await getAllTexts(secondCard.legOdds);
      expect(texts).toEqual(["-", "-"]);
    });
  });

  describe("When the group has no badge label", () => {
    const cardsGroup = buildOnboardingCardsGroup({ obbOnboardingCardsCardGroupBadgeLabel: null });

    beforeAll(async () => {
      await setupViewWith(cardsGroup);
    });

    it("[PRPI-12508]should not display the badge", async () => {
      expect(await obbOnboardingCardsCardGroupPO.badge.isExisting()).toBe(false);
    });

    it("[PRPI-12509]should still display the title", async () => {
      expect(await scrollableSwimlanePO.title.getText()).toBe("Onboarding Picks");
    });
  });

  describe("When the group contains a single card", () => {
    const singleCard = buildSquadBetCard({
      participants: FIRST_CARD_PARTICIPANTS,
      legs: [
        buildLegSuccess({
          participants: FIRST_CARD_PARTICIPANTS,
          decimal: 1.5,
          numerator: 1,
          denominator: 2,
          value: 2,
        }),
        buildLegSuccess({
          participants: FIRST_CARD_PARTICIPANTS,
          decimal: 2.0,
          numerator: 2,
          denominator: 1,
          value: 3,
        }),
      ],
    });
    const cardsGroup = buildOnboardingCardsGroup({ onboardingCards: [singleCard] });

    beforeAll(async () => {
      await setupViewWith(cardsGroup);
    });

    it("[PRPI-12510]should render exactly one card", async () => {
      expect(await obbOnboardingCardsCardGroupPO.cards.length).toBe(1);
    });
  });

  describe("When the group contains no cards", () => {
    const cardsGroup = buildOnboardingCardsGroup({ onboardingCards: [] });

    beforeAll(async () => {
      await setupViewWith(cardsGroup, { expectCardGroup: false });
    });

    it("[PRPI-12522] should render no real onboarding cards when the group is empty", async () => {
      expect(await obbOnboardingCardsCardGroupPO.cards.length).toBe(0);
    });
  });

  describe("When the group contains three cards", () => {
    const THIRD_CARD_PARTICIPANTS = [buildParticipant("80001", "B. Saka"), buildParticipant("80002", "B. Fernandes")];
    const thirdCard = buildSquadBetCard({
      participants: THIRD_CARD_PARTICIPANTS,
      legs: [
        buildLegSuccess({
          participants: THIRD_CARD_PARTICIPANTS,
          decimal: 2.0,
          numerator: 1,
          denominator: 1,
          value: 2,
        }),
        buildLegSuccess({
          participants: THIRD_CARD_PARTICIPANTS,
          decimal: 3.0,
          numerator: 2,
          denominator: 1,
          value: 3,
        }),
      ],
    });
    const defaultCardsGroup = buildOnboardingCardsGroup();
    const cardsGroup = buildOnboardingCardsGroup({
      onboardingCards: [...defaultCardsGroup.onboardingCards, thirdCard],
    });

    beforeAll(async () => {
      await setupViewWith(cardsGroup);
    });

    it("[PRPI-12511]should render three cards in the carousel", async () => {
      expect(await obbOnboardingCardsCardGroupPO.cards.length).toBe(3);
    });
  });
});
