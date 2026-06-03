import { EntityType } from "@ppb/tbd-urn-codecs";
import { lazy, Suspense } from "react";
import UniversalRouter from "universal-router";
import ErrorPage from "../components/ErrorPage/ErrorPage";
import ConnectedGenericView from "../components/GenericView";
import { GenericView, GenericViewPlaceholder } from "../components/GenericView/GenericView.web";

const ConnectedBrowseSwitchExperience = lazy(
  () => import(/* webpackChunkName: "BrowseSwitchExperience" */ "../components/BrowseSwitchExperience"),
);

const ConnectedGameInfoPage = lazy(() => import(/* webpackChunkName: "GameInfoPage" */ "../components/GameInfoPage"));

const ConnectedMyBetsPage = lazy(() => import(/* webpackChunkName: "MyBetsPage" */ "../components/MyBetsPage"));

const ConnectedRaceViewPage = lazy(() => import(/* webpackChunkName: "RaceView" */ "../components/RaceView"));

const ConnectedMaintenancePage = lazy(
  () => import(/* webpackChunkName: "MaintenanceView" */ "../components/MaintenancePage"),
);

const ConnectedUserProfile = lazy(() => import(/* webpackChunkName: "UserProfilePage" */ "../components/UserProfile"));
const ConnectedNotFoundView = lazy(() => import(/* webpackChunkName: "NotFoundView" */ "../components/NotFoundView"));

const ConnectedImsPromotionModal = lazy(
  () => import(/* webpackChunkName: "ImsPromotionModal" */ "../components/ImsPromotionModal"),
);

const PlayerViewPage = lazy(
  () => import(/* webpackChunkName: "PlayerView" */ "../components/PlayerView/view/PlayerView.web"),
);

