import { PUSH } from "@ppb/tbd-store/actions/router";
import { UI__NAVIGATE_TO_GAMING_CATEGORY_USING_CATEGORY_LINK_CARD } from "@ppb/tbd-store/actions/navigation";

import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

const getGamingLinkCardByURN = jest.fn();

jest.mock("@ppb/tbd-store/state/layout/cards/cards-selectors", () => ({
  createCardByURNSelector: jest.fn(() => getGamingLinkCardByURN),
}));

const STATE = {
  layouts: {
    cards: {
      gaminglinks: { urn: "props" },
    },
  },
};

describe("mapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  it("should return props when card exist", () => {
    getGamingLinkCardByURN.mockReturnValue({
      games: [],
      link: {
        label: "New Games",
        viewLink: {
          viewUrn: "viewUrnMock",
          viewUrl: "viewUrlMock",
        },
      },
    });

    const mapStateToProps = makeMapStateToProps();

    const props = mapStateToProps(STATE, { urn: "ppb:tbd:card:gamingLink:1" });

    expect(getGamingLinkCardByURN).toHaveBeenCalledWith({ urn: "props" }, "ppb:tbd:card:gamingLink:1");
    expect(props).toEqual({
      name: "New Games",
      games: [],
      viewLink: {
        viewUrn: "viewUrnMock",
        viewUrl: "viewUrlMock",
      },
      icon: "GAMES",
      zoneTitle: "",
    });
  });

  it("should return props when card Title exist", () => {
    getGamingLinkCardByURN.mockReturnValue({
      games: [],
      link: {
        label: "New Games",
        viewLink: {
          viewUrn: "viewUrnMock",
          viewUrl: "viewUrlMock",
        },
      },
    });

    const mapStateToProps = makeMapStateToProps();

    const props = mapStateToProps(STATE, { urn: "ppb:tbd:card:gamingLink:1", moduleTitle: "test" });

    expect(getGamingLinkCardByURN).toHaveBeenCalledWith({ urn: "props" }, "ppb:tbd:card:gamingLink:1");
    expect(props).toEqual({
      name: "New Games",
      games: [],
      viewLink: {
        viewUrn: "viewUrnMock",
        viewUrl: "viewUrlMock",
      },
      icon: "GAMES",
      zoneTitle: "test",
    });
  });

  it("should return an empty object when card does not exist", () => {
    getGamingLinkCardByURN.mockReturnValue(null);

    const mapStateToProps = makeMapStateToProps();

    const props = mapStateToProps(STATE, { urn: "ppb:tbd:card:gamingLink:1" });

    expect(getGamingLinkCardByURN).toHaveBeenCalledWith({ urn: "props" }, "ppb:tbd:card:gamingLink:1");
    expect(props).toEqual({});
  });

  it("should return the number of newly released games correctly", () => {
    getGamingLinkCardByURN.mockReturnValue({
      games: [{ uid: "testUid", releaseDate: new Date(Date.now()) }],
      link: {},
    });

    const mapStateToProps = makeMapStateToProps();
    const props = mapStateToProps(STATE, { urn: "ppb:tbd:card:gamingLink:1" });

    expect(props.games).toEqual(["testUid"]);
  });
});

describe("mapDispatchToProps", () => {
  describe("dispatchNavigateToGameCategoryViewAction", () => {
    const { dispatchNavigateToGameCategoryViewAction } = mapDispatchToProps;
    const viewLink = { viewUrn: "urn", viewUrl: "url/fake" };
    const cardUrn = "URN";
    const module = "module1";
    describe("when have got a title", () => {
      it("should dispatch navigate to game category view action", () => {
        const title = "title";

        expect(dispatchNavigateToGameCategoryViewAction(viewLink, cardUrn, module, title)).toEqual({
          type: UI__NAVIGATE_TO_GAMING_CATEGORY_USING_CATEGORY_LINK_CARD,
          payload: {
            cardType: "GamingLinkCard",
            href: "url/fake",
            categoryName: "title",
            viewUrn: "urn",
            cardUrn: "URN",
            module: "module1",
          },
        });
      });
    });

    describe("when have not got a title", () => {
      it("should dispatch navigate to game category view action", () => {
        expect(dispatchNavigateToGameCategoryViewAction(viewLink, cardUrn, module)).toEqual({
          type: UI__NAVIGATE_TO_GAMING_CATEGORY_USING_CATEGORY_LINK_CARD,
          payload: {
            cardType: "GamingLinkCard",
            href: "url/fake",
            categoryName: "",
            viewUrn: "urn",
            cardUrn: "URN",
            module: "module1",
          },
        });
      });
    });
  });

  describe("dispatchPushAction", () => {
    it("should dispatch push action", () => {
      const { dispatchPushAction } = mapDispatchToProps;

      expect(dispatchPushAction({ viewUrn: "urn", viewUrl: "url/fake" })).toEqual({
        type: PUSH,
        payload: { viewUrn: "urn", viewUrl: "url/fake" },
      });
    });
  });
});
