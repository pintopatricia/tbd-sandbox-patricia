import { useContext } from "react";
import * as React from "react";
import { BottomSheet, MarketBlurbs, Modal, SegmentedControl } from "@ppb/the-wall-web";

import { ObbFootballTeams } from "@ppb/tbd-store/state/layout/cards/obb-card/ObbCard.types";
import { ConfigContext } from "../Config/ConfigContext";
import styles from "./ObbPlayersModal.web.css";

type ObbPlayersModalProps = {
  children: React.ReactNode;
  onDismiss: () => void;
  title: string;
  participantInfo?: string;
  teams: ObbFootballTeams;
  selectedTeamId: string;
  handleTeamChange: (teamId: string) => void;
};

function ObbPlayersModal({
  children,
  onDismiss,
  title,
  participantInfo,
  teams,
  selectedTeamId,
  handleTeamChange,
}: ObbPlayersModalProps) {
  const { isDesktopLayout } = useContext(ConfigContext);

  if (isDesktopLayout) {
    return (
      <Modal onDismiss={onDismiss} dismissOnOutsideTap={true} title={title}>
        <div className={styles.container}>
          <div className={styles.playersModalHeader}>
            <SegmentedControl
              onClick={handleTeamChange}
              options={[
                { key: teams.home.id, value: teams.home.name },
                { key: teams.away.id, value: teams.away.name },
              ]}
              selectedOption={selectedTeamId}
            />
            <MarketBlurbs text={participantInfo} marketInfoCallback={() => {}} />
          </div>
          {children}
        </div>
      </Modal>
    );
  }

  return (
    <BottomSheet
      title={title}
      onHeaderIconTap={onDismiss}
      showOverlay={true}
      showContentFullHeight
      headerContent={
        <div className={styles.playersModalHeader}>
          <SegmentedControl
            onClick={handleTeamChange}
            options={[
              { key: teams.home.id, value: teams.home.name },
              { key: teams.away.id, value: teams.away.name },
            ]}
            selectedOption={selectedTeamId}
          />
          <MarketBlurbs text={participantInfo} marketInfoCallback={() => {}} />
        </div>
      }
    >
      {children}
    </BottomSheet>
  );
}

export default ObbPlayersModal;
