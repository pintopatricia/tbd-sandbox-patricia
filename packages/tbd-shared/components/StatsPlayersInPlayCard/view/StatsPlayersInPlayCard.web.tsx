import type { FunctionComponent } from "react";
import { useCallback, useState } from "react";

import { InfoLabelType } from "@ppb/the-wall-common/types";
import { MarketIconName, SystemIconName } from "@ppb/the-wall-icons";
import { EmptyState, InfoLabel, MarketPromo, ScrollableSwimlane } from "@ppb/the-wall-web";

import StatsContentCardPlaceholder from "../../StatsContentCardPlaceholder/StatsContentCardPlaceholder.web";
import type { StatsPlayersInPlayCardProps } from "../types/StatsPlayersInPlayCard.types";
import useStatsPlayersInPlayCardVM from "../viewmodel/StatsPlayersInPlayCard.viewmodel";

import StatsTable from "./snowflakes/StatsTable/StatsTable.web";
import styles from "./StatsPlayersInPlayCard.web.css";

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

        window.open(termsAndConditionsURL, "_blank");
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
    <div className={styles.container}>
      {data.timestamp && (
        <InfoLabel
          iconName={SystemIconName.ACC_SUBTRACT}
          label={data.timestamp}
          infoLabelType={InfoLabelType.BRANDED}
        />
      )}
      <ScrollableSwimlane isDesktopLayout={window.innerWidth > 900} large snap>
        {data.swimlaneItems?.map((item) => {
          const hasTableEntries = !!item.tableEntries.length;
          const hasShowMore = item.tableEntries.length > 5;
          const entriesToShow = isShowMoreOpen ? item.tableEntries : item.tableEntries.slice(0, 5);

          return (
            <div className={styles.swimlaneContainer} key={item.stat}>
              <div className={styles.title}>{item.title}</div>
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
                  message={data.translations.emptyStateMessageSingleStat}
                  title={data.translations.emptyStateTitle}
                  hasImage={false}
                  isHighlighted={true}
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
            </div>
          );
        })}
      </ScrollableSwimlane>
    </div>
  );
};

export default StatsPlayersInPlayCard;
