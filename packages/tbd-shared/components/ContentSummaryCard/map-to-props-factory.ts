import { MapStateToPropsFactory } from "react-redux";

import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import URN from "@ppb/tbd-store/state/layout/URN";
import { Section } from "@ppb/tbd-store/state/layout/cards/regulatory-sections/RegulatorySections.types";
import {
  NavigateFromContentSummaryLinkAction,
  UI__NAVIGATE_FROM_CONTENT_SUMMARY_VIEW_LINK,
  UI__CONTENT_SUMMARY_COLLAPSE_CLICK,
} from "@ppb/tbd-store/actions/navigation";
import { UI__CONTENT_SUMMARY_COLLAPSE_EVENT } from "@ppb/tbd-store/actions/interface";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import { PUSH, PushAction } from "@ppb/tbd-store/actions/router";
import { ContentSummaryCards } from "@ppb/tbd-store/state/layout/cards/Card.types";

export type CardProps = {
  sections: Section[];
};
export type StateProps = CardProps | Record<string, never>;

export type ContainerProps = {
  urn: URN;
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getContentSummaryCardByURN = createCardByURNSelector<ContentSummaryCards, URN>();

  return function mapStateToProps(state: ApplicationState, { urn }: ContainerProps): StateProps {
    const contentSummaryCard = getContentSummaryCardByURN(state.layouts.cards.contentsummary, urn);

    if (!contentSummaryCard) {
      return {};
    }

    return {
      sections: contentSummaryCard?.sections,
    };
  };
};

const dispatchPushAction = (viewLink: Omit<ViewLink, "viewUrn"> & { viewUrn?: URN }): PushAction => {
  const payload = viewLink.viewUrn ? { ...viewLink, viewUrn: viewLink.viewUrn } : { ...viewLink, viewUrn: "" };

  return {
    type: PUSH,
    payload,
  };
};

const dispatchContentSummaryNavigationAction = (
  viewLink?: Omit<ViewLink, "viewUrn"> & { viewUrn?: URN },
  text?: string,
): NavigateFromContentSummaryLinkAction => ({
  type: UI__NAVIGATE_FROM_CONTENT_SUMMARY_VIEW_LINK,
  payload: {
    text,
    url: viewLink?.viewUrl,
    module: "seo footer links",
  },
});

const dispatchContentSummaryCollapseClickAction = (collapsed: boolean) => ({
  type: UI__CONTENT_SUMMARY_COLLAPSE_CLICK,
  payload: {
    collapsed,
  },
});

const dispatchContentSummaryCollapseGAAction = (collapsed: boolean, title?: string) => ({
  type: UI__CONTENT_SUMMARY_COLLAPSE_EVENT,
  payload: {
    collapsed,
    title,
  },
});

export type DispatchProps = {
  dispatchContentSummaryNavigationAction: typeof dispatchContentSummaryNavigationAction;
  dispatchContentSummaryCollapseClickAction: typeof dispatchContentSummaryCollapseClickAction;
  dispatchPushAction: typeof dispatchPushAction;
  dispatchContentSummaryCollapseGAAction: typeof dispatchContentSummaryCollapseGAAction;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchContentSummaryNavigationAction,
  dispatchContentSummaryCollapseClickAction,
  dispatchPushAction,
  dispatchContentSummaryCollapseGAAction,
};
