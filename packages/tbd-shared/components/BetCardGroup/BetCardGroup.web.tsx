import { FunctionComponent } from "react";
import classnames from "classnames";
import { ComponentProps } from "./props";
import ConnectedCard from "../Card";
import Card from "../Card/Card.web";
import ConnectedFixtureCard from "../FixtureCard";
import MyBetsFixtureCard from "../FixtureCard/MyBetsFixture/MyBetsFixtureCard.web";
import FixtureCardPlaceholder from "../FixtureCard/FixtureCardPlaceholder.web";
import styles from "./BetCardGroup.web.css";

const FIXTURE_CARDS_TYPES = ["FixtureCard", "EventHeaderCard"];

const BetCardGroup: FunctionComponent<ComponentProps> = ({ items }) => (
  <div className={styles.betCardGroup}>
    {items?.map(({ urn, typename }) => {
      const cardGroupItemStyle = classnames(styles.groupItem, {
        [styles.fixtureCardGroupItem]: FIXTURE_CARDS_TYPES.includes(typename),
        [styles.marketBetCardGroupItem]: typename === "MarketBetCardGroup",
      });

      return (
        <div className={cardGroupItemStyle} key={urn}>
          {/* 
            Using a different fixture component to drop all unnecessary 
            data fetching for My Bets.
          */}
          {typename === "FixtureCard" ? (
            <ConnectedFixtureCard
              urn={urn}
              component={MyBetsFixtureCard}
              placeholder={FixtureCardPlaceholder}
              iconsList={undefined}
            />
          ) : (
            <ConnectedCard key={urn} urn={urn} component={Card} typename={typename} />
          )}
        </div>
      );
    })}
  </div>
);
export default BetCardGroup;
