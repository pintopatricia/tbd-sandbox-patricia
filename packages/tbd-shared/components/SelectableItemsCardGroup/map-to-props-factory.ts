import { MapStateToPropsFactory } from "react-redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import URN from "@ppb/tbd-store/state/layout/URN";
import { createCardGroupByURNSelector } from "@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors";
import {
  FETCH_CARDS,
  FETCH_FILTERED_SELECTABLE_ITEMS,
  FetchCardsAction,
  FetchFilteredSelectableItemsAction,
} from "@ppb/tbd-store/actions/catalogue";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import {
  SelectableItemsCardGroupEdge,
  SelectableItemsCardGroups,
  SelectableItemsFilter,
  SelectableItemsFilterOptions,
} from "@ppb/tbd-store/state/layout/cardgroups/CardGroup.types";
import { SelectableItem, SegmentedControlProps } from "@ppb/the-wall-common/types";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import {
  NextRacesFilterClickAction,
  NextRacesRaceClick,
  StatisticsItemClickAction,
  UI__NEXT_RACES_RACE_CLICK,
  UI__NEXT_RACES_RACE_FILTER_CLICK,
  UI__STATISTICS_ITEM_CLICK,
} from "@ppb/tbd-store/actions/interface";
import { createShallowEqualSelector } from "@ppb/tbd-store/helpers/selectors";
import { Selector } from "reselect";
import { createSelectableItems } from "../../view-model-factories/selectableitems-cardgroup";
import { i18n } from "../../helpers/i18n";

export type ContainerProps = {
  urn: URN;
  visible?: boolean;
};

export type SelectableItemsCardGroupProps = {
  title?: string;
  isHighlighted: boolean;
  selectableItems: SelectableItem[];
  cardGroupItems: SelectableItemsCardGroupEdge[];
  filterProps?: SegmentedControlProps;
  hasItemRotation: boolean;
};

export type StateProps = SelectableItemsCardGroupProps | Record<string, never>;

const FILTER_TRANSLATION_KEYS: { [index: string]: string } = {
  UkAndIre: i18n({ key: "I18N.UK_AND_IRE" }),
  AllCountries: i18n({ key: "I18N.ALL_COUNTRIES" }),
};

const createFilterPropsViewModel = (): Selector<SelectableItemsFilter, SegmentedControlProps> =>
  createShallowEqualSelector(
    [
      (selectableItemsFilter: SelectableItemsFilter) => selectableItemsFilter.countries,
      (selectableItemsFilter: SelectableItemsFilter) => selectableItemsFilter.defaultCountry,
      (selectableItemsFilter: SelectableItemsFilter) => selectableItemsFilter.selectedOption,
    ],
    (countries, defaultCountry, selectedOption) => ({
      options: countries.map((country) => ({
        key: country,
        value: FILTER_TRANSLATION_KEYS[country],
      })),
      selectedOption: selectedOption || defaultCountry,
    }),
  );

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getSelectableItemsCardGroupByURN = createCardGroupByURNSelector<SelectableItemsCardGroups, URN>();
  const getSelectableItems = createSelectableItems();
  const getUserDetailsSelector = createGetCountryLocalCurrencyCodeSelector();
  const getFilterPropsSelector = createFilterPropsViewModel();

  return function mapStateToProps(state: ApplicationState, { urn }: ContainerProps): StateProps {
    const selectableitemscardgroup = getSelectableItemsCardGroupByURN(
      state.layouts.cardgroups.selectableitemscardgroups,
      urn,
    );

    if (!selectableitemscardgroup || !selectableitemscardgroup.items.length) {
      return {};
    }

    const { title, isHighlighted, items, filter } = selectableitemscardgroup;

    const userDetails = <UserDetails>getUserDetailsSelector(state);
    const selectableItems = getSelectableItems(items, userDetails);

    const filterProps = filter ? getFilterPropsSelector(filter) : undefined;
    const hasItemRotation = items.some((item) => item.typename === "VirtualCardGroup");

    return {
      title,
      isHighlighted,
      selectableItems,
      cardGroupItems: items,
      filterProps,
      hasItemRotation,
    };
  };
};

const dispatchRaceClick = (cardUrn: string): NextRacesRaceClick => ({
  type: UI__NEXT_RACES_RACE_CLICK,
  payload: { cardUrn },
});

const dispatchStatisticsItemClick = (label: string): StatisticsItemClickAction => ({
  type: UI__STATISTICS_ITEM_CLICK,
  payload: { label },
});

const dispatchNextRacesFilterClick = (label: string): NextRacesFilterClickAction => ({
  type: UI__NEXT_RACES_RACE_FILTER_CLICK,
  payload: { label },
});

const dispatchFetchCardsAction = (urns: URN[]): FetchCardsAction => ({
  type: FETCH_CARDS,
  payload: {
    urns,
  },
});

const dispatchFetchFilteredSelectableItems = (
  urn: URN,
  country: SelectableItemsFilterOptions,
): FetchFilteredSelectableItemsAction => ({
  type: FETCH_FILTERED_SELECTABLE_ITEMS,
  payload: {
    urn,
    filterBy: {
      country,
    },
  },
});

export type DispatchProps = {
  dispatchFetchCardsAction: typeof dispatchFetchCardsAction;
  dispatchRaceClick: typeof dispatchRaceClick;
  dispatchStatisticsItemClick: typeof dispatchStatisticsItemClick;
  dispatchNextRacesFilterClick: typeof dispatchNextRacesFilterClick;
  dispatchFetchFilteredSelectableItems: typeof dispatchFetchFilteredSelectableItems;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchFetchCardsAction,
  dispatchRaceClick,
  dispatchStatisticsItemClick,
  dispatchNextRacesFilterClick,
  dispatchFetchFilteredSelectableItems,
};
