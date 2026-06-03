import { render } from "@testing-library/react-native";
import { Card as TheWallCard } from "@ppb/the-wall-native";
import { useNativeLazyLoading } from "../../hooks/useNativeLazyLoading.native";
import ConnectedCard from "../Card";
import Card from "../Card/Card.native";
import ConnectCouponExchange from "../CouponExchange";
import CouponExchange from "../CouponExchange/CouponExchange.native";
import ConnectCouponSportsbook from "../CouponSportsbook";
import CouponSportsbook from "../CouponSportsbook/CouponSportsbook.native";
import CouponPlaceholder from "../Coupon/CouponPlaceholder.native";
import ConnectedCouponHeaderCard from "../CouponHeaderCard";
import CouponHeaderCard from "../CouponHeaderCard/CouponHeaderCard.native";
import CouponHeaderCardPlaceholder from "../CouponHeaderCard/CouponHeaderCardPlaceholder.native";
import CouponList from "./CouponList.native";

jest.useFakeTimers();

jest.mock("@ppb/the-wall-native", () => ({
  Card: jest.fn((props) => <card-mock {...props} />),
  Divider: jest.fn(() => <divider-mock />),
}));

jest.mock("../CouponExchange", () => jest.fn((props) => <connect-coupon-exchange {...props} />));
jest.mock("../CouponExchange/CouponExchange.native", () => jest.fn(() => <coupon-exchange-mock />));
jest.mock("../CouponSportsbook", () => jest.fn((props) => <connect-coupon-sportsbook {...props} />));
jest.mock("../CouponSportsbook/CouponSportsbook.native", () => jest.fn(() => <coupon-sportsbook-mock />));
jest.mock("../Card", () => jest.fn((props) => <connected-card {...props} />));
jest.mock("../Card/Card.native", () => jest.fn(() => <card-mock />));
jest.mock("../CouponHeaderCard", () => jest.fn((props) => <connected-coupon-header-card {...props} />));
jest.mock("../CouponHeaderCard/CouponHeaderCard.native", () => jest.fn(() => <coupon-header-card-mock />));
jest.mock("../Coupon/CouponPlaceholder.native", () => jest.fn(() => <placeholder-mock />));
jest.mock("../CouponHeaderCard/CouponHeaderCardPlaceholder.native", () =>
  jest.fn(() => <coupon-header-card-placeholder-mock />),
);

const mockLazyLoadingNative = jest.fn();

jest.mock("../../hooks/useNativeLazyLoading.native", () => ({
  useNativeLazyLoading: jest.fn(() => ({
    current: mockLazyLoadingNative,
  })),
}));

const mockNavigate = jest.fn();
jest.mock("@ppb/tbd-router/native", () => ({ navigate: (viewLink) => mockNavigate(viewLink) }));

jest.mock("@ppb/the-wall-native/helpers/test-props", () => ({
  getTestProps: jest.fn().mockImplementation((props) => ({ testID: props })),
}));

jest.mock("@ppb/the-wall-native/helpers/flatlist-props", () => ({
  FLAT_LIST_DEFAULTS: {
    initialNumToRender: undefined,
    windowSize: undefined,
    maxToRenderPerBatch: undefined,
    removeClippedSubviews: undefined,
  },
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.mock("../../assets/images/spinner.gif", () => {
  jest.fn("fileMock");
});

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn(() => ["urn:parents:fake", "urn:parents:fake2"]),
}));

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
  {
    urn: "ppb:tbd:card:eventPrimaryMarket:31611529",
    typename: "EventMarketCard",
  },
  {
    urn: "ppb:tbd:card:eventPrimaryMarket:31615749",
    typename: "EventMarketCard",
  },
];

const dispatchFetchCardsMock = jest.fn();

function renderCouponList({
  items,
  product,
  dispatchFetchCards = jest.fn(),
  couponCardGroupUrn = "couponCardGroupUrn",
} = {}) {
  return render(
    <CouponList
      items={items}
      product={product}
      dispatchFetchCards={dispatchFetchCards}
      couponCardGroupUrn={couponCardGroupUrn}
    />,
  );
}

describe("CouponList component", () => {
  afterEach(jest.clearAllMocks);

  it("should call useNativeLazyLoading one time", () => {
    renderCouponList({
      items: itemsToRender,
      dispatchFetchCards: dispatchFetchCardsMock,
    });

    expect(useNativeLazyLoading).toHaveBeenCalledWith(itemsToRender, dispatchFetchCardsMock, 8);
    expect(useNativeLazyLoading).toHaveBeenCalledTimes(1);
  });

  it("should call ConnectCouponExchange for Exchange market", () => {
    renderCouponList({
      items: itemsToRender,
      product: "Exchange",
      dispatchFetchCards: dispatchFetchCardsMock,
    });

    expect(ConnectCouponExchange).toHaveBeenCalledTimes(8);
    expect(ConnectCouponExchange).toHaveBeenNthCalledWith(
      1,
      {
        urn: "ppb:excMarket:1.162031694",
        component: CouponExchange,
        placeholder: CouponPlaceholder,
        couponCardGroupUrn: "couponCardGroupUrn",
        visible: true,
      },
      undefined,
    );
    expect(ConnectCouponExchange).toHaveBeenNthCalledWith(
      8,
      {
        urn: "ppb:tbd:card:eventPrimaryMarket:31615749",
        component: CouponExchange,
        placeholder: CouponPlaceholder,
        couponCardGroupUrn: "couponCardGroupUrn",
        visible: true,
      },
      undefined,
    );
  });

  it("should call ConnectCouponSportsbook for Sportsbook market", () => {
    renderCouponList({
      items: itemsToRender,
      product: "Sportsbook",
      dispatchFetchCards: dispatchFetchCardsMock,
    });

    expect(ConnectCouponSportsbook).toHaveBeenCalledTimes(8);
    expect(ConnectCouponSportsbook).toHaveBeenNthCalledWith(
      1,
      {
        urn: "ppb:excMarket:1.162031694",
        component: CouponSportsbook,
        placeholder: CouponPlaceholder,
        couponCardGroupUrn: "couponCardGroupUrn",
        visible: true,
      },
      undefined,
    );
  });

  it("should call ConnectedCouponHeaderCard for a CouponHeaderCard type", () => {
    renderCouponList({
      items: [{ urn: "ppb:couponHeaderCard:1", typename: "CouponHeaderCard" }],
      product: "Exchange",
    });

    expect(ConnectedCouponHeaderCard).toHaveBeenCalledTimes(1);
    expect(ConnectedCouponHeaderCard).toHaveBeenCalledWith(
      {
        urn: "ppb:couponHeaderCard:1",
        component: CouponHeaderCard,
        product: "Exchange",
        placeholder: CouponHeaderCardPlaceholder,
        visible: true,
      },
      undefined,
    );
  });

  it("should call ConnectedCard for a non Market or Header type", () => {
    renderCouponList({
      items: [{ urn: "ppb:bet:1", typename: "CyclingCard" }],
    });

    expect(ConnectCouponExchange).not.toHaveBeenCalled();
    expect(ConnectCouponSportsbook).not.toHaveBeenCalled();
    expect(ConnectedCard).toHaveBeenCalledWith(
      { urn: "ppb:bet:1", typename: "CyclingCard", component: Card, visible: true },
      undefined,
    );
  });

  describe("when there is no items", () => {
    it("should not render the card", () => {
      renderCouponList({
        items: [],
      });

      expect(TheWallCard).not.toHaveBeenCalled();
    });
  });
});
