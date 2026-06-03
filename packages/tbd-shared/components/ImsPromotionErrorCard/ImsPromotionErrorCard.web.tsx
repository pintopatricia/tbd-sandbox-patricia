import { FunctionComponent, useCallback, useEffect } from "react";
import { LoadedComponentProps } from "./props";
import styles from "./ImsPromotionErrorCard.web.css";
import { PromoMessageCard } from "./snowflakes/PromoMessageCard/PromoMessageCard.web";

const ImsPromotionErrorCard: FunctionComponent<LoadedComponentProps> = ({
  title,
  body,
  type,
  i18n,
  seeAllLink,
  dispatchPushAction,
  dispatchNavigateToSeeAllPromotions,
  dispatchSawPromotionError,
}) => {
  useEffect(() => {
    dispatchSawPromotionError(title);
  }, [title, type, body, dispatchSawPromotionError]);

  const onSeeAll = useCallback((): void => {
    if (seeAllLink) {
      dispatchNavigateToSeeAllPromotions(seeAllLink);
      dispatchPushAction(seeAllLink);
    }
  }, [dispatchNavigateToSeeAllPromotions, dispatchPushAction, seeAllLink]);
  return (
    <div className={styles.container}>
      <PromoMessageCard title={title} body={body} type={type} i18n={i18n} onSeeAll={onSeeAll} />
    </div>
  );
};

export default ImsPromotionErrorCard;