const buildRouter = (): UniversalRouter =>
  new UniversalRouter(
    [
      {
        path: [
          new RegExp(`${EntityType.GenericView}$`),
          new RegExp(`${EntityType.GamingSegmentationView}$`),
          new RegExp(`${EntityType.PromotionsView}$`),
          new RegExp(`${EntityType.SettingsView}$`),
          new RegExp(`${EntityType.GamingCategoryView}$`),
          new RegExp(`${EntityType.GamingView}$`),
          new RegExp(`${EntityType.AllCompetitionsView}$`),
          new RegExp(`${EntityType.MarketView}$`),
          new RegExp(`${EntityType.AllMarketsView}$`),
          new RegExp(`${EntityType.EventView}$`),
          new RegExp(`${EntityType.CompetitionView}$`),
          new RegExp(`${EntityType.SportView}$`),
          new RegExp(`${EntityType.AllMatchesRacesView}$`),
          new RegExp(`${EntityType.CouponView}$`),
          new RegExp(`${EntityType.SelfExcludedView}`),
          new RegExp(`${EntityType.ObbLandingPageView}$`),
          new RegExp(`${EntityType.CouponsByDayView}$`),
          new RegExp(`${EntityType.PromotionsHubView}$`),
        ],
        async action({ urn }) {
          // @ts-expect-error TODO Universal integration with placeholders still break on ts-jest
          return <ConnectedGenericView urn={urn} component={GenericView} placeholder={GenericViewPlaceholder} root />;
        },
      },
      {
        path: new RegExp(`${EntityType.RaceMeetingView}$`),
        async action({ urn }) {
          const RaceMeetingView = await import(
            /* webpackChunkName: "RaceMeetingView" */ "../components/RaceMeetingView/components/RaceMeetingView/view/RaceMeetingView.web"
          );
          return (
            <Suspense fallback={<></>}>
              <RaceMeetingView.default urn={urn} />
            </Suspense>
          );
        },
      },
      {
        path: new RegExp(`${EntityType.RaceView}$`),
        async action({ urn }) {
          const RaceView = await import(/* webpackChunkName: "RaceView" */ "../components/RaceView/RaceView.web");
          return (
            <Suspense fallback={<></>}>
              <ConnectedRaceViewPage urn={urn} component={RaceView.default} />
            </Suspense>
          );
        },
      },
      {
        path: new RegExp(`${EntityType.PlayerView}$`),
        async action({ urn }) {
          return (
            <Suspense fallback={<></>}>
              <PlayerViewPage urn={urn} />
            </Suspense>
          );
        },
      },
      {
        path: new RegExp(`${EntityType.MyBetsView}$`),
        async action({ urn }) {
          const MyBetsPage = await import(
            /* webpackChunkName: "MyBetsView" */ "../components/MyBetsPage/MyBetsPage.web"
          );
          return (
            <Suspense fallback={<></>}>
              <ConnectedMyBetsPage urn={urn} component={MyBetsPage.default} />
            </Suspense>
          );
        },
      },
      {
        path: new RegExp(`${EntityType.BrowseView}$`),
        async action({ urn }) {
          const BrowseSwitchExperience = await import(
            /* webpackChunkName: "BrowseSwitchExperience" */ "../components/BrowseSwitchExperience/BrowseSwitchExperience.web"
          );
          return (
            <Suspense fallback={<></>}>
              <ConnectedBrowseSwitchExperience urn={urn} component={BrowseSwitchExperience.default} />
            </Suspense>
          );
        },
      },
      {
        path: new RegExp(`${EntityType.GameView}$`),
        async action({ urn, gameCardUrn }) {
          const GameInfoPage = await import(
            /* webpackChunkName: "GameInfoPage" */ "../components/GameInfoPage/GameInfoPage.web"
          );
          return (
            <Suspense fallback={<></>}>
              <ConnectedGameInfoPage urn={urn} component={GameInfoPage.default} gameCardUrn={gameCardUrn} />
            </Suspense>
          );
        },
      },
      {
        path: new RegExp(`${EntityType.MyAccountView}$`),
        async action() {
          const UserProfileWeb = await import(
            /* webpackChunkName: "UserProfileView" */ "../components/UserProfile/UserProfile.web"
          );
          return (
            <Suspense fallback={<></>}>
              <ConnectedUserProfile component={UserProfileWeb.UserProfileWeb} />
            </Suspense>
          );
        },
      },
      {
        path: new RegExp(`${EntityType.MaintenanceView}$`),
        action: async ({ urn }) => {
          const MaintenancePage = await import(
            /* webpackChunkName: "MaintenanceView" */ "../components/MaintenancePage/MaintenancePage.web"
          );
          return (
            <Suspense fallback={<></>}>
              <ConnectedMaintenancePage urn={urn} component={MaintenancePage.default} />
            </Suspense>
          );
        },
      },
      {
        path: new RegExp(`${EntityType.ImsPromotionView}$`),
        async action({ urn }) {
          const ImsPromotionModal = await import(
            /* webpackChunkName: "ImsPromotionModal" */ "../components/ImsPromotionModal/ImsPromotionModal.web"
          );
          return (
            <Suspense fallback={<></>}>
              <ConnectedImsPromotionModal component={ImsPromotionModal.default} urn={urn} />
            </Suspense>
          );
        },
      },
      {
        path: new RegExp(`${EntityType.NotFoundView}$`),
        async action({ urn }) {
          const NotFoundView = await import(
            /* webpackChunkName: "NotFoundView" */ "../components/NotFoundView/NotFoundView.web"
          );
          return (
            <Suspense fallback={<></>}>
              <ConnectedNotFoundView urn={urn} component={NotFoundView.default} />
            </Suspense>
          );
        },
      },
    ],
    {
      errorHandler(error) {
        console.error(error);

        if (error.status === 404) {
          return <ErrorPage error="Page Not Found" />;
        }

        if (error.status === 401) {
          return <ErrorPage error="Unauthorized to view this page" />;
        }

        return <ErrorPage error="Oops! Something went wrong" />;
      },
    },
  );

export default buildRouter;
