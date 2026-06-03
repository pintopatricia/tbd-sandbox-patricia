import {
  createFindCardbyURNSelector,
  createBettableCardByURNSelector,
  createCardByURNSelector,
} from "./cards-selectors";

const CARDS_MOCK = {
  markets: {},
  racemarkets: {},
  marketsextended: {},
  eventmarkets: {},
  fixtures: {},
  headtoheads: {},
  recentforms: {},
  eventviewlinks: {},
  marketviewlinks: {},
  matchtimelines: {},
  matchstats: {},
  marketrules: {},
  competitionviewlinks: {},
  quicklinks: {},
  games: {},
  gameinfos: {},
  gaminglinks: {},
  links: {},
  balance: {},
  rewards: {},
  accountBanners: {},
  sportsbookbets: {},
  marketgraphs: {},
  highlightedselections: {},
  betopportunitypromos: {},
  editorialpromos: {},
  selectionpromos: {},
  promotions: {},
  minipromobanners: {},
  loyaltypromos: {},
  racedetails: {},
  raceviewlinks: {},
  contentsummary: {},
  gamingjackpots: {},
  gamingprizemachines: {},
  gamingplaynews: {},
  raceviewlink: {},
  broadcasts: {},
  broadcastsandstatistics: {},
  imspromotiondetails: {},
  imspromotiontermsandconditions: {},
  imspromotionstate: {},
  runnerinfos: {},
  imspromotionerror: {},
  regulatory: {},
  sportviewlinks: {},
  embeddedviews: {},
  preferencesinglechoices: {},
  racebytimerangecards: {},
  forbiddencontent: {},
  genericviewlinks: {},
  competitionregions: {},
  budgetLimits: {},
  couponheaders: {},
  genericswitchers: {},
  raceresults: {},
  timeformbroadcasts: {},
  grids: {},
  expandablemarkets: {},
  virtualeventdetails: {},
  priceboostmultiplepromos: {},
  virtualmarket: {},
  popularbetbuilders: {},
  popularmultiplesbetbuilders: {},
  packagedcreatedbets: {},
  priceboostmultislistcards: {},
  correctscorecards: {},
  outrightmarketlistcards: {},
  eventheader: {},
  eventstats: {},
  betlegs: {},
  sportsbookbetinfos: {},
  marketbetcard: {},
  marketbetselectioncard: {},
  embeddedcontents: {},
  searchBar: {},
  extrawallet: {},
  priceboostmulticards: {},
  obbcards: {},
  blurb: {},
  matchstatselections: {},
  obbcreatedbetscards: {},
  obbeventpopularscards: {},
};

