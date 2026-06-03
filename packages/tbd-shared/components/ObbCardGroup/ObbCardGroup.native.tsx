import { memo, FunctionComponent, useState, useEffect, useMemo, useCallback, useRef } from "react";
import { View, PanResponder } from "react-native";
import { ActionLink, BottomSheet, EmptyState, PebbleList, Text } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { ActionLinkColor, ActionLinkTypography, FootballMatchStatus } from "@ppb/the-wall-common/types";
import { tokens } from "@ppb/the-wall-common/base-theme";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { SystemIconName } from "@ppb/the-wall-icons";
import { ObbSection as ObbSectionType } from "@ppb/tbd-store/state/layout/cardgroups/CardGroup.types";
import { ComponentProps } from "./props";
import styles from "./ObbCardGroup.native.styles";
import { OBB_CARD_GROUP, OBB_CARD_GROUP_HEADER, OBB_CARD_GROUP_TITLE } from "./ObbCardGroup.native.selectors";
import TimerCountDown from "../TimerCountDown/TimerCountDown.native";
import { ObbMoreInfoDetails } from "../ObbMoreInfoDetails/ObbMoreInfoDetails.native";
import { i18n } from "../../helpers/i18n";
import { TooltipProvider, useTooltip } from "../ObbSquadVsSquadCard/snowflakes/PlayersTooltip/TooltipContext";
import { PlayersTooltip } from "../ObbSquadVsSquadCard/snowflakes/PlayersTooltip/PlayersTooltip.native";
import ObbSection from "../ObbSection/ObbSection.native";

const UnavailableIcon = () => (
  <View style={styles.unavailableIcon}>
    <GenericIcon name={SystemIconName.CLOSE} color={tokens.EmptyStateIconColor} />
  </View>
);
const NoAvailableCardsIcon = () => (
  <View style={styles.unavailableIcon}>
    <GenericIcon name={SystemIconName.SELF_EXCLUSION} color={tokens.EmptyStateIconColor} />
  </View>
);

const isEqualObbCardGroup: (previous: ComponentProps, current: ComponentProps) => boolean = (prev, next) => {
  if (
    prev.title !== next.title ||
    prev.obbBettingStartTime.getTime() !== next.obbBettingStartTime.getTime() ||
    prev.eventDate.getTime() !== next.eventDate.getTime() ||
    prev.event.name !== next.event.name ||
    prev.moreInfoLabel !== next.moreInfoLabel ||
    prev.selectedFilter !== next.selectedFilter ||
    prev.dispatchObbEventSelection !== next.dispatchObbEventSelection ||
    prev.dispatchSetFilter !== next.dispatchSetFilter
  ) {
    return false;
  }

  if (JSON.stringify(prev.footballFixture) !== JSON.stringify(next.footballFixture)) {
    return false;
  }

  if (JSON.stringify(prev.sectionExpansionOverrideByFilter) !== JSON.stringify(next.sectionExpansionOverrideByFilter)) {
    return false;
  }

  if (JSON.stringify(prev.sections) !== JSON.stringify(next.sections)) {
    return false;
  }

  if (prev.moreInfoDetails !== next.moreInfoDetails) {
    return false;
  }

  return true;
};

function calculateIsExpandedState(
  section: ObbSectionType,
  overrides: Record<string, Record<string, boolean>>,
  selectedFilter: string,
  index: number,
) {
  // if filter is ALL, use the section state directly
  if (selectedFilter === "ALL") {
    return section.isExpanded;
  }

  // if an override for a filter is defined on this section, use it
  const isExpandedOverride = overrides[selectedFilter]?.[section.urn];
  if (isExpandedOverride !== undefined) {
    return isExpandedOverride;
  }

  // by default, only the first section is open when the filter is not ALL
  return index === 0;
}

