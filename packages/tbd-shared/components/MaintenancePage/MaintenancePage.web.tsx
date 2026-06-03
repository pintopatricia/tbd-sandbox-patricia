import { FC, useCallback, useEffect, useMemo } from "react";
import { QuickLink } from "@ppb/the-wall-web";
import { GenericIcon, GenericIconProps } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { SystemIconName } from "@ppb/the-wall-icons";
import { SplashStatus } from "@ppb/tbd-store/state/layout/views/View.types";
import { ProductsOption } from "@ppb/tbd-store/state/entities/user-preferences/UserPreferences.types";
import { ComponentProps } from "./props";
import RegulatoryCard from "../RegulatoryCard/RegulatoryCard.web";
import ConnectedRegulatoryCard from "../RegulatoryCard";
import styles from "./MaintenancePage.web.css";
import { Product } from "./map-to-props-factory";
import { getQuicklinkRoundCorners } from "../../helpers/quicklink";

const iconPropsBy: IconPropsByStatus = {
  OK: {
    name: SystemIconName.NOTIFICATION_SUCCESS,
    color: "var(--messaging-success-icon-default)",
  },
  SPLASHED: {
    name: SystemIconName.NOTIFICATION_WARNING,
    color: "var(--quick-link-primary-default-icon-error-colour)",
  },
};
type IconPropsByStatus = Record<SplashStatus, GenericIconProps>;

type SplashedLinkProps = Product & Pick<ComponentProps, "isExchangeEnabled" | "dispatchToEMS" | "dispatchToProduct">;

const SplashedLink: FC<SplashedLinkProps> = ({
  product,
  status,
  viewLink,
  title,
  isExchangeEnabled,
  dispatchToProduct,
  dispatchToEMS,
  roundCorners,
}) => {
  const item = useMemo(() => ({ text: title }), [title]);

  const onLinkClick = useCallback(() => {
    if (product === ProductsOption.exchange && !isExchangeEnabled) {
      dispatchToEMS();
      return;
    }

    dispatchToProduct({ product, viewLink });
  }, [dispatchToProduct, product, viewLink, isExchangeEnabled, dispatchToEMS]);

  const icon = (
    <div className={styles.icon}>
      <GenericIcon {...iconPropsBy[status]} />
    </div>
  );

  return (
    <QuickLink
      icon={icon}
      item={item}
      roundCorners={roundCorners}
      onLinkClick={status === "OK" ? onLinkClick : undefined}
    />
  );
};

type SplashedProps = Pick<
  ComponentProps,
  | "urn"
  | "twitterURL"
  | "text"
  | "products"
  | "isExchangeEnabled"
  | "dispatchToEMS"
  | "dispatchToProduct"
  | "dispatchFetchCatalogue"
>;

const Splashed: FC<SplashedProps> = ({
  urn,
  twitterURL,
  text,
  products,
  isExchangeEnabled,
  dispatchToProduct,
  dispatchToEMS,
  dispatchFetchCatalogue,
}) => {
  useEffect(() => {
    const timer = setInterval(() => {
      dispatchFetchCatalogue(urn);
    }, 60000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.wrap}>
        <h1 className={styles.title}>{text.pageTitle}</h1>
        <p className={styles.description}>{text.description}</p>
      </div>

      <div className={styles.wrap}>
        <h2 className={styles.title}>{text.productsTitle}</h2>
        <div className={styles.links}>
          {products.map((maintenanceProduct, index) => {
            const roundCorners = getQuicklinkRoundCorners(products, index);

            return (
              <SplashedLink
                key={maintenanceProduct.product}
                isExchangeEnabled={isExchangeEnabled}
                {...maintenanceProduct}
                dispatchToProduct={dispatchToProduct}
                dispatchToEMS={dispatchToEMS}
                roundCorners={roundCorners}
              />
            );
          })}
        </div>
      </div>
      {twitterURL ? (
        <>
          <p className={styles.twitterTitle}>{text.twitter}</p>
          <div className={styles.iframeWrap}>
            <iframe title={text.iframeTitle} src={twitterURL} className={styles.iframe} scrolling="no" />
          </div>
        </>
      ) : null}

      <ConnectedRegulatoryCard component={RegulatoryCard} urn={"ppb:tbd:card:regulatory:footer"} />
    </div>
  );
};

const Redirect: FC<{
  url: ComponentProps["webSplashURL"];
  dispatchRedirect: ComponentProps["dispatchExternalPushAction"];
}> = ({ url, dispatchRedirect }) => {
  dispatchRedirect(`${url}?ref=${window.location.href}`);
  return null;
};

const MaintenancePage: FC<ComponentProps> = ({
  urn,
  webSplashURL,
  twitterURL,
  text,
  products,
  isExchangeEnabled,
  dispatchExternalPushAction,
  dispatchToProduct,
  dispatchToEMS,
  dispatchFetchCatalogue,
}) => {
  if (webSplashURL) {
    return <Redirect url={webSplashURL} dispatchRedirect={dispatchExternalPushAction} />;
  }

  return (
    <Splashed
      urn={urn}
      text={text}
      products={products}
      twitterURL={twitterURL}
      isExchangeEnabled={isExchangeEnabled}
      dispatchToEMS={dispatchToEMS}
      dispatchToProduct={dispatchToProduct}
      dispatchFetchCatalogue={dispatchFetchCatalogue}
    />
  );
};

export default MaintenancePage;
