import { FunctionComponent, memo, useCallback, useState } from "react";
import { View } from "react-native";

import URN from "@ppb/tbd-store/state/layout/URN";
import { PebbleListItem } from "@ppb/the-wall-common/types";

import { ActionLink, Card, Text } from "@ppb/the-wall-native";
import { CardHeaderSize, CardTheme } from "@ppb/the-wall-common/types/Card/Card.types";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";

import useCardGroupItems from "../../hooks/useCardGroupItems";
import ConnectedCard from "../Card";
import TBDCard, { isCardImplemented } from "../Card/Card.native";
import ConnectedFavouriteIcon from "../FavouriteIcon";
import FavouriteIcon from "../FavouriteIcon/FavouriteIcon.native";
import ConnectedOpenBets from "../OpenBets";
import { OpenBets } from "../OpenBets/OpenBets.native";

import { emitCollapseToggleEvent } from "./event-emitters";
import { PebbleMarketTemplate } from "./snowflakes/PebbleMarketTemplate/PebbleMarketTemplate.native";
import {
  PEBBLE_CARDGROUP,
  PEBBLE_CARDGROUP_HEADER_CONTAINER,
  PEBBLE_CARDGROUP_OUTER_TITLE_TEXT,
  SHELL,
} from "./PebbleCardGroup.native.selectors";
import styles from "./PebbleCardGroup.native.styles";
import { ComponentProps } from "./props";
import { HydratedCardProps, ShellCardProps } from "./map-to-props-factory";

type PebbleCardGroupShellProps = ShellCardProps;
type HydratedPebbleCardGroupProps = ComponentProps & HydratedCardProps;

const PebbleCardGroupShell: FunctionComponent<PebbleCardGroupShellProps> = ({
  title,
  favouriteMarketsStateURN,
  cardGroupURN,
}) => (
  <View style={styles.shell} {...getTestProps(SHELL, false)}>
    <Card
      title={title}
      theme={CardTheme.SECONDARY}
      size={CardHeaderSize.LARGE}
      isCollapsible
      fullWidthContent
      endElement={
        favouriteMarketsStateURN && (
          <ConnectedFavouriteIcon
            component={FavouriteIcon}
            urn={favouriteMarketsStateURN}
            contentSectionURN={cardGroupURN}
          />
        )
      }
    >
      <></>
    </Card>
  </View>
);

const PebbleCardGroupComponent: FunctionComponent<
  HydratedPebbleCardGroupProps & {
    marketCardURN: string;
    marketCardTypename: string;
    onPebblePressHandler: (pebbleURN: URN) => void;
    filteredItems: PebbleListItem[];
  }
> = memo(
  ({
    title,
    icon,
    outerTitle,
    viewAllLabel,
    viewLink,
    pebbleExpanded,
    favouriteMarketsStateURN,
    pebbleList,
    selectedCardURN,
    cardGroupURN,
    marketCardURN,
    marketCardTypename,
    onPebblePressHandler,
    filteredItems,
    pageType,
    gaTitle,
    tabName,
    visible,
    dispatchPushAction,
  }) => {
    const onViewAllClick = useCallback(() => viewLink && dispatchPushAction(viewLink), [viewLink, dispatchPushAction]);

    const onCollapseToggle = useCallback(
      (isExpanded: boolean) => {
        emitCollapseToggleEvent(isExpanded, pageType, gaTitle, tabName);
      },
      [pageType, gaTitle, tabName],
    );

    // Empty pebble card group
    if (!filteredItems.length) {
      return <></>;
    }

    const pebbleCardGroupItems = (
      <PebbleMarketTemplate
        defaultSelectedPebble={marketCardURN}
        items={pebbleList}
        onPebblePress={onPebblePressHandler}
      >
        {selectedCardURN && (
          // We only have 1 pebble open at each time. If my PebbleCardGroup is
          // visible and inner pebble is also visible
          <ConnectedCard urn={marketCardURN} component={TBDCard} typename={marketCardTypename} visible={visible} />
        )}
      </PebbleMarketTemplate>
    );

    return (
      <View {...getTestProps(PEBBLE_CARDGROUP, false)} style={styles.marketContainer}>
        {!!outerTitle && !!viewAllLabel && (
          <View style={styles.header} {...getTestProps(PEBBLE_CARDGROUP_HEADER_CONTAINER, false)}>
            <Text style={styles.outerTitle} {...getTestProps(PEBBLE_CARDGROUP_OUTER_TITLE_TEXT)}>
              {outerTitle}
            </Text>
            <ActionLink onClick={onViewAllClick} text={viewAllLabel} noPadding />
          </View>
        )}
        {!!title && (
          <Card
            startOpen={pebbleExpanded}
            icon={icon}
            title={title}
            theme={CardTheme.SECONDARY}
            size={CardHeaderSize.LARGE}
            isCollapsible
            fullWidthContent
            endElement={
              <View style={styles.collapseEndElements}>
                <ConnectedOpenBets component={OpenBets} cardURN={cardGroupURN} />
                {favouriteMarketsStateURN && (
                  <ConnectedFavouriteIcon
                    component={FavouriteIcon}
                    urn={favouriteMarketsStateURN}
                    contentSectionURN={cardGroupURN}
                  />
                )}
              </View>
            }
            onTitleClick={onCollapseToggle}
          >
            {pebbleCardGroupItems}
          </Card>
        )}
      </View>
    );
  },
);

PebbleCardGroupComponent.displayName = "PebbleCardGroupComponent";

const HydratedPebbleCardGroup: FunctionComponent<HydratedPebbleCardGroupProps> = (props) => {
  const {
    items: partials,
    selectedCardURN,
    selectedCardTypename,
    cardGroupURN,
    dispatchPebbleItemSelection,
    dispatchFetchCardsAction,
  } = props;

  const filteredItems = useCardGroupItems(partials, isCardImplemented);
  const [marketCardURN, setMarketCardURN] = useState(selectedCardURN || "");
  const [marketCardTypename, setMarketCardTypename] = useState(selectedCardTypename || "");

  const onPebblePressHandler = useCallback(
    (pebbleURN: URN) => {
      const cardTypename = filteredItems.find((item) => item.id === pebbleURN)?.typename;
      if (cardTypename) {
        setMarketCardTypename(cardTypename);
        setMarketCardURN(pebbleURN);
        dispatchPebbleItemSelection(pebbleURN, cardTypename, cardGroupURN);
        dispatchFetchCardsAction(pebbleURN);
      }
    },
    [cardGroupURN, dispatchFetchCardsAction, dispatchPebbleItemSelection, filteredItems],
  );

  return (
    <PebbleCardGroupComponent
      marketCardURN={marketCardURN}
      onPebblePressHandler={onPebblePressHandler}
      marketCardTypename={marketCardTypename}
      filteredItems={filteredItems}
      {...props}
    />
  );
};

const PebbleCardGroup: FunctionComponent<ComponentProps> = (props) => {
  if (props.isShell) {
    return <PebbleCardGroupShell {...props} />;
  }

  return <HydratedPebbleCardGroup {...props} />;
};

export default PebbleCardGroup;
