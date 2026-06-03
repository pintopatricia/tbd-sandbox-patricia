import type { FunctionComponent } from "react";
import { useCallback, useState } from "react";
import { ScrollView, View } from "react-native";

import { navigate } from "@ppb/tbd-router/native";
import { DisplayMode } from "@ppb/tbd-store/state/layout/views/ViewLink.types";
import { InfoLabelType } from "@ppb/the-wall-common/types";
import { MarketIconName, SystemIconName } from "@ppb/the-wall-icons";
import { EmptyState, InfoLabel, MarketPromo, Text } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";

import StatsContentCardPlaceholder from "../../StatsContentCardPlaceholder/StatsContentCardPlaceholder.native";
import type { StatsPlayersInPlayCardProps } from "../types/StatsPlayersInPlayCard.types";
import useStatsPlayersInPlayCardVM from "../viewmodel/StatsPlayersInPlayCard.viewmodel";

import StatsTable from "./snowflakes/StatsTable/StatsTable.native";
import { STATS_PLAYERS_CONTAINER, SCROLL_ITEM, INFO_LABEL } from "./StatsPlayersInPlayCard.selectors";
import styles from "./StatsPlayersInPlayCard.native.styles";

const StatsPlayersInPlayCard: FunctionComponent<StatsPlayersInPlayCardProps> = ({ urn, visible = true }) => {
  const [isShowMoreOpen, setIsShowMoreOpen] = useState(false);
  const {
    vm: { data, events },
    loading,
  } = useStatsPlayersInPlayCardVM(urn, visible);

  // TODO: StatsPlayersInPlayCard - scroll ?
  const onShowMore = useCallback(() => {
    setIsShowMoreOpen(!isShowMoreOpen);

    events.onExpandableClickButton(urn, !isShowMoreOpen);
  }, [events, isShowMoreOpen, urn]);

  const onTermsClick = useCallback(
    (title: string) => {
      const termsAndConditionsURL = data?.termsAndConditionsURL;

      if (termsAndConditionsURL) {
        events.onTermsTap(urn, termsAndConditionsURL, title);

        navigate({
          viewUrl: termsAndConditionsURL,
          viewUrn: "ppb:tbd:view:external:stats-t-c-sbg",
          viewDisplayMode: DisplayMode.BlankInapp,
        });
      }
    },
    [data?.termsAndConditionsURL, events, urn],
  );

  if (loading) {
    return <StatsContentCardPlaceholder />;
  }

  if (!data?.swimlaneItems?.some(({ tableEntries }) => !!tableEntries.length)) {
    return (
      <EmptyState
        isHighlighted={true}
        message={data?.translations?.emptyStateMessageGeneral}
        title={data?.translations.emptyStateTitle}
        hasImage={false}
      />
    );
  }

  return (
    <View style={styles.statsPlayersContainer} {...getTestProps(STATS_PLAYERS_CONTAINER, false)}>
      {data.timestamp && (
        <View {...getTestProps(INFO_LABEL, false)}>
          <InfoLabel
            iconName={SystemIconName.ACC_SUBTRACT}
            label={data.timestamp}
            infoLabelType={InfoLabelType.BRANDED}
          />
        </View>
      )}
      <ScrollView
        horizontal
        decelerationRate={0.98}
        showsHorizontalScrollIndicator={false}
        snapToInterval={styles.swimlaneContainer.width + styles.swimlaneContainer.marginRight}
      >
        {data.swimlaneItems?.map((item, index) => {
          const hasTableEntries = !!item.tableEntries.length;
          const hasShowMore = item.tableEntries.length > 5;
          const entriesToShow = isShowMoreOpen ? item.tableEntries : item.tableEntries.slice(0, 5);
          const isLastEntry = index === (data.swimlaneItems?.length ?? 0) - 1;

          return (
            <View
              style={[styles.swimlaneContainer, isLastEntry && styles.lastSwimlaneEntry]}
              key={item.stat}
              {...getTestProps(SCROLL_ITEM, false)}
            >
              <Text style={styles.title}>{item.title}</Text>
              {item.description && (
                <MarketPromo
                  variant="info"
                  title={item.title}
                  description={item.description}
                  linkText={data.translations?.termsConditions}
                  signposting={MarketIconName.MARKET_RULES}
                  onLinkClick={() => onTermsClick(item.title)}
                />
              )}
              {!hasTableEntries ? (
                <EmptyState
                  isHighlighted={true}
                  message={data.translations.emptyStateMessageSingleStat}
                  title={data.translations.emptyStateTitle}
                  hasImage={false}
                />
              ) : (
                <StatsTable
                  translations={data.translations}
                  bodyEntries={entriesToShow}
                  onShowMore={onShowMore}
                  hasShowMore={hasShowMore}
                  isShowMoreOpen={isShowMoreOpen}
                />
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default StatsPlayersInPlayCard;
