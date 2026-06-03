import { FunctionComponent, MouseEvent, useCallback } from "react";
import { QuickLink } from "@ppb/the-wall-web";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import { ComponentProps } from "./props";
import ConnectedCard from "../../Card";
import Card from "../../Card/Card.web";
import styles from "./DefaultGamingBrowse.web.css";
import { getQuicklinkRoundCorners } from "../../../helpers/quicklink";

const DefaultGamingBrowse: FunctionComponent<ComponentProps> = ({
  urn,
  defaultGamingi18n,
  categoryLinks,
  typename,
  dispatchRouterPushAction,
  dispatchExternalRouterPushAction,
}) => {
  const handleLinkClick = useCallback(
    (e: MouseEvent, viewLink: ViewLink) => {
      e.preventDefault();

      if (viewLink.viewDisplayMode) {
        dispatchExternalRouterPushAction(viewLink);
      } else {
        dispatchRouterPushAction(viewLink);
      }
    },
    [dispatchRouterPushAction, dispatchExternalRouterPushAction],
  );

  return (
    <div className={styles.defaultGamingContainer}>
      <ConnectedCard component={Card} urn={urn} typename={typename} />
      <h3 className={`${styles.subtitle} typography-h380`}>{defaultGamingi18n.i18n.subtitle}</h3>
      <div className={styles.quickLinksContainer}>
        {categoryLinks.map((item, index) => {
          const roundCorners = getQuicklinkRoundCorners(categoryLinks, index);

          return (
            <QuickLink
              key={index}
              item={item}
              roundCorners={roundCorners}
              onLinkClick={(event) => handleLinkClick(event, item.viewLink)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default DefaultGamingBrowse;
