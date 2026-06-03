import normalizeTimeFormBroadCastsCardFragmentIntoTimeFormBroadCastsCard from "./time-form-broadcasts-card-normalizer";

const BFF_RESPONSE = {
  __typename: "TimeFormBroadCastsCard",
  urn: "ppb:tbd:card:timeFormBroadCasts:30250348.1510",
  selectedRace: {
    __typename: "Race",
    urn: "ppb:race:30250348.1510",
    startTime: "2021-01-26T15:10:00.000Z",
    name: "Handicap (Class 6)",
    verdict: "KRAZY PAVING escapes a penalty",
    details: {
      distance: {
        miles: 0,
        furlongs: 6,
        yards: 22,
      },
      going: "STD",
      status: "DORMANT",
      type: "FLAT",
    },
    runners: [
      {
        urn: "ppb:tbd:racerunner:30250348.1510/1",
        rating123: 1,
        ratingStars: 5,
        selectionId: 8850777,
        form: "1375009-1",
        rating: 46,
        comments: "C&D winner. Back to winning",
        horse: {
          name: "KRAZY PAVING",
          sireName: "KYLLACHY",
          damName: "CRITICAL PATH (IRE)",
          damSireName: "NOVERRE (USA)",
          age: 9,
          color: "BAY",
          sex: "GELDING",
          bred: "IRE",
        },
        details: {
          jockeyName: "Callum Hutchinson",
          trainerName: "Olly Murphy",
          saddleCloth: "10",
          weight: {
            stones: "8-12",
          },
          equipmentDescription: "blinkers",
          silk: "https://content-cache.cdnppb.net/feeds_images/Horses/SilkColours/c20210126wol/00841583.png",
          draw: 3,
        },
      },
    ],
    meeting: {
      __typename: "Meeting",
      urn: "ppb:meeting:30250348",
      name: "Wolv  26th Jan",
      country: "GB",
      countryFlag: {
        vector: null,
      },
      venue: "Wolverhampton",
      date: "2021-01-26T15:10:00.000Z",
    },
  },
  raceBroadCasts: {
    liveVideoUrl: "LIVE_VIDEO_URL",
    dataVizUrl: "DATA_VIZ_URL",
  },
  availableToSubscribe: true,
  raceToSubscribe: "ppb:race:30250348.1510",
};

describe("TimeFormBroadCastsCard normalizer", () => {
  describe("normalizeTimeFormBroadCastsCardFragmentIntoTimeFormBroadCastsCard", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizeTimeFormBroadCastsCardFragmentIntoTimeFormBroadCastsCard(BFF_RESPONSE);

      expect(data).toEqual({
        race: "ppb:race:30250348.1510",
        typename: "TimeFormBroadCastsCard",
        broadcasts: {
          liveVideoUrl: "LIVE_VIDEO_URL",
          dataVizUrl: "DATA_VIZ_URL",
        },
        availableToSubscribe: true,
        raceToSubscribe: "ppb:race:30250348.1510",
        urn: "ppb:tbd:card:timeFormBroadCasts:30250348.1510",
      });
    });

    describe("when broadcasts race and availableToSubscribe are not defined", () => {
      it("should correctly transform and return the data object", () => {
        const { data } = normalizeTimeFormBroadCastsCardFragmentIntoTimeFormBroadCastsCard({
          ...BFF_RESPONSE,
          selectedRace: null,
          raceBroadCasts: null,
          availableToSubscribe: false,
        });

        expect(data).toEqual({
          typename: "TimeFormBroadCastsCard",
          urn: "",
          availableToSubscribe: false,
          raceToSubscribe: "ppb:race:30250348.1510",
        });
      });
    });
  });
});
