import { useContext } from "react";
import { ScrollableSwimlane } from "@ppb/the-wall-web";
import styles from "../ObbOnboardingCardsCardGroup.web.css";
import { ConfigContext } from "../../Config/ConfigContext";
import ObbOnboardingCardPlaceholder from "../../ObbOnboardingCard/placeholder/ObbOnboardingCardPlaceholder.web";

const PLACEHOLDER_CARDS = [1, 2, 3];

const ObbOnboardingCardsCardGroupPlaceholder = () => {
  const { isDesktopLayout } = useContext(ConfigContext);

  return (
    <ScrollableSwimlane title="" isDesktopLayout={isDesktopLayout} snap>
      {PLACEHOLDER_CARDS.map((key) => (
        <div key={key} className={styles.card}>
          <ObbOnboardingCardPlaceholder />
        </div>
      ))}
    </ScrollableSwimlane>
  );
};

export default ObbOnboardingCardsCardGroupPlaceholder;
