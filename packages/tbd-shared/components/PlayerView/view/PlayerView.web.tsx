import { useEffect, type FunctionComponent } from "react";
import { i18n } from "../../../helpers/i18n";
import type { PlayerViewHeader } from "./PlayerView.types";
import usePlayerViewVM from "../viewmodel/PlayerView.viewmodel";
import styles from "./PlayerView.web.css";
import FootballPlayerCompetitionStatsCard from "../components/FootballPlayerCompetitionStatsCard/view/FootballPlayerCompetitionStatsCard.web";
import ConnectedRegulatoryCard from "../../RegulatoryCard";
import RegulatoryCard from "../../RegulatoryCard/RegulatoryCard.web";
import RegulatoryCardPlaceholder from "../../RegulatoryCard/RegulatoryCardPlaceholder.web";
import { useVisibilityObserver } from "../../../hooks/useVisibilityObserver.web";
import PlayerMarketsCardGroup from "../components/PlayerMarketsCardGroup/view/PlayerMarketsCardGroup.web";

const PlayerViewHeader: FunctionComponent<PlayerViewHeader> = ({ name, position, shirtNumber }) => {
  return (
    <div className={styles.header}>
      <div className={styles.playerInfo}>
        <div className={styles.playerName}>{name}</div>
        {position ? <div className={styles.playerPosition}>{position}</div> : null}
      </div>

      {shirtNumber ? <div className={styles.playerShirtNumber}>{shirtNumber}</div> : null}
    </div>
  );
};

const renderPlayerViewItem = (typename: string, urn: string, visible: boolean = false): React.ReactNode => {
  switch (typename) {
    case "FootballPlayerCompetitionStatsCard":
      return <FootballPlayerCompetitionStatsCard key={urn} urn={urn} visible={visible} />;
    case "PlayerMarketsCardGroup":
      return <PlayerMarketsCardGroup key={urn} urn={urn} visible={visible} />;
    case "RegulatoryCard":
      return (
        <ConnectedRegulatoryCard
          key={urn}
          urn={urn}
          component={RegulatoryCard}
          placeholder={RegulatoryCardPlaceholder}
        />
      );
    default:
      return <></>;
  }
};

const PlayerView: FunctionComponent<{ urn: string }> = ({ urn }) => {
  const {
    vm: { data: vmData, events },
    loading,
  } = usePlayerViewVM(urn);

  const { observe, visibility } = useVisibilityObserver({
    onFirstShow: (urn) => {
      // Only needed because regulatoryCard is not an apollo component
      const item = vmData?.items?.find((item) => item.urn === urn);
      if (["RegulatoryCard"].includes(item?.__typename ?? "")) {
        events?.fetchCards([urn]);
      }
    },
  });

  useEffect(() => {
    events?.fetchBars(urn);
  }, [events, urn]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingLabel}>{i18n({ key: "I18N.STATE_INIDICATOR.SPLASH_SCREEN_TITLE" })}</div>
      </div>
    );
  }

  if (!vmData?.viewHeader) return null;

  return (
    <div className={styles.container}>
      <PlayerViewHeader
        name={vmData.viewHeader.name}
        position={vmData.viewHeader.position}
        shirtNumber={vmData.viewHeader.shirtNumber}
      />
      {vmData.items?.map((item) => {
        return (
          <div key={item?.urn + "_observer"} ref={(node) => observe(node, item.urn)}>
            {renderPlayerViewItem(item.__typename, item.urn, !!visibility[item.urn])}
          </div>
        );
      })}
    </div>
  );
};

export default PlayerView;
