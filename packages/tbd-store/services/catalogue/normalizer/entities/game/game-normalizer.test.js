import normalizeGameFragmentIntoGame from "./game-normalizer";

describe("normalizeGameFragmentIntoGame", () => {
  const fragmentMock = {
    __typename: "Game",
    urn: "ppb:tbd:game:1",
    name: "Age of the gods",
    launchId: "launchId",
    rgsCodeMobile: "rgsMobileCode",
    provider: {
      name: "Gaming Platform - Blueprint",
      uid: "gp-bp",
    },
    feedData: {
      jackpot: 123,
      availableSeats: 1,
      lastNumbers: [
        {
          number: "1",
          color: "RED",
        },
        {
          number: "2",
          color: "BLACK",
        },
        {
          number: "3",
          color: "",
        },
        {
          number: "4",
          color: "randomColor",
        },
      ],
      tableNames: "rol_prestigerol",
    },
    backgroundColor: "firebrick - red",
    jackpotLogo: "JACKPOT_KING",
    label: "JACKPOT",
    decoration: "BF Gaming black",
    hasDemo: true,
    metaData: {
      metaTitle: "Test Game Meta Title",
      metaDescription: "Test Game Meta Description",
    },
    gameMechanics: ["test 1", "test 2"],
    gameStudio: "test",
    gameTheme: "test",
    gameType: "test",
    gameVolatility: "test",
    gameHelp: "test",
    jackpotType: "test",
    mainProduct: "test",
    maxStake: "10",
    minStake: "11",
    screenshots: [],
  };

  it("should correctly normalize the card", () => {
    const { data } = normalizeGameFragmentIntoGame(fragmentMock);

    expect(data).toEqual({
      typename: "Game",
      urn: "ppb:tbd:game:1",
      name: "Age of the gods",
      launchId: "launchId",
      rgsCodeMobile: "rgsMobileCode",
      provider: {
        name: "Gaming Platform - Blueprint",
        uid: "gp-bp",
      },
      feedData: {
        availableSeats: 1,
        jackpot: 123,
        lastNumbers: [
          {
            color: "RED",
            number: "1",
          },
          {
            color: "BLACK",
            number: "2",
          },
          {
            color: undefined,
            number: "3",
          },
          {
            color: undefined,
            number: "4",
          },
        ],
        tableNames: "rol_prestigerol",
      },
      jackpotLogo: "Jackpot King",
      label: "JACKPOT",
      backgroundColor: "firebrick",
      decoration: "BF Gaming black",
      hasDemo: true,
      seoMetaData: {
        metaTitle: "Test Game Meta Title",
        metaDescription: "Test Game Meta Description",
      },
      copyrightText: undefined,
      customLogo: undefined,
      description: undefined,
      flattened: undefined,
      gameMechanics: ["test 1", "test 2"],
      gameStudio: "test",
      gameTheme: "test",
      gameType: "test",
      gameVolatility: "test",
      gameHelp: "test",
      jackpotType: "test",
      mainProduct: "test",
      maxStake: "10",
      minStake: "11",
      screenshots: [],
      rtp: undefined,
      viewLink: undefined,
    });
  });
  it("should normalize with valid screenshots", () => {
    const fragmentWithScreenshots = {
      ...fragmentMock,
      screenshots: [
        {
          url: "https://example.com/shot1.jpg",
          dimensions: {
            width: 800,
            height: 600,
          },
        },
      ],
    };

    const { data } = normalizeGameFragmentIntoGame(fragmentWithScreenshots);

    expect(data.screenshots).toEqual([
      {
        url: "https://example.com/shot1.jpg",
        dimensions: {
          width: 800,
          height: 600,
        },
        alt: undefined,
      },
    ]);
  });

  it("should handle null screenshots", () => {
    const fragmentWithNullScreenshot = {
      ...fragmentMock,
      screenshots: [null],
    };

    const { data } = normalizeGameFragmentIntoGame(fragmentWithNullScreenshot);

    expect(data.screenshots).toEqual([null]);
  });
});