describe("layout selectors", () => {
  describe("createCardByURNSelector", () => {
    it("should return card when it exists", () => {
      const testCard = { urn: "test:urn", title: "Test Card" };
      const testState = { "test:urn": testCard };
      const selector = createCardByURNSelector();
      const result = selector(testState, "test:urn");

      expect(result).toBe(testCard);
    });

    it("should return null when state is undefined", () => {
      const selector = createCardByURNSelector();
      const result = selector(undefined, "test:urn");

      expect(result).toBeNull();
    });
  });

  describe("createBettableCardByURNSelector selector", () => {
    it("must return null when receiving an URN for a non-existing card", () => {
      const card = createBettableCardByURNSelector()(CARDS_MOCK, "fakeURN");

      expect(card).toBeNull();
    });

    it("must return card when receiving an URN of market card", () => {
      const market = { urn: "market:urn", title: "match odds" };
      const stateMock = {
        layouts: {
          cards: {
            ...CARDS_MOCK,
            markets: { "market:urn": market },
          },
        },
      };
      const card = createBettableCardByURNSelector()(stateMock.layouts.cards, "market:urn");

      expect(card).toBe(market);
    });

    it("must return card when receiving an URN of event market card", () => {
      const eventMarket = { urn: "market:urn", title: "match odds" };
      const stateMock = {
        layouts: {
          cards: {
            ...CARDS_MOCK,
            eventmarkets: { "eventmarket:urn": eventMarket },
          },
        },
      };
      const card = createBettableCardByURNSelector()(stateMock.layouts.cards, "eventmarket:urn");

      expect(card).toBe(eventMarket);
    });

    it("must return card when receiving an URN of market extended card", () => {
      const marketExtended = { urn: "market:urn", title: "match odds" };
      const stateMock = {
        layouts: {
          cards: {
            ...CARDS_MOCK,
            marketsextended: { "marketextended:urn": marketExtended },
          },
        },
      };
      const card = createBettableCardByURNSelector()(stateMock.layouts.cards, "marketextended:urn");

      expect(card).toBe(marketExtended);
    });

    it("must return card when receiving an URN of an highlighted selection card", () => {
      const highlightedSelectionCard = {
        urn: "ppb:tbd:card:highlightedSelection:123456",
        title: "Highlighted Selection",
      };
      const stateMock = {
        layouts: {
          cards: {
            ...CARDS_MOCK,
            highlightedselections: { "ppb:tbd:card:highlightedSelection:123456": highlightedSelectionCard },
          },
        },
      };
      const card = createBettableCardByURNSelector()(
        stateMock.layouts.cards,
        "ppb:tbd:card:highlightedSelection:123456",
      );

      expect(card).toBe(highlightedSelectionCard);
    });

    it("must return card when receiving an URN of a fixture card", () => {
      const fixtureCard = {
        urn: "ppb:tbd:card:fixture:123",
        title: "match odds",
      };
      const stateMock = {
        layouts: {
          cards: {
            ...CARDS_MOCK,
            fixtures: { [fixtureCard.urn]: fixtureCard },
          },
        },
      };
      const card = createBettableCardByURNSelector()(stateMock.layouts.cards, fixtureCard.urn);

      expect(card).toBe(fixtureCard);
    });

    it("must return card when receiving an URN of a promotion card", () => {
      const promotionCard = {
        urn: "ppb:tbd:card:promotion:123",
        title: "Promotions for you",
      };
      const stateMock = {
        layouts: {
          cards: {
            ...CARDS_MOCK,
            promotions: { [promotionCard.urn]: promotionCard },
          },
        },
      };
      const card = createBettableCardByURNSelector()(stateMock.layouts.cards, promotionCard.urn);

      expect(card).toBe(promotionCard);
    });

    it("must return card when receiving an URN of a grid card", () => {
      const gridCard = {
        urn: "ppb:tbd:card:grid:123",
        title: "Grid Card",
      };
      const stateMock = {
        layouts: {
          cards: {
            ...CARDS_MOCK,
            grids: { [gridCard.urn]: gridCard },
          },
        },
      };
      const card = createBettableCardByURNSelector()(stateMock.layouts.cards, gridCard.urn);

      expect(card).toBe(gridCard);
    });

    it("must return card when receiving an URN of a correct score card", () => {
      const correctScore = {
        urn: "ppb:tbd:card:correctScore:123",
        title: "Correct Score Card",
      };
      const stateMock = {
        layouts: {
          cards: {
            ...CARDS_MOCK,
            correctscorecards: { [correctScore.urn]: correctScore },
          },
        },
      };
      const card = createBettableCardByURNSelector()(stateMock.layouts.cards, correctScore.urn);

      expect(card).toBe(correctScore);
    });

    it("must return card when receiving an URN of a outright market list card", () => {
      const outrightMarketListCard = {
        urn: "ppb:tbd:card:outrightMarketList:123",
        title: "Outright Market List Card",
      };
      const stateMock = {
        layouts: {
          cards: {
            ...CARDS_MOCK,
            outrightmarketlistcards: { [outrightMarketListCard.urn]: outrightMarketListCard },
          },
        },
      };
      const card = createBettableCardByURNSelector()(stateMock.layouts.cards, outrightMarketListCard.urn);

      expect(card).toBe(outrightMarketListCard);
    });

    it("must return card when receiving an URN of the match stat selection card", () => {
      const matchStatSelectionCard = {
        urn: "ppb:tbd:card:matchstatselectioncard:1312",
        title: "MatchStatSelectionCard",
      };
      const stateMock = {
        layouts: {
          cards: {
            ...CARDS_MOCK,
            matchstatselections: { [matchStatSelectionCard.urn]: matchStatSelectionCard },
          },
        },
      };
      const card = createBettableCardByURNSelector()(stateMock.layouts.cards, matchStatSelectionCard.urn);

      expect(card).toBe(matchStatSelectionCard);
    });
  });

  describe("createFindCardbyURNSelector selector", () => {
    it("must return null when receiving an URN for a non-existing page", () => {
      const card = createFindCardbyURNSelector()(CARDS_MOCK, "fakeUrn");
      expect(card).toBe(null);
    });

    it("must return card when receiving an URN of an race details card", () => {
      const raceDetailsCard = {
        type: "RACE_DETAILS_CARD",
        urn: "ppb:tbd:card:raceDetails:30086941.1635",
        race: "ppb:race:30086941.1635",
      };

      const stateMock = {
        layouts: {
          cards: {
            ...CARDS_MOCK,
            racedetails: { "ppb:tbd:card:raceDetails:30086941.1635": raceDetailsCard },
          },
        },
      };
      const card = createFindCardbyURNSelector()(stateMock.layouts.cards, "ppb:tbd:card:raceDetails:30086941.1635");

      expect(card).toBe(raceDetailsCard);
    });

    it("must return card when receiving an URN of the search card", () => {
      const searchBarCard = {
        urn: "ppb:tbd:card:searchBar",
        title: "Search",
        placeholder: "Seach Text",
      };
      const stateMock = {
        layouts: {
          cards: {
            ...CARDS_MOCK,
            searchBar: { [searchBarCard.urn]: searchBarCard },
          },
        },
      };
      const card = createFindCardbyURNSelector()(stateMock.layouts.cards, searchBarCard.urn);

      expect(card).toBe(searchBarCard);
    });

    it("must return card when receiving an URN of the extra wallet card", () => {
      const extraWalletCard = {
        urn: "ppb:tbd:card:extraWalletCard:1312",
        title: "ExtraWalletCard",
      };
      const stateMock = {
        layouts: {
          cards: {
            ...CARDS_MOCK,
            extrawallet: { [extraWalletCard.urn]: extraWalletCard },
          },
        },
      };
      const card = createFindCardbyURNSelector()(stateMock.layouts.cards, extraWalletCard.urn);

      expect(card).toBe(extraWalletCard);
    });

    it("should return null when no card is found", () => {
      const state = {
        layouts: {
          cards: CARDS_MOCK,
        },
      };
      const selector = createFindCardbyURNSelector("urn:blurb:123");
      expect(selector(state.layouts.cards)).toBeNull();
    });

    it("should return the card when found in blurb cards", () => {
      const blurbCard = {
        urn: "urn:blurb:123",
        title: "Test Blurb",
        description: "Test Description",
        typename: "BlurbCard",
      };
      const state = {
        layouts: {
          cards: {
            ...CARDS_MOCK,
            blurb: {
              "urn:blurb:123": blurbCard,
            },
          },
        },
      };
      const selector = createFindCardbyURNSelector();
      expect(selector(state.layouts.cards, "urn:blurb:123")).toEqual(blurbCard);
    });

    it("should return null when blurb card is not found", () => {
      const state = {
        layouts: {
          cards: {
            ...CARDS_MOCK,
            blurb: {
              "urn:blurb:456": {
                urn: "urn:blurb:456",
                title: "Other Blurb",
                description: "Other Description",
                typename: "BlurbCard",
              },
            },
          },
        },
      };
      const selector = createFindCardbyURNSelector("urn:blurb:123");
      expect(selector(state.layouts.cards)).toBeNull();
    });

    it("should return null when cards.blurb is null", () => {
      const state = {
        layouts: {
          cards: {
            ...CARDS_MOCK,
            blurb: {},
          },
        },
      };
      const selector = createFindCardbyURNSelector("urn:blurb:123");
      expect(selector(state.layouts.cards)).toBeNull();
    });
  });
});
