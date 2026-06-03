import calculateRefererPartnerId from "./calculate-referer";

jest.mock("../config/environment.json", () => ({
  PARTNER_IDS_PER_SEARCH_ENGINE: {
    bing: {
      h: "7400028",
      c: {
        1: "7400031",
        2: "7400090",
        3: "7400088",
        4: "7400087",
        6: "7400033",
        7: "7400032",
        3503: "7400091",
        2378961: "7400089",
        other: "7400092",
      },
      e: {
        1: "7400031",
        2: "7400090",
        3: "7400088",
        4: "7400087",
        6: "7400033",
        3503: "7400091",
        2378961: "7400089",
        other: "7400092",
      },
      s: {
        1: "7400031",
        2: "7400090",
        3: "7400088",
        4: "7400087",
        6: "7400033",
        7: "7400032",
        3503: "7400091",
        29125756: "7560055",
        2378961: "7400089",
        other: "7400092",
      },
      r: {
        7: "7400032",
        other: "7400092",
      },
      gm: {
        1: "7400094",
        other: "7400094",
      },
      mwe: {
        1: "7400031",
        2: "7400090",
        3: "7400088",
        4: "7400087",
        6: "7400033",
        7: "7400032",
        3503: "7400091",
        2378961: "7400089",
        other: "7400092",
      },
      om: {
        1: "7400031",
        2: "7400090",
        3: "7400088",
        4: "7400087",
        6: "7400033",
        7: "7400032",
        3503: "7400091",
        2378961: "7400089",
        other: "7400092",
      },
      ap: {
        1: "7400031",
        2: "7400090",
        3: "7400088",
        4: "7400087",
        6: "7400033",
        7: "7400032",
        3503: "7400091",
        2378961: "7400089",
        other: "7400092",
      },
      inplay: {
        other: "7400092",
      },
    },
    yandex: "7400000",
    other: "7400000",
    google: {
      h: "7400001",
      c: {
        1: "7400005",
        2: "7400020",
        3: "7400011",
        4: "7400015",
        6: "7400013",
        7: "7400008",
        3503: "7400023",
        2378961: "7400018",
        other: "7400026",
      },
      e: {
        1: "7400006",
        2: "7400021",
        3: "7400011",
        4: "7400016",
        6: "7400013",
        3503: "7400024",
        2378961: "7400018",
        other: "7400027",
      },
      s: {
        1: "7400004",
        2: "7400019",
        3: "7400010",
        4: "7400014",
        6: "7400012",
        7: "7400007",
        3503: "7400022",
        2378961: "7400017",
        29125756: "7560054",
        other: "7400025",
      },
      r: {
        7: "7400009",
        other: "7400027",
      },
      gm: {
        1: "7400093",
        other: "7400093",
      },
      mwe: {
        1: "7400006",
        2: "7400021",
        3: "7400011",
        4: "7400016",
        6: "7400013",
        7: "7400009",
        3503: "7400024",
        2378961: "7400018",
        other: "7400027",
      },
      om: {
        1: "7400006",
        2: "7400021",
        3: "7400011",
        4: "7400016",
        6: "7400013",
        7: "7400009",
        3503: "7400024",
        2378961: "7400018",
        other: "7400027",
      },
      inplay: {
        other: "7400027",
      },
    },
  },
}));

