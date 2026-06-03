import { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { Placeholder } from "@ppb/the-wall-web/components/bricks/Placeholder/Placeholder";
import { ApplicationState } from "@ppb/tbd-store";
import styles from "./EventMarketCardPlaceholder.web.css";

const EventMarketCardPlaceholder: FunctionComponent = () => {
  const brandSettings = useSelector((state: ApplicationState) => state.entities.brandSettings);
  const alternativeLayout = brandSettings?.ENABLE_CIP_BANNER;

  return (
    <div className={alternativeLayout ? styles.placeholderForMinHeight : styles.placeholder} id="placeholder">
      <Placeholder />
    </div>
  );
};

export default EventMarketCardPlaceholder;
