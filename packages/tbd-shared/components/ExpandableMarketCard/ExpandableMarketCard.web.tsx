import { FunctionComponent, useCallback } from "react";
import { Card } from "@ppb/the-wall-web";
import { CardTheme, CardHeaderSize } from "@ppb/the-wall-common/types/Card/Card.types";

import { ComponentProps } from "./props";
import ConnectedMarketCard from "../MarketCard";
import MarketCard from "../MarketCard/MarketCard.web";
import { OpenBets } from "../OpenBets/OpenBets.web";
import ConnectedOpenBets from "../OpenBets";
import { HydratedCardProps, ShellCardProps } from "./map-to-props-factory";

type ExpandableMarketCardShellProps = ShellCardProps;
type HydratedExpandableMarketCardProps = ComponentProps & HydratedCardProps;

const ExpandableMarketCardShell: FunctionComponent<ExpandableMarketCardShellProps> = ({ title }) => (
  <Card title={title} theme={CardTheme.SECONDARY} size={CardHeaderSize.LARGE} isCollapsible fullWidthContent>
    <></>
  </Card>
);

const HydratedExpandableMarketCard: FunctionComponent<HydratedExpandableMarketCardProps> = ({
  title,
  urn,
  marketCardURN,
  visible = true,
  dispatchFetchFullCardAction,
}) => {
  const onToggle = useCallback(
    (isToggleOpen: boolean) => {
      if (isToggleOpen) {
        dispatchFetchFullCardAction(marketCardURN);
      }
    },
    [dispatchFetchFullCardAction, marketCardURN],
  );

  return (
    <Card
      onTitleClick={onToggle}
      title={title}
      theme={CardTheme.SECONDARY}
      size={CardHeaderSize.LARGE}
      isCollapsible
      fullWidthContent
      endElement={<ConnectedOpenBets component={OpenBets} cardURN={urn} />}
    >
      <ConnectedMarketCard component={MarketCard} urn={marketCardURN} visible={visible} />
    </Card>
  );
};

const ExpandableMarketCard: FunctionComponent<ComponentProps> = (props) => {
  if (props.isShell) {
    return <ExpandableMarketCardShell {...props} />;
  }

  return <HydratedExpandableMarketCard {...props} />;
};

export default ExpandableMarketCard;