describe("calculateRefererPartnerId", () => {
  const google = "https://google.com/something/something";
  const bing = "https://bing.com/something/something";

  describe("When there is no referer url", () => {
    it("should return null", () => {
      expect(
        calculateRefererPartnerId("", "football/english-premier-league/c-10932509", "ppb:tbd:view:competition"),
      ).toBeNull();
    });
  });

  describe("when router properties are null", () => {
    it("should return null", () => {
      expect(
        calculateRefererPartnerId("https://something.com/something/something", {
          currentUrl: null,
          currentUrn: null,
          currentView: null,
        }),
      ).toBeNull();
    });
  });

  describe("When there is no search engine", () => {
    it("should return null", () => {
      expect(
        calculateRefererPartnerId("https://something.com/something/something", {
          currentUrl: "football/english-premier-league/c-10932509",
          currentUrn: "ppb:tbd:view:competition:10932509",
          currentView: "ppb:tbd:view:competition",
        }),
      ).toBeNull();
    });
  });
  describe("When search engine is Yandex", () => {
    it("should return correct referer value", () => {
      expect(
        calculateRefererPartnerId("https://yandex.com/something/something", {
          currentUrl: "football/english-premier-league/c-10932509",
          currentUrn: "ppb:tbd:view:competition:10932509",
          currentView: "ppb:tbd:view:competition",
        }),
      ).toBe("7400000");
    });
  });

  describe("When search engine is characterized as other", () => {
    it("should return correct referer value", () => {
      expect(
        calculateRefererPartnerId("https://ask.com/something/something", {
          currentUrl: "football/english-premier-league/c-10932509",
          currentUrn: "ppb:tbd:view:competition:10932509",
          currentView: "ppb:tbd:view:competition",
        }),
      ).toBe("7400000");
    });
  });

  describe("When search engine is Bing", () => {
    describe("and is competition", () => {
      describe("when url params do not match", () => {
        it("should return null", () => {
          expect(
            calculateRefererPartnerId(bing, {
              currentUrl: "c-10932509",
              currentUrn: "ppb:tbd:view:competition:10932509",
              currentView: "ppb:tbd:view:competition",
            }),
          ).toBe(null);
        });
      });

      describe("and sport is football", () => {
        it("should return correct referer value", () => {
          expect(
            calculateRefererPartnerId(bing, {
              currentUrl: "football/english-premier-league/c-10932509",
              currentUrn: "ppb:tbd:view:competition:10932509",
              currentView: "ppb:tbd:view:competition",
            }),
          ).toBe("7400031");
        });
      });

      describe("and sport is politics", () => {
        it("should return correct referer value", () => {
          expect(
            calculateRefererPartnerId(bing, {
              currentUrl: "politics/competition-name/c-10932509",
              currentUrn: "ppb:tbd:view:competition:10932509",
              currentView: "ppb:tbd:view:competition",
            }),
          ).toBe("7400089");
        });
      });

      describe("and sport is tennis", () => {
        it("should return correct referer value", () => {
          expect(
            calculateRefererPartnerId(bing, {
              currentUrl: "tennis/competition-name/c-10932509",
              currentUrn: "ppb:tbd:view:competition:10932509",
              currentView: "ppb:tbd:view:competition",
            }),
          ).toBe("7400090");
        });
      });

      describe("and sport is cricket", () => {
        it("should return correct referer value", () => {
          expect(
            calculateRefererPartnerId(bing, {
              currentUrl: "cricket/competition-name/c-10932509",
              currentUrn: "ppb:tbd:view:competition:10932509",
              currentView: "ppb:tbd:view:competition",
            }),
          ).toBe("7400087");
        });
      });

      describe("and sport is boxing", () => {
        it("should return correct referer value", () => {
          expect(
            calculateRefererPartnerId(bing, {
              currentUrl: "boxing/competition-name/c-10932509",
              currentUrn: "ppb:tbd:view:competition:10932509",
              currentView: "ppb:tbd:view:competition",
            }),
          ).toBe("7400033");
        });
      });

      describe("and sport is horse-racing", () => {
        it("should return correct referer value", () => {
          expect(
            calculateRefererPartnerId(bing, {
              currentUrl: "horse-racing/competition-name/c-10932509",
              currentUrn: "ppb:tbd:view:competition:10932509",
              currentView: "ppb:tbd:view:competition",
            }),
          ).toBe("7400032");
        });
      });

      describe("and sport is golf", () => {
        it("should return correct referer value", () => {
          expect(
            calculateRefererPartnerId(bing, {
              currentUrl: "golf/competition-name/c-10932509",
              currentUrn: "ppb:tbd:view:competition:10932509",
              currentView: "ppb:tbd:view:competition",
            }),
          ).toBe("7400088");
        });
      });

      describe("and sport is darts", () => {
        it("should return correct referer value", () => {
          expect(
            calculateRefererPartnerId(bing, {
              currentUrl: "darts/competition-name/c-10932509",
              currentUrn: "ppb:tbd:view:competition:10932509",
              currentView: "ppb:tbd:view:competition",
            }),
          ).toBe("7400091");
        });
      });

      describe("and sport is other than football/politics/tennis/cricket/boxing/horse-racing/golf/darts", () => {
        it("should return correct referer value", () => {
          expect(
            calculateRefererPartnerId(bing, {
              currentUrl: "basketball/competition-name/c-10932509",
              currentUrn: "ppb:tbd:view:competition:10932509",
              currentView: "ppb:tbd:view:competition",
            }),
          ).toBe("7400092");
        });
      });
    });

    describe("and is event", () => {
      describe("when url params do not match", () => {
        it("should return null", () => {
          expect(
            calculateRefererPartnerId(bing, {
              currentUrl: "e-30789574",
              currentUrn: "ppb:tbd:view:event:30789574",
              currentView: "ppb:tbd:view:event",
            }),
          ).toBe(null);
        });
      });

      describe("and sport is football", () => {
        it("should return correct referer value", () => {
          expect(
            calculateRefererPartnerId(bing, {
              currentUrl: "football/competition-name/event-name/e-30789574",
              currentUrn: "ppb:tbd:view:event:30789574",
              currentView: "ppb:tbd:view:event",
            }),
          ).toBe("7400031");
        });
      });

      describe("and sport is tennis", () => {
        it("should return correct referer value", () => {
          expect(
            calculateRefererPartnerId(bing, {
              currentUrl: "tennis/competition-name/event-name/e-30789574",
              currentUrn: "ppb:tbd:view:event:30789574",
              currentView: "ppb:tbd:view:event",
            }),
          ).toBe("7400090");
        });
      });

      describe("and sport is golf", () => {
        it("should return correct referer value", () => {
          expect(
            calculateRefererPartnerId(bing, {
              currentUrl: "golf/competition-name/event-name/e-30789574",
              currentUrn: "ppb:tbd:view:event:30789574",
              currentView: "ppb:tbd:view:event",
            }),
          ).toBe("7400088");
        });
      });

      describe("and sport is cricket", () => {
        it("should return correct referer value", () => {
          expect(
            calculateRefererPartnerId(bing, {
              currentUrl: "cricket/competition-name/event-name/e-30789574",
              currentUrn: "ppb:tbd:view:event:30789574",
              currentView: "ppb:tbd:view:event",
            }),
          ).toBe("7400087");
        });
      });

      describe("and sport is boxing", () => {
        it("should return correct referer value", () => {
          expect(
            calculateRefererPartnerId(bing, {
              currentUrl: "boxing/competition-name/event-name/e-30789574",
              currentUrn: "ppb:tbd:view:event:30789574",
              currentView: "ppb:tbd:view:event",
            }),
          ).toBe("7400033");
        });
      });

      describe("and sport is darts", () => {
        it("should return correct referer value", () => {
          expect(
            calculateRefererPartnerId(bing, {
              currentUrl: "darts/competition-name/event-name/e-30789574",
              currentUrn: "ppb:tbd:view:event:30789574",
              currentView: "ppb:tbd:view:event",
            }),
          ).toBe("7400091");
        });
      });

      describe("and sport is politics", () => {
        it("should return correct referer value", () => {
          expect(
            calculateRefererPartnerId(bing, {
              currentUrl: "politics/competition-name/event-name/e-30789574",
              currentUrn: "ppb:tbd:view:event:30789574",
              currentView: "ppb:tbd:view:event",
            }),
          ).toBe("7400089");
        });
      });

      describe("and sport is other than football/politics/tennis/cricket/boxing/golf/darts", () => {
        it("should return correct referer value", () => {
          expect(
            calculateRefererPartnerId(bing, {
              currentUrl: "basketball/competition-name/event-name/e-30789574",
              currentUrn: "ppb:tbd:view:event:30789574",
              currentView: "ppb:tbd:view:event",
            }),
          ).toBe("7400092");
        });
      });
    });

    describe("and is sport", () => {
      describe("when url params do not match", () => {
        it("should return null", () => {
          expect(
            calculateRefererPartnerId(bing, {
              currentUrl: "",
              currentUrn: "ppb:tbd:view:sport:1",
              currentView: "ppb:tbd:view:sport",
            }),
          ).toBe(null);
        });
      });

      describe("and sport is football", () => {
        it("should return correct referer value", () => {
          expect(
            calculateRefererPartnerId(bing, {
              currentUrl: "football/s-1",
              currentUrn: "ppb:tbd:view:sport:1",
              currentView: "ppb:tbd:view:sport",
            }),
          ).toBe("7400031");
        });
      });

      describe("and sport is tennis", () => {
        it("should return correct referer value", () => {
          expect(
            calculateRefererPartnerId(bing, {
              currentUrl: "tennis/s-2",
              currentUrn: "ppb:tbd:view:sport:2",
              currentView: "ppb:tbd:view:sport",
            }),
          ).toBe("7400090");
        });
      });

      describe("and sport is golf", () => {
        it("should return correct referer value", () => {
          expect(
            calculateRefererPartnerId(bing, {
              currentUrl: "golf/s-3",
              currentUrn: "ppb:tbd:view:sport:3",
              currentView: "ppb:tbd:view:sport",
            }),
          ).toBe("7400088");
        });
      });

      describe("and sport is cricket", () => {
        it("should return correct referer value", () => {
          expect(
            calculateRefererPartnerId(bing, {
              currentUrl: "cricket/s-4",
              currentUrn: "ppb:tbd:view:sport:4",
              currentView: "ppb:tbd:view:sport",
            }),
          ).toBe("7400087");
        });
      });

      describe("and sport is boxing", () => {
        it("should return correct referer value", () => {
          expect(
            calculateRefererPartnerId(bing, {
              currentUrl: "boxing/s-6",
              currentUrn: "ppb:tbd:view:sport:6",
              currentView: "ppb:tbd:view:sport",
            }),
          ).toBe("7400033");
        });
      });

      describe("and sport is horse-racing", () => {
        it("should return correct referer value", () => {
          expect(
            calculateRefererPartnerId(bing, {
              currentUrl: "horse-racing/s-7",
              currentUrn: "ppb:tbd:view:sport:7",
              currentView: "ppb:tbd:view:sport",
            }),
          ).toBe("7400032");
        });
      });

      describe("and sport is darts", () => {
        it("should return correct referer value", () => {
          expect(
            calculateRefererPartnerId(bing, {
              currentUrl: "darts/s-3503",
              currentUrn: "ppb:tbd:view:sport:3503",
              currentView: "ppb:tbd:view:sport",
            }),
          ).toBe("7400091");
        });
      });

      describe("and sport is politics", () => {
        it("should return correct referer value", () => {
          expect(
            calculateRefererPartnerId(bing, {
              currentUrl: "politics/s-2378961",
              currentUrn: "ppb:tbd:view:sport:2378961",
              currentView: "ppb:tbd:view:sport",
            }),
          ).toBe("7400089");
        });
      });

      describe("and sport is lotteries", () => {
        it("should return correct referer value", () => {
          expect(
            calculateRefererPartnerId(bing, {
              currentUrl: "lotteries/s-29125756",
              currentUrn: "ppb:tbd:view:sport:29125756",
              currentView: "ppb:tbd:view:sport",
            }),
          ).toBe("7560055");
        });
      });

      describe("and sport is other than football/politics/tennis/cricket/boxing/horse-racing/golf/darts/lotteries", () => {
        it("should return correct referer value", () => {
          expect(
            calculateRefererPartnerId(bing, {
              currentUrl: "basketball/s-7522",
              currentUrn: "ppb:tbd:view:sport:7522",
              currentView: "ppb:tbd:view:sport",
            }),
          ).toBe("7400092");
        });
      });
    });

    describe("and is race", () => {
      describe("when url params do not match", () => {
        it("should return null", () => {
          expect(
            calculateRefererPartnerId(bing, {
              currentUrl: "",
              currentUrn: "ppb:tbd:view:race:7|31802674.1510",
              currentView: "ppb:tbd:view:race",
            }),
          ).toBe(null);
        });
      });

      describe("and race is horse racing", () => {
        it("should return correct referer value", () => {
          expect(
            calculateRefererPartnerId(bing, {
              currentUrl: "horse-racing/ayr/r-7%7C31802674.1510",
              currentUrn: "ppb:tbd:view:race:7|31802674.1510",
              currentView: "ppb:tbd:view:race",
            }),
          ).toBe("7400032");
        });
      });

      describe("and sport is greyhounds-racing", () => {
        it("should return correct referer value", () => {
          expect(
            calculateRefererPartnerId(bing, {
              currentUrl: "greyhound-racing/healesville-aus-7th-oct/r-4339%7C31807478.2342",
              currentUrn: "ppb:tbd:view:race:4339|31807478.2342",
              currentView: "ppb:tbd:view:race",
            }),
          ).toBe("7400092");
        });
      });
    });

    describe("and is inplay", () => {
      describe("when urn is the generic inplay page", () => {
        it("should return the correct rfr code", () => {
          expect(
            calculateRefererPartnerId(bing, {
              currentUrl: "view/d-inplay",
              currentUrn: "ppb:tbd:view:generic:inplay",
              currentView: "ppb:tbd:view:generic",
            }),
          ).toBe("7400092");
        });
      });
    });

    describe("and is homepage", () => {
      it("should return correct referer value", () => {
        expect(
          calculateRefererPartnerId(bing, {
            currentUrl: "football/s-1",
            currentUrn: "ppb:tbd:view:generic:home",
            currentView: "ppb:tbd:view:generic",
          }),
        ).toBe("7400028");
      });
    });

    describe("and is gamming", () => {
      it("should return correct referer value", () => {
        expect(
          calculateRefererPartnerId(bing, {
            currentUrl: "casino/gm-1",
            currentUrn: "ppb:tbd:view:gaming:1",
            currentView: "ppb:tbd:view:gaming",
          }),
        ).toBe("7400094");
      });
    });

    describe("and is outright market", () => {
      const defaultURL = bing;

      describe("when url params do not match", () => {
        it("should return null", () => {
          expect(
            calculateRefererPartnerId(defaultURL, {
              currentUrl: "",
              currentUrn: "ppb:tbd:view:market:1",
              currentView: "ppb:tbd:view:market",
            }),
          ).toBe(null);
        });
      });

      describe("and sport is football", () => {
        it("should return correct referer value", () => {
          expect(
            calculateRefererPartnerId(bing, {
              currentUrl: "football/competition-name/event/outright-market-name/om-1",
              currentUrn: "ppb:tbd:view:market:1",
              currentView: "ppb:tbd:view:market",
            }),
          ).toBe("7400031");
        });
      });

      describe("and sport is tennis", () => {
        it("should return correct referer value", () => {
          expect(
            calculateRefererPartnerId(bing, {
              currentUrl: "tennis/competition-name/event/outright-market-name/om-2",
              currentUrn: "ppb:tbd:view:market:2",
              currentView: "ppb:tbd:view:market",
            }),
          ).toBe("7400090");
        });
      });

      describe("and sport is golf", () => {
        it("should return correct referer value", () => {
          expect(
            calculateRefererPartnerId(bing, {
              currentUrl: "golf/competition-name/outright-market-name/mwe-3",
              currentUrn: "ppb:tbd:view:market:3",
              currentView: "ppb:tbd:view:market",
            }),
          ).toBe("7400088");
        });
      });

      describe("and sport is cricket", () => {
        it("should return correct referer value", () => {
          expect(
            calculateRefererPartnerId(bing, {
              currentUrl: "cricket/competition-name/outright-market-name/mwe-4",
              currentUrn: "ppb:tbd:view:market:4",
              currentView: "ppb:tbd:view:market",
            }),
          ).toBe("7400087");
        });
      });

      describe("and sport is boxing", () => {
        it("should return correct referer value", () => {
          expect(
            calculateRefererPartnerId(bing, {
              currentUrl: "boxing/competition-name/outright-market-name/mwe-6",
              currentUrn: "ppb:tbd:view:market:6",
              currentView: "ppb:tbd:view:market",
            }),
          ).toBe("7400033");
        });
      });

      describe("and sport is horse-racing", () => {
        it("should return correct referer value", () => {
          expect(
            calculateRefererPartnerId(bing, {
              currentUrl: "horse-racing/event/outright-market-name/ap-7",
              currentUrn: "ppb:tbd:view:market:7",
              currentView: "ppb:tbd:view:market",
            }),
          ).toBe("7400032");
        });
      });

      describe("and sport is darts", () => {
        it("should return correct referer value", () => {
          expect(
            calculateRefererPartnerId(bing, {
              currentUrl: "darts/competition-name/outright-market-name/mwe-3503",
              currentUrn: "ppb:tbd:view:market:3503",
              currentView: "ppb:tbd:view:market",
            }),
          ).toBe("7400091");
        });
      });

      describe("and sport is politics", () => {
        it("should return correct referer value", () => {
          expect(
            calculateRefererPartnerId(bing, {
              currentUrl: "politics/competition-name/outright-market-name/mwe-2378961",
              currentUrn: "ppb:tbd:view:market:2378961",
              currentView: "ppb:tbd:view:market",
            }),
          ).toBe("7400089");
        });
      });

      describe("and sport is other than football/politics/tennis/cricket/boxing/horse-racing/golf/darts", () => {
        it("should return correct referer value", () => {
          expect(
            calculateRefererPartnerId(bing, {
              currentUrl: "basketball/competition-name/outright-market-name/mwe-7522",
              currentUrn: "ppb:tbd:view:market:7522",
              currentView: "ppb:tbd:view:market",
            }),
          ).toBe("7400092");
        });
      });
    });
  });

  describe("When search engine is Google", () => {
    describe("and is competition", () => {
      describe("when url params do not match", () => {
        it("should return null", () => {
          expect(
            calculateRefererPartnerId(google, {
              currentUrl: "c-10932509",
              currentUrn: "ppb:tbd:view:competition:10932509",
              currentView: "ppb:tbd:view:competition",
            }),
          ).toBe(null);
        });
      });

      describe("and sport is football", () => {
        it("should return correct referer value", () => {
          expect(
            calculateRefererPartnerId(google, {
              currentUrl: "football/english-premier-league/c-10932509",
              currentUrn: "ppb:tbd:view:competition:10932509",
              currentView: "ppb:tbd:view:competition",
            }),
          ).toBe("7400005");
        });
      });

      describe("and sport is politics", () => {
        it("should return correct referer value", () => {
          expect(
            calculateRefererPartnerId(google, {
              currentUrl: "politics/competition-name/c-10932509",
              currentUrn: "ppb:tbd:view:competition:10932509",
              currentView: "ppb:tbd:view:competition",
            }),
          ).toBe("7400018");
        });
      });

      describe("and sport is tennis", () => {
        it("should return correct referer value", () => {
          expect(
            calculateRefererPartnerId(google, {
              currentUrl: "tennis/competition-name/c-10932509",
              currentUrn: "ppb:tbd:view:competition:10932509",
              currentView: "ppb:tbd:view:competition",
            }),
          ).toBe("7400020");
        });
      });

      describe("and sport is cricket", () => {
        it("should return correct referer value", () => {
          expect(
            calculateRefererPartnerId(google, {
              currentUrl: "cricket/competition-name/c-10932509",
              currentUrn: "ppb:tbd:view:competition:10932509",
              currentView: "ppb:tbd:view:competition",
            }),
          ).toBe("7400015");
        });
      });

      describe("and sport is boxing", () => {
        it("should return correct referer value", () => {
          expect(
            calculateRefererPartnerId(google, {
              currentUrl: "boxing/competition-name/c-10932509",
              currentUrn: "ppb:tbd:view:competition:10932509",
              currentView: "ppb:tbd:view:competition",
            }),
          ).toBe("7400013");
        });
      });

      describe("and sport is horse-racing", () => {
        it("should return correct referer value", () => {
          expect(
            calculateRefererPartnerId(google, {
              currentUrl: "horse-racing/competition-name/c-10932509",
              currentUrn: "ppb:tbd:view:competition:10932509",
              currentView: "ppb:tbd:view:competition",
            }),
          ).toBe("7400008");
        });
      });

      describe("and sport is golf", () => {
        it("should return correct referer value", () => {
          expect(
            calculateRefererPartnerId(google, {
              currentUrl: "golf/competition-name/c-10932509",
              currentUrn: "ppb:tbd:view:competition:10932509",
              currentView: "ppb:tbd:view:competition",
            }),
          ).toBe("7400011");
        });
      });

      describe("and sport is darts", () => {
        it("should return correct referer value", () => {
          expect(
            calculateRefererPartnerId(google, {
              currentUrl: "darts/competition-name/c-10932509",
              currentUrn: "ppb:tbd:view:competition:10932509",
              currentView: "ppb:tbd:view:competition",
            }),
          ).toBe("7400023");
        });
      });

      describe("and sport is other than football/politics/tennis/cricket/boxing/horse-racing/golf/darts", () => {
        it("should return correct referer value", () => {
          expect(
            calculateRefererPartnerId(google, {
              currentUrl: "basketball/competition-name/c-10932509",
              currentUrn: "ppb:tbd:view:competition:10932509",
              currentView: "ppb:tbd:view:competition",
            }),
          ).toBe("7400026");
        });
      });
    });

    describe("and is event", () => {
      describe("when url params do not match", () => {
        it("should return null", () => {
          expect(
            calculateRefererPartnerId(google, {
              currentUrl: "e-30789574",
              currentUrn: "ppb:tbd:view:event:30789574",
              currentView: "ppb:tbd:view:event",
            }),
          ).toBe(null);
        });
      });

      describe("and sport is football", () => {
        it("should return correct referer value", () => {
          expect(
            calculateRefererPartnerId(google, {
              currentUrl: "football/competition-name/event-name/e-30789574",
              currentUrn: "ppb:tbd:view:event:30789574",
              currentView: "ppb:tbd:view:event",
            }),
          ).toBe("7400006");
        });
      });

      describe("and sport is tennis", () => {
        it("should return correct referer value", () => {
          expect(
            calculateRefererPartnerId(google, {
              currentUrl: "tennis/competition-name/event-name/e-30789574",
              currentUrn: "ppb:tbd:view:event:30789574",
              currentView: "ppb:tbd:view:event",
            }),
          ).toBe("7400021");
        });
      });

      describe("and sport is golf", () => {
        it("should return correct referer value", () => {
          expect(
            calculateRefererPartnerId(google, {
              currentUrl: "golf/competition-name/event-name/e-30789574",
              currentUrn: "ppb:tbd:view:event:30789574",
              currentView: "ppb:tbd:view:event",
            }),
          ).toBe("7400011");
        });
      });

      describe("and sport is cricket", () => {
        it("should return correct referer value", () => {
          expect(
            calculateRefererPartnerId(google, {
              currentUrl: "cricket/competition-name/event-name/e-30789574",
              currentUrn: "ppb:tbd:view:event:30789574",
              currentView: "ppb:tbd:view:event",
            }),
          ).toBe("7400016");
        });
      });

      describe("and sport is boxing", () => {
        it("should return correct referer value", () => {
          expect(
            calculateRefererPartnerId(google, {
              currentUrl: "boxing/competition-name/event-name/e-30789574",
              currentUrn: "ppb:tbd:view:event:30789574",
              currentView: "ppb:tbd:view:event",
            }),
          ).toBe("7400013");
        });
      });

      describe("and sport is darts", () => {
        it("should return correct referer value", () => {
          expect(
            calculateRefererPartnerId(google, {
              currentUrl: "darts/competition-name/event-name/e-30789574",
              currentUrn: "ppb:tbd:view:event:30789574",
              currentView: "ppb:tbd:view:event",
            }),
          ).toBe("7400024");
        });
      });

      describe("and sport is politics", () => {
        it("should return correct referer value", () => {
          expect(
            calculateRefererPartnerId(google, {
              currentUrl: "politics/competition-name/event-name/e-30789574",
              currentUrn: "ppb:tbd:view:event:30789574",
              currentView: "ppb:tbd:view:event",
            }),
          ).toBe("7400018");
        });
      });

      describe("and sport is other than football/politics/tennis/cricket/boxing/golf/darts", () => {
        it("should return correct referer value", () => {
          expect(
            calculateRefererPartnerId(google, {
              currentUrl: "basketball/competition-name/event-name/e-30789574",
              currentUrn: "ppb:tbd:view:event:30789574",
              currentView: "ppb:tbd:view:event",
            }),
          ).toBe("7400027");
        });
      });
    });

    describe("and is sport", () => {
      describe("when url params do not match", () => {
        it("should return null", () => {
          expect(
            calculateRefererPartnerId(google, {
              currentUrl: "",
              currentUrn: "ppb:tbd:view:sport:1",
              currentView: "ppb:tbd:view:sport",
            }),
          ).toBe(null);
        });
      });

      describe("and sport is football", () => {
        it("should return correct referer value", () => {
          expect(
            calculateRefererPartnerId(google, {
              currentUrl: "football/s-1",
              currentUrn: "ppb:tbd:view:sport:1",
              currentView: "ppb:tbd:view:sport",
            }),
          ).toBe("7400004");
        });
      });

      describe("and sport is tennis", () => {
        it("should return correct referer value", () => {
          expect(
            calculateRefererPartnerId(google, {
              currentUrl: "tennis/s-2",
              currentUrn: "ppb:tbd:view:sport:2",
              currentView: "ppb:tbd:view:sport",
            }),
          ).toBe("7400019");
        });
      });

      describe("and sport is golf", () => {
        it("should return correct referer value", () => {
          expect(
            calculateRefererPartnerId(google, {
              currentUrl: "golf/s-3",
              currentUrn: "ppb:tbd:view:sport:3",
              currentView: "ppb:tbd:view:sport",
            }),
          ).toBe("7400010");
        });
      });

      describe("and sport is cricket", () => {
        it("should return correct referer value", () => {
          expect(
            calculateRefererPartnerId(google, {
              currentUrl: "cricket/s-4",
              currentUrn: "ppb:tbd:view:sport:4",
              currentView: "ppb:tbd:view:sport",
            }),
          ).toBe("7400014");
        });
      });

      describe("and sport is boxing", () => {
        it("should return correct referer value", () => {
          expect(
            calculateRefererPartnerId(google, {
              currentUrl: "boxing/s-6",
              currentUrn: "ppb:tbd:view:sport:6",
              currentView: "ppb:tbd:view:sport",
            }),
          ).toBe("7400012");
        });
      });

      describe("and sport is horse-racing", () => {
        it("should return correct referer value", () => {
          expect(
            calculateRefererPartnerId(google, {
              currentUrl: "horse-racing/s-7",
              currentUrn: "ppb:tbd:view:sport:7",
              currentView: "ppb:tbd:view:sport",
            }),
          ).toBe("7400007");
        });
      });

      describe("and sport is darts", () => {
        it("should return correct referer value", () => {
          expect(
            calculateRefererPartnerId(google, {
              currentUrl: "darts/s-3503",
              currentUrn: "ppb:tbd:view:sport:3503",
              currentView: "ppb:tbd:view:sport",
            }),
          ).toBe("7400022");
        });
      });

      describe("and sport is politics", () => {
        it("should return correct referer value", () => {
          expect(
            calculateRefererPartnerId(google, {
              currentUrl: "politics/s-2378961",
              currentUrn: "ppb:tbd:view:sport:2378961",
              currentView: "ppb:tbd:view:sport",
            }),
          ).toBe("7400017");
        });
      });

      describe("and sport is lotteries", () => {
        it("should return correct referer value", () => {
          expect(
            calculateRefererPartnerId(google, {
              currentUrl: "lotteries/s-29125756",
              currentUrn: "ppb:tbd:view:sport:29125756",
              currentView: "ppb:tbd:view:sport",
            }),
          ).toBe("7560054");
        });
      });

      describe("and sport is other than football/politics/tennis/cricket/boxing/horse-racing/golf/darts/lotteries", () => {
        it("should return correct referer value", () => {
          expect(
            calculateRefererPartnerId(google, {
              currentUrl: "basketball/s-7522",
              currentUrn: "ppb:tbd:view:sport:7522",
              currentView: "ppb:tbd:view:sport",
            }),
          ).toBe("7400025");
        });
      });
    });

    describe("and is race", () => {
      describe("when url params do not match", () => {
        it("should return null", () => {
          expect(
            calculateRefererPartnerId(google, {
              currentUrl: "",
              currentUrn: "ppb:tbd:view:race:7|31802674.1510",
              currentView: "ppb:tbd:view:race",
            }),
          ).toBe(null);
        });
      });

      describe("and race is horse racing", () => {
        it("should return correct referer value", () => {
          expect(
            calculateRefererPartnerId(google, {
              currentUrl: "horse-racing/ayr/r-7%7C31802674.1510",
              currentUrn: "ppb:tbd:view:race:7|31802674.1510",
              currentView: "ppb:tbd:view:race",
            }),
          ).toBe("7400009");
        });
      });

      describe("and sport is greyhounds-racing", () => {
        it("should return correct referer value", () => {
          expect(
            calculateRefererPartnerId(google, {
              currentUrl: "greyhound-racing/healesville-aus-7th-oct/r-4339%7C31807478.2342",
              currentUrn: "ppb:tbd:view:race:4339|31807478.2342",
              currentView: "ppb:tbd:view:race",
            }),
          ).toBe("7400027");
        });
      });
    });

    describe("and is inplay", () => {
      describe("when urn is the generic inplay page", () => {
        it("should return the correct rfr code", () => {
          expect(
            calculateRefererPartnerId(google, {
              currentUrl: "view/d-inplay",
              currentUrn: "ppb:tbd:view:generic:inplay",
              currentView: "ppb:tbd:view:generic",
            }),
          ).toBe("7400027");
        });
      });
    });

    describe("and is homepage", () => {
      it("should return correct referer value", () => {
        expect(
          calculateRefererPartnerId(google, {
            currentUrl: "football/s-1",
            currentUrn: "ppb:tbd:view:generic:home",
            currentView: "ppb:tbd:view:generic",
          }),
        ).toBe("7400001");
      });
    });

    describe("and is gamming", () => {
      it("should return correct referer value", () => {
        expect(
          calculateRefererPartnerId(google, {
            currentUrl: "casino/gm-1",
            currentUrn: "ppb:tbd:view:gaming:1",
            currentView: "ppb:tbd:view:gaming",
          }),
        ).toBe("7400093");
      });
    });
  });
});
