import { MapStateToPropsFactory } from "react-redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import URN from "@ppb/tbd-store/state/layout/URN";
import { GamingPlayNewCards, PromotionTermsAndConditions } from "@ppb/tbd-store/state/layout/cards/Card.types";
import {
  LoadPlayNew,
  UI__PLAY_NEW_LOADED,
  PlayNewClickToMoreInfoButtonAction,
  UI__PLAY_NEW_MORE_INFO_BUTTON_CLICK,
  PlayNewClickToPlayNowButtonAction,
  UI__PLAY_NEW_PLAY_NOW_BUTTON_CLICK,
} from "@ppb/tbd-store/actions/navigation";
import { PromotionStatus } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import { getImagePath } from "../../view-model-factories/game.web";
import { i18n } from "../../helpers/i18n";

type Translations = {
  i18n: {
    playNowLabel: string;
    badgeLabel: string;
    moreInfoLabel: string;
    hoursLabel: string;
    minutesLabel: string;
  };
};

export type ContainerProps = {
  urn: URN;
};

export type StateProps =
  | {
      urn: URN;
      title: string;
      subtitle: string | null;
      backgroundImage: string | undefined;
      logoImage: string | null;
      termsAndConditions: PromotionTermsAndConditions | null;
      endDate?: string | null;
      isStaticPromo: boolean;
      isExceededTime: boolean;
      hours: number;
      minutes: number;
      translations: Translations;
    }
  | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getGamingPlayNewCardByURN = createCardByURNSelector<GamingPlayNewCards, URN>();
  return function mapStateToProps(state: ApplicationState, { urn }: ContainerProps): StateProps {
    try {
      const card = getGamingPlayNewCardByURN(state.layouts.cards.gamingplaynews, urn);

      if (!card || card.optInState === PromotionStatus.Completed) {
        return {};
      }

      const moreInfoMaxChars = 15;

      const translations = {
        i18n: {
          playNowLabel: i18n({ key: "I18N.PLAY_NEW.PLAY_NOW" }),
          badgeLabel: i18n({ key: "I18N.GAME_CARD.BADGE.NEW" }),
          moreInfoLabel: i18n({ key: "I18N.PLAY_NEW.T&C" })?.substring(0, moreInfoMaxChars),
          hoursLabel: i18n({ key: "I18N.PLAY_NEW.HOURS" }),
          minutesLabel: i18n({ key: "I18N.PLAY_NEW.MINUTES" }),
        },
      };

      const PLAY_NEW_TAGS = {
        STATIC: "styw-static",
        MECHANIC: "styw",
      };

      const cardEndDate = card.endDate ? card.endDate : "";
      const timeLeftInMs = new Date(cardEndDate).getTime() - Date.now();

      const isStaticPromo = (card.tags || []).some((tag) => tag === PLAY_NEW_TAGS.STATIC);
      const image = getImagePath("play-new-union");
      const timeLeftInSeconds = isStaticPromo ? timeLeftInMs / 1000 : 0;
      const isExceededTime = Math.floor(timeLeftInSeconds / 3600) >= 100;
      return {
        urn,
        title: card.title,
        subtitle: card.subtitle,
        backgroundImage: image,
        logoImage: card.logoImage[0] ? card.logoImage[0].url : null,
        termsAndConditions: card.termsAndConditions,
        isStaticPromo,
        isExceededTime,
        hours: isExceededTime ? 99 : Math.floor(timeLeftInSeconds / 3600),
        minutes: isExceededTime ? 59 : Math.floor((timeLeftInSeconds % 3600) / 60),
        translations,
      };
    } catch (e) {
      console.error(e);

      return {};
    }
  };
};

const dispatchGamingPlayNewLoaded = (urn: URN, isStaticPromo: boolean): LoadPlayNew => ({
  type: UI__PLAY_NEW_LOADED,
  payload: {
    urn,
    isStaticPromo,
  },
});

const dispatchClickToMoreInfoButtonAction = (
  viewLink: string,
  urn: URN,
  isStaticPromo: boolean,
): PlayNewClickToMoreInfoButtonAction => ({
  type: UI__PLAY_NEW_MORE_INFO_BUTTON_CLICK,
  payload: {
    viewLink,
    urn,
    isStaticPromo,
  },
});

const dispatchClickToPlayNowButtonAction = (viewLink: string, urn: URN): PlayNewClickToPlayNowButtonAction => ({
  type: UI__PLAY_NEW_PLAY_NOW_BUTTON_CLICK,
  payload: {
    viewLink,
    urn,
  },
});

export type DispatchProps = {
  dispatchGamingPlayNewLoaded: typeof dispatchGamingPlayNewLoaded;
  dispatchClickToMoreInfoButtonAction: typeof dispatchClickToMoreInfoButtonAction;
  dispatchClickToPlayNowButtonAction: typeof dispatchClickToPlayNowButtonAction;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchGamingPlayNewLoaded,
  dispatchClickToMoreInfoButtonAction,
  dispatchClickToPlayNowButtonAction,
};
