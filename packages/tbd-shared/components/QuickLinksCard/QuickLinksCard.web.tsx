import type { JSX } from "react";
import { MouseEvent, FunctionComponent, useCallback } from "react";
import classNames from "classnames";
import { QuickLink as QuickLinkItem } from "@ppb/tbd-store/state/layout/cards/Card.types";
import { Card, Divider, QuickLink } from "@ppb/the-wall-web";
import { CardTheme, CardHeaderSize } from "@ppb/the-wall-common/types/Card/Card.types";
import { SportIcon } from "@ppb/the-wall-icons/SportIcon/SportIcon";
import { ComponentProps } from "./props";
import styles from "./QuickLinksCard.web.css";
import { getQuicklinkRoundCorners } from "../../helpers/quicklink";

type QuickLinkOnClick = (item: QuickLinkItem, e: MouseEvent) => void;

/**
 * Function component that wraps a quick links card
 *
 * @param props The component props
 * @returns The react component
 */
const QuickLinksCard: FunctionComponent<ComponentProps> = ({
  title,
  accordionTitle,
  accordionExpanded,
  links,
  urn,
  navigateToQuickLink,
  pushAction,
}) => {
  const handleLinkClick = useCallback<QuickLinkOnClick>(
    (item, e) => {
      const { viewLink, label } = item;
      e.preventDefault();

      if (viewLink) {
        navigateToQuickLink(viewLink, label, urn, title);
        pushAction(viewLink);
      }
    },
    [navigateToQuickLink, pushAction, urn, title],
  );

  if (!links.length) {
    return null;
  }

  const linksMap = (isLightBackground = false): JSX.Element | null => (
    <div className={classNames(styles.list, { [styles.primaryList]: !isLightBackground })}>
      {links.map((link, index) => {
        const roundCorners = !isLightBackground ? getQuicklinkRoundCorners(links, index) : undefined;

        return (
          <div key={`quick-link-card-item-${link.viewLink.viewUrn}`}>
            <QuickLink
              item={{ viewLink: link.viewLink, text: link.label, target: link.target ?? undefined }}
              icon={
                link.icon ? (
                  <div className={styles.icon}>
                    <SportIcon sportId={link.icon} />
                  </div>
                ) : undefined
              }
              roundCorners={roundCorners}
              onLinkClick={(event) => handleLinkClick(link, event)}
              isLightBackground={isLightBackground}
              withShadow={false}
            />
            {isLightBackground && links.length > 1 && <Divider />}
          </div>
        );
      })}
    </div>
  );

  return (
    <nav aria-label={title}>
      <div className={styles.container}>
        {title && (
          <h2 className={styles.title} aria-hidden>
            {title}
          </h2>
        )}
        <div className={styles.listContainer}>
          {accordionTitle ? (
            <Card
              key={urn}
              startOpen={accordionExpanded}
              title={accordionTitle}
              isCollapsible
              theme={CardTheme.SECONDARY}
              size={CardHeaderSize.LARGE}
              fullWidthContent
              showShadow
            >
              {linksMap(true)}
            </Card>
          ) : (
            <Card key={urn} theme={CardTheme.TRANSPARENT} fullWidthContent showShadow>
              {linksMap()}
            </Card>
          )}
        </div>
      </div>
    </nav>
  );
};

export default QuickLinksCard;
