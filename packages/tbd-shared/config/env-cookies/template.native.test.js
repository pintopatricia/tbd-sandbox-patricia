import { buildBaseCookieTemplates } from "./template.native";

describe("Cookie Templater", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-05-28T15:00:00.000Z"));
  });

  it("should create templates for all passed domains", () => {
    expect(buildBaseCookieTemplates([".betfair.com", "10.0.2.2"])).toEqual([
      {
        domain: ".betfair.com",
        expires: "2025-05-28T15:00:00.000Z",
        secure: true,
        url: "https://www.betfair.com",
      },
      {
        domain: "10.0.2.2",
        expires: "2025-05-28T15:00:00.000Z",
        secure: true,
        url: "https://10.0.2.2",
      },
    ]);
  });
});
