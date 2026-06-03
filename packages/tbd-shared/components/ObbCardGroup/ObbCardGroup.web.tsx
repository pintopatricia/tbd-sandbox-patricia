import { FunctionComponent, useContext, useCallback, useState, useEffect, useMemo } from "react";
import classnames from "classnames";
import { ActionLink, BottomSheet, Modal, EmptyState, PebbleList } from "@ppb/the-wall-web";
import { ActionLinkColor, ActionLinkTypography } from "@ppb/the-wall-common/types";
import { FootballMatchStatus } from "@ppb/tbd-store";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { SystemIconName } from "@ppb/the-wall-icons";
import { ObbSection as ObbSectionType } from "@ppb/tbd-store/state/layout/cardgroups/CardGroup.types";
import styles from "./ObbCardGroup.web.css";
import { ComponentProps } from "./props";
import TimerCountDown from "../TimerCountDown/TimerCountDown.web";
import { ConfigContext } from "../Config/ConfigContext";
import { ObbMoreInfoDetails } from "../ObbMoreInfoDetails/ObbMoreInfoDetails.web";
import { i18n } from "../../helpers/i18n";
import { TooltipProvider } from "../ObbSquadVsSquadCard/snowflakes/PlayersTooltip/TooltipContext";
import ObbSection from "../ObbSection/ObbSection.web";

const UnavailableIcon = () => (
  <div className={styles.unavailableIcon}>
    <GenericIcon name={SystemIconName.CLOSE} />
  </div>
);
const NoAvailableCardsIcon = () => (
  <div className={styles.unavailableIcon}>
    <GenericIcon name={SystemIconName.SELF_EXCLUSION} />
  </div>
);

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
  event,
  obbBettingStartTime,
  bettingWindowOffset,
  footballFixture,
  eventDate,
  moreInfoLabel,
  moreInfoDetails,
  showFilterTags,
  filterTags,
  selectedFilter,
  sections = [],
  sectionExpansionOverrideByFilter,
  dispatchNavigateToTermsAndConditionsPage,
  dispatchSetFilter,
  dispatchLayoutSelection,
  dispatchSectionToggle,
  dispatchShowMoreClicked,
  dispatchObbEventSelection,
}) => {
  const { isDesktopLayout } = useContext(ConfigContext);

  const [isPreBetting, setIsPreBetting] = useState(() => obbBettingStartTime.getTime() > Date.now());

  useEffect(() => {
    const offset = obbBettingStartTime.getTime() - Date.now();
    if (offset <= 0) return;
    const timer = setTimeout(() => setIsPreBetting(false), offset);
    return () => clearTimeout(timer);
  }, [obbBettingStartTime]);

  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const handleBottomSheetClick = useCallback(() => {
    if (!isBottomSheetOpen) {
      dispatchObbEventSelection({
        module: `obb - event page - build ups - more info - ${event.name}`,
        elementText: "more info",
      });
    }
    setIsBottomSheetOpen((prevIsBottomSheetOpen) => !prevIsBottomSheetOpen);
  }, [dispatchObbEventSelection, event.name, isBottomSheetOpen]);

  const handleOnSwimlaneArrowClick = useCallback(
    (direction: "left" | "right", group: string | undefined) => {
      dispatchObbEventSelection(
        {
          elementText: `card - ${direction === "left" ? "previous" : "next"}`,
          module: { group, card: "null" },
        },
        urn,
        event.name,
      );
    },
    [dispatchObbEventSelection, urn, event.name],
  );

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
        .filter((section) => section.layouts.length > 0) // Remove sections with empty layouts
        .map((section, index) => ({
          ...section,
          isExpanded: calculateIsExpandedState(section, sectionExpansionOverrideByFilter, selectedFilter, index),
        })),
    [selectedFilter, sections, sectionExpansionOverrideByFilter],
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

  return (
    <>
      {isDesktopLayout && isBottomSheetOpen && moreInfoLabel && moreInfoDetails && (
        <Modal title={moreInfoLabel} onDismiss={handleBottomSheetClick}>
          <div className={styles.modalContent}>
            <ObbMoreInfoDetails
              moreInfoDetails={moreInfoDetails}
              dispatchNavigateToTermsAndConditionsPage={dispatchNavigateToTermsAndConditionsPage}
            ></ObbMoreInfoDetails>
          </div>
        </Modal>
      )}

      {!isDesktopLayout && isBottomSheetOpen && moreInfoLabel && moreInfoDetails && (
        <BottomSheet title={moreInfoLabel} onHeaderIconTap={handleBottomSheetClick} showOverlay={true}>
          <ObbMoreInfoDetails
            moreInfoDetails={moreInfoDetails}
            dispatchNavigateToTermsAndConditionsPage={dispatchNavigateToTermsAndConditionsPage}
          ></ObbMoreInfoDetails>
        </BottomSheet>
      )}

      {showFilterTags && filterTags?.length > 1 && (
        <PebbleList
          items={pebblesMapper}
          onPebbleClick={changeFilter}
          defaultSelectedPebble={selectedFilter}
          isDesktopLayout={isDesktopLayout}
        />
      )}

      {!filteredSections.length && (
        <EmptyState
          hasImage={true}
          title={i18n({ key: "I18N.OBB.UNAVAILABLE.NOCARDS.TITLE" })}
          message={i18n({ key: "I18N.OBB.UNAVAILABLE.NOCARDS.SUBTITLE" })}
          image={<NoAvailableCardsIcon />}
        />
      )}

      <div className={classnames(styles.container)} id="obb-card-group-container-id">
        {title && (
          <div className={classnames(styles.header)}>
            <h2 className={classnames(styles.title)}>{title}</h2>
            {moreInfoLabel && moreInfoDetails && (
              <ActionLink
                text={moreInfoLabel}
                onClick={handleBottomSheetClick}
                color={ActionLinkColor.Default}
                typography={ActionLinkTypography.Regular}
              ></ActionLink>
            )}
          </div>
        )}

        {filteredSections.map((section, index) => (
          <ObbSection
            key={section.urn}
            urn={section.urn}
            icon={section?.icon ?? undefined}
            sectionIndex={index}
            title={section.title}
            isExpanded={section.isExpanded}
            layouts={section.layouts}
            cardGroupUrn={urn}
            selectedFilter={selectedFilter}
            onToggle={(isOpen: boolean) => {
              dispatchSectionToggle(urn, section.urn, isOpen, event.name);
            }}
            handleOnSwimlaneArrowClick={handleOnSwimlaneArrowClick}
            handleLayoutSelection={(sectionUrn: string, layoutUrn: string) => {
              dispatchLayoutSelection(urn, sectionUrn, layoutUrn, event.name);
            }}
            onShowMoreClicked={(sectionUrn: string, layoutUrn: string, isOpen: boolean) => {
              dispatchShowMoreClicked(urn, sectionUrn, layoutUrn, isOpen, event.name);
            }}
          />
        ))}
      </div>
    </>
  );
};

export default function ObbCardGroupWithTooltipProvider(props: ComponentProps) {
  return (
    <TooltipProvider>
      <ObbCardGroup {...props} />
    </TooltipProvider>
  );
}
