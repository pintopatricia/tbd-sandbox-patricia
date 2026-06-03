import { APOLLO_MIGRATED_CARDS } from "../../../state/layout/cards/Card.types";
import { normalizers } from "./normalizer-config";

const allSupportedNormalizers = Object.keys(normalizers) as unknown as keyof typeof normalizers;

type GenericObject = Record<string, unknown>;
type FragmentWithEdges = { __typename: string; edges: Array<GenericObject> };

/**
 * Typeguard for objects
 */
export function isObject(value: unknown): value is GenericObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Typeguard for objects with a __typename property
 */
export function isObjectWithTypename(value: unknown): value is GenericObject & { __typename: string } {
  return isObject(value) && "__typename" in value;
}

/**
 * Typeguard for any object that has a normalizer associated with
 */
export function isNormalizable(value: unknown): value is GenericObject | unknown[] {
  return isObject(value) || Array.isArray(value);
}

/**
 * Typeguard that ensures that a value is a valid normalizer
 */
export function isValidTypename(value: string): value is typeof allSupportedNormalizers {
  // Only normalize if there is a normalizer for this typename
  return allSupportedNormalizers.includes(value);
}

export function isApolloMigratedCard(value: string): value is typeof allSupportedNormalizers {
  return APOLLO_MIGRATED_CARDS.includes(value);
}

/**
 * Typeguard to check if a fragment is an object with typename and edges array
 */
export const isFragmentWithEdges = (fragment: unknown): fragment is FragmentWithEdges =>
  isObjectWithTypename(fragment) && Array.isArray(fragment.edges) && fragment.edges.length > 0;

/**
 * Extract array of normalizable objects from a partial fragment
 */
export const getNormalizableObjectsFromPartial = (fragment: FragmentWithEdges): GenericObject[] =>
  fragment.edges
    .flatMap((edge) => (isObjectWithTypename(edge?.node) ? Object.values(edge.node) : []))
    .filter(isObjectWithTypename);

/**
 * Typeguard to check if a pebble card group is a normalizable partial
 */
const isPebbleCardgroupNormalizablePartial = (fragment: FragmentWithEdges): fragment is FragmentWithEdges =>
  fragment.edges.some((edge) => isObjectWithTypename(edge?.node) && edge.node.__typename === "PebbleCardGroup");

/**
 * Typeguard to check if a ExpandableMarketCard is a normalizable partial
 */
const isExpandableMarketCardNormalizablePartial = (fragment: FragmentWithEdges): fragment is FragmentWithEdges =>
  fragment.edges.some((edge) => isObjectWithTypename(edge?.node) && edge.node.__typename === "ExpandableMarketCard");

/**
 * Typeguard to check if a PopularSelectionsCard is a normalizable partial
 */
const isPopularSelectionsCardNormalizablePartial = (fragment: FragmentWithEdges): fragment is FragmentWithEdges =>
  fragment.edges.some((edge) => isObjectWithTypename(edge?.node) && edge.node.__typename === "PopularSelectionsCard");

/**
 * Typeguard for objects that are normalizable partials
 */
export function isNormalizablePartial(fragment: FragmentWithEdges): fragment is FragmentWithEdges {
  return (
    isPebbleCardgroupNormalizablePartial(fragment) ||
    isExpandableMarketCardNormalizablePartial(fragment) ||
    isPopularSelectionsCardNormalizablePartial(fragment)
  );
}

/**
 * Typeguard for partial fragments
 */
export function isPartial(fragmentKey: string) {
  return ["partials", "partialItems", "halfTimeSpecialsPartials"].includes(fragmentKey);
}

/**
 * Checks if the fragment only has typename and urn properties
 * This is used to filter out fragments that are not useful for normalization
 * A fragment must have more than one property
 * and if it has two, they must not be just __typename and urn
 */
export function isFragmentMinimal(fragment: GenericObject): boolean {
  const fragmentKeys = Object.keys(fragment);

  if (fragmentKeys.length > 2) {
    return true;
  }

  if (fragmentKeys.length === 2) {
    return !(fragmentKeys.includes("__typename") && fragmentKeys.includes("urn"));
  }

  return false;
}
