import { FunctionComponent, useCallback } from "react";
import { navigate } from "@ppb/tbd-router/native";
import { RaceViewLinkCard as RaceViewLinkCardComponent } from "./snowflakes/RaceViewLinkCard/RaceViewLinkCard.native";
import { ComponentProps } from "./props";

const RaceViewLinkCard: FunctionComponent<ComponentProps> = ({ venue, countryFlag, viewLink, dispatchPushAction }) => {
  const onPressHandler = useCallback((): void => {
    dispatchPushAction(viewLink);
    navigate(viewLink);
  }, [dispatchPushAction, viewLink]);

  return <RaceViewLinkCardComponent onClick={onPressHandler} title={venue} countryFlag={countryFlag} />;
};

export default RaceViewLinkCard;
