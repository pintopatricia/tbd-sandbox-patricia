import { createSelector, OutputParametricSelector } from "reselect";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import {
  FutureRacingCardGroup,
  FutureRacingCardGroupPartialItem,
} from "@ppb/tbd-store/state/layout/cardgroups/future-racing-cardgroups/FutureRacingCardgroups.types";
import { formatDateWithMonth } from "../helpers/dates";

type FutureRacingGroup = {
  [date: string]: FutureRacingCardGroupPartialItem[];
};

type FutureRacingItems = {
  cardItems: CardItemProps[];
  urnList: FutureRacingCardGroupPartialItem[];
};

export type CardItemProps = {
  date: string;
  items: FutureRacingCardGroupPartialItem[];
};

export const createFutureRacingViewModel = (): OutputParametricSelector<
  FutureRacingCardGroup,
  UserDetails,
  FutureRacingItems,
  (card: FutureRacingCardGroup, userDetails: UserDetails) => FutureRacingItems
> =>
  createSelector(
    [(card: FutureRacingCardGroup) => card, (_: FutureRacingCardGroup, userDetails: UserDetails) => userDetails],

    (card: FutureRacingCardGroup, userDetails: UserDetails) => {
      const { items } = card;
      const { localeCodeBcp47, timezone } = userDetails;
      const groupedItems: FutureRacingGroup = items.reduce(
        (acc: FutureRacingGroup, curr: FutureRacingCardGroupPartialItem) => {
          const date = new Date(curr.date).toLocaleDateString();
          acc[date] = [...(acc[date] || []), curr];
          return acc;
        },
        {},
      );

      const cardItems: CardItemProps[] = Object.values(groupedItems).map(
        (item: FutureRacingCardGroupPartialItem[]) => ({
          date: item[0].date && formatDateWithMonth(new Date(item[0].date), localeCodeBcp47, timezone),
          items: item,
        }),
      );

      const urnList: FutureRacingCardGroupPartialItem[] = cardItems.reduce(
        (acc: FutureRacingCardGroupPartialItem[], item) => [...acc, ...item.items],
        [],
      );

      return { cardItems, urnList };
    },
  );
