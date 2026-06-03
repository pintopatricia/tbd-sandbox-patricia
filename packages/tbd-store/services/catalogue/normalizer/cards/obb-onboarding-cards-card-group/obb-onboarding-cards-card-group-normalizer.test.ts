import {
  FootballPlayerPosition,
  ObbOnboardingCardsCardGroupFragment,
} from "../../../../../clients/catalogue/catalogue-response-types";
import normalizeObbOnboardingCardsCardGroupFragment from "./obb-onboarding-cards-card-group-normalizer";

const BFF_RESPONSE: ObbOnboardingCardsCardGroupFragment = {
  __typename: "ObbOnboardingCardsCardGroup",
  urn: "ppb:obb:onboardingCardsCardGroup:abc123/e/34304462",
  obbOnboardingCardsCardGroupTitle: {
    __typename: "DisplayNameTitle",
    name: "Try Squad Bet",
  },
  obbOnboardingCardsCardGroupBadgeLabel: {
    __typename: "DisplayNameTitle",
    name: "NEW",
  },
  event: {
    urn: "ppb:tbd:event:34304462",
    name: "Liverpool v Arsenal",
    eventId: 34304462,
    openDate: "2026-04-12T15:00:00Z",
  },
  onboardingCards: [
    {
      participants: [
        {
          __typename: "ObbFootballPlayer",
          urn: "ppb:obb:footballPlayer:1001",
          player: {
            id: "1001",
            name: "Mo Salah",
            shirtNumber: 11,
            position: FootballPlayerPosition.Forward,
          },
          team: {
            id: "t1",
            name: "Liverpool",
            color: "#C8102E",
            crest: { small: "https://crest.example/liv-s.png", medium: "https://crest.example/liv-m.png" },
            jerseys: [{ type: "home", color: "#C8102E", url: "https://jersey.example/liv-home.svg" }],
          },
        },
      ],
      legs: [
        {
          __typename: "ObbLeg",
          templateId: "participantsCombined",
          templateParams: {
            __typename: "ObbSquadBetParams",
            participantIds: [{ __typename: "ObbFootballPlayer", urn: "ppb:obb:footballPlayer:1001" }],
            outcomeIds: ["goals"],
            value: 2,
            timePeriodId: "fullTime",
            quantifier: "atLeast",
          },
          quote: {
            __typename: "ObbQuoteSuccess",
            price: { decimal: 3.5, fractional: { numerator: 5, denominator: 2 } },
          },
          event: {
            __typename: "SportsEvent",
            urn: "ppb:tbd:event:34304462",
            name: "Liverpool v Arsenal",
            eventId: 34304462,
          },
        },
      ],
    },
  ],
};

