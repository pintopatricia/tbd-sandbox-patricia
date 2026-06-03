/* eslint-disable no-underscore-dangle */
import { PartialItem } from "../../../../../state/layout/views/PartialItem.types";
import { TransformedFragment } from "../../Normalizer.types";
import { SettingsViewFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { SettingsView } from "../../../../../state/layout/views/View.types";

const normalizeSettingsViewFragmentIntoSettingsView = (
  settingsView: SettingsViewFragment,
): TransformedFragment<SettingsView> => {
  const { urn, settings, items, url, __typename, xsellBar } = settingsView;

  return {
    data: {
      typename: __typename,
      urn,
      url,
      items: items.edges.reduce((acc: PartialItem[], item) => {
        if (item?.node && "urn" in item.node) {
          return [
            ...acc,
            {
              urn: item.node.urn,
              typename: item.node.__typename,
            },
          ];
        }

        return acc;
      }, []),
      xsellBar,
      settings:
        settings?.map((item) => ({
          id: item.text,
          text: item.text,
          url: item.url,
        })) ?? [],
    },
  };
};

export default normalizeSettingsViewFragmentIntoSettingsView;
