import type { JSX } from "react";
import { lazy, FunctionComponent, Suspense } from "react";
import URN from "@ppb/tbd-store/state/layout/URN";
import { ComponentProps } from "./props";
import Card from "../Card/Card.web";
import ConnectedCard from "../Card";
import styles from "./GameInfoPage.web.css";

const ConnectedBackNavigationItem = lazy(
  () => import(/* webpackChunkName: "BackNavigationItem" */ "../BackNavigationItem"),
);

const BackNavigationItem = lazy(
  () => import(/* webpackChunkName: "BackNavigationItem" */ "../BackNavigationItem/BackNavigationItem.web"),
);

function renderCard(urn: URN, typename: string): JSX.Element | null {
  switch (typename) {
    case "Footer":
      return (
        <div className={styles.footer}>
          <ConnectedCard key={urn} urn={urn} component={Card} typename={typename} />
        </div>
      );
    default:
      return <ConnectedCard key={urn} urn={urn} component={Card} typename={typename} />;
  }
}

const ConnectedGameInfoPage: FunctionComponent<ComponentProps> = ({ view }) => {
  const backNavigationTitle = view?.navigationItem?.title;

  return (
    <div>
      {backNavigationTitle && (
        <Suspense fallback={<></>}>
          <ConnectedBackNavigationItem component={BackNavigationItem} urn={view?.urn} />
        </Suspense>
      )}
      <div>{view?.items?.map(({ typename, urn }: { typename: string; urn: URN }) => renderCard(urn, typename))}</div>
    </div>
  );
};

export default ConnectedGameInfoPage;
