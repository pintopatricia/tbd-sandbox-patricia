import { render } from "@testing-library/react-native";
import { RichTextType } from "@ppb/the-wall-common/types";
import { Badge, TBDImage } from "@ppb/the-wall-native";
import { RichTextComponent } from "@ppb/the-wall-native/components/RichText/RichText";
import { GameBadge } from "../GameBadge/GameBadge.native";

import { GameInfo } from "./GameInfo.native";
import styles from "./GameInfo.native.styles";
import selectors from "./GameInfo.native.selectors";

jest.mock("@ppb/the-wall-native", () => ({
  Badge: jest.fn(() => <badge-mock />),
  TBDImage: jest.fn(() => <tbd-image-mock />),
  Text: jest.requireActual("react-native").Text,
}));

jest.mock("@ppb/the-wall-native/components/RichText/RichText", () => ({
  RichTextComponent: jest.fn(() => <rich-text-mock />),
}));

jest.mock("../GameBadge/GameBadge.native", () => ({
  GameBadge: jest.fn(() => <game-badge-mock />),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  tokens: {
    GameInfoThumbnailGradientColour: {
      colors: [],
      locations: [],
    },
  },
}));

const ON_CLICK_SPY = jest.fn(() => {});

function renderGameInfo(props) {
  return render(<GameInfo {...props} />);
}

function getGameInfo(props) {
  const { queryByTestId } = renderGameInfo(props);
  return queryByTestId(selectors.GAME_INFO);
}

function getHeroContainer(props) {
  const { queryByTestId } = renderGameInfo(props);
  return queryByTestId(selectors.GAME_INFO_HERO_CONTAINER);
}

function getTile(props) {
  const { queryByTestId } = renderGameInfo(props);
  return queryByTestId(selectors.GAME_INFO_TILE_GRADIENT);
}

function getCopyrightText(props) {
  const { queryByTestId } = renderGameInfo(props);
  return queryByTestId(selectors.GAME_INFO_COPYRIGHT_TEXT);
}

function getFlattenedImage(props) {
  const { queryByTestId } = renderGameInfo(props);
  return queryByTestId(selectors.GAME_INFO_FLATTENED_IMAGE);
}

function getBadgeContainer(props) {
  const { queryByTestId } = renderGameInfo(props);
  return queryByTestId(selectors.GAME_INFO_BADGE_CONTAINER);
}

function getJackpotBadgeValue(props) {
  const { queryByTestId } = renderGameInfo(props);
  return queryByTestId(selectors.GAME_INFO_JACKPOT_BADGE_VALUE);
}

function getBadge(props) {
  const { queryByTestId } = renderGameInfo(props);
  return queryByTestId(selectors.GAME_INFO_BADGE);
}

function getRtpContainer(props) {
  const { queryByTestId } = renderGameInfo(props);
  return queryByTestId(selectors.GAME_INFO_RTP_CONTAINER);
}

function getTitle(props) {
  const { queryByTestId } = renderGameInfo(props);
  return queryByTestId(selectors.GAME_INFO_TITLE);
}

function getHowToPlayHeadline(props) {
  const { queryByTestId } = renderGameInfo(props);
  return queryByTestId(selectors.GAME_INFO_HOW_TO_PLAY_HEADLINE);
}

function getGameDetailContainer(props) {
  const { queryByTestId } = renderGameInfo(props);
  return queryByTestId(selectors.GAME_INFO_GAME_DETAILS_CONTAINER);
}

const flattenedImage = {
  small: {
    url: "logo-small-url",
    width: 250,
    height: 250,
  },
  medium: {
    url: "logo-medium-url",
    width: 450,
    height: 450,
  },
  large: {
    url: "logo-large-url",
    width: 900,
    height: 900,
  },
  alt: "Flattened image",
};

const i18nMock = {
  playNow: "Play Now",
  rtp: "rtp",
};

