import type { JSX } from "react";
import { Fragment, FunctionComponent, useMemo, MouseEvent } from "react";
import classnames from "classnames";
import { Card, Divider, QuickLink } from "@ppb/the-wall-web";
import { CardHeaderSize, CardProps, CardTheme } from "@ppb/the-wall-common/types/Card/Card.types";
import {
  Alignment,
  ClockItem,
  CookieConsent,
  ImageItem,
  Item,
  Labels,
  RegulatoryLinkItem,
  Section,
  SectionElementsProps,
} from "../RegulatorySectionsSession/RegulatorySections.types";
import { Clock } from "../Clock/Clock.web";
import { RegulatorySectionsSession } from "../RegulatorySectionsSession/RegulatorySectionsSession.web";
import { isDGALogo } from "./SectionElements.helper";
import styles from "./SectionElements.web.css";
import { getQuicklinkRoundCorners } from "../../../../helpers/quicklink";
import { SystemIconName } from "@ppb/the-wall-icons";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";

export type SectionItemOnClick = (event: MouseEvent, item: RegulatoryLinkItem | ImageItem | CookieConsent) => void;

export type SectionElementsWebProps = {
  onSectionClick: SectionItemOnClick;
  hasUnreadNotifications?: boolean;
};

export type SectionElementsWebViewModel = SectionElementsProps & SectionElementsWebProps;

const ALIGNMENTS: Alignment[] = ["left", "right", "center"];

const getAlignment = (alignment: Alignment): string => {
  switch (alignment) {
    case "left":
      return "flex-start";
    case "center":
      return "center";
    case "right":
      return "flex-end";
    default:
      return "center";
  }
};

type RegulatoryClockViewModel = {
  item: ClockItem;
  isInline: boolean;
};

const RegulatoryClock: FunctionComponent<RegulatoryClockViewModel> = ({ item, isInline }) => {
  const clockClassnames = useMemo(
    () =>
      classnames(styles.clockContainer, {
        [styles.clockInline]: isInline,
      }),
    [isInline],
  );

  const alignmentClockStyles = useMemo(
    () => ({
      justifyContent: getAlignment(item.alignment),
    }),
    [item.alignment],
  );

  const renderClock = useMemo(() => <Clock timeZone={item.timeZone} />, [item.timeZone]);

  return (
    <div className={clockClassnames} style={alignmentClockStyles}>
      {item.text ? (
        <div className={styles.clockWithText}>
          <span className={`${styles.clockText} typography-h120`}>{item.text}</span>
          {renderClock}
        </div>
      ) : (
        renderClock
      )}
    </div>
  );
};

const renderSectionElement = (
  item: Item,
  index: number,
  array: Item[],
  onSectionClick: SectionItemOnClick,
  labels?: Labels,
  collapsable = false,
): JSX.Element | null => {
  switch (item.type) {
    case "TEXT":
      return (
        <p className={styles.text} key={`${item.text}-${index}`}>
          {item.text}
        </p>
      );

    case "HTML": {
      const htmlClassnames = classnames(styles.text, "typography-h120", {
        [styles.alignLeft]: item.alignment === "left",
        [styles.alignRight]: item.alignment === "right",
        [styles.alignCenter]: item.alignment === "center",
      });
      return (
        <div
          className={htmlClassnames}
          key={`${item.text}-${index}`}
          dangerouslySetInnerHTML={{ __html: item.text }}
        ></div>
      );
    }

    case "IMAGE": {
      /* when an image is followed by other image, alignment should be ignored */
      const aloneImage = array[index + 1] ? array[index + 1].type !== "IMAGE" : true;
      const imageClass = classnames(styles.imageContainer, {
        [styles.alignLeft]: aloneImage && item.alignment === "left",
        [styles.alignRight]: aloneImage && item.alignment === "right",
        [styles.alignCenter]: aloneImage && item.alignment === "center",
        [styles.largeImage]: isDGALogo(item),
      });

      if (item.viewLink) {
        return (
          <a
            href={item.viewLink?.viewUrl}
            className={imageClass}
            target={item.target}
            key={`${index}-${item.imageURL}`}
            onClick={(event) => onSectionClick(event, item)}
          >
            <img loading="lazy" className={styles.image} src={item.imageURL} alt={item.alt} />
          </a>
        );
      }

      return (
        <div className={imageClass} key={`${item.imageURL}-${index}`}>
          <img loading="lazy" className={styles.image} src={item.imageURL} alt={item.alt ?? ""} />
        </div>
      );
    }
    case "SESSION":
    case "LOGGED_IN_SINCE":
    case "LAST_LOG_IN": {
      const alignmentSessionStyles = {
        textAlign: ALIGNMENTS.find((value) => value === item.alignment) || "center",
      };
      return (
        <div
          style={alignmentSessionStyles}
          key={`${item.text}-${index}`}
          className={`${styles.session} ${styles.text}`}
        >
          <RegulatorySectionsSession item={item} />
        </div>
      );
    }
    case "USER_DETAILS": {
      const alignmentTextStyles = {
        textAlign: ALIGNMENTS.find((value) => value === item.alignment) || "center",
      };
      return (
        <p className={`${styles.userDetails} ${styles.text}`} style={alignmentTextStyles} key={`userDetails-${index}`}>
          {`${item.firstName} ${item.lastName} - ${
            item.nationalIdentifier && labels?.nationalIdentifierLabel ? labels.nationalIdentifierLabel : ""
          }
            ${item.nationalIdentifier || ""} - ${
              item.contractNumber && labels?.contractNumberLabel ? labels.contractNumberLabel : ""
            } ${item.contractNumber || ""}`}
        </p>
      );
    }
    case "GROUP_LINKS":
      return (
        <div className={styles.groupLinks} key={`${item.subtitle}-${index}`}>
          {item.subtitle !== "" && <h2 className={`${styles.title} typography-h158`}>{item.subtitle}</h2>}
          {item?.items.map((link, idx) => (
            <QuickLink
              item={link}
              key={`${link.text}-${idx}`}
              onLinkClick={(event) => onSectionClick(event, link)}
              style={classnames("typography-h120")}
              isLightBackground={collapsable}
            />
          ))}
        </div>
      );

    case "CLOCK": {
      const showRegulatoryClockInLine = array[index - 1]?.type === "IMAGE";

      return <RegulatoryClock key={`${item.timeFormat}-${index}`} item={item} isInline={showRegulatoryClockInLine} />;
    }
    default:
      return null;
  }
};

