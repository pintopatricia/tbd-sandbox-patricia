import { MapStateToPropsFactory } from "react-redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import URN from "@ppb/tbd-store/state/layout/URN";
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { getJackpotByURN, createJackpotItemsSelector } from "@ppb/tbd-store/state/entities/jackpots/jackpot-selectors";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { GamingJackpotCards } from "@ppb/tbd-store/state/layout/cards/Card.types";
import { JackpotProps, JackpotState, JackpotWithType } from "@ppb/tbd-store/state/entities/Gaming.types";
import { UserDetails, UserDetailsState } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import {
  SUBSCRIBE_JACKPOT,
  UNSUBSCRIBE_JACKPOT,
  SubscribeJackpotAction,
  UnsubscribeJackpotAction,
} from "@ppb/tbd-store/actions/catalogue";
import { JackpotMerchandiseView, UI__JACKPOT_MERCHANDISE_VIEW } from "@ppb/tbd-store/actions/game-interactions";
import { currencyFormatWithoutDecimalPlaces } from "../../formatters/currency-formatters";
import { formatTime } from "../../helpers/dates";
import { i18n } from "../../helpers/i18n";
import { CurrencyUserDetails } from "../../formatters/formatters";

export type ContainerProps = {
  urn: URN;
};

export type CardProps = {
  state: JackpotState;
  name: string;
  logoUrl: string;
  items: JackpotProps[];
  userDetails: UserDetailsState;
};

export type StateProps = CardProps | Record<string, never>;

// This type is used for the jackpots orderings.
// TIME_BASED jackpots first -> VALUE_BASED -> PROGRESSIVE
enum JackpotType {
  TIME_BASED = "A",
  VALUE_BASED = "B",
  PROGRESSIVE = "C",
}

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getGamingJackpotCardByURN = createCardByURNSelector<GamingJackpotCards, URN>();
  const getJackpotItemsFormatted = createJackpotItemsSelector();
  const getUserDetailsSelector = createGetCountryLocalCurrencyCodeSelector();

  return function mapStateToProps(state: ApplicationState, { urn }: ContainerProps): StateProps {
    try {
      const card = getGamingJackpotCardByURN(state.layouts.cards.gamingjackpots, urn);
      if (!card) {
        return {};
      }

      const userDetails = <UserDetails>getUserDetailsSelector(state);
      const { localeCodeBcp47, timezone } = userDetails;

      let jackpotMerchandiseState: JackpotState = "COLD";
      const jackpotItems: JackpotWithType[] = [];

      card.jackpots.forEach((jackpotUrn) => {
        const jackpot = getJackpotByURN(state.entities.jackpots, jackpotUrn);

        if (jackpot) {
          let jackpotDescription = "";
          let jackpotType = JackpotType.PROGRESSIVE;
          if (jackpot.dropText) {
            jackpotDescription = jackpot.dropText;
          } else if (jackpot.dropValue) {
            const formatedValue = currencyFormatWithoutDecimalPlaces({
              ...(<CurrencyUserDetails>userDetails),
              value: jackpot.dropValue,
            });
            jackpotDescription = `${i18n({ key: "I18N.JACKPOT.DROP_BEFORE" })} ${formatedValue}`;
            jackpotType = JackpotType.VALUE_BASED;
          } else if (jackpot.dropTime) {
            jackpotDescription = `${i18n({ key: "I18N.JACKPOT.DROP_BY" })} ${formatTime(
              new Date(jackpot.dropTime),
              localeCodeBcp47,
              timezone,
            )}`;
            jackpotType = JackpotType.TIME_BASED;
          }
          const jackpotState = jackpot.state;

          const jackpotData: JackpotWithType = {
            type: jackpotState === "HOT" ? jackpotType : `CC`,
            props: {
              title: jackpot.name,
              value: jackpot.value.toString(),
              description: jackpotDescription,
              state: jackpotState,
              progress: jackpot.progress,
            },
          };

          if (jackpot.state === "HOT") {
            jackpotMerchandiseState = "HOT";
            jackpotItems.unshift(jackpotData);
          } else {
            jackpotItems.push(jackpotData);
          }
        }
      });

      return {
        state: jackpotMerchandiseState,
        name: card.name,
        logoUrl: card.logo,
        items: getJackpotItemsFormatted(jackpotItems),
        userDetails,
      };
    } catch (e) {
      console.error(e);

      return {};
    }
  };
};

const dispatchSubscribeJackpot = (urn: URN): SubscribeJackpotAction => ({
  type: SUBSCRIBE_JACKPOT,
  payload: { urn },
});

const dispatchUnsubscribeJackpot = (urn: URN): UnsubscribeJackpotAction => ({
  type: UNSUBSCRIBE_JACKPOT,
  payload: { urn },
});

const dispatchJackpotMerchandiseView = (
  state: JackpotState,
  name: string,
  urn: URN,
  elementText: string,
): JackpotMerchandiseView => ({
  type: UI__JACKPOT_MERCHANDISE_VIEW,
  payload: {
    state: state === "HOT" ? "hot" : "normal",
    name,
    urn,
    elementText,
  },
});

export type DispatchProps = {
  dispatchSubscribeJackpot: typeof dispatchSubscribeJackpot;
  dispatchUnsubscribeJackpot: typeof dispatchUnsubscribeJackpot;
  dispatchJackpotMerchandiseView: typeof dispatchJackpotMerchandiseView;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchSubscribeJackpot,
  dispatchUnsubscribeJackpot,
  dispatchJackpotMerchandiseView,
};