const gameInfoProps = {
  flattenedImage,
  jackpotLogo: "/jackpot_king.png",
  badge: {
    label: "NEW",
    type: "REGULAR",
    rouletteNumbers: [],
  },
  rtp: "93,05%",
  title: "Esquelleto Mariachi",
  howToPlayDetails: {
    headline: "How to play",
    content: [
      { text: "Some text 1", type: RichTextType.LIST_ITEM, spans: [] },
      { text: "Some text 2", type: RichTextType.LIST_ITEM, spans: [] },
      { text: "Some text 3", type: RichTextType.LIST_ITEM, spans: [] },
    ],
  },
  i18n: i18nMock,
  playNowButtonOnTap: ON_CLICK_SPY,
  copyrightText: "Fake copyright text",
  launchUrl: {
    viewUrn: "fakeViewUrn",
    viewUrl: "fakeViewUrl",
  },
};

const gameInfoWithoutHeadlineProps = {
  flattenedImage,
  jackpotLogo: "/jackpot_king.png",
  badge: {
    label: "NEW",
    type: "REGULAR",
    rouletteNumbers: [],
  },
  rtp: "93,05%",
  title: "Esquelleto Mariachi",
  howToPlayDetails: {
    content: [],
  },
  i18n: i18nMock,
  playNowButtonOnTap: ON_CLICK_SPY,
  launchUrl: {
    viewUrn: "fakeViewUrn",
    viewUrl: "fakeViewUrl",
  },
};

const gameInfoWithMandatoryProps = {
  title: "Esquelleto Mariachi",
  i18n: i18nMock,
  launchUrl: {
    viewUrn: "fakeViewUrn",
    viewUrl: "fakeViewUrl",
  },
};

