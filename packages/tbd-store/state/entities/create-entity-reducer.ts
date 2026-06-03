import {
  FetchCatalogueSuccessAction,
  FETCH_CATALOGUE_SUCCESS,
  SportsbookMarketsSuccessAction,
  NETWORK__SBK_MARKETS_SUCCESS,
} from "../../actions/catalogue";
import { TransformedLayout } from "../../services/catalogue/catalogue-types";
import URN from "../layout/URN";

type ActionTypes = FetchCatalogueSuccessAction | SportsbookMarketsSuccessAction;

/**
 * A type that must have an URN
 */
type URNTrait = { urn: URN };

type EntitiesMap<T> = { [urn: string]: T };

/**
 * Type guard to guarantee that we're dealing with an entity that has URN
 */
function isEntityTEntry<EntityType extends URNTrait>(entry: any): entry is EntityType[] {
  return !!(entry as EntityType[]) && !!entry.length && !entry.find((e: EntityType) => !e.urn);
}

export function reduceEntities<EntityType extends URNTrait>(
  currentState: undefined | EntitiesMap<EntityType>,
  payload: TransformedLayout,
  typename: keyof TransformedLayout["data"],
): EntitiesMap<EntityType> {
  const state = currentState || {};
  const entities = payload.data[typename] || [];

  if (!entities || !isEntityTEntry<EntityType>(entities)) {
    return state;
  }

  return entities.reduce<EntitiesMap<EntityType>>((acc, entity) => {
    const { urn } = entity;

    return {
      ...acc,
      [urn]: {
        ...state[urn],
        ...acc[urn],
        ...entity,
      },
    };
  }, state);
}

/**
 * Factory function to create a reducer that reacts to the
 * some catalogue requests (actions) and handles thoses responses
 * (entities data).
 */
export default function createEntitiesReducer<EntityType extends URNTrait>(
  typename: keyof TransformedLayout["data"],
): any {
  return (currentState: undefined | EntitiesMap<EntityType>, action: ActionTypes): EntitiesMap<EntityType> => {
    const state = currentState || {};

    switch (action.type) {
      case NETWORK__SBK_MARKETS_SUCCESS:
      case FETCH_CATALOGUE_SUCCESS: {
        return reduceEntities(state, action.payload, typename);
      }
      default:
        return state;
    }
  };
}
