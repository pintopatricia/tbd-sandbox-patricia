import { LoopClientFactory } from "@flutter-global/loop-client-javascript-sdk/dist/esm/client";
import { SimpleExposureLogger } from "@flutter-global/loop-client-javascript-sdk/dist/esm/exposure";
import { ExposureDeduplicator } from "@flutter-global/loop-client-javascript-sdk/dist/esm/exposure/deduplication/deduplication";
import { BrowserCacheAdapter } from "@flutter-global/loop-client-javascript-sdk/dist/esm/exposure/deduplication/adapters/browserCacheAdapter";
import { StaticExperimentsProvider } from "@flutter-global/loop-client-javascript-sdk/dist/esm/experiments";
import { getHttpClientsConfig } from "@ppb/tbd-store/services/client-factory";
import { createLoopClient } from "./loop-client-factory";

jest.mock("@flutter-global/loop-client-javascript-sdk/dist/esm/client", () => ({
  LoopClientFactory: jest.fn().mockImplementation(() => ({
    createLoopClientWithExperiments: jest.fn(),
  })),
}));

jest.mock("@flutter-global/loop-client-javascript-sdk/dist/esm/experiments", () => ({
  StaticExperimentsProvider: jest
    .fn()
    .mockImplementation(() => ({ StaticExperimentsProvider: "mock", experiments: { experiments: EXPERIMENTS_MOCK } })),
}));

jest.mock("@flutter-global/loop-client-javascript-sdk/dist/esm/exposure", () => ({
  SimpleExposureLogger: jest.fn().mockImplementation(() => ({ SimpleExposureLogger: "mock" })),
}));

jest.mock(
  "@flutter-global/loop-client-javascript-sdk/dist/esm/exposure/deduplication/adapters/browserCacheAdapter",
  () => ({
    BrowserCacheAdapter: jest.fn().mockImplementation(() => ({ BrowserCacheAdapter: "mock" })),
  }),
);

jest.mock("@flutter-global/loop-client-javascript-sdk/dist/esm/exposure/deduplication/deduplication", () => ({
  ExposureDeduplicator: jest.fn().mockImplementation(() => ({ ExposureDeduplicator: "mock" })),
}));

jest.mock("@ppb/tbd-store/services/client-factory", () => ({
  getHttpClientsConfig: jest.fn(() => ({
    ENDPOINTS: {
      LPS: "https://lps.mock.com",
    },
  })),
}));

const CLIENT_IDENTIFIER_MOCK = "someClientIdentifier";
const EXPERIMENTS_MOCK = [
  {
    id: "A",
  },
  {
    id: "B",
  },
];
const LOOP_CONTEXT_MOCK = {
  some: "context",
};

describe("createLoopClient", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return client with app and params configuration", () => {
    const createLoopClientWithExperimentsSpy = jest.fn().mockReturnValue({ LoopClient: "mock" });
    LoopClientFactory.mockImplementation(() => ({
      createLoopClientWithExperiments: createLoopClientWithExperimentsSpy,
    }));

    const client = createLoopClient(CLIENT_IDENTIFIER_MOCK, EXPERIMENTS_MOCK, LOOP_CONTEXT_MOCK);

    expect(getHttpClientsConfig).toHaveBeenCalledTimes(1);

    expect(BrowserCacheAdapter).toHaveBeenCalledTimes(1);
    expect(BrowserCacheAdapter).toHaveBeenCalledWith(1000);

    expect(ExposureDeduplicator).toHaveBeenCalledTimes(1);
    expect(ExposureDeduplicator).toHaveBeenCalledWith({ BrowserCacheAdapter: "mock" });

    expect(SimpleExposureLogger).toHaveBeenCalledWith(new URL("https://lps.mock.com/"), {
      ExposureDeduplicator: "mock",
    });
    expect(SimpleExposureLogger).toHaveBeenCalledTimes(1);

    expect(StaticExperimentsProvider).toHaveBeenCalledWith({ experiments: EXPERIMENTS_MOCK });
    expect(StaticExperimentsProvider).toHaveBeenCalledTimes(1);
    expect(LoopClientFactory).toHaveBeenCalledWith(
      "someClientIdentifier",
      {
        StaticExperimentsProvider: "mock",
        experiments: {
          experiments: EXPERIMENTS_MOCK,
        },
      },
      {
        SimpleExposureLogger: "mock",
      },
    );
    expect(LoopClientFactory).toHaveBeenCalledTimes(1);
    expect(createLoopClientWithExperimentsSpy).toHaveBeenCalledWith(LOOP_CONTEXT_MOCK, {
      experiments: EXPERIMENTS_MOCK,
    });
    expect(createLoopClientWithExperimentsSpy).toHaveBeenCalledTimes(1);

    expect(client).toStrictEqual({ LoopClient: "mock" });
  });
});
