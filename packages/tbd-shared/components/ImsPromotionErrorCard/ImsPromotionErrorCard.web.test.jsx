import "jest-dom/extend-expect";
import { render } from "@testing-library/react";
import { AlertType } from "@ppb/the-wall-common/types";
import ImsPromotionErrorCard from "./ImsPromotionErrorCard.web";
import { PromoMessageCard } from "./snowflakes/PromoMessageCard/PromoMessageCard.web";

jest.mock("./snowflakes/PromoMessageCard/PromoMessageCard.web", () => ({
  PromoMessageCard: jest.fn(() => <rich-text-mock />),
}));

function setup() {
  const title = "Title";
  const body = "Body";
  const type = AlertType.Error;
  const i18n = {
    seeAllLabel: "See All Our Promotions",
    seeAllInfo: "Not to worry, you can tap the button below to view all eligible promotions:",
    recommended: "Time for something different? We think you'd like these selected games:",
  };
  const onClick = () => {};
  const dispatchProps = {
    dispatchPushAction: jest.fn(),
    dispatchSawPromotionError: jest.fn(),
    dispatchNavigateToSeeAllPromotions: jest.fn(),
  };
  return render(
    <ImsPromotionErrorCard
      title={title}
      body={body}
      type={type}
      i18n={i18n}
      seeAllLink={onClick}
      dispatchPushAction={dispatchProps.dispatchPushAction}
      dispatchSawPromotionError={dispatchProps.dispatchSawPromotionError}
      dispatchNavigateToSeeAllPromotions={dispatchProps.dispatchNavigateToSeeAllPromotions}
    />,
  );
}

describe("ImsPromotionErrorCard component", () => {
  beforeEach(jest.clearAllMocks);

  describe("when initializing the component", () => {
    it("should initialize PromoMessageCard component with the correct props", () => {
      setup();

      expect(PromoMessageCard).toHaveBeenCalledWith(
        {
          title: "Title",
          body: "Body",
          type: "ERROR",
          i18n: {
            seeAllLabel: "See All Our Promotions",
            seeAllInfo: "Not to worry, you can tap the button below to view all eligible promotions:",
            recommended: "Time for something different? We think you'd like these selected games:",
          },
          onSeeAll: expect.any(Function),
        },
        undefined,
      );
    });
  });
});
