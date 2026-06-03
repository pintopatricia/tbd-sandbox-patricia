/* eslint-disable no-underscore-dangle */
import type {
  DisplayNameFragment,
  DisplayNameTitleFragment,
  PebbleCardGroupEnrichedPartialFragment,
  PebbleCardGroupFragment,
} from "../../../../../clients/catalogue/catalogue-response-types";
import type {
  PartialPebbleCardGroup,
  PebbleCardEdge,
  PebbleCardGroup,
} from "../../../../../state/layout/cardgroups/CardGroup.types";
import type { TransformedFragment } from "../../Normalizer.types";
import normalizeTranslatableTextFragmentIntoTranslatableText from "../../translatable-text/translatable-text-normalizer";

const normalizePebbleCardGroupEnrichedPartialFragmentIntoPartialPebbleCardGroup = ({
  __typename,
  urn,
  pebbleCardGroupTitle,
  pebbleExpanded,
  favouriteMarketsState,
}: PebbleCardGroupEnrichedPartialFragment): TransformedFragment<PartialPebbleCardGroup> => ({
  data: {
    typename: __typename,
    urn,
    title: pebbleCardGroupTitle
      ? normalizeTranslatableTextFragmentIntoTranslatableText(pebbleCardGroupTitle).data
      : undefined,
    pebbleExpanded,
    favouriteMarketsStateURN: favouriteMarketsState?.urn,
  },
});

const isDisplayNameTitle = (title: DisplayNameFragment): title is DisplayNameTitleFragment =>
  title.__typename === "DisplayNameTitle";

/**
 * Typeguard to check if a PebbleCardGroup is ready to be hydrated.
 * @param pebbleCardGroup The PebbleCardGroup fragment to check.
 */
const isPebbleCardGroupHydrated = (
  pebbleCardGroup: PebbleCardGroupFragment | PebbleCardGroupEnrichedPartialFragment,
): pebbleCardGroup is PebbleCardGroupFragment =>
  pebbleCardGroup.__typename === "PebbleCardGroup" && "partials" in pebbleCardGroup;

const normalizePebbleCardGroupFragmentIntoPebbleCardGroup = (
  pebbleCardGroup: PebbleCardGroupFragment | PebbleCardGroupEnrichedPartialFragment,
): TransformedFragment<PebbleCardGroup | PartialPebbleCardGroup> => {
  const partialPebbleCardGroup =
    normalizePebbleCardGroupEnrichedPartialFragmentIntoPartialPebbleCardGroup(pebbleCardGroup).data;

  if (isPebbleCardGroupHydrated(pebbleCardGroup)) {
    const { selectedItemUrn, pebbleCardGroupIcon, outerTitle, viewAll, viewOpenBets, partials } = pebbleCardGroup;

    return {
      data: {
        ...partialPebbleCardGroup,
        selectedItemUrn,
        icon: pebbleCardGroupIcon || undefined,
        outerTitle: outerTitle ? normalizeTranslatableTextFragmentIntoTranslatableText(outerTitle).data : undefined,
        viewAll: viewAll?.title
          ? {
              label: isDisplayNameTitle(viewAll.title) ? viewAll.title.name : viewAll.title.translationKey,
              viewLink: viewAll.viewLink,
            }
          : undefined,
        viewOpenBets: viewOpenBets || undefined,
        items: partials.edges.reduce((acc: PebbleCardEdge[], item) => {
          if (item && "urn" in item.node) {
            return [
              ...acc,
              {
                name: item.name || undefined,
                urn: item.node.urn,
                typename: item.node.__typename,
              },
            ];
          }

          return acc;
        }, []),
      },
    };
  }

  // If the fragment is a partial, we return a minimal object containing only the necessary properties to render the shell.
  return {
    data: partialPebbleCardGroup,
  };
};

export default normalizePebbleCardGroupFragmentIntoPebbleCardGroup;
