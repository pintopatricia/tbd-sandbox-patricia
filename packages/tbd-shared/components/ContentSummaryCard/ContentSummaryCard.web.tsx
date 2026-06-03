import { FunctionComponent, useCallback } from "react";

import BreadcrumbsCard from "@ppb/tbd-components-navigation/components/BreadcrumbsCard/view/BreadcrumbsCard.web";

import { SectionElements, SectionItemOnClick } from "../UserProfile/snowflakes/SectionElements/SectionElements.web";
import { ComponentProps } from "./props";
import styles from "./ContentSummaryCard.web.css";

const ContentSummaryCard: FunctionComponent<ComponentProps> = ({
  sections,
  dispatchContentSummaryNavigationAction,
  dispatchContentSummaryCollapseClickAction,
  dispatchPushAction,
  dispatchContentSummaryCollapseGAAction,
}) => {
  const handleLinkClick = useCallback<SectionItemOnClick>(
    (event, item) => {
      event.preventDefault();

      const viewLink = "viewLink" in item ? item.viewLink : undefined;
      const text = "text" in item ? item.text : undefined;

      dispatchContentSummaryNavigationAction(viewLink, text);

      if (viewLink) {
        dispatchPushAction(viewLink);
      }
    },
    [dispatchContentSummaryNavigationAction, dispatchPushAction],
  );

  const onCollapsibleToggle = useCallback(
    (collapsed: boolean, title?: string) => {
      dispatchContentSummaryCollapseClickAction(collapsed);
      dispatchContentSummaryCollapseGAAction(collapsed, title);
    },
    [dispatchContentSummaryCollapseClickAction, dispatchContentSummaryCollapseGAAction],
  );

  if (!sections?.length) {
    return <></>;
  }

  return (
    <>
      {sections.map((section, index) => {
        const breadcrumbs = section.sectionType === "ACCORDION" ? section.breadcrumbs : null;

        return (
          <div className={styles.contentSummaryContainer} key={`${section.title}-${index}`}>
            {breadcrumbs && <BreadcrumbsCard urn={breadcrumbs.urn} />}
            <SectionElements
              section={{ ...section, startOpen: false }}
              onSectionClick={handleLinkClick}
              onCollapsibleToggle={(_) => onCollapsibleToggle(_, section.title)}
            />
          </div>
        );
      })}
    </>
  );
};

export default ContentSummaryCard;
