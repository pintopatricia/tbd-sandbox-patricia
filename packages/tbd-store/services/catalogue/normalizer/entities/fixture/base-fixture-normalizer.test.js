import victim from "./base-fixture-normalizer";

const BFF_RESPONSE = {
  __typename: "BaseFixture",
  urn: "ppb:tbd:urn:basefixture",
  sportevent: { urn: "ppb:tbd:urn:sportevent" },
  mainMarket: { exchange: { urn: "ppb:tbd:urn:exchange" }, sportsbook: { urn: "ppb:tbd:urn:sportsbook" } },
};

describe("BaseFixture normalizer", () => {
  beforeEach(jest.clearAllMocks);

  it("should call correct relations", () => {
    const { data } = victim(BFF_RESPONSE);

    expect(data).toEqual({
      mainMarket: { exchange: "ppb:tbd:urn:exchange", sportsbook: "ppb:tbd:urn:sportsbook" },
      sportevent: "ppb:tbd:urn:sportevent",
      typename: "BaseFixture",
      urn: "ppb:tbd:urn:basefixture",
    });
  });
});
