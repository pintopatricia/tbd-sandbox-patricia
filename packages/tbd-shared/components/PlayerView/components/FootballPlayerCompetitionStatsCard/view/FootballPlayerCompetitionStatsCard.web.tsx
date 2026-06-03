import { FunctionComponent } from "react";
import { Collapse, Placeholder } from "@ppb/the-wall-web";
import useFootballPlayerCompetitionStatsCardVM from "../viewmodel/FootballPlayerCompetitionStatsCard.viewmodel";
import styles from "./FootballPlayerCompetitionStatsCard.web.css";

const CompetitionStat = ({ label, value }: { label: string; value: number | undefined }) => (
  <div className={styles.statItem}>
    <div className={styles.statLabel}>{label}</div>
    <div className={styles.statValue}>{value ?? "-"}</div>
  </div>
);

const FootballPlayerCompetitionStatsCard: FunctionComponent<{ urn: string; visible: boolean }> = ({ urn, visible }) => {
  const {
    vm: { data },
    loading,
    called,
  } = useFootballPlayerCompetitionStatsCardVM(urn, visible);

  if (!called || loading) {
    return <Placeholder className={styles.placeholder} />;
  }
  if (called && !data?.stats) {
    return <div className={styles.noStatsLabel}>No season stats available.</div>;
  }

  const { stats } = data ?? {};

  return (
    <div className={styles.container}>
      <p className={styles.statTitle}>Performance</p>
      <div className={styles.collapseWrapper}>
        <Collapse
          header={
            <div className={styles.collapseHeader}>
              <p>Competition Stats</p>
            </div>
          }
          isOpen={true}
          setIsOpen={() => {}}
        >
          <div className={styles.stats}>
            <CompetitionStat label="Goals" value={stats?.totalGoals} />
            <CompetitionStat label="Assists" value={stats?.totalAssists} />
            <CompetitionStat label="Cards" value={stats?.totalCards} />
          </div>
        </Collapse>
      </div>
    </div>
  );
};

export default FootballPlayerCompetitionStatsCard;
