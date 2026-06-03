import { getByTestId, render, waitFor } from "@testing-library/react";
import ConnectedBrowseSwitchExperience from "../components/BrowseSwitchExperience";
import BrowseSwitchExperience from "../components/BrowseSwitchExperience/BrowseSwitchExperience.web";
import ErrorPage from "../components/ErrorPage/ErrorPage";
import ConnectedGameInfoPage from "../components/GameInfoPage";
import GameInfoPage from "../components/GameInfoPage/GameInfoPage.web";
import ConnectedGenericView from "../components/GenericView";
import ConnectedRaceView from "../components/RaceView";
import RaceView from "../components/RaceView/RaceView.web";
import PlayerView from "../components/PlayerView/view/PlayerView.web";
import { GenericView, GenericViewPlaceholder } from "../components/GenericView/GenericView.web";
import ConnectedMaintenancePage from "../components/MaintenancePage";
import MaintenancePage from "../components/MaintenancePage/MaintenancePage.web";
import ConnectedMyBetsPage from "../components/MyBetsPage";
import MyBetsPage from "../components/MyBetsPage/MyBetsPage.web";
import ConnectedImsPromotionModal from "../components/ImsPromotionModal";
import ImsPromotionModal from "../components/ImsPromotionModal/ImsPromotionModal.web";
import buildRouter from "./routes";

const GENERIC_VIEW_TESTID = "generic-view";

jest.spyOn(global.console, "error").mockImplementation(() => jest.fn());
jest.mock("../components/ErrorPage/ErrorPage", () => jest.fn(() => <error-page />));
jest.mock("../components/GenericView", () =>
  jest.fn(() => <generic-view-connected data-testid={GENERIC_VIEW_TESTID} />),
);
jest.mock("../components/GenericView/GenericView.web", () => ({
  GenericView: jest.fn(() => <generic-view />),
  GenericViewPlaceholder: jest.fn(() => <generic-view-placeholder />),
}));
jest.mock("../components/GameInfoPage/", () =>
  jest.fn(() => <connected-game-info-page data-testid="game-info-page" />),
);
jest.mock("../components/GameInfoPage/GameInfoPage.web", () => jest.fn(() => <game-info-page />));
jest.mock("../components/MyBetsPage", () => jest.fn(() => <my-bets-page-connected data-testid="my-bets-page" />));
jest.mock("../components/MyBetsPage/MyBetsPage.web", () => jest.fn(() => <my-bets-page />));
jest.mock("../components/BrowseSwitchExperience", () =>
  jest.fn(() => <browse-switch-experience-connected data-testid="browse-switch-experience" />),
);
jest.mock("../components/BrowseSwitchExperience/BrowseSwitchExperience.web", () =>
  jest.fn(() => <browse-switch-experience />),
);
jest.mock("../components/MaintenancePage", () => jest.fn(() => <maintenance-page />));
jest.mock("../components/MaintenancePage/MaintenancePage.web", () => jest.fn(() => <maintenance-page-web />));
jest.mock("../components/UserProfile/UserProfile.web", () => jest.fn(() => <user-profile-page />));
jest.mock("../components/ImsPromotionModal", () =>
  jest.fn(() => <ims-promotion-modal data-testid="promotional-modal-page" />),
);
jest.mock("../components/ImsPromotionModal/ImsPromotionModal.web", () => jest.fn(() => <promotional-modal-web />));
jest.mock("../components/GenericView", () => jest.fn(() => <connected-generic-view-mock data-testid="generic-view" />));
jest.mock("../components/GenericView/GenericView.web", () => ({
  GenericView: jest.fn(() => <generic-view-mock />),
  GenericViewPlaceholder: jest.fn(() => <generic-view-placeholder-mock />),
}));

jest.mock("../components/RaceView", () => jest.fn(() => <connected-race-view-mock data-testid="race-view" />));
jest.mock("../components/RaceView/RaceView.web", () => jest.fn(() => <race-view-mock />));

jest.mock("../components/PlayerView/view/PlayerView.web", () =>
  jest.fn(() => <player-view-mock data-testid="player-view-mock" />),
);

function resolveRoute(route) {
  const routes = buildRouter();

  return routes.resolve(route);
}

