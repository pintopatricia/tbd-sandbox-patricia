import { FixtureTeamSide, FootballFixture } from "@ppb/tbd-store/state/entities/football-fixture/FootballFixture.types";
import { HeadToHeadCards } from "@ppb/tbd-store/state/layout/cards/Card.types";
import URN from "@ppb/tbd-store/state/layout/URN";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import {
  RecentFormCaptionContentType as CaptionContentType,
  RecentFormCaptionI18n as CaptionI18n,
  HeadToHeadResultI18N,
  HeadToHeadResultProps,
  HeadToHeadResultViewMode,
} from "@ppb/the-wall-common/types";
import { MapStateToPropsFactory } from "react-redux";
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { createSelector } from "reselect";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { formatFullDate } from "../../helpers/dates";
import { i18n } from "../../helpers/i18n";

export type ContainerProps = {
  urn: URN;
};

export type CardProps = {
  headToHeadProps: HeadToHeadResultProps[];
  captionTranslations: CaptionI18n;
};

export type StateProps = CardProps | Record<string, never>;

const createPropsForHeadToHeadVM = () =>
  createSelector(
    [
      (footballFixture: FootballFixture) => footballFixture,
      (_: FootballFixture, { localeCodeBcp47 }) => localeCodeBcp47,
      (_: FootballFixture, { timezone }) => timezone,
    ],
    (footballFixture, localeCodeBcp47, timezone): StateProps => {
      const { home, away } = footballFixture;
      const headToHeadProps: HeadToHeadResultProps[] = [];
      const captionI18n = {
        [CaptionContentType.W]: {
          leftLabel: i18n({ key: "I18N.CAPTION.W" }),
          rightLabel: i18n({ key: "I18N.CAPTION.WIN" }),
        },
        [CaptionContentType.L]: {
          leftLabel: i18n({ key: "I18N.CAPTION.L" }),
          rightLabel: i18n({ key: "I18N.CAPTION.LOSE" }),
        },
        [CaptionContentType.D]: {
          leftLabel: i18n({ key: "I18N.CAPTION.D" }),
          rightLabel: i18n({ key: "I18N.CAPTION.DRAW" }),
        },
        [CaptionContentType.H]: {
          leftLabel: i18n({ key: "I18N.CAPTION.H" }),
          rightLabel: i18n({ key: "I18N.CAPTION.HOME" }),
        },
        [CaptionContentType.A]: {
          leftLabel: i18n({ key: "I18N.CAPTION.A" }),
          rightLabel: i18n({ key: "I18N.CAPTION.AWAY" }),
        },
        [CaptionContentType.PEN]: {
          leftLabel: i18n({ key: "I18N.CAPTION.P" }),
          rightLabel: i18n({ key: "I18N.CAPTION.PENALTIES" }),
        },
        [CaptionContentType.AET]: {
          leftLabel: i18n({ key: "I18N.CAPTION.AET" }),
          rightLabel: i18n({ key: "I18N.CAPTION.AFTER_EXTRA_TIME" }),
        },
      };
      const headToHeadResultTranslations: HeadToHeadResultI18N = {
        penalties: i18n({ key: "I18N.HEAD_TO_HEAD.PENALTIES" }),
        aet: i18n({ key: "I18N.HEAD_TO_HEAD.AFTER_EXTRA_TIME" }),
      };

      footballFixture.head2head?.home?.forEach((element) => {
        const matchScore = element.extraTimeScore ? element.extraTimeScore : element.score;

        if (!matchScore) {
          return;
        }

        const finalScore = `${matchScore.home} - ${matchScore.away}`;

        let homeSide = home;
        let awaySide = away;

        if (element.side !== FixtureTeamSide.HOME) {
          homeSide = away;
          awaySide = home;
        }

        const result: HeadToHeadResultProps = {
          homeTeamName: homeSide?.name,
          awayTeamName: awaySide?.name,
          homeTeamCrest: homeSide?.crest?.vector || homeSide?.crest?.large,
          awayTeamCrest: awaySide?.crest?.vector || awaySide?.crest?.large,
          score: finalScore,
          i18n: headToHeadResultTranslations,
          viewMode: HeadToHeadResultViewMode.EXTENDED,
          afterExtraTime: element.extraTimeScore !== undefined,
        };

        if (element.startAt) {
          result.dateTime = new Date(element.startAt);
          result.date = formatFullDate(result.dateTime, localeCodeBcp47, timezone);
        }

        if (element.penaltyShootoutScore !== undefined) {
          result.penaltiesScore = `${element.penaltyShootoutScore.home} - ${element.penaltyShootoutScore.away}`;
        }

        headToHeadProps.push(result);
      });

      return {
        headToHeadProps,
        captionTranslations: captionI18n,
      };
    },
  );

/**
 * Map global state to component local state
 *
 * @returns A function that takes the application state and connected component urn and returns a component local state
 */
export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getHeadToHeadCardByURN = createCardByURNSelector<HeadToHeadCards, URN>();
  const getPropsForHeadToHeadVM = createPropsForHeadToHeadVM();
  const getCountryLocalCurrencyCode = createGetCountryLocalCurrencyCodeSelector();

  return function mapStateToProps(state: ApplicationState, { urn }: ContainerProps): StateProps {
    const card = getHeadToHeadCardByURN(state.layouts.cards.headtoheads, urn);

    if (!card) {
      return {};
    }

    const footballFixture = state.entities.footballfixtures[card.fixture];

    if (!footballFixture?.head2head?.home?.length) {
      return {};
    }

    const userDetails = <UserDetails>getCountryLocalCurrencyCode(state);

    const { localeCodeBcp47, timezone } = userDetails;

    return getPropsForHeadToHeadVM(footballFixture, { localeCodeBcp47, timezone });
  };
};