describe("ObbOnboardingCardsCardGroup normalizer", () => {
  describe("normalizeObbOnboardingCardsCardGroupFragment", () => {
    it("should normalize a full BFF response into the expected Redux shape", () => {
      const { data } = normalizeObbOnboardingCardsCardGroupFragment(BFF_RESPONSE);

      expect(data).toEqual({
        typename: "ObbOnboardingCardsCardGroup",
        urn: "ppb:obb:onboardingCardsCardGroup:abc123/e/34304462",
        items: [],
        title: "Try Squad Bet",
        badgeLabel: "NEW",
        event: {
          urn: "ppb:tbd:event:34304462",
          name: "Liverpool v Arsenal",
          eventId: 34304462,
          openDate: "2026-04-12T15:00:00Z",
        },
        onboardingCards: [
          {
            participants: [
              {
                typename: "ObbFootballPlayer",
                urn: "ppb:obb:footballPlayer:1001",
                player: { id: "1001", name: "Mo Salah", shirtNumber: 11, position: FootballPlayerPosition.Forward },
                team: {
                  id: "t1",
                  name: "Liverpool",
                  color: "#C8102E",
                  crest: { small: "https://crest.example/liv-s.png", medium: "https://crest.example/liv-m.png" },
                  jerseys: [{ type: "home", color: "#C8102E", url: "https://jersey.example/liv-home.svg" }],
                },
              },
            ],
            legs: [
              {
                id: expect.any(String),
                templateId: "participantsCombined",
                templateParams: {
                  participantIds: [{ urn: "ppb:obb:footballPlayer:1001", typename: "ObbFootballPlayer" }],
                  outcomeIds: ["goals"],
                  value: 2,
                  timePeriodId: "fullTime",
                  quantifier: "atLeast",
                },
                quote: {
                  typename: "ObbQuoteSuccess",
                  price: { decimal: 3.5, fractional: { numerator: 5, denominator: 2 } },
                },
                event: {
                  typename: "SportsEvent",
                  urn: "ppb:tbd:event:34304462",
                  name: "Liverpool v Arsenal",
                  eventId: 34304462,
                },
              },
            ],
          },
        ],
      });
    });

    it("should default title to empty string when the BFF contract is violated with a null title", () => {
      const response: ObbOnboardingCardsCardGroupFragment = {
        ...BFF_RESPONSE,
        obbOnboardingCardsCardGroupTitle: null as never,
      };
      const { data } = normalizeObbOnboardingCardsCardGroupFragment(response);

      expect(data.title).toBe("");
    });

    it("should normalize badgeLabel as undefined when null", () => {
      const response: ObbOnboardingCardsCardGroupFragment = {
        ...BFF_RESPONSE,
        obbOnboardingCardsCardGroupBadgeLabel: null,
      };
      const { data } = normalizeObbOnboardingCardsCardGroupFragment(response);

      expect(data.badgeLabel).toBeUndefined();
    });

    it("should handle empty onboardingCards array", () => {
      const response: ObbOnboardingCardsCardGroupFragment = { ...BFF_RESPONSE, onboardingCards: [] };
      const { data } = normalizeObbOnboardingCardsCardGroupFragment(response);

      expect(data.onboardingCards).toEqual([]);
    });

    it("should handle null onboardingCards", () => {
      const response = { ...BFF_RESPONSE, onboardingCards: null as never };
      const { data } = normalizeObbOnboardingCardsCardGroupFragment(response);

      expect(data.onboardingCards).toEqual([]);
    });

    it("should skip null entries inside onboardingCards array", () => {
      const [validCard] = BFF_RESPONSE.onboardingCards;
      const response: ObbOnboardingCardsCardGroupFragment = {
        ...BFF_RESPONSE,
        onboardingCards: [null, validCard, null],
      };
      const { data } = normalizeObbOnboardingCardsCardGroupFragment(response);

      expect(data.onboardingCards).toHaveLength(1);
    });

    it("should delegate leg normalization to the canonical ObbLeg normalizer for ObbPvpParams", () => {
      const pvpResponse: ObbOnboardingCardsCardGroupFragment = {
        ...BFF_RESPONSE,
        onboardingCards: [
          {
            participants: [],
            legs: [
              {
                __typename: "ObbLeg",
                templateId: "playerVsPlayer",
                templateParams: {
                  __typename: "ObbPvpParams",
                  participantIdA: { __typename: "ObbFootballPlayer", urn: "ppb:obb:footballPlayer:100" },
                  participantIdB: { __typename: "ObbFootballPlayer", urn: "ppb:obb:footballPlayer:200" },
                  outcomeId: "goals",
                  timePeriodId: "fullTime",
                },
                quote: {
                  __typename: "ObbQuoteError",
                  errorCode: "NO_PRICE",
                  errorDetails: "Price not available",
                },
                event: {
                  __typename: "SportsEvent",
                  urn: "ppb:tbd:event:34304462",
                  name: "Liverpool v Arsenal",
                  eventId: 34304462,
                },
              },
            ],
          },
        ],
      };

      const { data } = normalizeObbOnboardingCardsCardGroupFragment(pvpResponse);
      const leg = data.onboardingCards[0].legs[0];

      expect(leg.id).toEqual(expect.any(String));
      expect(leg.templateParams).toEqual({
        participantIdA: { urn: "ppb:obb:footballPlayer:100", typename: "ObbFootballPlayer" },
        participantIdB: { urn: "ppb:obb:footballPlayer:200", typename: "ObbFootballPlayer" },
        outcomeId: "goals",
        timePeriodId: "fullTime",
      });
      expect(leg.quote).toEqual({
        typename: "ObbQuoteError",
        errorCode: "NO_PRICE",
        errorDetails: "Price not available",
      });
    });

    it("should delegate leg normalization to the canonical ObbLeg normalizer for ObbSquadVsSquadParams", () => {
      const svsResponse: ObbOnboardingCardsCardGroupFragment = {
        ...BFF_RESPONSE,
        onboardingCards: [
          {
            participants: [],
            legs: [
              {
                __typename: "ObbLeg",
                templateId: "squadVsSquad",
                templateParams: {
                  __typename: "ObbSquadVsSquadParams",
                  squadAParticipantIds: [{ __typename: "ObbFootballPlayer", urn: "ppb:obb:footballPlayer:100" }],
                  squadBParticipantIds: [{ __typename: "ObbFootballPlayer", urn: "ppb:obb:footballPlayer:200" }],
                  outcomeIds: ["goals"],
                  timePeriodId: "fullTime",
                  quantifier: "atLeast",
                },
                quote: {
                  __typename: "ObbQuoteSuccess",
                  price: {
                    __typename: "ObbOdds",
                    decimal: 2.0,
                    fractional: { __typename: "FractionalOdds", numerator: 1, denominator: 1 },
                  },
                },
                event: {
                  __typename: "SportsEvent",
                  urn: "ppb:tbd:event:34304462",
                  name: "Liverpool v Arsenal",
                  eventId: 34304462,
                },
              },
            ],
          },
        ],
      };

      const { data } = normalizeObbOnboardingCardsCardGroupFragment(svsResponse);
      const leg = data.onboardingCards[0].legs[0];

      expect(leg.templateParams).toEqual({
        squadAParticipantIds: [{ urn: "ppb:obb:footballPlayer:100", typename: "ObbFootballPlayer" }],
        squadBParticipantIds: [{ urn: "ppb:obb:footballPlayer:200", typename: "ObbFootballPlayer" }],
        outcomeIds: ["goals"],
        timePeriodId: "fullTime",
        quantifier: "atLeast",
      });
    });

    it("should handle DisplayNameTranslationKey for title", () => {
      const response: ObbOnboardingCardsCardGroupFragment = {
        ...BFF_RESPONSE,
        obbOnboardingCardsCardGroupTitle: {
          __typename: "DisplayNameTranslationKey",
          translationKey: "obb.onboarding.title",
        },
      };
      const { data } = normalizeObbOnboardingCardsCardGroupFragment(response);

      expect(data.title).toBe("obb.onboarding.title");
    });

    it("should produce deterministic leg ids for identical content", () => {
      const { data: firstPass } = normalizeObbOnboardingCardsCardGroupFragment(BFF_RESPONSE);
      const { data: secondPass } = normalizeObbOnboardingCardsCardGroupFragment(BFF_RESPONSE);

      expect(firstPass.onboardingCards[0].legs[0].id).toBe(secondPass.onboardingCards[0].legs[0].id);
      expect(firstPass.onboardingCards[0].legs[0].id).toEqual(expect.any(String));
    });

    it("should normalize independently when a single card contains legs with mixed templateParams and quote typenames", () => {
      const mixedResponse: ObbOnboardingCardsCardGroupFragment = {
        ...BFF_RESPONSE,
        onboardingCards: [
          {
            participants: [],
            legs: [
              {
                __typename: "ObbLeg",
                templateId: "participantsCombined",
                templateParams: {
                  __typename: "ObbSquadBetParams",
                  participantIds: [{ __typename: "ObbFootballPlayer", urn: "ppb:obb:footballPlayer:1001" }],
                  outcomeIds: ["goals"],
                  value: 2,
                  timePeriodId: "fullTime",
                  quantifier: "atLeast",
                },
                quote: {
                  __typename: "ObbQuoteSuccess",
                  price: {
                    __typename: "ObbOdds",
                    decimal: 3.5,
                    fractional: { __typename: "FractionalOdds", numerator: 5, denominator: 2 },
                  },
                },
                event: {
                  __typename: "SportsEvent",
                  urn: "ppb:tbd:event:34304462",
                  name: "Liverpool v Arsenal",
                  eventId: 34304462,
                },
              },
              {
                __typename: "ObbLeg",
                templateId: "playerVsPlayer",
                templateParams: {
                  __typename: "ObbPvpParams",
                  participantIdA: { __typename: "ObbFootballPlayer", urn: "ppb:obb:footballPlayer:100" },
                  participantIdB: { __typename: "ObbFootballPlayer", urn: "ppb:obb:footballPlayer:200" },
                  outcomeId: "assists",
                  timePeriodId: "firstHalf",
                },
                quote: {
                  __typename: "ObbQuoteError",
                  errorCode: "SUSPENDED",
                  errorDetails: null,
                },
                event: {
                  __typename: "SportsEvent",
                  urn: "ppb:tbd:event:34304462",
                  name: "Liverpool v Arsenal",
                  eventId: 34304462,
                },
              },
            ],
          },
        ],
      };

      const { data } = normalizeObbOnboardingCardsCardGroupFragment(mixedResponse);
      const [squadBetLeg, pvpLeg] = data.onboardingCards[0].legs;

      expect(squadBetLeg.templateId).toBe("participantsCombined");
      expect(squadBetLeg.templateParams).toEqual({
        participantIds: [{ urn: "ppb:obb:footballPlayer:1001", typename: "ObbFootballPlayer" }],
        outcomeIds: ["goals"],
        value: 2,
        timePeriodId: "fullTime",
        quantifier: "atLeast",
      });
      expect(squadBetLeg.quote).toEqual({
        typename: "ObbQuoteSuccess",
        price: {
          typename: "ObbOdds",
          decimal: 3.5,
          fractional: { typename: "FractionalOdds", numerator: 5, denominator: 2 },
        },
      });

      expect(pvpLeg.templateId).toBe("playerVsPlayer");
      expect(pvpLeg.templateParams).toEqual({
        participantIdA: { urn: "ppb:obb:footballPlayer:100", typename: "ObbFootballPlayer" },
        participantIdB: { urn: "ppb:obb:footballPlayer:200", typename: "ObbFootballPlayer" },
        outcomeId: "assists",
        timePeriodId: "firstHalf",
      });
      expect(pvpLeg.quote).toEqual({
        typename: "ObbQuoteError",
        errorCode: "SUSPENDED",
        errorDetails: null,
      });

      expect(squadBetLeg.id).not.toBe(pvpLeg.id);
    });
  });
});
