import { UI__ACCEPT_CONFIRMATION, UI__REFUSE_CONFIRMATION } from "@ppb/tbd-store/actions/confirmation";
import { ComponentTheme } from "@ppb/the-wall-common/types";
import { ConfirmDrawer } from "@ppb/the-wall-web";
import { FunctionComponent, useCallback, useContext } from "react";
import { ComponentProps } from "./props";
import { ConfigContext } from "../../Config/ConfigContext";

export const ConfirmationDrawer: FunctionComponent<ComponentProps> = ({
  drawerRef,
  title,
  subtitle,
  refuse,
  accept,
  refuseActions,
  acceptActions,
  dispatchActions,
}) => {
  const { isDesktopLayout } = useContext(ConfigContext);

  const onRefuseTap = useCallback(
    (clickedOutside: boolean) => {
      const refuseActionsMap = refuseActions.map((refuseAction) => ({
        ...refuseAction,
        payload: {
          ...refuseAction.payload,
          clickedOutside,
        },
      }));
      dispatchActions([...refuseActionsMap, { type: UI__REFUSE_CONFIRMATION, payload: { clickedOutside } }], refuse);
    },
    [refuseActions, dispatchActions, refuse],
  );

  const onAcceptTap = useCallback(() => {
    dispatchActions([...acceptActions, { type: UI__ACCEPT_CONFIRMATION }], accept);
  }, [acceptActions, dispatchActions, accept]);

  return (
    <ConfirmDrawer
      drawerRef={drawerRef}
      title={title}
      subtitle={subtitle}
      refuseLabel={refuse}
      acceptLabel={accept}
      theme={ComponentTheme.Dark}
      onOutsideTap={() => onRefuseTap(true)}
      onRefuseTap={() => onRefuseTap(false)}
      onAcceptTap={onAcceptTap}
      isDesktop={isDesktopLayout}
    />
  );
};
