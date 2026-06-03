import "jest-dom/extend-expect";
import { render, act } from "@testing-library/react";
import GamingPlayNewCard from "./GamingPlayNewCard.web";
import { getImagePath } from "../../view-model-factories/game.web";
import { getPromoUrlWithReturnURL } from "../../helpers/promotion-helper";
import { getEndpoint } from "../../config/endpoints";
import { PlayNew } from "./snowflakes/PlayNew/PlayNew.web";

jest.mock("./snowflakes/PlayNew/PlayNew.web", () => ({
  PlayNew: jest.fn(() => <play-new-mock />),
}));

jest.mock("../../config/endpoints", () => ({
  getEndpoint: jest.fn((endpoint) => endpoint),
}));

jest.mock("../../helpers/promotion-helper", () => ({
  getPromoUrlWithReturnURL: jest.fn((url) => `${url}?returnURL`),
}));

const mocki18n = {
  i18n: {
    playNowLabel: "I18N.PLAY_NEW.PLAY_NOW",
    badgeLabel: "I18N.PLAY_NEW.PLAY_NEW",
    moreInfoLabel: "I18N.PLAY_NEW.T&C",
    hoursLabel: "I18N.PLAY_NEW.HOURS",
    minutesLabel: "I18N.PLAY_NEW.MINUTES",
  },
};

const mockTimer = {
  hours: {
    label: mocki18n.i18n.hoursLabel,
    value: [2, 3],
  },
  minutes: {
    label: mocki18n.i18n.minutesLabel,
    value: [5, 9],
  },
};

jest.mock("../../view-model-factories/game.web", () => ({
  getImagePath: jest.fn().mockReturnValue("fakeImagePath"),
}));

function setup({
  urn = "urn",
  title = "Title mock",
  subtitle = "Subtitle mock",
  backgroundImage = "fakeBackgroundImagePath",
  logoImage = "fakeLogoImagePath",
  termsAndConditions = { url: "url" },
  optState,
  isStaticPromo = false,
  isExceededTime = true,
  hours = 23,
  minutes = 59,
  translations = mocki18n,
  dispatchGamingPlayNewLoaded = jest.fn(() => {}),
  dispatchClickToMoreInfoButtonAction = jest.fn(() => {}),
  dispatchClickToPlayNowButtonAction = jest.fn(() => {}),
  promotionsCDN,
  pmas3PromotionsCDN,
}) {
  return render(
    <GamingPlayNewCard
      urn={urn}
      title={title}
      subtitle={subtitle}
      backgroundImage={backgroundImage}
      logoImage={logoImage}
      termsAndConditions={termsAndConditions}
      optInState={optState}
      isStaticPromo={isStaticPromo}
      isExceededTime={isExceededTime}
      hours={hours}
      minutes={minutes}
      translations={translations}
      dispatchGamingPlayNewLoaded={dispatchGamingPlayNewLoaded}
      dispatchClickToMoreInfoButtonAction={dispatchClickToMoreInfoButtonAction}
      dispatchClickToPlayNowButtonAction={dispatchClickToPlayNowButtonAction}
      promotionsCDN={promotionsCDN}
      pmas3PromotionsCDN={pmas3PromotionsCDN}
    />,
  );
}

jest.useFakeTimers();

