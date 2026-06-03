import { MapStateToPropsFactory } from "react-redux";
import { createSelector, OutputParametricSelector } from "reselect";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import URN from "@ppb/tbd-store/state/layout/URN";
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { CorrectScoreCards } from "@ppb/tbd-store/state/layout/cards/Card.types";
import { ToggleShowMoreRunnersAction, UI__TOGGLE_SHOW_MORE_RUNNERS } from "@ppb/tbd-store/actions/interface";
import { createSportsbookMarketByURNSelector } from "@ppb/tbd-store/state/entities/sportsbook-markets/sportsbook-market-selectors";
import { SportsbookMarket } from "@ppb/tbd-store/state/entities/sportsbook-markets/SportsbookMarket.types";
import { i18n } from "../../helpers/i18n";

export type ContainerProps = {
  urn: URN;
  visible?: boolean;
};

export type CorrectScoreCardItem = {
  label: string;
  runnerUrn: URN;
  selectionId?: number;
};

export type CorrectScoreCardColumn = {
  label: string;
  runners: CorrectScoreCardItem[];
};

export type CardProps = {
  marketUrn: URN;
  numberOfItemsToDisplay: number;
  numberOfLines: number;
  columns: CorrectScoreCardColumn[];
};

export type StateProps = CardProps | Record<string, never>;

const createCorrectScoreCardColumns = (): OutputParametricSelector<
  ApplicationState,
  URN,
  CorrectScoreCardColumn[] | undefined,
  (card: SportsbookMarket) => CorrectScoreCardColumn[] | undefined
> => {
  const getSportsbookMarketByURN = createSportsbookMarketByURNSelector();

  return createSelector(
    [
      (state: ApplicationState, urn: URN): SportsbookMarket | undefined =>
        getSportsbookMarketByURN(state.entities.sportsbookmarkets, urn),
    ],
    (market) => {
      if (!market) {
        return undefined;
      }

      const col1: CorrectScoreCardItem[] = [];
      const col2: CorrectScoreCardItem[] = [];
      const col3: CorrectScoreCardItem[] = [];

      market?.runners.forEach((runner) => {
        const name = runner.name.trim().split("-");
        const homeTeam = parseInt(name[0], 10);
        const awayTeam = parseInt(name[1], 10);
        const runnerMapped = {
          label: runner.name,
          runnerUrn: runner.urn,
          selectionId: runner.selectionId,
        };

        if (homeTeam > awayTeam) {
          col1.push(runnerMapped);
        } else if (homeTeam < awayTeam) {
          col3.push(runnerMapped);
        } else {
          col2.push(runnerMapped);
        }
      });

      return [
        { label: i18n({ key: "I18N.CAPTION.HOME" }).toUpperCase(), runners: col1 },
        { label: i18n({ key: "I18N.CAPTION.DRAW" }).toUpperCase(), runners: col2 },
        { label: i18n({ key: "I18N.CAPTION.AWAY" }).toUpperCase(), runners: col3 },
      ];
    },
  );
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getCorrectScoreCardByURN = createCardByURNSelector<CorrectScoreCards, URN>();
  const getColumns = createCorrectScoreCardColumns();

  return function mapStateToProps(state: ApplicationState, { urn }: ContainerProps): StateProps {
    const card = getCorrectScoreCardByURN(state.layouts.cards.correctscorecards, urn);

    if (!card) {
      return {};
    }

    const columns = getColumns(state, card.market);

    if (!columns) {
      return {};
    }

    const columnSizes = columns.map((column) => column.runners.length).sort((a, b) => b - a);
    const numberOfLines = columnSizes[0];

    return {
      marketUrn: card.market,
      numberOfItemsToDisplay: card.numberOfItemsToDisplay || 5,
      columns,
      numberOfLines,
    };
  };
};

const dispatchToggleShowMoreRunners = (cardUrn: URN, showMore: boolean): ToggleShowMoreRunnersAction => ({
  type: UI__TOGGLE_SHOW_MORE_RUNNERS,
  payload: {
    cardUrn,
    showMore,
  },
});

export type DispatchProps = { dispatchToggleShowMoreRunners: typeof dispatchToggleShowMoreRunners };

export const mapDispatchToProps: DispatchProps = { dispatchToggleShowMoreRunners };
