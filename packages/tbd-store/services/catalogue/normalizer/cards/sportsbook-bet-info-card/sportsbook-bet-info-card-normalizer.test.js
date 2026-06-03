import sportsbookBetInfoCardNormalizer from "./sportsbook-bet-info-card-normalizer";

const BFF_RESPONSE = {
  __typename: "SportsbookBetInfoCard",
  urn: "ppb:tbd:card:sbkBetInfo:1",
  placedDate: "placedDate",
  betReceiptId: "betReceiptId",
};

describe("sportsbook bet info card normalizer", () => {
  describe("sportsbookBetInfoCardNormalizer", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = sportsbookBetInfoCardNormalizer(BFF_RESPONSE);

      expect(data).toEqual({
        typename: "SportsbookBetInfoCard",
        urn: "ppb:tbd:card:sbkBetInfo:1",
        placedDate: "placedDate",
        betReceiptId: "betReceiptId",
        settledDate: undefined,
        regulatorBetId: undefined,
      });
    });

    describe("when all fields are available", () => {
      it("should correctly transform and return the data object", () => {
        const { data } = sportsbookBetInfoCardNormalizer({
          ...BFF_RESPONSE,
          settledDate: "settledDate",
          regulatorBetId: "regulatorBetId",
          deviceId: "deviceId",
          selections: [{ marketUrn: "marketUrn", runnerUrn: "runnerUrn" }],
          product: "sportsbook",
        });

        expect(data).toEqual({
          typename: "SportsbookBetInfoCard",
          urn: "ppb:tbd:card:sbkBetInfo:1",
          placedDate: "placedDate",
          betReceiptId: "betReceiptId",
          settledDate: "settledDate",
          regulatorBetId: "regulatorBetId",
          deviceId: "deviceId",
          betSelections: [{ marketUrn: "marketUrn", runnerUrn: "runnerUrn" }],
          product: "sportsbook",
        });
      });
    });
  });
});
