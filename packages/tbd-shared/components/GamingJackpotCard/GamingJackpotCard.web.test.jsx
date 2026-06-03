import "jest-dom/extend-expect";
import { render } from "@testing-library/react";
import { JackpotMerchandise } from "./snowflakes/JackpotMerchandise/JackpotMerchandise.web";
import { currencyFormatWithDecimalPlaces } from "../../formatters/currency-formatters";
import GamingJackpotCard from "./GamingJackpotCard.web";

const mockTaggingService = {
  hasFired: jest.fn(() => false),
  markFired: jest.fn(),
  clear: jest.fn(),
};

jest.mock("./snowflakes/JackpotMerchandise/JackpotMerchandise.web", () => ({
  JackpotMerchandise: jest.fn(({ children }) => <jackpot-merchandise-mock>{children}</jackpot-merchandise-mock>),
}));

jest.mock("../../formatters/currency-formatters", () => ({
  currencyFormatWithDecimalPlaces: jest.fn(),
}));

// Mock useVisibilityObserver to immediately trigger onFirstShow callback
let capturedOnFirstShow = null;
jest.mock("../../hooks/useVisibilityObserver.web", () => ({
  useVisibilityObserver: jest.fn(({ onFirstShow }) => {
    capturedOnFirstShow = onFirstShow;
    return {
      observe: jest.fn(() => {
        // Simulate immediate visibility by calling onFirstShow
        if (capturedOnFirstShow) {
          capturedOnFirstShow();
        }
      }),
      visibility: {},
    };
  }),
}));

const dispatchJackpotMerchandiseView = jest.fn();

function renderGamingJackpotCard({ state, logoUrl, items, taggingService }) {
  const userDetails = {
    countryCode: "countryCode",
    currencyCode: "currencyCode",
    localeCode: "localeCode",
  };

  return render(
    <GamingJackpotCard
      state={state}
      logoUrl={logoUrl}
      items={items}
      userDetails={userDetails}
      urn="fakeUrn"
      name="fakeName"
      dispatchSubscribeJackpot={jest.fn()}
      dispatchUnsubscribeJackpot={jest.fn()}
      dispatchJackpotMerchandiseView={dispatchJackpotMerchandiseView}
      taggingService={taggingService || mockTaggingService}
    />,
  );
}

const jackpotMerchandiseMock = {
  state: "COLD",
  logoUrl: "logo",
  items: [
    {
      title: "Jackpot 1",
      value: "currencySymbol10.00",
      description: "text",
      state: "COLD",
      progress: undefined,
      userDetails: {
        countryCode: "countryCode",
        currencyCode: "currencyCode",
        localeCode: "localeCode",
      },
    },
    {
      title: "Jackpot 2",
      value: "currencySymbol10.00",
      description: "text",
      state: "HOT",
      progress: 70,
      userDetails: {
        countryCode: "countryCode",
        currencyCode: "currencyCode",
        localeCode: "localeCode",
      },
    },
    {
      title: "Jackpot 3",
      value: "currencySymbol10.00",
      description: "text",
      state: "COLD",
      progress: undefined,
      userDetails: {
        countryCode: "countryCode",
        currencyCode: "currencyCode",
        localeCode: "localeCode",
      },
    },
  ],
};

const jackpotMerchandiseMock2 = {
  state: "COLD",
  logoUrl: "logo",
  items: [
    {
      title: "Jackpot 1",
      value: "20",
      description: "text",
      state: "COLD",
      progress: undefined,
      userDetails: {
        countryCode: "countryCode",
        currencyCode: "currencyCode",
        localeCode: "localeCode",
      },
    },
    {
      title: "Jackpot 2",
      value: "2",
      description: "text",
      state: "HOT",
      progress: 70,
      userDetails: {
        countryCode: "countryCode",
        currencyCode: "currencyCode",
        localeCode: "localeCode",
      },
    },
    {
      title: "Jackpot 3",
      value: "0",
      description: "text",
      state: "COLD",
      progress: undefined,
      userDetails: {
        countryCode: "countryCode",
        currencyCode: "currencyCode",
        localeCode: "localeCode",
      },
    },
  ],
};

const jackpotMerchandiseOneItemsMock = {
  state: "COLD",
  logoUrl: "logo",
  items: [
    {
      title: "Jackpot 3",
      value: "0",
      description: "text",
      state: "COLD",
      progress: undefined,
      userDetails: {
        countryCode: "countryCode",
        currencyCode: "currencyCode",
        localeCode: "localeCode",
      },
    },
  ],
};

describe("GamingJackpotCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    capturedOnFirstShow = null;
    mockTaggingService.hasFired.mockReturnValue(false);
  });

  it("should render an empty component", () => {
    currencyFormatWithDecimalPlaces.mockReturnValue("currencySymbol10.00");
    renderGamingJackpotCard(jackpotMerchandiseOneItemsMock);
    expect(JackpotMerchandise).toHaveBeenCalledTimes(0);
  });

  it("should render the JackpotMerchandise component", () => {
    currencyFormatWithDecimalPlaces.mockReturnValue("currencySymbol10.00");
    renderGamingJackpotCard(jackpotMerchandiseMock);
    expect(JackpotMerchandise).toHaveBeenCalledWith(jackpotMerchandiseMock, undefined);
  });

  it("should call currencyFormatWithDecimalPlaces with the correct values", () => {
    currencyFormatWithDecimalPlaces.mockReturnValue("currencySymbol10.00");
    renderGamingJackpotCard(jackpotMerchandiseMock2);
    expect(currencyFormatWithDecimalPlaces).toHaveBeenNthCalledWith(1, {
      countryCode: "countryCode",
      currencyCode: "currencyCode",
      localeCode: "localeCode",
      decimalPlaces: 2,
      value: 14,
    });
    expect(currencyFormatWithDecimalPlaces).toHaveBeenNthCalledWith(2, {
      countryCode: "countryCode",
      currencyCode: "currencyCode",
      localeCode: "localeCode",
      decimalPlaces: 2,
      value: 0,
    });
    expect(currencyFormatWithDecimalPlaces).toHaveBeenNthCalledWith(3, {
      countryCode: "countryCode",
      currencyCode: "currencyCode",
      localeCode: "localeCode",
      decimalPlaces: 2,
      value: 0,
    });
  });

  it("should call dispatchJackpotMerchandiseView with the correct values", () => {
    renderGamingJackpotCard(jackpotMerchandiseMock2);
    expect(dispatchJackpotMerchandiseView).toHaveBeenNthCalledWith(
      1,
      "COLD",
      "fakeName",
      "fakeUrn",
      "Jackpot 1, Jackpot 2, Jackpot 3",
    );
  });
});
