import { FunctionComponent, MouseEvent, useCallback } from "react";
import { HighlightedLinkCard } from "@ppb/the-wall-web";
import { LoadedComponentProps } from "./props";

const MarketViewLinkCard: FunctionComponent<LoadedComponentProps> = ({
  urn,
  viewLink,
  name,
  badge,
  dispatchRouterPushAction,
}) => {
  const onMarketLinkTap = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      dispatchRouterPushAction(viewLink);
    },
    [viewLink, dispatchRouterPushAction],
  );

  return <HighlightedLinkCard onTap={onMarketLinkTap} viewLink={viewLink} label={name} urn={urn} cardIcon={badge} />;
};

export default MarketViewLinkCard;
