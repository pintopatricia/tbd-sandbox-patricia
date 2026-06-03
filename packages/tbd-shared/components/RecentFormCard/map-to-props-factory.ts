import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { RecentFormCards } from "@ppb/tbd-store/state/layout/cards/Card.types";
import URN from "@ppb/tbd-store/state/layout/URN";
import { RecentFormCaptionContentType } from "@ppb/the-wall-common/types";
import { MapStateToPropsFactory } from "react-redux";
import {
  FixtureOutcome,
  FixtureTeamSide,
  TeamForm,
  FootballFixture,
} from "@ppb/tbd-store/state/entities/football-fixture/FootballFixture.types";
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { createSelector } from "reselect";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { i18n } from "../../helpers/i18n";
import { formatFullDate } from "../../helpers/dates";
import { RecentFormDetailedI18n } from "./snowflakes/RecentFormDetailed/RecentFormDetailed.types";
import {
  RecentFormResultAlignment,
  RecentFormResultI18n,
  RecentFormResultProps,
} from "./snowflakes/RecentFormResult/RecentFormResult.types";

type OwnProps = {
  urn: URN;
};

type Translations = {
  recentFormDetailedTranslations: RecentFormDetailedI18n;
};

type RecentFormTeam = {
  detailed: RecentFormResultProps[];
};

export type ContainerProps = {
  urn: URN;
};

export type CardProps = {
  home?: RecentFormTeam;
  away?: RecentFormTeam;
  translations: Translations;
};
export type StateProps = CardProps | Record<string, never>;

function convertTeamFormToResult(
  teamForm: TeamForm[],
  translations: RecentFormResultI18n,
  alignment: RecentFormResultAlignment,
  userDetails: UserDetails,
): RecentFormResultProps[] {
  const { localeCodeBcp47, timezone } = userDetails;
  return teamForm.map<RecentFormResultProps>((item) => ({
    score: item.extraTimeScore ? item.extraTimeScore : item.score,
    isExtraTimeScore: item.extraTimeScore !== undefined,
    penaltyScore: item.penaltyShootoutScore ? item.penaltyShootoutScore : undefined,
    opponent: item.opponent,
    date: formatFullDate(new Date(item.startAt), localeCodeBcp47, timezone),
    side: item.side,
    outcome: FixtureOutcome[item.outcome],
    alignment,
    translations,
  }));
}

const createPropsForRecentFormVM = () =>
  createSelector(
    [(footballFixture: FootballFixture) => footballFixture, (_: FootballFixture, { userDetails }) => userDetails],
    (footballFixture, userDetails): StateProps => {
      const translations: Translations = {
        recentFormDetailedTranslations: {
          captionI18n: {
            [RecentFormCaptionContentType.W]: {
              leftLabel: i18n({ key: "I18N.RECENT_FORM.W" }),
              rightLabel: i18n({ key: "I18N.RECENT_FORM.WINNER" }),
            },
            [RecentFormCaptionContentType.D]: {
              leftLabel: i18n({ key: "I18N.RECENT_FORM.D" }),
              rightLabel: i18n({ key: "I18N.RECENT_FORM.DRAW" }),
            },
            [RecentFormCaptionContentType.L]: {
              leftLabel: i18n({ key: "I18N.RECENT_FORM.L" }),
              rightLabel: i18n({ key: "I18N.RECENT_FORM.LOSS" }),
            },
            [RecentFormCaptionContentType.A]: {
              leftLabel: i18n({ key: "I18N.RECENT_FORM.A" }),
              rightLabel: i18n({ key: "I18N.RECENT_FORM.AWAY" }),
            },
            [RecentFormCaptionContentType.H]: {
              leftLabel: i18n({ key: "I18N.RECENT_FORM.H" }),
              rightLabel: i18n({ key: "I18N.RECENT_FORM.HOME" }),
            },
            [RecentFormCaptionContentType.AET]: {
              leftLabel: i18n({ key: "I18N.RECENT_FORM.AET" }),
              rightLabel: i18n({ key: "I18N.RECENT_FORM.AFTER_EXTRA_TIME" }),
            },
            [RecentFormCaptionContentType.PEN]: {
              leftLabel: i18n({ key: "I18N.RECENT_FORM.PEN" }),
              rightLabel: i18n({ key: "I18N.RECENT_FORM.PENALTIES" }),
            },
          },
          recentFormResultI18n: {
            [RecentFormCaptionContentType.AET]: i18n({ key: "I18N.RECENT_FORM.AET" }),
            [RecentFormCaptionContentType.PEN]: i18n({ key: "I18N.RECENT_FORM.PEN" }),
            [FixtureOutcome.WIN]: i18n({ key: "I18N.RECENT_FORM.W" }),
            [FixtureOutcome.DRAW]: i18n({ key: "I18N.RECENT_FORM.D" }),
            [FixtureOutcome.LOSE]: i18n({ key: "I18N.RECENT_FORM.L" }),
            [FixtureTeamSide.HOME]: i18n({ key: "I18N.RECENT_FORM.H" }),
            [FixtureTeamSide.AWAY]: i18n({ key: "I18N.RECENT_FORM.A" }),
          },
        },
      };
      const { recentForm } = footballFixture;

      if (!recentForm?.home?.length && !recentForm?.away?.length) {
        return {};
      }

      const recentFormHome: RecentFormResultProps[] = convertTeamFormToResult(
        recentForm.home,
        translations.recentFormDetailedTranslations.recentFormResultI18n,
        RecentFormResultAlignment.RIGHT,
        userDetails,
      );
      const recentFormAway: RecentFormResultProps[] = convertTeamFormToResult(
        recentForm.away,
        translations.recentFormDetailedTranslations.recentFormResultI18n,
        RecentFormResultAlignment.LEFT,
        userDetails,
      );

      const homeTeam: RecentFormTeam = {
        detailed: recentFormHome,
      };

      const awayTeam: RecentFormTeam = {
        detailed: recentFormAway,
      };

      return {
        home: homeTeam,
        away: awayTeam,
        translations,
      };
    },
  );

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, OwnProps, ApplicationState> = () => {
  const getRecentFormCardByURN = createCardByURNSelector<RecentFormCards, URN>();
  const getPropsForRecentFormVM = createPropsForRecentFormVM();
  const getCountryLocalCurrencyCode = createGetCountryLocalCurrencyCodeSelector();

  return function mapStateToProps(state: ApplicationState, { urn }: OwnProps): StateProps {
    const card = getRecentFormCardByURN(state.layouts.cards.recentforms, urn);

    if (!card) {
      return {};
    }

    const footballFixture = state.entities.footballfixtures[card.fixture];

    if (!footballFixture) {
      return {};
    }
    const userDetails = <UserDetails>getCountryLocalCurrencyCode(state);

    return getPropsForRecentFormVM(footballFixture, { userDetails });
  };
};
