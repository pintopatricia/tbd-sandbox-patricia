import { FunctionComponent, useCallback, MouseEvent } from "react";
import { CompetitionHeader } from "./snowflakes/CompetitionHeader/CompetitionHeader.web";
import { ComponentProps } from "./props";

const CouponHeaderCard: FunctionComponent<ComponentProps> = ({
  title,
  titleLink,
  columns,
  showComponent,
  hasStats,
  dispatchRouterPushAction,
}) => {
  const onTitleClick = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();

      if (!titleLink) {
        return;
      }

      dispatchRouterPushAction(titleLink);
    },
    [titleLink, dispatchRouterPushAction],
  );

  if (!showComponent) {
    return null;
  }

  return (
    <CompetitionHeader
      title={title}
      titleLink={titleLink}
      columns={columns}
      onTitleClick={onTitleClick}
      hasStats={hasStats}
    />
  );
};

export default CouponHeaderCard;