describe("router", () => {
  beforeEach(jest.clearAllMocks);

  describe("when the route is a generic page", () => {
    it("should return the generic page", async () => {
      const component = await resolveRoute({
        pathname: "ppb:tbd:view:generic",
        urn: "ppb:tbd:view:generic:potatoes",
      });

      const { container } = render(component);

      await waitFor(() => getByTestId(container, GENERIC_VIEW_TESTID));

      expect(ConnectedGenericView).toHaveBeenCalledWith(
        {
          urn: "ppb:tbd:view:generic:potatoes",
          component: GenericView,
          root: true,
          placeholder: GenericViewPlaceholder,
        },
        undefined,
      );
    });
  });

  describe("when the route is a sport page", () => {
    it("should return the generic page", async () => {
      const component = await resolveRoute({
        pathname: "ppb:tbd:view:sport",
        urn: "ppb:tbd:view:sport:1",
      });

      const { container } = render(component);

      await waitFor(() => getByTestId(container, GENERIC_VIEW_TESTID));

      expect(ConnectedGenericView).toHaveBeenCalledWith(
        { urn: "ppb:tbd:view:sport:1", component: GenericView, root: true, placeholder: GenericViewPlaceholder },
        undefined,
      );
    });
  });

  describe("when the route is a gaming page", () => {
    it("should return the generic page", async () => {
      const component = await resolveRoute({
        pathname: "ppb:tbd:view:gaming",
        urn: "ppb:tbd:view:gaming:1",
      });

      const { container } = render(component);

      await waitFor(() => getByTestId(container, GENERIC_VIEW_TESTID));

      expect(ConnectedGenericView).toHaveBeenCalledWith(
        { urn: "ppb:tbd:view:gaming:1", component: GenericView, root: true, placeholder: GenericViewPlaceholder },
        undefined,
      );
    });
  });

  describe("when the route is a settings page", () => {
    it("should return the settings page", async () => {
      const component = await resolveRoute({
        pathname: "ppb:tbd:view:settings",
        urn: "ppb:tbd:view:settings:settings",
      });

      const { container } = render(component);

      await waitFor(() => getByTestId(container, "generic-view"));

      expect(ConnectedGenericView).toHaveBeenCalledWith(
        {
          urn: "ppb:tbd:view:settings:settings",
          component: GenericView,
          root: true,
          placeholder: GenericViewPlaceholder,
        },
        undefined,
      );
    });
  });

  describe("when the route is an event", () => {
    it("should return the event view", async () => {
      const component = await resolveRoute({
        pathname: "ppb:tbd:view:event",
        urn: "ppb:tbd:view:event:1234",
      });

      const { container } = render(component);

      await waitFor(() => getByTestId(container, GENERIC_VIEW_TESTID));

      expect(ConnectedGenericView).toHaveBeenCalledWith(
        { urn: "ppb:tbd:view:event:1234", component: GenericView, root: true, placeholder: GenericViewPlaceholder },
        undefined,
      );
    });
  });

  describe("when the route is a market", () => {
    it("should return the market view", async () => {
      const component = await resolveRoute({
        pathname: "ppb:tbd:view:market",
        urn: "ppb:tbd:view:market:123",
      });

      const { container } = render(component);

      await waitFor(() => getByTestId(container, GENERIC_VIEW_TESTID));

      expect(ConnectedGenericView).toHaveBeenCalledWith(
        { urn: "ppb:tbd:view:market:123", component: GenericView, root: true, placeholder: GenericViewPlaceholder },
        undefined,
      );
    });
  });

  describe("when the route is for all markets", () => {
    it("should return the all markets view", async () => {
      const component = await resolveRoute({
        pathname: "ppb:tbd:view:allMarkets",
        urn: "ppb:tbd:view:allMarkets:1234",
      });

      render(component);
      expect(ConnectedGenericView).toHaveBeenCalledWith(
        {
          urn: "ppb:tbd:view:allMarkets:1234",
          component: GenericView,
          root: true,
          placeholder: GenericViewPlaceholder,
        },
        undefined,
      );
    });
  });

  describe("when the route is a coupon page", () => {
    it("should return the generic page", async () => {
      const component = await resolveRoute({
        pathname: "ppb:tbd:view:generic:coupon",
        urn: "ppb:tbd:view:generic:coupon:1234",
      });

      const { container } = render(component);

      await waitFor(() => getByTestId(container, GENERIC_VIEW_TESTID));

      expect(ConnectedGenericView).toHaveBeenCalledWith(
        {
          urn: "ppb:tbd:view:generic:coupon:1234",
          component: GenericView,
          root: true,
          placeholder: GenericViewPlaceholder,
        },
        undefined,
      );
    });
  });

  describe("when the route is a coupons by day page", () => {
    it("should return the generic page", async () => {
      const component = await resolveRoute({
        pathname: "ppb:tbd:view:generic:couponsByDay",
        urn: "ppb:tbd:view:generic:couponsByDay:abc123/s/1?=d=tyu456",
      });

      const { container } = render(component);

      await waitFor(() => getByTestId(container, GENERIC_VIEW_TESTID));

      expect(ConnectedGenericView).toHaveBeenCalledWith(
        {
          urn: "ppb:tbd:view:generic:couponsByDay:abc123/s/1?=d=tyu456",
          component: GenericView,
          root: true,
          placeholder: GenericViewPlaceholder,
        },
        undefined,
      );
    });
  });

  describe("when the route is /sport/allCompetitions:id", () => {
    it("should return the all competitions page view", async () => {
      const component = await resolveRoute({
        pathname: "ppb:tbd:view:allCompetitions",
        urn: "ppb:tbd:view:allCompetitions:1",
      });

      const { container } = render(component);

      await waitFor(() => getByTestId(container, GENERIC_VIEW_TESTID));

      expect(ConnectedGenericView).toHaveBeenCalledWith(
        {
          urn: "ppb:tbd:view:allCompetitions:1",
          component: GenericView,
          root: true,
          placeholder: GenericViewPlaceholder,
        },
        undefined,
      );
    });
  });

  describe("when the route is /football/competition/:id", () => {
    it("should return competition page view", async () => {
      const component = await resolveRoute({
        pathname: "ppb:tbd:view:competition",
        urn: "ppb:tbd:view:competition:12345",
      });
      render(component);
      expect(ConnectedGenericView).toHaveBeenCalledWith(
        {
          urn: "ppb:tbd:view:competition:12345",
          component: GenericView,
          root: true,
          placeholder: GenericViewPlaceholder,
        },
        undefined,
      );
    });
  });

  describe("when the route is /casino/category/gamingCategory:slots", () => {
    it("should return the connected gaming category page", async () => {
      const component = await resolveRoute({
        pathname: "ppb:tbd:view:gamingCategory",
        urn: "ppb:tbd:view:gamingCategory:slots",
      });
      const { container } = render(component);

      await waitFor(() => getByTestId(container, "generic-view"));

      expect(ConnectedGenericView).toHaveBeenCalledWith(
        {
          urn: "ppb:tbd:view:gamingCategory:slots",
          component: GenericView,
          root: true,
          placeholder: GenericViewPlaceholder,
        },
        undefined,
      );
    });
  });

  describe("when the route is /betting/horse-racing/meeting-name/race:id", () => {
    it("should return the connected racing page with the metadata", async () => {
      const component = await resolveRoute({
        pathname: "ppb:tbd:view:race",
        urn: "ppb:tbd:view:race:id",
      });

      const { container } = render(component);

      await waitFor(() => getByTestId(container, "race-view"));

      expect(ConnectedRaceView).toHaveBeenCalledWith({ urn: "ppb:tbd:view:race:id", component: RaceView }, undefined);
      expect(ConnectedRaceView).toHaveBeenCalledTimes(1);
    });
  });

  describe("when the route is /betting/casino/promotions:1", () => {
    it("should return the generic page", async () => {
      const component = await resolveRoute({
        pathname: "ppb:tbd:view:promotions",
        urn: "ppb:tbd:view:promotions:1",
      });

      const { container } = render(component);

      await waitFor(() => getByTestId(container, GENERIC_VIEW_TESTID));

      expect(ConnectedGenericView).toHaveBeenCalledWith(
        {
          urn: "ppb:tbd:view:promotions:1",
          component: GenericView,
          root: true,
          placeholder: GenericViewPlaceholder,
        },
        undefined,
      );
    });
  });

  describe("when the route is /betting/casino/p/segmentation-item-uid:12345", () => {
    it("should return the generic page", async () => {
      const component = await resolveRoute({
        pathname: "ppb:tbd:view:gamingSegmentation",
        urn: "ppb:tbd:view:gamingSegmentation:1",
      });

      const { container } = render(component);

      await waitFor(() => getByTestId(container, GENERIC_VIEW_TESTID));

      expect(ConnectedGenericView).toHaveBeenCalledWith(
        {
          urn: "ppb:tbd:view:gamingSegmentation:1",
          component: GenericView,
          root: true,
          placeholder: GenericViewPlaceholder,
        },
        undefined,
      );
    });
  });

  describe("when the route is invalid", () => {
    it("should return the Error Page with Page Not Found", async () => {
      const component = await resolveRoute("ppb:tbd:view:invalid:id");

      render(component);

      expect(ErrorPage).toHaveBeenCalledWith({ error: "Page Not Found" }, undefined);
      expect(global.console.error).toHaveBeenCalledWith(new Error("Route not found"));
    });
  });

  describe("when the route is /betting/view/maintenance:maintenance", () => {
    it("should return maintenance page view", async () => {
      const component = await resolveRoute({
        pathname: "ppb:tbd:view:maintenance",
        urn: "ppb:tbd:view:maintenance:maintenance",
      });

      render(component);

      await waitFor(() => expect(ConnectedMaintenancePage).toHaveBeenCalledTimes(1));

      expect(ConnectedMaintenancePage).toHaveBeenCalledWith(
        { urn: "ppb:tbd:view:maintenance:maintenance", component: MaintenancePage },
        undefined,
      );
    });
  });

  describe("when the route is /casino/game/dragons-luck-art/g-dragons-luck-art", () => {
    it("should return game info page view", async () => {
      const component = await resolveRoute({
        pathname: "ppb:tbd:view:game",
        urn: "ppb:tbd:view:game:dragons-luck-art",
      });
      const { container } = render(component);

      await waitFor(() => getByTestId(container, "game-info-page"));

      expect(ConnectedGameInfoPage).toHaveBeenCalledWith(
        { urn: "ppb:tbd:view:game:dragons-luck-art", component: GameInfoPage },
        undefined,
      );
    });
  });

  describe("when the route is /casino/promotions/gaming-promo/imsPromotion:gaming-promo", () => {
    it("should return promotion page view", async () => {
      const component = await resolveRoute({
        pathname: "ppb:tbd:view:imsPromotion",
        urn: "ppb:tbd:view:imsPromotion:promo",
      });
      const { container } = render(component);

      await waitFor(() => getByTestId(container, "promotional-modal-page"));

      expect(ConnectedImsPromotionModal).toHaveBeenCalledWith(
        { urn: "ppb:tbd:view:imsPromotion:promo", component: ImsPromotionModal },
        undefined,
      );
    });
  });

  describe("when the route is /browse/browse:browse", () => {
    it("should return the connected browse view", async () => {
      const component = await resolveRoute({
        pathname: "ppb:tbd:view:browse",
        urn: "ppb:tbd:view:browse:browse",
      });

      const { container } = render(component);

      await waitFor(() => getByTestId(container, "browse-switch-experience"));

      expect(ConnectedBrowseSwitchExperience).toHaveBeenCalledTimes(1);
      expect(ConnectedBrowseSwitchExperience).toHaveBeenCalledWith(
        {
          urn: "ppb:tbd:view:browse:browse",
          component: BrowseSwitchExperience,
        },
        undefined,
      );
    });
  });

  describe("when the route is for my bets", () => {
    it("should return the connected my bets page view", async () => {
      const component = await resolveRoute({
        pathname: "ppb:tbd:view:myBets",
        urn: "ppb:tbd:view:myBets:open",
      });

      const { container } = render(component);

      await waitFor(() => getByTestId(container, "my-bets-page"));

      expect(ConnectedMyBetsPage).toHaveBeenCalledWith(
        { urn: "ppb:tbd:view:myBets:open", component: MyBetsPage },
        undefined,
      );
    });
  });

  describe("when the route is for player view", () => {
    it("should return the connected player view page", async () => {
      const component = await resolveRoute({
        pathname: "ppb:tbd:view:player",
        urn: "ppb:tbd:view:player:12345",
      });

      const { container } = render(component);

      await waitFor(() => getByTestId(container, "player-view-mock"));

      expect(PlayerView).toHaveBeenCalledTimes(1);
    });
  });

  describe("when the route is for promotions hub", () => {
    it("should return the generic page", async () => {
      const component = await resolveRoute({
        pathname: "ppb:tbd:view:promotionsHub",
        urn: "ppb:tbd:view:promotionsHub:promotionsHub",
      });

      const { container } = render(component);

      await waitFor(() => getByTestId(container, GENERIC_VIEW_TESTID));

      expect(ConnectedGenericView).toHaveBeenCalledWith(
        {
          urn: "ppb:tbd:view:promotionsHub:promotionsHub",
          component: GenericView,
          root: true,
          placeholder: GenericViewPlaceholder,
        },
        undefined,
      );
    });
  });
});
