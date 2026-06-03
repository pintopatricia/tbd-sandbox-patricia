import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { MapStateToPropsFactory, MapDispatchToProps } from "react-redux";
import URN from "@ppb/tbd-store/state/layout/URN";
import { createCardGroupByURNSelector } from "@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors";
import {
  FilterTag,
  ObbCardGroup,
  ObbCardGroups,
  ObbSection,
} from "@ppb/tbd-store/state/layout/cardgroups/CardGroup.types";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import { FootballFixture, EXTERNAL_PUSH, ExternalPushAction, RichText } from "@ppb/tbd-store";
import { fixtureCodec } from "@ppb/tbd-urn-codecs";
import { Dispatch } from "redux";
import {
  OBB_CARD__EVENT_SELECTION,
  ObbEventSelectionAction,
  OBB_CARD_GROUP__SET_FILTER,
  ObbCardGroupSetFilterAction,
  ObbCardGroupLayoutSelectionAction,
  OBB_CARD_GROUP__LAYOUT_SELECTION,
  OBB_CARD_GROUP__SECTION_TOGGLED,
  ObbCardGroupSectionToggledAction,
  ObbCardGroupShowMoreClickedAction,
  OBB_CARD_GROUP__SHOW_MORE_CLICKED,
} from "@ppb/tbd-store/actions/obb";

export type ContainerProps = {
  urn: URN;
};

export type ObbCardGroupProps = {
  urn: string;
  title?: string;
  sections: ObbSection[];
  bettingWindowOffset: number;
  event: ObbCardGroup["event"];
  footballFixture: FootballFixture | undefined;
  obbBettingStartTime: Date;
  eventDate: Date;
  moreInfoLabel?: string;
  moreInfoDetails?: Array<RichText | null> | null;
  filterTags: FilterTag[];
  showFilterTags: boolean;
  selectedFilter: string;
  sectionExpansionOverrideByFilter: Record<string, Record<string, boolean>>;
};

export type StateProps = ObbCardGroupProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getObbCardGroupByURN = createCardGroupByURNSelector<ObbCardGroups, URN>();

  return (state: ApplicationState, { urn }: ContainerProps): StateProps => {
    const obbCardGroup = getObbCardGroupByURN(state.layouts.cardgroups.obbcardgroups, urn);
    if (!obbCardGroup) return {};

    const fixtureURN = fixtureCodec.encode(String(obbCardGroup.event.eventId)).uid;
    const eventDate = new Date(obbCardGroup.event.openDate);

    return {
      urn,
      title: obbCardGroup.title,
      sections: obbCardGroup.sections,
      event: obbCardGroup.event,
      bettingWindowOffset: obbCardGroup.bettingWindowOffset,
      obbBettingStartTime: new Date(eventDate.getTime() - obbCardGroup.bettingWindowOffset * 60 * 60 * 1000),
      footballFixture: state.entities.footballfixtures[fixtureURN],
      eventDate,
      moreInfoLabel: obbCardGroup.moreInfoLabel,
      moreInfoDetails: obbCardGroup.moreInfoDetails,
      filterTags: obbCardGroup.filterTags,
      showFilterTags: obbCardGroup.showFilterTags,
      selectedFilter: obbCardGroup.selectedFilter || "ALL",
      sectionExpansionOverrideByFilter: obbCardGroup.sectionExpansionOverrideByFilter,
    };
  };
};

export type DispatchProps = {
  dispatchObbEventSelection: (
    event: ObbEventSelectionAction["payload"]["event"],
    urn?: string,
    eventName?: string,
  ) => void;
  dispatchNavigateToTermsAndConditionsPage: (viewLink: ViewLink) => void;
  dispatchSetFilter: (selectedFilter: string, urn: string) => void;
  dispatchLayoutSelection: (urn: string, sectionUrn: string, layoutUrn: string, eventName: string | undefined) => void;
  dispatchSectionToggle: (
    cardGroupUrn: string,
    sectionUrn: string,
    isOpen: boolean,
    eventName: string | undefined,
  ) => void;
  dispatchShowMoreClicked: (
    cardGroupUrn: string,
    sectionUrn: string,
    layoutUrn: string,
    isOpen: boolean,
    eventName: string | undefined,
  ) => void;
};

export const mapDispatchToProps: MapDispatchToProps<DispatchProps, ContainerProps> = (
  dispatch: Dispatch<
    | ObbEventSelectionAction
    | ExternalPushAction
    | ObbCardGroupSetFilterAction
    | ObbCardGroupLayoutSelectionAction
    | ObbCardGroupSectionToggledAction
    | ObbCardGroupShowMoreClickedAction
  >,
) => ({
  dispatchObbEventSelection: (event: ObbEventSelectionAction["payload"]["event"], urn?: string, eventName?: string) => {
    dispatch<ObbEventSelectionAction>({
      type: OBB_CARD__EVENT_SELECTION,
      payload: {
        event,
        urn,
        eventName,
      },
    });
  },
  dispatchNavigateToTermsAndConditionsPage: (viewLink: ViewLink) => {
    dispatch({
      type: EXTERNAL_PUSH,
      payload: viewLink,
    });
  },
  dispatchSetFilter: (selectedFilter: string, urn: string) => {
    dispatch<ObbCardGroupSetFilterAction>({
      type: OBB_CARD_GROUP__SET_FILTER,
      payload: { selectedFilter, urn },
    });
  },
  dispatchLayoutSelection: (urn: string, sectionUrn: string, layoutUrn: string, eventName: string | undefined) => {
    dispatch<ObbCardGroupLayoutSelectionAction>({
      type: OBB_CARD_GROUP__LAYOUT_SELECTION,
      payload: { urn, sectionUrn, layoutUrn, eventName },
    });
  },
  dispatchSectionToggle: (cardGroupUrn: string, sectionUrn: string, isOpen: boolean, eventName: string | undefined) => {
    dispatch<ObbCardGroupSectionToggledAction>({
      type: OBB_CARD_GROUP__SECTION_TOGGLED,
      payload: { cardGroupUrn, sectionUrn, isOpen, eventName },
    });
  },
  dispatchShowMoreClicked: (
    cardGroupUrn: string,
    sectionUrn: string,
    layoutUrn: string,
    isOpen: boolean,
    eventName: string | undefined,
  ) => {
    dispatch<ObbCardGroupShowMoreClickedAction>({
      type: OBB_CARD_GROUP__SHOW_MORE_CLICKED,
      payload: { cardGroupUrn, sectionUrn, layoutUrn, isOpen, eventName },
    });
  },
});
