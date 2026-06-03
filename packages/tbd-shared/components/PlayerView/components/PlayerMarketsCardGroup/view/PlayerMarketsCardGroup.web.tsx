import React, { FunctionComponent } from "react";
import usePlayerMarketsCardGroupVM from "../viewmodel/PlayerMarketsCardGroup.viewmodel";
import ConnectedFixtureCard from "../../../../FixtureCard";
import FixtureCard from "../../../../FixtureCard/FixtureCard.web";
import ConnectedPebbleCardgroup from "../../../../PebbleCardGroup";
import PebbleCardGroup from "../../../../PebbleCardGroup/PebbleCardGroup.web";
import PebbleCardGroupPlaceholder from "../../../../PebbleCardGroup/PebbleCardGroupPlaceholder.web";
import styles from "./PlayerMarketsCardGroup.web.css";
import { useVisibilityObserver } from "../../../../../hooks/useVisibilityObserver.web";
import { Placeholder } from "@ppb/the-wall-web";
import FixtureCardPlaceholder from "../../../../FixtureCard/FixtureCardPlaceholder.web";

type WrapperProps = {
  title: string;
  children: React.ReactNode;
};

const CardWrapper: FunctionComponent<WrapperProps> = ({ title, children }) => (
  <div className={styles.card}>
    <h4 className={styles.title}>{title}</h4>
    {children}
  </div>
);

const FixtureWrapper: FunctionComponent<WrapperProps> = ({ title, children }) => (
  <CardWrapper title={title}>
    <div className={styles.fixture}>{children}</div>
  </CardWrapper>
);

type PlayerMarketsCardGroupProps = {
  urn: string;
  visible?: boolean;
};

const PlayerMarketsCardGroup: FunctionComponent<PlayerMarketsCardGroupProps> = ({ urn, visible = true }) => {
  const {
    loading,
    called,
    vm: { data, events },
  } = usePlayerMarketsCardGroupVM(urn, visible);

  const { observe } = useVisibilityObserver({
    onFirstShow: (urn) => {
      events?.fetchCards([urn]);
    },
  });

  if (!called || loading) return <Placeholder className={styles.placeholder} />;

  if (called && !data) return null;

  return (
    <div className={styles.container}>
      {data?.fixtureCard.urn && (
        <div ref={(node) => observe(node, data?.fixtureCard.urn)}>
          <FixtureWrapper title={data?.titles.fixture}>
            <ConnectedFixtureCard
              urn={data?.fixtureCard.urn}
              component={FixtureCard}
              iconsList={undefined}
              placeholder={FixtureCardPlaceholder}
            />
          </FixtureWrapper>
        </div>
      )}
      {!!data?.items.length && (
        <CardWrapper title={data?.titles.markets}>
          {data?.items.map((item) => (
            <div
              key={item.urn + "_div"}
              ref={(node) => {
                observe(node, item.urn);
              }}
            >
              <ConnectedPebbleCardgroup
                key={item.urn}
                urn={item.urn}
                component={PebbleCardGroup}
                placeholder={PebbleCardGroupPlaceholder}
              />
            </div>
          ))}
        </CardWrapper>
      )}
    </div>
  );
};

export default PlayerMarketsCardGroup;
