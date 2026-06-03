import type { FunctionComponent } from "react";
import SELECTORS from "./RaceMeetingView.selectors";
import { Placeholder } from "@ppb/the-wall-web";

const RaceMeetingViewPlaceholder: FunctionComponent = () => {
  return (
    <div data-testid={SELECTORS.PLACEHOLDER}>
      <Placeholder />
      <Placeholder />
      <Placeholder />
    </div>
  );
};

export default RaceMeetingViewPlaceholder;