describe("GamingPlayNewCard component", () => {
  const setTimeoutSpy = jest.spyOn(global, "setTimeout");
  const clearTimeoutSpy = jest.spyOn(global, "clearTimeout");

  beforeEach(() => {
    setTimeoutSpy.mockClear();
    clearTimeoutSpy.mockClear();
    jest.clearAllMocks();
  });

  describe("when initializing the component", () => {
    const promotionsCDN = getEndpoint("PROMOTIONS_CDN");
    const pmas3PromotionsCDN = getEndpoint("PMA_S3_PROMOTIONS_CDN");

    it("should initialize GamingPlayNewCard component with the correct props", () => {
      getImagePath.mockReturnValue("fakeImagePath");
      setup({});

      expect(PlayNew).toHaveBeenCalledWith(
        {
          isStaticPromo: false,
          title: "Title mock",
          subtitle: "Subtitle mock",
          moreInfoLabel: "I18N.PLAY_NEW.T&C",
          buttonLabel: "I18N.PLAY_NEW.PLAY_NOW",
          timer: mockTimer,
          logoImage: "fakeLogoImagePath",
          backgroundImage: "fakeBackgroundImagePath",
          targetUrl: "url?returnURL",
          arrowImage: "fakeImagePath",
          badgeLabel: "I18N.PLAY_NEW.PLAY_NEW",
          onMoreInfoClick: expect.any(Function),
          onPlayNowClick: expect.any(Function),
          promotionsCDN,
          pmas3PromotionsCDN,
        },
        undefined,
      );
      expect(PlayNew).toHaveBeenCalledTimes(1);
    });

    it("should initialize GamingPlayNewCard component with the correct props when there is an pre-campaign state", () => {
      setup({
        isStaticPromo: true,
      });

      expect(PlayNew).toHaveBeenCalledWith(
        {
          isStaticPromo: true,
          title: "Title mock",
          subtitle: "Subtitle mock",
          moreInfoLabel: "I18N.PLAY_NEW.T&C",
          buttonLabel: "I18N.PLAY_NEW.PLAY_NOW",
          timer: mockTimer,
          logoImage: "fakeLogoImagePath",
          backgroundImage: "fakeBackgroundImagePath",
          targetUrl: "url?returnURL",
          arrowImage: "fakeImagePath",
          badgeLabel: "I18N.PLAY_NEW.PLAY_NEW",
          onMoreInfoClick: expect.any(Function),
          onPlayNowClick: expect.any(Function),
          promotionsCDN,
          pmas3PromotionsCDN,
        },
        undefined,
      );
      expect(PlayNew).toHaveBeenCalledTimes(1);
    });

    it("should call setTimeout when the promotion is static", () => {
      setup({
        isStaticPromo: true,
        isExceededTime: false,
      });

      act(() => jest.advanceTimersByTime(0));

      expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 60000);
    });
  });

  describe("when performing interactions", () => {
    describe("onMoreInfoClick", () => {
      it("should call dispatchClickToMoreInfoButtonAction with the correct payload", () => {
        const spy = jest.fn();
        setup({
          dispatchClickToMoreInfoButtonAction: spy,
          dispatchClickToPlayNowButtonAction: jest.fn(() => {}),
          dispatchGamingPlayNewLoaded: jest.fn(() => {}),
        });
        const { onMoreInfoClick } = PlayNew.mock.calls[0][0];
        onMoreInfoClick();
        expect(spy).toHaveBeenCalledWith("url?returnURL", "urn", false);
        expect(getPromoUrlWithReturnURL).toHaveBeenCalledWith("url", "http://localhost/");
      });
    });

    describe("onPlayNowClick", () => {
      it("should call dispatchClickToPlayNowButtonAction with the correct payload", () => {
        const spy = jest.fn();
        setup({
          dispatchClickToMoreInfoButtonAction: jest.fn(() => {}),
          dispatchClickToPlayNowButtonAction: spy,
          dispatchGamingPlayNewLoaded: jest.fn(() => {}),
        });
        const { onPlayNowClick } = PlayNew.mock.calls[0][0];
        onPlayNowClick();
        expect(spy).toHaveBeenCalledWith("url?returnURL", "urn");
        expect(getPromoUrlWithReturnURL).toHaveBeenCalledWith("url", "http://localhost/");
      });
    });

    describe("should call dispatchGamingPlayNewLoaded", () => {
      it("should dispatch an action when play new widget is loaded", () => {
        const spy = jest.fn();
        setup({
          dispatchClickToMoreInfoButtonAction: jest.fn(() => {}),
          dispatchClickToPlayNowButtonAction: jest.fn(() => {}),
          dispatchGamingPlayNewLoaded: spy,
        });

        expect(spy).toHaveBeenCalledWith("urn", false);
      });
    });
  });
});
