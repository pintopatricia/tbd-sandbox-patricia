import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { Timer } from "../../../TimerCountDown/snowflakes/Timer/Timer.web";
import { PlayNew } from "./PlayNew.web";
import {
  TEST_ID,
  PN_CONTAINER,
  PN_LEFT_CONTENT,
  PN_TITLE,
  PN_SUBTITLE,
  PN_RIGHT_CONTENT,
  PN_STATIC_LOGO_IMAGE,
  PN_MORE_INFO_LINK,
  PN_BADGE,
  PN_BACKGROUND_IMAGE_CONTAINER,
} from "./PlayNew.web.selectors";
import styles from "./PlayNew.web.css";

jest.mock("../../../TimerCountDown/snowflakes/Timer/Timer.web", () => ({
  Timer: jest.fn(({ props }) => <timer-item-mock {...props} />),
}));

function renderPlayNew(props) {
  const { container } = render(<PlayNew {...props} />);
  return container.querySelector(TEST_ID);
}

const hours = {
  label: "hours",
  value: [1, 2],
};
const minutes = {
  label: "minutes",
  value: [5, 4],
};

const playNewStaticProps = {
  isStaticPromo: true,
  title: "Spin Until you win",
  subtitle: "On a new game will launch in:",
  moreInfoLabel: "More info",
  timer: {
    minutes,
    hours,
  },
  logoImage: "https://pma-s3.betfair.com/media/english_uk/images/cpp/bf/2022/6/24/2022-06-24_12-11-03_563x563.png",
  backgroundImage: "play-new-union",
  targetUrl: "http://www.casino.nxt.com",
  promotionsCDN: "https://promotionsCDN",
  pmas3PromotionsCDN: "https://pma-s3.betfair.com/",
};

describe("Play New", () => {
  describe("PlayNew container", () => {
    it("should have 'container' class", () => {
      const playNew = renderPlayNew(playNewStaticProps);
      const pnContent = playNew.querySelector(PN_CONTAINER);

      expect(pnContent).toHaveClass(styles.contentContainer);
    });
  });
  describe("PlayNew widget content", () => {
    beforeEach(() => jest.clearAllMocks());

    describe("Precampagne state", () => {
      describe("PlayNew left widget", () => {
        it("should have 'leftContentWidget' class", () => {
          const playNew = renderPlayNew(playNewStaticProps);
          const pnLeftWidgetContent = playNew.querySelector(PN_LEFT_CONTENT);

          expect(pnLeftWidgetContent).toHaveClass(styles.leftContentWidget);
        });

        it("should show title with respective styles properly", () => {
          const playNew = renderPlayNew(playNewStaticProps);
          const title = playNew.querySelector(PN_TITLE);

          expect(title).toHaveTextContent(playNewStaticProps.title);
          expect(title).toHaveClass(styles.title);
        });

        it("should show subtitle with respective styles properly", () => {
          const playNew = renderPlayNew(playNewStaticProps);
          const subtitle = playNew.querySelector(PN_SUBTITLE);

          expect(subtitle).toHaveTextContent(playNewStaticProps.subtitle);
          expect(subtitle).toHaveClass(styles.title);
        });

        it("should call Timer components with correct values", () => {
          renderPlayNew(playNewStaticProps);
          expect(Timer).toHaveBeenCalledTimes(1);
          expect(Timer).toHaveBeenCalledWith({ hours, minutes }, undefined);
        });
      });

      describe("PlayNew right widget", () => {
        it("should have 'rightContentWidget' class", () => {
          const playNew = renderPlayNew(playNewStaticProps);
          const pnRightWidgetContent = playNew.querySelector(PN_RIGHT_CONTENT);

          expect(pnRightWidgetContent).toHaveClass(styles.rightContentWidget);
        });

        it("should have 'backgroundImageContainer' and 'staticBackground' class", () => {
          const playNew = renderPlayNew(playNewStaticProps);
          const pnBackgroundImage = playNew.querySelector(PN_BACKGROUND_IMAGE_CONTAINER);

          expect(pnBackgroundImage).toHaveClass(styles.backgroundImageContainer);
          expect(pnBackgroundImage).toHaveClass(styles.staticBackground);
        });

        it("should have 'logoImage' class", () => {
          const playNew = renderPlayNew(playNewStaticProps);
          const pnLogoImage = playNew.querySelector(PN_STATIC_LOGO_IMAGE);

          expect(pnLogoImage).toHaveClass(styles.staticLogoImage);
        });

        it("should have medium srcset on logo", () => {
          const playNew = renderPlayNew(playNewStaticProps);
          const pnLogoImage = playNew.querySelector(PN_STATIC_LOGO_IMAGE);
          const expected =
            "https://pma-s3.betfair.com/cdn-cgi/image/h=225,f=auto/media/english_uk/images/cpp/bf/2022/6/24/2022-06-24_12-11-03_563x563.png 225w, https://pma-s3.betfair.com/cdn-cgi/image/h=350,f=auto/media/english_uk/images/cpp/bf/2022/6/24/2022-06-24_12-11-03_563x563.png 350w, https://pma-s3.betfair.com/cdn-cgi/image/h=500,f=auto/media/english_uk/images/cpp/bf/2022/6/24/2022-06-24_12-11-03_563x563.png 500w, https://pma-s3.betfair.com/cdn-cgi/image/h=700,f=auto/media/english_uk/images/cpp/bf/2022/6/24/2022-06-24_12-11-03_563x563.png 700w, https://pma-s3.betfair.com/cdn-cgi/image/h=900,f=auto/media/english_uk/images/cpp/bf/2022/6/24/2022-06-24_12-11-03_563x563.png 900w";
          expect(pnLogoImage.getAttribute("srcset")).toBe(expected);
        });

        it("should have 'moreInfoLink' class", () => {
          const playNew = renderPlayNew(playNewStaticProps);
          const pnMoreInfoLink = playNew.querySelector(PN_MORE_INFO_LINK);

          expect(pnMoreInfoLink).toHaveClass(styles.moreInfoLink);
          expect(pnMoreInfoLink).toHaveTextContent("More info");
        });
      });
    });

    describe("Active state", () => {
      const activeStateProps = {
        ...playNewStaticProps,
        isStaticPromo: false,
        timer: null,
      };

      it("should not call Timer component", () => {
        renderPlayNew(activeStateProps);
        expect(Timer).toHaveBeenCalledTimes(0);
      });

      it("should have play new badge", () => {
        const playNew = renderPlayNew(activeStateProps);
        const pnBadge = playNew.querySelector(PN_BADGE);

        expect(pnBadge).toHaveClass(styles.gameBadgeContainer);
      });

      it("should have 'backgroundImageContainer' and 'activeBackground' class", () => {
        const playNew = renderPlayNew(activeStateProps);
        const pnBackgroundImage = playNew.querySelector(PN_BACKGROUND_IMAGE_CONTAINER);

        expect(pnBackgroundImage).toHaveClass(styles.backgroundImageContainer);
        expect(pnBackgroundImage).toHaveClass(styles.activeBackground);
      });
    });
  });
});
