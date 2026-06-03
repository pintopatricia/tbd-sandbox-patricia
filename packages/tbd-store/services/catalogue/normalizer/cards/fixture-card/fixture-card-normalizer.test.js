import normalizeFixtureCardFragmentIntoFixtureCard from "./fixture-card-normalizer";

describe("FixtureCard normalizer", () => {
  describe("when there's supporting content (SCA fixture info)", () => {
    const FIXTURE_MOCK = {
      __typename: "FootballFixture",
      urn: "ppb:fixture:30542272",
      scheduledAt: "2021-05-24T15:00:00Z",
    };

    const SPORT_EVENT_MOCK = {
      urn: "ppb:event:30542272",
      name: "Randers v FC Copenhagen",
    };

    const BFF_RESPONSE = {
      __typename: "FixtureCard",
      urn: "ppb:tbd:card:fixture:30542272|0|market",
      fixture: FIXTURE_MOCK,
      fixtureEventViewLink: "fake event link",
      sportevent: SPORT_EVENT_MOCK,
      availableToSubscribe: false,
    };

    const EXPECTED_FIXTURE_CARD_DATA = {
      typename: "FixtureCard",
      urn: BFF_RESPONSE.urn,
      fixture: BFF_RESPONSE.fixture.urn,
      eventViewLink: BFF_RESPONSE.fixtureEventViewLink,
      sportevent: BFF_RESPONSE.sportevent.urn,
      availableToSubscribe: BFF_RESPONSE.availableToSubscribe,
    };

    it("should correctly transform and return the data object", () => {
      const { data } = normalizeFixtureCardFragmentIntoFixtureCard(BFF_RESPONSE);

      expect(data).toEqual(EXPECTED_FIXTURE_CARD_DATA);
    });
  });
});
