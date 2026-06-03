import { lazy, FunctionComponent, Suspense } from "react";
import { ComponentProps } from "./props";
import ConnectedGenericView from "../GenericView";
import { GenericView, GenericViewPlaceholder } from "../GenericView/GenericView.web";

const ConnectedBrowse = lazy(() => import(/* webpackChunkName: "BrowseView" */ "../BrowsePage"));
const BrowsePage = lazy(() => import(/* webpackChunkName: "BrowseView" */ "../BrowsePage/BrowsePage.web"));

const BrowseSwitchExperience: FunctionComponent<ComponentProps> = ({ browsePagePrismic, urn }) => {
  if (!browsePagePrismic) {
    return (
      <Suspense fallback={<></>}>
        <ConnectedBrowse urn={urn} component={BrowsePage} />
      </Suspense>
    );
  }

  return (
    <>
      {
        // @ts-expect-error TODO Universal integration with placeholders still break on ts-jest
        <ConnectedGenericView urn={urn} component={GenericView} placeholder={GenericViewPlaceholder} />
      }
    </>
  );
};

export default BrowseSwitchExperience;
