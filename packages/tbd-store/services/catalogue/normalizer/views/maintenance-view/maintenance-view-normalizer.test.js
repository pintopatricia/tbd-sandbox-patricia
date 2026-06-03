import { ProductsOption } from "../../../../../state/entities";
import normalizeMaintenanceViewFragmentIntoMaintenanceView from "./maintenance-view-normalizer";
import { Product } from "../../../../../clients/catalogue/catalogue-response-types";

const BFF_RESPONSE = {
  __typename: "MaintenanceView",
  urn: "ppb:tbd:view:maintenance:maintenance",
  url: "maintenance-url",
  redirectUrl: "redirect-url",
  products: [
    {
      product: Product.Sportsbook,
      name: { translate: { key: "i18n.sbk" } },
      status: "OK",
      viewLink: { viewUrl: "sbk url", viewUrn: "sbk:urn" },
    },
    {
      product: Product.Exchange,
      name: { translate: null },
      status: "SPLASHED",
      viewLink: { viewUrl: "sbk url", viewUrn: "sbk:urn" },
    },
  ],
  twitterUrl: "twitter-url",
};

describe("Maintenance view normalizer", () => {
  describe("normalizeMaintenanceViewFragmentIntoMaintenanceView", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizeMaintenanceViewFragmentIntoMaintenanceView(BFF_RESPONSE);

      expect(data).toEqual({
        typename: "MaintenanceView",
        urn: "ppb:tbd:view:maintenance:maintenance",
        url: "maintenance-url",
        redirectUrl: "redirect-url",
        products: [
          {
            product: ProductsOption.sportsbook,
            name: "i18n.sbk",
            status: "OK",
            viewLink: { viewUrl: "sbk url", viewUrn: "sbk:urn" },
          },
          {
            product: ProductsOption.exchange,
            name: "",
            status: "SPLASHED",
            viewLink: { viewUrl: "sbk url", viewUrn: "sbk:urn" },
          },
        ],
        items: [],
        twitterUrl: "twitter-url",
      });
    });
  });
});
