import { render } from "@testing-library/react";
import "jest-dom/extend-expect";

import { useVisibilityObserver } from "../../hooks/useVisibilityObserver.web";
import ConnectCouponExchange from "../CouponExchange";
import CouponExchange from "../CouponExchange/CouponExchange.web";
import ConnectCouponSportsbook from "../CouponSportsbook";
import CouponSportsbook from "../CouponSportsbook/CouponSportsbook.web";
import ConnectedCard from "../Card";
import Card from "../Card/Card.web";
import ConnectedCouponHeaderCard from "../CouponHeaderCard";
import CouponHeaderCard from "../CouponHeaderCard/CouponHeaderCard.web";
import CouponPlaceholder from "../Coupon/CouponPlaceholder.web";
import CouponHeaderCardPlaceholder from "../CouponHeaderCard/CouponHeaderCardPlaceholder.web";
import CouponList from "./CouponList.web";

jest.mock("@ppb/the-wall-web", () => ({
  Card: jest.fn((props) => <the-wall-card {...props} />),
  Divider: jest.fn(() => <divider-mock />),
}));

jest.mock("@ppb/the-wall-icons", () => ({
  SystemIconName: jest.fn(() => <system-icon-name />),
}));

jest.mock("../CouponExchange", () => jest.fn((props) => <connect-coupon-exchange {...props} />));
jest.mock("../CouponExchange/CouponExchange.web", () => jest.fn(() => <coupon-exchange-mock />));
jest.mock("../CouponSportsbook", () => jest.fn((props) => <connect-coupon-sportsbook {...props} />));
jest.mock("../CouponSportsbook/CouponSportsbook.web", () => jest.fn(() => <coupon-sportsbook-mock />));
jest.mock("../Card", () => jest.fn((props) => <connected-card {...props} />));
jest.mock("../Card/Card.web", () => jest.fn(() => <card-mock />));
jest.mock("../CouponHeaderCard", () => jest.fn((props) => <connected-coupon-header-card {...props} />));
jest.mock("../CouponHeaderCard/CouponHeaderCard.web", () => jest.fn(() => <coupon-header-card-mock />));
jest.mock("../Coupon/CouponPlaceholder.web", () => jest.fn(() => <placeholder-mock />));
jest.mock("../CouponHeaderCard/CouponHeaderCardPlaceholder.web", () =>
  jest.fn(() => <coupon-header-card-placeholder-mock />),
);

const itemsToRender = [
  { urn: "ppb:excMarket:1.162031694", typename: "EventMarketCard" },
  { urn: "ppb:sbkMarket:924.201495349", typename: "EventMarketCard" },
  { urn: "ppb:couponHeaderCard:1", typename: "CouponHeaderCard" },
  { urn: "ppb:bet:1", typename: "CyclingCard" },
  {
    urn: "ppb:tbd:card:eventPrimaryMarket:31422047",
    typename: "EventMarketCard",
  },
  {
    urn: "ppb:tbd:card:eventPrimaryMarket:31421221",
    typename: "EventMarketCard",
  },
  {
    urn: "ppb:tbd:card:eventPrimaryMarket:31409944",
    typename: "EventMarketCard",
  },
  {
    urn: "ppb:tbd:card:eventPrimaryMarket:31421288",
    typename: "EventMarketCard",
  },
];

jest.mock("../../hooks/useVisibilityObserver.web", () => ({
  useVisibilityObserver: jest.fn(() => ({
    observe: jest.fn(),
    visibility: {},
  })),
}));

const dispatchFetchCardsMock = jest.fn();

function getCouponListComponentMock({
  items,
  product,
  dispatchFetchCards = jest.fn(),
  couponCardGroupUrn = "couponCardGroupUrn",
} = {}) {
  return (
    <CouponList
      items={items}
      product={product}
      dispatchFetchCards={dispatchFetchCards}
      couponCardGroupUrn={couponCardGroupUrn}
    />
  );
}

function renderCouponList(options) {
  return render(getCouponListComponentMock(options));
}

