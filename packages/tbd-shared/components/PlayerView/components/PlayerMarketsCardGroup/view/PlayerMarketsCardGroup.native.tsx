import { FunctionComponent, isValidElement, ReactNode, useCallback, useMemo } from "react";
import { FlatList, View } from "react-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { Placeholder, Text } from "@ppb/the-wall-native";
import ConnectedFixtureCard from "../../../../FixtureCard";
import FixtureCard from "../../../../FixtureCard/FixtureCard.native";
import FixtureCardPlaceholder from "../../../../FixtureCard/FixtureCardPlaceholder.native";
import ConnectedPebbleCardgroup from "../../../../PebbleCardGroup";
import PebbleCardGroup from "../../../../PebbleCardGroup/PebbleCardGroup.native";
import PebbleCardGroupPlaceholder from "../../../../PebbleCardGroup/PebbleCardGroupPlaceholder.native";
import usePlayerMarketsCardGroupVM from "../viewmodel/PlayerMarketsCardGroup.viewmodel";
import {
  PLAYER_MARKETS_CONTAINER,
  SECTION_CONTAINER,
  SECTION_TITLE,
  FIXTURE_CONTAINER,
} from "./PlayerMarketsCardGroup.native.selectors";
import styles, { sectionStyles } from "./PlayerMarketsCardGroup.native.styles";
import { useNativeLazyLoading } from "../../../../../hooks/useNativeLazyLoading.native";
import { PartialItem } from "@ppb/tbd-store";
import { RenderItem } from "../../../../FlatList.native";

const SectionWrapper: FunctionComponent<{ title: string; children: ReactNode }> = ({ title, children }) => (
  <View style={sectionStyles.container} {...getTestProps(SECTION_CONTAINER, false)}>
    <Text style={sectionStyles.title} {...getTestProps(SECTION_TITLE, false)}>
      {title}
    </Text>
    {children}
  </View>
);

type PlayerMarketsCardGroupProps = {
  urn: string;
  visible?: boolean;
};

type PebbleMarketCardGroupItems = {
  urn: string;
  __typename: string;
  typename: string;
  visible: boolean;
};

const renderPlayerMarketsCardGroupItem = (typename: string, urn: string): ReactNode => {
  switch (typename) {
    case "FixtureCard":
      return (
        <ConnectedFixtureCard
          urn={urn}
          component={FixtureCard}
          placeholder={FixtureCardPlaceholder}
          iconsList={undefined}
        />
      );
    case "PebbleCardGroup":
      return (
        <ConnectedPebbleCardgroup urn={urn} component={PebbleCardGroup} placeholder={PebbleCardGroupPlaceholder} />
      );
    default:
      return null;
  }
};

const PlayerMarketsCardGroup: FunctionComponent<PlayerMarketsCardGroupProps> = ({ urn, visible = true }) => {
  const {
    loading,
    called,
    vm: { data, events },
  } = usePlayerMarketsCardGroupVM(urn, visible);
  const marketsList = useMemo<PebbleMarketCardGroupItems[]>(
    () => (data?.items ?? []).map((item) => ({ ...item, typename: item.__typename, visible: false })),
    [data?.items],
  );

  const fixtureCard = data?.fixtureCard;
  const fixtureList = useMemo<PebbleMarketCardGroupItems[]>(
    () => (fixtureCard ? [{ ...fixtureCard, typename: fixtureCard.__typename, visible: false }] : []),
    [fixtureCard],
  );

  const itemsList = useMemo<PebbleMarketCardGroupItems[]>(
    () => [...fixtureList, ...marketsList],
    [fixtureList, marketsList],
  );

  const onViewableItemsChangedCallback = useCallback(
    (urn: string, partialItems: PartialItem[]) => {
      // Filter non apollo component
      const item = partialItems.find((item) => item.urn === urn);
      if (item) {
        events?.fetchCards([urn]); // Non apollo component fetch
      }
    },
    [events],
  );

  const onViewableItemsChanged = useNativeLazyLoading(itemsList, onViewableItemsChangedCallback);

  const renderItem = useCallback<RenderItem>(
    (component) => {
      if (component) {
        const item = itemsList.find((i) => i.urn === component.item.urn);
        const renderedItem = renderPlayerMarketsCardGroupItem(item?.__typename ?? "", item?.urn ?? "");
        return isValidElement(renderedItem) ? renderedItem : null;
      }
      return null;
    },
    [itemsList],
  );

  if (!called || loading) return <Placeholder style={styles.placeholder} />;

  if (called && !data) return null;

  return (
    <View style={styles.container} {...getTestProps(PLAYER_MARKETS_CONTAINER, false)}>
      {data?.fixtureCard.urn && (
        <SectionWrapper title={data?.titles.fixture}>
          <View style={sectionStyles.fixture} {...getTestProps(FIXTURE_CONTAINER, false)}>
            <FlatList
              style={styles.container}
              data={fixtureList}
              renderItem={renderItem}
              onViewableItemsChanged={onViewableItemsChanged}
            />
          </View>
        </SectionWrapper>
      )}

      {!!data?.items.length && (
        <SectionWrapper title={data?.titles.markets}>
          <FlatList
            style={styles.container}
            data={marketsList}
            renderItem={renderItem}
            onViewableItemsChanged={onViewableItemsChanged}
          />
        </SectionWrapper>
      )}
    </View>
  );
};

export default PlayerMarketsCardGroup;
