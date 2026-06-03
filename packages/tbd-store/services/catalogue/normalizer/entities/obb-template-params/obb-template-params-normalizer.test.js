import normalizeObbTemplateParamsFragmentIntoObbTemplateParams from "./obb-template-params-normalizer";

const BFF_RESPONSE_PVP = {
  __typename: "ObbPvpParams",
  outcomeId: "GOALS",
  participantIdA: {
    __typename: "ObbFootballPlayer",
    urn: "ppb:obb:footballPlayer:6975/e/33639890",
  },
  participantIdB: {
    __typename: "ObbFootballPlayer",
    urn: "ppb:obb:footballPlayer:1234/e/33639890",
  },
  timePeriodId: "MATCH",
};

const BFF_RESPONSE_SQUADBET = {
  __typename: "ObbSquadBetParams",
  outcomeIds: ["GOALS"],
  value: 2,
  participantIds: [
    {
      __typename: "ObbFootballPlayer",
      urn: "ppb:obb:footballPlayer:6975/e/33639890",
    },
    {
      __typename: "ObbFootballPlayer",
      urn: "ppb:obb:footballPlayer:1234/e/33639890",
    },
  ],
};

describe("OBB template params normalizer", () => {
  describe("normalizeObbTemplateParamsFragmentIntoObbTemplateParams", () => {
    describe("when receiving valid Pvp params", () => {
      it("should correctly transform and return the data object", () => {
        const data = normalizeObbTemplateParamsFragmentIntoObbTemplateParams(BFF_RESPONSE_PVP);

        expect(data).toEqual({
          participantIdA: {
            urn: "ppb:obb:footballPlayer:6975/e/33639890",
            typename: "ObbFootballPlayer",
          },
          participantIdB: {
            urn: "ppb:obb:footballPlayer:1234/e/33639890",
            typename: "ObbFootballPlayer",
          },
          outcomeId: "GOALS",
          timePeriodId: "MATCH",
        });
      });
    });

    describe("when receiving valid squadbet params", () => {
      it("should correctly transform and return the data object", () => {
        const data = normalizeObbTemplateParamsFragmentIntoObbTemplateParams(BFF_RESPONSE_SQUADBET);

        expect(data).toEqual({
          participantIds: [
            {
              urn: "ppb:obb:footballPlayer:6975/e/33639890",
              typename: "ObbFootballPlayer",
            },
            {
              urn: "ppb:obb:footballPlayer:1234/e/33639890",
              typename: "ObbFootballPlayer",
            },
          ],
          outcomeIds: ["GOALS"],
          value: 2,
        });
      });
    });
  });
});
