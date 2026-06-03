import { FunctionComponent, useCallback } from "react";
import { RaceViewLinkCard as RaceViewLinkCardComponent } from "./snowflakes/RaceViewLinkCard/RaceViewLinkCard.web";
import { ComponentProps } from "./props";

/**
 *
 * @param props The props mapped by mapStateToProps
 * @returns The react component
 */
const RaceViewLinkCard: FunctionComponent<ComponentProps> = ({ venue, viewLink, dispatchPushAction, countryFlag }) => {
  const onClickHandler = useCallback((): void => {
    dispatchPushAction(viewLink);
  }, [dispatchPushAction, viewLink]);

  return <RaceViewLinkCardComponent onClick={onClickHandler} title={venue} countryFlag={countryFlag} />;
};

export default RaceViewLinkCard;
