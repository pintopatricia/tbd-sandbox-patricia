import { FunctionComponent } from "react";
import { ComponentProps } from "./props";
import { useSubscribeToRaceUpdates } from "./useSubscribeToRaceUpdates";
import ConnectedGenericView from "../GenericView";
import { GenericView, GenericViewPlaceholder } from "../GenericView/GenericView.web";
import RaceMeetingView from "../RaceMeetingView/components/RaceMeetingView/view/RaceMeetingView.web";

const SubscribedRaceView: FunctionComponent<ComponentProps> = (props) => {
  useSubscribeToRaceUpdates(props);
  return null;
};

const RaceView: FunctionComponent<ComponentProps> = ({
  urn,
  raceStatus,
  resultType,
  raceURN,
  dispatchFetchCatalogue,
  dispatchSubscribeRaceUpdates,
  dispatchUnsubscribeRaceUpdates,
  isRaceViewActive,
  isRaceMeetingViewActive,
}) => {
  if (isRaceMeetingViewActive) {
    return <RaceMeetingView urn={urn} />;
  }

  return (
    <>
    {isRaceViewActive ? (
      <SubscribedRaceView
        urn={urn}
        raceStatus={raceStatus}
        resultType={resultType}
        raceURN={raceURN}
        dispatchFetchCatalogue={dispatchFetchCatalogue}
        dispatchSubscribeRaceUpdates={dispatchSubscribeRaceUpdates}
        dispatchUnsubscribeRaceUpdates={dispatchUnsubscribeRaceUpdates}
      />
    ) : null}
    {
      // @ts-expect-error TODO Universal integration with placeholders still break on ts-jest
      <ConnectedGenericView urn={urn} component={GenericView} placeholder={GenericViewPlaceholder} root />
    }
  </>
  );
};

export default RaceView;