describe("CouponList component", () => {
  beforeEach(jest.clearAllMocks);

  it("should call useVisibilityObserver one time", () => {
    renderCouponList({
      items: itemsToRender,
      dispatchFetchCards: dispatchFetchCardsMock,
    });

    useVisibilityObserver.mock.calls[0][0].onFirstShow("randomUrn");

    expect(useVisibilityObserver).toHaveBeenCalledWith({
      onFirstShow: expect.any(Function),
    });
    expect(useVisibilityObserver).toHaveBeenCalledTimes(1);
  });

  it("should call dispatchFetchCards onFirstShow", () => {
    renderCouponList({
      items: itemsToRender,
      dispatchFetchCards: dispatchFetchCardsMock,
    });

    useVisibilityObserver.mock.calls[0][0].onFirstShow("randomUrn");

    expect(dispatchFetchCardsMock).toHaveBeenCalledWith("randomUrn", itemsToRender, 8);
  });

  it("should call ConnectCouponExchange for Exchange market", () => {
    renderCouponList({
      items: itemsToRender,
      product: "Exchange",
      dispatchFetchCards: dispatchFetchCardsMock,
    });

    expect(ConnectCouponExchange).toHaveBeenCalledTimes(6);
    expect(ConnectCouponExchange).toHaveBeenNthCalledWith(
      1,
      {
        urn: "ppb:excMarket:1.162031694",
        component: CouponExchange,
        placeholder: CouponPlaceholder,
        couponCardGroupUrn: "couponCardGroupUrn",
        visible: false,
      },
      undefined,
    );
    expect(ConnectCouponExchange).toHaveBeenNthCalledWith(
      6,
      {
        urn: "ppb:tbd:card:eventPrimaryMarket:31421288",
        component: CouponExchange,
        placeholder: CouponPlaceholder,
        couponCardGroupUrn: "couponCardGroupUrn",
        visible: false,
      },
      undefined,
    );
    expect(ConnectedCouponHeaderCard).toHaveBeenCalledTimes(1);
    expect(ConnectedCard).toHaveBeenCalledTimes(1);
  });

  it("should call ConnectCouponSportsbook for Sportsbook market", () => {
    renderCouponList({
      items: itemsToRender,
      product: "Sportsbook",
      dispatchFetchCards: dispatchFetchCardsMock,
    });

    expect(ConnectCouponSportsbook).toHaveBeenCalledTimes(6);
    expect(ConnectCouponSportsbook).toHaveBeenNthCalledWith(
      1,
      {
        urn: "ppb:excMarket:1.162031694",
        component: CouponSportsbook,
        placeholder: CouponPlaceholder,
        couponCardGroupUrn: "couponCardGroupUrn",
        visible: false,
      },
      undefined,
    );
  });

  it("should call ConnectedCouponHeaderCard for a CouponHeaderCard type", () => {
    const items = [{ urn: "ppb:couponHeaderCard:1", typename: "CouponHeaderCard" }];

    renderCouponList({
      items,
      product: "Exchange",
    });

    expect(ConnectedCouponHeaderCard).toHaveBeenCalledTimes(1);
    expect(ConnectedCouponHeaderCard).toHaveBeenCalledWith(
      {
        urn: "ppb:couponHeaderCard:1",
        component: CouponHeaderCard,
        product: "Exchange",
        placeholder: CouponHeaderCardPlaceholder,
        visible: false,
      },
      undefined,
    );
  });

  it("should call ConnectedCard for non Market or Headers", () => {
    const items = [1, 2, 3, 4].fill({ urn: "ppb:couponHeaderCard:1", typename: "Card" });

    renderCouponList({
      items,
      product: "Sportsbook",
    });

    expect(ConnectedCard).toHaveBeenCalledTimes(4);
    expect(ConnectedCard).toHaveBeenCalledWith(
      {
        urn: "ppb:couponHeaderCard:1",
        component: Card,
        typename: "Card",
      },
      undefined,
    );
  });
});
