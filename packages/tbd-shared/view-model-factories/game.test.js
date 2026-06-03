import { JackpotLogo, Label } from "@ppb/tbd-store/state/entities/Gaming.types";
import { createGameCardViewModel, normalizeJackpotName, getLaunchUrl, getPropsForGameInfo } from "./game";
import { i18n } from "../helpers/i18n";
import { getEndpoint } from "../config/endpoints";

jest.mock("../config/endpoints", () => ({
  getEndpoint: jest.fn(),
}));

jest.mock("../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

const mockGame = {
  urn: "gameUrn",
  name: "Arcade Bomb",
  rgsCodeMobile: "ArcadeBomb",
  label: "JACKPOT",
  feedData: {
    jackpot: 123,
  },
  provider: {
    name: "Playtech",
    uid: "pt",
  },
  mainProduct: "arcade",
  flattened: {
    small: {
      url: "https://gmimages.cdnppb.net/betfair-com%2F0d6f0b60-0077-4f8d-bedf-1677994174e6_arcadebomb_logo.png?auto=compress&q=60&rect=0,0,250,250&w=250&h=250 250w",
      alt: "Arcade Bomb Small Image",
      dimensions: {
        width: 250,
        height: 250,
      },
    },
    medium: {
      url: "https://gmimages.cdnppb.net/betfair-com%2F0d6f0b60-0077-4f8d-bedf-1677994174e6_arcadebomb_logo.png?auto=compress&q=60&rect=0,0,450,450&w=450&h=450 450w",
      alt: "Arcade Bomb Medium Image",
      dimensions: {
        width: 450,
        height: 450,
      },
    },
  },
  rtp: "97.08",
  gameMechanics: ["Megaways"],
  gameStudio: "Blueprint",
  gameTheme: "Adventure",
  gameType: "Slot",
  gameVolatility: "High",
  gameHelp: "test link",
  jackpotType: "Progressive",
  minStake: "0.10",
  maxStake: "100",
  copyrightText: "Arcade Bomb Copyright Text",
  backgroundColor: "#dbc4c4",
  description: {
    headline: "Headline",
    content: "Content",
  },
  hasDemo: true,
  uid: "arcade-bomb-uid",
  customLogo: {
    name: "custom logo name",
    image: {
      url: "https://images.prismic.io/betfair-com-dev/e6e3f7d0-ce66-405b-8b78-3894f56d2e36_daily_prize_drops_and_wins.png?auto=compress,format&rect=0,0,120,120&w=120&h=120",
      dimensions: {
        height: 120,
        width: 120,
      },
    },
  },
};

describe("createGameCardViewModel", () => {
  describe("check returned props for game tile", () => {
    it("should return the correct props when all data fields are available", () => {
      const getGameCardViewModel = createGameCardViewModel();
      expect(getGameCardViewModel(mockGame)).toEqual({
        background: {
          small: {
            url: "https://gmimages.cdnppb.net/betfair-com%2F0d6f0b60-0077-4f8d-bedf-1677994174e6_arcadebomb_logo.png?auto=compress&q=60&rect=0,0,250,250&w=250&h=250 250w",
            width: 250,
            height: 250,
          },
          medium: {
            url: "https://gmimages.cdnppb.net/betfair-com%2F0d6f0b60-0077-4f8d-bedf-1677994174e6_arcadebomb_logo.png?auto=compress&q=60&rect=0,0,450,450&w=450&h=450 450w",
            width: 450,
            height: 450,
          },
          alt: "Arcade Bomb Small Image",
        },
        badge: {
          label: "123",
          type: "JACKPOT",
        },
        title: "Arcade Bomb",
        copyrightText: "Arcade Bomb Copyright Text",
        jackpotLogo: "",
        customLogo: {
          name: "custom logo name",
          image: {
            url: "https://images.prismic.io/betfair-com-dev/e6e3f7d0-ce66-405b-8b78-3894f56d2e36_daily_prize_drops_and_wins.png?auto=compress,format&rect=0,0,120,120&w=120&h=120",
            dimensions: {
              height: 120,
              width: 120,
            },
          },
        },
        gameMechanics: ["Megaways"],
        gameStudio: "Blueprint",
        gameTheme: "Adventure",
        gameType: "Slot",
        gameVolatility: "High",
        gameHelp: "test link",
        jackpotType: "Progressive",
        minStake: "0.10",
        maxStake: "100",
        backgroundColor: "#dbc4c4",
        columns: 1,
      });
    });

    it("should return the correct background props when only the small image is available", () => {
      const game = {
        urn: "gameUrn",
        name: "Arcade Bomb",
        rgsCodeMobile: "ArcadeBomb",
        provider: {
          name: "Playtech",
          uid: "pt",
        },
        mainProduct: "arcade",
        flattened: {
          small: {
            url: "smallImgUrl",
            alt: "Arcade Bomb Small Image",
            dimensions: {
              width: 250,
              height: 250,
            },
          },
        },
      };

      const getGameCardViewModel = createGameCardViewModel();

      expect(getGameCardViewModel(game).background).toEqual({
        small: {
          url: "smallImgUrl",
          width: 250,
          height: 250,
        },
        alt: "Arcade Bomb Small Image",
      });
    });

    it("should return the correct props when background is an empty object", () => {
      const game = {
        urn: "gameUrn",
        name: "gameName",
        rgsCodeMobile: "ArcadeBomb",
        provider: {
          name: "Playtech",
          uid: "pt",
        },
        mainProduct: "arcade",
        flattened: {},
      };

      const getGameCardViewModel = createGameCardViewModel();

      expect(getGameCardViewModel(game).background).toEqual({
        small: undefined,
        medium: undefined,
        alt: "",
      });
    });

    it("should return the correct props when optional data are not available", () => {
      const game = {
        urn: "gameUrn",
        name: "gameName",
        rgsCodeMobile: "ArcadeBomb",
        provider: {
          name: "Playtech",
          uid: "pt",
        },
        mainProduct: "arcade",
      };
      const getGameCardViewModel = createGameCardViewModel();

      expect(getGameCardViewModel(game)).toEqual({
        background: undefined,
        title: "gameName",
        copyrightText: undefined,
        jackpotLogo: "",
        backgroundColor: "",
        columns: 1,
      });
    });

    it("should normalize the jackpotLogo when JackpotLogo is available", () => {
      const game = {
        urn: "gameUrn",
        name: "gameName",
        rgsCodeMobile: "ArcadeBomb",
        provider: {
          name: "Playtech",
          uid: "pt",
        },
        jackpotLogo: "Daily Jackpot",
        mainProduct: "arcade",
        label: Label.JACKPOT,
      };
      const getGameCardViewModel = createGameCardViewModel();

      expect(getGameCardViewModel(game)).toEqual({
        background: undefined,
        title: "gameName",
        copyrightText: undefined,
        jackpotLogo: "daily_jackpot",
        backgroundColor: "",
        columns: 1,
        badge: {
          label: undefined,
          type: "JACKPOT",
        },
      });
    });
  });
});

describe("getPropsForGameInfo", () => {
  describe("check returned props for game info", () => {
    it("should return the correct props when all data fields are available", () => {
      expect(getPropsForGameInfo(mockGame)).toEqual({
        flattenedImage: {
          small: {
            url: "https://gmimages.cdnppb.net/betfair-com%2F0d6f0b60-0077-4f8d-bedf-1677994174e6_arcadebomb_logo.png?auto=compress&q=60&rect=0,0,250,250&w=250&h=250 250w",
            width: 250,
            height: 250,
          },
          medium: {
            url: "https://gmimages.cdnppb.net/betfair-com%2F0d6f0b60-0077-4f8d-bedf-1677994174e6_arcadebomb_logo.png?auto=compress&q=60&rect=0,0,450,450&w=450&h=450 450w",
            width: 450,
            height: 450,
          },
          alt: "Arcade Bomb Small Image",
        },
        badge: {
          label: "123",
          type: "JACKPOT",
        },
        rtp: "97.08",
        title: "Arcade Bomb",
        jackpotLogo: "",
        customLogo: {
          name: "custom logo name",
          image: {
            url: "https://images.prismic.io/betfair-com-dev/e6e3f7d0-ce66-405b-8b78-3894f56d2e36_daily_prize_drops_and_wins.png?auto=compress,format&rect=0,0,120,120&w=120&h=120",
            dimensions: {
              height: 120,
              width: 120,
            },
          },
        },
        copyrightText: "Arcade Bomb Copyright Text",
        howToPlayDetails: { content: "Content", headline: "Headline" },
        i18n: {
          playNow: "I18N.GAME_TILE.PLAY_NOW_BUTTON",
          rtp: "I18N.GAME_TILE.RTP",
          description: "I18N.GAME_INFO.DESCRIPTION",
          glance: "I18N.GAME_INFO.GLANCE",
          volatility: "I18N.GAME_INFO.VOLATILITY",
          gameHelp: "I18N.GAME_INFO.GAME_HELP",
          addToFavourites: "I18N.FAVOURITE_GAMES.ADD_TO_FAVS",
          removeFromFavourites: "I18N.FAVOURITE_GAMES.REMOVE_FROM_FAVS",
        },
        isDemoButtonDisplayed: true,
        gameMechanics: ["Megaways"],
        gameStudio: "Blueprint",
        gameTheme: "Adventure",
        gameType: "Slot",
        gameVolatility: "High",
        gameHelp: "test link",
        jackpotType: "Progressive",
        minStake: "0.10",
        maxStake: "100",
        screenshots: undefined,
        uid: "arcade-bomb-uid",
      });
    });

    it("should return the correct props when optional data are not available", () => {
      const game = {
        urn: "gameUrn",
        name: "gameName",
        launchId: "launchId",
        rgsCodeMobile: "ArcadeBomb",
        provider: {
          name: "Playtech",
          uid: "pt",
        },
        mainProduct: "arcade",
        viewLink: {
          viewUrl: "viewUrl",
          viewUrn: "viewUrn",
        },
      };
      expect(getPropsForGameInfo(game)).toEqual({
        flattenedImage: undefined,
        gameMechanics: undefined,
        gameStudio: undefined,
        gameTheme: undefined,
        gameType: undefined,
        gameVolatility: undefined,
        gameHelp: undefined,
        badge: undefined,
        copyrightText: undefined,
        customLogo: undefined,
        title: "gameName",
        i18n: {
          playNow: "I18N.GAME_TILE.PLAY_NOW_BUTTON",
          rtp: "I18N.GAME_TILE.RTP",
          description: "I18N.GAME_INFO.DESCRIPTION",
          glance: "I18N.GAME_INFO.GLANCE",
          volatility: "I18N.GAME_INFO.VOLATILITY",
          gameHelp: "I18N.GAME_INFO.GAME_HELP",
          addToFavourites: "I18N.FAVOURITE_GAMES.ADD_TO_FAVS",
          removeFromFavourites: "I18N.FAVOURITE_GAMES.REMOVE_FROM_FAVS",
        },
        isDemoButtonDisplayed: undefined,
        howToPlayDetails: undefined,
        jackpotLogo: "",
        jackpotType: undefined,
        minStake: undefined,
        maxStake: undefined,
        rtp: undefined,
        screenshots: undefined,
        uid: undefined,
      });
    });
  });
});

describe("normalizeJackpotName", () => {
  it("should return the normalized jackpot name", () => {
    expect(normalizeJackpotName(JackpotLogo.DAILY_JACKPOT)).toEqual("daily_jackpot");
  });

  it("should return empty value if jackpot name is not available", () => {
    expect(normalizeJackpotName(undefined)).toEqual("");
  });
});

describe("getLaunchUrl", () => {
  beforeAll(() => {
    getEndpoint.mockReturnValue("https://launcher.betfair.com/launcher/");
  });
  it("should return the correct game launch url for a given game on betfair", () => {
    const launchURL = getLaunchUrl("arcade-bomb", "pt-rt", "arcade", false, "https://www.betfair.com/");
    expect(launchURL).toEqual(
      "https://launcher.betfair.com/launcher/?gameId=arcade-bomb&channel=lottery&returnURL=https%3A%2F%2Fwww.betfair.com%2F&launchProduct=arcade&RPBucket=arcade&mode=real&statusBar=false&dismissButtonPosition=topRight&dataChannel=rebuild&dataContext=web",
    );
  });

  it("should return the correct game launch url when mainProduct is vegas-it", () => {
    const launchURL = getLaunchUrl("arcade-bomb", "pt-rt", "vegas-it", false, "https://www.betfair.com/");
    expect(launchURL).toEqual(
      "https://launcher.betfair.com/launcher/?gameId=arcade-bomb&channel=lottery&returnURL=https%3A%2F%2Fwww.betfair.com%2F&launchProduct=vegas-it&RPBucket=vegas-it&mode=real&statusBar=false&dismissButtonPosition=topRight&dataChannel=rebuild&dataContext=web",
    );
  });

  it("should return the correct game launch url when mainProduct is vegas-ro", () => {
    const launchURL = getLaunchUrl("arcade-bomb", "pt-rt", "vegas-ro", false, "https://www.betfair.com/");
    expect(launchURL).toEqual(
      "https://launcher.betfair.com/launcher/?gameId=arcade-bomb&channel=lottery&returnURL=https%3A%2F%2Fwww.betfair.com%2F&launchProduct=vegas-ro&RPBucket=vegas-ro&mode=real&statusBar=false&dismissButtonPosition=topRight&dataChannel=rebuild&dataContext=web",
    );
  });

  it("should return the correct game launch url when mainProduct contains the language other than vegas-it", () => {
    const launchURL = getLaunchUrl("arcade-bomb", "pt-rt", "arcade-de-de", false, "https://www.betfair.com/");
    expect(launchURL).toEqual(
      "https://launcher.betfair.com/launcher/?gameId=arcade-bomb&channel=lottery&returnURL=https%3A%2F%2Fwww.betfair.com%2F&launchProduct=arcade&RPBucket=arcade&mode=real&statusBar=false&dismissButtonPosition=topRight&dataChannel=rebuild&dataContext=web",
    );
  });
  it("should return the correct gave launch url when launching game in demo mode", () => {
    const launchURL = getLaunchUrl("arcade-bomb", "pt-rt", "arcade-de-de", false, "https://www.betfair.com/", true);
    expect(launchURL).toEqual(
      "https://launcher.betfair.com/launcher/?gameId=arcade-bomb&channel=lottery&returnURL=https%3A%2F%2Fwww.betfair.com%2F&launchProduct=arcade&RPBucket=arcade&mode=demo&statusBar=false&dismissButtonPosition=topRight&dataChannel=rebuild&dataContext=web",
    );
  });

  it("should return the correct game launch url for a given game on skybet", () => {
    getEndpoint.mockReturnValue("https://launcher.skybet.com/launcher/");
    const launchURL = getLaunchUrl("arcade-bomb", "pt-rt", "gaming", false, "https://www.skybet.com/");
    expect(launchURL).toEqual(
      "https://launcher.skybet.com/launcher/?gameId=arcade-bomb&channel=lottery&returnURL=https%3A%2F%2Fwww.skybet.com%2F&launchProduct=gaming&RPBucket=gaming&mode=real&statusBar=false&dismissButtonPosition=topRight&dataChannel=sportsgaming&dataContext=web",
    );
  });
  it("should return the correct game launch url for a given game on skybet with pt-alias-live provider", () => {
    getEndpoint.mockReturnValue("https://launcher.skybet.com/launcher/");
    const launchURL = getLaunchUrl("arcade-bomb", "pt-alias-live", "gaming", false, "https://www.skybet.com/");
    expect(launchURL).toEqual(
      "https://launcher.skybet.com/launcher/?gameId=arcade-bomb&channel=lottery&returnURL=https%3A%2F%2Fwww.skybet.com%2F&launchProduct=gaming&RPBucket=gaming&mode=real&statusBar=false&dismissButtonPosition=topRight&dataChannel=sportsgaming&dataContext=web&switchedToNewTab=true",
    );
  });
});

describe("Badge", () => {
  it("should return undefined for a given game without feed data or label", () => {
    const game = {
      urn: "gameUrn",
      name: "Arcade Bomb",
      launchId: "arcade-bomb",
      rgsCodeMobile: "ArcadeBomb",
      provider: {
        name: "Blueprint",
        uid: "bp",
      },
      mainProduct: "arcade",
    };
    const getGameCardViewModel = createGameCardViewModel();

    expect(getGameCardViewModel(game).badge).toEqual(undefined);
  });

  it("should return the correct badge for a given game with label, but without feed data", () => {
    const game = {
      urn: "gameUrn",
      name: "Arcade Bomb",
      launchId: "arcade-bomb",
      rgsCodeMobile: "ArcadeBomb",
      provider: {
        name: "Blueprint",
        uid: "bp",
      },
      mainProduct: "arcade",
      label: "EXCLUSIVE",
    };
    const getGameCardViewModel = createGameCardViewModel();

    expect(getGameCardViewModel(game).badge).toEqual({
      type: "REGULAR",
      label: "I18N.GAME_CARD.BADGE.EXCLUSIVE",
    });
  });

  it("should return the correct badge for a given game with the PLAY IT HERE FIRST label, but without feed data", () => {
    const game = {
      urn: "gameUrn",
      name: "Arcade Bomb",
      launchId: "arcade-bomb",
      rgsCodeMobile: "ArcadeBomb",
      provider: {
        name: "Blueprint",
        uid: "bp",
      },
      mainProduct: "arcade",
      label: "PLAY IT HERE FIRST",
    };
    const getGameCardViewModel = createGameCardViewModel();

    expect(getGameCardViewModel(game).badge).toEqual({
      type: "REGULAR",
      label: "I18N.GAME_CARD.BADGE.PLAY_IT_HERE_FIRST",
    });
  });

  it("should return the correct badge for a given game with jackpot label and without feed data", () => {
    const game = {
      urn: "gameUrn",
      name: "Arcade Bomb",
      launchId: "arcade-bomb",
      rgsCodeMobile: "ArcadeBomb",
      provider: {
        name: "Blueprint",
        uid: "bp",
      },
      mainProduct: "arcade",
      label: "JACKPOT",
    };
    const getGameCardViewModel = createGameCardViewModel();

    expect(getGameCardViewModel(game).badge).toEqual({
      type: "JACKPOT",
      label: undefined,
    });
  });

  it("should return the correct badge for a given game with jackpot label and feed data", () => {
    const game = {
      urn: "gameUrn",
      name: "Arcade Bomb",
      launchId: "arcade-bomb",
      rgsCodeMobile: "ArcadeBomb",
      provider: {
        name: "Blueprint",
        uid: "bp",
      },
      mainProduct: "arcade",
      label: "JACKPOT",
      feedData: {
        jackpot: 11,
      },
    };
    const getGameCardViewModel = createGameCardViewModel();

    expect(getGameCardViewModel(game).badge).toEqual({
      type: "JACKPOT",
      label: "11",
    });
  });

  it("should return the correct badge for a given game with roulette numbers array", () => {
    const game = {
      urn: "gameUrn",
      name: "Arcade Bomb",
      launchId: "arcade-bomb",
      rgsCodeMobile: "ArcadeBomb",
      provider: {
        name: "Blueprint",
        uid: "bp",
      },
      mainProduct: "arcade",
      feedData: {
        lastNumbers: [{ color: "red", number: "5" }],
      },
    };
    const getGameCardViewModel = createGameCardViewModel();

    expect(getGameCardViewModel(game).badge).toEqual({
      type: "ROULETTE_NUMBERS",
      rouletteNumbers: [{ color: "red", number: "5" }],
    });
  });

  it("should return the correct badge for a given game with 0 available seat", () => {
    const game = {
      urn: "gameUrn",
      name: "Arcade Bomb",
      launchId: "arcade-bomb",
      rgsCodeMobile: "ArcadeBomb",
      provider: {
        name: "Blueprint",
        uid: "bp",
      },
      mainProduct: "arcade",
      feedData: {
        availableSeats: 0,
      },
    };
    const getGameCardViewModel = createGameCardViewModel();

    expect(getGameCardViewModel(game).badge).toEqual({
      type: "SEATS_AVAILABLE",
      label: `${i18n({ key: "I18N.GAME_TILE.BADGE.AVAILABLE_SEATS.FULL_TABLE" })} - ${i18n({
        key: "I18N.GAME_TILE.BADGE.AVAILABLE_SEATS.BET_BEHIND_NOW",
      })}`,
    });
  });

  it("should return the correct badge for a given game with 1 available seat", () => {
    const game = {
      urn: "gameUrn",
      name: "Arcade Bomb",
      launchId: "arcade-bomb",
      rgsCodeMobile: "ArcadeBomb",
      provider: {
        name: "Blueprint",
        uid: "bp",
      },
      mainProduct: "arcade",
      feedData: {
        availableSeats: 1,
      },
    };
    const getGameCardViewModel = createGameCardViewModel();

    expect(getGameCardViewModel(game).badge).toEqual({
      type: "SEATS_AVAILABLE",
      label: `${i18n({ key: "I18N.GAME_TILE.BADGE.AVAILABLE_SEATS.SEAT", interpolationValues: { count: 1 } })}`,
    });
  });

  it("should return the correct badge for a given game with more than one available seat", () => {
    const game = {
      urn: "gameUrn",
      name: "Arcade Bomb",
      launchId: "arcade-bomb",
      rgsCodeMobile: "ArcadeBomb",
      provider: {
        name: "Blueprint",
        uid: "bp",
      },
      mainProduct: "arcade",
      feedData: {
        availableSeats: 4,
      },
    };
    const getGameCardViewModel = createGameCardViewModel();

    expect(getGameCardViewModel(game).badge).toEqual({
      type: "SEATS_AVAILABLE",
      label: `${i18n({
        key: "I18N.GAME_TILE.BADGE.AVAILABLE_SEATS.SEAT_plural",
        interpolationValues: { count: 4 },
      })}`,
    });
  });

  it("should return the correct badge for a given game with new label and decoration BF-Gaming-black", () => {
    const game = {
      urn: "gameUrn|BF-Gaming-black",
      name: "Arcade Bomb",
      launchId: "arcade-bomb",
      rgsCodeMobile: "ArcadeBomb",
      provider: {
        name: "Blueprint",
        uid: "bp",
      },
      mainProduct: "arcade",
      label: "NEW",
      decoration: "BF-Gaming-black",
    };
    const getGameCardViewModel = createGameCardViewModel();

    expect(getGameCardViewModel(game).badge).toEqual({
      type: "NEW",
      label: "I18N.GAME_CARD.BADGE.NEW",
    });
  });

  it("should return the correct badge for a given game with new label and decoration different than BF-Gaming-black", () => {
    const game = {
      urn: "gameUrn|BF-Gaming-white",
      name: "Arcade Bomb",
      launchId: "arcade-bomb",
      rgsCodeMobile: "ArcadeBomb",
      provider: {
        name: "Blueprint",
        uid: "bp",
      },
      mainProduct: "arcade",
      label: "NEW",
      decoration: "BF-Gaming-white",
    };
    const getGameCardViewModel = createGameCardViewModel();

    expect(getGameCardViewModel(game).badge).toEqual({
      type: "NEW_REGULAR",
      label: "I18N.GAME_CARD.BADGE.NEW",
    });
  });

  it("should return the correct badge for a given game with new label and no decoration", () => {
    const game = {
      urn: "gameUrn|BF-Gaming-white",
      name: "Arcade Bomb",
      launchId: "arcade-bomb",
      rgsCodeMobile: "ArcadeBomb",
      provider: {
        name: "Blueprint",
        uid: "bp",
      },
      mainProduct: "arcade",
      label: "NEW",
    };
    const getGameCardViewModel = createGameCardViewModel();

    expect(getGameCardViewModel(game).badge).toEqual({
      type: "NEW_REGULAR",
      label: "I18N.GAME_CARD.BADGE.NEW",
    });
  });

  it("should return the correct badge for a given game with featured label", () => {
    const game = {
      urn: "gameUrn|BF-Gaming-white",
      name: "Arcade Bomb",
      launchId: "arcade-bomb",
      rgsCodeMobile: "ArcadeBomb",
      provider: {
        name: "Blueprint",
        uid: "bp",
      },
      mainProduct: "arcade",
      label: "FEATURED",
    };
    const getGameCardViewModel = createGameCardViewModel();

    expect(getGameCardViewModel(game).badge).toEqual({
      type: "FEATURED",
      label: "I18N.GAME_CARD.BADGE.FEATURED",
    });
  });

  it("should return undefined badge for a given game with gp-ev provider", () => {
    const game = {
      urn: "gameUrn",
      name: "Evolution Game",
      launchId: "evolution-game",
      rgsCodeMobile: "EvolutionGame",
      provider: {
        name: "Gaming Platform - Evolution",
        uid: "gp-ev",
      },
      mainProduct: "arcade",
      label: null,
      feedData: null,
    };

    expect(getPropsForGameInfo(game).badge).toEqual(undefined);
  });
});
