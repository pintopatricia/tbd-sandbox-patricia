import { FunctionComponent, useCallback, useMemo } from "react";
import { View } from "react-native";
import { ScrollableSwimlane, StatusLabel } from "@ppb/the-wall-native";
import { StatusLabelSizeType, StatusLabelType, URN, ViewLink } from "@ppb/the-wall-common/types";
import { tokens } from "@ppb/the-wall-common/base-theme";
import { navigate } from "@ppb/tbd-router";
import ConnectedObbCreatedBetsCard from "../ObbCreatedBetsCard";
import ObbCreatedBetsCard from "../ObbCreatedBetsCard/ObbCreatedBetsCard.native";
import styles from "./ObbCreatedBetsCardGroup.native.styles";
import { ComponentProps } from "./ObbCreatedBetsCardGroup.props";
import { FlatList } from "../FlatList.native";

const CARD_WIDTH = tokens.SquadBetCardSecondaryWidth;
const CARD_GAP = tokens.ScrollableSwimlaneHeaderHorizontalGap.gap;

const ObbCreatedBetsCardGroup: FunctionComponent<ComponentProps> = ({
  urn: cardGroupUrn,
  cards,
  headerBadgeLabel,
  headerViewLink,
  headerViewLinkLabel,
  title,
  dispatchLinkClick,
}) => {
  const handleLinkClick = useCallback(
    (link: ViewLink, urn: URN, label: string) => {
      dispatchLinkClick(link, urn, label);

      navigate(link);
    },
    [dispatchLinkClick],
  );

  const keyExtractor = useCallback((item: { urn: string }) => item.urn, []);

  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: CARD_WIDTH,
      offset: (CARD_WIDTH + CARD_GAP) * index,
      index,
    }),
    [],
  );

  const cardCount = useMemo(() => cards.length, [cards]);

  const snapProps =
    cardCount >= 2
      ? {
          pagingEnabled: false,
          snapToInterval: CARD_WIDTH + CARD_GAP,
          decelerationRate: 0.98,
        }
      : {};

  const renderItem = ({
    item,
    index,
  }: {
    item: {
      urn: string;
    };
    index: number;
  }) => (
    <View style={[styles.cardWrapper, cardCount === 1 && styles.fullWidthWrapper]}>
      <ConnectedObbCreatedBetsCard
        component={ObbCreatedBetsCard}
        urn={item.urn}
        fullWidth={cardCount === 1}
        cardIndex={index}
      />
    </View>
  );

  return (
    <ScrollableSwimlane
      title={title}
      icon={
        headerBadgeLabel && (
          <View style={styles.statusLabelWrapper}>
            <View style={styles.statusLabelAbsolute}>
              <StatusLabel
                text={headerBadgeLabel}
                statusLabelSize={StatusLabelSizeType.SMALL}
                statusLabelType={StatusLabelType.COMPLIMENTARY}
              />
            </View>
          </View>
        )
      }
      iconPosition="after"
      onNavLinkPress={
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
    >
      <FlatList
        data={cards}
        horizontal
        scrollEnabled={cardCount !== 1}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsHorizontalScrollIndicator={false}
        getItemLayout={cardCount >= 2 ? getItemLayout : undefined}
        contentContainerStyle={[styles.scrollContent, cardCount === 1 && styles.noGapContent]}
        {...snapProps}
      />
    </ScrollableSwimlane>
  );
};

export default ObbCreatedBetsCardGroup;
