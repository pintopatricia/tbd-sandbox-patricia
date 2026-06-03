import { FunctionComponent } from "react";
import classNames from "classnames";
import styles from "./InlineMarketRunner.web.css";
import ConnectedSportsbookBetButton from "../SportsbookBetButton";
import SportsbookBetButton from "../SportsbookBetButton/SportsbookBetButton.web";
import { InlineMarketRunnerWebViewModel } from "./InlineMarketRunner.web.types";

const InlineMarketRunner: FunctionComponent<InlineMarketRunnerWebViewModel> = ({
  runner,
  cardUrn,
  marketOpen,
  marketUrn,
  isSecondaryLabelRunnerName = false,
  isSecondaryLabelUppercase = false,
  showHandicap = false,
}) => {
  const showHandicapLabel = marketOpen && !!runner.handicapLabel && !isSecondaryLabelRunnerName;
  const inlineMarketRunnerClasses = classNames(styles.container, {
    [styles.marketContainer]: isSecondaryLabelRunnerName,
  });

  return (
    <div className={inlineMarketRunnerClasses}>
      {showHandicapLabel && (
        <div className={styles.labels}>
          <span className={`typography-h120 ${styles.handicap}`}>{runner.handicapLabel}</span>
        </div>
      )}
      <div className={styles.betButtonContainer}>
        <ConnectedSportsbookBetButton
          runnerUrn={runner.urn}
          marketUrn={marketUrn}
          component={SportsbookBetButton}
          displayPreviousOdd={false}
          cardUrn={cardUrn}
          isSecondaryLabelRunnerName={isSecondaryLabelRunnerName}
          isSecondaryLabelUppercase={isSecondaryLabelUppercase}
          handicapLabel={showHandicap ? runner.handicapLabel : undefined}
        />
      </div>
    </div>
  );
};

export default InlineMarketRunner;