function renderQuicklinksSection(
  quickLinks: RegulatoryLinkItem[] | CookieConsent[],
  onSectionClick: SectionItemOnClick,
  collapsable = false,
  isNotification = false,
): JSX.Element | null {
  const links = quickLinks.map((item, index) => {
    const isNextQuickLink = ["LINK", "COOKIE_CONSENT"].includes(quickLinks[index + 1]?.type);
    const roundCorners = !collapsable ? getQuicklinkRoundCorners(quickLinks, index) : undefined;
    const { icon, ...remainingItem } = item;

    return (
      <Fragment key={`${remainingItem.text}-${index}-fragment`}>
        <QuickLink
          item={remainingItem}
          icon={icon}
          onLinkClick={(event) => onSectionClick(event, remainingItem)}
          isLightBackground={collapsable}
          style={classnames(styles.link, !collapsable && roundCorners, isNotification && styles.reverse)}
          roundCorners={roundCorners}
          key={`${remainingItem.text}-${index}`}
          withShadow={false}
        />
        {collapsable && isNextQuickLink && <Divider />}
      </Fragment>
    );
  });

  return (
    <div
      className={classnames({
        [styles.quickLinksList]: !collapsable,
        [styles.shadow]: !collapsable,
        [styles.collapsable]: collapsable,
      })}
    >
      {links}
    </div>
  );
}

function renderSection(
  section: Section,
  onSectionClick: SectionItemOnClick,
  labels?: Labels,
  onCollapsibleToggle?: CardProps["onTitleClick"],
  theme = CardTheme.PRIMARY,
  startOpen = true,
  hasUnreadNotifications = false,
): JSX.Element | null {
  const propsStyles = {
    color: section.textColor || "",
    backgroundColor: section.bgColor || "",
  };
  let quicklinksArray: Item[] = [];
  const collapsable = section.sectionType === "ACCORDION";
  const renderedItems = section.items.map((item, index, array) => {
    if (item.type === "LINK" || item.type === "COOKIE_CONSENT") {
      const isNotification = section.sectionLabel === "NOTIFICATIONS" && hasUnreadNotifications;
      if (isNotification) {
        item.icon = (
          <div className={styles.unreadNotifications}>
            <GenericIcon name={SystemIconName.CAROUSEL_DOT} color={"#F00"} />
          </div>
        );
      }
      quicklinksArray.push(item);

      const isNextItemLink = ["LINK", "COOKIE_CONSENT"].includes(array[index + 1]?.type);
      if (isNextItemLink) {
        return null;
      }

      const linksArray = [...quicklinksArray] as RegulatoryLinkItem[] | CookieConsent[];
      quicklinksArray = [];
      return (
        <Fragment key={`section-elements-quicklinks-${index}`}>
          {renderQuicklinksSection(linksArray, onSectionClick, collapsable, isNotification)}
        </Fragment>
      );
    }
    return renderSectionElement(item, index, array, onSectionClick, labels, collapsable);
  });

  switch (section.sectionType) {
    case "GENERIC": {
      return (
        <div className={styles.section} style={propsStyles}>
          {section.title && <p className={styles.sectionTitle}>{section.title}</p>}
          <div>{renderedItems}</div>
        </div>
      );
    }
    case "ACCORDION": {
      const onHandleClick = (expanded: boolean) => {
        if (onCollapsibleToggle) {
          onCollapsibleToggle(!expanded);
        }
      };

      return (
        <div className={styles.section} style={propsStyles}>
          <Card
            onTitleClick={onHandleClick}
            startOpen={startOpen}
            title={section.title}
            theme={theme}
            size={CardHeaderSize.LARGE}
            isCollapsible
            fullWidthContent
          >
            <div className={styles.collapseContentSections}>{renderedItems}</div>
          </Card>
        </div>
      );
    }

    default:
      return null;
  }
}

export const SectionElements: FunctionComponent<SectionElementsWebViewModel> = ({
  section,
  onSectionClick,
  labels,
  onCollapsibleToggle,
  hasUnreadNotifications,
}) =>
  renderSection(
    section,
    onSectionClick,
    labels,
    onCollapsibleToggle,
    section.theme,
    section.startOpen,
    hasUnreadNotifications,
  );
