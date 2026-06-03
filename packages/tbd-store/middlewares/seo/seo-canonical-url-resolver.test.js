import { resolveSeoCanonicalUrl } from "./seo-canonical-url-resolver";
import { getViewbyURN } from "../../state/layout/views/event-view/event-view-selectors";

jest.mock("../../state/layout/views/event-view/event-view-selectors");

let state;
let sportView;
const canonicalUrl =
  "/exchange/plus/en/soccer/uefa-women's-champions-league/gintra-(w)-v-valerenga-(w)-betting-30133495";

const setup = () => {
  sportView = {
    canonicalUrl,
    urn: "ppb:tbd:view:sport:1",
    typename: "SportView",
  };

  state = {
    entities: {},
    layouts: {},
    router: {
      currentUrn: sportView.urn,
    },
  };

  getViewbyURN.mockReturnValue(sportView);
};

describe("Seo Canonical Url Resolver", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setup();
  });

  describe("when current view has canonicalUrl", () => {
    it("should return correct canonicalUrl", () => {
      expect(resolveSeoCanonicalUrl(state, { SportView: [sportView] })).toEqual(canonicalUrl);
    });
  });

  describe("when the canonicalUrl is missing", () => {
    it("should return undefined", () => {
      delete sportView.canonicalUrl;

      expect(resolveSeoCanonicalUrl(state, { SportView: [sportView] })).toEqual(undefined);
    });
  });

  describe("when the current view URN is invalid", () => {
    it("should return undefined", () => {
      state.router.currentUrn = "";

      expect(resolveSeoCanonicalUrl(state, { SportView: [sportView] })).toEqual(undefined);
    });
  });
});