const ObbCardGroup: FunctionComponent<ComponentProps> = ({
  urn,
  title,
  sections,
  obbBettingStartTime,
  bettingWindowOffset,
  footballFixture,
  eventDate,
  event,
  moreInfoLabel,
  moreInfoDetails,
  showFilterTags,
  filterTags,
  selectedFilter,
  sectionExpansionOverrideByFilter,
  dispatchObbEventSelection,
  dispatchSetFilter,
  dispatchLayoutSelection,
  dispatchSectionToggle,
  dispatchShowMoreClicked,
}) => {
  const { closeTooltip, containerRef } = useTooltip();
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponderCapture: () => {
        closeTooltip();
        return false;
      },
    }),
  ).current;

  const [isPreBetting, setIsPreBetting] = useState(() => obbBettingStartTime.getTime() > Date.now());

  useEffect(() => {
    const offset = obbBettingStartTime.getTime() - Date.now();
    if (offset <= 0) return;
    const timer = setTimeout(() => setIsPreBetting(false), offset);
    return () => clearTimeout(timer);
  }, [obbBettingStartTime]);

  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const handleBottomSheetClick = () => {
    if (!isBottomSheetOpen) {
      dispatchObbEventSelection?.({
        module: `obb - event page - build ups - more info - ${event.name}`,
        elementText: "more info",
      });
    }
    setIsBottomSheetOpen((prevIsBottomSheetOpen) => !prevIsBottomSheetOpen);
  };

  const pebblesMapper = useMemo(
    () =>
      filterTags.map(({ type, label = "" }) => {
        if (type === "CATCH_ALL") {
          return {
            id: "ALL",
            text: i18n({ key: "I18N.OBB.FILTERTAGS.ALL" }),
          };
        }
        return {
          id: label,
          text: label,
        };
      }),
    [filterTags],
  );

  const filteredSections = useMemo(
    () =>
      sections
        .map((section) => ({
          ...section,
          layouts: (selectedFilter !== "ALL"
            ? section.layouts.map((layout) => ({
                ...layout,
                items: layout.items.filter(
                  (item) =>
                    "filterTags" in item &&
                    Array.isArray(item.filterTags) &&
                    item.filterTags.some((tag) => tag?.label === selectedFilter),
                ),
              }))
            : section.layouts
          ).filter((layout) => layout.items.length > 0), // Remove layouts with empty items
        }))
        .filter((section) => section.layouts.length > 0)
        .map((section, index) => ({
          ...section,
          isExpanded: calculateIsExpandedState(section, sectionExpansionOverrideByFilter, selectedFilter, index),
        })),
    [selectedFilter, sections, sectionExpansionOverrideByFilter], // Remove sections with empty layouts
  );

  const changeFilter = useCallback(
    (text: string) => {
      dispatchSetFilter(text, urn);
      dispatchObbEventSelection(
        {
          module: {
            card: "filters pebble",
            group: "null",
          },
          elementText: text,
        },
        urn,
        event.name,
      );
    },
    [dispatchSetFilter, dispatchObbEventSelection, urn, event.name],
  );

  const isEmptySectionsState = useMemo(
    () =>
      sections.every((section) => section.layouts.length === 0) ||
      sections.every((section) => section.layouts.every((layout) => layout.items.length === 0)),
    [sections],
  );

  const [isEventPastStartTime, setIsEventPastStartTime] = useState(() => eventDate.getTime() <= Date.now());

  useEffect(() => {
    const offset = eventDate.getTime() - Date.now();
    if (offset <= 0) return;
    const timer = setTimeout(() => setIsEventPastStartTime(true), offset);
    return () => clearTimeout(timer);
  }, [eventDate]);

  if (isPreBetting) {
    return (
      <EmptyState
        title={i18n({
          key: "I18N.OBB.UNAVAILABLE.PREPLAY.TITLE",
          interpolationValues: { offset: bettingWindowOffset },
        })}
        hasImage={false}
        message={
          <TimerCountDown
            targetDate={obbBettingStartTime}
            title={i18n({ key: "I18N.OBB.UNAVAILABLE.PREPLAY.SUBTITLE" })}
          />
        }
      />
    );
  }

  const isEventInPlay =
    (footballFixture?.duration?.status && footballFixture.duration.status !== FootballMatchStatus.PRE_MATCH) ||
    isEventPastStartTime;
  if (isEventInPlay) {
    return (
      <EmptyState
        hasImage={true}
        title={i18n({ key: "I18N.OBB.UNAVAILABLE.INPLAY.TITLE" })}
        message={i18n({ key: "I18N.OBB.UNAVAILABLE.INPLAY.SUBTITLE" })}
        image={<UnavailableIcon />}
      />
    );
  }

  if (isEmptySectionsState) {
    return (
      <EmptyState
        hasImage={true}
        title={i18n({ key: "I18N.OBB.UNAVAILABLE.ERROR.TITLE" })}
        message={i18n({ key: "I18N.OBB.UNAVAILABLE.ERROR.SUBTITLE" })}
        image={<UnavailableIcon />}
      />
    );
  }

  /* Obb Betting Screen */
  return (
    // eslint-disable-next-line react-hooks/refs -- usage according to https://reactnative.dev/docs/panresponder
    <View {...panResponder.panHandlers}>
      {isBottomSheetOpen && moreInfoLabel && moreInfoDetails && (
        <BottomSheet title={moreInfoLabel} onHeaderIconTap={handleBottomSheetClick} showOverlay={true} withModal={true}>
          <ObbMoreInfoDetails moreInfoDetails={moreInfoDetails} />
        </BottomSheet>
      )}
      {showFilterTags && filterTags?.length > 1 && (
        <View style={styles.filters}>
          <PebbleList items={pebblesMapper} onPebblePress={changeFilter} defaultSelectedPebble={selectedFilter ?? ""} />
        </View>
      )}
      {!filteredSections.length && (
        <EmptyState
          hasImage={true}
          title={i18n({ key: "I18N.OBB.UNAVAILABLE.NOCARDS.TITLE" })}
          message={i18n({ key: "I18N.OBB.UNAVAILABLE.NOCARDS.SUBTITLE" })}
          image={<NoAvailableCardsIcon />}
        />
      )}
      <View style={styles.container} ref={containerRef} {...getTestProps(OBB_CARD_GROUP, false)}>
        {title && (
          <View style={styles.header} {...getTestProps(OBB_CARD_GROUP_HEADER, false)}>
            <Text style={styles.title} {...getTestProps(OBB_CARD_GROUP_TITLE, false)}>
              {title}
            </Text>
            {moreInfoLabel && (
              <ActionLink
                text={moreInfoLabel}
                onClick={handleBottomSheetClick}
                color={ActionLinkColor.Default}
                typography={ActionLinkTypography.Regular}
              ></ActionLink>
            )}
          </View>
        )}
        {filteredSections.map((section, index) => (
          <ObbSection
            key={section.urn}
            urn={section.urn}
            sectionIndex={index}
            title={section.title}
            icon={section.icon || undefined}
            isExpanded={section.isExpanded}
            layouts={section.layouts}
            cardGroupUrn={urn}
            selectedFilter={selectedFilter}
            onToggle={(isOpen: boolean) => {
              dispatchSectionToggle(urn, section.urn, isOpen, event.name);
            }}
            handleLayoutSelection={(sectionUrn: string, layoutUrn: string) => {
              dispatchLayoutSelection(urn, sectionUrn, layoutUrn, event.name);
            }}
            onShowMoreClicked={(sectionUrn: string, layoutUrn: string, isOpen: boolean) => {
              dispatchShowMoreClicked(urn, sectionUrn, layoutUrn, isOpen, event.name);
            }}
          />
        ))}
        <PlayersTooltip />
      </View>
    </View>
  );
};

export const MemoizedObbCardGroup = memo(ObbCardGroup, isEqualObbCardGroup);

export default function ObbCardGroupWithTooltipProvider(props: ComponentProps) {
  return (
    <TooltipProvider>
      <MemoizedObbCardGroup {...props} />
    </TooltipProvider>
  );
}
