import { ProductsOption } from "../../../../../state/entities";

import { MaintenanceViewFragment, Product } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";
import { MaintenanceView } from "../../../../../state/layout/views/View.types";

const toProductOption = {
  [Product.Sportsbook]: ProductsOption.sportsbook,
  [Product.Exchange]: ProductsOption.exchange,
  [Product.Games]: ProductsOption.games,
} as const;

const normalizeMaintenanceViewFragmentIntoMaintenanceView = (
  maintenanceView: MaintenanceViewFragment,
): TransformedFragment<MaintenanceView> => {
  const { urn, url, redirectUrl, products, twitterUrl, __typename, xsellBar } = maintenanceView;

  return {
    data: {
      typename: __typename,
      urn,
      url,
      redirectUrl,
      xsellBar,
      products: products.map((p) => ({
        product: toProductOption[p.product],
        name: p.name.translate?.key || "",
        status: p.status,
        viewLink: p.viewLink,
      })),
      twitterUrl,
      items: [],
    },
  };
};

export default normalizeMaintenanceViewFragmentIntoMaintenanceView;
