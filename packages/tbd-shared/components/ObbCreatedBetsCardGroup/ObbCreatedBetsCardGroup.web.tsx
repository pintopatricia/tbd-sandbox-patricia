import { FunctionComponent, useCallback, useContext } from "react";
import { ScrollableSwimlane, StatusLabel } from "@ppb/the-wall-web";
import { StatusLabelSizeType, StatusLabelType, URN, ViewLink } from "@ppb/the-wall-common/types";
import classNames from "classnames";
import styles from "./ObbCreatedBetsCardGroup.web.css";
import { ComponentProps } from "./ObbCreatedBetsCardGroup.props";
import { ConfigContext } from "../Config/ConfigContext";
import ConnectedObbCreatedBetsCard from "../ObbCreatedBetsCard";
import ObbCreatedBetsCard from "../ObbCreatedBetsCard/ObbCreatedBetsCard.web";

const ObbCreatedBetsCardGroup: FunctionComponent<ComponentProps> = ({
  urn: cardGroupUrn,
  cards,
  headerBadgeLabel,
  headerViewLink,
  headerViewLinkLabel,
  title,
  dispatchLinkClick,
  dispatchPushAction,
}) => {
  const { isDesktopLayout } = useContext(ConfigContext);

  const handleLinkClick = useCallback(
    (link: ViewLink, urn: URN, label: string) => {
      dispatchLinkClick(link, urn, label);

      dispatchPushAction(link);
    },
    [dispatchLinkClick, dispatchPushAction],
  );

  const cardCount = cards.length;
  const enableDesktopLayout = isDesktopLayout && cardCount >= 2;

  return (
    <div className={classNames(styles.container, { [styles.multiCardsLayout]: cardCount >= 2 })}>
      <ScrollableSwimlane
        title={title}
        icon={
          headerBadgeLabel && (
            <StatusLabel
              text={headerBadgeLabel}
              statusLabelSize={StatusLabelSizeType.SMALL}
              statusLabelType={StatusLabelType.COMPLIMENTARY}
            />
          )
        }
        iconPosition={"after"}
        onButtonClick={
          headerViewLink ? () => handleLinkClick(headerViewLink, cardGroupUrn, headerViewLinkLabel) : undefined
        }
        navLink={
          headerViewLink
            ? {
                label: headerViewLinkLabel,
                viewLink: { viewUrl: headerViewLink.viewUrl, viewUrn: headerViewLink.viewUrn },
              }
            : undefined
        }
        isDesktopLayout={enableDesktopLayout}
        snap
      >
        {cards.map((card, index) => (
          <div
            key={index}
            className={classNames(styles.card, {
              [styles.singleCard]: cardCount === 1,
              [styles.doubleCard]: cardCount === 2 && isDesktopLayout,
            })}
          >
            <ConnectedObbCreatedBetsCard
              component={ObbCreatedBetsCard}
              urn={card.urn}
              fullWidth={cardCount === 1 || (cardCount === 2 && isDesktopLayout)}
              cardIndex={index}
            />
          </div>
        ))}
      </ScrollableSwimlane>
    </div>
  );
};

export default ObbCreatedBetsCardGroup;
