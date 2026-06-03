import type { JSX } from "react";
import { FunctionComponent, useEffect } from "react";
import { EmptyState } from "@ppb/the-wall-web";
import { NavigationIconName, SportsIconName } from "@ppb/the-wall-icons";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import ConnectedCard from "../Card";
import Card from "../Card/Card.web";
import styles from "./NotFoundView.web.css";
import { ComponentProps } from "./props";

const iconMap = {
  HOME: <GenericIcon name={NavigationIconName.HOME} color={"var(--neutrals-icon-secondary)"} />,
  MY_BETS: <GenericIcon name={NavigationIconName.MY_BETS} color={"var(--neutrals-icon-secondary)"} />,
  IN_PLAY: <GenericIcon name={SportsIconName.IN_PLAY} color={"var(--neutrals-icon-secondary)"} />,
};

const NotFoundView: FunctionComponent<ComponentProps> = ({
  messages,
  links,
  items,
  hasErrorViewImage,
  dispatchNavigationNotFoundViewLoaded,
  dispatchNavigationFromNotFoundView,
  dispatchRouterPushAction,
}) => {
  const onLinkClick = (event: { preventDefault: () => void }, link: { label: string; viewLink: ViewLink }): void => {
    event.preventDefault();
    dispatchNavigationFromNotFoundView(link.label, link.viewLink.viewUrl);
    dispatchRouterPushAction({ viewUrn: link.viewLink.viewUrn, viewUrl: link.viewLink.viewUrl });
  };

  useEffect(() => {
    dispatchNavigationNotFoundViewLoaded();
  }, []);

  const renderLinks = (): JSX.Element[] | JSX.Element =>
    links.map((link) => {
      const { viewLink } = link;
      const Icon = iconMap[link.icon];
      return (
        <a
          key={link.label}
          className={styles.link}
          href={viewLink.viewUrl}
          onClick={(event) => onLinkClick(event, link)}
        >
          <div className={styles.iconContainer}>
            <div className={styles.icon}>{Icon}</div>
          </div>
          <p className={`typography-h152 ${styles.text}`}>{link.label}</p>
        </a>
      );
    });

  const renderItems = (): JSX.Element[] | JSX.Element | null =>
    items?.length
      ? items.map(({ urn: cardUrn, typename }, index) => (
          <ConnectedCard key={`${cardUrn}-${index}`} urn={cardUrn} component={Card} typename={typename} />
        ))
      : null;

  return (
    <div className={styles.notFoundViewContainer}>
      <EmptyState title={messages.title} message={messages.message} hasImage={hasErrorViewImage} />
      <div className={styles.relatedLinks}>{renderLinks()}</div>
      {renderItems()}
    </div>
  );
};

export default NotFoundView;
