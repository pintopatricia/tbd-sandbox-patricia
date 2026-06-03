import {
  DeleteLayoutAction,
  FetchCatalogueSuccessAction,
  DELETE_LAYOUT,
  FETCH_CATALOGUE_SUCCESS,
  DELETE_VIEW_ITEMS,
  DeleteViewItems,
} from "../../../../actions";
import { ObbCardGroups } from "../CardGroup.types";
import { APOLLO_MIGRATED_CARDS } from "../../cards/Card.types";
import {
  OBB_CARD_GROUP__LAYOUT_SELECTION,
  OBB_CARD_GROUP__SET_FILTER,
  ObbCardGroupSetFilterAction,
  ObbCardGroupLayoutSelectionAction,
  OBB_CARD_GROUP__SECTION_TOGGLED,
  ObbCardGroupSectionToggledAction,
} from "../../../../actions/obb";

const INITIAL_STATE: ObbCardGroups = {};

type ActionTypes =
  | FetchCatalogueSuccessAction
  | DeleteLayoutAction
  | DeleteViewItems
  | ObbCardGroupSetFilterAction
  | ObbCardGroupSectionToggledAction
  | ObbCardGroupLayoutSelectionAction;

const deleteCardGroupSections = (
  state: ObbCardGroups,
  cardGroupsUrns: string[],
  sectionsUrnsToDelete: string[],
): ObbCardGroups =>
  cardGroupsUrns.reduce(
    (acc: ObbCardGroups, cardGroupUrn) => ({
      ...acc,
      [cardGroupUrn]: {
        ...acc[cardGroupUrn],
        sections: acc[cardGroupUrn].sections.filter(
          ({ urn, typename: type }) => !sectionsUrnsToDelete.includes(urn) || APOLLO_MIGRATED_CARDS.includes(type),
        ),
      },
    }),
    state,
  );

export default (currentState: undefined | ObbCardGroups, action: ActionTypes): ObbCardGroups => {
  const state = currentState || INITIAL_STATE;

  switch (action.type) {
    case FETCH_CATALOGUE_SUCCESS: {
      const obbCardGroups = action.payload.data.ObbCardGroup || [];

      return obbCardGroups.reduce<ObbCardGroups>(
        (acc, obbCardGroup) => ({
          ...acc,
          [obbCardGroup.urn]: {
            ...state[obbCardGroup.urn],
            ...obbCardGroup,
          },
        }),
        state,
      );
    }

    case DELETE_VIEW_ITEMS: {
      const sectionsUrnsToDelete = action.payload;

      return deleteCardGroupSections(state, Object.keys(state), sectionsUrnsToDelete);
    }

    case DELETE_LAYOUT: {
      return {};
    }

    case OBB_CARD_GROUP__SET_FILTER: {
      const { selectedFilter, urn } = action.payload;
      const cardGroup = state[urn];
      if (!cardGroup) {
        return state;
      }
      return { ...state, [urn]: { ...cardGroup, selectedFilter } };
    }

    case OBB_CARD_GROUP__LAYOUT_SELECTION: {
      const { urn, sectionUrn, layoutUrn } = action.payload;
      const cardGroup = state[urn];

      if (!cardGroup) {
        return state;
      }

      const sections = cardGroup.sections.map((section) => {
        if (section.urn !== sectionUrn) {
          return section;
        }

        return {
          ...section,
          layouts: section.layouts.map((layout) => ({
            ...layout,
            isSelected: layout.urn === layoutUrn,
          })),
        };
      });

      return {
        ...state,
        [urn]: {
          ...cardGroup,
          sections,
        },
      };
    }

    case OBB_CARD_GROUP__SECTION_TOGGLED: {
      const { cardGroupUrn, sectionUrn, isOpen } = action.payload;
      const cardGroup = state[cardGroupUrn];
      const selectedFilter = state[cardGroupUrn].selectedFilter ?? "ALL";

      /*
       * We need to maintain the state of collapsed/expanded sections for each selected filter tag, so it gets
       * persisted between navigations
       * Instead of having copies of the sections state for each filter, we define some overrides for each filter
       * Hopefully this makes it easier to normalize sections in the store in the future
       * These overrides are read by the component when deciding how to render the sections
       *
       * Logic:
       *   - if filter === ALL, modify the state directly
       *   - else, define these overrides
       */
      if (selectedFilter === "ALL") {
        return {
          ...state,
          [cardGroupUrn]: {
            ...cardGroup,
            sections: cardGroup.sections.map((section) => {
              if (section.urn === sectionUrn) {
                return {
                  ...section,
                  isExpanded: isOpen,
                };
              }
              return section;
            }),
          },
        };
      }
      return {
        ...state,
        [cardGroupUrn]: {
          ...cardGroup,
          sectionExpansionOverrideByFilter: {
            ...cardGroup.sectionExpansionOverrideByFilter,
            [selectedFilter]: {
              ...cardGroup.sectionExpansionOverrideByFilter[selectedFilter],
              [sectionUrn]: isOpen,
            },
          },
        },
      };
    }

    default:
      return state;
  }
};