describe("Game Info", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("should render the game info container", () => {
    it("should render the game info container", () => {
      const gameInfo = getGameInfo(gameInfoProps);
      expect(gameInfo).toHaveStyle(styles.gameInfoContainer);
    });
  });

  describe("should render hero container and tileGradient", () => {
    it("should render hero container", () => {
      const heroContainer = getHeroContainer(gameInfoProps);
      expect(heroContainer).toHaveStyle(styles.heroContainer);
    });

    it("should render tileGradient", () => {
      const gradientContainer = getTile(gameInfoProps);
      expect(gradientContainer).toHaveStyle(styles.tileGradient);
    });

    it("should render copyrightText", () => {
      const copyrightText = getCopyrightText(gameInfoProps);
      expect(copyrightText).toHaveTextContent("Fake copyright text");
    });
  });

  describe("when game info has flattened image", () => {
    it("should render flattened image", () => {
      const flattenedImg = getFlattenedImage(gameInfoProps);
      expect(flattenedImg).toHaveStyle(styles.tileFlattenedImageBackground);
    });
  });

  describe("when game info does not have flattened image", () => {
    it("should not render flattened image", () => {
      const flattenedImg = getFlattenedImage(gameInfoWithMandatoryProps);
      expect(flattenedImg).toBe(null);
    });
  });

  describe("when game info has jackpot logo", () => {
    it("should render jackpot logo", () => {
      renderGameInfo(gameInfoProps);

      expect(TBDImage).toHaveBeenCalledWith(
        {
          style: styles.jackpotLogoImg,
          source: "/jackpot_king.png",
          resizeMode: "contain",
        },
        undefined,
      );
    });
  });

  describe("when game info does not have jackpot logo", () => {
    it("should not render jackpot logo", () => {
      renderGameInfo(gameInfoWithMandatoryProps);

      expect(TBDImage).not.toHaveBeenCalledWith({
        style: styles.jackpotLogoImg,
      });
    });
  });

  describe("should render game details container", () => {
    it("should render game details container", () => {
      const gameDetailsContainer = getGameDetailContainer(gameInfoProps);
      expect(gameDetailsContainer).toHaveStyle(styles.gameDetailsContainer);
    });
  });

  describe("when game info has badge label", () => {
    describe("when badge type is JACKPOT", () => {
      const jackpotBadgeGameInfoProps = {
        ...gameInfoProps,
        badge: {
          label: "JACKPOT",
          type: "JACKPOT",
          rouletteNumbers: [],
        },
      };

      it("should have badge container", () => {
        const jackpotBadge = getBadgeContainer(jackpotBadgeGameInfoProps);
        expect(jackpotBadge).toHaveStyle(styles.badgeContainer);
      });

      it("should have game badge icon", () => {
        getGameInfo(jackpotBadgeGameInfoProps);
        expect(GameBadge).toHaveBeenCalled();
      });

      it("should have correct text value on the badge", () => {
        const jackpotBadgeValue = getJackpotBadgeValue(jackpotBadgeGameInfoProps);
        expect(jackpotBadgeValue).toHaveStyle(styles.jackpotBadgeValue);
      });
    });

    describe("when badge type is REGULAR", () => {
      const regularBadgeGameInfoProps = {
        ...gameInfoProps,
        badge: {
          label: "EXCLUSIVE",
          type: "REGULAR",
          rouletteNumbers: [],
        },
      };

      it("should have badgeComponent and Badge component should be called", () => {
        getBadge(regularBadgeGameInfoProps);
        expect(Badge).toHaveBeenCalled();
      });
    });

    describe("when badge type is SEATS_AVAILABLE", () => {
      const seatsAvailableBadgeGameInfoProps = {
        ...gameInfoProps,
        badge: {
          label: "8 SEATS AVAILABLE",
          type: "SEATS_AVAILABLE",
          rouletteNumbers: [],
        },
      };

      it("should have badgeComponent and Badge component should be called", () => {
        getBadge(seatsAvailableBadgeGameInfoProps);
        expect(Badge).toHaveBeenCalled();
      });
    });

    describe("when badge type is ROULETTE_NUMBERS", () => {
      const rouletteNumbersBadgeGameInfoProps = {
        ...gameInfoProps,
        badge: {
          type: "ROULETTE_NUMBERS",
          rouletteNumbers: [
            { color: "red", number: "2" },
            { color: "green", number: "0" },
            { color: "black", number: "14" },
            { color: "red", number: "2" },
            { color: "green", number: "0" },
            { color: "black", number: "14" },
            { color: "red", number: "2" },
            { color: "green", number: "0" },
          ],
        },
      };

      it("should have badgeComponent and Badge component should be called", () => {
        getBadge(rouletteNumbersBadgeGameInfoProps);
        expect(Badge).toHaveBeenCalled();
      });
    });
  });

  describe("when game info does not have badge label", () => {
    it("should not render badge label", () => {
      const jackpotBadgeContainer = getBadgeContainer(gameInfoWithMandatoryProps);
      expect(jackpotBadgeContainer).toBe(null);
    });

    it("should not render game badge icon", () => {
      getGameInfo(gameInfoWithMandatoryProps);
      expect(GameBadge).not.toHaveBeenCalled();
    });
  });

  describe("when game info has rtp", () => {
    it("should render rtp", () => {
      const rtpContainer = getRtpContainer(gameInfoProps);
      expect(rtpContainer).toHaveTextContent("rtp 93,05%");
    });
  });

  describe("when game info does not have rtp", () => {
    it("should not render rtp", () => {
      const rtpContainer = getRtpContainer(gameInfoWithMandatoryProps);
      expect(rtpContainer).toBe(null);
    });
  });

  describe("should render title", () => {
    it("should render title", () => {
      const title = getTitle(gameInfoProps);
      expect(title).toHaveTextContent("ESQUELLETO MARIACHI");
    });
  });

  describe("when game info has how to play details", () => {
    describe("when game info has how to play details", () => {
      describe("and headline is provided", () => {
        it("should render the headline text", () => {
          const howToPlayDetails = getHowToPlayHeadline(gameInfoProps);
          expect(howToPlayDetails).toHaveTextContent("How to play");
        });
      });
      describe("and headline is not provided", () => {
        it("should not render the headline text", () => {
          const howToPlayDetails = getHowToPlayHeadline(gameInfoWithoutHeadlineProps);
          expect(howToPlayDetails).toBe(null);
        });
      });
    });

    it("should call the RichTextComponent", () => {
      getGameInfo(gameInfoProps);
      expect(RichTextComponent).toHaveBeenCalledWith(
        {
          list: [
            { text: "Some text 1", type: RichTextType.LIST_ITEM, spans: [] },
            { text: "Some text 2", type: RichTextType.LIST_ITEM, spans: [] },
            { text: "Some text 3", type: RichTextType.LIST_ITEM, spans: [] },
          ],
        },
        undefined,
      );
    });
  });

  describe("when game info does not have how to play details", () => {
    it("should not render how to play details", () => {
      const howToPlayDetails = getHowToPlayHeadline(gameInfoWithMandatoryProps);
      expect(howToPlayDetails).toBe(null);
    });
  });
});
