import { useContext } from "react";
import { ScrollableSwimlane } from "@ppb/the-wall-web";
import styles from "../ObbCreatedBetsCardGroup.web.css";
import { ConfigContext } from "../../Config/ConfigContext";
import ObbCreatedBetsCardPlaceholder from "../../ObbCreatedBetsCard/placeholder/ObbCreatedBetsCardPlaceholder.web";

const ObbCreatedBetsCardGroupPlaceholder = () => {
  const { isDesktopLayout } = useContext(ConfigContext);

  return (
    <ScrollableSwimlane title="" isDesktopLayout={isDesktopLayout} snap>
      {[1, 2, 3].map((key) => (
        <div key={key} className={styles.card}>
          <ObbCreatedBetsCardPlaceholder />
        </div>
      ))}
    </ScrollableSwimlane>
  );
};

export default ObbCreatedBetsCardGroupPlaceholder;
