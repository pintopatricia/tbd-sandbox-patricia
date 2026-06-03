import getManifest from "./manifest";
import { extractBasePathFromRequestUri } from "./helpers/base-path";
import getRoutingData from "./services/routing-data";
import { getCookiesToSet } from "./services/cookie-service";
import { buildContext } from "./context";

jest.mock("./config/environment.json", () => ({
  DOMAIN_EXTENSIONS: {
    INTERNATIONAL: "com",
    SPAIN: "es",
  },
}));

jest.mock("./config/environment-backend.json", () => ({
  KEY: "val",
}));

jest.mock("./services/cookie-service", () => ({
  getCookiesToSet: jest.fn(() => Promise.resolve([])),
}));

const getQueryParamsFromRequestMock = {
  product: "",
  loginStatus: "",
  exchangeEnabled: "",
  desktop: "",
  throttlesOn: "",
  throttlesOff: "",
};

jest.mock("./helpers/base-path", () => ({
  extractBasePathFromRequestUri: jest.fn(() => ({ base: "baseMock" })),
}));

jest.mock("./services/routing-data", () => jest.fn(() => "routerMock"));

jest.mock("./manifest", () => jest.fn(() => Promise.resolve("manifestMock")));

const USER_CONTEXT_MOCK = {
  localeCode: "localeCodeMock",
  loggedIn: false,
  countryCode: "BR",
};

async function setup() {
  buildContext(
    "$params",
    USER_CONTEXT_MOCK,
    "$headersMock",
    "$cookiesMock",
    "$localStorageMock",
    "localeCodeMock",
    "requestUriMock",
    getQueryParamsFromRequestMock,
  );
}

describe("buildContext", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should call the respective services", async () => {
    await setup();

    expect(await getManifest).toHaveBeenCalledWith("$localStorageMock");

    expect(extractBasePathFromRequestUri).toHaveBeenCalledWith("requestUriMock");
    expect(getRoutingData).toHaveBeenCalledWith("baseMock", "requestUriMock", getQueryParamsFromRequestMock);
    expect(await getCookiesToSet).toHaveBeenCalledWith(
      "$headersMock",
      "$cookiesMock",
      "$params",
      USER_CONTEXT_MOCK,
      "localeCodeMock",
      "routerMock",
    );
  });
});
