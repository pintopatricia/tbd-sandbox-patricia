import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import {
  UI__NAVIGATE_FROM_CONTENT_SUMMARY_VIEW_LINK,
  UI__CONTENT_SUMMARY_COLLAPSE_CLICK,
} from "@ppb/tbd-store/actions/navigation";
import { UI__CONTENT_SUMMARY_COLLAPSE_EVENT } from "@ppb/tbd-store/actions/interface";
import { PUSH } from "@ppb/tbd-store/actions/router";

import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

const getContentSummaryCardByURN = jest.fn(() => ({
  urn: "ppb:tbd:card:contentSummary:sport:1",
  typename: "ContentSummaryCard",
  sections: [
    {
      sectionType: "ACCORDION",
      title: "Card title",
      items: [
        {
          subtitle: "Group title",
          items: [
            {
              alignment: "Left",
              title: "Link text",
              viewLink: {
                viewUrl: "football/1",
                viewUrn: "ppb:tbd:sport:1",
              },
            },
          ],
        },
      ],
    },
  ],
}));

jest.mock("@ppb/tbd-store/state/layout/cards/cards-selectors", () => ({
  createCardByURNSelector: jest.fn(() => getContentSummaryCardByURN),
}));

const state = {
  layouts: {
    cards: {
      contentsummary: ["ppb:tbd:card:contentSummary:sport:1"],
    },
  },
  entities: {
    throttles: {},
  },
};

const setupMapStateToProps = (urn) => {
  const containerProps = {
    urn,
  };
  return makeMapStateToProps()(state, containerProps);
};

describe("makeMapStateToProps", () => {
  it("should create selector for content summary card", () => {
    makeMapStateToProps();

    expect(createCardByURNSelector).toHaveBeenCalledWith();
    expect(createCardByURNSelector).toHaveBeenCalledTimes(1);
  });

  it("should get data from state and build correct view model", () => {
    const stateProps = setupMapStateToProps("ppb:tbd:card:contentSummary:sport:1");

    expect(getContentSummaryCardByURN).toHaveBeenCalledWith(
      state.layouts.cards.contentsummary,
      "ppb:tbd:card:contentSummary:sport:1",
    );

    expect(stateProps).toEqual({
      sections: [
        {
          sectionType: "ACCORDION",
          title: "Card title",
          items: [
            {
              subtitle: "Group title",
              items: [
                {
                  alignment: "Left",
                  title: "Link text",
                  viewLink: {
                    viewUrl: "football/1",
                    viewUrn: "ppb:tbd:sport:1",
                  },
                },
              ],
            },
          ],
        },
      ],
    });
  });

  describe("mapDispatchToProps", () => {
    beforeEach(jest.clearAllMocks);

    describe("dispatchPushAction", () => {
      describe("when view link is defined", () => {
        it("should dispatch the push action", () => {
          const { dispatchPushAction } = mapDispatchToProps;
          const viewLink = {
            viewUrn: "ppb:tbd:view:sport:1",
            viewUrl: "football/1",
          };

          expect(dispatchPushAction(viewLink)).toEqual({
            payload: viewLink,
            type: PUSH,
          });
        });
      });
    });

    describe("dispatchContentSummaryNavigationAction", () => {
      describe("when view link is defined", () => {
        it("should dispatch the content summary links navigation action", () => {
          const { dispatchContentSummaryNavigationAction } = mapDispatchToProps;
          const viewLink = {
            viewUrn: "ppb:tbd:view:sport:1",
            viewUrl: "football/1",
          };
          const text = "Link label";

          expect(dispatchContentSummaryNavigationAction(viewLink, text)).toEqual({
            payload: {
              text: "Link label",
              url: "football/1",
              module: "seo footer links",
            },
            type: UI__NAVIGATE_FROM_CONTENT_SUMMARY_VIEW_LINK,
          });
        });
      });

      describe("when the view link is undefined", () => {
        it("should dispatch the content summary navigation action", () => {
          const { dispatchContentSummaryNavigationAction } = mapDispatchToProps;
          const text = "Link label";

          expect(dispatchContentSummaryNavigationAction(undefined, text)).toEqual({
            payload: {
              text: "Link label",
              url: undefined,
              module: "seo footer links",
            },
            type: UI__NAVIGATE_FROM_CONTENT_SUMMARY_VIEW_LINK,
          });
        });
      });
    });

    describe("dispatchContentSummaryCollapseClickAction", () => {
      it("should dispatch the content summary collapse click action", () => {
        const { dispatchContentSummaryCollapseClickAction } = mapDispatchToProps;
        const collapsed = true;

        expect(dispatchContentSummaryCollapseClickAction(collapsed)).toEqual({
          payload: {
            collapsed: true,
          },
          type: UI__CONTENT_SUMMARY_COLLAPSE_CLICK,
        });
      });
    });

    describe("dispatchContentSummaryCollapseGAAction", () => {
      describe("when the title is defined", () => {
        it("should dispatch the content summary collapse GA action", () => {
          const { dispatchContentSummaryCollapseGAAction } = mapDispatchToProps;
          const collapsed = true;
          const title = "Main title";

          expect(dispatchContentSummaryCollapseGAAction(collapsed, title)).toEqual({
            payload: {
              collapsed: true,
              title: "Main title",
            },
            type: UI__CONTENT_SUMMARY_COLLAPSE_EVENT,
          });
        });
      });

      describe("when the title is undefined", () => {
        it("should dispatch the content summary collapse GA action", () => {
          const { dispatchContentSummaryCollapseGAAction } = mapDispatchToProps;
          const collapsed = false;

          expect(dispatchContentSummaryCollapseGAAction(collapsed, undefined)).toEqual({
            payload: {
              collapsed: false,
              title: undefined,
            },
            type: UI__CONTENT_SUMMARY_COLLAPSE_EVENT,
          });
        });
      });
    });
  });
});
